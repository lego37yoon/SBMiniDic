function init() {
    const savedSettings = browser.storage.sync.get(); //저장된 값 불러오기
    const krDicNodes = document.getElementById("krDicMode").childNodes;
    const enDicNodes = document.getElementById("enDicMode").childNodes;
    const today = new Date();
    let i;

    if (today > Date.parse("Thu, 30 Jun 2023 23:59:59 UTC+0900")) {
        document.getElementById("kakaodev").disabled = true;
    }

    savedSettings.then((values) => {
        if (values.translateProvider) {
            document.getElementById(values.translateProvider).checked = true;
        } else {
            document.getElementById("kakaodev").checked = true;
        }
        switch (values.translateProvider) {
            case "naver":
                showNaverPapago();
                break;
            case "google":
                showGoogleTranslate();
                break;
            case "kakaodev":
            default:
                showKakaoDev();
                break;
        }

        if (values.srcLangNaver) {
            setSrcTargetLang(values.srcLangNaver, values.targetLangNaver, 
                document.getElementById("srcLangNaver").childNodes, document.getElementById("targetLangNaver").childNodes);
        }

        if (values.srcLangGoogle) {
            setSrcTargetLang(values.srcLangGoogle, values.targetLangGoogle, 
                document.getElementById("srcLangGoogle").childNodes, document.getElementById("targetLangGoogle").childNodes);
        }

        if (values.srcLang) {
            setSrcTargetLang(values.srcLang, values.targetLang, 
                document.getElementById("srcLang").childNodes, document.getElementById("targetLang").childNodes);
        }

        if (values.apikey) {
            document.getElementById("apikey").value = values.apikey; //번역 API Key 불러오기
        }
        if (values.naverClientId && values.naverClientSecret) {
            document.getElementById("naverClientId").value = values.naverClientId; //네이버 파파고 Client ID
            document.getElementById("naverClientSecret").value = values.naverClientSecret; //네이버 파파고 Client Secret
        }
        if (values.googleApiKey) {
            document.getElementById("googleApiKey").value = values.googleApiKey; //Google Cloud Translation API Key
        }
        
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

        if (values.openNewTab) {
            document.getElementById("openNewTab").checked = true;
        } else {
            document.getElementById("openNewTab").checked = false;
        }

        if (values.autoModeChange) {
            document.getElementById("autoModeChange").checked = true;
        } else {
            document.getElementById("autoModeChange").checked = false;
        }

        if (values.mode == "translate") { //번역 모드, 사전 모드 확인
            document.getElementById(values.mode).checked = true;
            document.getElementById('translateSettings').style.display = "block";
        } else {
            document.getElementsByName('mode')[0].checked = true;
            document.getElementById('dicSettings').style.display = "block";

            if (values.autoModeChange) {
                document.getElementById('translateSettings').style.display = "block";
            }
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
    const appMode = document.getElementsByName('mode');
    const transProvider = document.getElementsByName('translateProvider');
    const fontMode = document.getElementsByName('fontMode');
    
    if (!document.getElementById("dragToFind").checked && !document.getElementById("contextToFind").checked) {
        alert("최소한 하나 이상의 방법을 선택하세요.");
    }
    
    browser.storage.sync.set({ //저장
        apikey: document.getElementById("apikey").value, //카카오 번역 API 키
        naverClientId: document.getElementById("naverClientId").value, //네이버 파파고 Client ID
        naverClientSecret: document.getElementById("naverClientSecret").value, //네이버 파파고 Client Secret
        googleApiKey: document.getElementById("googleApiKey").value, //Google Cloud Translation API Key
        dragToFind: document.getElementById("dragToFind").checked, //드래그하여 찾기 기능 활성화 여부
        contextToFind: document.getElementById("contextToFind").checked, //오른쪽 클릭 메뉴 활성화 여부
        openNewTab: document.getElementById("openNewTab").checked, //새 탭에서 상세 정보 열기 활성화 여부
        autoModeChange: document.getElementById("autoModeChange").checked, //사전 검색 결과 없으면 번역 결과 보여주기
        srcLang: document.getElementById("srcLang").value, //번역 대상 언어 (카카오)
        targetLang: document.getElementById("targetLang").value, //번역 결과 언어 (카카오)
        srcLangNaver: document.getElementById("srcLangNaver").value, //번역 대상 언어 (네이버)
        targetLangNaver: document.getElementById("targetLangNaver").value, //번역 결과 언어 (네이버)
        srcLangGoogle: document.getElementById("srcLangGoogle").value, //번역 대상 언어 (구글)
        targetLangGoogle: document.getElementById("targetLangGoogle").value, //번역 결과 언어 (구글)
        krDicMode: document.getElementById("krDicMode").value, //한국어 사전 모드
        enDicMode: document.getElementById("enDicMode").value, //영어 사전 모드
        fontSize: document.getElementById("popupFontSize").value //글꼴 크기
    });
    for (i = 0; i < appMode.length; i++) {
        if (appMode[i].checked) {
            browser.storage.sync.set({
                mode: appMode[i].value
            });//사전 모드 혹은 번역 모드
        }
    }
    for (i = 0; i < transProvider.length; i++) {
        if (transProvider[i].checked) {
            browser.storage.sync.set({
                translateProvider: transProvider[i].value
            });//번역 서비스 제공업체
        }
    }
    for (i = 0; i < fontMode.length; i++) {
        if (fontMode[i].checked) {
            browser.storage.sync.set({
                fontMode: fontMode[i].value
            }); //글꼴 선택
        }
    }
}

function showMenu() {
    document.getElementById('translateSettings').style.display = "block";
    document.getElementById('dicSettings').style.display = "none";
}

function hideMenu() {
    if (!document.getElementById("autoModeChange").checked) {
        document.getElementById('translateSettings').style.display = "none";
    } else {    
        document.getElementById('translateSettings').style.display = "block";
    }
    document.getElementById('dicSettings').style.display = "block";

}

function showKakaoDev() {
    document.getElementById("keyKakaoDev").style.display = "block";
    document.getElementById("keyNaverPapago").style.display = "none";
    document.getElementById("keyGoogleTranslate").style.display = "none";
}

function showNaverPapago() {
    document.getElementById("keyNaverPapago").style.display = "block";
    document.getElementById("keyGoogleTranslate").style.display = "none";
    document.getElementById("keyKakaoDev").style.display = "none";
}

function showGoogleTranslate() {
    document.getElementById("keyGoogleTranslate").style.display = "block";
    document.getElementById("keyKakaoDev").style.display = "none";
    document.getElementById("keyNaverPapago").style.display = "none";
}

function setSrcTargetLang(srcLang, targetLang, srcLangOptionNodes, targetLangOptionNodes) {
    //번역 설정
    for (i = 0; i < srcLangOptionNodes.length; i++) { //번역 대상 언어 저장된 값 지정
        if (srcLang == srcLangOptionNodes[i].value) {
            srcLangOptionNodes[i].selected = true;
        }
    }

    for (i = 0; i < targetLangOptionNodes.length; i++) { //결과물 언어 저장된 값 지정
        if (targetLang == targetLangOptionNodes[i].value) {
            targetLangOptionNodes[i].selected = true;
        }
    }
}

document.addEventListener("DOMContentLoaded", init);
document.getElementById("saveForm").addEventListener("click", saveValues);
document.getElementById("translate").addEventListener("click", showMenu);
document.getElementById("dic").addEventListener("click", hideMenu);
document.getElementById("kakaodev").addEventListener("click", showKakaoDev);
document.getElementById("naver").addEventListener("click", showNaverPapago);
document.getElementById("google").addEventListener("click", showGoogleTranslate);
document.getElementById("autoModeChange").addEventListener("change", function() {
    if (this.checked) {
        document.getElementById('translateSettings').style.display = "block";
    } else {
        document.getElementById('translateSettings').style.display = "none";
    }
});
document.getElementById("srcLangNaver").addEventListener("change", function() {
    const options = document.getElementById("targetLangNaver");
    const hiddenOptions = options.querySelectorAll("[hidden]");
    for (i = 0; i < hiddenOptions.length; i++) {
        hiddenOptions[i].removeAttribute("hidden");
    }
    switch (this.value) {
        case "ko":
            options.querySelector("option[value='ko']").setAttribute("hidden", "");
            options.value = "en";
        case "auto":
            break;
        case "en":
            for (i = 0; i < options.length; i++) {
                switch(options[i].value) {
                    case "ja":
                    case "fr":
                    case "ko":
                        break;
                    default:
                        options[i].setAttribute("hidden", "");
                        break;
                }
            }
            options.value = "ko";
            break;
        case "ja":
        case "fr":
            for (i = 0; i < options.length; i++) {
                switch(options[i].value) {
                    case "en":
                    case "ko":
                        break;
                    default:
                        options[i].setAttribute("hidden", "");
                        break;
                }
            }
            options.value = "ko";
            break;
        default:
            for (i = 0; i < options.length; i++) {
                switch(options[i].value) {
                    case "ko":
                        break;
                    default:
                        options[i].setAttribute("hidden", "");
                        break;
                }
            }
            options.value = "ko";
            break;
    }
});