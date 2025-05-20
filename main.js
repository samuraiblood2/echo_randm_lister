// Defines the path to the text file that contains the content to be loaded.
const CONTENT_FILE_PATH = "./index.txt";

// Main function, executed when the body of index.html loads.
function main() {
	// Fetches and displays the content from the specified file.
	fetchAndDisplayContent(CONTENT_FILE_PATH);
}

// Fetches content from the given file path and displays it using utility functions.
function fetchAndDisplayContent(filePath) {
	const httpRequest = new XMLHttpRequest();

	httpRequest.open("GET", filePath, true); // true for asynchronous
	httpRequest.responseType = "text";
	// withCredentials is not typically needed for local file requests but left for now.
	httpRequest.withCredentials = true;

	httpRequest.onreadystatechange = function() {
		// Check if the request is complete.
		if (httpRequest.readyState === XMLHttpRequest.DONE) {
			// Check if the request was successful (status 200).
			if (httpRequest.status === 200) {
				// Using appendToElement from utils.js
				appendToElement('text', httpRequest.responseText);
			} else {
				// Handle common errors like file not found.
				console.error(`Error fetching file: ${filePath}. Status: ${httpRequest.status}`);
				// Using appendToElement from utils.js to display the error message
				appendToElement('text', `<p class="error">Error: Could not load content from ${filePath}. Status: ${httpRequest.status}</p>`);
			}
		}
	};

	httpRequest.onerror = function() {
		// Handle network errors or other issues that prevent the request from completing.
		console.error(`Network error or issue fetching file: ${filePath}`);
		// Using appendToElement from utils.js to display the error message
		appendToElement('text', `<p class="error">Error: A network problem occurred while trying to load content from ${filePath}.</p>`);
	};

	httpRequest.send();
}

// Local displayContent function is removed as its functionality
// is replaced by appendToElement(elementId, htmlContent) from utils.js.
// The error logging for missing element is handled by getElement in utils.js.

