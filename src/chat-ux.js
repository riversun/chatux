import {library, dom} from '@fortawesome/fontawesome-svg-core';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import {faCommentAlt} from '@fortawesome/free-solid-svg-icons/faCommentAlt';
import {JSFrame} from 'jsframe';
// Add specific icons from font awesome
library.add(faTimes, faCommentAlt);
dom.watch();


import Vue from 'vue';
import ChatUI from './chat-ui.js';
import ChatFrame from './chat-frame.js';
import {isMobileDevice} from './chat-ux-util.js';

import '../node_modules/botui/build/botui.min.css';
import '../node_modules/botui/build/botui-theme-default.css';
import './botui-theme-riversun.css';
import './app.css';


/**
 * Easy to create Chat UI
 *
 * MIT License
 *
 * @author Tom Misawa (riversun.org@gmail.com,https://github.com/riversun)
 */
export default class ChatUx {

    constructor(opts) {
        if (opts) {
            this.init(opts);
        }

        //flag for opening chat automatically
        this.autoOpen = false;
    }


    init(opts) {

        this.holderEleId = 'my-chat-bot';
        this.ui = null;
        this.chatFrame = null;

        let botInfo = opts.bot;
        if (!botInfo) {
            botInfo = {};
        }

        let paramWin = opts.window;
        if (!paramWin) {
            paramWin = {};
        }

        const paramWakeupButton = opts.wakeupButton;

        let methods = opts.methods;
        if (!methods) {
            methods = {};
        }

        // if (!botInfo.botPhoto) {
        //     botInfo.botPhoto = png_icon_operator;
        // }

        this.ui = new ChatUI({
            holderId: this.holderEleId,
            botInfo: botInfo,
            vue: Vue,
            api: opts.api,
            methods: methods,
            parent: this
        });

        this.chatFrame = new ChatFrame({
            renderMode: opts.renderMode,
            window: paramWin,
            wakeupButton: paramWakeupButton
        });

        this.chatFrame.buttonOffWhenOpenFrame = opts.buttonOffWhenOpenFrame;

        this.chatFrame.onChatFrameCreate = (frame) => {

            this.ui.initialize();

            if (opts.open || this.autoOpen) {
                this.chatFrame.toggleChatButtonState();
            }

            if (methods.onChatWindowCreate) {
                methods.onChatWindowCreate(frame);
            }
        };

        this.chatFrame.onChatFrameResume = (frame) => {

            if (botInfo.wakeupText) {
                this.ui.startChatbot(botInfo.wakeupText);
            } else {
                this.ui.startChatbot();
            }

            if (methods.onChatWindowResume) {
                methods.onChatWindowResume(frame);
            }
        };

        this.chatFrame.onChatFramePause = (frame) => {
            if (methods.onChatWindowPause) {
                methods.onChatWindowPause(frame);
            }
        };
    }

    getRenderMode() {
        return this.chatFrame.renderMode;
    }

    createWindowFromServerMessage(message) {

        //get jsFrame instance
        const jsFrameForChatWindow = this.chatFrame.jsFrame;

        if (!this.jsFrame) {
            this.jsFrame = new JSFrame({
                horizontalAlign: 'left',
                verticalAlign: 'top',
                fixed: false
            });
        }

        //override jsframe mouse intercepter for supporting multiple jsframe
        document.onmouseup = (e) => {
            jsFrameForChatWindow.windowManager.windowMouseUp(e);
            this.jsFrame.windowManager.windowMouseUp(e);
        };

        document.onmousemove = (e) => {
            jsFrameForChatWindow.windowManager.windowMouseMove(e);
            this.jsFrame.windowManager.windowMouseMove(e);
        };

        //get chat window instance
        const chatWin = this.chatFrame.frame;
        const chatWinStyle = this.chatFrame.appearanceParam;
        chatWinStyle.titleBar.leftMargin = '10px';
        chatWinStyle.titleBar.buttonsOnLeft[0].visible = false;
        const chatWinPos = chatWin.getPosition();

        //prepare detailed window
        const browserWidth = window.innerWidth;
        const dtWinWidth = message.width ? message.width : 400;
        const dtWinHeight = message.height ? message.height : 400;
        const dtWinLeft = message.left ? message.left : 32;
        const dtWinYOffset = message.addYOffset;
        const dtWinTop = message.top ? message.top + (dtWinYOffset ? parseInt(window.pageYOffset) : 0) : 32 + (dtWinYOffset ? parseInt(window.pageYOffset) : 0);
        const dtWinBackgroundColor = message.backgroundColor ? message.backgroundColor : 'rgba(255,255,255,1.0)';
        const dtWinOverflow = message.overflow ? message.overflow : 'auto';

        const detailWin = this.jsFrame.create({
            name: 'new',
            title: message.title ? message.title : '',
            left: dtWinLeft,
            top: dtWinTop,
            width: dtWinWidth,
            height: dtWinHeight,
            minWidth: 100,
            minHeight: 100,
            appearanceName: 'material',
            appearanceParam: chatWinStyle,
            style: {
                backgroundColor: dtWinBackgroundColor,
                overflow: dtWinOverflow
            },
            url: message.url,
            html: message.html
        });

        //set cross mark click handler
        detailWin.on('hideButton', 'click', (_frame, evt) => {
            detailWin.closeFrame();
        });

        detailWin.show();

    }

    start(openFlag) {

        if (openFlag) {
            this.autoOpen = openFlag;
        }
        
        this.chatFrame.build(this.holderEleId);

    }

    dispose() {
        this.chatFrame.clear();
    }

    isMobileDevice() {
        return isMobileDevice();
    }

}




