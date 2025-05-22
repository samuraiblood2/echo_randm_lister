// BaseView.js

class BaseView {
    constructor() {
        // Base constructor. Can be extended by subclasses if they need to accept parameters.
        // For example, a view might take some initial data or a specific element ID.
        if (new.target === BaseView) {
            throw new TypeError("Cannot construct BaseView instances directly. It is an abstract class.");
        }
    }

    /**
     * Renders the view's content.
     * This method MUST be overridden by subclasses.
     * @returns {string|HTMLElement} HTML string or a DOM element representing the view.
     */
    render() {
        throw new Error("Method 'render()' must be implemented by subclasses.");
    }

    /**
     * Called after the view's content has been rendered to the DOM.
     * Subclasses should override this method to attach event listeners,
     * perform post-render DOM manipulations, or initialize components specific to this view.
     */
    postRender() {
        // Optional: Common post-render logic for all views, or just a placeholder.
        // console.log('View rendered and postRender called for', this.constructor.name);
    }

    /**
     * Called when the view is about to be removed/replaced.
     * Subclasses should override this method to clean up any resources,
     * such as event listeners, timers, or subscriptions, to prevent memory leaks.
     */
    destroy() {
        // Optional: Common cleanup logic, or just a placeholder.
        // console.log('Destroying view:', this.constructor.name);
    }
}
