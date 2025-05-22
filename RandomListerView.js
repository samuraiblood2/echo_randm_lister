// RandomListerView.js
class RandomListerView extends BaseView {
    constructor() {
        super();
        this.itemList = {}; // Specific state for this view
    }

    render() {
        // HTML structure from random_list.html's main content area
        return `
            <h1>Random Lister</h1>
            <p>Enter the different items to iterate over inside the textarea. Separate different items by new lines.</p>
            <textarea id="rl-items" rows="10" cols="125"></textarea> <br><br>
            <form id="rl-form">
                Amount: <input type="text" id="rl-amount">
                <button type="button" id="rl-submit">Submit</button>
            </form>
            <br><br><div class="result" id="rl-result"></div>
        `;
        // Prefixed IDs (e.g., rl-items) to avoid conflicts if multiple views are ever on one page (less likely in this SPA model but good practice).
    }

    postRender() {
        // Logic from random_list.js
        const submitButton = document.getElementById('rl-submit');
        if (submitButton) {
            submitButton.addEventListener('click', () => this.generateRandomList());
        }
    }

    // Method to initialize the item list from the textarea.
    initializeItemList() {
        const itemsTextarea = document.getElementById('rl-items');
        this.itemList = {}; // Reset item list

        if (!itemsTextarea) {
            console.error("Error: Textarea element with ID 'rl-items' not found.");
            this.displayError("Textarea element not found."); // Use a view-specific error display
            return false;
        }

        const itemEntriesText = itemsTextarea.value.trim();
        if (itemEntriesText === "") {
            this.displayError("Please enter at least one item in the text area.");
            return false;
        }

        const itemEntries = itemEntriesText.split('\n');
        for (let i = 0; i < itemEntries.length; i++) {
            const trimmedItemName = itemEntries[i].trim();
            if (trimmedItemName !== "") {
                this.itemList[trimmedItemName] = 0;
            }
        }
        if (Object.keys(this.itemList).length === 0) {
            this.displayError("No valid items entered. Please ensure each line has text.");
            return false;
        }
        return true;
    }
    
    // Main function to generate and display the randomized list.
    generateRandomList() {
        this.clearResult(); // Use a view-specific clear method

        if (!this.initializeItemList()) {
            return;
        }

        const amountInput = document.getElementById('rl-amount');
        const numberOfSelections = parseInt(amountInput.value, 10);

        if (isNaN(numberOfSelections) || numberOfSelections <= 0) {
            this.displayError("Please enter an amount greater than 0 and ensure it's a number.");
            return;
        }

        const itemNames = Object.keys(this.itemList);
        const numberOfItems = itemNames.length;

        if (numberOfItems === 0) { // Should be caught by initializeItemList
            this.displayError("No items available to select from.");
            return;
        }

        for (let i = 0; i < numberOfSelections; i++) {
            const randomIndex = Math.floor(Math.random() * numberOfItems);
            const selectedItemName = itemNames[randomIndex];
            this.itemList[selectedItemName]++;
        }

        let highestCount = -1;
        let winningItemName = "";
        for (const itemName in this.itemList) {
            if (this.itemList[itemName] > highestCount) {
                highestCount = this.itemList[itemName];
                winningItemName = itemName;
            }
        }

        let rowIndex = 0;
        for (const itemName in this.itemList) {
            const itemCount = this.itemList[itemName];
            const isEvenRow = (rowIndex % 2 === 0);
            const isHighestCountItem = (itemName === winningItemName);
            let rowClass = isEvenRow ? 'even' : 'odd';
            if (isHighestCountItem) {
                rowClass = isEvenRow ? 'even-winner' : 'odd-winner';
            }
            this.displayResult(`<div class="${rowClass}">${itemName}: ${itemCount}</div>`);
            rowIndex++;
        }
    }

    // View-specific display helpers (could also use global utils if they take an element ID)
    displayResult(message) {
        const resultElement = document.getElementById('rl-result');
        if (resultElement) resultElement.innerHTML += message;
    }

    displayError(message) {
        this.displayResult(`<div class="error">${message}</div>`);
    }

    clearResult() {
        const resultElement = document.getElementById('rl-result');
        if (resultElement) resultElement.innerHTML = '';
        // this.itemList = {}; // Resetting itemList is now part of initializeItemList
    }
    
    destroy() {
        // Remove event listeners if any were attached directly to elements outside the view's main container,
        // or to document/window. Here, the listener is on a button within the rendered content,
        // so it will be removed when the main container's innerHTML is cleared by App.js.
        // If not, explicit removal would be:
        // const submitButton = document.getElementById('rl-submit');
        // if (submitButton) submitButton.removeEventListener('click', this.generateRandomListBound); 
        // where generateRandomListBound is this.generateRandomList.bind(this) stored during postRender.
    }
}
