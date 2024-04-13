// This file originates from
// https://github.com/webxdc/hello/blob/master/webxdc.js
// It's a stub `webxdc.js` that adds a webxdc API stub for easy testing in
// browsers. In an actual webxdc environment (e.g. Delta Chat messenger) this
// file is not used and will automatically be replaced with a real one.
// See https://docs.webxdc.org/spec.html#webxdc-api
// debug friend: document.writeln(JSON.stringify(value));

let __devices__ = [];

//@ts-check
/** @type {import('./webxdc').Webxdc<any>} */
window.webxdc = (() => {

  let currentUpdates = [];
  let opener = window.opener;

  let serveMsg = msg => {
    let sender = msg.source;
    let update = msg.data;

    if (!opener && sender != window) {
      __devices__.forEach(device => device.postMessage(update, '*'));
    }
  }

  window.addEventListener('message', serveMsg);

  let handleMsg = msg => {
    let update = msg.data;

    let serial = currentUpdates.length + 1;
    update.serial = serial;
    update.max_serial = serial;

    currentUpdates.push(update);
  }

  window.addEventListener('message', handleMsg);


  let loc = window.location;
  let hostname = loc.hostname;
  let peerId = (hostname.replace('localhost', '') || 'device0.').replace('.', '');

  return {
    selfAddr: peerId + '@local.host',
    selfName: peerId,
    setUpdateListener: (func, serial = 0) => {
      var maxSerial = currentUpdates.length;
      currentUpdates.forEach((update) => {
        update.max_serial = maxSerial;
        func(update);
      });


      window.addEventListener('message', msg => {
        let update = msg.data;
        let serial = currentUpdates.length;
        update.serial = serial
        update.max_serial = serial;
        console.log(update);
        func(update);
      });

      return Promise.resolve();
    },
    getAllUpdates: () => {
      console.log("[Webxdc] WARNING: getAllUpdates() is deprecated.");
      return Promise.resolve([]);
    },
    sendUpdate: (update, descr) => {
      let _update = {
        payload: update.payload,
        summary: update.summary,
        info: update.info,
        document: update.document,
      };


      let opener = window.opener;
      if (opener) {
        opener.postMessage(_update, '*');
      } else {
        window.postMessage(_update, '*');
        __devices__.forEach(device => device.postMessage(_update, '*'));
      }

      console.log(
        `[Webxdc] [Update sended]
Description: "${descr}",
Update: ${JSON.stringify(_update)}`
      );

    },
    sendToChat: async (content) => {
      if (!content.file && !content.text) {
        alert("🚨 Error: either file or text need to be set. (or both)");
        return Promise.reject(
          "Error from sendToChat: either file or text need to be set"
        );
      }

      /** @type {(file: Blob) => Promise<string>} */
      const blob_to_base64 = (file) => {
        const data_start = ";base64,";
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            /** @type {string} */
            //@ts-ignore
            let data = reader.result;
            resolve(data.slice(data.indexOf(data_start) + data_start.length));
          };
          reader.onerror = () => reject(reader.error);
        });
      };

      let base64Content;
      if (content.file) {
        if (!content.file.name) {
          return Promise.reject("file name is missing");
        }
        if (
          Object.keys(content.file).filter((key) =>
            ["blob", "base64", "plainText"].includes(key)
          ).length > 1
        ) {
          return Promise.reject(
            "you can only set one of `blob`, `base64` or `plainText`, not multiple ones"
          );
        }

        // @ts-ignore - needed because typescript imagines that blob would not exist
        if (content.file.blob instanceof Blob) {
          // @ts-ignore - needed because typescript imagines that blob would not exist
          base64Content = await blob_to_base64(content.file.blob);
          // @ts-ignore - needed because typescript imagines that base64 would not exist
        } else if (typeof content.file.base64 === "string") {
          // @ts-ignore - needed because typescript imagines that base64 would not exist
          base64Content = content.file.base64;
          // @ts-ignore - needed because typescript imagines that plainText would not exist
        } else if (typeof content.file.plainText === "string") {
          base64Content = await blob_to_base64(
            // @ts-ignore - needed because typescript imagines that plainText would not exist
            new Blob([content.file.plainText])
          );
        } else {
          return Promise.reject(
            "data is not set or wrong format, set one of `blob`, `base64` or `plainText`, see webxdc documentation for sendToChat"
          );
        }
      }
      const msg = `The app would now close and the user would select a chat to send this message:\nText: ${content.text ? `"${content.text}"` : "No Text"
        }\nFile: ${content.file
          ? `${content.file.name} - ${base64Content.length} bytes`
          : "No File"
        }`;
      if (content.file) {
        const confirmed = confirm(
          msg + "\n\nDownload the file in the browser instead?"
        );
        if (confirmed) {
          var element = document.createElement("a");
          element.setAttribute(
            "href",
            "data:application/octet-stream;base64," + base64Content
          );
          element.setAttribute("download", content.file.name);
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
        }
      } else {
        alert(msg);
      }
    },
    importFiles: (filters) => {
      var element = document.createElement("input");
      element.type = "file";
      element.accept = [
        ...(filters.extensions || []),
        ...(filters.mimeTypes || []),
      ].join(",");
      element.multiple = filters.multiple || false;
      const promise = new Promise((resolve, _reject) => {
        element.onchange = (_ev) => {
          console.log("element.files", element.files);
          const files = Array.from(element.files || []);
          document.body.removeChild(element);
          resolve(files);
        };
      });
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      console.log(element);
      return promise;
    },
  };
})();

