
function addLoadEvent(func) {
    var oldonload = window.onload;
    if(typeof window.onload != 'function') {
        window.onload = func;
    }
    else {
        window.onload = function() {
            oldonload;
            func;
        }
    }
}
function main() {
    var allchildnode = document.getElementById('js-changecont').childNodes,
        changenode = [],
        contbox = [],
        count = 0;
    for (var i=0; i<allchildnode.length; i++) {
        if(allchildnode[i].nodeType == 1) {
            changenode[count] = allchildnode[i];
            count ++;
        }
    }
    for(var i=0; i<changenode.length; i++) {//为按钮添加点击切换内容函数
        changenode[i].addEventListener('click',contChange);
        contbox[i] = document.getElementById('js-contbox0' + (i+1));
    }
    function contChange(e) {
        var clicknode = e.currentTarget,
            othernode;
        clicknode.classList.add('on');
        for(var i=0; i<changenode.length; i++) {
            othernode = changenode[i];
            contbox[i].style.display = 'block';
            if(othernode!=e.currentTarget) {
                othernode.classList.remove('on');
                contbox[i].style.display = 'none';
            }

        }
    }
}

addLoadEvent(main);
