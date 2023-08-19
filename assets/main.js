//Load encryption key from localStorage
var p = localStorage.getItem("password");
if (p) {
	document.getElementById("password").value = p;
}

//Load type of encryption from localStorage
var slls = localStorage.getItem('sl');
if (slls) {
	s.value = slls;
}


function encrypt() {
	var text = document.getElementById("text").value;
	var pw = document.getElementById("password").value;
	var result = document.getElementById("result").value;
	if (cryptotype.value === "0") {
		if (text !== "" && pw !== "" && result === "") {
			var encryptedText = CryptoJS.AES.encrypt(text, pw).toString();
			document.getElementById("result").value = encryptedText;
		}
		if (text === "" && pw !== "" && result !== "") {
			var decryptedText = CryptoJS.AES.decrypt(result, pw).toString(CryptoJS.enc.Utf8);
			document.getElementById("text").value = decryptedText;
		}
	}
	if (cryptotype.value === "1") {
		if (text !== "" && pw !== "" && result === "") {
			var encryptedText = CryptoJS.TripleDES.encrypt(text, pw).toString();
			document.getElementById("result").value = encryptedText;
		}

		if (text === "" && pw !== "" && result !== "") {
			var decryptedText = CryptoJS.TripleDES.decrypt(result, pw).toString(CryptoJS.enc.Utf8);
			document.getElementById("text").value = decryptedText;
		}
	}

	if (cryptotype.value === "2") {
		if (text !== "" && pw !== "" && result === "") {
			var encryptedText = CryptoJS.DES.encrypt(text, pw).toString();
			document.getElementById("result").value = encryptedText;
		}

		if (text === "" && pw !== "" && result !== "") {
			var decryptedText = CryptoJS.DES.decrypt(result, pw).toString(CryptoJS.enc.Utf8);
			document.getElementById("text").value = decryptedText;
		}

	}

	if (cryptotype.value === "3") {
		if (text !== "" && pw !== "" && result === "") {
			var encryptedText = CryptoJS.RC4.encrypt(text, pw).toString(); document.getElementById("result").value = encryptedText;

		}

		if (text === "" && pw !== "" && result !== "") {
			var decryptedText = CryptoJS.RC4.decrypt(result, pw).toString(CryptoJS.enc.Utf8);
			document.getElementById("text").value = decryptedText;
		}

	}

}



function showpassword() {
	var x = document.getElementById("password");
	if (x.type === "password") {
		x.type = "text";
	} else {
		x.type = "password";
	}

}

function keeppass() {
	var password = document.getElementById("password").value;
	localStorage.setItem("password", password);
}



const s = document.getElementById('cryptotype');
s.addEventListener('change', ()=> {
	localStorage.setItem('sl', s.value);
});


function share(data) {
	location.href = "mailto:?body="+encodeURIComponent(data.value);
}

function copy(data) {
	var text = data.value;
	const temp = document.createElement("textarea");
	temp.innerText = text;
	document.body.appendChild(temp);
	temp.select();
	document.execCommand("copy");
	document.body.removeChild(temp);
}

function erase(data) {
	document.getElementById(data).value = "";
}