async function updateFromMadoka() {
    const previousValues = await browser.storage.sync.get();
    const newValues = {
        platformMode: previousValues.mode,
        useOptions: [],
        dictionarySettings: {
            detectMode: [
                {
                    lang: "kr",
                    use: previousValues.krDicMode,
                    stdict: false,
                    stdictOptions: {
                        api: undefined
                    }
                },
                {
                    lang: "en",
                    use: previousValues.enDicMode
                }
            ],
            additionalSettings: []
        },
        translationSettings: {
            current: "kakaodev",
            provider: []
        },
        appearance: {
            size: previousValues.fontSize,
            weight: {
                header: 400,
                meaning: 400,
                readMore: 400
            },
            color : {
                header: "cornflowerblue",
                meaning: "black",
                readMore: "gray"
            }
        }
    };
    
    if (previousValues.apiKey) {
        newValues.translationSettings.provider.push(
            {
                company: "kakaodev",
                api: previousValues.apiKey,
                srcLang: previousValues.srcLang,
                targetLang: previousValues.targetLang
            }
        );
    }

    if (previousValues.googleApiKey) {
        newValues.translationSettings.current = previousValues;
        newValues.translationSettings.provider.push(
            {
                company: "google",
                api: previousValues.googleApiKey,
                srcLang: previousValues.srcLangGoogle,
                targetLang: previousValues.targetLangGoogle
            }
        );
    }

    if (previousValues.dragToFind) {
        newValues.useOptions.push("dragToFind");
    }

    if (previousValues.contextToFind) {
        newValues.useOptions.push("contextToFind");
    }

    if (previousValues.openNewTab) {
        newValues.useOptions.push("openNewTab");
    }

    if (previousValues.autoModeChange) {
        newValues.dictionarySettings.additionalSettings.push("autoModeChange");
    }

    switch (previousValues.fontMode) {
        case "serif":
            newValues.appearance.font = "RIDIBatang";
            newValues.appearance.type ="serif";
            break;
        case "sansSerif":
            newValues.appearance.font = "NanumSquare";
            newValues.appearance.type ="sans-serif";
            break;
        default:
            newValues.appearance = {
                font: "Pretendard Variable",
                type: "sans-serif",
                size: 14,
                feature: "ss05",
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
            break;
    }

    browser.storage.sync.set(newValues);
}

function initializeDict() {
    browser.storage.sync.set({
        platformMode: "dic",
        useOptions: [
            "dragToFind", "openNewTab"
        ],
        dictionarySettings: {
            detectMode: [
                {
                    lang: "kr",
                    use: "kr",
                    stdict: false,
                    stdictOptions: {
                        api: undefined
                    }
                },
                {
                    lang: "en",
                    use: "kr"
                }
            ]
        },
        appearance: {
            font: "Pretendard Variable",
            type: "sans-serif",
            size: 14,
            feature: "ss05",
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
    });
}

browser.runtime.onInstalled.addListener((detail) => {
    if (detail.reason == "update") {
        if (
            detail.previousVersion.startsWith("2.0") ||
            detail.previousVersion.startsWith("1.")
        ) {
            updateFromMadoka();
        }
    } else if (detail.reason == "install") {
        initializeDict();
    }
});