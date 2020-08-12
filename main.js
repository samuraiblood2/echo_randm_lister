const localTextFile = ("./index.txt");

function main() {
	readFile(localTextFile);
}

function readFile(file) {
	var request = new XMLHttpRequest();

	request.open("GET", file);
	request.responseType = "text";
	request.withCredentials = true;

	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			print(request.responseText);
		}
	}

	request.send();
}

function print(s) {
	var body = document.getElementById('text');
	body.innerHTML += s;
}

