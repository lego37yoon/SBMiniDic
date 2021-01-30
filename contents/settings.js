function init() {
    let savedApiKey = browser.storage.sync.get("apikey");
    document.getElementById("apikey").value = savedApiKey;
    let savedDragToFind = browser.storage.sync.get("dragToFind");
    let savedContextToFind = browser.storage.sync.get("contextToFind");
    if (savedDragToFind == "on") {
        document.getElementById("dragToFind").setAttribute("checked");
    } else {
        document.getElementById("dragToFind").removeAttribute("checked");
    }
    if (savedContextToFind == "on") {
        document.getElementById("contextToFind").setAttribute("checked");
    } else {
        document.getElementById("contextToFind").removeAttribute("checked");
    }
    
}

function saveValues() {
    let appMode = document.getElementsByName('mode');
    
    browser.storage.sync.set({
        apikey: document.querySelector("#apikey").value,
        dragToFind: document.querySelector("#dragToFind").value,
        contextToFind: document.querySelector("#contextToFind").value,
    });
    for (i = 0; i < appMode.length; i++) {
        if (appMode[i].checked) {
            browser.storage.sync.set({
                mode: appMode[i].value
            })
        }
    }
}

document.querySelector("form").addEventListener("submit", saveValues);