function openFullscreen() {
    elem = document.body;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
}

function leave_loader(){
    document.getElementById('loader').outerHTML="";
    document.getElementById('body-content').style.display="block"
}

function loader_update(text){
    document.getElementById('loader-text').innerText = text;
}
