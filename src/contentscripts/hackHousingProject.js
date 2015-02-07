function start() {
    // load mint or zillow functionality depending on the site we are on

    var site = window.location.host;

    if(site.indexOf("mint.com") !== -1) {
        startMint();
    }
    else if(site.indexOf("zillow.com") !== -1) {
        startZillow();
    }
}

// implement a storage layer that can be used for mint and zillow
// functionality to communicate, using background thread
var globalStorage = {
    setItem: function(key, value) {
        chrome.runtime.sendMessage({"set": {"key": key, "value": value}}, function(response) {});
    },

    getItem: function(key, callback) {
        chrome.runtime.sendMessage({"get": key}, callback);
    }
}

document.addEventListener('DOMContentLoaded', function (evt) {
    start();
}, false);