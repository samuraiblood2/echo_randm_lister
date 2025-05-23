// NumConverterView.js
class NumConverterView extends BaseView {
    constructor() {
        super();
    }

    render() {
        return `
            <div class="page-container">
                <h1>Number System Converter</h1>
                <div id="num-converter-controls">
                    <div class="setting-entry">
                        <label for="input-number">Number to Convert:</label>
                        <input type="text" id="input-number" placeholder="Enter number">
                    </div>
                    <div class="setting-entry">
                        <label for="from-base">From Base:</label>
                        <select id="from-base">
                            <option value="2">Binary (2)</option>
                            <option value="8">Octal (8)</option>
                            <option value="10" selected>Decimal (10)</option>
                            <option value="16">Hexadecimal (16)</option>
                        </select>
                    </div>
                    <div class="setting-entry">
                        <label for="to-base">To Base:</label>
                        <select id="to-base">
                            <option value="2">Binary (2)</option>
                            <option value="8">Octal (8)</option>
                            <option value="10" selected>Decimal (10)</option>
                            <option value="16">Hexadecimal (16)</option>
                        </select>
                    </div>
                    <button id="convert-button">Convert</button>
                </div>
                <div id="num-converter-result" style="margin-top: 20px; padding: 10px; border: 1px solid var(--border-color-light);">
                    <p>Result will appear here.</p>
                </div>
            </div>
        `;
    }

    postRender() {
        const inputNumberElement = document.getElementById('input-number');
        const fromBaseElement = document.getElementById('from-base');
        const toBaseElement = document.getElementById('to-base');
        const convertButton = document.getElementById('convert-button');
        const resultsDiv = document.getElementById('num-converter-result');

        if (convertButton && inputNumberElement && fromBaseElement && toBaseElement && resultsDiv) {
            convertButton.addEventListener('click', () => {
                const inputStr = inputNumberElement.value.trim();
                const fromBase = parseInt(fromBaseElement.value);
                const toBase = parseInt(toBaseElement.value);

                resultsDiv.innerHTML = ''; // Clear previous results

                if (inputStr === '') {
                    resultsDiv.innerHTML = '<p class="error">Please enter a number.</p>';
                    return;
                }

                // Input Validation
                let isValidInput = false;
                switch (fromBase) {
                    case 2:
                        isValidInput = /^[01]+$/.test(inputStr);
                        break;
                    case 8:
                        isValidInput = /^[0-7]+$/.test(inputStr);
                        break;
                    case 10:
                        isValidInput = /^[0-9]+$/.test(inputStr); // Simple validation for unsigned integers
                        // For more complex scenarios like negative or floats, this regex would need adjustment.
                        break;
                    case 16:
                        isValidInput = /^[0-9a-fA-F]+$/.test(inputStr);
                        break;
                    default:
                        resultsDiv.innerHTML = '<p class="error">Invalid "From Base" selected.</p>';
                        return;
                }

                if (!isValidInput) {
                    resultsDiv.innerHTML = `<p class="error">Invalid characters for the selected 'From Base' (${fromBaseElement.options[fromBaseElement.selectedIndex].text}).</p>`;
                    return;
                }

                // Conversion
                try {
                    const decimalValue = parseInt(inputStr, fromBase);

                    if (isNaN(decimalValue)) {
                        // This check might be redundant if the regex is comprehensive enough,
                        // but good as a fallback.
                        resultsDiv.innerHTML = `<p class="error">Invalid number for the selected 'From Base' (${fromBaseElement.options[fromBaseElement.selectedIndex].text}).</p>`;
                        return;
                    }

                    const resultStr = decimalValue.toString(toBase);
                    resultsDiv.innerHTML = `<p><strong>Result:</strong> ${resultStr.toUpperCase()}</p>`;

                } catch (error) {
                    console.error("Error during number conversion:", error);
                    resultsDiv.innerHTML = '<p class="error">An unexpected error occurred during conversion.</p>';
                }
            });
        } else {
            console.error("Number converter UI elements not found during postRender.");
        }
    }

    destroy() {
        // console.log("NumConverterView destroyed");
        // For this view, the listener is on a button within the view,
        // which will be removed when the view's HTML is cleared by App.js.
    }
}
