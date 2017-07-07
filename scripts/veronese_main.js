var currentSlide = 3;
var maxSlides = 5;
var largeSlideContainer = null;
var initialized = false;
var jsonContent = null;
var overviewContainer = null;
var overviewEnlarged = false;

function init() {
	if (!initialized) {
		//wait until json loader is ready
		setTimeout(function() {
			prepareCarousel();
		}, 500);
	} else {
		prepareCarousel();
	}
}

function prepareCarousel() {
	if (!(jsonContent instanceof Array)) {
		alert("missing JSON data");
		console.log("JSON CANNOT BE LOADED, XMLhttp request blocked?");
		return;
	}
	overviewContainer = document.createElement("div");
	overviewContainer.id = "overview_small";
	overviewContainer.onclick = toggleOverview;
	document.body.appendChild(overviewContainer);
	
	var carousel = document.getElementById("box_carousel");
	maxSlides = jsonContent.length; //start numbering of slides beginning from 1
	largeSlideContainer = document.createElement("div");
	carousel.appendChild(largeSlideContainer);
	largeSlideContainer.style.height = "92vh";
	largeSlideContainer.style.width = (maxSlides * 92).toString() + "vw";
	largeSlideContainer.style.left = "4vw";
	largeSlideContainer.style.top = "0";
	largeSlideContainer.style.position = "fixed";
	largeSlideContainer.style.margin = 0;
	largeSlideContainer.style.padding = 0;
	largeSlideContainer.style.transition = "all .7s ease";
	currentSlide = 1;
	for (var i=1; i<=maxSlides; i++) {
		var dataobject = null;
		for (var j=0; j<maxSlides; j++) {
			//retrieve element from json array
			if (jsonContent[j].id == i) dataobject = jsonContent[j];
		}
		if (dataobject != null) createHTMLslide(carousel, dataobject);
	}
	redrawCarousel();
}

function returnJSONdata(data) {
	jsonContent = data;
	initialized = true;
}

function createHTMLslide(carousel, dataobject) {
		/*
slideContainer	<div id="Slide03" class="carousel">

				</div>
		*/
	var slideContainer = document.createElement("div");
	var number = ("0" + dataobject.id).slice(-2); //padding of a leading zero
	slideContainer.id = "Slide" + number;
	slideContainer.className = "carousel";
	largeSlideContainer.appendChild(slideContainer);
	
	var content = $.ajax({
		type: "GET",
		url: "content/" + dataobject.content,
		async: false
	}).responseText;
	slideContainer.innerHTML=content;
	
	var overviewImage = document.createElement("img");
	overviewImage.src = "images/overview/" + dataobject.overview;
	overviewImage.alt = "Gesamtansicht des Werkes";
	overviewImage.id = "overview"+("0" + dataobject.id).slice(-2);
	overviewImage.className = "overview_image_inactive";
	overviewContainer.appendChild(overviewImage);
}

function redrawCarousel() {
	for (var i=1; i <= maxSlides; i++) {
		var number = ("0" + i).slice(-2); //padding of a leading zero
		var slide = document.getElementById("Slide"+number);
		var overviewImage = document.getElementById("overview"+number);
		
		if (i == currentSlide) {
			overviewImage.className = "overview_image_active";
		} else {
			overviewImage.className = "overview_image_inactive";
		}
	}
	largeSlideContainer.style.left = ( (currentSlide-1) * (-92) + 4).toString() + "vw";
}

//move carousel to corresponding slide, if timeline-slider is moved
function updateCarousel(activeSlides) {
	//simple version, show the first item in the list. If List is empty, do not change anything
	if (!initialized) return;
	if (!(activeSlides instanceof Array)) return;
	if (activeSlides.length == 0) return;
	if (currentSlide != activeSlides[0]) {
		currentSlide = activeSlides[0];
		redrawCarousel();
	}
}

function nextSlide() {
	if (currentSlide < maxSlides) {
		currentSlide++;
		redrawCarousel();
		setTimeSlider(jsonContent[currentSlide-1].start_time);
	}
}
function prevSlide() {
	if (currentSlide > 1) {
		currentSlide--;
		redrawCarousel();
		setTimeSlider(jsonContent[currentSlide-1].start_time);
	}
}

//picture slideshow inside the carousel, move images
function redrawSlideshow() {
	for (var i = 0; i<maxImages; i++) {
		var imageElement = slideshowContainer.children[i];
		if (i == currentImage) {
			imageElement.className = "image_active";
			imageElement.onclick = function() { return false; };
		}
		if (i < currentImage) {
			imageElement.className = "image_left";
			imageElement.onclick = prevImage;
		}
		if (i > currentImage) {
			imageElement.className = "image_right";
			imageElement.onclick = nextImage;
		}
	}
}

function nextImage() {
	currentImage = (currentImage < (maxImages-1)) ? currentImage+1 : 0;
	redrawSlideshow();
}
function prevImage() {
	currentImage = (currentImage > 0) ? currentImage-1 : maxImages-1;
	redrawSlideshow();
}

function toggleOverview() {
	var maindiv = document.getElementById("maindiv");
	if (overviewEnlarged) {
		overviewContainer.id = "overview_small";
		overviewEnlarged = false;
		maindiv.onclick = function() { return false; };
	} else {
		overviewContainer.id = "overview_large";
		overviewEnlarged = true;
		maindiv.onclick = toggleOverview;
	}
}

//only for debugging, shall be replaced by gesture or buttons etc
$(document).keydown(function(e) {
	//this function rotates the carousel
	switch(e.which) {
		case 27: //es
			if (overviewEnlarged) toggleOverview();
			break;
		case 37: // left
			prevSlide();
			break;
		case 39: // right
			nextSlide()
			break;
		default: return; // exit this handler for other keys
	}
	e.preventDefault(); // prevent the default action (scroll / move caret)
});