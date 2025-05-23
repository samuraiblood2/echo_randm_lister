// SettingsView.js
class SettingsView extends BaseView {
    constructor() {
        super();
    }

    render() {
        // HTML structure from settings.html's <div id="settings-content">
        // Using template literals for multi-line HTML.
        return `
            <div class="page-container"> <!-- Use existing .page-container class -->
                <h1>Settings</h1>
                <div id="settings-content-wrapper"> 
                    <section id="rss-settings">
                        <h2>RSS Feed Settings</h2>
                        <div>
                            <label for="new-rss-feed-url">Add RSS Feed URL:</label>
                            <input type="text" id="new-rss-feed-url" name="new-rss-feed-url" size="50" placeholder="Enter feed URL">
                            <button id="add-new-rss-feed-url">Add Feed</button>
                        </div>
                        <h3>Configured Feeds:</h3>
                        <ul id="rss-feed-urls-list">
                            <!-- Feed URLs will be listed here by JavaScript -->
                        </ul>
                        <p id="rss-status-message" class="status-message" style="margin-bottom: 20px;"></p> <!-- Added margin for separation -->
                        
                        <h4>Display Options:</h4>
                        <div>
                            <label for="rss-max-items">Max items per feed (0 for all):</label>
                            <input type="number" id="rss-max-items" min="0" value="10"> <!-- Default to 10 -->
                        </div>
                        <div>
                            <input type="checkbox" id="rss-show-descriptions" checked> <!-- Default to checked -->
                            <label for="rss-show-descriptions">Show item descriptions</label>
                        </div>
                        <div>
                            <input type="checkbox" id="rss-show-dates" checked> <!-- Default to checked -->
                            <label for="rss-show-dates">Show item publication dates</label>
                        </div>
                        <button id="save-rss-display-options">Save Display Options</button>
                        <p id="rss-display-options-status-message" class="status-message"></p>
                    </section>
                    <hr>
                    <section id="marquee-settings">
                    <h2>Marquee Messages</h2>
                    <div>
                        <label for="new-marquee-message">New Message:</label>
                        <input type="text" id="new-marquee-message" size="50">
                        <button id="add-marquee-message">Add Message</button>
                    </div>
                    <h3>Current Messages:</h3>
                    <ul id="marquee-messages-list">
                        <!-- Messages will be listed here -->
                    </ul>
                    <button id="clear-marquee-messages">Clear All Marquee Messages</button>
                    <p id="marquee-status-message" class="status-message"></p>
                </section>
                <hr>
                <section id="theme-settings">
                    <h2>Theme Settings</h2>
                    <div>
                        <label for="theme-primary-bg-color">Primary Background Color:</label>
                        <input type="color" id="theme-primary-bg-color" data-css-var="--primary-bg-color">
                    </div>
                    <div>
                        <label for="theme-secondary-bg-color">Secondary Background Color:</label>
                        <input type="color" id="theme-secondary-bg-color" data-css-var="--secondary-bg-color">
                    </div>
                    <div>
                        <label for="theme-text-color">Text Color:</label>
                        <input type="color" id="theme-text-color" data-css-var="--text-color">
                    </div>
                    <div>
                        <label for="theme-link-color">Link Color:</label>
                        <input type="color" id="theme-link-color" data-css-var="--link-color">
                    </div>
                    <div>
                        <label for="theme-button-bg-color">Button Background Color:</label>
                        <input type="color" id="theme-button-bg-color" data-css-var="--button-bg-color">
                    </div>
                    <div>
                        <label for="theme-font-family">Font Family:</label>
                        <select id="theme-font-family" data-css-var="--font-family-primary">
                            <option value="Arial, Helvetica, sans-serif">Sans Serif (Arial)</option>
                            <option value='-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'>System Default</option>
                            <option value="Verdana, Geneva, sans-serif">Sans Serif (Verdana)</option>
                            <option value="Georgia, serif">Serif (Georgia)</option>
                            <option value="'Times New Roman', Times, serif">Serif (Times New Roman)</option>
                            <option value="'Courier New', Courier, monospace">Monospace (Courier New)</option>
                            <option value="'Lucida Console', Monaco, monospace">Monospace (Lucida Console)</option>
                        </select>
                    </div>
                    <div style="margin-top: 20px;">
                        <button id="save-theme-settings">Save Theme</button>
                        <button id="reset-default-theme">Reset to Default Theme</button>
                        <p id="theme-status-message" class="status-message"></p>
                    </div>
                </section>
            </div>`;
    }

