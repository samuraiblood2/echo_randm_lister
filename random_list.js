var choices = [];

function doSubmit() {

	// XXX: Make sure the result element is empty.
	clearResult()

	// XXX: Popualte our hashtable with stuff and things.
	if (!populateList()) {
		return;
	}

	// XXX: Do stuff.
	var amount = document.getElementById('amount').value;
	if (amount <= 0) {
		printError("Amount must be above 1.");
		return;
	}

	if (isNaN(amount)) {
		printError("Amount must be a number.");
		return;
	}


	var keys = Object.keys(choices);
	var length = keys.length;

	for (var i = 0; i < amount; i ++) {
		var randIndex = Math.floor(Math.random() * length);
		var key = keys[randIndex];
		choices[key] += 1;
	}

	var count = 0;
	var highest = Object.keys(choices).reduce((a, b) => { return choices[a] > choices[b] ? a : b });

	for (var key in choices) {
		var value = choices[key];
		var isEven = (count % 2 == 0);
		var isWinner = (key == highest);

		var classText = (isWinner ? (isEven ? 'even-winner' : 'odd-winner') : (isEven ? 'even' : 'odd'));

		printResult('<div class=' + classText + '>' + key + ': ' + value + '</div>');

		count ++;
	}
}

function populateList() {
	var textarea = document.getElementById('items');
	if (textarea == null) {
		return false;
	}

	if (textarea.value == "") {
		printError("No items were entered.");
		return false;
	}

	var values = textarea.value.split('\n');
	for (var i = 0; i < values.length; i ++) {
		choices[values[i]] = 0;
	}
	return true;
}

function printResult(s) {
	var result = document.getElementById('result');
	result.innerHTML += s;
}

function printError(s) {
	printResult('<div class="error">' + s + '</div>');
}

function clearResult() {
	var result = document.getElementById('result');
	result.innerHTML = '';

	choices = [];
}