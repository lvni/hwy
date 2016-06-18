
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
    var submit = document.getElementById('js-submit');
    var cardNumber = document.getElementById('js-cardNumber');
    var bankName = document.getElementById('js-bankName');
    var allready = false;
    /*如果信息都已填入，则按钮可点击*/
    cardNumber.addEventListener('input',buttonshow);
    bankName.addEventListener('change',buttonshow);
    submit.addEventListener('click',submitInfo);

    function buttonshow() {
        if(cardNumber.value != '' && bankName.value != 'empty' ) {
            submit.classList.remove('disable');
            allready = true;
        }
        else {
            allready = false;
        }
    }

    function submitInfo() {
        if(!allready) {
            return false;
        }
        else {
            return true;
        }
    }
}

main();
