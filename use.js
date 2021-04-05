const suggestUrl = "https://suggest-bar.daum.net/suggest?mod=json&code=utf_in_out&enc=utf&id=language&cate=lan&q=";
const translateUrl = "https://dapi.kakao.com/v2/translation/translate";

function checkMode() {
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
            showFrame(currentMode); //켜져있으면 창 띄우기
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
        referrer: 'no-referrer'
    })
    .then(function(response) {
        if (!response.ok) {
            console.log("Error: code " + response.status);
        }
        console.log(response.json().toString);
        return response.json();
    });
}

function searchTranslation(keyword) {

}

function showFrame(mode) {
    let userText = window.getSelection().toString().trim();
    //const dicAddress = ""
    //let requestDic = new XMLHttpRequest();
    //let dicRawText;
    /* if (userText !== '') {
        requestDic.open('GET', 'https://suggest-bar.daum.net/suggest?mod=json&code=utf_in_out&enc=utf&id=language&cate=lan&q=' + userText, true);
        requestDic.responseType = 'json';
        requestDic.onreadystatechange = function() {
            console.log('Check State...');
            if(requestDic.readyState === XMLHttpRequest.DONE) {
                console.log(requestDic.responseText);
            }
        };
        requestDic.send();
        console.log('Request Sent');
    } */
    searchDic(userText);
}

function closeOverlay() {
    
}

document.addEventListener("mouseup", checkMode);
document.addEventListener("mousedown", closeOverlay);