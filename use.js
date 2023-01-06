const korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힇]/;
const english = /[a-z|A-Z]/;

let i = 0;

/* Mini Popup */
let mouseFrame = document.createElement("div"); //popup div
mouseFrame.setAttribute("hidden", "true");
let wordElement = document.createElement("p"); //word
wordElement.setAttribute("class", "sinabroMiniDicWord");

let meaning = document.createElement("p"); //meaning
meaning.setAttribute("class", "sinabroMiniDicMeaning");

let readMore = document.createElement("a");

readMore.setAttribute("class", "sinabroMiniDicReadMore");

mouseFrame.appendChild(wordElement);
mouseFrame.appendChild(meaning);
mouseFrame.appendChild(readMore);

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
    const suggestUrl = "https://suggest.dic.daum.net/language/v1/search.json";

    let searchMode = "lan";
    let dictionaryMode = await browser.storage.sync.get(["krDicMode", "enDicMode", "autoModeChange"]);    

    if (korean.test(keyword)) { //사전 자동 전환 기능 (한국어)
        switch(dictionaryMode.krDicMode) {
            case "kr":
                searchMode = "kor";
                break;
            case "en":
                searchMode = "eng";
                break;
            case "jp":
                searchMode = "jpn";
                break;
            case "cn":
                searchMode = "chn";
                break;
            default:
                searchMode = "lan";
        }
    }

    if (english.test(keyword)) { //사전 자동 전환 기능 (영어)
        if (dictionaryMode.enDicMode = "kr") {
            searchMode = "eng";
        } else {
            searchMode = "ene";
        }
    }

    let dicResponse = await fetch(`${suggestUrl}?cate=${searchMode}&q=${keyword}`, {
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
    dicResult = dicResult.items[searchMode];

    for (i = 0; i < dicResult.length; i++) {
        if (keyword == dicResult[i].key) {
            wordElement.textContent = keyword;
            meaning.textContent = DOMPurify.sanitize(dicResult[i].item.split("|")[2]);
            readMore.textContent = "Daum 사전에서 뜻 더보기";
            readMore.setAttribute("href", `https://dic.daum.net/search.do?q=${keyword}`);

            mouseFrame.style.display = "block";
            break;
        }
    }

    if (mouseFrame.style.display != "block" && dictionaryMode.autoModeChange) {
        searchTranslation(keyword);
    }
}

async function searchTranslation(keyword) {
    const res = await browser.storage.sync.get(["translateProvider"]);
    let translateResult;
    switch(res.translateProvider) {
        case "naver":
            break;
        case "google":
            translateResult = await translateGoogle(keyword);
            break;
        case "kakaodev":
        default:
            translateResult = await translateKakao(keyword);
            break;
    }
    
    wordElement.textContent = keyword;
    switch(res.translateProvider) {
        case "naver":
            break;
        case "google":
            console.log(translateResult);
            if (translateResult.data == undefined) {
                meaning.textContent = `Google 번역 API에서 오류가 발생했습니다. 오류코드: ${translateResult.error.code}, 메시지: ${translateResult.error.message}, 종류: ${translateResult.error.status}`
                readMore.textContent = "Google Cloud Translation 문서 읽어보기";
                readMore.setAttribute("href", "https://cloud.google.com/translate/docs?hl=ko");
            } else {
                let translatedTexts = translateResult.data.translations[0].translatedText;
                if (translateResult.data.translations.length > 1) {
                    for (i = 1; i < translateResult.data.translations.length; i++) {
                        translatedTexts += translateResult.data.translations[i].translatedText;
                    }
                }
                meaning.textContent = DOMPurify.sanitize(translatedTexts);
                readMore.textContent = "출처 | Google 번역";
                readMore.setAttribute("href", "https://translate.google.com");
                break;
            }
            break;
        case "kakaodev":
        default:
            if (translateResult.translated_text == undefined) {
                meaning.textContent = `kakao 번역 API에서 오류가 발생했습니다. 제공된 오류 메시지는 ${translateResult.message}입니다.`;
                readMore.textContent = "kakao DevTalk에 상세 원인 물어보기";
                readMore.setAttribute("href", "https://devtalk.kakao.com/c/translation-api/109");    
            } else {
                let translatedTexts = translateResult.translated_text[0][0];
                if (translateResult.translated_text[0].length > 1) {
                    for (i = 1; i < translateResult.translated_text[0].length; i++) {
                        translatedTexts += translateResult.translated_text[0][i];
                    }    
                }
                meaning.textContent = DOMPurify.sanitize(translatedTexts);
                readMore.textContent = "출처 | kakao i 번역";
                readMore.setAttribute("href", "https://translate.kakao.com");
            }
            break;
    }

    mouseFrame.style.display = "block";
}

async function translateKakao(keyword) {
    const translateUrl = "https://dapi.kakao.com/v2/translation/translate";
    const detectUrl = "https://dapi.kakao.com/v3/translation/language/detect";    

    const res = await browser.storage.sync.get(["srcLang", "targetLang", "apikey"]);
    let srcLang = "kr";
    let targetLang = "en";

    if (res.srcLang == "auto") { //자동 감지 기능 사용 시
        let detectResponse = await fetch(`${detectUrl}?query=${keyword}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Authorization': `KakaoAK ${res.apikey}`
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

    const response = await fetch(`${translateUrl}?query=${keyword}&src_lang=${srcLang}&target_lang=${targetLang}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Authorization': `KakaoAK ${res.apikey}`
        },
        redirect: 'follow'
    });

    return response.json();
}

async function translateNaver(keyword) {
    const papagoUrl = "https://openapi.naver.com/v1/papago/n2mt";
    const detectUrl = "https://openapi.naver.com/v1/papago/detectLangs";
    let srcLang = "ko";
    let targetLang = "en";

    
    const res = await browser.storage.sync.get(["srcLangNaver", "targetLangNaver", "naverClientId", "naverClientSecret"]);

    // To-Do : Detect Language

    const response = await fetch(`${papagoUrl}`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Naver-Client-Id': `${res.naverClientId}`,
            'X-Naver-Client-Secret': `${res.naverClientSecret}`,
            'User-Agent': 'curl/7.86.0'
        },
        redirect: 'follow',
        body: `source=${srcLang}&target=${targetLang}&text=${keyword}`
    });

    return response.json();
}

async function translateGoogle(keyword) {
    const googleUrl = "https://translation.googleapis.com/language/translate/v2";
    const res = await browser.storage.sync.get(["srcLangGoogle", "targetLangGoogle", "googleApiKey"]);
    
    if (res.srcLangGoogle == "auto") {
        const response = await fetch(`${googleUrl}?key=${res.googleApiKey}`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            body: `{
                "q": "${keyword}",
                "target": "${res.targetLangGoogle}"
            }`
        });

        return response.json();
    }

    const response = await fetch(`${googleUrl}?key=${res.googleApiKey}`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        body: `{
            "q": "${keyword}",
            "source": "${res.srcLangGoogle}",
            "target": "${res.targetLangGoogle}"
        }`
    });   

    return response.json();
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