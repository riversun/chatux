import ChatClient from './chat-client.js';
import BotUI from 'botui';


/**
 * Chat user interface powered by BotUI ( forked ver. on https://github.com/riversun/botui)
 * MIT License
 * @author Tom Misawa (riversun.org@gmail.com)
 */
export default class ChatUI {

    constructor(opts) {

        this.opts = opts;
        this.isStarted = false;
        this.botui = null;

        this.botInfo = opts.botInfo;

        if (!this.botInfo.widget) {
            this.botInfo.widget = {
                sendLabel: 'SEND',
                placeHolder: 'Please input text.'
            }
        }
    }

    initialize() {

        if (!this.botui) {

            this.botui = new BotUI(this.opts.holderId,
                {vue: this.opts.vue}
            );

            if (this.opts) {

                if (this.opts.api) {
                    this.chatClient = new ChatClient(this.opts.api);
                }
                else {
                    this.chatClient = new ChatClient();
                }

                if (this.botInfo.botPhoto) {
                    this.botui.opt.setBotPhoto(this.botInfo.botPhoto);
                }


                if (this.botInfo.humanPhoto) {
                    this.botui.opt.setHumanPhoto(this.botInfo.humanPhoto);
                }

            }
        }
    }


    startChatbot(wakeupInput) {

        if (this.isStarted) {
            //pass if started
            return;
        }

        this.isStarted = true;

        if (wakeupInput) {
            this.handleUserInput({value: wakeupInput});
        } else {
            this.showInputPrompt();
        }

    }

    showInputPrompt() {
        this.botui.action.text({
            action: {
                button: {
                    //icon:'paper-plane',
                    label: this.botInfo.widget.sendLabel
                },
                placeholder: this.botInfo.widget.placeHolder
            }
        }).then(this.handleUserInput.bind(this));
    }


    /**
     * To handle user input text
     * @param userInput
     */
    handleUserInput(userInput) {

        if (!this.botui) {
            return;
        }


        //A loading icon is displayed before the display of the user input box is finished
        //Just put wait to prevent it.
        const delayMs4LoadingIcon = 500;


        if (this.opts.methods) {
            if (this.opts.methods.onUserInput) {
                const consumed = this.opts.methods.onUserInput(userInput.value);
                if (consumed) {
                    return;
                }
            }
        }


        setTimeout(() => {
            //Show loading icon
            this.botui.message.add(
                {photo: true, loading: true}
            ).then(loadingIconMsgIdx => {


                if (this.opts.methods && this.opts.methods.onServerProcess) {
                    const serverResponse = this.opts.methods.onServerProcess(userInput.value);
                    this.handleChatServerResponse(serverResponse, loadingIconMsgIdx);
                } else {

                    //Finish showing loading icon
                    this.chatClient.sendMsgToChatServer(userInput.value, (serverResponse) => {
                        //Handling response from ChatServer
                        this.handleChatServerResponse(serverResponse, loadingIconMsgIdx);

                    });
                }
            });
        }, delayMs4LoadingIcon);

    }

    /**
     * Handling response from ChatServer
     * @param serverResponse
     * @param loadingIconMsgIdx
     */
    handleChatServerResponse(serverResponse, loadingIconMsgIdx) {

        if (!this.botui) {
            return;
        }

        if (this.opts.methods) {
            if (this.opts.methods.onServerResponse) {
                serverResponse = this.opts.methods.onServerResponse(serverResponse);
            }
        }

        const msgInterval = 500;
        const out = serverResponse.output;

        let isUserInputConsumed = false;
        let delayMs = 0;

        for (let outIdx in out) {

            const message = out[outIdx];

            const resType = message.type;

            delayMs += msgInterval;

            if (message.delayMs) {
                delayMs += message.delayMs;
            }

            if (resType == "text") {

                if (outIdx == 0) {


                    //In the case of the first message,
                    // remove the loading icon and show message
                    this.botui.message.update(loadingIconMsgIdx, {
                        loading: false,
                        photo: true,
                        content: message.value
                    });

                } else {

                    this.botui.message.add({
                        delay: delayMs,
                        photo: true,
                        content: message.value
                    });
                }

            } else if (resType == "image") {

                this.botui.message.add({
                    delay: delayMs,
                    photo: true,
                    content: '![image](' + message.value + ')'
                });


            } else if (resType == "option") {

                const opts = message.options;

                let aboutOption = "";

                if (aboutOption.length > 0) {
                    if (outIdx == 0) {
                        this.botui.message.update(loadingIconMsgIdx, {
                            loading: false,
                            delay: delayMs,
                            photo: true,
                            content: aboutOption
                        });
                    } else {
                        this.botui.message.add({
                            delay: delayMs,
                            photo: true,
                            content: aboutOption
                        });
                    }
                }

                const optActions = new Array();

                for (let optIdx in opts) {

                    const opt = opts[optIdx];
                    const label = opt.label;
                    const text = opt.value;

                    optActions.push({text: label, value: text});
                }

                isUserInputConsumed = true;


                //Show action buttons
                this.botui.action.button({
                    autoHide: true,//true:Automatically hide when pushing the button
                    delay: delayMs,
                    action: optActions
                }).then(
                    //Handling of pushing of action button
                    this.handleUserInput.bind(this)
                );
            }
        }

        //If the user input has not been consumed due to an action button press or the like,
        // display user input box
        if (!isUserInputConsumed) {
            this.showInputPrompt();
        }
    }


}
