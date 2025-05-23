// ToolsView.js
class ToolsView extends BaseView {
    constructor() {
        super();
    }

    // Store bound event handlers for potential cleanup in destroy, if needed for complex tools
    // For this RSS tool, since we overwrite innerHTML, explicit removal might not be strictly necessary
    // if all listeners are on elements within the toolDisplayArea.
    // However, it's good practice for more complex scenarios.
    boundToolEventHandlers = [];

    _clearToolDisplayArea(toolDisplayArea, defaultMessage) {
        toolDisplayArea.innerHTML = defaultMessage;
        // Clean up any dynamically added listeners from the previous tool
        this.boundToolEventHandlers.forEach(handler => {
            if (handler.element && handler.event && handler.listener) {
                 handler.element.removeEventListener(handler.event, handler.listener);
            }
        });
        this.boundToolEventHandlers = [];
    }

    _renderRssFeedUrlsList() {
        const urls = getSetting('rssFeedUrls', []);
        // Assuming the list element will be inside the toolDisplayArea after _renderRssReaderToolHtml
        const listElement = document.getElementById('rss-feed-urls-list-tool'); 
        if (!listElement) {
            console.warn("Element 'rss-feed-urls-list-tool' not found during _renderRssFeedUrlsList.");
            return;
        }

        listElement.innerHTML = ''; // Clear current list
        if (urls.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No RSS feeds configured.';
            listElement.appendChild(li);
        } else {
            urls.forEach(url => {
                const li = document.createElement('li');
                
                const urlText = document.createElement('span');
                urlText.textContent = url;
                urlText.style.marginRight = '10px';
                li.appendChild(urlText);

                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.classList.add('remove-rss-btn');
                // removeButton.dataset.url = url; // Data attribute not strictly needed if using closure
                
                // Event listener for remove button
                const removeHandler = () => this._handleRemoveRssFeedUrl(url);
                removeButton.addEventListener('click', removeHandler);
                // Store for potential cleanup, though in this case, innerHTML overwrite handles it.
                // this.boundToolEventHandlers.push({element: removeButton, event: 'click', listener: removeHandler});


                li.appendChild(removeButton);
                listElement.appendChild(li);
            });
        }
    }

    _handleRemoveRssFeedUrl(urlToRemove) {
        let urls = getSetting('rssFeedUrls', []);
        urls = urls.filter(url => url !== urlToRemove);
        saveSetting('rssFeedUrls', urls);
        this._renderRssFeedUrlsList(); // Re-render the list
        displayStatusMessage('rss-status-message-tool', 'RSS Feed URL removed!');
    }
    
    _renderRssReaderToolHtml() {
        // Using unique IDs for elements within the tool by appending "-tool"
        return `
            <section id="rss-settings-tool">
                <h2>RSS Feed Settings</h2>
                <div class="setting-entry">
                    <label for="new-rss-feed-url-input-tool">Add RSS Feed URL:</label>
                    <input type="text" id="new-rss-feed-url-input-tool" name="new-rss-feed-url-tool" size="50" placeholder="Enter feed URL">
                    <button id="add-new-rss-feed-url-button-tool">Add Feed</button>
                </div>
                <fieldset class="settings-group">
                    <legend>Configured Feeds</legend>
                    <ul id="rss-feed-urls-list-tool"></ul>
                    <p id="rss-status-message-tool" class="status-message"></p>
                </fieldset>
                <fieldset class="settings-group">
                    <legend>Display Options</legend>
                    <div class="setting-entry">
                        <label for="rss-max-items-input-tool">Max items per feed (0 for all):</label>
                        <input type="number" id="rss-max-items-input-tool" min="0">
                    </div>
                    <div class="setting-entry">
                        <input type="checkbox" id="rss-show-descriptions-checkbox-tool">
                        <label for="rss-show-descriptions-checkbox-tool">Show item descriptions</label>
                    </div>
                    <div class="setting-entry">
                        <input type="checkbox" id="rss-show-dates-checkbox-tool">
                        <label for="rss-show-dates-checkbox-tool">Show item publication dates</label>
                    </div>
                    <button id="save-rss-display-options-button-tool">Save Display Options</button>
                    <p id="rss-display-options-status-message-tool" class="status-message"></p>
                </fieldset>
            </section>
        `;
    }

    _initRssReaderToolLogic() {
        this._renderRssFeedUrlsList(); 

        const addBtn = document.getElementById('add-new-rss-feed-url-button-tool');
        const newUrlInput = document.getElementById('new-rss-feed-url-input-tool');
        
        if (addBtn && newUrlInput) {
            const addFeedHandler = () => {
                const newUrl = newUrlInput.value.trim();
                if (newUrl === '') {
                    displayStatusMessage('rss-status-message-tool', 'Please enter a URL.');
                    return;
                }
                if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
                    displayStatusMessage('rss-status-message-tool', 'Invalid URL format. Must start with http:// or https://');
                    return;
                }
                const urls = getSetting('rssFeedUrls', []);
                if (urls.includes(newUrl)) {
                    displayStatusMessage('rss-status-message-tool', 'This URL is already in the list.');
                    return;
                }
                urls.push(newUrl);
                saveSetting('rssFeedUrls', urls);
                this._renderRssFeedUrlsList();
                newUrlInput.value = '';
                displayStatusMessage('rss-status-message-tool', 'RSS Feed URL added!');
            };
            addBtn.addEventListener('click', addFeedHandler);
            // this.boundToolEventHandlers.push({element: addBtn, event: 'click', listener: addFeedHandler});
        }

