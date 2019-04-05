import AjaxClient from './ajax-client.js';

/**
 * ChatClient
 *
 * MIT License
 *
 * @author Tom Misawa (riversun.org@gmail.com,https://github.com/riversun)
 */
export default class ChatClient {

    constructor(opts) {
        this.endpoint = opts.endpoint;

        this.method = 'GET';
        if (opts.method) {
            this.method = opts.method;
        }

        this.dataType = 'json';
        if (opts.dataType) {
            this.dataType = opts.dataType;
        }

        this.errorResponse = {
            output: [
                {type: 'text', value: 'An error occurred.'}
            ]
        };
        if (opts.errorResponse) {
            this.errorResponse = opts.errorResponse;
        }
    }

    sendMsgToChatServer(userInputText, callbackFunc) {

        const ac = new AjaxClient();
        ac.ajax({
            type: this.method,
            url: this.endpoint,
            dataType: this.dataType,
            data: {
                text: userInputText,
            }
        }).done(response => {
            callbackFunc(response);
        }).fail((err) => {
            const errorResponse = this.errorResponse;
            callbackFunc(errorResponse);
        });
    }
}

