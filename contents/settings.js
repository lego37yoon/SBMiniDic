function saveValues() {
    browser.storage.sync.set({
        apikey: document.querySelector("#apikey").value,
        dragToFind: document.querySelector("#dragToFind").value,
    });
}

document.querySelector("form").addEventListener("submit", saveValues);