const suggestUrl = "https://suggest-bar.daum.net/suggest?mod=json&code=utf_in_out&enc=utf&id=language&cate=lan&q=";
const korSuggestUrl = "https://suggest-bar.daum.net/suggest?mod=json&code=utf_in_out&enc=utf&id=language&cate=kor&q="
const korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힇]/;
const translateUrl = "https://dapi.kakao.com/v2/translation/translate?query=";
let srcLang = "kr";
let targetLang = "en";
let apiKey = "KakaoAK ";
let mouseFrame = document.createElement("div"); //팝업 생성
let wordElement = document.createElement("p"); //p 요소 생성
let meaning = document.createElement("span");
let readMore = document.createElement("a");
let br = document.createElement("br");

wordElement.setAttribute("class", "sinabroMiniDicWord");
meaning.setAttribute("class", "sinabroMiniDicMeaning");
readMore.textContent = "더보기";
readMore.setAttribute("class", "sinabroMiniDicReadMore");
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
        for (let i = 0; i < result.items.length; i++) {
            if (keyword == result.items[i].split("|")[1]) {
                wordElement.textContent = keyword;
                meaning.textContent = result.items[i].split("|")[2];
                readMore.setAttribute("href", "https://dic.daum.net/search.do?q=" + keyword);

                wordElement.appendChild(br);
                meaning.appendChild(readMore);
                wordElement.appendChild(meaning);
                mouseFrame.appendChild(wordElement)

                mouseFrame.style.display = "block";
            }
        }
        //mouseFrame.innerHTML = keyword + "<br><p class='meaning'>" + result.items[0].split("|")[2] + "<a href='https://dic.daum.net/search.do?q=" + keyword + "'>더보기</a></p>";
    });

    
}

function searchTranslation(keyword) {
    let savedValues = browser.storage.sync.get(["srcLang", "targetLang", "apikey"]);
    savedValues.then((res) => {
        srcLang = res.srcLang;
        targetLang = res.targetLang;
        apiKey = "KakaoAK " + res.apikey;

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
            wordElement.textContent = keyword;
            if (result.translated_text == undefined) {
                meaning.textContent = "오류가 발생하였습니다: " + result.message;
            } else {
                meaning.textContent = result.translated_text[0][0];
            }
            
            wordElement.appendChild(br);
            wordElement.appendChild(meaning);
            mouseFrame.appendChild(wordElement);

            mouseFrame.style.display = "block";
        });
    });
}

function showFrame(mode, e) {
    let userText = window.getSelection().toString().trim(); //글자 얻어내기
    let customizedFont = browser.storage.sync.get(["fontSize", "fontMode"]);
    
    customizedFont.then((res) => {
        mouseFrame.style.fontSize = res.fontSize + 'px';
        if (res.fontMode == "serif") {
            mouseFrame.setAttribute("class", "sinabroMiniDicPopup sinabroMiniDicSerif");
        } else {
            mouseFrame.setAttribute("class", "sinabroMiniDicPopup sinabroMiniDicSansSerif");
        }
    });

    if (userText != "" && userText != " ") {
        mouseFrame.style.left = e.clientX + "px";
        mouseFrame.style.top = e.clientY + "px";

        if (mode == "dic") {
            searchDic(userText);
        } else if (mode == "translate") {
            searchTranslation(userText);
        } else {
            console.log("error occured : mode value is not valid");
        }
    }
}

function closeOverlay() {
    mouseFrame.style.display = "none";
}

document.addEventListener("mouseup", checkMode);
mouseFrame.addEventListener("mouseleave", closeOverlay);