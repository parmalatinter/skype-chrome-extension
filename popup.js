chrome.storage.sync.get(["userId", "userPass",  "url"], function (setData) {

    $(".userId").val(setData.userId);
    $(".userPass").val(setData.userPass);
    $(".targetUserName").val(setData.userPass);
    $(".url").val(setData.url);
});

document.addEventListener('DOMContentLoaded', function () {

    var my_form = document.getElementById('my_form');
    my_form.addEventListener('submit', function (e) {
        var data = $('#my_form').serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});

        e.preventDefault();


        $('.setUp').html('<button class="redirect">開始</button>')

        var params = {
            'userId': data.userId,
            'targetUserName': data.targetUserName,
            'userPass': data.userPass,
            'url': data.url,
            "stop": false
        };

        chrome.storage.sync.set(params, function (setData) {
            window.open('https://web.skype.com/ja/');
        });

    });

    var stop = document.getElementById('stop');
    stop.addEventListener('click', function () {
        chrome.tabs.query({active: true}, function (tab) {
            chrome.storage.sync.set({stop: true});
            chrome.tabs.sendMessage(tab[0].id, {key: 'stop', value: false}, function (response) {
                $('.setUp').html('終了しました。');
            });
        });
    });
});
