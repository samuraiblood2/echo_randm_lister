// TextCaseConverterView.js
class TextCaseConverterView extends BaseView {
    constructor() {
        super();
    }

    render() {
        return `
            <div class="page-container">
                <h1>Text Case Converter</h1>
                <div id="text-case-converter-main">
                    <div class="setting-entry" style="flex-direction: column; align-items: stretch;">
                        <label for="input-text-area">Input Text:</label>
                        <textarea id="input-text-area" rows="8" placeholder="Enter text here..."></textarea>
                    </div>

                    <div id="conversion-buttons" style="margin-top: 10px; margin-bottom: 10px; text-align: center;">
                        <button id="btn-uppercase">UPPERCASE</button>
                        <button id="btn-lowercase">lowercase</button>
                        <button id="btn-sentencecase">Sentence case</button>
                        <button id="btn-titlecase">Title Case</button>
                        <!-- Optional: Add more buttons here later -->
                    </div>

                    <div class="setting-entry" style="flex-direction: column; align-items: stretch;">
                        <label for="output-text-area">Output Text:</label>
                        <textarea id="output-text-area" rows="8" readonly placeholder="Converted text will appear here..."></textarea>
                    </div>
                    <button id="btn-copy-output" style="margin-top:10px;">Copy Output</button>
                </div>
            </div>
        `;
    }

    postRender() {
        const inputText = document.getElementById('input-text-area');
        const outputText = document.getElementById('output-text-area');
        const btnUppercase = document.getElementById('btn-uppercase');
        const btnLowercase = document.getElementById('btn-lowercase');
        const btnSentencecase = document.getElementById('btn-sentencecase');
        const btnTitlecase = document.getElementById('btn-titlecase');
        const copyButton = document.getElementById('btn-copy-output');

        if (btnUppercase) {
            btnUppercase.addEventListener('click', () => {
                outputText.value = inputText.value.toUpperCase();
            });
        }

        if (btnLowercase) {
            btnLowercase.addEventListener('click', () => {
                outputText.value = inputText.value.toLowerCase();
            });
        }

        if (btnSentencecase) {
            btnSentencecase.addEventListener('click', () => {
                const text = inputText.value.trim();
                if (text.length === 0) { outputText.value = ''; return; }
                const sentences = text.toLowerCase().split(/([.!?]\s*)/g); 
                let result = "";
                for (let i = 0; i < sentences.length; i++) {
                    let sentence = sentences[i].trimStart(); // Trim only start for spaces after delimiters
                    if (sentence.length > 0 && !/([.!?]\s*)/.test(sentence)) { // Don't capitalize if it's just a delimiter
                        result += sentence.charAt(0).toUpperCase() + sentence.slice(1);
                    } else {
                        result += sentence; // Add delimiter or already processed part
                    }
                }
                // Refine spacing for sentence case: ensure space after punctuation, unless it's the end.
                // This is tricky with split and keep. A simpler approach might be to split, process, then rejoin.
                // For now, the provided logic is complex. Let's try a slightly simplified re-join logic.
                // The provided logic might overcomplicate rejoining.
                // A slightly more robust sentence case:
                outputText.value = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, function(c) {
                    return c.toUpperCase();
                });
            });
        }
        
        if (btnTitlecase) {
            btnTitlecase.addEventListener('click', () => {
                const words = inputText.value.toLowerCase().split(' ');
                outputText.value = words.map(word => {
                    if (word.length > 0) {
                        return word.charAt(0).toUpperCase() + word.slice(1);
                    }
                    return "";
                }).join(' ');
            });
        }

        if (copyButton) {
            copyButton.addEventListener('click', () => {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(outputText.value)
                        .then(() => {
                            const originalText = copyButton.textContent;
                            copyButton.textContent = 'Copied!';
                            setTimeout(() => { copyButton.textContent = originalText; }, 2000);
                        })
                        .catch(err => {
                            console.error('Failed to copy text: ', err);
                            // Fallback for environments where writeText might fail (e.g. insecure context)
                            try {
                                outputText.select();
                                document.execCommand('copy');
                                const originalText = copyButton.textContent;
                                copyButton.textContent = 'Copied (fallback)!';
                                setTimeout(() => { copyButton.textContent = originalText; }, 2000);
                            } catch (fallbackErr) {
                                console.error('Fallback copy failed: ', fallbackErr);
                                alert("Failed to copy text. Please try manually.");
                            }
                        });
                } else {
                    // Fallback for older browsers
                    try {
                        outputText.select(); 
                        document.execCommand('copy');
                        const originalText = copyButton.textContent;
                        copyButton.textContent = 'Copied (legacy)!';
                        setTimeout(() => { copyButton.textContent = originalText; }, 2000);
                    } catch (err) {
                         console.error('Legacy copy failed: ', err);
                         alert("Failed to copy text. Please try manually.");
                    }
                }
            });
        }
    }

    destroy() {
        // console.log("TextCaseConverterView destroyed");
        // Event listeners are on elements within the view, so they
        // should be removed when the view's HTML is cleared by App.js.
        // No specific manual cleanup needed here for this view.
    }
}
