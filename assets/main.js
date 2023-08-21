const passwordInput = document.getElementById("password");

//Load encryption key from localStorage
var passwordData = localStorage.getItem("password");

if (passwordData) {
  passwordInput.value = passwordData;
}

function encrypt() {

  if (passwordInput.value !== "" && text.value !== "" && result.value === "") {

    var encryptedText = CryptoJS.AES.encrypt(text, password).toString();

    document.getElementById("result").value = encryptedText;

  }

  if (passwordInput.value !== "" && text.value === "" && result.value !== "") {

    var decryptedText = CryptoJS.AES.decrypt(result, password).toString(CryptoJS.enc.Utf8);

    document.getElementById("text").value = decryptedText;

  }

}



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

function keepPassword() {

  localStorage.setItem("password", passwordInput.value);

}

function share(data) {

  location.href = "mailto:?body="+encodeURIComponent(data.value);

}

function copy(data) {

  const temp = document.createElement("textarea");
  temp.innerText = data;
  document.body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  document.body.removeChild(temp);

}

function erase(data) {

  document.getElementById(data).value = "";

}