    postRender() {
        // This logic is moved from settings.js's loadSettingsPage()
        // Ensure settings.js (for getSetting/saveSetting, etc.) and marquee.js (for message functions) are loaded globally.

        // RSS Feed URLs Management
        this.renderRssFeedUrlsList(); // Initial display of saved URLs
        const addNewRssFeedUrlButton = document.getElementById('add-new-rss-feed-url');
        if (addNewRssFeedUrlButton) {
            this.boundAddRssFeedUrl = this.addRssFeedUrl.bind(this);
            addNewRssFeedUrlButton.addEventListener('click', this.boundAddRssFeedUrl);
        }

        // RSS Display Options Logic
        const maxItemsInput = document.getElementById('rss-max-items');
        const showDescCheckbox = document.getElementById('rss-show-descriptions');
        const showDatesCheckbox = document.getElementById('rss-show-dates');
        const saveDisplayOptionsButton = document.getElementById('save-rss-display-options');

        if (maxItemsInput) maxItemsInput.value = getSetting('rssDisplayOptions_maxItems', 10);
        if (showDescCheckbox) showDescCheckbox.checked = getSetting('rssDisplayOptions_showDesc', true);
        if (showDatesCheckbox) showDatesCheckbox.checked = getSetting('rssDisplayOptions_showDates', true);

        if (saveDisplayOptionsButton) {
            this.boundSaveRssDisplayOptions = () => { // Arrow function to bind 'this' if needed, or could be a class method
                const maxItems = parseInt(maxItemsInput.value, 10);
                saveSetting('rssDisplayOptions_maxItems', isNaN(maxItems) || maxItems < 0 ? 0 : maxItems);
                saveSetting('rssDisplayOptions_showDesc', showDescCheckbox.checked);
                saveSetting('rssDisplayOptions_showDates', showDatesCheckbox.checked);
                displayStatusMessage('rss-display-options-status-message', 'Display options saved!');
            };
            saveDisplayOptionsButton.addEventListener('click', this.boundSaveRssDisplayOptions);
        }
        
        // Marquee Messages Logic
        this.renderMarqueeMessagesList(); 
        const addMarqueeBtn = document.getElementById('add-marquee-message');
        const newMarqueeMsgInput = document.getElementById('new-marquee-message');
        if (addMarqueeBtn && newMarqueeMsgInput) {
            addMarqueeBtn.addEventListener('click', () => {
                if (newMarqueeMsgInput.value.trim() !== '') {
                    addMarqueeMessage(newMarqueeMsgInput.value.trim()); // From marquee.js
                    newMarqueeMsgInput.value = '';
                    this.renderMarqueeMessagesList();
                    displayStatusMessage('marquee-status-message', 'Marquee message added!');
                } else {
                    displayStatusMessage('marquee-status-message', 'Message cannot be empty.');
                }
            });
        }
        const clearMarqueeBtn = document.getElementById('clear-marquee-messages');
        if (clearMarqueeBtn) {
            clearMarqueeBtn.addEventListener('click', () => {
                clearAllMarqueeMessages(); // From marquee.js
                this.renderMarqueeMessagesList();
                displayStatusMessage('marquee-status-message', 'All marquee messages cleared!');
            });
        }

        // Theme Settings Logic
        // DEFAULT_THEME_SETTINGS and CONFIGURABLE_THEME_PROPERTIES are from settings.js
        const currentTheme = getSetting('themeSettings', DEFAULT_THEME_SETTINGS);
        CONFIGURABLE_THEME_PROPERTIES.forEach(prop => {
            const inputElement = document.getElementById(prop.id);
            if (inputElement) {
                inputElement.value = currentTheme[prop.cssVar] || DEFAULT_THEME_SETTINGS[prop.cssVar];
            }
        });

        const saveThemeBtn = document.getElementById('save-theme-settings');
        if (saveThemeBtn) {
            saveThemeBtn.addEventListener('click', () => {
                const newThemeSettings = {};
                CONFIGURABLE_THEME_PROPERTIES.forEach(prop => {
                    const inputElement = document.getElementById(prop.id);
                    if (inputElement) newThemeSettings[prop.cssVar] = inputElement.value;
                });
                saveSetting('themeSettings', newThemeSettings);
                applyThemeSettings(newThemeSettings); // From settings.js
                displayStatusMessage('theme-status-message', 'Theme saved!');
            });
        }

        const resetThemeBtn = document.getElementById('reset-default-theme');
        if (resetThemeBtn) {
            resetThemeBtn.addEventListener('click', () => {
                applyThemeSettings(DEFAULT_THEME_SETTINGS); // From settings.js
                saveSetting('themeSettings', DEFAULT_THEME_SETTINGS); // Persist the reset
                // Repopulate inputs with default values
                CONFIGURABLE_THEME_PROPERTIES.forEach(prop => {
                    const inputElement = document.getElementById(prop.id);
                    if (inputElement) inputElement.value = DEFAULT_THEME_SETTINGS[prop.cssVar];
                });
                displayStatusMessage('theme-status-message', 'Theme reset to default!');
            });
        }
    }

    // Helper method, moved from settings.js (or made specific here)
    renderMarqueeMessagesList() {
        // getMarqueeMessages is from marquee.js
        const messages = typeof getMarqueeMessages === 'function' ? getMarqueeMessages() : [];
        const listElement = document.getElementById('marquee-messages-list');
        if (!listElement) {
            console.warn("Element 'marquee-messages-list' not found during renderMarqueeMessagesList.");
            return;
        }

        listElement.innerHTML = ''; // Clear current list
        if (messages.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No messages.';
            listElement.appendChild(li);
        } else {
            messages.forEach(msg => {
                const li = document.createElement('li');
                li.textContent = msg.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                listElement.appendChild(li);
            });
        }
    }
    
