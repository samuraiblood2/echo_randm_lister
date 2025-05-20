// utils.js functions used:
// getElement(elementId)
// appendToElement(elementId, htmlContent)
// setElementHTML(elementId, htmlContent)
// clearElement(elementId)

const Options = {
	PMC: 'PMC',
	SCAV: 'Scav',
	RANDOM: 'Random'
};

// Determines the string key from an enum-like object based on its value.
// e.g., findKeyByValue({ PMC: 'PMC' }, 'PMC') will return 'PMC' (the key)
function findKeyByValue(object, value) {
	return Object.keys(object).find(key => object[key] === value);
}

function doOption(type) {
	// The 'result' div is where initial type (PMC/Scav) and location checkboxes are shown.
	const resultElementId = 'result'; 
	// Clear the 'location' div as well, in case of a previous full run.
	clearElement('location');


	const optionKey = findKeyByValue(Options, type);
	switch (optionKey) {
		case 'PMC':
		case 'SCAV':
			// type here is 'PMC' or 'Scav' (the value from Options)
			doLocation(type); // Pass the type string directly
			break;
		case 'RANDOM':
			const pmcOrScav = (Math.random() < 0.5 ? Options.PMC : Options.SCAV);
			doOption(pmcOrScav); // Recursive call with the determined type
			break;
		default:
			console.error("Unknown option type:", type);
			// Optionally display an error to the user in 'result' div
			setElementHTML(resultElementId, `<h1 style="font-size:60px;" class="error">Invalid option selected.</h1><br>`);
			break;
	}
}

const locations = [ "Customs", "Factory", "Shoreline", "Interchange", "Reserve", "Labs", "Woods" ];

function doLocation(playerType) {
	const resultElementId = 'result'; // Define where to display this info

	// Display the chosen player type (PMC or Scav)
	setElementHTML(resultElementId, `<h1 style="font-size:60px;"><strong>${playerType}</strong></h1><br>`);

	// Create checkboxes for each location
	for (const locationName of locations) {
		createCheckbox(resultElementId, locationName, locationName);
	}

	// Add space and create checkbox for 'Allow night?'
	appendToElement(resultElementId, '<br><br>');
	createCheckbox(resultElementId, 'allowNight', 'Allow night?');

	// Create and display the "Choose" button
	// Note: Dynamically creating a button and adding event listener like this is fine,
	// but if utils.js had a button creation utility, that could also be used.
	// For now, this direct DOM manipulation for the button is kept.
	const resultDiv = getElement(resultElementId);
	if (resultDiv) {
		const button = document.createElement('button');
		button.innerHTML = "Choose";
		button.onclick = randomLocationPicker; // Attach event listener
		
		appendToElement(resultElementId, '<br><br>'); // Space before button
		resultDiv.appendChild(button); // Append the actual button element
	}
}

function randomLocationPicker(event) {
	if (event) event.preventDefault(); // Prevent default form submission if any

	const resultElementId = 'result'; // Checkboxes are within this element
	const locationResultElementId = 'location'; // Where the final location is displayed

	const selectedLocations = [];
	let allowNight = false; // Changed from nightOrDay = null to boolean

	const resultDiv = getElement(resultElementId);
	if (!resultDiv) return; // Should not happen if HTML is correct

	const checkboxes = resultDiv.getElementsByTagName('input');
	for (let i = 0; i < checkboxes.length; i++) {
		if (checkboxes[i].type === 'checkbox' && checkboxes[i].checked) {
			if (checkboxes[i].id === "allowNight") {
				allowNight = true; // Simply note that night is allowed
			} else {
				selectedLocations.push(checkboxes[i].id);
			}
		}
	}

	if (selectedLocations.length === 0) {
		setElementHTML(locationResultElementId, `<h1 style="font-size:60px;" class="error">Please select a location!</h1><br>`);
		return;
	}

	const randomIndex = Math.floor(Math.random() * selectedLocations.length);
	const chosenLocation = selectedLocations[randomIndex];
	
	let timeOfDay = "";
	if (allowNight) {
		timeOfDay = (Math.random() < 0.5 ? 'Day' : 'Night');
	}

	// Display the chosen location and time (if applicable)
	const displayText = chosenLocation + (timeOfDay ? ` ${timeOfDay}` : '');
	setElementHTML(locationResultElementId, `<h1 style="font-size:60px;"><strong>${displayText}</strong></h1><br>`);
	
	// Clear the checkboxes and "Choose" button from the 'result' div after selection.
	// This is a design choice to prevent re-clicking "Choose" without re-selecting options.
	// To do this, we effectively re-run part of doLocation without creating new elements,
	// or simply display the player type again. For simplicity, let's just clear it for now
	// if we want a cleaner UI post-selection, or leave it.
	// For this refactor, let's clear the checkboxes area to signify completion.
	// The player type is still visible if it was in a separate element or we re-print it.
	// The original `print(result, type)` in doLocation cleared 'result' then printed type.
	// Let's assume the type (PMC/Scav) is already shown and we just clear the form part.
	// Or, if we want to show the type again after selection, we'd need to get it.
	// The current flow has playerType displayed in 'result', then form added.
	// Let's just clear 'result' and show a "Picked:" message for now.
	// This part of the UX might need further thought post-refactor.
	// For now, let's keep it simple: chosen location is in 'location', 'result' can be cleared or left.
	// The original code did `print(result, type)` which cleared and set.
	// Let's simplify and assume 'result' doesn't need to change after 'location' is picked.
}


// createCheckbox appends to a container specified by ID
function createCheckbox(containerId, id, name) {
	const containerElement = getElement(containerId);
	if (!containerElement) return;

	const checkbox = document.createElement('input');
	checkbox.type = "checkbox";
	checkbox.id = id;

	const label = document.createElement('label');
	// Setting htmlFor correctly:
	label.htmlFor = id; 
	label.appendChild(document.createTextNode(` ${name}`)); // Added space for better label spacing

	containerElement.appendChild(checkbox);
	containerElement.appendChild(label);
	// Add a line break after each checkbox for better layout
	appendToElement(containerId, '<br>'); 
}

// Old print functions (printerr, print, printbr, printclear) are removed.
// Their functionality is replaced by:
// setElementHTML(elementId, htmlContent) for print and printerr (after clearing)
// appendToElement(elementId, htmlContent) for printbr
// clearElement(elementId) for printclear

// stringOfEnum is replaced by findKeyByValue