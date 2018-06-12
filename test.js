const fetch = require('isomorphic-fetch');
const cheerio = require('cheerio');

function doFetch(url = 'https://node-easy-test-server.herokuapp.com/ajax', method = 'post', params = {}) {
    return new Promise((resolve, reject) => {
        if(!url) {
            reject({error : {response:{statusText: 'not set url'}}});
        }
        fetch(url, {
            mode: 'cors',
            method: method,
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With' : 'XMLHttpRequest'
            }
        }).then(response => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json();
            } else {
                return response.text();
            }

        }).then(json => {
            resolve({response : json});
        }).catch(function (e) {
            reject(e);
        });
    });
}

function get_scraping_text($html, selector) {
    let $ = cheerio.load($html);
    return $(selector).text();
}


doFetch( 'https://node-easy-test-server.herokuapp.com/ajax', 'put').then(function (res) {
    // console.log(res.response);
}).catch(function (e) {
    console.log(e);
});

doFetch( 'https://www.google.co.jp/search?source=hp&q=laravel&oq=laravel&', 'get').then(function (res) {
    console.log(get_scraping_text(res.response, 'title'));
}).catch(function (e) {
    console.log(e);
});


