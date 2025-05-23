// ==================================================================================
// DEPRECATED FILE: random_number.js
// ----------------------------------------------------------------------------------
// The functionality originally in this file has been refactored and integrated 
// into the Single Page Application (SPA) structure.
//
// Specifically, the "Random Number Generator" tool is now managed by:
// - RandomNumberView.js: Contains the class for rendering the view and handling its logic.
// - App.js: Handles routing to this view.
// - index.html: Includes RandomNumberView.js and defines the route.
//
// This file (random_number.js) is no longer used by the application and can be
// considered for removal in future cleanup efforts.
// ==================================================================================

/*
// Main function to generate and display random numbers.
function generateRandomNumbers() {
	// Clear any previous results from the display using utility function.
	clearElement('result');

	// Get and parse the 'from' and 'to' range values.
	const rangeFromInputElement = getElement('from');
	const rangeToInputElement = getElement('to');
	const amountInputElement = getElement('amount');

	// Ensure all elements were found before proceeding
	if (!rangeFromInputElement || !rangeToInputElement || !amountInputElement) {
		// Errors are logged by getElement, but we might want a user-facing error too.
		displayError('result', "Error: One or more input fields are missing in the HTML.");
		return;
	}

	const rangeFromValue = rangeFromInputElement.value;
	const rangeToValue = rangeToInputElement.value;
	const amountValue = amountInputElement.value;

	const rangeFrom = parseInt(rangeFromValue, 10);
	const rangeTo = parseInt(rangeToValue, 10);

	// Validate that range values are numbers.
	if (isNaN(rangeFrom) || isNaN(rangeTo)) {
		displayError('result', "Please enter valid numbers for the range.");
		return;
	}

	// Validate that 'from' value is less than 'to' value.
	if (rangeFrom >= rangeTo) {
		displayError('result', "The 'From' value must be less than the 'To' value.");
		return;
	}

	// Get and parse the 'amount' of random numbers to generate.
	const numberOfRandoms = parseInt(amountValue, 10);

	// Validate that the amount is a number.
	if (isNaN(numberOfRandoms)) {
		displayError('result', "Please enter a valid number for the amount.");
		return;
	}

	// Validate that the amount is greater than 0.
	if (numberOfRandoms < 1) {
		displayError('result', "Please enter an amount greater than 0.");
		return;
	}

	// Generate and display each random number.
	for (let i = 0; i < numberOfRandoms; i++) {
		const isEvenRow = (i % 2 === 0);
		const rowClass = isEvenRow ? 'even' : 'odd';
		const randomNumber = getRandomInt(rangeFrom, rangeTo);
		// Using appendToElement from utils.js
		appendToElement('result', `<div class="${rowClass}">${randomNumber}</div>`);
	}
}

// Generates a random integer between minValue (inclusive) and maxValue (inclusive).
function getRandomInt(minValue, maxValue) {
	// Ensure parameters are integers; Math.ceil/floor handle if they are not.
	const min = Math.ceil(minValue);
	const max = Math.floor(maxValue);
	// The maximum is inclusive and the minimum is inclusive
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Local displayResult, displayError, and clearResults functions are removed
// as they are now handled by utils.js:
// appendToElement(elementId, htmlContent)
// displayError(elementId, errorMessage)
// clearElement(elementId)
// getElement(elementId)
*/