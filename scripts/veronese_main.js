var currentSlide = 3;
var maxSlides = 5;

$(document).keydown(function(e) {
	switch(e.which) {
		case 37: // left
			if (currentSlide > 1) currentSlide--;
		break;
		case 39: // right
			if (currentSlide < maxSlides) currentSlide++;
		break;
		default: return; // exit this handler for other keys
	}
	for (var i=1; i <= maxSlides; i++) {
		var number = ("0" + i).slice(-2); //padding of a leading zero
		var slide = document.getElementById("Slide"+number);
		var cssClasses = "carousel_hidden";

		if (i == currentSlide) 		cssClasses = "carousel_visible";
		if (i == (currentSlide-1))	cssClasses = "carousel_minimized";
		if (i == (currentSlide+1))	cssClasses = "carousel_minimized";
		if (currentSlide == 1) {
			//if first slide is visible, no slide is minimized on the left
			if (i == (currentSlide+2))	cssClasses = "carousel_minimized";
		}
		if (currentSlide == maxSlides) {
			//if first slide is visible, no slide is minimized on the left
			if (i == (currentSlide-2))	cssClasses = "carousel_minimized";
		}
		cssClasses += " carousel";
		slide.className = cssClasses;
	}
	console.log("blubb");
	e.preventDefault(); // prevent the default action (scroll / move caret)
});