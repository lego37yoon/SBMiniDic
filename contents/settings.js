function init() {
    let savedSettings = browser.storage.sync.get(); //저장된 값 불러오기
    let srcLangOptionNodes = document.getElementById("srcLang").childNodes;
    let targetLangOptionNodes = document.getElementById("targetLang").childNodes;
    let i;

    savedSettings.then((values) => {
        document.getElementById("apikey").value = values.apikey; //번역 API Key 불러오기
        
        if (values.dragToFind == true) { //드래그로 단어 찾기 기능 활성화 여부 확인
            document.getElementById("dragToFind").checked = true;
        } else {
            document.getElementById("dragToFind").checked = false;
        }

        if (values.contextToFind == true) { //마우스 오른쪽 클릭 메뉴로 단어 찾기 활성화 여부 확인
            document.getElementById("contextToFind").checked = true;
        } else {
            document.getElementById("contextToFind").checked = false;
        }

        if (values.mode == "translate") { //번역 모드, 사전 모드 확인
            document.getElementsByName('mode')[1].checked = true;
            document.getElementsByName('mode')[0].checked = false;
            document.getElementsByClassName('translate')[0].style.display = "block";
        } else {
            document.getElementsByName('mode')[0].checked = true;
            document.getElementsByName('mode')[1].checked = false;
        }
        
        for (i = 0; i < srcLangOptionNodes.length; i++) {
            if (values.srcLang == srcLangOptionNodes[i].value) {
                srcLangOptionNodes[i].selected = "selected";
            }
        }

        for (i = 0; i < targetLangOptionNodes.length; i++) {
            if (values.targetLang == targetLangOptionNodes[i].value) {
                targetLangOptionNodes[i].selected = "selected";
            }
        } 
    });
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
        contextToFind: contextMode,
        srcLang: document.getElementById("srcLang").value,
        targetLang: document.getElementById("targetLang").value
    });
    for (i = 0; i < appMode.length; i++) {
        if (appMode[i].checked) {
            browser.storage.sync.set({
                mode: appMode[i].value
            });
        }
    }
}

function showMenu() {
    document.getElementsByClassName('translate')[0].style.display = "block";
    document.getElementsByClassName('dic')[0].style.display = "none";
}

function hideMenu() {
    document.getElementsByClassName('translate')[0].style.display = "none";
    document.getElementsByClassName('dic')[0].style.display = "block";
}

document.addEventListener("DOMContentLoaded", init);
document.getElementById("saveForm").addEventListener("click", saveValues);
document.getElementById("translate").addEventListener("click", showMenu);
document.getElementById("dic").addEventListener("click", hideMenu);