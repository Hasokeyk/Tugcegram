var unfollowDiv = false;
var shared = findSharedData(document);

unfollowCalc();

//TAKİP ETMEYENLERİ BULMA
function unfollow_prosess(following = false, followers = false,json = false){
    
    var unfollow = [];
    $.each(following, function(flwing, wing){
        //console.log(i)
        
        var have = false;
        $.each(followers, function(flwers, wers){
            
            if(json == false){
                if(wing.username == wers.username){
                    have = true;
                    return false;
                }
            }else{
                if(flwing == flwers){
                    have = true;
                    return false;
                }
            }
            
        })
    
        if(json == false){
            if(have == false){
                unfollow.push(wing)
            }
        }else{
            if(have == false){
                unfollow.push({username:flwing})
            }
        }
        
        localStorage.setItem(shared.config.viewer.id+'-unfollowList',JSON.stringify(unfollow));
        
    })
    
    return unfollow;
    
}
//TAKİP ETMEYENLERİ BULMA

//DİZİLER ARASI FARKLARI GÖSTER
function arr_diff(a1, a2){
    
    var a = [], diff = [];
    
    for(var i = 0; i < a1.length; i++){
        a[a1[i]] = true;
    }
    
    for(var i = 0; i < a2.length; i++){
        if(a[a2[i]]){
            delete a[a2[i]];
        }else{
            a[a2[i]] = true;
        }
    }
    
    for(var k in a){
        diff.push(k);
    }
    
    return diff;
}
//DİZİLER ARASI FARKLARI GÖSTER

//KULLANICI BİLGİLERİ
function findSharedData(elm = document){
    if(elm.nodeType == Node.ELEMENT_NODE || elm.nodeType == Node.DOCUMENT_NODE){
        for(var i = 0; i < elm.childNodes.length; i++){
            // recursively call self
            var result = findSharedData(elm.childNodes[i]);
            if(result != null){
                return result;
            }
        }
    }
    
    if(elm.nodeType == Node.TEXT_NODE){
        if(elm.nodeValue.startsWith("window._sharedData = ")){
            var jsonString = elm.nodeValue.replace("window._sharedData = ", "");
            jsonString = jsonString.slice(0, -1);
            return JSON.parse(jsonString);
        }
        return null;
    }
    
    return null;
}
//KULLANICI BİLGİLERİ

//KULLANICI BİLGİLERİ ALMA
function meInfo(data = 'hasan'){
    var meInfo = findSharedData();
    
    if(data == 'followers'){
        data = meInfo.entry_data.ProfilePage[0].graphql.user.edge_followed_by.count || null;
    }else if(data == 'followings'){
        data = meInfo.entry_data.ProfilePage[0].graphql.user.edge_follow.count || null;
    }else if(data == 'userID'){
        data = meInfo.entry_data.ProfilePage[0].graphql.user.id || null;
    }else{
        data = data;
    }
    
    return data;
}
//KULLANICI BİLGİLERİ ALMA

//KULLANICININ TAKİP ETTİĞİ KULLANICILAR
const get_followers = async(userId, userFollowerCount) => {
    let userFollowers = [], batchCount = 20, actuallyFetched = 20, hash = queryHash,
        url = `https://www.instagram.com/graphql/query/?query_hash=${hash}&variables={"user_id":"${userId}","include_chaining":false,"fetch_mutual":true,"first":"${batchCount}"}`;
    while(userFollowerCount > 0){
        const followersResponse = await fetch(url)
        .then(res => res.json())
        .then(res => {
            const nodeIds = [];
            for(const node of res.data.user.edge_followed_by.edges){
                nodeIds.push({
                    userID:node.node.id,
                    username:node.node.username,
                    profilPic:node.node.profile_pic_url,
                    fullName:node.node.full_name
                });
            }
            actuallyFetched = nodeIds.length;
            return {
                edges:nodeIds, endCursor:res.data.user.edge_followed_by.page_info.end_cursor
            };
        }).catch(err => {
            userFollowerCount = -1;
            return {
                edges:[]
            };
        });
        await random_wait_time();
        userFollowers = [...userFollowers, ...followersResponse.edges];
        
        window.localStorage.setItem('followersPercent', calculatePercentage(userFollowerCount, userFollowers.length));
        
        userFollowerCount -= actuallyFetched;
        url = `https://www.instagram.com/graphql/query/?query_hash=${hash}&variables={"user_id":"${userId}","include_chaining":false,"fetch_mutual":true,"first":${batchCount},"after":"${followersResponse.endCursor}"}`;
    }
    localStorage.setItem(userId+'-followers', JSON.stringify(userFollowers))
    return userFollowers;
};
//KULLANICININ TAKİP ETTİĞİ KULLANICILAR

