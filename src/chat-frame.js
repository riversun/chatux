import {JSFrame} from 'jsframe';
import {isMobileDevice} from './chat-ux-util.js';

/**
 * To show chatWindow/chatArea and start/end button for chat interface
 *
 * MIT License
 *
 * @author Tom Misawa (riversun.org@gmail.com,https://github.com/riversun)
 */
export default class ChatFrame {

    constructor(opts) {

        this.ICON_CROSSMARK = '<i class="fas fa-times"></i>';
        this.ICON_COMMENT = '<i class="fas fa-comment-alt"></i>';


        //Setup initial parameters[begin]
        if (!opts) {
            opts = {};
        }

        this.renderMode = this.isMobileDevice() ? 'mobile' : 'pc';

        if (opts.renderMode) {
            if (opts.renderMode === 'auto') {
                //set render mode as-is.
            } else {
                //force setting specified mode
                this.renderMode = opts.renderMode;
            }
        }

        this.windowParam = {};

        if (opts.window) {
            this.windowParam = opts.window;
        }


        //Setup initial parameters[end]
        this.jsFrame = new JSFrame({
            horizontalAlign: 'right',
            verticalAlign: 'bottom',
        });


        this.frameParam = {
            right: 20,
            bottom: 20,
            size: 60,
            fontSize: 25,
        };


        if (opts.wakeupButton) {
            this.frameParam = opts.wakeupButton;
        }


        this.windowSizeParam = {
            width: 360,
            height: 600,
            minHeight: 300,
            minWidth: 200,
            titleHeight: 40,
        };

        if (this.windowParam.size) {
            this.windowSizeParam = this.windowParam.size;
        }

        this.appearanceParam = {
            border: {
                shadow: '2px 2px 10px  rgba(0, 0, 0, 0.5)',
                width: 0,
                radius: 6,
            },
            titleBar: {
                color: 'white',
                background: '#4784d4',
                leftMargin: (this.windowParam.infoUrl) ? 40 : 10,
                height: this.windowSizeParam.titleHeight,
                fontSize: 14,
                buttonWidth: 36,
                buttonHeight: 16,
                buttonColor: 'white',
                buttons: [
                    {
                        fa: 'fas fa-times',
                        name: 'hideButton',
                        visible: true
                    },
                ],
                buttonsOnLeft: [
                    {
                        fa: 'fas fa-comment-alt',
                        name: 'info',
                        visible: (this.windowParam.infoUrl) ? true : false
                    },
                ],
            },
        };

        if (this.windowParam.appearance) {
            this.appearanceParam = this.windowParam.appearance;
        }


        this.FRAME_NAME = 'chat_window';
        this.BUTTON_STATE_OPEN = 'open_chat_window';
        this.BUTTON_STATE_TRANSITION = 'transition';
        this.BUTTON_STATE_CLOSE = 'close_chat_window';
        this.BUTTON_ID = 'chat_wakeup';

        //If true, chat button will disappear when opening the chat window
        //If false,chat button will be shown as a toggle button(OPEN/CLOSE)
        this.buttonOffWhenOpenFrame = false;
        this.buttonState = null;

        this.buttonVanishPoint = {};

        this.frame = null;
        this.showChatBtn = null;
        this.chatAreaEle = null;


        //Empty implementation for default
        this.onChatFrameCreate = () => {
        };

        this.onChatFramePause = () => {
        };

        this.onChatFrameResume = () => {
        };

        this.holderId = '';

    }

    /**
     * Build chat start button
     */
    buildChatButton() {

        const p = this.frameParam;
        const btnRight = p.right;
        const btnBottom = p.bottom;
        const btnSize = p.size;
        const btnFontSize = p.fontSize;

        const showChatBtn = document.createElement('div');
        this.showChatBtn = showChatBtn;
        showChatBtn.id = this.BUTTON_ID;

        if (this.renderMode === 'mobile') {
            showChatBtn.className = 'chatux-btn-chat';
        } else {
            showChatBtn.className = 'chatux-btn-chat chatux-btn-chat-pc';
        }

        showChatBtn.onclick = this.toggleChatButtonState.bind(this);


        const style = showChatBtn.style;
        style.right = btnRight + 'px';
        style.bottom = btnBottom + 'px';
        style.width = btnSize + 'px';
        style.height = style.width;
        style.lineHeight = style.width;
        style.fontSize = btnFontSize + 'px';

        document.body.appendChild(showChatBtn);

        //first call for chat button initialization
        this.toggleChatButtonState();
    }


