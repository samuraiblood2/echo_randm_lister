// rss_reader.js - Functions for fetching, parsing, and displaying RSS/Atom feeds.

/**
 * Fetches an RSS/Atom feed from the given URL.
 * Note: This function is subject to CORS (Cross-Origin Resource Sharing) restrictions.
 * If the feed server doesn't allow requests from this origin, the fetch will fail.
 * A server-side proxy might be needed for arbitrary feed URLs.
 *
 * @param {string} feedUrl - The URL of the RSS/Atom feed.
 * @param {function} callback - A callback function (error, data) => {}.
 */
function fetchRSS(feedUrl, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', feedUrl, true);
    // Setting responseType to 'text' to get the XML as a string.
    // DOMParser will be used later.
    xhr.responseType = 'text';

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                callback(null, xhr.responseText);
            } else {
                callback(new Error(`Failed to fetch RSS feed. Status: ${xhr.status}`), null);
            }
        }
    };

    xhr.onerror = function() {
        // This handles network errors (e.g., DNS resolution failure, server unreachable).
        callback(new Error('Network error while fetching RSS feed.'), null);
    };

    try {
        xhr.send();
    } catch (error) {
        // This might catch synchronous errors if xhr.send() itself throws one (rare).
        callback(new Error(`Error sending request for RSS feed: ${error.message}`), null);
    }
}

/**
 * Parses an XML string (RSS or Atom feed) into an array of feed item objects.
 * @param {string} xmlString - The XML string to parse.
 * @returns {object[]} An array of feed items { title, link, description, pubDate }.
 */
function parseRSS(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");

    // Check for parser errors (common way browsers indicate this)
    const parserError = xmlDoc.querySelector("parsererror");
    if (parserError) {
        console.error("Error parsing XML:", parserError.textContent);
        return []; // Return empty array on parsing error
    }

    let items = [];
    // Try RSS <item> elements first
    let feedItems = xmlDoc.querySelectorAll("item");

    if (feedItems.length === 0) {
        // If no <item>, try Atom <entry> elements
        feedItems = xmlDoc.querySelectorAll("entry");
        feedItems.forEach(itemNode => {
            const title = itemNode.querySelector("title")?.textContent || "";
            const linkNode = itemNode.querySelector("link");
            const link = linkNode?.getAttribute("href") || linkNode?.textContent || "";
            // Atom might have content in <summary> or <content>
            const summary = itemNode.querySelector("summary")?.textContent || "";
            const content = itemNode.querySelector("content")?.textContent || "";
            const description = summary || content; // Prefer summary, fallback to content
            const pubDate = itemNode.querySelector("published")?.textContent || itemNode.querySelector("updated")?.textContent || "";
            items.push({ title, link, description: description.substring(0, 200) + (description.length > 200 ? "..." : ""), pubDate });
        });
    } else {
        // Process RSS <item> elements
        feedItems.forEach(itemNode => {
            const title = itemNode.querySelector("title")?.textContent || "";
            const link = itemNode.querySelector("link")?.textContent || "";
            const description = itemNode.querySelector("description")?.textContent || "";
            const pubDate = itemNode.querySelector("pubDate")?.textContent || "";
            // Simple text extraction and truncation for description
            items.push({ title, link, description: description.substring(0, 200) + (description.length > 200 ? "..." : ""), pubDate });
        });
    }
    
    return items;
}

/**
 * Displays parsed feed items in a specified container element.
 * @param {object[]} feedItems - Array of feed item objects.
 * @param {string} containerElementId - The ID of the DOM element to display the feed in.
 */
function displayRSSFeed(feedItems, containerElementId) {
    const container = getElement(containerElementId); // From utils.js
    if (!container) {
        console.error(`Feed container element '${containerElementId}' not found.`);
        return;
    }

    clearElement(containerElementId); // From utils.js

    if (!feedItems || feedItems.length === 0) {
        setElementHTML(containerElementId, "<p>No feed items to display or feed is empty.</p>"); // From utils.js
        return;
    }

    feedItems.forEach(item => {
        const article = document.createElement('article');
        
        const titleElement = document.createElement('h2');
        const linkElement = document.createElement('a');
        linkElement.href = item.link;
        linkElement.target = "_blank"; // Open in new tab
        linkElement.rel = "noopener noreferrer"; // Security best practice
        linkElement.textContent = item.title || "Untitled";
        titleElement.appendChild(linkElement);
        
        const dateElement = document.createElement('p');
        dateElement.className = 'feed-item-date';
        dateElement.textContent = item.pubDate ? new Date(item.pubDate).toLocaleString() : "No date";
        
        const descriptionElement = document.createElement('p');
        descriptionElement.className = 'feed-item-description';
        // Basic text sanitization: just display textContent to avoid rendering HTML from description
        // More robust sanitization might be needed if HTML rendering is desired.
        descriptionElement.textContent = item.description || "No description.";

        article.appendChild(titleElement);
        article.appendChild(dateElement);
        article.appendChild(descriptionElement);
        
        container.appendChild(article); // Append the constructed article element
    });
}

// Example usage (can be called from another script after loading an RSS feed URL from settings):
// const RSS_FEED_URL_KEY = 'rssFeedUrl';
// document.addEventListener('DOMContentLoaded', () => {
//     const savedFeedUrl = getSetting(RSS_FEED_URL_KEY);
//     if (savedFeedUrl) {
//         fetchRSS(savedFeedUrl, (err, xmlString) => {
//             if (err) {
//                 console.error("Error fetching or parsing RSS:", err);
//                 const textContainer = getElement('text'); // Assuming 'text' is the ID of your main content area
//                 if (textContainer) {
//                     setElementHTML('text', `<p class="error">Failed to load RSS feed: ${err.message}</p>`);
//                 }
//                 return;
//             }
//             const items = parseRSS(xmlString);
//             displayRSSFeed(items, 'text'); // Display in the div with ID 'text'
//         });
//     } else {
//         // Optionally display a message if no feed URL is set
//         const textContainer = getElement('text');
//         if (textContainer) {
//             setElementHTML('text', '<p>No RSS feed URL configured. Please set one in Settings.</p>');
//         }
//     }
// });
