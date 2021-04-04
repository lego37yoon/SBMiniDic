function init() {
    let savedApiKey = browser.storage.sync.get("apikey");
    savedApiKey.then((res) => {
        document.getElementById("apikey").value = res.apikey;
    });

    let savedDragToFind = browser.storage.sync.get("dragToFind");
    savedDragToFind.then((res) => {
        if (res.dragToFind == true) {
            document.getElementById("dragToFind").checked = true;
        } else {
            document.getElementById("dragToFind").checked = false;
        }
    });
    
    let savedContextToFind = browser.storage.sync.get("contextToFind");
    savedContextToFind.then((res) => {
        if (res.contextToFind == true) {
            document.getElementById("contextToFind").checked = true;
        } else {
            document.getElementById("contextToFind").checked = false;
        }
    });

    let workMode = browser.storage.sync.get("mode");
    workMode.then((res) => {
        if (res.mode == "translate") {
            document.getElementsByName('mode')[1].checked = true;
            document.getElementsByName('mode')[0].checked = false;
        } else {
            document.getElementsByName('mode')[0].checked = true;
            document.getElementsByName('mode')[1].checked = false;
        }
    })
}

function saveValues() {
    let appMode = document.getElementsByName('mode');
    let dragMode;
    let contextMode;

    if (!document.getElementById("dragToFind").checked && !document.getElementById("contextToFind").checked) {
        alert("최소한 하나 이상의 방법을 선택하세요.");
    } else {
        if (document.getElementById("dragToFind").checked) {
            dragMode = true;
        } else {
            dragMode = false;
        }
        if (document.getElementById("contextToFind").checked) {
            contextMode = true;
        } else {
            contextMode = false;
        }    
    }
    
    browser.storage.sync.set({
        apikey: document.getElementById("apikey").value,
        dragToFind: dragMode,
        contextToFind: contextMode
    });
    for (i = 0; i < appMode.length; i++) {
        if (appMode[i].checked) {
            browser.storage.sync.set({
                mode: appMode[i].value
            });
        }
    }
}

document.addEventListener("DOMContentLoaded", init);
document.getElementById("saveForm").addEventListener("click", saveValues);