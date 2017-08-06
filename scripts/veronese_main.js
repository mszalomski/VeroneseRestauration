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
	
	hideTiles();

}

function hideTiles(){
	$("#tiles img").each(function() {
		$(this).animate({
			opacity:"0"
		}, 1000);
	});
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
	
	var leftButton = document.createElement("div");
	var leftArrow = document.createElement("img");
	leftButton.id = "leftButton";
	leftButton.onclick = prevSlide;
	leftButton.appendChild(leftArrow);
	leftArrow.src = "arrowLeft.png";
	leftArrow.className = "buttonArrow";
	leftArrow.id = "leftArrow";
	var rightButton = document.createElement("div");
	var rightArrow = document.createElement("img");
	rightButton.id = "rightButton";
	rightButton.onclick = nextSlide;
	rightButton.appendChild(rightArrow);
	rightArrow.src = "arrowRight.png";
	rightArrow.className = "buttonArrow";
	rightArrow.id = "rightArrow";
	document.body.appendChild(leftButton);
	document.body.appendChild(rightButton);
	
	var carousel = document.getElementById("box_carousel");
	maxSlides = jsonContent.length; //start numbering of slides beginning from 1
	largeSlideContainer = document.createElement("div");
	carousel.appendChild(largeSlideContainer);
	largeSlideContainer.id = "carouselLargeFrame";
	largeSlideContainer.style.height = "94vh";
	largeSlideContainer.style.width = (maxSlides * (92 + 4) + 4).toString() + "vw";
	largeSlideContainer.style.left = "0vw";
	largeSlideContainer.style.top = "0";
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
slide	<div id="Slide03" class="carousel">
-slideTitle //stays on top
-slideWrapper //wrapper to hide scrollbar
 -slideContainer //actual content
  -slideContainerImages
  -slideContainerText
				</div>*/
	var slide = document.createElement("div");
	var number = ("0" + dataobject.id).slice(-2); //padding of a leading zero
	slide.id = "Slide" + number;
	slide.className = "carouselSlide";
	
	var slideTitle = document.createElement("div");
	slideTitle.className = "carouselSlideTitle";
	var contentInfoTitle = document.createElement("h1");
	contentInfoTitle.textContent = dataobject.title;
	var slideWrapper = document.createElement("div");
	slideWrapper.className = "carouselSlideWrapper";
	var slideContainer = document.createElement("div");
	slideContainer.className = "carouselSlideContainer";
	
	largeSlideContainer.appendChild(slide);
	slide.appendChild(slideTitle);
	slide.appendChild(slideWrapper);
	slideTitle.appendChild(contentInfoTitle);
	slideWrapper.appendChild(slideContainer);
	
	var contentTable = document.createElement("table");
	contentTable.style.width = "100%";
	var firstRow = contentTable.insertRow();
	var imageColumn = firstRow.insertCell();
	imageColumn.style.width = "68%";
	var textColumn = firstRow.insertCell();
	textColumn.style.width = "32%";
	for (var i=0; i<dataobject.images.length; i++) {
		var emptyRow = contentTable.insertRow();
		var cell1 = emptyRow.insertCell();
		cell1.style.height = "5vh";
		var cell2 = emptyRow.insertCell();
		
		var row = contentTable.insertRow();
		var imageCell = row.insertCell();
		var imageElement = document.createElement("img");
		imageElement.src = "images/" + dataobject.images[i] + ".jpg";
		imageElement.id = "img"+("0" + i).slice(-2);
		imageElement.alt = dataobject.title;
		imageElement.className = "image_active";
		imageCell.appendChild(imageElement);
		imageCell.className = "image_cell";
		
		var textCell = row.insertCell();
		textCell.innerHTML = $.ajax({
			type: "GET",
			url: "content/" + dataobject.images[i] + ".html",
			async: false
		}).responseText;
	}
	var emptyRow = contentTable.insertRow();
	var cell1 = emptyRow.insertCell();
	cell1.style.height = "5vh";
	var cell2 = emptyRow.insertCell();
	slideContainer.appendChild(contentTable);
	
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
	if (currentSlide == 1) {
		var leftArrow = document.getElementById("leftArrow");
		var leftButton = document.getElementById("leftButton");
		leftArrow.style.display = "none";
		leftButton.style.cursor = "auto";
	}
	if (currentSlide == maxSlides) {
		var rightArrow = document.getElementById("rightArrow");
		var rightButton = document.getElementById("rightButton");
		rightArrow.style.display = "none";
		rightButton.style.cursor = "auto";
	}
	if ((currentSlide != 1) && (currentSlide != maxSlides)) {
		var rightArrow = document.getElementById("rightArrow");
		var rightButton = document.getElementById("rightButton");
		rightArrow.style.display = "initial";
		rightButton.style.cursor = "pointer";
		var leftArrow = document.getElementById("leftArrow");
		var leftButton = document.getElementById("leftButton");
		leftArrow.style.display = "initial";
		leftButton.style.cursor = "pointer";
	}
	largeSlideContainer.style.left = ( (currentSlide-1) * (-92 - 4)).toString() + "vw";
}

//move carousel to corresponding slide, if timeline-slider is moved
function updateCarousel(activeSlides) {
	//simple version, show the first item in the list. If List is empty, do not change anything
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

function toggleOverview() {
	var maindiv = document.getElementById("maindiv");
	if (overviewEnlarged) {
		overviewContainer.id = "overview_small";
		overviewEnlarged = false;
		maindiv.onclick = function() { return false; };
		largeSlideContainer.style.top = "0";
	} else {
		overviewContainer.id = "overview_large";
		overviewEnlarged = true;
		maindiv.onclick = toggleOverview;
		largeSlideContainer.style.top = "85vh";
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