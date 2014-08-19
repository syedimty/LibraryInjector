var ACTIONS = {
    GET_LIBRARIES : 'GET_LIBRARIES',
    INJECT_LIBRARY : 'INJECT_LIBRARY'
}

var injectedLibraries = [];


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        switch (request.action){
            case ACTIONS.INJECT_LIBRARY:
                injectLibrary(request.data);
                break;
            case ACTIONS.GET_LIBRARIES:
                sendResponse(injectedLibraries);
                break;
        }
    });


function injectScript(url){
    var script = document.createElement('script')
    script.src = url;
    document.body.appendChild(script)
}

function injectStyle(url){
    var style = document.createElement('link');
    style.href = url;
    style.rel = 'stylesheet';
    style.type = 'text/css';
    document.body.appendChild(style);
}

var FILETYPE = {
    JS : 'js',
    CSS : 'css'
}

function injectLibrary(library){

    var libraryFiles = library.files;

    injectedLibraries.push(library.name);

    for(var i = 0,file ; i < libraryFiles.length; i++){
        file = libraryFiles[i];
        if(file.type === FILETYPE.JS){
            injectScript(file.url);
        }else if(file.type === FILETYPE.CSS){
            injectStyle(file.url);
        }
    }

}
