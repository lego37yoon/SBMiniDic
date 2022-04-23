const suggestUrl = "https://suggest.dic.daum.net/language/v1/search.json?cate=lan&q=";
const korSuggestUrl = "https://suggest.dic.daum.net/language/v1/search.json?cate=kor&q="
const engSuggestUrl = "https://suggest.dic.daum.net/language/v1/search.json?cate=ene&q=";
const korengSuggestUrl = "https://suggest.dic.daum.net/language/v1/search.json?cate=eng&q=";
//const korjpnSuggestUrl = "";
//const korchnSuggestUrl = "";
const korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힇]/;
const english = /[a-z|A-Z]/;
const translateUrl = "https://dapi.kakao.com/v2/translation/translate?query=";
const detectUrl = "https://dapi.kakao.com/v3/translation/language/detect?query=";
let srcLang = "kr";
let targetLang = "en";
let apiKey = "KakaoAK ";
let mouseFrame = document.createElement("div"); //팝업 생성
let wordElement = document.createElement("p"); //p 요소 생성
let meaning = document.createElement("span");
let readMore = document.createElement("a");
let br = document.createElement("br");
let i = 0;

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

async function searchDic(keyword) {
    let searchUrl = suggestUrl + keyword;
    let dictionaryMode = await browser.storage.sync.get(["krDicMode", "enDicMode"]);
    let searchMode = "lan";

    if (korean.test(keyword)) { //사전 자동 전환 기능 (한국어)
        if (dictionaryMode.krDicMode = "kr") {
            searchUrl = korSuggestUrl + keyword;
            searchMode = "kor";
        }
        else if (dictionaryMode.krDicMode = "en") {
            searchUrl = engSuggestUrl + keyword;
            searchMode = "eng";
        }
    }

    if (english.test(keyword)) { //사전 자동 전환 기능 (영어)
        if (dictionaryMode.enDicMode = "kr") {
            searchUrl = korengSuggestUrl + keyword;
            searchMode = "eng";
        } else {
            searchUrl = engSuggestUrl + keyword;
            searchMode = "ene";
        }
    }

    let dicResponse = await fetch(searchUrl, {
        method: 'GET',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow',
        host: 'suggest.dic.daum.net',
        referrer: 'https://dic.daum.net'
    })

    let dicResult = await dicResponse.json();
    dicResult = dicResult.items;
    console.log(dicResult);

    if (searchMode == "eng")
        dicResult = dicResult.eng;
    else if (searchMode == "ene")
        dicResult = dicResult.ene;
    else if (searchMode == "kor")
        dicResult = dicResult.kor;
    else
        dicResult = dicResult.lan;

    console.log(dicResult);

    for (i = 0; i < dicResult.length; i++) {
        if (keyword == dicResult[i].key) {
            wordElement.textContent = keyword;
            meaning.textContent = dicResult[i].item.split("|")[2];
            readMore.setAttribute("href", "https://dic.daum.net/search.do?q=" + keyword);

            wordElement.appendChild(br);
            meaning.appendChild(readMore);
            wordElement.appendChild(meaning);
            mouseFrame.appendChild(wordElement)

            mouseFrame.style.display = "block";
        }
    }
    //mouseFrame.innerHTML = keyword + "<br><p class='meaning'>" + result.items[0].split("|")[2] + "<a href='https://dic.daum.net/search.do?q=" + keyword + "'>더보기</a></p>";
}

async function searchTranslation(keyword) {
    let res = await browser.storage.sync.get(["srcLang", "targetLang", "apikey"]);
    
    apiKey = "KakaoAK " + res.apikey; //API 키 설정

    if (res.srcLang == "auto") { //자동 감지 기능 사용 시
        let detectResponse = await fetch(detectUrl + keyword, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Authorization': apiKey
            },
            redirect: 'follow'
        });
        let detectResult = await detectResponse.json();

        if (detectResult['language_info'][0]['code'] == "N/A") {
            srcLang = "en";
        } else {
            srcLang = detectResult['language_info'][0]['code'];
        }
    } else { //그게 아니면 데이터 저장된 값 사용
        srcLang = res.srcLang;
    }


    if (srcLang == "kr" && res.targetLang == "kr") { //원본->번역 모두 한국어면 결과 언어는 영어로
        targetLang = "en";
    } else if (srcLang == res.targetLang) { //원본->번역 모두 한국어 이외의 동일 언어면 결과 언어는 한국어
        targetLang = "kr";
    } else { //별 문제 없다면 저장된 원본 언어로
        targetLang = res.targetLang;
    }

    let translateResponse = await fetch(translateUrl + keyword + "&src_lang=" + srcLang + "&target_lang=" + targetLang, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Authorization': apiKey
        },
        redirect: 'follow'
    });
    let translateResult = await translateResponse.json();
    console.log(translateResult);
    
    wordElement.textContent = keyword;
    if (translateResult.translated_text == undefined) {
        meaning.textContent = "오류가 발생하였습니다: " + translateResult.message;
    } else {
        meaning.textContent = translateResult.translated_text[0][0];
        if (translateResult.translated_text[0].length > 1) {
            for (i = 1; i < translateResult.translated_text[0].length; i++) {
                meaning.textContent += translateResult.translated_text[0][i];
            }    
        }
    }
        
    wordElement.appendChild(br);
    wordElement.appendChild(meaning);
    mouseFrame.appendChild(wordElement);

    mouseFrame.style.display = "block";
}

function showFrame(mode, e) {
    let userText = window.getSelection().toString().trim(); //글자 얻어내기
    let customizedFont = browser.storage.sync.get(["fontSize", "fontMode"]);
    
    customizedFont.then((res) => {
        mouseFrame.style.fontSize = res.fontSize + 'pt';
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