import aes from "crypto-js/aes.js";
import utf8 from "crypto-js/enc-utf8.js";

let xdc = window.webxdc;

let textBtn = document.getElementById("textBtn");
let fileBtn = document.getElementById("fileBtn");
textBtn.addEventListener("click", showTextDiv);
fileBtn.addEventListener("click", showFileDiv);

showTextDiv();

function showTextDiv() {
  fileDiv.hidden = true;
  textDiv.hidden = false;
  fileBtn.style.borderColor = "grey";
  fileBtn.style.color = "grey";
  textBtn.style.borderColor = "orange";
  textBtn.style.color = "orange";
}

function showFileDiv() {
  textDiv.hidden = true;
  fileDiv.hidden = false;
  textBtn.style.borderColor = "grey";
  textBtn.style.color = "grey";
  fileBtn.style.borderColor = "orange";
  fileBtn.style.color = "orange";
}

let passwordInput = document.getElementById("passwordInput");

loadSavedPassword();

function loadSavedPassword() {
  let savedPassword = localStorage.getItem("password");
  if (savedPassword) {
    passwordInput.value = savedPassword;
  }
}

let passwordBtn = document.getElementById("passwordBtn");
passwordBtn.addEventListener("click", togglePassword);

function togglePassword() {
  let eyeImg = document.getElementById("eyeImg");
  let eyeOffImg = document.getElementById("eyeOffImg");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeImg.hidden = true;
    eyeOffImg.hidden = false;
  } else {
    passwordInput.type = "password";
    eyeOffImg.hidden = true;
    eyeImg.hidden = false;
  }

  passwordInput.focus();
}

passwordInput.addEventListener("input", savePassword);

function savePassword() {
  let password = passwordInput.value;
  if (password) {
    localStorage.setItem("password", password);
  }
}

const CryptoJS = {
  AES: aes,
  enc: {
    Utf8: utf8,
  },
};

let encryptDecryptBtn = document.getElementById("encryptDecryptBtn");
encryptDecryptBtn.addEventListener("click", encryptDecryptText);

let textTextarea = document.getElementById("textTextarea");
let resultTextarea = document.getElementById("resultTextarea");

function encryptDecryptText() {
  let textData = textTextarea.value;
  let resultData = resultTextarea.value;
  let password = passwordInput.value;

  if (password) {
    if (textData && !resultData) {
      resultTextarea.value = encrypt(textData, password);
    }

    if (!textData && resultData) {
      textTextarea.value = decrypt(resultData, password);
    }
  }
}

let encryptFileBtn = document.getElementById("encryptFileBtn");
let decryptFileBtn = document.getElementById("decryptFileBtn");
encryptFileBtn.addEventListener("click", encryptFile);

decryptFileBtn.addEventListener("click", decryptFile);

async function encryptFile() {
  let password = passwordInput.value;
  if (password) {
    let file = (await xdc.importFiles({}))[0];
    let fileName = file.name;

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      let dataUrl = event.target.result;
      let base64 = dataUrl.split(",")[1];

      let encryptedBase64 = encrypt(base64, password);
      try {
        xdc.sendToChat({
          file: {
            name: fileName,
            plainText: encryptedBase64,
          },
        });
      } catch (err) {
        console.log(err);
        alert(err);
      }
    };
  }
}

async function decryptFile() {
  let password = passwordInput.value;
  if (password) {
    let file = (await xdc.importFiles({}))[0];
    let fileName = file.name;

    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (event) => {
      let encryptedText = event.target.result;
      let base64 = decrypt(encryptedText, password);
      try {
        xdc.sendToChat({
          file: {
            name: fileName,
            base64: base64,
          },
        });
      } catch (err) {
        console.log(err);
        alert(err);
      }
    };
  }
}

function encrypt(text, password) {
  try {
    let encryptedText = CryptoJS.AES.encrypt(text, password).toString();
    return encryptedText;
  } catch (err) {
    console.log(err);
    alert(err);
  }
}

function decrypt(encryptedText, password) {
  try {
    let decryptedText = CryptoJS.AES.decrypt(encryptedText, password).toString(
      CryptoJS.enc.Utf8,
    );
    if (decryptedText) return decryptedText;
  } catch (err) {
    console.log(err);
    alert(err);
  }
}

let eraseTextBtn = document.getElementById("eraseTextBtn");
let eraseResultBtn = document.getElementById("eraseResultBtn");
eraseTextBtn.addEventListener("click", () => eraseValue(textTextarea));
eraseResultBtn.addEventListener("click", () => eraseValue(resultTextarea));

let copyTextBtn = document.getElementById("copyTextBtn");
let copyResultBtn = document.getElementById("copyResultBtn");
copyTextBtn.addEventListener("click", () => copy(textTextarea.value));
copyResultBtn.addEventListener("click", () => copy(resultTextarea.value));

let shareTextBtn = document.getElementById("shareTextBtn");
let shareResultBtn = document.getElementById("shareResultBtn");
shareTextBtn.addEventListener("click", () => shareText(textTextarea.value));
shareResultBtn.addEventListener("click", () => shareText(resultTextarea.value));

function eraseValue(elem) {
  elem.value = "";
}

function shareText(text) {
  if (text) xdc.sendToChat({ text: text });
}

function copy(text) {
  const temp = document.createElement("textarea");
  temp.innerText = text;
  document.body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  document.body.removeChild(temp);
}
