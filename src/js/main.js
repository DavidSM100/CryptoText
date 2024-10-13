import aes from "crypto-js/aes.js";
import utf8 from "crypto-js/enc-utf8.js";

const $ = (id) => document.getElementById(id);

const textBtn = $("textBtn");
const fileBtn = $("fileBtn");
textBtn.onclick = showTextDiv;
fileBtn.onclick = showFileDiv;

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

const passwordInput = $("passwordInput");

loadSavedPassword();

function loadSavedPassword() {
  const savedPassword = localStorage.getItem("password");
  passwordInput.value = savedPassword;
}

const passwordBtn = $("passwordBtn");
passwordBtn.onclick = togglePassword;

function togglePassword() {
  const eyeImg = $("eyeImg");
  const eyeOffImg = $("eyeOffImg");

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

passwordInput.oninput = savePassword;

function savePassword() {
  const password = passwordInput.value;
  localStorage.setItem("password", password);
}

const CryptoJS = {
  AES: aes,
  enc: {
    Utf8: utf8,
  },
};

const encryptDecryptBtn = $("encryptDecryptBtn");
encryptDecryptBtn.onclick = encryptDecryptText;

const textTextarea = $("textTextarea");
const resultTextarea = $("resultTextarea");

function encryptDecryptText() {
  const password = passwordInput.value;
  if (!password) return;

  const textData = textTextarea.value;
  const resultData = resultTextarea.value;

  if (textData && !resultData) {
    resultTextarea.value = encrypt(textData, password);
  }

  if (!textData && resultData) {
    textTextarea.value = decrypt(resultData, password);
  }
}

const encryptFileBtn = $("encryptFileBtn");
const decryptFileBtn = $("decryptFileBtn");
encryptFileBtn.onclick = encryptFile;
decryptFileBtn.onclick = decryptFile;

const readFileAs = (type, file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    if (type === "base64") reader.readAsDataURL(file);
    if (type === "text") reader.readAsText(file);
    reader.onload = () => {
      let result = reader.result;
      if (type === "base64") result = result.split(",")[1];
      resolve(result);
    };
    reader.onerror = reject;
  });

async function encryptFile() {
  const password = passwordInput.value;
  if (password) {
    const file = (await window.webxdc.importFiles({}))[0];
    if (!file) return;

    const fileName = file.name;

    try {
      const base64 = await readFileAs("base64", file);
      const encryptedBase64 = encrypt(base64, password);
      window.webxdc.sendToChat({
        file: {
          name: fileName,
          plainText: encryptedBase64,
        },
      });
    } catch (err) {
      console.log(err);
      alert(err);
    }
  }
}

async function decryptFile() {
  const password = passwordInput.value;
  if (password) {
    const file = (await window.webxdc.importFiles({}))[0];
    if (!file) return;

    const fileName = file.name;
    try {
      const encryptedText = await readFileAs("text", file);
      const base64 = decrypt(encryptedText, password);
      window.webxdc.sendToChat({
        file: {
          name: fileName,
          base64: base64,
        },
      });
    } catch (err) {
      console.log(err);
      alert(err);
    }
  }
}

function encrypt(text, password) {
  try {
    const encryptedText = CryptoJS.AES.encrypt(text, password).toString();
    return encryptedText;
  } catch (err) {
    console.log(err);
    alert(err);
  }
}

function decrypt(encryptedText, password) {
  try {
    const decryptedText = CryptoJS.AES.decrypt(encryptedText, password);
    if (decryptedText) return decryptedText.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.log(err);
    alert(err);
  }
}

const eraseTextBtn = $("eraseTextBtn");
const eraseResultBtn = $("eraseResultBtn");
eraseTextBtn.onclick = () => eraseValue(textTextarea);
eraseResultBtn.onclick = () => eraseValue(resultTextarea);

const shareTextBtn = $("shareTextBtn");
const shareResultBtn = $("shareResultBtn");
shareTextBtn.onclick = () => shareText(textTextarea.value);
shareResultBtn.onclick = () => shareText(resultTextarea.value);

const copyTextBtn = $("copyTextBtn");
const copyResultBtn = $("copyResultBtn");
copyTextBtn.onclick = () => copy(textTextarea.value);
copyResultBtn.onclick = () => copy(resultTextarea.value);

const eraseValue = (elem) => (elem.value = "");

function shareText(text) {
  if (text) window.webxdc.sendToChat({ text: text });
}

function copy(text) {
  const temp = document.createElement("textarea");
  temp.innerText = text;
  document.body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  document.body.removeChild(temp);
}
