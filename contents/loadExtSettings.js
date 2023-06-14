async function init() {
    const savedSettings = await browser.storage.sync.get(); //저장된 값 불러오기
    const today = new Date();
    let i;

    console.log(savedSettings);
    // 카카오 i 번역 API 서비스 종료 (2023.07.01 자정)
    if (today > Date.parse("Thu, 30 Jun 2023 23:59:59 UTC+0900")) {
        document.getElementById("kakaodev").disabled = true;
    }

    // 사전, 번역 서비스 사용 여부
    const autoModeChange = savedSettings.dictionarySettings.additionalOptions.includes("autoModeChange");
    document.getElementById(savedSettings.platformMode).checked = true;
    if (savedSettings.platformMode == "dic") { // 사전
        document.getElementById('dicSettings').style.display = "block";
        if (autoModeChange)
            document.getElementById("autoModeChange").checked = true;
        else
            document.getElementById("autoModeChange").checked = false;
    }
    if (savedSettings.platformMode == "translate" || autoModeChange) { //번역
        document.getElementById('translateSettings').style.display = "block";
    }

    //사전 설정
    const dicDetectMode = savedSettings.dictionarySettings.detectMode;
    for (i = 0; i < dicDetectMode.length; i++) {
        switch(dicDetectMode[i].lang) {
            case "kr":
                document.getElementById("krDicMode").value = dicDetectMode[i].use;
                break;
            case "en":
                document.getElementById("enDicMode").value = dicDetectMode[i].use;
                break;
        }
    }

    //번역 제공자 설정
    const providers = savedSettings.translationSettings.provider;
    const currentProvider = savedSettings.translationSettings.current;
    if (currentProvider) {
        document.getElementById(currentProvider).checked = true;
    } else {
        document.getElementById("kakaodev").checked = true;
    }
    
    switch (currentProvider) {
        case "naver":
            showNaverPapago();
            document.getElementById("naverClientId").value = providers.naver.id || ""; //네이버 파파고 Client ID
            document.getElementById("naverClientSecret").value = providers.naver.secret || ""; //네이버 파파고 Client Secret
            document.getElementById("srcLangNaver").value = providers.naver.srcLang || "en";
            document.getElementById("targetLangNaver").value = providers.naver.targetLang || "ko";
            break;
        case "google":
            showGoogleTranslate();
            document.getElementById("googleApiKey").value = providers.google.api || "";
            document.getElementById("srcLangGoogle").value = providers.google.srcLang || "auto";
            document.getElementById("targetLangGoogle").value = providers.google.targetLang || "ko";
            break;
        case "kakaodev":
        default:
            showKakaoDev();
            document.getElementById("apikey").value = providers.kakaodev.api || "";
            document.getElementById("srcLang").value = providers.kakaodev.srcLang || "en";
            document.getElementById("targetLang").value = providers.kakaodev.targetLang || "kr";
            break;
    }

    //기능 설정
    document.getElementById("dragToFind").checked = false;
    document.getElementById("contextToFind").checked = false;
    document.getElementById("openNewTab").checked = false;

    for (i = 0; i < savedSettings.useOptions.length; i++) {
        document.getElementById(savedSettings.useOptions[i]).checked = true;
    }

    //모양새 설정
    if (savedSettings.appearance.size) {
        document.getElementById("popupFontSize").value = savedSettings.appearance.size;
    }

    document.settings.fontMode.value = savedSettings.appearance.font;
    switch(savedSettings.appearance.font) {
        case "RIDIBatang":
            document.body.style.fontFamily = "\"RIDIBatang\", serif";
            break;
        case "NanumSquare":
            document.body.style.fontFamily = "\"NanumSquare\", sans-serif";
            break;
        case "Pretendard Variable":
            document.body.style.fontFamily = "\"Pretendard Variable\", sans-serif";
            break;
    }
}

document.addEventListener("DOMContentLoaded", init);