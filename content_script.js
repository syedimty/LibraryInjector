chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

        alert(request.name);

//        console.log(sender.tab ?
//            "from a content script:" + sender.tab.url :
//            "from the extension");

        sendResponse({farewell: "goodbye"});
    });