function init() {
    let savedSettings = browser.storage.sync.get(); //저장된 값 불러오기
    let srcLangOptionNodes = document.getElementById("srcLang").childNodes;
    let targetLangOptionNodes = document.getElementById("targetLang").childNodes;
    let krDicNodes = document.getElementById("krDicMode").childNodes;
    let enDicNodes = document.getElementById("enDicMode").childNodes;
    let i;

    savedSettings.then((values) => {
        document.getElementById("apikey").value = values.apikey; //번역 API Key 불러오기
        
        //기능 설정
        if (values.dragToFind) { //드래그로 단어 찾기 기능 활성화 여부 확인
            document.getElementById("dragToFind").checked = true;
        } else {
            document.getElementById("dragToFind").checked = false;
        }

        if (values.contextToFind) { //마우스 오른쪽 클릭 메뉴로 단어 찾기 활성화 여부 확인
            document.getElementById("contextToFind").checked = true;
        } else {
            document.getElementById("contextToFind").checked = false;
        }

        if (values.autoModeChange) {
            document.getElementById("autoModeChange").checked = true;
        } else {
            document.getElementById("autoModeChange").checked = false;
        }

        if (values.mode == "translate") { //번역 모드, 사전 모드 확인
            document.getElementsByName('mode')[1].checked = true; //번역
            document.getElementsByName('mode')[0].checked = false; //사전
            document.getElementsByClassName('translate')[0].style.display = "block";
        } else {
            document.getElementsByName('mode')[0].checked = true;
            document.getElementsByName('mode')[1].checked = false;
            document.getElementsByClassName('dic')[0].style.display = "block";
        }

        //사전 설정
        for (i = 0; i < krDicNodes.length; i++) {
            if (values.krDicMode == krDicNodes[i].value) {
                krDicNodes[i].selected = true;
            }
        }
        for (i = 0; i < enDicNodes.length; i++) {
            if (values.enDicMode == enDicNodes[i].value) {
                enDicNodes[i].selected = true;
            }
        }

        //번역 설정
        for (i = 0; i < srcLangOptionNodes.length; i++) { //번역 대상 언어 저장된 값 지정
            if (values.srcLang == srcLangOptionNodes[i].value) {
                srcLangOptionNodes[i].selected = true;
            }
        }

        for (i = 0; i < targetLangOptionNodes.length; i++) { //결과물 언어 저장된 값 지정
            if (values.targetLang == targetLangOptionNodes[i].value) {
                targetLangOptionNodes[i].selected = true;
            }
        }

        //모양새 설정
        if (values.fontSize != null) {
            document.getElementById("popupFontSize").value = values.fontSize;
        }
        
        if (values.fontMode == "serif") { 
            document.getElementsByName('fontMode')[0].checked = true; //리디바탕
            document.getElementsByName('fontMode')[1].checked = false; //나눔스퀘어
            document.body.style.fontFamily = "\"RIDIBatang\", serif";
        } else {
            document.getElementsByName('fontMode')[0].checked = false;
            document.getElementsByName('fontMode')[1].checked = true;
            document.body.style.fontFamily = "\"NanumSquare\", sans-serif";
        }

    });
}

function saveValues() {
    let appMode = document.getElementsByName('mode');
    let fontMode = document.getElementsByName('fontMode');
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
    
    browser.storage.sync.set({ //저장
        apikey: document.getElementById("apikey").value, //카카오 번역 API 키
        dragToFind: dragMode, //드래그하여 찾기 기능 활성화 여부
        contextToFind: contextMode, //오른쪽 클릭 메뉴 활성화 여부
        autoModeChange: document.getElementById("autoModeChange").value,
        srcLang: document.getElementById("srcLang").value, //번역 대상 언어
        targetLang: document.getElementById("targetLang").value, //번역 결과 언어
        krDicMode: document.getElementById("krDicMode").value, //한국어 사전 모드
        enDicMode: document.getElementById("enDicMode").value, //영어 사전 모드
        fontSize: document.getElementById("popupFontSize").value //글꼴 크기
    });
    for (i = 0; i < appMode.length; i++) {
        if (appMode[i].checked) {
            browser.storage.sync.set({
                mode: appMode[i].value
            });
        }
    }
    for (i = 0; i < fontMode.length; i++) {
        if (fontMode[i].checked) {
            browser.storage.sync.set({
                fontMode: fontMode[i].value
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