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

function titlesearch() {//������������js
	var enterbox = document.getElementById('js-search'),
		placeholder = document.getElementById('js-searchcont'),
		magnifier = document.getElementById('js-magnifier'),
		searchHistory = document.getElementById('js-searchHistory'),
		historyLi = document.getElementById('js-searchHistory-li'),
		historyLiBox = historyLi.getElementsByTagName('li'),
		submit = document.getElementById('js-titleSubmit'),
		msgbox = document.querySelector('.msgbox');

	enterbox.addEventListener('focus',function(){//����������ý���
		placeholder.style.display = 'none';
		magnifier.classList.add('on');
		searchHistory.style.display = 'block';
		submit.style.display = 'block';
		msgbox.style.display = 'none';
	})
	enterbox.addEventListener('blur',function(){//���������ʧȥ����
		if(!enterbox.value) {//����û�û����������
			magnifier.classList.remove('on');
			placeholder.style.display = '';
			submit.style.display = '';
			msgbox.style.display = '';
		}
		setTimeout(function() {//��blur�¼��������ӳ�һ��ʱ��������ʷ������ʹ��ʷ�����ĵ���¼�����ִ��
			searchHistory.style.display = 'none'
		},10);

	})
	/*��ʷ������ѡ����*/
	for(var i = 0;i<historyLiBox.length;i++) {
		historyLiBox[i].addEventListener('click',searchHistoryLi);
	}
	function searchHistoryLi() {
		var liCont = this.innerHTML;
		enterbox.value = liCont;
		searchHistory.style.display = 'none';
		placeholder.style.display = 'none';
		magnifier.classList.add('on');
		submit.style.display = 'block';
		msgbox.style.display = 'none';
	}
	/*end*/
}

titlesearch();

