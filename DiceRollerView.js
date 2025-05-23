// DiceRollerView.js
class DiceRollerView extends BaseView {
    constructor() {
        super();
    }

    render() {
        return `
            <div class="page-container">
                <h1>Random Dice Roller</h1>
                <div id="dice-roller-controls">
                    <div class="setting-entry">
                        <label for="num-dice">Number of Dice:</label>
                        <input type="number" id="num-dice" value="1" min="1" max="100">
                    </div>
                    <div class="setting-entry">
                        <label for="num-sides">Sides per Die:</label>
                        <select id="num-sides">
                            <option value="4">D4</option>
                            <option value="6" selected>D6</option>
                            <option value="8">D8</option>
                            <option value="10">D10</option>
                            <option value="12">D12</option>
                            <option value="20">D20</option>
                            <option value="100">D100</option>
                        </select>
                    </div>
                    <button id="roll-dice-button">Roll Dice</button>
                </div>
                <div id="dice-roller-results" style="margin-top: 20px; padding: 10px; border: 1px solid var(--border-color-light);">
                    <p>Results will appear here.</p>
                </div>
            </div>
        `;
    }

    postRender() {
        const numDiceInput = document.getElementById('num-dice');
        const numSidesSelect = document.getElementById('num-sides');
        const rollDiceButton = document.getElementById('roll-dice-button');
        const resultsDiv = document.getElementById('dice-roller-results');

        if (rollDiceButton && numDiceInput && numSidesSelect && resultsDiv) {
            rollDiceButton.addEventListener('click', () => {
                const numDice = parseInt(numDiceInput.value, 10);
                const numSides = parseInt(numSidesSelect.value, 10);

                if (isNaN(numDice) || numDice <= 0) {
                    resultsDiv.innerHTML = '<p class="error">Please enter a valid number of dice (must be > 0).</p>';
                    return;
                }
                if (numDice > 100) {
                     resultsDiv.innerHTML = '<p class="error">Please enter a number of dice less than or equal to 100.</p>';
                    return;
                }


                if (isNaN(numSides) || numSides <= 0) {
                    // This case should ideally not happen with a select dropdown unless options are malformed
                    resultsDiv.innerHTML = '<p class="error">Please select a valid die type.</p>';
                    return;
                }

                const rolls = [];
                let total = 0;

                for (let i = 0; i < numDice; i++) {
                    const roll = Math.floor(Math.random() * numSides) + 1;
                    rolls.push(roll);
                    total += roll;
                }

                resultsDiv.innerHTML = `
                    <p><strong>Rolls:</strong> [${rolls.join(', ')}]</p>
                    <p><strong>Total:</strong> ${total}</p>
                `;
            });
        } else {
            console.error("Dice roller UI elements not found during postRender.");
        }
    }

    destroy() {
        // console.log("DiceRollerView destroyed");
        // If any event listeners were added to elements outside the view's container
        // or to global objects, they should be removed here.
        // For this view, the listener is on a button within the view,
        // which will be removed when the view's HTML is cleared by App.js.
    }
}
