var currentSlide = 3;
var maxSlides = 5;
var initialized = false;
var SLIDESTATES = {
	NULL :		0 ,
	ACTIVE : 	1,
	MINIMIZED :	2,
	HIDDEN : 	3
};
var jsonContent = null;
var currentImage = 0;
var maxImages = 1;
var slideshowContainer = null;
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
	redrawSlideshow();
}

function returnJSONdata(data) {
	jsonContent = data;
	initialized = true;
}

function createHTMLslide(carousel, dataobject) {
		/*
slideContainer	<div id="Slide03" class="carousel carousel_visible">
titleDiv			<div class="carousel_title_active"><p>Ich bin ein Titel</p></div>
contentDiv			<div class="carousel_content_active">
contentInfoTitle		<h1>Ich bin ein Titel</h1>
pictureWrapper			<div class="picture_wrapper">
pictureDiv					<div class="picture_slider">
								<img src="images/mockup1.jpg" class="thumbnail" />
								<img src="images/mockup1.jpg" class="thumbnail" />
								<img src="images/mockup1.jpg" class="thumbnail" />
								<img src="images/mockup1.jpg" class="thumbnail" />
								<img src="images/mockup1.jpg" class="thumbnail" />
							</div>
						</div>
contentInfoDiv			<div class="info_content">
contentInfoContent			<div><p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
							<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos </p>
							</div>
						</div>
					</div>
				</div>
		*/
	var slideContainer = document.createElement("div");
	var number = ("0" + dataobject.id).slice(-2); //padding of a leading zero
	slideContainer.id = "Slide" + number;
	
	var titleDiv = document.createElement("div");
	var titleP = document.createElement("p");
	titleP.textContent = dataobject.title;
	
	var contentDiv = document.createElement("div");
	var contentInfoDiv = document.createElement("div");
	contentInfoDiv.className = "info_content";
	var contentInfoTitle = document.createElement("h1");
	contentInfoTitle.textContent = dataobject.title;
	var contentInfoContent = document.createElement("div");
	contentInfoContent.innerHTML = $.ajax({
		type: "GET",
		url: "content/" + dataobject.content,
		async: false
	}).responseText;
	
	var pictureWrapper = document.createElement("div");
	var pictureDiv = document.createElement("div");
	pictureWrapper.className = "picture_wrapper";
	pictureDiv.className = "picture_slider";
	for (var i=0; i<dataobject.images.length; i++) {
		var imageElement = document.createElement("img");
		imageElement.src = "images/" + dataobject.images[i];
		imageElement.onclick = function() { openSlideshow(this);};
		imageElement.id = "img"+("0" + i).slice(-2);
		imageElement.alt = dataobject.title;
		imageElement.className = "image_active";
		pictureDiv.appendChild(imageElement);
	}
	
	carousel.appendChild(slideContainer);
	slideContainer.appendChild(titleDiv);
	titleDiv.appendChild(titleP);
	slideContainer.appendChild(contentDiv);
	contentDiv.appendChild(contentInfoTitle);
	contentDiv.appendChild(pictureWrapper);
	pictureWrapper.appendChild(pictureDiv);
	contentDiv.appendChild(contentInfoDiv);
	contentInfoDiv.appendChild(contentInfoContent);
	
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
				overviewImage.className = "overview_image_active";
				break;
			case SLIDESTATES.MINIMIZED:
				containerCSS = "carousel_minimized";
				childTitleCSS = "carousel_title_min";
				childContentCSS = "carousel_content_hidden";
				overviewImage.className = "overview_image_inactive";
				onClickAction = (i < currentSlide) ? prevSlide : nextSlide;
				break;
			case SLIDESTATES.HIDDEN:
				containerCSS = "carousel_hidden";
				childTitleCSS = "carousel_title_hidden";
				childContentCSS = "carousel_content_hidden";
				overviewImage.className = "overview_image_inactive";
				break;
		}
		containerCSS += " carousel";
		slide.className = containerCSS;
		slide.onclick = onClickAction;
		slide.children[0].className = childTitleCSS;
		slide.children[1].className = childContentCSS;
	}
	//activate Slideshow for that slide:
	var number = ("0" + currentSlide).slice(-2); //padding of a leading zero
	var slide = document.getElementById("Slide"+number);
	slideshowContainer = slide.children[1].children[1].children[0];
	currentImage = 0;
	maxImages = slideshowContainer.children.length;
	
	redrawSlideshow();
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