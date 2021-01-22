function searchDic(keyword) {

}

function searchTranslation(keyword) {
    
}

function showFrame() {
    let userText = window.getSelection().toString().trim();
    const dicAddress = ""
    //let requestDic = new XMLHttpRequest();
    let dicRawText;
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
    
}

document.addEventListener("mouseup", showFrame);