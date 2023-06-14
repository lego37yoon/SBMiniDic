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