
function bankcard() {
    var submit = document.getElementById('js-cardsubmit');
    var bankCard = document.getElementById('js-card');
    var quota = document.getElementById('js-quota');
    var maxQuota = + document.getElementById('js-maxQuota').innerHTML;
    var personName = document.getElementById('js-personName');
    var allready = false;

    /*��д��Ϣʱ���ϼ�����������*/
    personName.addEventListener('input',buttonshow);
    quota.addEventListener('input',buttonshow);
    personName.addEventListener('blur',checkinfo);
    quota.addEventListener('blur',checkinfo);
    submit.addEventListener('click',submitInfo);


    var personNameReg = /[\u4E00-\u9FA5]{2,7}/g;//�������2-7������



    function buttonshow() {//�����������ݺϷ�����ť�ɵ��
        if(bankCard.value != '' && personNameReg.test(personName.value) && (quota.value <= maxQuota )) {
            submit.classList.remove('disable');
            allready = true;
        }
        else {
            submit.classList.add('disable');
            allready = false;
        }
    }

    function submitInfo() {//��ť�����ʱ�������������ж��Ƿ��ύ
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

    function checkinfo(e) {//�����ʧȥ���㼴�ж����������Ƿ�Ϸ�
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
        /*����������ݵ����*/
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

    /*��д��Ϣʱ���ϼ�����������*/
    quota.addEventListener('input',buttonshow);
    quota.addEventListener('blur',checkinfo);
    submit.addEventListener('click',submitInfo);


    function buttonshow() {//�����������ݺϷ�����ť�ɵ��
        if(alipayCard.value != '' && (quota.value <= maxQuota )) {
            submit.classList.remove('disable');
            allready = true;
        }
        else {
            submit.classList.add('disable');
            allready = false;
        }
    }

    function submitInfo() {//��ť�����ʱ�������������ж��Ƿ��ύ
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

    function checkinfo(e) {//�����ʧȥ���㼴�ж����������Ƿ�Ϸ�
        var thisnode = e.currentTarget,checkcont = false;
        if(thisnode.id == 'js-alipayQouta') {
            checkcont = (quota.value <= maxQuota && quota.value != '')? true : false;
        }
        /*����������ݵ����*/
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
