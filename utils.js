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
				
				// Set 'active' id on the current page's link
				links.forEach(link => {
					// Compare the attribute directly, as it's relative in menu.html
					if (link.getAttribute('href') === activePageUrl) {
						link.id = 'active';
					}
				});
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
