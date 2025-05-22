// RssFeedView.js

class RssFeedView extends BaseView {
    constructor() {
        super();
        this.contentContainerId = 'text'; // The ID of the div where RSS content goes, matches old #text div
    }

    render() {
        // Return the basic HTML structure for the RSS feed area.
        // The actual feed content will be loaded in postRender.
        // This div ID matches the one used by displayRSSFeed and the old #text div.
        return `<div id="${this.contentContainerId}">
                    <p>Loading RSS feed...</p>
                </div>`;
    }

    postRender() {
        // Logic moved from the old main.js/main() function
        const feedUrl = typeof getSetting === 'function' ? getSetting('rssFeedUrl') : null;
        const rssDisplayElement = document.getElementById(this.contentContainerId);

        if (!rssDisplayElement) {
            console.error(`RSS display element with ID '${this.contentContainerId}' not found.`);
            return;
        }

        if (!feedUrl) {
            rssDisplayElement.innerHTML = '<p>RSS Feed URL not configured. Please set it in the <a href="#settings">Settings</a> page.</p>';
            return;
        }

        if (typeof fetchRSS !== 'function' || typeof parseRSS !== 'function' || typeof displayRSSFeed !== 'function') {
            rssDisplayElement.innerHTML = '<p class="error">Error: RSS reader functions not available. Ensure rss_reader.js is loaded.</p>';
            console.error('RSS reader functions (fetchRSS, parseRSS, displayRSSFeed) not found.');
            return;
        }
        
        // Initial message while loading
        rssDisplayElement.innerHTML = '<p>Fetching RSS feed...</p>';

        fetchRSS(feedUrl, (error, xmlData) => {
            if (error) {
                rssDisplayElement.innerHTML = '<p class="error">Error fetching RSS feed: ' + error.message + '. Check the URL or try again later. Ensure the feed supports CORS.</p>';
                return;
            }
            if (xmlData) {
                const items = parseRSS(xmlData);
                if (!items || items.length === 0 || (items.parsererror && items.parsererror.length > 0) ) { // check for parsererror if parseRSS includes it
                    rssDisplayElement.innerHTML = '<p class="error">Error parsing RSS feed or feed is empty.</p>';
                } else {
                    // displayRSSFeed will clear the container and add items.
                    // It needs the ID of the container, not the element itself.
                    displayRSSFeed(items, this.contentContainerId);
                }
            } else {
                 rssDisplayElement.innerHTML = '<p class="error">Failed to fetch RSS feed data (empty response).</p>';
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
