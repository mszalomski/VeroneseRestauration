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
			min: new Date(2016, 0, 1),
			max: new Date(2016, 0, 29)
		},
		formatter:function(val){
			var days = val.getDate(),
			  month = val.getMonth() + 1,
			  year = val.getFullYear();
			return days + "." + month + "." + year;
		},
		range:{
			min: {days: 7}
		}
	});

	// END SLIDER
	
// END JSON DATA
});

$(document).ready(function() {	 
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
				
				// Check if date is in the time period
				if(checkMax >= dateFrom && checkMax <= dateTo || checkMin >= dateFrom && checkMin <= dateTo){
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
	
	$(".slider_bar").on("click", function(){ 
		var elemId = this.id;
		var id = elemId.substr(elemId.indexOf("_") + 1);
		var startTime = jsonContent[id - 1].start_time;
		setTimeSlider(startTime);
		currentSlide = parseInt(id);
		redrawCarousel();
	});
	
});

function setTimeSlider(startTime){
	var dFrom = startTime.split("-");
	var dateBegin = new Date(dFrom[0], parseInt(dFrom[1])-1, dFrom[2]);
	var dateEnd = dateBegin.addDays(28);
	$("#slider").dateRangeSlider("values", dateBegin, dateEnd);
}

Date.prototype.addDays = function(days) {
	var dat = new Date(this.valueOf());
	dat.setDate(dat.getDate() + days);
	return dat;
}