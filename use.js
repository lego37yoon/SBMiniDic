const suggestUrl = "https://suggest-bar.daum.net/suggest?mod=json&code=utf_in_out&enc=utf&id=language&cate=lan&q=";
const korSuggestUrl = "https://suggest-bar.daum.net/suggest?mod=json&code=utf_in_out&enc=utf&id=language&cate=kor&q="
const korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힇]/;
const translateUrl = "https://dapi.kakao.com/v2/translation/translate?query=";
let srcLang = "kr";
let targetLang = "en";
let apiKey = "KakaoAK ";
let mouseFrame = document.createElement("div"); //팝업 생성
mouseFrame.setAttribute("class", "popup");
document.body.appendChild(mouseFrame);

function checkMode(e) {
    let checkSavedValue = browser.storage.sync.get(["dragToFind", "mode"]);
    
    checkSavedValue.then((res) => {
       if (res.mode == "translate") {
           if (res.dragToFind == true) {
               showFrame("translate", e);
           }
       } else {
           if (res.dragToFind == true) {
               showFrame("dic", e);
           }
       }
    });
}

function searchDic(keyword) {    
    let searchUrl = suggestUrl + keyword;
    if (korean.test(keyword)) {
        searchUrl = korSuggestUrl + keyword;
    }

    fetch(searchUrl, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrer: 'https://dic.daum.net'
    })
    .then(response => response.json())
    .then(result => {
        mouseFrame.innerHTML = keyword + "<br><p class='meaning'>" + result.items[0].split("|")[2] + "<a href='https://dic.daum.net/search.do?q='" + keyword + "'>더보기</a></p>";
    });

    
}

function searchTranslation(keyword) {
    let savedValues = browser.storage.sync.get(["srcLang", "targetLang", "apikey"]);
    savedValues.then((res) => {
        srcLang = res.srcLang;
        targetLang = res.targetLang;
        apiKey = apiKey + res.apikey;

        fetch(translateUrl + keyword + "&src_lang=" + srcLang + "&target_lang=" + targetLang, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Authorization': apiKey
            },
            redirect: 'follow'
        })
        .then(response => response.json())
        .then(result => {
            mouseFrame.innerHTML = keyword + "<br><p class='meaning'>" + result.translated_text[0][0] + "</p>";
        });
    });
}

function showFrame(mode, e) {
    let userText = window.getSelection().toString().trim(); //글자 얻어내기
    
    if (userText != "") {
        mouseFrame.style.left = e.clientX + "px";
        mouseFrame.style.top = e.clientY + "px";

        if (mode == "dic") {
            console.log("dic");
            searchDic(userText);
        } else if (mode == "translate") {
            searchTranslation(userText);
        } else {
            console.log("error occured : mode value is not valid");
        }

        
        mouseFrame.style.display = "block";
    }
}

function closeOverlay() {
    mouseFrame.style.display = "none";
}

document.addEventListener("mouseup", checkMode);
document.addEventListener("mousedown", closeOverlay);