
const prod = /my.ecwid.com/;
const sandbox = /.ecwid.qa/;
chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' });
try {
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.status == 'complete' && tab.status == 'complete' && tab.url != undefined && (prod.exec(tab.url) || sandbox.exec(tab.url))) {
            chrome.storage.session.set({ tabUrl: tab.url });
            chrome.scripting.executeScript(
                {
                    target: { tabId: tab.id },
                    files: ['content.js']
                });
        }
    }
    );
}
catch (e) {
    console.log(e)
}