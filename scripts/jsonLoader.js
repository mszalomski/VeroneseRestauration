// JSON DATA
$.getJSON("data.json", function(json) {
	
	returnJSONdata(json);
	
	$("#querschliff_time").dateRangeSlider({
		enabled: false,
		arrows: false,
		bounds:{
			min: new Date(2016, 0, 1),
			max: new Date(2017, 11, 31)
		},
		defaultValues:{
			min: new Date(json[0].start_time.split("-")[0], parseInt(json[0].start_time.split("-")[1]) - 1, json[0].start_time.split("-")[2]),
			max: new Date(json[0].end_time.split("-")[0], parseInt(json[0].end_time.split("-")[1]) - 1, json[0].end_time.split("-")[2])
		}
	});
	$("#firnissabnahme_time").dateRangeSlider({
		enabled: false,
		arrows: false,
		bounds:{
			min: new Date(2016, 0, 1),
			max: new Date(2017, 11, 31)
		},
		defaultValues:{
			min: new Date(json[1].start_time.split("-")[0], parseInt(json[1].start_time.split("-")[1]) - 1, json[1].start_time.split("-")[2]),
			max: new Date(json[1].end_time.split("-")[0], parseInt(json[1].end_time.split("-")[1]) - 1, json[1].end_time.split("-")[2])
		}
	});
	$("#infrarot_time").dateRangeSlider({
		enabled: false,
		arrows: false,
		bounds:{
			min: new Date(2016, 0, 1),
			max: new Date(2017, 11, 31)
		},
		defaultValues:{
			min: new Date(json[2].start_time.split("-")[0], parseInt(json[2].start_time.split("-")[1]) - 1, json[2].start_time.split("-")[2]),
			max: new Date(json[2].end_time.split("-")[0], parseInt(json[2].end_time.split("-")[1]) - 1, json[2].end_time.split("-")[2])
		}
	});
	$("#roentgen_time").dateRangeSlider({
		enabled: false,
		arrows: false,
		bounds:{
			min: new Date(2016, 0, 1),
			max: new Date(2017, 11, 31)
		},
		defaultValues:{
			min: new Date(json[3].start_time.split("-")[0], parseInt(json[3].start_time.split("-")[1]) - 1, json[3].start_time.split("-")[2]),
			max: new Date(json[3].end_time.split("-")[0], parseInt(json[3].end_time.split("-")[1]) - 1, json[3].end_time.split("-")[2])
		}
	});
	$("#retusche_time").dateRangeSlider({
		enabled: false,
		arrows: false,
		bounds:{
			min: new Date(2016, 0, 1),
			max: new Date(2017, 11, 31)
		},
		defaultValues:{
			min: new Date(json[4].start_time.split("-")[0], parseInt(json[4].start_time.split("-")[1]) - 1, json[4].start_time.split("-")[2]),
			max: new Date(json[4].end_time.split("-")[0], parseInt(json[4].end_time.split("-")[1]) - 1, json[4].end_time.split("-")[2])
		}
	});
	
	
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
			max: new Date(2016, 1, 8)
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
	
	$("#slider").bind("valuesChanging", function(e, data){
		var activeValues = [];
		json.forEach(
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
	// END SLIDER
	
// END JSON DATA
});