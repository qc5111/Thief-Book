'use strict';
var rp = require('request-promise');


const url = 'http://hq.sinajs.cn/list=';

const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
}

export default {
    getData(code, callback) {
        var codeArr = code.split(",");

        var textAll = "";

        var promiseArr = codeArr.map(function (code) {
            return rp(url + code);
        });

        Promise
            .all(promiseArr)
            .then(function (results) {
                for (let index = 0; index < results.length; index++) {
                    var arr = results[index].toString().split(",")
                    console.log(arr.length);
                    if(arr.length==34){//个股
                        var yesterday_price = parseFloat(arr[2]);
                        var curr_price = parseFloat(arr[3]);
                        var percentage = (curr_price - yesterday_price) / yesterday_price * 100
                        var text = curr_price + "," + percentage.toFixed(2) + "%";
                    }else if(arr.length==6){//指数
                        var curr_price = parseFloat(arr[1]);
                        var percentage = parseFloat(arr[3]);
                        var text = curr_price + "," + percentage + "%";
                    }

                    textAll = textAll + text + "||";
                }
                textAll = textAll.substring(0, textAll.length - 2)
                console.log(textAll);
                callback(textAll)
            })
            .catch(function (e) {
            });
    }
};