window.addXdcPeer = () => {
  // get next peer ID
  let peerId = (Number(sessionStorage.getItem('peerId')) || 0) + 1;

  // get new URL
  let loc = window.location;
  let hostname = loc.hostname;
  let host = loc.host;

  let subdomain = hostname.replace('localhost', '');
  let newSubdomain = 'device' +
    peerId + '.';

  let newHostname = hostname.replace(subdomain, newSubdomain);
  let newHost = host.replace(hostname, newHostname);

  let url =
    loc.protocol +
    "//" +
    newHost +
    loc.pathname;

  // open a new window
  let device = window.open(url);
  __devices__.push(device);
  sessionStorage.setItem('peerId', String(peerId));

};


window.clearXdcStorage = () => {
  window.localStorage.clear();
  window.location.reload();
};


window.alterXdcApp = () => {
  var styleControlPanel =
    "position: fixed; bottom:1em; left:1em; background-color: #000; opacity:0.8; padding:.5em; font-size:16px; font-family: sans-serif; color:#fff; z-index: 9999";
  var styleMenuLink =
    "color:#fff; text-decoration: none; vertical-align: middle";
  var styleAppIcon =
    "height: 1.5em; width: 1.5em; margin-right: 0.5em; border-radius:10%; vertical-align: middle";
  var title = document.getElementsByTagName("title")[0];
  if (typeof title == "undefined") {
    title = document.createElement("title");
    document.getElementsByTagName("head")[0].append(title);
  }
  title.innerText = window.webxdc.selfAddr;

  if (window.webxdc.selfName === "device0") {
    var root = document.createElement("section");
    root.innerHTML =
      '<div id="webxdc-panel" style="' +
      styleControlPanel +
      '">' +
      '<header style="margin-bottom: 0.5em; font-size:12px;">webxdc dev tools</header>' +
      '<a href="javascript:window.addXdcPeer();" style="' +
      styleMenuLink +
      '">Add Peer</a>' +
      '<span style="' +
      styleMenuLink +
      '"> | </span>' +
      '<a id="webxdc-panel-clear" href="javascript:window.clearXdcStorage();" style="' +
      styleMenuLink +
      '">Reset</a>' +
      "<div>";
    var controlPanel = root.firstChild;

    function loadIcon(name) {
      var tester = new Image();
      tester.onload = () => {
        root.innerHTML =
          '<img src="' + name + '" style="' + styleAppIcon + '">';
        controlPanel.insertBefore(root.firstChild, controlPanel.childNodes[1]);

        var pageIcon = document.createElement('link');
        pageIcon.rel = "icon";
        pageIcon.href = name;
        document.head.append(pageIcon);
      };
      tester.src = name;
    }
    loadIcon("icon.png");
    loadIcon("icon.jpg");

    document.getElementsByTagName("body")[0].append(controlPanel);
  }
};

window.addEventListener("load", window.alterXdcApp);