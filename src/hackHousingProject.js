function start() {
    var site = window.location.host;

    if(site.indexOf("mint.com") !== -1) {
        startMint();
    }
    else if(site.indexOf("zillow.com") !== -1) {
        startZillow();
    }
}

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