// settings.js - Core functions for saving and retrieving application settings, and theme management

const DEFAULT_THEME_SETTINGS = {
    '--font-family-primary': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    '--primary-bg-color': '#2c2f33',        // Darker gray
    '--secondary-bg-color': '#36393f',      // Slightly lighter for containers
    '--navbar-bg-color': '#23272a',         // Even darker for navbar
    '--text-color': '#e0e0e0',              // Light gray for general text
    '--heading-text-color': '#ffffff',      // White for headings
    '--link-color': '#7289da',              // Discord-like blue/purple
    // '--nav-link-color': '#e0e0e0', // Replaced by navbar-text-color
    // '--nav-active-bg-color': '#7289da', // Replaced by navbar-text-active-color and navbar-border-active-color
    '--navbar-text-color': '#e0e0e0',         // Default navbar link text color
    '--navbar-text-hover-color': '#ffffff',   // Navbar link text color on hover
    '--navbar-text-active-color': '#7289da',  // Navbar link text color when active (e.g., Discord blue)
    '--navbar-border-active-color': '#7289da',// Navbar link bottom border color when active/hover (e.g., Discord blue)
    '--button-bg-color': '#7289da',         // Button color matching link color
    '--button-hover-bg-color': '#5b6eae',   // Slightly darker/desaturated version of button color
    '--error-text-color': '#f04747',        // More vibrant red for errors
    '--success-text-color': '#43b581',      // Vibrant green for success
    '--winner-text-color': '#43b581',       // Use success color for winners for consistency
    '--border-color-light': '#4f545c',      // For subtle borders on containers
    '--border-color-medium': '#40444b',     // For input field borders
    '--marquee-bg-color': '#23272a',         // Match navbar background
    '--marquee-text-color': '#b0b0b0'       // Softer text for marquee
};

const CONFIGURABLE_THEME_PROPERTIES = [
   { id: 'theme-primary-bg-color', cssVar: '--primary-bg-color', type: 'color' },
   { id: 'theme-secondary-bg-color', cssVar: '--secondary-bg-color', type: 'color' },
   { id: 'theme-text-color', cssVar: '--text-color', type: 'color' },
   { id: 'theme-link-color', cssVar: '--link-color', type: 'color' },
   { id: 'theme-button-bg-color', cssVar: '--button-bg-color', type: 'color' },
   { id: 'theme-navbar-text-color', cssVar: '--navbar-text-color', type: 'color' },
   { id: 'theme-navbar-text-hover-color', cssVar: '--navbar-text-hover-color', type: 'color' },
   { id: 'theme-navbar-text-active-color', cssVar: '--navbar-text-active-color', type: 'color' },
   { id: 'theme-navbar-border-active-color', cssVar: '--navbar-border-active-color', type: 'color' },
   { id: 'theme-font-family', cssVar: '--font-family-primary', type: 'select' }
];

/**
 * Saves a setting to localStorage.
 * The value will be JSON.stringified before saving.
 * @param {string} key - The key under which to save the setting.
 * @param {*} value - The value to save. Can be any type that can be JSON.stringified.
 * @returns {boolean} True if saving was successful, false otherwise.
 */
function saveSetting(key, value) {
    if (typeof key !== 'string' || key.trim() === "") {
        console.error("Error saving setting: Key must be a non-empty string.");
        return false;
    }
    try {
        const stringifiedValue = JSON.stringify(value);
        localStorage.setItem(key, stringifiedValue);
        // console.log(`Setting saved: {${key}: ${stringifiedValue}}`); // Optional: for debugging
        return true;
    } catch (error) {
        console.error(`Error saving setting with key "${key}":`, error);
        // This could be due to JSON.stringify failing or localStorage quota issues.
        return false;
    }
}

/**
 * Retrieves a setting from localStorage.
 * The value will be parsed from JSON.
 * @param {string} key - The key of the setting to retrieve.
 * @param {*} [defaultValue=null] - The default value to return if the key is not found or parsing fails.
 * @returns {*} The retrieved value, or the defaultValue.
 */
function getSetting(key, defaultValue = null) {
    if (typeof key !== 'string' || key.trim() === "") {
        console.error("Error getting setting: Key must be a non-empty string.");
        return defaultValue;
    }
    try {
        const stringifiedValue = localStorage.getItem(key);
        if (stringifiedValue === null) {
            // Key not found in localStorage
            return defaultValue;
        }
        // console.log(`Retrieved string for key "${key}": ${stringifiedValue}`); // Optional: for debugging
        return JSON.parse(stringifiedValue);
    } catch (error) {
        console.error(`Error getting or parsing setting with key "${key}":`, error);
        // This could be due to JSON.parse failing.
        return defaultValue;
    }
}

// Example usage (for testing in browser console):
// saveSetting('userTheme', { name: 'dark', accentColor: '#007bff' });
// console.log(getSetting('userTheme'));
// console.log(getSetting('nonExistentKey', 'default fallback value'));
// saveSetting('testNumber', 123);
// console.log(getSetting('testNumber'));
// saveSetting('testBoolean', true);
// console.log(getSetting('testBoolean'));
// saveSetting('testArray', [1, 'test', { nested: true }]);
// console.log(getSetting('testArray'));

// NOTE: loadSettingsPage() and renderMarqueeMessagesList() have been moved 
// into SettingsView.js as they are specific to the settings page UI.

/**
 * Helper function to display a status message and clear it after a specified duration.
 * @param {string} elementId - The ID of the status message element.
 * @param {string} message - The message to display.
 * @param {number} [duration=3000] - How long to display the message in milliseconds.
 */
function displayStatusMessage(elementId, message, duration = 3000) {
    const statusElement = getElement(elementId);
    if (statusElement) {
        setElementHTML(elementId, message);
        setTimeout(() => {
            clearElement(elementId);
        }, duration);
    }
}

// renderMarqueeMessagesList() has been moved to SettingsView.js
// loadSettingsPage() has been moved to SettingsView.js (as postRender logic)


/**
 * Applies a given theme settings object to the document's root element.
 * @param {object} settingsObject - An object where keys are CSS variable names and values are their desired values.
 */
function applyThemeSettings(settingsObject) {
    const settingsToApply = settingsObject || DEFAULT_THEME_SETTINGS;
    for (const key in settingsToApply) {
        if (Object.prototype.hasOwnProperty.call(settingsToApply, key)) {
            document.documentElement.style.setProperty(key, settingsToApply[key]);
        }
    }
}

/**
 * Loads saved theme settings from localStorage and applies them.
 * If no settings are saved, applies the default theme.
 */
function loadAndApplyInitialTheme() {
    const savedThemeSettings = getSetting('themeSettings', DEFAULT_THEME_SETTINGS);
    applyThemeSettings(savedThemeSettings);
}

// Apply the initial theme as soon as this script is parsed.
loadAndApplyInitialTheme();
