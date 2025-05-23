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
    xhr.responseType = 'text';

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            console.log('fetchRSS: Success - Status:', xhr.status, 'Response length:', xhr.responseText.length);
            // console.log('fetchRSS: Response XML:', xhr.responseText); // Potentially very long, use with caution
            callback(null, xhr.responseText);
        } else {
            console.error('fetchRSS: Error - Status:', xhr.status, xhr.statusText);
            callback(new Error('Failed to fetch RSS feed. Status: ' + xhr.status + ' ' + xhr.statusText + '. This might be due to CORS restrictions on the server or the feed URL being incorrect.'), null);
        }
    };

    xhr.onerror = function() {
        console.error('fetchRSS: Network Error.');
        callback(new Error('Failed to fetch RSS feed due to a network error. This could be a network issue or a CORS block. Check browser console for more details.'), null);
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
 * @returns {object} An object like { items: [], error?: string, details?: string }.
 */
function parseRSS(xmlString) {
    console.log('parseRSS: Input XML string length:', xmlString ? xmlString.length : 'null');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");

    const parserError = xmlDoc.querySelector("parsererror");
    if (parserError) {
        console.error("parseRSS: XML parsing error:", parserError.textContent);
        return { error: "Failed to parse XML.", details: parserError.textContent, items: [] }; // Return structured error
    }

    let itemsNodeList = xmlDoc.querySelectorAll("item"); // RSS
    let isAtom = false;
    if (itemsNodeList.length === 0) {
        itemsNodeList = xmlDoc.querySelectorAll("entry"); // Atom
        console.log('parseRSS: No <item> found, found <entry> count:', itemsNodeList.length);
        if(itemsNodeList.length > 0) isAtom = true;
    } else {
        console.log('parseRSS: Found <item> count:', itemsNodeList.length);
    }

    const feedItems = [];
    itemsNodeList.forEach(itemNode => {
        const title = itemNode.querySelector("title") ? itemNode.querySelector("title").textContent.trim() : "No title";
        
        let link = '';
        const linkElement = itemNode.querySelector("link");
        if (linkElement) {
            link = (isAtom ? linkElement.getAttribute('href') : linkElement.textContent)?.trim() || '';
        }
        
        let description = "";
        if (isAtom) {
            const summary = itemNode.querySelector("summary")?.textContent.trim() || "";
            const content = itemNode.querySelector("content")?.textContent.trim() || "";
            description = summary || content;
        } else {
            description = itemNode.querySelector("description")?.textContent.trim() || "";
        }
        // Basic sanitization/truncation
        description = description.replace(/<[^>]+>/g, '').substring(0, 200) + (description.length > 200 ? '...' : '');
        if (description.trim() === "..." || description.trim() === "") description = "No description.";


        const pubDate = itemNode.querySelector("pubDate")?.textContent.trim() || 
                        itemNode.querySelector("published")?.textContent.trim() || 
                        itemNode.querySelector("updated")?.textContent.trim() || "No date";

        feedItems.push({ title, link, description, pubDate });
    });

    if (itemsNodeList.length > 0 && feedItems.length > 0) {
       console.log('parseRSS: First parsed item:', JSON.stringify(feedItems[0], null, 2));
    } else if (itemsNodeList.length > 0 && feedItems.length === 0) {
       console.warn('parseRSS: Items found in XML, but no data extracted. Check selectors or item structure.');
    }
    console.log('parseRSS: Returning feedItems count:', feedItems.length);
    return { items: feedItems }; // Return object with items array
}

/**
 * Displays parsed feed items in a specified container element.
 * @param {object[]} feedItems - Array of feed item objects.
 * @param {string} containerElementId - The ID of the DOM element to display the feed in.
 */
function displayRSSFeed(feedItems, containerElementId) {
    console.log('displayRSSFeed: Displaying items in container:', containerElementId, 'Item count:', feedItems ? feedItems.length : 'null/undefined');
    const container = getElement(containerElementId); // From utils.js
    if (!container) {
        console.error(`Feed container element '${containerElementId}' not found.`);
        return;
    }

    clearElement(containerElementId); // From utils.js

    if (!feedItems || feedItems.length === 0) {
        setElementHTML(containerElementId, "<p>No feed items to display.</p>"); // Updated message
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