    /**
     * Toggle chat button state
     */
    toggleChatButtonState() {

        const showChatBtn = document.querySelector(`#${this.BUTTON_ID}`);

        if (!this.buttonState) {

            //- buttonState not already set
            showChatBtn.innerHTML = this.ICON_COMMENT;
            this.buttonState = this.BUTTON_STATE_OPEN;

        } else if (this.buttonState === this.BUTTON_STATE_OPEN) {
            // - current buttonState is OPEN

            //- Set this state so that trouble does not occur even if the user hits buttons repeatedly
            this.buttonState = this.BUTTON_STATE_TRANSITION;

            this.show(() => {

                if (this.buttonOffWhenOpenFrame && this.renderMode === 'pc') {
                    this.setChatButtonVisible(false);
                } else {
                    showChatBtn.innerHTML = this.ICON_CROSSMARK;
                }

                this.buttonState = this.BUTTON_STATE_CLOSE;
            });

        } else if (this.buttonState === this.BUTTON_STATE_TRANSITION) {
            //- Maybe chat button is pressed during the transition
            //Do nothing

        } else {

            this.buttonState = this.BUTTON_STATE_TRANSITION;

            this.hide(() => {

                if (this.buttonOffWhenOpenFrame && this.renderMode === 'pc') {
                    this.setChatButtonVisible(true);
                } else {
                    showChatBtn.innerHTML = this.ICON_COMMENT;
                }
                this.buttonState = this.BUTTON_STATE_OPEN;
            });


        }
    }

    /**
     * Show Chat UI
     * @param callback
     */
    show(callback) {

        if (this.renderMode === 'mobile') {

            // on mobile device
            if (this.chatAreaEle) {
                this.chatAreaEle.classList.replace('chatux-scrn-off', 'chatux-scrn-on');
            }

            if (callback) {
                callback();
            }

            this.onChatFrameResume();

        } else {
            //on PC
            const frame = this.jsFrame.getWindowByName(this.FRAME_NAME);

            //Open minimized window
            frame.control.doDehide({

                callback: (_frame, info) => {

                    if (callback) {
                        callback();
                    }

                    this.onChatFrameResume(_frame);
                }
            });
        }
    }

    /**
     * Hide Chat-UI
     * @param callback
     */
    hide(callback) {

        if (this.renderMode === 'mobile') {

            // on mobile device
            if (this.chatAreaEle) {
                this.chatAreaEle.classList.replace('chatux-scrn-on', 'chatux-scrn-off');
            }

            if (callback) {
                callback();
            }

            this.onChatFramePause();

        } else {

            //on PC
            const frame = this.jsFrame.getWindowByName(this.FRAME_NAME);

            //Open minimized window

            frame.control.doHide({
                offset: this.buttonVanishPoint,
                align: 'ABSOLUTE',
                callback: (_frame, info) => {
                    if (callback) {
                        callback();
                    }

                    this.onChatFramePause(_frame);
                }
            });
        }

    }

    /**
     * Makes chat button visible or invisible.
     * @param isVisible
     */
    setChatButtonVisible(isVisible) {
        const chatButton = document.querySelector(`#${this.BUTTON_ID}`);
        if (isVisible) {
            chatButton.classList.add('chatux-btn-on');
        } else {
            chatButton.classList.remove('chatux-btn-on');

        }
    }

    /**
     * Build chat area for mobile devices
     */
    buildChatArea() {

        this.chatAreaEle = document.createElement('div');
        document.body.appendChild(this.chatAreaEle);
        this.initializeChatArea();
    }

