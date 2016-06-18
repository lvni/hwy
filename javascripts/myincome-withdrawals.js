
function bankcard() {
    var submit = document.getElementById('js-cardsubmit');
    var bankCard = document.getElementById('js-card');
    var quota = document.getElementById('js-quota');
    var maxQuota = + document.getElementById('js-maxQuota').innerHTML;
    var personName = document.getElementById('js-personName');
    var allready = false;

    /*填写信息时不断检测输入的内容*/
    personName.addEventListener('input',buttonshow);
    quota.addEventListener('input',buttonshow);
    personName.addEventListener('blur',checkinfo);
    quota.addEventListener('blur',checkinfo);
    submit.addEventListener('click',submitInfo);


    var personNameReg = /[\u4E00-\u9FA5]{2,7}/g;//输入的是2-7个中文



    function buttonshow() {//如果输入的内容合法，则按钮可点击
        if(bankCard.value != '' && personNameReg.test(personName.value) && (quota.value <= maxQuota )) {
            submit.classList.remove('disable');
            allready = true;
        }
        else {
            submit.classList.add('disable');
            allready = false;
        }
    }

    function submitInfo() {//按钮被点击时根据输入内容判断是否提交
        if(bankCard.value == '') {
            bankCard.classList.add('error');
        }
        if(!allready) {
            console.log('false');
            return false;
        }
        else {
            console.log('true');
            return true;
        }
    }

    function checkinfo(e) {//输入框失去焦点即判断输入内容是否合法
        var thisnode = e.currentTarget,checkcont = false;
        if(thisnode.id == 'js-card') {
            checkcont = (bankCard.value != '')? true : false;
        }
        if(thisnode.id == 'js-quota') {
            checkcont = (quota.value <= maxQuota && quota.value != '')? true : false;
        }
        if(thisnode.id == 'js-personName') {
            checkcont = (personNameReg.test(personName.value))? true : false;
        }
        /*检查输入内容的情况*/
        if(!checkcont) {
            thisnode.classList.add('error');
        }
        else {
            thisnode.classList.remove('error');
        }
    }
}

function alipay() {
    var submit = document.getElementById('js-alipaysubmit');
    var alipayCard = document.getElementById('js-alipay-card');
    var quota = document.getElementById('js-alipayQouta');
    var maxQuota = + document.getElementById('js-alipayMaxQouta').innerHTML;
    var allready = false;

    /*填写信息时不断检测输入的内容*/
    quota.addEventListener('input',buttonshow);
    quota.addEventListener('blur',checkinfo);
    submit.addEventListener('click',submitInfo);


    function buttonshow() {//如果输入的内容合法，则按钮可点击
        if(alipayCard.value != '' && (quota.value <= maxQuota )) {
            submit.classList.remove('disable');
            allready = true;
        }
        else {
            submit.classList.add('disable');
            allready = false;
        }
    }

    function submitInfo() {//按钮被点击时根据输入内容判断是否提交
        if(alipayCard.value == '') {
            alipayCard.classList.add('error');
        }
        if(!allready) {
            return false;
        }
        else {
            return true;
        }
    }

    function checkinfo(e) {//输入框失去焦点即判断输入内容是否合法
        var thisnode = e.currentTarget,checkcont = false;
        if(thisnode.id == 'js-alipayQouta') {
            checkcont = (quota.value <= maxQuota && quota.value != '')? true : false;
        }
        /*检查输入内容的情况*/
        if(!checkcont) {
            thisnode.classList.add('error');
        }
        else {
            thisnode.classList.remove('error');
        }
    }
}
bankcard();
alipay();
