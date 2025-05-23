// CoinFlipperView.js
class CoinFlipperView extends BaseView {
    constructor() {
        super();
        this.flipCount = 0; // State specific to this view
    }

    render() {
        // HTML structure from coin_flipper.html's main content area
        return `
        <div class="page-container">
            <h1>Coin Flipper</h1>
            <form id="cf-form">
                <button type="button" id="cf-flip-coin">Flip Coin</button>
            </form>
            <div id="cf-result"></div>
        </div>`;
        // Prefixed IDs (e.g., cf-form)
    }

    postRender() {
        // Logic from coin_flipper.js
        const flipButton = document.getElementById('cf-flip-coin');
        if (flipButton) {
            // Store bound function for potential removal in destroy()
            this.boundFlipCoin = this.flipCoin.bind(this); 
            flipButton.addEventListener('click', this.boundFlipCoin);
        }
        // Initial display if any (e.g. count 0, though flipCoin handles first display)
        this.updateResultDisplay(); 
    }
    
    flipCoin() {
        this.clearResult(); // This will clear the content before updateResultDisplay sets new content.

        const randomNumber = Math.random();
        const coinFace = (randomNumber < 0.5 ? 'Heads' : 'Tails');

        this.flipCount++;
        this.updateResultDisplay(coinFace);
    }

    updateResultDisplay(coinFace = null) {
        let message = 'Count: ' + this.flipCount;
        if (coinFace) {
            message += `<br><h1 style="font-size:60px;"><strong>${coinFace}</strong></h1>`;
        }
        this.displayResult(message); // Call the view-specific displayResult
    }

    // View-specific display helpers
    displayResult(message) {
        const resultElement = document.getElementById('cf-result');
        if (resultElement) {
           resultElement.innerHTML = message; // Overwrite instead of append for coin flipper
        }
    }

    clearResult() {
        const resultElement = document.getElementById('cf-result');
        if (resultElement) {
            resultElement.innerHTML = '';
        }
    }
    
    destroy() {
        const flipButton = document.getElementById('cf-flip-coin');
        if (flipButton && this.boundFlipCoin) {
            flipButton.removeEventListener('click', this.boundFlipCoin);
        }
        // console.log('CoinFlipperView destroyed');
    }
}