        // Note: Event listeners for "Remove" buttons are added directly in _renderRssFeedUrlsList

        const maxItemsInput = document.getElementById('rss-max-items-input-tool');
        const showDescCheckbox = document.getElementById('rss-show-descriptions-checkbox-tool');
        const showDatesCheckbox = document.getElementById('rss-show-dates-checkbox-tool');
        const saveDisplayOptionsBtn = document.getElementById('save-rss-display-options-button-tool');

        if (maxItemsInput) maxItemsInput.value = getSetting('rssDisplayOptions_maxItems', 10);
        if (showDescCheckbox) showDescCheckbox.checked = getSetting('rssDisplayOptions_showDesc', true);
        if (showDatesCheckbox) showDatesCheckbox.checked = getSetting('rssDisplayOptions_showDates', true);

        if (saveDisplayOptionsBtn) {
            const saveOptionsHandler = () => {
                const maxItems = parseInt(maxItemsInput.value, 10);
                saveSetting('rssDisplayOptions_maxItems', isNaN(maxItems) || maxItems < 0 ? 0 : maxItems);
                saveSetting('rssDisplayOptions_showDesc', showDescCheckbox.checked);
                saveSetting('rssDisplayOptions_showDates', showDatesCheckbox.checked);
                displayStatusMessage('rss-display-options-status-message-tool', 'Display options saved!');
            };
            saveDisplayOptionsBtn.addEventListener('click', saveOptionsHandler);
            // this.boundToolEventHandlers.push({element: saveDisplayOptionsBtn, event: 'click', listener: saveOptionsHandler});
        }
    }
    
    render() {
        return `
            <div class="page-container">
                <h1>Tools</h1>
                <div id="tools-content-wrapper">
                    <div id="tool-selection-area">
                        <h2>Tool Categories</h2>
                        
                        <div class="tool-category">
                            <label for="category-content-utils">Content Utilities:</label>
                            <select id="category-content-utils" class="tool-category-dropdown" data-category="Content Utilities">
                                <option value="">-- Select a tool --</option>
                                <option value="rss-reader-tool">RSS Reader (View)</option> 
                                <option value="marquee-editor">Marquee Editor (Placeholder)</option>
                            </select>
                        </div>

                        <div class="tool-category">
                            <label for="category-data-utils">Data Utilities:</label>
                            <select id="category-data-utils" class="tool-category-dropdown" data-category="Data Utilities">
                                <option value="">-- Select a tool --</option>
                                <option value="json-formatter">JSON Formatter (Placeholder)</option>
                                <option value="list-randomizer-tool">List Randomizer (View)</option>
                            </select>
                        </div>
                        
                        <div class="tool-category">
                            <label for="category-misc-utils">Miscellaneous:</label>
                            <select id="category-misc-utils" class="tool-category-dropdown" data-category="Miscellaneous">
                                <option value="">-- Select a tool --</option>
                                <option value="coin-flipper-tool">Coin Flipper (View)</option>
                                <option value="random-number-tool">Random Number Gen (View)</option>
                            </select>
                        </div>
                    </div>

                    <hr>

                    <div id="tool-display-area">
                        <p>Select a tool from a category above to see its interface here.</p>
                    </div>
                </div>
            </div>
        `;
    }

    postRender() {
        const toolDropdowns = document.querySelectorAll('.tool-category-dropdown');
        const toolDisplayArea = document.getElementById('tool-display-area');
        const defaultDisplayAreaMessage = '<p>Select a tool from a category above to see its interface here.</p>';

        toolDropdowns.forEach(dropdown => {
            dropdown.addEventListener('change', (event) => {
                const selectedToolValue = event.target.value;
                
                // Clear previous tool's UI and listeners before loading new one
                this._clearToolDisplayArea(toolDisplayArea, defaultDisplayAreaMessage);

                if (selectedToolValue) {
                    const selectedToolOption = event.target.options[event.target.selectedIndex];
                    const selectedToolName = selectedToolOption.text;
                    const category = event.target.dataset.category;

                    // Deselect other dropdowns
                    toolDropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== event.target) {
                            otherDropdown.value = ""; 
                        }
                    });
                    
                    console.log(`Tool selected: ${selectedToolName} (Value: ${selectedToolValue}), Category: ${category}`);

                    if (selectedToolValue === "rss-reader-tool") {
                        toolDisplayArea.innerHTML = this._renderRssReaderToolHtml();
                        this._initRssReaderToolLogic();
                    } else {
                        // Placeholder for other tools
                        toolDisplayArea.innerHTML = `<h3>${selectedToolName} Interface</h3><p>Tool UI for <strong>${selectedToolName}</strong> (from category: ${category}) will be here.</p><p><small>Value: ${selectedToolValue}</small></p>`;
                    }
                } 
                // If selectedToolValue is empty, _clearToolDisplayArea has already reset it.
            });
        });
    }

    destroy() {
        // console.log("ToolsView destroyed");
        // Clean up any dynamically added listeners from the last active tool
        // This is a fallback if a view is destroyed without clearing the tool display first
        const toolDisplayArea = document.getElementById('tool-display-area');
        if (toolDisplayArea) {
             this._clearToolDisplayArea(toolDisplayArea, ''); // Clear with empty message
        }
    }
}
