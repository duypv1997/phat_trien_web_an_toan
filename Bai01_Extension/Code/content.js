function postMessage() {
    var pageInfo = {
        url: document.URL
    };
    kango.dispatchMessage('Info', pageInfo);
}

postMessage();

kango.addMessageListener('GetInfo', function(event) {
    postMessage();
});