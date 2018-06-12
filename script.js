'use strict';

let isStop = false;
let last_text = '';

function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

function doStop() {
    isStop = true;
    chrome.storage.sync.set({stop: true});
}

async function doFetch(url = 'https://node-easy-test-server.herokuapp.com/ajax', method = 'post', params = {}) {
    return await fetch(url, {
        mode: 'cors',
        method: method,
        body: params
    })
    .then(response => {
        if (!response.ok) {
            throw {error : response};
        }else{
            return {response : response};
        }
    });
}

doFetch().then(function (res) {
   console.log(res);
}).catch(function (e) {
    console.log(e);
});

async function doCheckEnableUntilNotExists(selector, sec) {
    while($(selector).length){
        await sleep(sec);
    }
    return true;
}

async function doCheckEnableUntilTextExists(selector,text, sec) {
    while(!$(selector).length || $(selector).text() !== text){
        await sleep(sec);
    }
    return true;
}

async function doCheckEnableSend(last_text, sec) {
    let res = $('.content > p').last().text();
    let result = false

    while(!result){
        console.log('last_message',res);
        if(res !== last_text){
            result = true;
            return {res : res};
        }else{
            await sleep(sec);
        }
    }
}

async function start(setData) {

    console.log('start');

    await doCheckEnableUntilNotExists("#shellSplashScreen", 10000);

    $(`.topic[title="${ setData.targetUserName }"]`).click();

    await doCheckEnableUntilTextExists('.hoverWrap > span', setData.targetUserName, 1000);

    let res = await doCheckEnableSend(1000);

    if(!last_text){
        console.log('first init')
    }else{
        if(last_text !== res.res){
            console.log('finish');
            last_text = res.res;
            console.log('enable_send ' + res);
        }
    }
    return {result : last_text};
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.key === 'stop') {
        doStop();
    }
    sendResponse(msg);
});

async function loop(setData) {
    while (setData && !isStop) {
        await start(setData).then(function (res) {
            if(!res.result){
                console.log(res);
            }else{
                console.log('OK' , res.result);
            }
            chrome.storage.sync.get([ "stop"], function (setData) {
                isStop = setData.stop;
            });
        });
        await sleep(2000);
    }
}

$(async function () {
    chrome.storage.sync.get([ "stop", "userId", "userPass", "targetUserName"], function (setData) {
        isStop = false;
        loop(setData).then(function (e) {
            if(e){
                console.log(e);
                console.log('Error');
            }else{
                console.log('Last Finish');
            }
        });
    });
});