//KULLANICININ TAKİPÇİLERİ
const get_following = async(userId, userFollowingCount) => {
    let userFollowing = [], batchCount = 20, actuallyFetched = 20, hash = queryHash,
        url = `https://www.instagram.com/graphql/query/?query_hash=${hash}&variables={"id":"${userId}","include_reel":true,"fetch_mutual":false,"first":"${batchCount}"}`;
    
    while(userFollowingCount > 0){
        const followingsResponse = await fetch(url)
        .then(res => res.json())
        .then(res => {
            const nodeIds = [];
            for(const node of res.data.user.edge_follow.edges){
                nodeIds.push({
                    userID:node.node.id,
                    username:node.node.username,
                    profilPic:node.node.profile_pic_url,
                    fullName:node.node.full_name
                });
            }
            actuallyFetched = nodeIds.length;
            return {
                edges:nodeIds, endCursor:res.data.user.edge_follow.page_info.end_cursor
            };
        }).catch(err => {
            userFollowingCount = -1;
            return {
                edges:[]
            };
        });
        await random_wait_time();
        userFollowing = [...userFollowing, ...followingsResponse.edges];
        
        window.localStorage.setItem('followingsPercent', calculatePercentage(userFollowingCount, userFollowing.length));
        
        userFollowingCount -= actuallyFetched;
        url = `https://www.instagram.com/graphql/query/?query_hash=${hash}&variables={"id":"${userId}","include_reel":true,"fetch_mutual":false,"first":${batchCount},"after":"${followingsResponse.endCursor}"}`;
    }
    localStorage.setItem(userId+'-following', JSON.stringify(userFollowing))
    return userFollowing;
};
//KULLANICININ TAKİPÇİLERİ

//RASTGELE BİR SÜREDE İŞLEM YAPTIRMA
const random_wait_time = (waitTime = 1000) => new Promise((resolve, reject) => {
    setTimeout(() => {
        return resolve();
    }, Math.random()*waitTime);
});
//RASTGELE BİR SÜREDE İŞLEM YAPTIRMA

//İŞLEMİN YÜZDE HESAPLAMASI
function calculatePercentage(percent, num){
    if(percent <= num){
        return Math.floor((percent*100)/num);
    }else{
        return Math.floor((num*100)/percent);
    }
}
//İŞLEMİN YÜZDE HESAPLAMASI


async function unfollowCalc(){

    var unfList = localStorage.getItem(meInfo('userID')+'-unfollowList');
    if(unfList){
        unfList = JSON.parse(unfList);
        console.log(unfList.length)
        createNewStatic(unfList);
    }

}

function createNewStatic(unfList = false){
    
    if(unfList != false){
        var text = 'Takip Etmeyen';
        var count = unfList.length;
    }else{
        var text = 'Hesaplanıyor...';
        var count = 0;
    }
    
    if($('.k9GMp .Y8-fY:eq(3)').hasClass('unfollow-count') === false){
        $('.k9GMp').append(`
            <li class="Y8-fY unfollow-count">
                <a class="-nal3 " href="#">
                    <span class="g47SY unfollow-count-text">${count}</span>
                    <span class="unfollow-text">${text}</span>
                </a>
            </li>
        `);
    }else{
        $('.unfollow-count .unfollow-count-text').text(count)
        $('.unfollow-count .unfollow-text').text(text)
    }
    
    $(document).on('click', '.Y8-fY.unfollow-count', function(){
        createUnfollowList(unfList);
    })
}

