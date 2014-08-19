

var animationOngoing = false;

var ACTIONS = {
    GET_LIBRARIES : 'GET_LIBRARIES',
    INJECT_LIBRARY : 'INJECT_LIBRARY'
}

var injectedLibraries= [], buttons = [];

document.addEventListener('DOMContentLoaded', function () {
    isProperUrl(function(){
        initialize();
        getInjectedLibraries();
    });
});

function isProperUrl(cb){
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        var url = tabs[0].url;
        if(url.indexOf('https://') > -1){
            document.body.innerHTML = "<header>Sorry!!. Cannot work on https enabled site.</header>"
        }else if(url.indexOf('file://') > -1) {
            document.body.innerHTML = "<header>Sorry!!. Cannot work on local file page.</header>"
        }else if(url.indexOf('chrome-extension://') > -1) {
            document.body.innerHTML = "<header>Sorry!!. Cannot work on plugins page.</header>"
        }else
        {
            cb();
        }
    });
}

function addLibrary(event) {

    var el = event.target,
        library = findLibrary(el.innerHTML);

    if(injectedLibraries.indexOf(library.name) > -1){
        showNotification('Library Already added to this page');
    }else{
        injectedLibraries.push(library.name);

        el.setAttribute('class','selected');

        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {

            var request = {};
            request.action = ACTIONS.INJECT_LIBRARY;
            request.data = library;

            chrome.tabs.sendMessage(tabs[0].id, request, function (response) {

            });
        });
    }

}

function initialize() {
    buttons = [];
    generateButtons();
}


function showNotification(message) {
    if (animationOngoing === false) {
        var notification = document.createElement('div');
        notification.id = 'note';
        notification.textContent = message;
        document.body.appendChild(notification)
        animationOngoing = true;
        setTimeout(function () {
            notification.remove();
            animationOngoing = false;
        }, 1000);
    }
}

function findLibrary(libraryName){
    for(var i = 0, library; i < LIBRARIES.length; i++) {
        library = LIBRARIES[i];
        if(library.name === libraryName){
            return library;
        }
    }
    return null;
}

function generateButtons() {
    var container = document.getElementById('buttons_holder');
    for (var i = 0, button; i < LIBRARIES.length; i++) {
        button = createButton(LIBRARIES[i]);
        button.addEventListener('click', addLibrary);
        addButton(button, container);
        buttons.push(button);
    }
}

function getInjectedLibraries(){

    console.log('getInjectedLibraries');

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            action : ACTIONS.GET_LIBRARIES
        }, function (response) {
            if(response && response instanceof Array && response.length > 0){
                injectedLibraries = response;
                disableInjectedLibraries();
            }

        });
    });
}

function createButton(library) {
    var button = document.createElement('div');
    console.log(library);
    button.textContent = library.name;
    return button;
}

function addButton(button, container) {
    container.appendChild(button);
}

function disableInjectedLibraries(){
    for(var i = 0,button ; i < buttons.length; i++){
        button =  buttons[i];
        if(injectedLibraries.indexOf(button.textContent) > -1){
            button.setAttribute('class','selected');
        }
    }
}