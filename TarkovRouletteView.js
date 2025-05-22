// TarkovRouletteView.js
class TarkovRouletteView extends BaseView {
    constructor() {
        super();
        // Options and locations can be instance properties or constants within the class/module
        this.Options = { PMC: 'PMC', SCAV: 'Scav', RANDOM: 'Random' };
        this.locations = ["Customs", "Factory", "Shoreline", "Interchange", "Reserve", "Labs", "Woods"];
        // Store references to bound event handlers if they need to be removed in destroy
        this.boundDoOption = this.doOption.bind(this);
        this.boundRandomLocationPicker = this.randomLocationPicker.bind(this);
        // To store listeners for #tr-form buttons for explicit removal
        this.formButtonListeners = []; 
    }

    render() {
        // HTML structure from tarkov_roulette.html's main content area
        return `
        <div class="page-container">
            <h1>Tarkov Roulette</h1>
            <p>Scav or PMC?</p>
            <form id="tr-form">
                <button type="button" data-option="Scav">Scav</button>
                <button type="button" data-option="Random">Random</button>
                <button type="button" data-option="PMC">PMC</button>
            </form>
            <div id="tr-result"></div>  <!-- For initial type selection, dynamic checkboxes -->
            <div id="tr-location"></div> <!-- For final location result -->
        </div>`;
        // Using data-option for easier event handling
    }

    postRender() {
        // Attach listeners to the Scav/Random/PMC buttons
        const buttons = document.querySelectorAll('#tr-form button');
        buttons.forEach(button => {
            // The listener needs to call doOption with the specific option
            // An arrow function captures 'this' context and allows passing event.target.dataset.option
            const listener = (event) => this.doOption(event.target.dataset.option);
            button.addEventListener('click', listener);
            // Store for removal in destroy
            this.formButtonListeners.push({ element: button, type: 'click', listener: listener });
        });
    }
    
    doOption(type) {
        // Logic from original doOption, adapted for class and using this.Options
        // Result div is now #tr-result
        clearElement('tr-result'); // Use global util or view specific
        clearElement('tr-location');

        const optionKey = this.findKeyByValue(this.Options, type); // Use helper
        switch (optionKey) {
            case 'PMC':
            case 'SCAV':
                this.doLocation(type); // Pass original type 'PMC' or 'Scav'
                break;
            case 'RANDOM':
                const rand = Math.random();
                const pmcOrScav = (rand < 0.5 ? this.Options.PMC : this.Options.SCAV);
                // Call doOption again with the determined type.
                // This will effectively re-trigger the logic and display the chosen type.
                this.doOption(pmcOrScav); 
                break;
            default:
                console.error('Invalid option type:', type);
                setElementHTML('tr-result', '<p class="error">Invalid option selected.</p>');
        }
    }

    doLocation(type) {
        // Logic from original doLocation, displays checkboxes and "Choose" button
        // Ensure setElementHTML and appendToElement are available (global utils or view methods)
        setElementHTML('tr-result', `<h1 style="font-size:60px;"><strong>${type}</strong></h1><br>`);

        this.locations.forEach(locationName => {
            this.createCheckbox('tr-result', locationName, locationName, locationName);
        });
        appendToElement('tr-result', '<br><br>');
        this.createCheckbox('tr-result', 'allowNight', 'allowNight', 'Allow night?');
        
        const chooseButton = document.createElement('button');
        chooseButton.type = 'button';
        chooseButton.id = 'tr-choose-location'; // Give it an ID for easier removal if needed
        chooseButton.textContent = "Choose Location";
        
        appendToElement('tr-result', '<br><br>');
        const resultDiv = getElement('tr-result'); // from utils.js
        if(resultDiv) resultDiv.appendChild(chooseButton);

        chooseButton.addEventListener('click', this.boundRandomLocationPicker);
    }

    randomLocationPicker() {
        // Logic from original randomLocationPicker
        clearElement('tr-location');
        const resultDiv = getElement('tr-result');
        if (!resultDiv) return;

        const selectedLocations = [];
        const checkboxes = resultDiv.querySelectorAll('input[type="checkbox"]');
        let allowNight = false;

        checkboxes.forEach(cb => {
            if (cb.checked) {
                if (cb.id === "allowNight") {
                    allowNight = true;
                } else {
                    selectedLocations.push(cb.id);
                }
            }
        });

        if (selectedLocations.length === 0) {
            setElementHTML('tr-location', '<p class="error">Please select at least one location!</p>');
            return;
        }

        const randomIndex = Math.floor(Math.random() * selectedLocations.length);
        const pickedLocation = selectedLocations[randomIndex];
        let timeOfDay = '';
        if (allowNight) {
            timeOfDay = (Math.random() < 0.5 ? ' (Day)' : ' (Night)');
        }
        
        setElementHTML('tr-location', `<h1 style="font-size:60px;"><strong>${pickedLocation}${timeOfDay}</strong></h1>`);
    }

    createCheckbox(containerId, id, name, labelText) {
        // Adapted from original, uses global getElement and appendToElement
        const container = getElement(containerId);
        if (!container) return;

        const checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.id = id;
        checkbox.name = name;

        const label = document.createElement('label');
        label.htmlFor = id;
        label.appendChild(document.createTextNode(labelText + ' ')); // Add space for visual separation

        container.appendChild(checkbox);
        container.appendChild(label);
        // appendToElement(containerId, '<br>'); // Add line break after each for clarity
    }
    
    findKeyByValue(obj, value) { // Helper moved from tarkov_roulette.js
         return Object.keys(obj).find(key => obj[key] === value) || null;
    }
    
    destroy() {
        // Remove event listeners for #tr-form buttons
        this.formButtonListeners.forEach(entry => {
            entry.element.removeEventListener(entry.type, entry.listener);
        });
        this.formButtonListeners = []; // Clear the array

        // Remove event listener for the dynamically added 'tr-choose-location' button
        const chooseButton = document.getElementById('tr-choose-location');
        if (chooseButton) {
            chooseButton.removeEventListener('click', this.boundRandomLocationPicker);
        }
        // console.log('TarkovRouletteView destroyed');
    }
}
