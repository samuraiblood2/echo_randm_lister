// Stores the list of items and their selection counts.
// Using an object to map item names to counts.
let itemList = {};

// Main function to generate and display the randomized list.
function generateRandomList() {
	// Clear previous results and reset the item list.
	resetForm();

	// Populate the item list from the textarea.
	if (!initializeItemList()) {
		return; // Stop if initialization fails (e.g., no items entered).
	}

	// Get the number of random selections to make.
	// Using getElement from utils.js to get the input element
	const amountInputElement = getElement('amount');
	if (!amountInputElement) return; // Stop if amount input not found
	const numberOfSelections = parseInt(amountInputElement.value, 10);

	// Validate the number of selections.
	if (isNaN(numberOfSelections)) {
		displayError('result', "Please enter a valid number for the amount.");
		return;
	}
	if (numberOfSelections <= 0) {
		displayError('result', "Please enter an amount greater than 0.");
		return;
	}

	const itemNames = Object.keys(itemList);
	const numberOfItems = itemNames.length;

	if (numberOfItems === 0) {
		// This error case should ideally be caught by initializeItemList,
		// but as a safeguard or if initializeItemList changes.
		displayError('result', "No items available to select from. Please check your input.");
		return;
	}

	// Randomly select items and increment their counts.
	for (let i = 0; i < numberOfSelections; i++) {
		const randomIndex = Math.floor(Math.random() * numberOfItems);
		const selectedItemName = itemNames[randomIndex];
		itemList[selectedItemName]++;
	}

	// Determine the item with the highest count.
	let highestCount = -1;
	let winningItemName = "";
	for (const itemName in itemList) {
		if (itemList[itemName] > highestCount) {
			highestCount = itemList[itemName];
			winningItemName = itemName;
		}
	}

	// Display the results.
	let rowIndex = 0;
	for (const itemName in itemList) {
		const itemCount = itemList[itemName];
		const isEvenRow = (rowIndex % 2 === 0);
		const isHighestCountItem = (itemName === winningItemName);

		// Determine the CSS class for styling based on row index and whether it's the "winner".
		let rowClass = isEvenRow ? 'even' : 'odd';
		if (isHighestCountItem) {
			rowClass = isEvenRow ? 'even-winner' : 'odd-winner';
		}
		// Using appendToElement from utils.js
		appendToElement('result', `<div class="${rowClass}">${itemName}: ${itemCount}</div>`);
		rowIndex++;
	}
}

// Initializes the itemList from the text area input.
function initializeItemList() {
	// Using getElement from utils.js to get the textarea
	const itemsTextarea = getElement('items');
	if (!itemsTextarea) {
		// If textarea isn't found, cannot proceed. Error logged by getElement.
		// We might want to display an error in 'result' as well for user visibility.
		displayError('result', "Error: Textarea element for items not found. Cannot initialize list.");
		return false;
	}

	const itemEntriesText = itemsTextarea.value.trim();
	if (itemEntriesText === "") {
		displayError('result', "Please enter at least one item in the text area.");
		return false;
	}

	const itemEntries = itemEntriesText.split('\n');
	itemList = {}; // Reset item list before populating
	for (let i = 0; i < itemEntries.length; i++) {
		const trimmedItemName = itemEntries[i].trim();
		if (trimmedItemName !== "") { // Avoid adding empty strings as items
			itemList[trimmedItemName] = 0; // Initialize count to 0
		}
	}
	if (Object.keys(itemList).length === 0) {
		displayError('result', "No valid items entered. Please ensure each line has text.");
		return false;
	}
	return true;
}

// Clears the result area using utils.js and resets the global item list.
function resetForm() {
	clearElement('result'); // Using clearElement from utils.js
	itemList = {}; // Reset the global item list. This logic remains specific to random_list.js
}

// Local displayResult and displayError functions are removed
// as they are now handled by utils.js:
// appendToElement(elementId, htmlContent)
// displayError(elementId, errorMessage)
// clearElement(elementId)
// getElement(elementId)