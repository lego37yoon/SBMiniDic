function init() {
    console.log("init...");
    let savedApiKey = browser.storage.sync.get("apikey");
    savedApiKey.then((res) => {
        document.getElementById("apikey").value = res.apikey;
    });
    console.log("(2021.02.01) no error");

    let savedDragToFind = browser.storage.sync.get("dragToFind");
    savedDragToFind.then((res) => {
        console.log(res.dragToFind);
        if (res.dragToFind == true) {
            console.log("nothing to do.");
        } else {
            document.getElementById("dragToFind").checked = false;
        }
    });
    console.log("Checked Attribute");
    
    let savedContextToFind = browser.storage.sync.get("contextToFind");
    savedContextToFind.then((res) => {
        console.log(res.contextToFind);
        if (res.contextToFind == true) {
            document.getElementById("contextToFind").checked = true;
        } else {
            document.getElementById("contextToFind").checked = false;
        }
        console.log("Checked Attribute");
    }); 
}

function saveValues() {
    let appMode = document.getElementsByName('mode');
    let dragMode;
    let contextMode;

    if (document.getElementById("dragToFind").value != "on" && document.getElementById("contextToFind").value != "on") {
        alert("최소한 하나 이상의 방법을 선택하세요.");
    } else {
        if (document.getElementById("dragToFind").value == "on") {
            dragMode = true;
        } else {
            dragMode = false;
        }
        if (document.getElementById("contextToFind").value == "on") {
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

document.querySelector("form").addEventListener("submit", saveValues);