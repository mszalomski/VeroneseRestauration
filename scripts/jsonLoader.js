// JSON DATA
$.getJSON("data.json", function(json) {
	
	returnJSONdata(json);
	
	
	// Insert Timer Divs
	for(var i = 0; i < json.length; i++) {
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
		$("#bars").append(bar);	
	}
	
	// SLIDER
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

	// END SLIDER
	
// END JSON DATA
});

$(document).ready(function() {	 
	var click = false;
	
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
		
	$(".slider_bar").on("click touchstart", function(){ 
		var elemId = this.id;
		var id = elemId.substr(elemId.indexOf("_") + 1);
		var startTime = jsonContent[id - 1].start_time;
		setTimeSlider(startTime);
		currentSlide = parseInt(id);
		redrawCarousel();
	});

	// Mouse + Touch Functionality Tiles
	$('#slider').on('mousedown touchstart', function(){
		click = true;
		resizeTiles();
	});
	
	$(document).on('mousemove touchmove', function(){
		if(click == false) 
			return;
		resizeTiles();
	});

	$(document).on('mouseup touchend', function(){
		click = false;
		hideTiles();
	});
});

function resizeTiles(){
	$("#tiles img").each(function(index, element) {
		if((index + 1) == (currentSlide - 1) || (index + 1) == (currentSlide +1)){
			$(element).css({
				opacity: '1',
				height: '120px'
			});
		}
		else if((index + 1) == (currentSlide - 2) || (index + 1) == (currentSlide +2)){
			$(element).css({
				opacity: '1',
				height: '80px'
			});
		}
		else if((index + 1) == (currentSlide)){
			$(element).css({
				opacity: '1',
				height: '180px'
			});
		}
		else {
			$(element).css({
				opacity: '0',
				height: '180px'
			});
		}
	});
}

function hideTiles(){
	$("#tiles img").each(function(index, element) {
		$(element).animate({
			opacity: '0'
		}, 250);
	});	
}

function assignTiles(){
	var tilesNr = $("#tiles img").length;
	var width = 100 / tilesNr;
	
	$("#tiles img").each(function(index, element) {
		var left = index * width;
		$(element).css("width", width +'%');
		$(element).css("left", left +'%');
	});
}

function setTimeSlider(startTime){
	var dFrom = startTime.split("-");
	var dateBegin = new Date(dFrom[0], parseInt(dFrom[1])-1, dFrom[2]);
	dateBegin = dateBegin.addDays(10);
	var dateEnd = dateBegin.addDays(40);
	$("#slider").dateRangeSlider("values", dateBegin, dateEnd);
}

Date.prototype.addDays = function(days) {
	var dat = new Date(this.valueOf());
	dat.setDate(dat.getDate() + days);
	return dat;
}