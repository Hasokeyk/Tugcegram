//TAKİP ETMEYENLERİ HESAPLAMA
function unfollow_prosess(following, followers){
    
    var unfollow = [];
    $.each(following, function(i, wing){
        //console.log(wing)
        
        var have = false;
        
        $.each(followers, function(i, wers){
            //console.log(wing.username,wers.username)
            
            if(wing.username == wers.username){
                have = true;
                return false;
            }
        })
        
        if(have == false){
            unfollow.push(wing)
        }
        
        //console.log(followers.includes(wing))
        //if (!following.includes(wing)) {
        //    unfollow.push(wing)
        //}
        
    })
    
    return unfollow;
    
}

//TAKİP ETMEYENLERİ HESAPLAMA

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
function userInfo(data = 'hasan'){
    var userInfo = findSharedData();
    
    if(data == 'followers'){
        data = userInfo.entry_data.ProfilePage[0].graphql.user.edge_followed_by.count || null;
    }else if(data == 'followings'){
        data = userInfo.entry_data.ProfilePage[0].graphql.user.edge_follow.count || null;
    }else if(data == 'userID'){
        data = userInfo.entry_data.ProfilePage[0].graphql.user.id || null;
    }else{
        data = data;
    }
    
    return data;
}
//KULLANICI BİLGİLERİ ALMA

//KULLANICININ TAKİP ETTİĞİ KULLANICILAR
const get_followers = async(userId, userFollowerCount) => {
    let userFollowers = [],
        batchCount = 20,
        actuallyFetched = 20,
        hash = queryHash,
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
    let userFollowing = [],
        batchCount = 20,
        actuallyFetched = 20,
        hash = queryHash,
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

$.fn.extend({
    toggleText:function(a, b){
        return this.text(this.text() == b?a:b);
    }
});

function calculatePercentage(percent, num){
    if(percent <= num){
        return Math.floor((percent*100)/num);
    }else{
        return Math.floor((num*100)/percent);
    }
}

var unfollowDiv = false;
async function unfollowCalc(){
    
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
    }
    
    var globalUserID = userInfo('userID');
    var userFollowerCount = userInfo('followers');
    var userFollowingCount = userInfo('followings');
    
    localStorage.removeItem(globalUserID+'-followers');
    localStorage.removeItem(globalUserID+'-following');
    
    //console.log(userFollowerCount,userFollowingCount);
    //console.log(calculatePercentage(userFollowingCount,userFollowerCount));
    
    var calc = setInterval(() => {
        var followersPercent = parseFloat(localStorage.getItem('followersPercent') || 0);
        var followingsPercent = parseFloat(localStorage.getItem('followingsPercent') || 0);
        
        var percent = calculatePercentage(100, (followersPercent+followingsPercent));
        $('.unfollow-count-text').text('%'+percent);
    }, 1000);
    
    var getFollowers = JSON.parse(localStorage.getItem(globalUserID+'-followers')) || await get_followers(globalUserID, userFollowerCount);
    var getFollowing = JSON.parse(localStorage.getItem(globalUserID+'-following')) || await get_following(globalUserID, userFollowingCount);
    
    if(getFollowers && getFollowing){
        clearInterval(calc);
        $('.unfollow-text').text('Beni Takip Etmenler');
    
        var unfollowList = unfollow_prosess(getFollowing, getFollowers)
        console.log(unfollowList)
        $('.unfollow-count-text').text(unfollowList.length);
    }
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
    
        var globalUserID = userInfo('userID');
        var getFollowers = JSON.parse(localStorage.getItem(globalUserID+'-followers'));
        var getFollowing = JSON.parse(localStorage.getItem(globalUserID+'-following'));
        
        var unfollowList = unfollow_prosess(getFollowing, getFollowers)
        $('.unfollow-count-text').text(unfollowList.length);
    }
    
}