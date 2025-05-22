// SettingsView.js
class SettingsView extends BaseView {
    constructor() {
        super();
    }

    render() {
        // HTML structure from settings.html's <div id="settings-content">
        // Using template literals for multi-line HTML.
        return `
            <h1>Settings</h1>
            <div id="settings-content-wrapper"> <!-- New wrapper for content within the view -->
                <section id="rss-settings">
                    <h2>RSS Feed Settings</h2>
                    <label for="rss-url">RSS Feed URL:</label>
                    <input type="text" id="rss-url" name="rss-url" size="50">
                    <button id="save-rss-url">Save RSS URL</button>
                    <p id="rss-status-message" class="status-message"></p>
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

        // RSS URL Logic
        const rssUrlInput = document.getElementById('rss-url');
        if (rssUrlInput) {
            rssUrlInput.value = getSetting('rssFeedUrl', '');
        }
        const saveRssBtn = document.getElementById('save-rss-url');
        if (saveRssBtn && rssUrlInput) { // Ensure rssUrlInput is also available
            saveRssBtn.addEventListener('click', () => {
                saveSetting('rssFeedUrl', rssUrlInput.value); // rssUrlInput is in scope
                displayStatusMessage('rss-status-message', 'RSS URL saved!');
            });
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
        const saveRssBtn = document.getElementById('save-rss-url');
        if (saveRssBtn) saveRssBtn.replaceWith(saveRssBtn.cloneNode(true)); // Simple way to remove all listeners

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
}
