//确认信息弹窗和上传照片弹窗
(function(){
    if(document.getElementsByClassName('js-confirmNode') && document.getElementById('js-confirm')) {
        var confirmNodes = document.getElementsByClassName('js-confirmNode'),
            confirmbox = document.getElementById('js-confirm'),
            confirmbuttons = confirmbox.getElementsByTagName('button');
    }else {
        return;
    }
    (function(){
        for(var i = 0, len = confirmNodes.length; i < len; i++) {
            confirmNodes[i].addEventListener('click',function(){
                confirmbox.style['display'] = '-webkit-box';
            })
        }
        for(var a = 0, len = confirmbuttons.length; a < len; a++) {
            confirmbuttons[a].addEventListener('click',function(){
                confirmbox.style['display'] = 'none';
            })
        }
    })();
})();

(function(){
    if(document.getElementById('js-uploadPhotoTrigger') && document.getElementById('js-uploadPhoto')){
        var uploadTrigger = document.getElementById('js-uploadPhotoTrigger'),
            uploadPopup = document.getElementById('js-uploadPhoto');
        uploadTrigger.addEventListener('click',function(){
            uploadPopup.style['display'] = '-webkit-box';
        })
    }
})();

