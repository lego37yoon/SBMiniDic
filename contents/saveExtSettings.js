function saveValues() {
    const newValues = {
        platformMode: document.settings.mode.value, //사전, 번역 모드
        useOptions: [],
        dictionarySettings: {
            detectMode: [
                {
                    lang: "kr",
                    use: document.getElementById("krDicMode").value,
                    stdict: false,
                    stdictOptions: {
                        api: undefined
                    }
                },
                {
                    lang: "en",
                    use: document.getElementById("enDicMode").value
                }
            ],
            additionalOptions: []
        },
        translationSettings: {
            current: document.settings.translateProvider.value,
            provider: {
                kakaodev: {
                    api: document.getElementById("apikey").value,
                    srcLang: document.getElementById("srcLang").value,
                    targetLang: document.getElementById("targetLang").value
                },
                google: {
                    api: document.getElementById("googleApiKey").value,
                    srcLang: document.getElementById("srcLangGoogle").value,
                    targetLang: document.getElementById("targetLangGoogle").value
                }
            }
        },
        appearance: {
            font: document.settings.fontMode.value,
            size: document.getElementById("popupFontSize").value,
            weight: {
                header: 500,
                meaning: 300,
                readMore: 300
            },
            color : {
                header: "cornflowerblue",
                meaning: "black",
                readMore: "gray"
            }
        }
    };
    
    // 모양새 설정
    if (document.settings.fontMode.value !== "Pretendard Variable")
        newValues.appearance.feature = "normal";
    
    switch(document.settings.fontMode.value) {
        case "RIDIBatang":
            newValues.appearance.type = "serif";
            break;
        case "Pretendard Variable":
            newValues.appearance.feature = "ss05";
        case "NanumSquare":
        default:
            newValues.appearance.type = "sans-serif";
            break;
    }
    
    // 모드 설정
    if (!document.getElementById("dragToFind").checked && !document.getElementById("contextToFind").checked) {
        alert("최소한 하나 이상의 방법을 선택하세요.");
        document.getElementById("dragToFind").checked = true;
    }

    document.getElementById("dragToFind").checked ? newValues.useOptions.push("dragToFind") : undefined;
    document.getElementById("contextToFind").checked ? newValues.useOptions.push("contextToFind") : undefined;
    document.getElementById("openNewTab").checked ? newValues.useOptions.push("openNewTab") : undefined;

    // 사전 추가 설정
    document.getElementById("autoModeChange").checked ? newValues.dictionarySettings.additionalOptions.push("autoModeChange") : undefined;

    browser.storage.sync.set(newValues);
}

document.getElementById("saveForm").addEventListener("click", saveValues);