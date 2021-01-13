function showFrame() {
    let userText = window.getSelection().toString().trim();
    let requestDic = new XMLHttpRequest();
    let dicRawText;
    if (userText != null) {
        requestDic.open('GET', 'https://suggest-bar.daum.net/suggest', true);
        requestDic.send('mod=json&code=utf_in_out&enc=utf&id=language&cate=lan&q=' + userText);
        requestDic.onreadystatechange = function() {
            if(requestDic.readyState === XMLHttpRequest.DONE) {
                if (requestDic.status === 200) {
                    dicRawText = JSON.stringify(requestDic.responseText, ['items']);
                    console.log(dicRawText);
                }
            } else {

            }
        }
    }
}

document.addEventListener("mouseup", showFrame);