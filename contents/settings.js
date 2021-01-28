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