function saveValues() {
    browser.storage.sync.set({
        apikey: document.querySelector("#apikey").value,
        
    });
}

document.querySelector("form").addEventListener("submit", saveValues);