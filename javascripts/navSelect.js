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


function navSelect() {//选择部位的导航点击后改变颜色
	 var nav = document.getElementById('js-navSelect'),
		 option = nav.getElementsByClassName('cont'),
		 screenbox = document.getElementById('js-choosecontbox'),
		 chooseSubmit = document.getElementById('js-choose-submit'),
		 selects = nav.getElementsByTagName('select'),
		 optionBox = document.getElementById('js-chooseclass');

	/*为各个项添加点击事件*/
	for (var i = 0; i < option.length; i++) {
		option[i].addEventListener('click', navclick)
	}

	function navclick() {
		for (var i = 0; i < option.length; i++) {
			option[i].classList.remove('on');
		}
		this.classList.add('on');
		if (this.id == 'js-choose') {//如果点击的是筛选
			//screenbox.style.display = 'block';
            $(screenbox).toggle();
		}
		else {
			screenbox.style.display = 'none';
		}
	}
	/*end*/

	/*添加选中的项到标签组末尾*/
	for (var a = 0; a < selects.length; a++) {
		selects[a].addEventListener('change',addOption);
	}
	function createOption(optionCont, cid) {
		
		var nodeDiv = document.createElement('div');
		var nodeP = document.createElement('p');
		var nodeImg = document.createElement('img');

		nodeDiv.setAttribute('class','cont');
        nodeDiv.setAttribute('data_cat_id', cid); //设置分类id
		nodeP.innerHTML = optionCont;
		nodeImg.setAttribute('src','img/hongwu_61.png');

		nodeDiv.appendChild(nodeP);
		nodeDiv.appendChild(nodeImg);
		return nodeDiv;
	}

	function addOption(e) {
        var optionCont = e.currentTarget.value;
        var selectOption = e.currentTarget.options[e.currentTarget.selectedIndex];
        var cid = selectOption.getAttribute('data_id'); //分类的id
		optionBox.appendChild(createOption(optionCont, cid));
	}

	/*end*/

	chooseSubmit.addEventListener('click',function(){//为筛选的确定绑定事件
		screenbox.style.display = 'none';
	})
    
    document.getElementById('js-choosecontbox').addEventListener('click', function(e){
        var target = e.target;
        if (target.hasAttribute('data-id')) {
            var cid = target.getAttribute('data-id')
            var name = target.getAttribute('data-name')
            document.getElementById('js-chooseclass')
            .appendChild(createOption(name, cid));
            document.getElementById('js-choosecontbox').style.display = 'none';
            Bootstrap.triggerSearchChange(); //触发搜索
        }   
    });
}



function chooseClass() {//标签点击关闭
    /**
	var chooseclass = document.getElementById('js-chooseclass').getElementsByClassName('cont');
	for(var i = 0; i<chooseclass.length; i++) {
		chooseclass[i].addEventListener('click',chooseclassclick);
	}
	function chooseclassclick(e) {
		e.currentTarget.style.display = 'none';
	}
    **/
    document.getElementById('js-chooseclass').addEventListener('click',
            function(e){
                var target = e.target;
                if (target.parentNode.className == 'cont') {
                    toDelTarget = target.parentNode;
                }
                if (target.className == 'cont') {
                    toDelTarget = target;
                }
                if (toDelTarget) {
                    $(toDelTarget).remove();
                    Bootstrap.triggerSearchChange(); //触发搜索
                }
                //e.currentTarget.childNodes[1] && e.currentTarget.childNodes[1].remove();
            });
}







navSelect();
chooseClass();




