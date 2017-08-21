/**
 * This script handles creating of the timeline/tiles.
 * It also defines callback funtions for possible interactions with
 * created elements.
 * @author Marcin Szalomski
 */

/**
 * reads the data from data.json and creates movable timeslider
 * and static time bars.
 */
$.getJSON("data.json", function(json) {
	returnJSONdata(json);
	for(var i = 0; i < json.length; i++) {
		// time bars
		$("#disabled_sliders").append('<div id="timer_' +i +'" class="timer"></div>');
		var disabledSlider = $('#timer_' +i).dateRangeSlider({
			enabled: false,
			arrows: false,
			bounds:{
				min: new Date(2016, 0, 1),
				max: new Date(2017, 11, 31)
			},
			defaultValues:{
				min: new Date(json[i].start_time.split("-")[0], parseInt(json[i].start_time.split("-")[1]) - 1, json[i].start_time.split("-")[2]),
				max: new Date(json[i].end_time.split("-")[0], parseInt(json[i].end_time.split("-")[1]) - 1, json[i].end_time.split("-")[2])
			}
		});
		var childContainer = disabledSlider[0].childNodes[0];
		var bar = childContainer.getElementsByClassName("ui-rangeSlider-bar")[0];
		bar.id = (i+1);
		bar.innerHTML = json[i].title_short;
		bar.className += ' slider_bar';
		$('#bar_'+(i+1)).append(bar);	
	}
	// movable time slider
	$("#slider").dateRangeSlider(
	{
		arrows: false,
		bounds:{
			min: new Date(2016, 0, 1),
			max: new Date(2017, 11, 31)
		},
		defaultValues:{
			min: new Date(2016, 1, 10),
			max: new Date(2016, 2, 10)
		},
		formatter:function(val){
			var days = val.getDate(),
			  month = val.getMonth() + 1,
			  year = val.getFullYear();
			return days + "." + month + "." + year;
		},
		range:{
			min: {days: 30}
		}
	});
});

/**
 * adds touch events and callbacks for the time slider 
 * and time bars
 */
$(document).ready(function() {	 
	var click = false;
	// moving of the time slider
	$("#slider").bind("valuesChanging", function(e, data){
		var activeValues = [];
		jsonContent.forEach(
			function(value, i, array){
				var dFrom = value.start_time.split("-");
				var dTo = value.end_time.split("-");
				
				var dateFrom = new Date(dFrom[0], parseInt(dFrom[1])-1, dFrom[2]);
				var dateTo = new Date(dTo[0], parseInt(dTo[1])-1, dTo[2]);
				
				var checkMin = data.values.min;
				var checkMax = data.values.max;
				var midDate = new Date((checkMin.getTime() + checkMax.getTime()) / 2);
				
				// Check if date is in the time period
				if(midDate >= dateFrom && midDate <= dateTo){
					if(activeValues.indexOf(value.id) === -1){
						activeValues.push(value.id);
					}
				} else {
					if(activeValues.indexOf(value.id) !== -1){
						activeValues.splice(activeValues.indexOf(value.id), 1);
					}
				}
			}
		);			
		updateCarousel(activeValues);
	});
	// click / touchstart events for time bars
	// firefox makes problems at creating touch events for dynamically created elements
	if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
     	$(".bar").on("click touchstart", function(){ 
			var elemId = this.id;
			var id = elemId.substr(elemId.indexOf("_") + 1);
			var startTime = jsonContent[id - 1].start_time;
			setTimeSlider(startTime);
			currentSlide = parseInt(id);
			redrawCarousel();
		});
	} else {
		$(".bar .slider_bar").on("click touchstart", function(){ 
			var elemId = this.id;
			var id = elemId.substr(elemId.indexOf("_") + 1);
			var startTime = jsonContent[id - 1].start_time;
			setTimeSlider(startTime);
			currentSlide = parseInt(id);
			redrawCarousel();
		});
	}
	// mousedown / touchstart event on movable slider
	$('#slider').on('mousedown touchstart', function(){
		click = true;
		resizeTiles();
	});
	
	
	// moving the time slider
	$(document).on('mousemove touchmove', function(){
		if(click == false) 
			return;
		resizeTiles();
	});
	
	// mouseup / touchend event on movable slider
	$(document).on('mouseup touchend', function(){
		click = false;
		hideTiles();
	});
});

