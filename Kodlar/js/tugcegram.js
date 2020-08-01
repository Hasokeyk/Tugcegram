chrome.extension.sendMessage({}, function(response){
    var readyStateCheckInterval = setInterval(function(){
        if(document.readyState==="complete"){
            clearInterval(readyStateCheckInterval);
        
                var globalUserID = userInfo('userID');
    
                $('body').append(`
                <div class="tugcegram">
                    <div class="tugcegram-title">Tugcegram</div>
                    <ul>
                        <li class="unfollowListShow">Beni Takip Etmeyenleri Göster</li>
                        <li class="unfollowCalc">Beni Takip Etmeyenleri Yeniden Hesapla</li>
                        <li class="disabled">Beni Takip Etmeyenleri Takipten Çık</li>
                        <li class="disabled">Son Paylaşımı Herkese Mesaj At</li>
                    </ul>
                </div>`);
                
                setTimeout(function(){
                    $('.tugcegram').addClass('start');
                })
            
                $('body').on('click','.tugcegram li:not(.active):not(.disabled)',function(){
                    
                    var me = $(this);
                    var className = $(this).attr('class');
                    var text = $(this).text();
                    $(this).addClass('active');
                    $(this).text('Lütfen Bekleyin...');
                    
                    window[className]().then((res) => {
                        console.log(res)
                        me.text(text);
                        me.removeClass('active');
                    }).catch((err) => {
                        console.log(err)
                    });
                    
                })
        }
    }, 10);
});