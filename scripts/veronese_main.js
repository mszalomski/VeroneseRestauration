/**
 * This script handles creating of canvas and 
 * all interaction except timeline
 * @author Robert Menger
 */

 
/**
 * stores the number of the actual visible information-slide in the main area
 */
var currentSlide = 3;

/**
 * how many slides are totally available? will be determined during loading of data.json
 * though jsonLoader.js, returning data to this script
 */
var maxSlides = 5;

/**
 * Pointer to the DOM-object, containing all slides
 * this object is much larger than actual screen width, to allow horizontal movement
 */
var largeSlideContainer = null;

/**
 * data.json is loaded asychrounously, this variable indicates, if data is already
 * cached
 */
var initialized = false;

/**
 * the actual data, loaded from data.json trough jsonLoader.js
 */
var jsonContent = null;

/**
 * Pointer to DOM-object containing the overview images in the upper right corner
 */
var overviewContainer = null;

/**
 * current state of the overview image, if its enlarge to full screen width or 
 * minimized to the upper corner
 */
var overviewEnlarged = false;

/**
 * stores the last time an mousewheel event was fired. Used to determine if page should flip back
 */
var mouseWheelLastTime = 0.0;

/**
 * as long as last mousewheel event is inside threshold, increment movement of largeContainer
 */
var horizontalMovement = 0;

/**
 * store reference to timeout, to clear it if next mousewheel event is inside threshold
 */
var timeoutHandle = null;

/**
 * mousewheel timeout threshold in milliseconds, after this time page flips back to default position
 */
var mouseWheelTimeout = 1000;

/**
 * will be called on body onLoad
 * draw the canvas after data is loaded and call timeline initializer afterwards
 */
function init() {
	if (!initialized) {
		//wait until json loader is ready
		setTimeout(function() {
			prepareCarousel();
		}, 500);
	} else {
		prepareCarousel();
	}
	assignTiles();
	
	var mainBox = document.getElementById("box_carousel");
	mainBox.addEventListener("touchstart", touchHandleStart, false);
	mainBox.addEventListener("touchmove", touchHandleMove, false);
	mainBox.addEventListener("touchend", touchHandleEnd, false);
	mainBox.addEventListener("touchcancel", touchHandleEnd, false);
}

/**
 * Callback function, to be called from jsonLoader.js after data.json has been read
 * and processed
 * @param data	array of stuctures that contains all information about the processes, including image paths and text
 */
function returnJSONdata(data) {
	jsonContent = data;
	initialized = true;
}

/**
 * create all elements of the application
 * There is one large DIV, which exceeds screen space by far, to enable horizontal scrolling
 * This largeContainer contains smaller DIV, from which everyone fits exactly screen width
 * every of this smaller DIV has vertical scrolling too
 */
function prepareCarousel() {
	if (!(jsonContent instanceof Array)) {
		alert("An error occured during loading of this application. data.json cannot be loaded, maybe the request was blocked by client or the file is missing or corrupted?");
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
		if (dataobject != null) createHTMLslide(dataobject);
	}
	redrawCarousel();
}

/**
 * subroutine of perpareCarousel()
 * gets called for every process/slide
 * Creates a DIV container inside the largeContainer, which is automatically positioned (float left) right to the last one.
 * Contains additional DIV containers for title and content, which itself is wrapped in another div to hide the scrollbar 
 * and allow invisible scrolling
 * @param dataobject	specific array element of the global jsonContent
 */
function createHTMLslide(dataobject) {
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
	slideContainer.appendChild(contentTable);
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
		var cellId = "c" + (dataobject.id * 100 + i);
		var cellUrl = "content/" + dataobject.images[i] + ".html";
		textCell.id = cellId;
		$("#"+cellId).load(cellUrl);
	}
	var emptyRow = contentTable.insertRow();
	var cell1 = emptyRow.insertCell();
	cell1.style.height = "5vh";
	var cell2 = emptyRow.insertCell();
	
	var overviewImage = document.createElement("img");
	overviewImage.src = "images/overview/" + dataobject.overview;
	overviewImage.alt = "Gesamtansicht des Werkes";
	overviewImage.id = "overview"+("0" + dataobject.id).slice(-2);
	overviewImage.className = "overview_image_inactive";
	overviewContainer.appendChild(overviewImage);
}

/**
 * gets called every time when a new slide should be shown
 * moves the largeContainer to appropriate position (animated by css) and
 * sets matching overview image to active
 * enables or disables the left and right scroll buttons
 */
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
		leftArrow.style.display = "none";
		var leftButton = document.getElementById("leftButton");
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

/**
 * Callback-function for jsonLoader.js
 * move to the given process
 * @param activeSlides	array of slide-numbers, only first item will be used
 */
