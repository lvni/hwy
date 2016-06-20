/*选择全部*/
function chooseall(trigger, nodes) {
    if (document.querySelector(trigger) &&  document.querySelector(nodes)) {
        var trigger = document.querySelector(trigger);
        var nodes = document.querySelector(nodes).getElementsByClassName('u-checkbox');
        var chooseAllNode = trigger.querySelector('.u-checkbox');
    } else {
        return;
    }
    trigger.addEventListener('click',function(){
        if(chooseAllNode.checked) {
            (function(){
                for(var i = 0, len = nodes.length; i < len; i++) {
                    nodes[i].checked = true;
                }
            })();
        }
    })

}

chooseall('#js-chooseall','#js-contbox04');
/*end*/


/*弹出编辑窗口*/
function editprice() {
    if(document.getElementsByClassName('editnode')) {
        var triggernode = document.getElementsByClassName('editnode');
        var popupbox = document.getElementById('js-editpricebox');
    } else {
        return;
    }
    (function(){
        for( var i = 0,len = triggernode.length; i < len; i++) {
            triggernode[i].addEventListener('click',function(){
                popupbox.style['display'] = '-webkit-box';
            })
        }
    })();

}
editprice();
/*end*/


