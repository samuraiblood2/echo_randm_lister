// RssFeedView.js

class RssFeedView extends BaseView {
    constructor() {
        super();
        this.contentContainerId = 'text'; // The ID of the div where RSS content goes, matches old #text div
    }

    render() {
        // Return the basic HTML structure for the RSS feed area, wrapped in page-container.
        // The actual feed content will be loaded in postRender.
        // The h1 title was already added in the previous step.
        return `
            <div class="page-container">
                <h1>RSS Feed</h1>
                <div id="${this.contentContainerId}"> 
                    <p>Loading RSS feed...</p>
                </div>
            </div>`;
    }

    postRender() {
        const feedUrls = typeof getSetting === 'function' ? getSetting('rssFeedUrls', []) : [];
        const rssDisplayElement = document.getElementById(this.contentContainerId);

        if (!rssDisplayElement) {
            console.error(`RSS display element with ID '${this.contentContainerId}' not found.`);
            return;
        }

        const displayOptions = {
            maxItems: getSetting('rssDisplayOptions_maxItems', 10), // Default 10
            showDesc: getSetting('rssDisplayOptions_showDesc', true), // Default true
            showDates: getSetting('rssDisplayOptions_showDates', true)  // Default true
        };

        if (!feedUrls || !Array.isArray(feedUrls) || feedUrls.length === 0) {
            rssDisplayElement.innerHTML = '<p>No RSS feeds configured. Please add some in the <a href="#settings">Settings</a> page.</p>';
            return;
        }

        // Check for necessary functions
        if (typeof fetchRSS !== 'function' || typeof parseRSS !== 'function') {
            rssDisplayElement.innerHTML = '<p class="error">Error: RSS reader functions not available. Ensure rss_reader.js is loaded.</p>';
            console.error('RSS reader functions (fetchRSS, parseRSS) not found.');
            return;
        }
        
        rssDisplayElement.innerHTML = `<p>Loading ${feedUrls.length} RSS feed(s)...</p>`;
        let allRenderedItemsHTML = ''; // Accumulate HTML for all feeds

        const fetchPromises = feedUrls.map(url => {
            return new Promise((resolve) => {
                fetchRSS(url, (error, xmlData) => {
                    if (error) {
                        resolve({ url: url, error: error.message, items: [] });
                        return;
                    }
                    if (xmlData) {
                        const parseResult = parseRSS(xmlData); // parseRSS returns { items: [], error?: string }
                        if (parseResult.error) {
                            resolve({ url: url, error: 'Error parsing feed: ' + parseResult.error, items: [] });
                        } else {
                            resolve({ url: url, items: parseResult.items || [] });
                        }
                    } else {
                        resolve({ url: url, error: 'Empty response from feed.', items: [] });
                    }
                });
            });
        });

        Promise.allSettled(fetchPromises).then(results => {
            clearElement(this.contentContainerId); // Clear "Loading feeds..." message

            let hasContent = false;
            results.forEach(result => {
                if (result.status === 'fulfilled') {
                    const feedData = result.value;
                    // Sanitize URL before displaying it as a header
                    const sanitizedUrl = feedData.url.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    allRenderedItemsHTML += `<h2>Feed: ${sanitizedUrl}</h2>`; 
                    
                    if (feedData.error) {
                        allRenderedItemsHTML += `<p class="error">Could not load items from this feed: ${feedData.error.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`;
                    } else if (feedData.items.length === 0) {
                        allRenderedItemsHTML += `<p>No items found in this feed.</p>`;
                    } else {
                        let itemsToDisplay = feedData.items;
                        if (displayOptions.maxItems > 0 && itemsToDisplay.length > displayOptions.maxItems) {
                            itemsToDisplay = itemsToDisplay.slice(0, displayOptions.maxItems);
                        }

                        itemsToDisplay.forEach(item => {
                            const title = item.title ? item.title.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "No title";
                            const link = item.link || "#";
                            const pubDate = item.pubDate ? item.pubDate.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "No date";
                            const description = item.description || "No description."; // Already sanitized by parseRSS

                            allRenderedItemsHTML += `
                                <article class="rss-item">
                                    <h3><a href="${link}" target="_blank" rel="noopener noreferrer">${title}</a></h3>`;
                            if (displayOptions.showDates) {
                                allRenderedItemsHTML += `<p class="feed-item-date">${pubDate}</p>`;
                            }
                            if (displayOptions.showDesc) {
                                allRenderedItemsHTML += `<p class="feed-item-description">${description}</p>`;
                            }
                            allRenderedItemsHTML += `</article>`;
                        });
                        hasContent = true;
                    }
                    allRenderedItemsHTML += '<hr style="border-color: var(--border-color-light); margin-top:20px; margin-bottom:20px;">'; // Separator between feeds
                } else { 
                    // Should not happen if promises always resolve, but good to handle.
                    console.error('Promise rejected for feed processing:', result.reason);
                    allRenderedItemsHTML += `<h2>Feed processing error</h2><p class="error">Could not process a feed URL: ${result.reason ? result.reason.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;") : 'Unknown reason'}</p><hr style="border-color: var(--border-color-light); margin-top:20px; margin-bottom:20px;">`;
                }
            });
            
            // Remove the last <hr>
            if (allRenderedItemsHTML.endsWith('<hr style="border-color: var(--border-color-light); margin-top:20px; margin-bottom:20px;">')) {
                allRenderedItemsHTML = allRenderedItemsHTML.substring(0, allRenderedItemsHTML.lastIndexOf('<hr style="border-color: var(--border-color-light); margin-top:20px; margin-bottom:20px;">'));
            }


            if (!hasContent && results.every(r => r.status === 'fulfilled' && r.value.error)) {
                rssDisplayElement.innerHTML = '<p class="error">All configured RSS feeds failed to load or were empty.</p>';
            } else if (!hasContent) {
                rssDisplayElement.innerHTML = '<p>No items found in any of the configured RSS feeds.</p>';
            }
            else {
                rssDisplayElement.innerHTML = allRenderedItemsHTML;
            }
        });
    }

    destroy() {
        // Optional: If RssFeedView added any specific event listeners directly
        // (not related to its content that gets wiped), remove them here.
        // For now, not strictly necessary as content is replaced.
        // console.log('RssFeedView destroyed');
    }
}
