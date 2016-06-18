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

function titlesearch() {//这个是搜索框的js
	var enterbox = document.getElementById('js-search'),
		placeholder = document.getElementById('js-searchcont'),
		magnifier = document.getElementById('js-magnifier'),
		searchHistory = document.getElementById('js-searchHistory'),
		historyLi = document.getElementById('js-searchHistory-li'),
		historyLiBox = historyLi.getElementsByTagName('li'),
		submit = document.getElementById('js-titleSubmit'),
		msgbox = document.querySelector('.msgbox');

	enterbox.addEventListener('focus',function(){//如果搜索框获得焦点
		placeholder.style.display = 'none';
		magnifier.classList.add('on');
		searchHistory.style.display = 'block';
		submit.style.display = 'block';
		msgbox.style.display = 'none';
	})
	enterbox.addEventListener('blur',function(){//如果搜索框失去焦点
		if(!enterbox.value) {//如果用户没有输入内容
			magnifier.classList.remove('on');
			placeholder.style.display = '';
			submit.style.display = '';
			msgbox.style.display = '';
		}
		setTimeout(function() {//在blur事件触发后延迟一段时间隐藏历史搜索，使历史搜索的点击事件可以执行
			searchHistory.style.display = 'none'
		},10);

	})
	/*历史搜索的选项被点击*/
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

