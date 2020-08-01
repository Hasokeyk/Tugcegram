chrome.extension.sendMessage({}, function(response){
    var readyStateCheckInterval = setInterval(function(){
        if(document.readyState==="complete"){
            clearInterval(readyStateCheckInterval);

            var globalUserID = 0;

            var script = document.createElement('script');
            script.src = 'https://code.jquery.com/jquery-3.3.1.min.js';
            script.type = 'text/javascript';
            document.getElementsByTagName('head')[0].appendChild(script);

            var pageType = $('meta[property="og:type"]').attr('content');
            if(pageType=="profile"){

                $('.k9GMp').append(`
                    <li class="Y8-fY unfollow-count">
                        <a class="-nal3 " href="#">
                            <span class="g47SY">0</span> takip etmeyenler
                        </a>
                    </li>
                `);

                var shared = findSharedData(document);
                globalUserID = shared.config.viewer.id;

                //var userFollowerCount = shared.entry_data.ProfilePage[0].graphql.user.edge_followed_by.count;
                //var userFollowingCount = shared.entry_data.ProfilePage[0].graphql.user.edge_follow.count;
                //var getFollowers = JSON.parse(localStorage.getItem('followers')) || get_followers2(globalUserID, userFollowerCount);
                ////var getFollowers = JSON.parse(localStorage.getItem(globalUserID + '-followers')) || get_followers2(globalUserID, userFollowerCount);
                //var getFollowing = JSON.parse(localStorage.getItem(globalUserID+'-following')) || get_following(globalUserID, userFollowingCount);
//
                //var unfollowList = unfollow_prosess(getFollowing, getFollowers)
                //$('.unfollow-count span').text(unfollowList.length);

            }else{
                console.log('Tuğçe')
            }

            $(document).on('click', '.unfollow-count', function(){

                console.log(unfollowList)

                var unfollowPopupContent = ''
                $.each(unfollowList, function(i, e){
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

                $(document).on('click', '.wpO6b', function(){
                    $('.unfollow-popup').fadeOut('slow');
                });

                $(document).on('click', '.unfollow-button', function(){
                    $(this).text('Bekleyin...');
                    var parent = $(this).parent().parent().parent();
                    var userID = $(this).data('userid');

                    fetch("https://www.instagram.com/web/friendships/"+userID+"/unfollow/", {
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
                            $(parent).hide();

                            oldFollowing = JSON.parse(localStorage.getItem(globalUserID+'-following'));
                            var newFollowing = [];
                            $.each(oldFollowing, function(i, e){
                                if(e.userID!=userID){
                                    newFollowing.push(e)
                                }
                            })
                            localStorage.setItem(globalUserID+'-following', JSON.stringify(newFollowing));
                        }else{
                            alert('Unfollow Edemiyor. Lütfen biraz bekle')
                        }
                    });

                });


            })

        }
    }, 10);
});




