// utils.js - Common utility functions

/**
 * Retrieves a DOM element by its ID.
 * Logs an error to the console if the element is not found.
 * @param {string} elementId - The ID of the element to retrieve.
 * @returns {HTMLElement|null} The DOM element if found, otherwise null.
 */
function getElement(elementId) {
	const element = document.getElementById(elementId);
	if (!element) {
		console.error(`Error: Element with ID '${elementId}' not found.`);
	}
	return element;
}

/**
 * Appends HTML content to the specified element.
 * @param {string} elementId - The ID of the element to append to.
 * @param {string} htmlContent - The HTML content to append.
 */
function appendToElement(elementId, htmlContent) {
	const element = getElement(elementId);
	if (element) {
		element.innerHTML += htmlContent;
	}
}

/**
 * Sets the innerHTML of the specified element.
 * @param {string} elementId - The ID of the element.
 * @param {string} htmlContent - The HTML content to set.
 */
function setElementHTML(elementId, htmlContent) {
	const element = getElement(elementId);
	if (element) {
		element.innerHTML = htmlContent;
	}
}

/**
 * Displays a formatted error message in the specified element.
 * The error message will be wrapped in a div with class "error".
 * @param {string} elementId - The ID of the element to display the error in.
 * @param {string} errorMessage - The error message to display.
 */
function displayError(elementId, errorMessage) {
	const errorHtml = `<div class="error">${errorMessage}</div>`;
	// Errors should typically replace content or be clearly separated.
	// Using appendToElement here to match previous behavior of local displayError functions.
	appendToElement(elementId, errorHtml);
}

/**
 * Clears the innerHTML of the specified element.
 * @param {string} elementId - The ID of the element to clear.
 */
function clearElement(elementId) {
	const element = getElement(elementId);
	if (element) {
		element.innerHTML = '';
	}
}

/**
 * Loads the navigation menu from menu.html into the element with ID 'nav-placeholder'
 * and sets the active link.
 * @param {string} activePageUrl - The URL of the current page (e.g., './index.html').
 */
function loadNavigationMenu(activePageUrl) {
	const navPlaceholder = getElement('nav-placeholder');
	if (!navPlaceholder) {
		console.error("Navigation placeholder 'nav-placeholder' not found.");
		return;
	}

	const xhr = new XMLHttpRequest();
	xhr.open('GET', 'menu.html', true);
	xhr.responseType = 'text';

	xhr.onreadystatechange = function() {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				navPlaceholder.innerHTML = xhr.responseText;
				
				// Find links within the newly loaded navigation menu
				const links = navPlaceholder.querySelectorAll('nav ul.navbar li a');
				
				// Remove 'active' id from any link that might already have it
				links.forEach(link => {
					if (link.id === 'active') {
						link.removeAttribute('id');
					}
				});
				
				// First, explicitly remove 'active' id from all links within the nav placeholder
				links.forEach(link => {
					link.removeAttribute('id'); // More robust than link.id = ''
				});
				
				// Then, set 'active' id on the matching link
				// activePageUrl (parameter) is the activePageHash (e.g., '#home', '#settings')
				let foundActive = false;
				links.forEach(link => {
					if (link.hash === activePageUrl) {
						link.id = 'active';
						foundActive = true;
					}
				});

				// Fallback for the root path if activePageUrl is '#home' and no link has exactly "#home"
				// This is often needed if the server serves index.html for '/' and link is <a href="/">Home</a>
				// However, our menu.html uses specific hashes like #home.
				// The call in index.html `loadNavigationMenu(window.location.hash || '#home')`
				// makes activePageUrl always have a value, typically '#home' for the root.
				if (!foundActive && activePageUrl === '#home') {
					// Attempt to find a link that points to index.html or is the conceptual "home" link
					// For our menu.html, a link with href="#home" should always exist.
					// This block might be redundant if menu.html always has a #home link.
				}
			} else {
				console.error(`Error fetching menu.html: Status ${xhr.status}`);
				navPlaceholder.innerHTML = '<p class="error">Error loading navigation menu.</p>';
			}
		}
	};

	xhr.onerror = function() {
		console.error('Network error while fetching menu.html.');
		navPlaceholder.innerHTML = '<p class="error">Network error loading navigation menu.</p>';
	};

	xhr.send();
}

/**
 * Creates and prepends a marquee element to the document body.
 * The marquee will have an ID 'motd-marquee-container' and class 'marquee-container'.
 * It will contain a child div with class 'marquee-content' with initial placeholder text.
 */
function loadMarquee() {
	if (!document.body) {
		console.error("Cannot load marquee: document.body is not available.");
		return;
	}

	// Create the main container for the marquee
	const marqueeContainer = document.createElement('div');
	marqueeContainer.id = 'motd-marquee-container';
	marqueeContainer.className = 'marquee-container';

	// Create the content div that will scroll or display text
	const marqueeContent = document.createElement('div');
	marqueeContent.className = 'marquee-content';
	marqueeContent.textContent = "Welcome to the Utilities Hub! More features coming soon!"; // Engaging placeholder text

	// Append the content to the container
	marqueeContainer.appendChild(marqueeContent);

	// Prepend the marquee container to the body
	document.body.prepend(marqueeContainer);

	// Update marquee display if the function is available
	if (typeof updateMarqueeDisplay === 'function') {
		updateMarqueeDisplay();
	}
}
