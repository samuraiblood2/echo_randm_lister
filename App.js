// App.js

class App {
    constructor(routes, mainContentId = 'app-content') {
        this.routes = routes; // e.g., { '#home': RssFeedView, '#settings': SettingsView }
        this.mainContentElement = document.getElementById(mainContentId);
        this.currentView = null;

        if (!this.mainContentElement) {
            console.error(`Main content element with ID '${mainContentId}' not found.`);
            return;
        }

        // Listen for hash changes
        window.addEventListener('hashchange', this.handleRouteChange.bind(this));
        // Handle initial route
        this.handleRouteChange();
    }

    handleRouteChange() {
        const hash = window.location.hash || '#home'; // Default to #home
        const ViewClass = this.routes[hash];

        if (this.currentView && typeof this.currentView.destroy === 'function') {
            this.currentView.destroy(); // Optional: for cleanup if views need it
        }
        this.mainContentElement.innerHTML = ''; // Clear previous view

        if (ViewClass) {
            this.currentView = new ViewClass();
            const viewContent = this.currentView.render(); // render() should return HTML string or DOM element

            if (typeof viewContent === 'string') {
                this.mainContentElement.innerHTML = viewContent;
            } else if (viewContent instanceof HTMLElement) {
                this.mainContentElement.appendChild(viewContent);
            } else {
                console.error('View render() method must return an HTML string or HTMLElement.');
                this.mainContentElement.innerHTML = '<p class="error">Error: Could not render view.</p>';
            }

            if (typeof this.currentView.postRender === 'function') {
                this.currentView.postRender();
            }
            // After view is rendered and its postRender is called, update the navigation menu
            if (typeof loadNavigationMenu === 'function') {
                loadNavigationMenu(hash);
            } else {
                console.warn('loadNavigationMenu function not found. Cannot update nav active state.');
            }
        } else {
            console.warn(`No view found for route: ${hash}`);
            this.mainContentElement.innerHTML = '<p class="error">Page not found.</p>';
            // Even if page not found, update nav to reflect the hash (or clear active state)
            if (typeof loadNavigationMenu === 'function') {
                loadNavigationMenu(hash); // Or pass a specific value to clear active, e.g. null
            } else {
                console.warn('loadNavigationMenu function not found. Cannot update nav active state.');
            }
            this.currentView = null;
        }
    }
}
