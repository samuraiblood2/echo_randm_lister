function doSubmit() {
	clearResult();

	var from = document.getElementById('from').value;
	var to = document.getElementById('to').value;

	if (isNaN(from) || isNaN(to)) {
		printError("Values in range must be a number.");
		return;
	}

	if (from >= to) {
		printError("Second number in range must be lower then the first.");
		return;
	}

	var amount = document.getElementById('amount').value;
	if (isNaN(amount)) {
		printError("Value in amount must be a number.");
		return;
	}

	if (amount < 1) {
		printError("Value in amount must be above 0.");
		return;
	}

	for (var i = 0; i < amount; i ++) {
		var isEven = (i % 2 == 0);
		var classText = (isEven ? 'even' : 'odd');
		printResult("<div class=" + classText + ">" + getRandomInt(from, to) + "</div>");
	}
}

function getRandomInt(min, max) {
	var min = Math.ceil(min);
	var max = Math.floor(max);
	return (Math.floor(Math.random() * (max - min + 1)) + min);
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
}