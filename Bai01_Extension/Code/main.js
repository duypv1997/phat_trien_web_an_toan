function getTooltipTextInfo(info) {
    return 'Url: ' + info.url;
}

kango.addMessageListener('Info', function(event) {
    if (event.target.isActive()) {
        kango.ui.browserButton.setTooltipText(getTooltipTextInfo(event.data));
    }
});

kango.browser.addEventListener(kango.browser.event.TAB_CHANGED, function(event) {
    kango.ui.browserButton.setTooltipText('...');
    event.target.dispatchMessage('GetInfo');
});
