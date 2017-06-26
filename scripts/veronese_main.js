var currentSlide = 3;
var maxSlides = 5;
var SLIDESTATES = {
	NULL :		0 ,
	ACTIVE : 	1,
	MINIMIZED :	2,
	HIDDEN : 	3
};
var jsonContent = null;



function init() {
	var carousel = document.getElementById("box_carousel");
	if (!(data instanceof Array)) {
		alert("missing JSON data");
		return;
	}
	maxSlides = data.length;
	currentSlide = 1;
	for (var i=1; i<=maxSlides; i++) {
		
	}
	redrawCarousel();
}

function returnJSONdata(data) {
	jsonContent = data;
}


function redrawCarousel() {
	for (var i=1; i <= maxSlides; i++) {
		var number = ("0" + i).slice(-2); //padding of a leading zero
		var slide = document.getElementById("Slide"+number);
		var containerCSS = "";
		var childTitleCSS = "";
		var childContentCSS ="";
		var onClickAction = null;
		var state = SLIDESTATES.HIDDEN;

		if (i == currentSlide)										state = SLIDESTATES.ACTIVE;
		if ((i == (currentSlide-1)) || (i == (currentSlide+1)))		state = SLIDESTATES.MINIMIZED;
		if ((currentSlide == 1) && (i == (currentSlide+2)))			state = SLIDESTATES.MINIMIZED;
		if ((currentSlide == maxSlides) && (i == (currentSlide-2)))	state = SLIDESTATES.MINIMIZED;

		switch(state) {
			case SLIDESTATES.ACTIVE:
				containerCSS = "carousel_visible";
				childTitleCSS = "carousel_title_hidden";
				childContentCSS = "carousel_content_active";
				break;
			case SLIDESTATES.MINIMIZED:
				containerCSS = "carousel_minimized";
				childTitleCSS = "carousel_title_min";
				childContentCSS = "carousel_content_hidden";
				onClickAction = (i < currentSlide) ? prevSlide : nextSlide;
				break;
			case SLIDESTATES.HIDDEN:
				containerCSS = "carousel_hidden";
				childTitleCSS = "carousel_title_hidden";
				childContentCSS = "carousel_content_hidden";
				break;
		}
		containerCSS += " carousel";
		slide.className = containerCSS;
		slide.onclick = onClickAction;
		slide.children[0].className = childTitleCSS;
		slide.children[1].className = childContentCSS;
	}
}

function nextSlide() {
	if (currentSlide < maxSlides) {
		currentSlide++;
		redrawCarousel();
	}
}
function prevSlide() {
	if (currentSlide > 1) {
		currentSlide--;
		redrawCarousel();
	}
}


$(document).keydown(function(e) {
	//this function rotates the carousel
	switch(e.which) {
		case 37: // left
			if (currentSlide > 1) currentSlide--;
		break;
		case 39: // right
			if (currentSlide < maxSlides) currentSlide++;
		break;
		default: return; // exit this handler for other keys
	}
	redrawCarousel();
	e.preventDefault(); // prevent the default action (scroll / move caret)
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
				if(activeValues.indexOf(value) === -1){
					activeValues.push(value);
				}				
			} else {
				if(activeValues.indexOf(value) !== -1){
					activeValues.splice(activeValues.indexOf(value), 1);
				}
			}
		}
	);
	console.log(activeValues);
});