function updateCarousel(activeSlides) {
	var newSlide = (Array.isArray(activeSlides) && (activeSlides[0] > 0) && (activeSlides[0] <= maxSlides)) ? activeSlides[0] : currentSlide;
	if (currentSlide != newSlide) {
		currentSlide = newSlide;
		redrawCarousel();
	}
}

/**
 * Callback function for the large button on the right side
 * update timeLine as well
 */
function nextSlide() {
	if (currentSlide < maxSlides) {
		currentSlide++;
		redrawCarousel();
		setTimeSlider(jsonContent[currentSlide-1].start_time);
	}
}

/**
 * Callback function for the large button on the left side
 * update timeline as well
 */
function prevSlide() {
	if (currentSlide > 1) {
		currentSlide--;
		redrawCarousel();
		setTimeSlider(jsonContent[currentSlide-1].start_time);
	}
}

/**
 * maximize or minimize the overview image, which is located in the upper right corner if minimized.
 * function gets called onClick on overview-Image or if clicked elsewhere while image is maximized
 */ 
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

/**
 * after a timeout, reset the largeContainer to default Position, if no mousewheel action occured
 * this method is called as callback from setTimeout
 */
function resetHorizontalScroll() {
	largeSlideContainer.style.left = ( (currentSlide-1) * (-92 - 4) ).toString() + "vw";
	mouseWheelLastTime = 0.0;
	horizontalMovement = 0;
}

/**
 * Callback-function, called on mousewheel event
 * use horizontal scroll of wheel for page flipping, tableTop like MS surface will send mousewheel event on drag of any kind
 * @param e		DOM event
 */
function scrollHorizontally(e) {
	e = window.event || e;
	if (e.wheelDeltaX == 0) return; //dont do anything if no horizontal scroll occured, because this routine gets called for every vertical scroll too
	
	if ((e.timeStamp - mouseWheelLastTime) < mouseWheelTimeout) {
		window.clearTimeout(timeoutHandle);
	}
	mouseWheelLastTime = e.timeStamp;
	horizontalMovement += e.wheelDeltaX;
	if (((currentSlide == 1) && (horizontalMovement > 0)) || ((currentSlide == maxSlides) && (horizontalMovement < 0))) {
		horizontalMovement = 0;
		resetHorizontalScroll();
	} else {
		//convert pixel to percent of screen width
		var horizontalRelMov = Math.round((horizontalMovement / window.innerWidth) * 100);
		if (horizontalRelMov < -40 || horizontalRelMov > 40) {
			mouseWheelLastTime = 0.0;
			horizontalMovement = 0;
			if (horizontalRelMov < 0) {
				nextSlide();
			} else {
				prevSlide();
			}
		}
		largeSlideContainer.style.left = ( (currentSlide-1) * (-92 - 4) + horizontalRelMov).toString() + "vw";
		timeoutHandle = window.setTimeout( resetHorizontalScroll, mouseWheelTimeout);
	}
}
// IE9, Chrome, Safari, Opera
window.addEventListener("mousewheel", scrollHorizontally, false);
// Firefox
window.addEventListener("DOMMouseScroll", scrollHorizontally, false);
//for android touch input


var start = {x:0,y:0};
var offset = {x:0,y:0};
var ignoreFurtherTouchInput = false; //as long as css scrolls website, ignore all touch inputs, because they are incorrect during animation

function touchHandleStart(e) {
	start.x = e.touches[0].pageX;
	start.y = e.touches[0].pageY;
	window.clearTimeout(timeoutHandle);
}
function touchHandleMove(e) {
	if (ignoreFurtherTouchInput) return;
	offset.x = start.x - e.touches[0].pageX;
	offset.y = start.y - e.touches[0].pageY;
	horizontalMovement = -offset.x;
	
	if (((currentSlide == 1) && (horizontalMovement > 0)) || ((currentSlide == maxSlides) && (horizontalMovement < 0))) {
		horizontalMovement = 0;
		resetHorizontalScroll();
	} else {
		//convert pixel to percent of screen width
		var horizontalRelMov = Math.round((horizontalMovement / window.innerWidth) * 100);
		if (horizontalRelMov < -40 || horizontalRelMov > 40) {
			horizontalMovement = 0;
			ignoreFurtherTouchInput = true;
			setTimeout(function() { ignoreFurtherTouchInput = false; }, 1000);
			if (horizontalRelMov < 0) {
				nextSlide();
			} else {
				prevSlide();
			}
			return;
		}
		largeSlideContainer.style.left = ( (currentSlide-1) * (-92 - 4) + horizontalRelMov).toString() + "vw";
	}
}
function touchHandleEnd(e) {
	start = {x:0,y:0};
	offset = {x:0,y:0};
	timeoutHandle = window.setTimeout( resetHorizontalScroll, mouseWheelTimeout);
}

