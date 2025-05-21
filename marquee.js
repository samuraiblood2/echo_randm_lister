// marquee.js - Functionality for managing and displaying marquee messages

const MARQUEE_STORAGE_KEY = 'marqueeMessages';
// Using a more specific selector based on the ID of the container and the class of the content.
const MARQUEE_CONTENT_SELECTOR = '#motd-marquee-container .marquee-content';

/**
 * Retrieves marquee messages from localStorage.
 * @returns {string[]} An array of messages, or an empty array if none are found or on error.
 */
function getMarqueeMessages() {
    try {
        const messagesJson = localStorage.getItem(MARQUEE_STORAGE_KEY);
        if (messagesJson) {
            const messages = JSON.parse(messagesJson);
            return Array.isArray(messages) ? messages : [];
        }
        return [];
    } catch (error) {
        console.error("Error getting marquee messages from localStorage:", error);
        return [];
    }
}

/**
 * Adds a new message to the marquee message list in localStorage.
 * @param {string} messageText - The message to add.
 * @returns {boolean} True if successful, false otherwise.
 */
function addMarqueeMessage(messageText) {
    if (typeof messageText !== 'string' || messageText.trim() === "") {
        console.error("Invalid message text provided.");
        return false;
    }
    try {
        const messages = getMarqueeMessages();
        messages.push(messageText.trim());
        localStorage.setItem(MARQUEE_STORAGE_KEY, JSON.stringify(messages));
        updateMarqueeDisplay(); // Update display immediately after adding
        return true;
    } catch (error) {
        console.error("Error adding marquee message to localStorage:", error);
        return false;
    }
}

/**
 * Clears all marquee messages from localStorage.
 */
function clearAllMarqueeMessages() {
    try {
        localStorage.removeItem(MARQUEE_STORAGE_KEY);
        updateMarqueeDisplay(); // Update display immediately after clearing
    } catch (error) {
        console.error("Error clearing marquee messages from localStorage:", error);
    }
}

/**
 * Updates the marquee display with the latest message or a default message.
 */
function updateMarqueeDisplay() {
    const marqueeContentElement = document.querySelector(MARQUEE_CONTENT_SELECTOR);

    if (marqueeContentElement) {
        const messages = getMarqueeMessages();
        if (messages.length > 0) {
            // Display the most recent message (last one in the array)
            marqueeContentElement.textContent = messages[messages.length - 1];
        } else {
            // Display a default message if no messages are stored
            // This will override the initial "Welcome!" message set by loadMarquee() if localStorage is empty.
            marqueeContentElement.textContent = "No current messages. Stay tuned!";
        }
    } else {
        // This might occur if updateMarqueeDisplay is called before loadMarquee has created the element.
        // The DOMContentLoaded listener for loadMarquee should ideally run first or create the element structure synchronously.
        // However, marquee.js has its own DOMContentLoaded listener.
        console.warn("Marquee content element not found during updateMarqueeDisplay. It might not have been created yet.");
    }
}

// Initialize marquee display when the DOM is ready.
// This ensures that content from localStorage is loaded as soon as the marquee structure might be available.
document.addEventListener('DOMContentLoaded', function() {
    // updateMarqueeDisplay will be called.
    // Note: loadMarquee() in utils.js also runs on DOMContentLoaded (called from HTMLs).
    // The order of these listeners isn't strictly guaranteed but usually follows script inclusion order.
    // If marquee.js is included before the inline script calling loadMarquee,
    // updateMarqueeDisplay might run before the element exists.
    // The console.warn in updateMarqueeDisplay handles this.
    // A more robust solution might be to have loadMarquee call updateMarqueeDisplay after creating elements,
    // or use a custom event. For now, this separate listener is per instructions.
    updateMarqueeDisplay();
});

// Example usage (for testing in browser console):
// addMarqueeMessage("This is a test message!");
// addMarqueeMessage("Another exciting update coming soon.");
// console.log(getMarqueeMessages());
// clearAllMarqueeMessages();
