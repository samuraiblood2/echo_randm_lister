// main.js - Logic for index.html, primarily to load and display the configured RSS feed.

// Functions used from other files:
// - utils.js: getElement, setElementHTML
// - settings.js: getSetting
// - rss_reader.js: fetchRSS, parseRSS, displayRSSFeed

function main() {
    const textContainerId = 'text'; // ID of the div where content will be displayed
    const rssFeedUrl = getSetting('rssFeedUrl'); // From settings.js

    // Clear the <h1>Home Page</h1> placeholder first
    // Note: displayRSSFeed also clears its container, but this handles the initial state.
    const textContainer = getElement(textContainerId);
    if (textContainer) {
        // Instead of clearing everything, let's remove the initial H1 if the feed is to be loaded.
        // Or, if no feed, we update the content.
        // For now, let's clear it to make way for feed or messages.
        // The <h1>Home Page</h1> was in index.html, not loaded by JS.
        // So, if we want to replace it, we use setElementHTML.
        // If we are *adding* to it, we use appendToElement.
        // The task implies replacing the content of div#text.
    } else {
        console.error(`Container element with ID '${textContainerId}' not found. Cannot display RSS feed or messages.`);
        return; // Stop if the main container is missing
    }


    if (!rssFeedUrl || rssFeedUrl.trim() === "") {
        setElementHTML(textContainerId, '<p>RSS Feed URL not configured. Please set it in the <a href="./settings.html">Settings</a> page.</p>');
    } else {
        // Display a loading message while fetching
        setElementHTML(textContainerId, '<p>Loading RSS feed...</p>');

        fetchRSS(rssFeedUrl, function(error, xmlData) {
            if (error) {
                console.error("Error fetching RSS feed:", error);
                setElementHTML(textContainerId, `<p class="error">Error fetching RSS feed: ${error.message}. Check the URL or try again later. Ensure the feed supports CORS if it's from a different domain.</p>`);
            } else if (xmlData) {
                const items = parseRSS(xmlData); // From rss_reader.js
                if (!items || items.length === 0) {
                    // parseRSS returns [] on error or if no items.
                    setElementHTML(textContainerId, '<p class="error">Error parsing RSS feed or the feed is empty.</p>');
                } else {
                    // displayRSSFeed will clear the container before adding items.
                    displayRSSFeed(items, textContainerId); // From rss_reader.js
                }
            } else {
                // Should not happen if error is null, but as a safeguard
                setElementHTML(textContainerId, '<p class="error">Unknown error occurred while fetching RSS feed.</p>');
            }
        });
    }
}

// The old fetchAndDisplayContent function and CONTENT_FILE_PATH constant are removed.

