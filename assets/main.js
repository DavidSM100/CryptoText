// Get Screen height
var screenHeight = window.innerHeight;

// Convert to 95%
var bodyHeight = screenHeight * 0.95;

// Body height = 95% of screen height
document.body.style.height = bodyHeight + "px";


// Load encryption key from localStorage
var passwordInput = document.getElementById("password");

var passwordData = localStorage.getItem("password");

if (passwordData) {
  passwordInput.value = passwordData;
}

// Encrypt/Decrypt
function encrypt() {

  if (passwordInput.value !== "" && text.value !== "" && result.value === "") {

    var encryptedText = CryptoJS.AES.encrypt(text.value, passwordInput.value).toString();

    document.getElementById("result").value = encryptedText;

  }

  if (passwordInput.value !== "" && text.value === "" && result.value !== "") {

    var decryptedText = CryptoJS.AES.decrypt(result.value, passwordInput.value).toString(CryptoJS.enc.Utf8);

    document.getElementById("text").value = decryptedText;

  }

}


// Show/Hide password
function showPassword() {

  if (passwordInput.type === "password") {

    passwordInput.type = "text";
    eye.style.display = "none";
    eyeOff.style.display = "inline-block";

  } else {
    passwordInput.type = "password";
    eyeOff.style.display = "none";
    eye.style.display = "inline-block";
  }

  passwordInput.focus();

}

// Save Password
function keepPassword() {
  if (passwordInput.value === "") {
    localStorage.removeItem("password");
  } else {
    localStorage.setItem("password", passwordInput.value);
  }
}

// Share
function share(data) {

  location.href = "mailto:?body="+encodeURIComponent(data.value);

}

// Copy
function copy(data) {

  const temp = document.createElement("textarea");
  temp.innerText = data;
  document.body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  document.body.removeChild(temp);

}

// Erase
function erase(data) {

  document.getElementById(data).value = "";

}