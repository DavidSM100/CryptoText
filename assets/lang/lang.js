var defaultLang = "en";

var userLang =
(window.navigator && window.navigator.language);

userLang = userLang.slice(0, 2).toLowerCase();

if (userLang === "es") {

  lang = userLang;

} else {

  lang = defaultLang;

}

var langFile = document.createElement('script');

langFile.src = `/assets/lang/${lang}.js`;

document.head.appendChild(langFile);