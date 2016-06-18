function popupboxstate() {
    if(document.getElementsByClassName('u-myproduct-editpopod')) {
        var popupbox = document.querySelector('.u-myproduct-editpopod');
    } else {
        return;
    }
    var titles = popupbox.querySelector('.nav').getElementsByClassName('cont');
    var contbox = popupbox.getElementsByClassName('contbox');
    var buttons = popupbox.getElementsByTagName('button');
    console.log(titles);
    for(var i = 0, len = titles.length; i < len; i++) {
        buttons[i].addEventListener('click',function(e) {
            popupbox.parentNode.style['display'] = 'none';
        });
        titles[i].addEventListener('click',function(e) {
            var number = e.currentTarget.getAttribute('box');
            for(var a = 0, len = titles.length; a < len; a ++) {
                titles[a].classList.remove('on');
                contbox[a].style['display'] = 'none';
            }
            titles[number].classList.add('on');
            contbox[number].style['display'] = '';
        })
    }
}

popupboxstate();
