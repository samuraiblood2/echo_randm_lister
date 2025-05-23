// marquee.js - Functionality for managing and displaying marquee messages

const MARQUEE_STORAGE_KEY = 'marqueeMessages';
// Using a more specific selector based on the ID of the container and the class of the content.
const MARQUEE_CONTENT_SELECTOR = '#motd-marquee-container .marquee-content';
const MARQUEE_ROTATION_DELAY = 5000; // 5 seconds

let currentMessageIndex = 0;
let marqueeIntervalId = null;

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
    // Clear any existing interval
    if (marqueeIntervalId !== null) {
        clearInterval(marqueeIntervalId);
        marqueeIntervalId = null;
    }

    const marqueeContentElement = document.querySelector(MARQUEE_CONTENT_SELECTOR);
    if (!marqueeContentElement) {
        // This might occur if updateMarqueeDisplay is called before loadMarquee has created the element.
        console.warn("Marquee content element not found during updateMarqueeDisplay. It might not have been created yet.");
        return;
    }

    const messages = getMarqueeMessages();

    if (messages.length === 0) {
        marqueeContentElement.textContent = "No current messages. Stay tuned!";
        currentMessageIndex = 0; // Reset index
    } else if (messages.length === 1) {
        marqueeContentElement.textContent = messages[0];
        currentMessageIndex = 0; // Only one message, so index is 0
    } else {
        // Multiple messages, start rotation
        currentMessageIndex = 0; // Always start from the first message on update
        marqueeContentElement.textContent = messages[currentMessageIndex];

        marqueeIntervalId = setInterval(() => {
            currentMessageIndex = (currentMessageIndex + 1) % messages.length;
            // Re-query the element inside interval in case DOM was manipulated, though less likely for marquee
            const currentMarqueeElement = document.querySelector(MARQUEE_CONTENT_SELECTOR);
            if (currentMarqueeElement) {
                // Optional: Add a fade-out/fade-in transition here for smoother change
                currentMarqueeElement.textContent = messages[currentMessageIndex];
            } else {
                // If element disappears, clear interval
                clearInterval(marqueeIntervalId);
                marqueeIntervalId = null;
            }
        }, MARQUEE_ROTATION_DELAY);
    }
}

// Example usage (for testing in browser console):
// addMarqueeMessage("This is a test message!");
// addMarqueeMessage("Another exciting update coming soon.");
// console.log(getMarqueeMessages());
// clearAllMarqueeMessages();
