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
                    <div class="settings-tabs" role="tablist">
                        <button role="tab" aria-selected="true" aria-controls="rss-settings-panel" id="rss-tab">RSS Settings</button>
                        <button role="tab" aria-selected="false" aria-controls="marquee-settings-panel" id="marquee-tab">Marquee Settings</button>
                        <button role="tab" aria-selected="false" aria-controls="theme-settings-panel" id="theme-tab">Theme Settings</button>
                    </div>

                    <div id="rss-settings-panel" role="tabpanel" aria-labelledby="rss-tab">
                        <section id="rss-settings">
                            <h2>RSS Feed Settings</h2>
                            <div class="setting-entry">
                                <label for="new-rss-feed-url">Add RSS Feed URL:</label>
                                <input type="text" id="new-rss-feed-url" name="new-rss-feed-url" size="50" placeholder="Enter feed URL">
                                <button id="add-new-rss-feed-url">Add Feed</button>
                            </div>
                            <fieldset class="settings-group">
                                <legend>Configured Feeds</legend>
                                <ul id="rss-feed-urls-list">
                                    <!-- Feed URLs will be listed here by JavaScript -->
                                </ul>
                                <p id="rss-status-message" class="status-message" style="margin-bottom: 20px;"></p>
                            </fieldset>
                            
                            <fieldset class="settings-group">
                                <legend>Display Options</legend>
                                <div class="setting-entry">
                                    <label for="rss-max-items">Max items per feed (0 for all):</label>
                                    <input type="number" id="rss-max-items" min="0" value="10">
                                </div>
                                <div class="setting-entry">
                                    <input type="checkbox" id="rss-show-descriptions" checked>
                                    <label for="rss-show-descriptions">Show item descriptions</label>
                                </div>
                                <div class="setting-entry">
                                    <input type="checkbox" id="rss-show-dates" checked>
                                    <label for="rss-show-dates">Show item publication dates</label>
                                </div>
                                <button id="save-rss-display-options">Save Display Options</button>
                                <p id="rss-display-options-status-message" class="status-message"></p>
                            </fieldset>
                        </section>
                    </div>
                    <div id="marquee-settings-panel" role="tabpanel" aria-labelledby="marquee-tab" class="hidden">
                        <section id="marquee-settings">
                            <h2>Marquee Messages</h2>
                            <div class="setting-entry">
                                <label for="new-marquee-message">New Message:</label>
                                <input type="text" id="new-marquee-message" size="50">
                                <button id="add-marquee-message">Add Message</button>
                            </div>
                            <fieldset class="settings-group">
                                <legend>Current Messages</legend>
                                <ul id="marquee-messages-list">
                                    <!-- Messages will be listed here -->
                                </ul>
                                <button id="clear-marquee-messages">Clear All Marquee Messages</button>
                                <p id="marquee-status-message" class="status-message"></p>
                            </fieldset>
                        </section>
                    </div>
                    <div id="theme-settings-panel" role="tabpanel" aria-labelledby="theme-tab" class="hidden">
                        <section id="theme-settings">
                            <h2>Theme Settings</h2>
                            <fieldset class="settings-group">
                                <legend>Color Palette</legend>
                                <div class="setting-entry">
                                    <label for="theme-primary-bg-color">Primary Background Color:</label>
                                    <input type="color" id="theme-primary-bg-color" data-css-var="--primary-bg-color">
                                </div>
                                <div class="setting-entry">
                                    <label for="theme-secondary-bg-color">Secondary Background Color:</label>
                                    <input type="color" id="theme-secondary-bg-color" data-css-var="--secondary-bg-color">
                                </div>
                                <div class="setting-entry">
                                    <label for="theme-text-color">Text Color:</label>
                                    <input type="color" id="theme-text-color" data-css-var="--text-color">
                                </div>
                                <div class="setting-entry">
                                    <label for="theme-link-color">Link Color:</label>
                                    <input type="color" id="theme-link-color" data-css-var="--link-color">
                                </div>
                                <div class="setting-entry">
                                    <label for="theme-button-bg-color">Button Background Color:</label>
                                    <input type="color" id="theme-button-bg-color" data-css-var="--button-bg-color">
                                </div>
                            </fieldset>
                            <fieldset class="settings-group">
                                <legend>Navbar Colors</legend>
                                <div class="setting-entry">
                                    <label for="theme-navbar-text-color">Navbar Link Text Color:</label>
                                    <input type="color" id="theme-navbar-text-color" data-css-var="--navbar-text-color">
                                </div>
                                <div class="setting-entry">
                                    <label for="theme-navbar-text-hover-color">Navbar Link Hover Text Color:</label>
                                    <input type="color" id="theme-navbar-text-hover-color" data-css-var="--navbar-text-hover-color">
                                </div>
                                <div class="setting-entry">
                                    <label for="theme-navbar-text-active-color">Navbar Link Active Text Color:</label>
                                    <input type="color" id="theme-navbar-text-active-color" data-css-var="--navbar-text-active-color">
                                </div>
                                <div class="setting-entry">
                                    <label for="theme-navbar-border-active-color">Navbar Link Active Border Color:</label>
                                    <input type="color" id="theme-navbar-border-active-color" data-css-var="--navbar-border-active-color">
                                </div>
                            </fieldset>
                            <fieldset class="settings-group">
                                <legend>Font Settings</legend>
                                <div class="setting-entry">
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
                            </fieldset>
                            <div class="setting-entry" style="margin-top: 20px;"> <!-- Main action buttons for the theme panel -->
                                <button id="save-theme-settings">Save Theme</button>
                                <button id="reset-default-theme">Reset to Default Theme</button>
                                <p id="theme-status-message" class="status-message"></p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>`;
    }

    postRender() {
        this.setupTabs(); // Call new method to handle tab logic

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
            this.boundSaveRssDisplayOptions = () => { 
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
            displayStatusMessage('rss-status-message', 'Please enter a URL.');
            return;
        }
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
        saveSetting('rssFeedUrls', urls);
        this.renderRssFeedUrlsList();
        newUrlInput.value = ''; // Clear input
        displayStatusMessage('rss-status-message', 'RSS Feed URL added!');
    }

    removeRssFeedUrl(urlToRemove) {
        let urls = getSetting('rssFeedUrls', []);
        urls = urls.filter(url => url !== urlToRemove);
        saveSetting('rssFeedUrls', urls);
        this.renderRssFeedUrlsList(); // Re-render the list
        displayStatusMessage('rss-status-message', 'RSS Feed URL removed!');
    }

    setupTabs() {
        const tabButtons = document.querySelectorAll('.settings-tabs button[role="tab"]');
        const tabPanels = document.querySelectorAll('div[role="tabpanel"]');

        // Set initial state: first tab active, others hidden (already done in HTML for panels)
        // Ensure first tab button has aria-selected="true" (already in HTML)
        // Ensure corresponding panel is visible (remove 'hidden' class if present)
        // const initialActivePanelId = document.querySelector('.settings-tabs button[aria-selected="true"]').getAttribute('aria-controls');
        // document.getElementById(initialActivePanelId)?.classList.remove('hidden');
        // Make sure the first tab and its panel are active by default.
        if (tabButtons.length > 0) {
            const firstTab = tabButtons[0];
            firstTab.setAttribute('aria-selected', 'true');
            const firstPanelId = firstTab.getAttribute('aria-controls');
            const firstPanel = document.getElementById(firstPanelId);
            if (firstPanel) {
                firstPanel.classList.remove('hidden');
            }

            // Hide other panels
            tabPanels.forEach(panel => {
                if (panel.id !== firstPanelId) {
                    panel.classList.add('hidden');
                }
            });
        }


        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Deactivate all tabs and hide all panels
                tabButtons.forEach(btn => {
                    btn.setAttribute('aria-selected', 'false');
                });
                tabPanels.forEach(panel => {
                    panel.classList.add('hidden'); // Add 'hidden' class to hide
                });

                // Activate the clicked tab and show its panel
                button.setAttribute('aria-selected', 'true');
                const panelId = button.getAttribute('aria-controls');
                document.getElementById(panelId)?.classList.remove('hidden'); // Remove 'hidden' class to show
            });
        });
    }
}