/**
 * Callback-function, called on mousedown touchstart / mousemove touchmove events
 * for the time slider.
 * Checks for active slides, adjusts the opacity and the size of shown tiles.
 */
function resizeTiles(){
	var dateValues = $("#slider").dateRangeSlider("values");
	var dataMin = dateValues.min;
	var dataMax = dateValues.max;
	var dataAvg = new Date((dataMin.getTime() + dataMax.getTime()) / 2);

	jsonContent.forEach(
		function(value, i, array){
			var dFrom = value.start_time.split("-");
			var dTo = value.end_time.split("-");
				
			var dateFrom = new Date(dFrom[0], parseInt(dFrom[1]) -1 , dFrom[2]);
			var dateTo = new Date(dTo[0], parseInt(dTo[1]) -1 , dTo[2]);
			var dateAvg = new Date((dateFrom.getTime() + dateTo.getTime()) / 2);

			if(dataAvg > dateAvg)
				var diffDays = Math.round((dataAvg-dateAvg)/(1000*60*60*24));
			if(dataAvg < dateAvg)
				var diffDays = Math.round((dateAvg-dataAvg)/(1000*60*60*24));
			if(dataAvg == dateAvg)
				var diffDays = Math.round((dateAvg-dataAvg)/(1000*60*60*24));

			var factor = 1 - (diffDays / 720);
			var heightString = (factor * 200).toString() +'px';			

			var id = '#tile_' +((i+1).toString());
			
			var opacityString = '1';
			if((i+1) > currentSlide + 3 || (i + 1) < currentSlide - 3)
				opacityString = '0';

			var grayFactor = (100 -(factor * 100));
			if((i+1) != currentSlide)
				grayFactor = ((100 -(factor * 100))*4)
			
			var grayString = grayFactor.toString() +'%';

			$(id).css({
				opacity: opacityString,
				height: heightString,
				"-webkit-filter": "grayscale("+grayString+")",
				"filter": "grayscale("+grayString+")"
			});
		}
	);
}
/**
 * Callback-function, called on mouseup / touchend events
 * for the time slider.
 * Hides all tiles.
 */
function hideTiles(){
	$("#tiles img").each(function(index, element) {
		$(element).animate({
			opacity: '0'
		}, 250);
	});	
}
/**
 * Function to assign the positions for the time bars.
 * Started at init.
 */
function assignTiles(){
	var tilesNr = $("#tiles img").length;
	var width = 100 / tilesNr;
	var n = Math.floor(width);
	var precision = width%n;

	$("#tiles img").each(function(index, element) {
		var left = index * (n + precision);
		$(element).css("width", n +'%');
		$(element).css("left", left +'%');
	});
}
/**
 * Callback-function, called on mouseup / touchend events
 * for time bars. Reads out the date from the time bar and
 * adjusts the movable slider. 
 * @param startTime		Date in the "yyyy-mm-dd" format
 */
function setTimeSlider(startTime){
	var dFrom = startTime.split("-");
	var dateBegin = new Date(dFrom[0], parseInt(dFrom[1])-1, dFrom[2]);
	dateBegin = dateBegin.addDays(10);
	var dateEnd = dateBegin.addDays(40);
	$("#slider").dateRangeSlider("values", dateBegin, dateEnd);
}
/**
 * Helper function to add days to a given Date-type object
 * @param days		Amount of days to add to the date
 *
 */
Date.prototype.addDays = function(days) {
	var dat = new Date(this.valueOf());
	dat.setDate(dat.getDate() + days);
	return dat;
}