async function createUnfollowList(unfollowList){
    
    $('.unfollow-count .unfollow-count-text').text(unfollowList.length);
    $('.unfollow-count .unfollow-text').text('Takip Etmeyen');
    
    var unfollowPopupContent = ''
    $.each(unfollowList, function(i, e){
        unfollowPopupContent += `
                    <li class="${e.username}">
                        <div aria-labelledby="f3f482605e056c ff51fd5b0738c8" class="Igw0E rBNOH eGOV_ ybXk5 _4EzTm XfCBB HVWg4 ">
                            <div class="Igw0E IwRSH YBx95 vwCYk ">
                                <div class="Igw0E IwRSH eGOV_ _4EzTm " id="f3f482605e056c">
                                    <div class="_7UhW9 xLCgt MMzan KV-D4 fDxYl">
                                        <div class="Igw0E IwRSH eGOV_ ybXk5 _4EzTm ">
                                            <a class="FPmhX notranslate _0imsa " title="${e.username}" href="/${e.username}/">${e.username}</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="Igw0E rBNOH YBx95 ybXk5 _4EzTm soMvl">
                                <input type="checkbox" class="unfollowCheckbox" data-userid="${e.userID}" data-username="${e.username}">
                                <button class="sqdOP L3NKy _8A5w5 unfollow-button" type="button" data-userid="${e.userID}" data-username="${e.username}">Takiptesin</button>
                            </div>
                        </div>
                    </li>
                    `;
    })
    
    var popupHtml = `
<div class="RnEpo Yx5HN unfollow-popup" role="presentation">
    <div class="pbNvD fPMEg HYpXt" role="dialog">
        <div class="_1XyCr">
            <div>
                <div class="eiUFA">
                    <div class="WaOAr"></div>
                    <h1 class="m82CD">
                        <div>Seni Takip Etmeyenler</div>
                    </h1>
                    <div class="WaOAr">
                        <button class="wpO6b " type="button">
                            <svg aria-label="Kapat" class="_8-yf5 " fill="#262626" height="24" viewBox="0 0 48 48" width="24">
                                <path clip-rule="evenodd" d="M41.1 9.1l-15 15L41 39c.6.6.6 1.5 0 2.1s-1.5.6-2.1 0L24 26.1l-14.9 15c-.6.6-1.5.6-2.1 0-.6-.6-.6-1.5 0-2.1l14.9-15-15-15c-.6-.6-.6-1.5 0-2.1s1.5-.6 2.1 0l15 15 15-15c.6-.6 1.5-.6 2.1 0 .6.6.6 1.6 0 2.2z" fill-rule="evenodd"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div class="isgrP" style="overflow-y: scroll; height: 600px;">
                <ul class="jSC57 _6xe7A">
                    <div class="PZuss">
                        ${unfollowPopupContent}
                    </div>
                </ul>
                <div class="oMwYe"></div>
            </div>
            <div>
                <div class="eiUFA">
                    <div class="m82CD">
                        <button class="sqdOP  L3NKy   y3zKF autoUnfollowBtn">Seçilenleri Takipten Çıkart</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;
    
    $('body').append(popupHtml);
    
    $(document).on('click', '.unfollow-count', function(){
        $('.unfollow-popup').fadeIn('slow');
    })
    
    $(document).on('click', '.wpO6b', function(){
        $('.unfollow-popup').remove();
    });
    
    $(document).on('click', '.unfollow-button', async function(){
        
        $(this).text('Bekleyin...');
    
        var parent = $(this).parent().parent().parent();
        var userID = $(this).data('userid');
        var username = $(this).data('username');
    
        var userinfo = await findUser(username).then(userinfo => {
            return userinfo.graphql.user;
        });
        
        var unf = await unfollow(userinfo.id).then(res => {
            return res;
        });
        if(unf){
            $(parent).hide();
    
            unfList = JSON.parse(localStorage.getItem(meInfo('userID')+'-unfollowList'));
            var newFollowing = [];
            $.each(unfList, function(i, e){
                if(e.username != username){
                    newFollowing.push(e)
                }
            })
            localStorage.setItem(meInfo('userID')+'-unfollowList', JSON.stringify(newFollowing));
    
            $('.unfollow-count .unfollow-count-text').text(newFollowing.length)
            
        }else{
            alert('Unfollow Edemiyor. Lütfen biraz bekle')
            console.log(res)
        }
        
        return false;
    });
    
    $(document).on('click', '.autoUnfollowBtn', function(){
    
        $(this).text('Lütfen Bekleyin...');
    
        var parent = $(this).parent().parent().parent().parent();
        
        var unfCheckboxList = [];
        $('.unfollow-popup .unfollowCheckbox:checked').each(function(i,e){
            var username = $(e).data('username');
            unfCheckboxList.push(username);
        })
    
        unfCheckboxList.forEach(function(username,i){
            setTimeout(async function(){
    
                var userinfo = await findUser(username).then(userinfo => {
                    return userinfo.graphql.user;
                });
    
                var unf = await unfollow(userinfo.id).then(res => {
                    return res;
                });
                if(unf){
    
                    $(' .'+username,parent).hide();
        
                    unfList = JSON.parse(localStorage.getItem(meInfo('userID')+'-unfollowList'));
                    var newFollowing = [];
                    $.each(unfList, function(i, e){
                        if(e.username != username){
                            newFollowing.push(e)
                        }
                    })
                    localStorage.setItem(meInfo('userID')+'-unfollowList', JSON.stringify(newFollowing));
        
                    $('.unfollow-count .unfollow-count-text').text(newFollowing.length)
        
                }else{
                    alert('Unfollow Edemiyor. Lütfen biraz bekle')
                    console.log(res)
                }
            
            },((1000 * 30) * i))
        })
        
    });
}

async function unfollow(userID){
    
    return await fetch("https://www.instagram.com/web/friendships/"+userID+"/unfollow/", {
        "headers":{
            "accept":"*/*",
            "accept-language":"tr,en;q=0.9",
            "content-type":"application/x-www-form-urlencoded",
            "sec-fetch-dest":"empty",
            "sec-fetch-mode":"cors",
            "sec-fetch-site":"same-origin",
            "x-csrftoken":shared.config.csrf_token,
            "x-ig-app-id":"936619743392459",
            "x-ig-www-claim":"hmac.AR2slL3GRrhnqx8x5yBN9aCh3cZEMLgcKkhtM6hVa_uFHVc8",
            "x-instagram-ajax":shared.rollout_hash,
            "x-requested-with":"XMLHttpRequest",
            "cookie":document.cookie
        },
        "referrer":window.location.href+"/followers/",
        "referrerPolicy":"no-referrer-when-downgrade",
        "body":null,
        "method":"POST",
        "mode":"cors"
    }).then(function(res){
        if(res.status==200){
            return true
        }else{
            return false
        }
    });
    
}

async function unfollowListShow(){
    
    if(unfollowDiv == false){
        $('.k9GMp').append(`
            <li class="Y8-fY unfollow-count">
                <a class="-nal3 " href="#">
                    <span class="g47SY unfollow-count-text">0</span>
                    <span class="unfollow-text">Hesaplanıyor...</span>
                </a>
            </li>
        `);
        unfollowDiv = true;
        unfollowCalc()
    }else{
        
        var globalUserID = meInfo('userID');
        var getFollowers = JSON.parse(localStorage.getItem(globalUserID+'-followers'));
        var getFollowing = JSON.parse(localStorage.getItem(globalUserID+'-following'));
        
        var unfollowList = unfollow_prosess(getFollowing, getFollowers)
        $('.unfollow-count-text').text(unfollowList.length);
    }
    
}

async function unfollowCalcJson(){
    
    createNewStatic();
    
    openFile(function(txt){
        
        var json = JSON.parse(txt);
    
        //console.log(json.following)
        //console.log(json.followers)
        
        var unfollowList = unfollow_prosess(json.following,json.followers,true)
        createNewStatic(unfollowList)
        //createUnfollowList(unfollowList);
        
    })

}

async function openFile(callBack){
    var element = document.createElement('input');
    element.setAttribute('type', "file");
    element.setAttribute('id', "btnOpenFile");
    element.onchange = function(){
        readText(this,callBack);
        document.body.removeChild(this);
    }
    
    element.style.display = 'none';
    document.body.appendChild(element);
    
    element.click();
}

async function readText(filePath,callBack) {
    var reader;
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        reader = new FileReader();
    } else {
        alert('The File APIs are not fully supported by your browser. Fallback required.');
        return false;
    }
    var output = ""; //placeholder for text output
    if(filePath.files && filePath.files[0]) {
        reader.onload = function (e) {
            output = e.target.result;
            callBack(output);
        };//end onload()
        reader.readAsText(filePath.files[0]);
    }//end if html5 filelist support
    else { //this is where you could fallback to Java Applet, Flash or similar
        return false;
    }
    return true;
}

async function findUser(username = 'hasokeyk'){
    return await $.getJSON('https://www.instagram.com/'+username+'/?__a=1');
}

$.fn.extend({
    toggleText:function(a, b){
        return this.text(this.text() == b?a:b);
    }
});