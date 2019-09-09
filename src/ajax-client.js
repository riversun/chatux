/**
 * AjaxClient
 *
 * MIT License
 *
 * @author Tom Misawa (riversun.org@gmail.com,https://github.com/riversun)
 */
export default class AjaxClient {

    constructor() {
    }

    ajax(options) {

        const url = this._createUrl(options);
        const method = options.type;
        const dataType = options.dataType;
        const data = options.data;
        const headers = options.headers;

        let postBody = null;

        if (method === 'POST') {

            postBody = JSON.stringify(data);

            if (dataType === 'jsonp') {
                //POST and jsonp specified
                throw new Error(`type:'POST' and 'dataType:jsonp' are specified together.
                'POST' and 'jsonp' can not be specified together`);
            }
        }

        if (headers && dataType === 'jsonp') {
            //http-headers and jsonp specified
            throw new Error(`'headers' and 'dataType:jsonp' can not be specified together.
           Http headers cannot be sent when using jsonp.`);
        }

        const reqParam = {
            url: url,
            method: method,
            body: postBody,
        };

        if (headers) {
            reqParam.headers = headers;
        }

        if (dataType === 'json') {
            return this._handleJson(reqParam);
        } else if (dataType === 'jsonp') {
            return this._handleJsonp(reqParam);
        } else {
            throw new Error(`dataType must be 'json' or 'jsonp'`);
        }
    }

    _handleJson(reqParam) {
        const asyncResult = new AjaxResult();
        const fetchParam = {
            method: reqParam.method,
            mode: 'cors',
            cache: 'no-cache',
            //credentials:null,// 'include',
            //referrer: 'no-referrer',
        };

        //populate credentials
        if (reqParam.credentials) {
            fetchParam.credentials = reqParam.credentials;
        }

        //populate headers
        if (reqParam.headers) {
            fetchParam.headers = reqParam.headers;
        } else {
            fetchParam.headers = {
                'Content-Type': 'application/json; charset=utf-8',
            };
        }

        //populate body
        if (reqParam.body) {
            fetchParam.body = reqParam.body;
        }

        //execute fetch
        fetch(reqParam.url, fetchParam)
            .then(response => {
                if (!response.ok) {
                    const errorObj = response.statusText;
                    asyncResult._fail(errorObj);
                    return;
                }
                return response.json();
            })
            .then(json => {
                asyncResult._success(json);
            })
            .catch(err => {
                const errorObj = err;
                asyncResult._fail(errorObj);
            });
        return asyncResult;

    }

    _handleJsonp(reqParam) {
        const asyncResult = new AjaxResult();
        const scriptEle = document.createElement('script');
        const callbackFuncName = `chatux_${this._createUUID()}`;

        scriptEle.src = `${reqParam.url}&callback=${callbackFuncName}`;
        scriptEle.addEventListener('error', (errorObj) => {
            asyncResult._fail(errorObj);
        });

        //global object
        window[callbackFuncName] = function (res) {
            delete window[callbackFuncName];
            asyncResult._success(res);
        };

        const parentEle = document.getElementsByTagName('head') ? document.getElementsByTagName('head')[0] : document.body;

        parentEle.appendChild(scriptEle);

        return asyncResult;

    }

    _createUrl(options) {

        if (options.type === 'POST') {
            //POST
            return options.url;
        } else {
            //GET
            let url = options.url;
            if (options.data) {
                url = url + '?';
                for (let paramKey of Object.keys(options.data)) {
                    const paramVal = options.data[paramKey];
                    url += `${paramKey}=${paramVal}&`;
                }
                url = url.substring(0, url.length - 1);
            }
            return url;
        }
    }

    _createUUID() {
        const dateTime = new Date().getTime();
        const uuid = 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (dateTime + Math.random() * 16) % 16 | 0;
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }
}

class AjaxResult {

    constructor() {
        this._successFunc = () => {
        };
        this._failFunc = () => {
        };
    }

    done(callbackFunc) {
        this._successFunc = callbackFunc;
        return this;
    }

    fail(callbackFunc) {
        this._failFunc = callbackFunc;
        return this;
    }

    _success(response) {
        if (this._successFunc) {
            this._successFunc(response);
        }
    }

    _fail(response) {
        if (this._failFunc) {
            this._failFunc(response);
        }
    }
}
