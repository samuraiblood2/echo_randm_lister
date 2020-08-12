const Options = {
	PMC: 'PMC',
	SCAV: 'Scav',
	RANDOM: 'Random'
}

var result;
function doOption(type) {
	result = document.getElementById('result');

	var option = stringOfEnum(Options, type);
	switch (option) {
		case 'PMC':
		case 'SCAV':
			doLocation(type, '');
			break;

		case 'RANDOM':
			var rand = Math.random();
			var adjusted = Math.round(rand);
			var pmcOrScav = (adjusted == 1 ? 'PMC' : 'Scav');
			doOption(pmcOrScav);
			break;
	}
}

var locations = [ "Customs", "Factory", "Shoreline", "Interchange", "Reserve", "Labs", "Woods" ];

function doLocation(type) {

	// XXX: Display the winning option and clear the HTML before this.
	print(result, type);

	// XXX: Create the checkboxes for the locations we want to pick.
	for (var location in locations) {
		var locationName = locations[location];
		createCheckbox(result, locationName, locationName)
	}

	// XXX: Add some space then create a checkbox for night or day.
	printbr(result);
	createCheckbox(result, 'allowNight', 'Allow night?');

	// XXX: Display the button that will start the random location picking.
	var button = document.createElement('button');
	button.innerHTML = "Choose";
	printbr(result);
	result.appendChild(button);
	button.onclick = randomLocationPicker;
}

function randomLocationPicker(event) {
	// XXX: Iterate over the checkboxes detect if they were changed.
	event.preventDefault();

	var array = [];
	var checkboxes = result.getElementsByTagName('input');
	var nightOrDay = null;
	for (var i = 0; i < checkboxes.length; i++) {
		if (checkboxes[i].type === 'checkbox') {
			if (checkboxes[i].checked) {
				if (checkboxes[i].id == "allowNight") {
					var rand = Math.random();
					var adjusted = Math.round(rand);
					nightOrDay = (adjusted == 1 ? 'Day' : 'Night');
					continue;
				}

				array.push(checkboxes[i].id);
			}
		}
	}

	var location = document.getElementById('location');
	var randIndex = Math.floor(Math.random() * array.length);
	var value = array[randIndex];
	if (typeof value == 'undefined') {
		printerr(location, "Please select a location!");
		return;
	}

	print(location, value + (nightOrDay == null ? '' : ' ' + nightOrDay));
}

function printerr(element, msg) {
	printclear(element);
	element.innerHTML += ('<h1 style="font-size:60px;" class="error">' + msg + '</h1></br>');
}

function print(element, msg) {
	printclear(element);
	element.innerHTML += ('<h1 style="font-size:60px;"><strong>' + msg + '</strong></h1></br>');
}

function printbr(element) {
	element.innerHTML += '</br></br>';
}

function printclear(element) {
	element.innerHTML = "";
}

function createCheckbox(container, id, name) {
	var checkbox = document.createElement('input');
	checkbox.type = "checkbox";
	checkbox.id = id;

	var label = document.createElement('label')
	label.htmlFor = "id";
	label.appendChild(document.createTextNode(name));

	container.appendChild(checkbox);
	container.appendChild(label);
}

function stringOfEnum(e, value) {
	for (var k in e) {
		if (e[k] != value) {
			continue;
		}

		return k;
	}
	return null;
}