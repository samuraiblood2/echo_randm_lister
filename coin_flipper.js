// ==================================================================================
// DEPRECATED FILE: coin_flipper.js
// ----------------------------------------------------------------------------------
// The functionality originally in this file has been refactored and integrated 
// into the Single Page Application (SPA) structure.
//
// Specifically, the "Coin Flipper" tool is now managed by:
// - CoinFlipperView.js: Contains the class for rendering the view and handling its logic.
// - App.js: Handles routing to this view.
// - index.html: Includes CoinFlipperView.js and defines the route.
//
// This file (coin_flipper.js) is no longer used by the application and can be
// considered for removal in future cleanup efforts.
// ==================================================================================

/*
// Initialize flip count
let flipCount = 0;

// Function to handle the coin flip logic
function flipCoin() {
	// Clear previous result using utility function
	clearElement('result');

	// Generate a random number between 0 and 1
	const randomNumber = Math.random();
	// Determine coin face based on the random number
	const coinFace = (randomNumber < 0.5 ? 'Heads' : 'Tails');

	// Increment flip count
	flipCount++;
	// Display the current flip count using utility function
	appendToElement('result', 'Count: ' + flipCount + '<br>'); // Added <br> for spacing if multiple messages are appended

	// Display the coin face using utility function
	appendToElement('result', '<h1 style="font-size:60px;"><strong>' + coinFace + '</strong></h1>');
}

// Local displayResult, displayError, and clearPreviousResult functions are removed
// as they are now handled by utils.js:
// appendToElement(elementId, htmlContent)
// displayError(elementId, errorMessage)
// clearElement(elementId)
*/