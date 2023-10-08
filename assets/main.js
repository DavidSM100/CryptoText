function showTextDiv() {
  fileDiv.style.display = "none";
  textDiv.style.display = "block";
  fileBtn.style.borderColor = "grey";
  textBtn.style.borderColor = "orange";
}

showTextDiv();

function showFileDiv() {
  textDiv.style.display = "none";
  fileDiv.style.display = "block";
  textBtn.style.borderColor = "grey";
  fileBtn.style.borderColor = "orange";
}

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
function encrypt_decrypt() {
  if (textDiv.style.display === "block") {
    if (passwordInput.value !== "" && text.value !== "" && result.value === "") {

      var encryptedText = CryptoJS.AES.encrypt(text.value, passwordInput.value).toString();

      document.getElementById("result").value = encryptedText;

    }

    if (passwordInput.value !== "" && text.value === "" && result.value !== "") {

      var decryptedText = CryptoJS.AES.decrypt(result.value, passwordInput.value).toString(CryptoJS.enc.Utf8);

      document.getElementById("text").value = decryptedText;

    }
  }

  if (fileDiv.style.display === "block") {
    var file = fileInput.files[0];
    var fileName = file.name;
    
    if (fileName.startsWith('AES-')) {
      var split = fileName.split("AES-");
      var decryptedName = split[1];
      var reader = new FileReader();
      reader.onload = function(e) {
        var encryptedData = e.target.result;
        var decryptedData = CryptoJS.AES.decrypt(encryptedData, passwordInput.value).toString(CryptoJS.enc.Utf8);
        var decryptedFile = base64ToBlob(decryptedData);
        shareBlob(decryptedFile, decryptedName);
      };

      reader.readAsText(file);

    } else {
      var encryptedName = "AES-" + fileName;
      var reader = new FileReader();
      
      reader.onload = function(e) {
        var base64Data = e.target.result;
        var encryptedFile = CryptoJS.AES.encrypt(base64Data, passwordInput.value).toString();
        sharePlainText(encryptedFile, encryptedName);
      };
      reader.readAsDataURL(file);
    }

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

// Share text
function share(data) {
  location.href = "mailto:?body="+encodeURIComponent(data.value);
}

// Copy text
function copy(data) {
  const temp = document.createElement("textarea");
  temp.innerText = data;
  document.body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  document.body.removeChild(temp);
}

// Erase text
function erase(data) {
  document.getElementById(data).value = "";
}

// Convert from base64 to blob
const base64ToBlob = (base64Data) => {
  const byteCharacters = atob(base64Data.split(',')[1]);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays);
};

// Share encrypted file (PlainText content)
function sharePlainText(file, fileName) {
  window.webxdc.sendToChat({
    file: {
      plainText: file, name: fileName
    }
  });
}

// Share decrypted file (Blob content)
function shareBlob(file, fileName) {

  window.webxdc.sendToChat({
    file: {
      blob: file, name: fileName
    }
  });

}

addFileBtn.addEventListener('click', function() {
  fileInput.click();
});

textBtn.addEventListener('click', showTextDiv);
fileBtn.addEventListener('click', showFileDiv);

fileInput.addEventListener('change', function() {
  var fileName = fileInput.files[0].name;
  nameDiv.textContent = fileName;
  if (fileName.startsWith("AES-")) {
    nameDiv.style.color = "red";
  } else {
    nameDiv.style.color = "green";
  }
});