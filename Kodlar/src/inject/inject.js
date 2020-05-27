chrome.extension.sendMessage({}, function (response) {
    var readyStateCheckInterval = setInterval(function () {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);

            var globalUserID = 0;

            var script = document.createElement('script');
            script.src = 'https://code.jquery.com/jquery-3.3.1.min.js';
            script.type = 'text/javascript';
            document.getElementsByTagName('head')[0].appendChild(script);

            $('.k9GMp').append(`
                <li class="Y8-fY unfollow-count">
                    <a class="-nal3 " href="#">
                        <span class="g47SY">0</span> takip etmeyenler
                    </a>
                </li>
            `);

            var pageType = $('meta[property="og:type"]').attr('content');
            if (pageType == "profile") {

                var shared = findSharedData(document);
                globalUserID = shared.config.viewer.id;

                var userFollowerCount = shared.entry_data.ProfilePage[0].graphql.user.edge_followed_by.count;
                var userFollowingCount = shared.entry_data.ProfilePage[0].graphql.user.edge_follow.count;
                var getFollowers = JSON.parse(localStorage.getItem(globalUserID + '-followers')) || get_followers(globalUserID, userFollowerCount);
                var getFollowing = JSON.parse(localStorage.getItem(globalUserID + '-following')) || get_following(globalUserID, userFollowingCount);

                var unfollowList = unfollow_prosess(getFollowing,getFollowers)
                $('.unfollow-count span').text(unfollowList.length);

            } else {
                console.log('Tuğçe')
            }

            $(document).on('click', '.unfollow-count', function () {

                console.log(unfollowList)

                var unfollowPopupContent = ''
                $.each(unfollowList,function (i,e) {
                    unfollowPopupContent += `
                    <li class="">
                        <div aria-labelledby="f3f482605e056c ff51fd5b0738c8" class="Igw0E rBNOH eGOV_ ybXk5 _4EzTm XfCBB HVWg4 ">
                            <div class="Igw0E IwRSH eGOV_ _4EzTm yC0tu">
                                <div class="RR-M- " role="button" tabindex="0">
                                    <canvas class="CfWVH" height="40" width="40" style="position: absolute; top: -5px; left: -5px; width: 40px; height: 40px;"></canvas>
                                    <a class="_2dbep qNELH kIKUG" href="/${e.username}/" style="width: 30px; height: 30px;">
                                        <img alt="tugceden'in profil resmi" class="_6q-tv" src="${e.profilPic}">
                                    </a>
                                </div>
                            </div>
                            <div class="Igw0E IwRSH YBx95 vwCYk ">
                                <div class="Igw0E IwRSH eGOV_ _4EzTm " id="f3f482605e056c">
                                    <div class="_7UhW9 xLCgt MMzan KV-D4 fDxYl">
                                        <div class="Igw0E IwRSH eGOV_ ybXk5 _4EzTm ">
                                            <a class="FPmhX notranslate _0imsa " title="${e.username}" href="/${e.username}/">${e.username}</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="Igw0E IwRSH eGOV_ _4EzTm DhRcB " id="ff51fd5b0738c8">
                                    <div class="_7UhW9 xLCgt MMzan _0PwGv fDxYl ">${e.fullName}</div>
                                </div>
                            </div>
                            <div class="Igw0E rBNOH YBx95 ybXk5 _4EzTm soMvl">
                                <button class="sqdOP L3NKy _8A5w5 unfollow-button" type="button" data-userid="${e.userID}">Takiptesin</button>
                            </div>
                        </div>
                    </li>
                    `;
                })

                var popupHtml = `
<div class="RnEpo Yx5HN unfollow-popup" role="presentation">
    <div class="pbNvD fPMEg HYpXt" role="dialog">
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
        <div class="isgrP" style="overflow-x: scroll;border-radius: 12px;display: block;-webkit-box-flex: 1;-webkit-flex: 1 1;-ms-flex: 1 1;flex: 1 1;min-height: 200px; overflow-y: scroll;">
            <ul class="jSC57 _6xe7A">
                <div class="PZuss">
                    ${unfollowPopupContent}
                </div>
            </ul>
        </div>
    </div>
</div>
                `;

                $('body').append(popupHtml);

                $(document).on('click','.wpO6b',function () {
                    $('.unfollow-popup').fadeOut('slow');
                });

                $(document).on('click','.unfollow-button',function () {
                    $(this).text('Bekleyin...');
                    var parent = $(this).parent().parent().parent();
                    var userID = $(this).data('userid');

                    fetch("https://www.instagram.com/web/friendships/"+userID+"/unfollow/", {
                        "headers": {
                            "accept": "*/*",
                            "accept-language": "tr,en;q=0.9",
                            "content-type": "application/x-www-form-urlencoded",
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-origin",
                            "x-csrftoken": shared.config.csrf_token,
                            "x-ig-app-id": "936619743392459",
                            "x-ig-www-claim": "hmac.AR2slL3GRrhnqx8x5yBN9aCh3cZEMLgcKkhtM6hVa_uFHVc8",
                            "x-instagram-ajax": shared.rollout_hash,
                            "x-requested-with": "XMLHttpRequest",
                            "cookie": document.cookie
                        },
                        "referrer": window.location.href+"/followers/",
                        "referrerPolicy": "no-referrer-when-downgrade",
                        "body": null,
                        "method": "POST",
                        "mode": "cors"
                    }).then(function (res) {
                        if(res.status == 200){
                            $(parent).hide();

                            oldFollowing = JSON.parse(localStorage.getItem(globalUserID + '-following'));
                            var newFollowing = [];
                            $.each(oldFollowing,function (i,e) {
                                if(e.userID != userID){
                                    newFollowing.push(e)
                                }
                            })
                            localStorage.setItem(globalUserID + '-following',JSON.stringify(newFollowing));
                        }else{
                            alert('Unfollow Edemiyor. Lütfen biraz bekle')
                        }
                    });

                });



            })

        }
    }, 10);
});

