const suggestUrl = "https://suggest-bar.daum.net/suggest?mod=json&code=utf_in_out&enc=utf&id=language&cate=lan&q=";
const translateUrl = "https://dapi.kakao.com/v2/translation/translate";

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

function showFrame() {
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

document.addEventListener("mouseup", showFrame);