    initializeChatArea() {
        this.chatAreaEle.style.position = 'fixed';
        this.chatAreaEle.style.left = '0px';
        this.chatAreaEle.style.top = '0px';
        this.chatAreaEle.style.bottom = '0px';
        this.chatAreaEle.style.right = '0px';
        this.chatAreaEle.style.backgroundColor = 'transparent';
        this.chatAreaEle.style.display = 'flex';
        this.chatAreaEle.classList.add('chatux-scrn-off');
        this.chatAreaEle.innerHTML = this.getBotUiInnterHtml();
    }

    /**
     * Returns innterHTML for BotUI
     * @returns {string}
     */
    getBotUiInnterHtml() {
        return `<div class="botui-app-container" id="${this.holderId}"><bot-ui></bot-ui></div>`;
    }

    /**
     *  Build chat window for PC
     */
    buildChatWindow() {

        const param = this.frameParam;
        const size = this.windowSizeParam;
        const frmWidth = size.width;
        const frmHeight = size.height;
        const frmHeightMin = size.minHeight;
        const frmWidthMin = size.minWidth;
        const frmTitleHeight = size.titleHeight;
        const frmLeft = -(param.right + frmWidth);
        const frmTop = -(param.bottom + param.size + frmHeight);

        /**
         * Coordinate(left,top) where the window is minimzied
         * @type {{x: number, y: number}}
         */
        this.buttonVanishPoint = {
            x: frmLeft + frmWidth,
            y: frmTop + frmHeight - frmTitleHeight
        };

        //Create chat window
        this.frame = this.jsFrame.create({
            name: this.FRAME_NAME,
            title: this.windowParam.title,
            left: frmLeft,
            top: frmTop,
            width: frmWidth,
            height: frmHeight,
            minWidth: frmWidthMin,
            minHeight: frmHeightMin,
            appearanceName: 'material',
            appearanceParam: this.appearanceParam,
            style: {
                backgroundColor: 'rgba(255,255,255,1.0)',
                overflow: 'auto'
            },
            html: '',// 'Chat UI Here'
            //url: // Chat URL here
        });

        //Enable helper to act on window's common operations(maximization/minimization and something)
        this.frame.setControl({
            animation: true,
            animationDuration: 200,
        });

        //Set click event when the close button is clicked
        this.frame.on('hideButton', 'click', (_frame, evt) => {
            this.toggleChatButtonState();
        });

        this.frame.on('info', 'click', (_frame, evt) => {

            if (this.windowParam.infoUrl) {
                window.open(this.windowParam.infoUrl, '_blank');
            }

        });

        //Minimize the window first to memory the  initial window position and size.
        this.frame.control.doHide({
            silent: true,//means invisible action
            duration: 0,
            align: 'ABSOLUTE',//need to set the offset point where window is minimized
            offset: this.buttonVanishPoint,
            callback: (_frame, info) => {
                this.onChatFrameCreate(_frame);
            }
        });
    }


    /**
     * Build Chat UI and related components like wakeup button
     * @param holderEleId
     */
    build(holderEleId, isAutoOpen) {

        this.holderId = holderEleId;

        if (this.renderMode === 'mobile') {
            // on mobile device
            this.buildChatArea();
            this.buildChatButton();
            this.onChatFrameCreate();

        } else {
            //on PC
            this.buildChatWindow();
            this.frame.setHTML(this.getBotUiInnterHtml());
            this.buildChatButton();

        }
        this.setChatButtonVisible(true);
    }

    clear() {

        if (document.body.contains(this.chatAreaEle)) {
            document.body.removeChild(this.chatAreaEle);
        }

        if (document.body.contains(this.showChatBtn)) {
            document.body.removeChild(this.showChatBtn);
        }

        if (this.frame) {
            //close the window
            this.frame.closeFrame();
        }
    }


    /**
     * Returns true when app is running on mobile devices
     * @returns {boolean}
     */
    isMobileDevice() {
        return isMobileDevice();
    }

}