const random_wait_time = (waitTime = 5000) => new Promise((resolve, reject) => {
    setTimeout(() => {
        return resolve();
    }, Math.random() * waitTime);
});

const get_followers = async (userId, userFollowerCount) => {
    let userFollowers = [],
        batchCount = 50,
        actuallyFetched = 50,
        hash = 'c76146de99bb02f6415203be841dd25a',
        url = `https://www.instagram.com/graphql/query/?query_hash=${hash}&variables={"id":"${userId}","include_reel":true,"fetch_mutual":true,"first":"${batchCount}"}`;
    while (userFollowerCount > 0) {
        const followersResponse = await fetch(url)
            .then(res => res.json())
            .then(res => {
                const nodeIds = [];
                for (const node of res.data.user.edge_followed_by.edges) {
                    nodeIds.push({userID:node.node.id,username:node.node.username,profilPic:node.node.profile_pic_url,fullName:node.node.full_name});
                }
                actuallyFetched = nodeIds.length;
                return {
                    edges: nodeIds,
                    endCursor: res.data.user.edge_followed_by.page_info.end_cursor
                };
            }).catch(err => {
                userFollowerCount = -1;
                return {
                    edges: []
                };
            });
        await random_wait_time();
        userFollowers = [...userFollowers, ...followersResponse.edges];
        userFollowerCount -= actuallyFetched;
        url = `https://www.instagram.com/graphql/query/?query_hash=${hash}&variables={"id":"${userId}","include_reel":true,"fetch_mutual":true,"first":${batchCount},"after":"${followersResponse.endCursor}"}`;
    }
    localStorage.setItem(userId + '-followers', JSON.stringify(userFollowers))
    return userFollowers;
};

const get_following = async (userId, userFollowingCount) => {
    let userFollowing = [],
        batchCount = 50,
        actuallyFetched = 50,
        hash = 'd04b0a864b4b54837c0d870b0e77e076',
        url = `https://www.instagram.com/graphql/query/?query_hash=${hash}&variables={"id":"${userId}","include_reel":true,"fetch_mutual":false,"first":"${batchCount}"}`;

    while (userFollowingCount > 0) {
        const followingsResponse = await fetch(url)
            .then(res => res.json())
            .then(res => {
                const nodeIds = [];
                for (const node of res.data.user.edge_follow.edges) {
                    nodeIds.push({userID:node.node.id,username:node.node.username,profilPic:node.node.profile_pic_url,fullName:node.node.full_name});
                }
                actuallyFetched = nodeIds.length;
                return {
                    edges: nodeIds,
                    endCursor: res.data.user.edge_follow.page_info.end_cursor
                };
            }).catch(err => {
                userFollowingCount = -1;
                return {
                    edges: []
                };
            });
        await random_wait_time();
        userFollowing = [...userFollowing, ...followingsResponse.edges];
        userFollowingCount -= actuallyFetched;
        url = `https://www.instagram.com/graphql/query/?query_hash=${hash}&variables={"id":"${userId}","include_reel":true,"fetch_mutual":false,"first":${batchCount},"after":"${followingsResponse.endCursor}"}`;
    }
    localStorage.setItem(userId + '-following', JSON.stringify(userFollowing))
    return userFollowing;
};

function arr_diff(a1, a2) {

    var a = [], diff = [];

    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }

    for (var k in a) {
        diff.push(k);
    }

    return diff;
}

function unfollow_prosess(following,followers) {

    var unfollow = [];
    $.each(following, function (i, wing) {
        //console.log(wing)

        var have = false;

        $.each(followers,function (i,wers) {
            //console.log(wing.username,wers.username)

            if(wing.username == wers.username){
                have = true;
                return false;
            }
        })

        if(have == false){
            unfollow.push(wing)
        }

        console.log(followers.includes(wing))
        //if (!following.includes(wing)) {
        //    unfollow.push(wing)
        //}

    })

    return unfollow;

}

function findSharedData(elm) {
    if (elm.nodeType == Node.ELEMENT_NODE || elm.nodeType == Node.DOCUMENT_NODE) {
        for (var i=0; i < elm.childNodes.length; i++) {
            // recursively call self
            var result = findSharedData(elm.childNodes[i]);
            if (result != null) {
                return result;
            }
        }
    }

    if (elm.nodeType == Node.TEXT_NODE) {
        if (elm.nodeValue.startsWith("window._sharedData = ")) {
            var jsonString = elm.nodeValue.replace("window._sharedData = ", "");
            jsonString = jsonString.slice(0, -1);
            return JSON.parse(jsonString);
        }
        return null;
    }

    return null;
}