    destroy() {
        // Remove event listeners added in postRender.
        // This is crucial to prevent memory leaks if the view is re-rendered.
        // For simplicity, directly query and remove. A more robust system might store listener references.
        const addNewRssFeedUrlButton = document.getElementById('add-new-rss-feed-url');
        if (addNewRssFeedUrlButton && this.boundAddRssFeedUrl) {
             addNewRssFeedUrlButton.removeEventListener('click', this.boundAddRssFeedUrl);
        }
        
        // Cleanup for RSS Remove buttons (if listeners were stored individually)
        if (this.rssRemoveButtonListeners) {
            this.rssRemoveButtonListeners.forEach(entry => {
                entry.element.removeEventListener(entry.type, entry.listener);
            });
            this.rssRemoveButtonListeners = [];
        } else { // Fallback if individual listeners weren't stored (e.g. if renderRssFeedUrlsList was modified)
            const rssFeedList = document.getElementById('rss-feed-urls-list');
            if (rssFeedList) {
                // Replace to remove all listeners from children if specific ones aren't tracked
                rssFeedList.replaceWith(rssFeedList.cloneNode(true));
            }
        }
        
        const saveDisplayOptionsButton = document.getElementById('save-rss-display-options');
        if (saveDisplayOptionsButton && this.boundSaveRssDisplayOptions) {
            saveDisplayOptionsButton.removeEventListener('click', this.boundSaveRssDisplayOptions);
        }

        const addMarqueeBtn = document.getElementById('add-marquee-message');
        if (addMarqueeBtn) addMarqueeBtn.replaceWith(addMarqueeBtn.cloneNode(true));
        
        const clearMarqueeBtn = document.getElementById('clear-marquee-messages');
        if (clearMarqueeBtn) clearMarqueeBtn.replaceWith(clearMarqueeBtn.cloneNode(true));

        const saveThemeBtn = document.getElementById('save-theme-settings');
        if (saveThemeBtn) saveThemeBtn.replaceWith(saveThemeBtn.cloneNode(true));

        const resetThemeBtn = document.getElementById('reset-default-theme');
        if (resetThemeBtn) resetThemeBtn.replaceWith(resetThemeBtn.cloneNode(true));
        
        // console.log('SettingsView destroyed and event listeners cleaned up (via cloning).');
    }

    renderRssFeedUrlsList() {
        const urls = getSetting('rssFeedUrls', []); // Assumes getSetting is available
        const listElement = document.getElementById('rss-feed-urls-list');
        if (!listElement) return;

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
                urlText.style.marginRight = '10px'; // Add some spacing
                li.appendChild(urlText);

                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.classList.add('remove-rss-btn'); // Add class for styling/identification
                removeButton.dataset.url = url; // Store URL for easy removal
                
                // Store the bound function for this specific button
                const boundRemoveRssFeedUrl = () => this.removeRssFeedUrl(url);
                removeButton.addEventListener('click', boundRemoveRssFeedUrl);
                
                // Optionally store this listener for more precise removal in destroy()
                // if not relying on cloneNode for the list.
                if (!this.rssRemoveButtonListeners) this.rssRemoveButtonListeners = [];
                this.rssRemoveButtonListeners.push({element: removeButton, type: 'click', listener: boundRemoveRssFeedUrl});

                li.appendChild(removeButton);
                listElement.appendChild(li);
            });
        }
    }

    addRssFeedUrl() {
        const newUrlInput = document.getElementById('new-rss-feed-url');
        if (!newUrlInput) return;
        const newUrl = newUrlInput.value.trim();

        if (newUrl === '') {
            displayStatusMessage('rss-status-message', 'Please enter a URL.'); // Assumes displayStatusMessage
            return;
        }
        // Basic URL validation (very simple)
        if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
            displayStatusMessage('rss-status-message', 'Invalid URL format. Must start with http:// or https://');
            return;
        }

        const urls = getSetting('rssFeedUrls', []);
        if (urls.includes(newUrl)) {
            displayStatusMessage('rss-status-message', 'This URL is already in the list.');
            return;
        }

        urls.push(newUrl);
        saveSetting('rssFeedUrls', urls); // Assumes saveSetting is available
        this.renderRssFeedUrlsList();
        newUrlInput.value = ''; // Clear input
        displayStatusMessage('rss-status-message', 'RSS Feed URL added!');
    }

    removeRssFeedUrl(urlToRemove) {
        let urls = getSetting('rssFeedUrls', []);
        urls = urls.filter(url => url !== urlToRemove);
        saveSetting('rssFeedUrls', urls);
        this.renderRssFeedUrlsList(); // Re-render the list, which will also re-attach listeners
        displayStatusMessage('rss-status-message', 'RSS Feed URL removed!');
    }
}
