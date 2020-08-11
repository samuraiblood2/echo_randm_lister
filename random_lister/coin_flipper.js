var count = 0;

function doCoinFlip() {
	clearResult();

	var rand = Math.random();
	var adjusted = Math.round(rand);
	var headsOrTails = (adjusted == 1 ? 'Heads' : 'Tails');

	count ++;
	printResult('Count: ' + count);

	printResult('<h1 style="font-size:60px;"><strong>' + headsOrTails + '</strong></h1>');
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