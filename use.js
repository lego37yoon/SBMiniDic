const suggestUrl = "https://suggest-bar.daum.net/suggest?mod=json&code=utf_in_out&enc=utf&id=language&cate=lan&q=";
const translateUrl = "https://dapi.kakao.com/v2/translation/translate";
let mouseFrame = document.createElement("div"); //팝업 생성
mouseFrame.setAttribute("class", "popup");
document.body.appendChild(mouseFrame);

function checkMode(e) {
    let isDragEnabled = browser.storage.sync.get("dragToFind");
    let isTranslateMode = browser.storage.sync.get("mode");
    let currentMode = "dic";

    isTranslateMode.then((res) => { //번역 모드인지, 사전 모드인지 확인
        if (res.mode == "translate") {
            currentMode = "translate"; //번역 모드로 지정
        } else {
            currentMode = "dic"; //사전 모드로 지정
        }
    });
    isDragEnabled.then((res) => { //드래그하면 보여주기 기능 활성화 여부 확인
        if (res.dragToFind == true) {
            showFrame(currentMode, e); //켜져있으면 창 띄우기
        }
    });
}

function searchDic(keyword) {    
    let searchUrl = suggestUrl + keyword;

    fetch(searchUrl, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrer: 'https://dic.daum.net'
    })
    .then(function(response) {
        if (!response.ok) {
            console.log("Error: code " + response.status);
        }
        console.log(response.json().toString);
        return response.json();
    });

    mouseFrame.innerHTML = userText;
}

function searchTranslation(keyword) {
    
    mouseFrame.innerHTML = userText;   
}

function showFrame(mode, e) {
    let userText = window.getSelection().toString().trim(); //글자 얻어내기
    
    mouseFrame.style.left = e.clientX + "px";
    mouseFrame.style.top = e.clientY + "px";
    mouseFrame.style.visibility = "visible";
    
    if (mode == "dic") {
        searchDic(userText);
    } else if (mode == "translate") {
        searchTranslation(userText);
    } else {
        console.log("error occured : mode value is not valid");
    }

}

function closeOverlay() {
    mouseFrame.style.visibility = "hidden";
}

document.addEventListener("mouseup", checkMode);
document.addEventListener("mousedown", closeOverlay);