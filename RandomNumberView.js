// RandomNumberView.js
class RandomNumberView extends BaseView {
    constructor() {
        super();
    }

    render() {
        // HTML structure from random_number.html's main content area
        return `
        <div class="page-container">
            <h1>Random Number Generator</h1>
            <p>Enter the range of numbers (ie 1 to 100) and the number of iterations.</p>
            <form id="rn-form">
                Range: <input type="text" id="rn-from"> to <input type="text" id="rn-to"> <br><br>
                Amount: <input type="text" id="rn-amount">
                <button type="button" id="rn-submit">Submit</button>
            </form>
            <br><br><div class="result" id="rn-result"></div>
        </div>`;
        // Prefixed IDs (e.g., rn-from)
    }

    postRender() {
        // Logic from random_number.js
        const submitButton = document.getElementById('rn-submit');
        if (submitButton) {
            submitButton.addEventListener('click', () => this.generateRandomNumbers());
        }
    }

    generateRandomNumbers() {
        this.clearResult(); // Use a view-specific clear method

        const rangeFromInput = document.getElementById('rn-from').value;
        const rangeToInput = document.getElementById('rn-to').value;
        const amountInput = document.getElementById('rn-amount').value;

        const rangeFrom = parseInt(rangeFromInput, 10);
        const rangeTo = parseInt(rangeToInput, 10);
        const numberOfRandoms = parseInt(amountInput, 10);

        if (isNaN(rangeFrom) || isNaN(rangeTo)) {
            this.displayError("Please enter valid numbers for the range.");
            return;
        }
        if (rangeFrom >= rangeTo) {
            this.displayError("The 'From' value must be less than the 'To' value.");
            return;
        }
        if (isNaN(numberOfRandoms) || numberOfRandoms < 1) {
            this.displayError("Please enter an amount greater than 0 and ensure it's a number.");
            return;
        }

        for (let i = 0; i < numberOfRandoms; i++) {
            const isEvenRow = (i % 2 === 0);
            const rowClass = isEvenRow ? 'even' : 'odd';
            const randomNumber = this.getRandomInt(rangeFrom, rangeTo);
            this.displayResult(`<div class="${rowClass}">${randomNumber}</div>`);
        }
    }

    getRandomInt(minValue, maxValue) {
        const min = Math.ceil(minValue);
        const max = Math.floor(maxValue);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // View-specific display helpers
    displayResult(message) {
        const resultElement = document.getElementById('rn-result');
        if (resultElement) resultElement.innerHTML += message;
    }

    displayError(message) {
        this.displayResult(`<div class="error">${message}</div>`);
    }

    clearResult() {
        const resultElement = document.getElementById('rn-result');
        if (resultElement) resultElement.innerHTML = '';
    }
    
    destroy() {
        // Cleanup if needed
        // Event listener on 'rn-submit' is within rendered content, will be removed by App.js.
    }
}
