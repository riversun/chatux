# Overview
'chatux' is a library that allows you to easily create chat windows on your PC or mobile

It is licensed under [MIT](https://opensource.org/licenses/MIT) license.

[![npm version](https://badge.fury.io/js/chatux.svg)](https://badge.fury.io/js/chatux)

###  What is '**chatux**' like?
It is an independent and lightweight chat user interface (chat UI) library for javascript.

- You can create pages for chat agents and chat bots that support both smartphones and PCs.
- For PC, show chat in a window that does not disturb existing content
- For mobile devices like smart phones and tablets, chat UI will be overlaid on existing pages to avoid disturbing existing content

[![guide](https://riversun.github.io/chatux/guide.png)](https://riversun.github.io/chatux/)

# DEMO
https://riversun.github.io/chatux/

<img src="https://riversun.github.io/chatux/chatux_qr.png">

**How to play demo.**

This demo is simple echo chat.
But a few command available.If you write "show buttons", you can see action buttons in chat.
Or you write "show image", you can see image in chat.

Example project is available on this repo.  
https://github.com/riversun/chatux-example

# Quick start

Check this example.

```html

<!DOCTYPE html>
<html lang="en">
<head>
    <title>chatux example</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
</head>
<body style="padding:0px;margin:0px;">
<div style="padding:40px">
    <h1>chatux example</h1>
    <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
</div>
<script src="https://riversun.github.io/chatux/chatux.min.js"></script>
<script>

    const chatux = new ChatUx();

    const opt = {
        api: {
            //URL of chat server
            endpoint: 'https://script.google.com/macros/s/AKfycbwpf8iZfGXkJD6K__oCVQYF35HLBQjYxmKP0Ifrpe_piK4By4rh/exec',
            //HTTP METHOD
            method: 'GET',
            //DATA TYPE
            dataType: 'jsonp'
        },
        window: {
            title: 'My chat',
            infoUrl: 'https://github.com/riversun/chatux'
        }
    };

    //initialize
    chatux.init(opt);
    chatux.start(true);

</script>
</body>
</html>

```

<!-- 
**Show on PC**

[![guide](https://riversun.github.io/chatux/onpc.png)](https://riversun.github.io/chatux/)


**Show on mobile**

[![guide](https://riversun.github.io/chatux/onmobile.png)](https://riversun.github.io/chatux/)

-->

## install and minimal code

### using npm

**install** 

```
npm install chatux --save
```

**code**

```js
import {ChatUx} from 'chatux';

const chatux = new ChatUx();

chatux.init({
    api: {
        endpoint: 'http://localhost:8080/chat',//chat server
        method: 'GET',//HTTP METHOD when requesting chat server
        dataType: 'json'//json or jsonp is available
    }
});

chatux.start();
```

### using with script tag

```
<script src="https://riversun.github.io/chatux/chatux.min.js"></script>
```

**code**

```js
const chatux = new ChatUx();

chatux.init({
    api: {
        endpoint: 'http://localhost:8080/chat',//chat server
        method: 'GET',//HTTP METHOD when requesting chat server
        dataType: 'json'//json or jsonp is available
    }
});

chatux.start();


```

# How it works 
The system of **chatux** is very simple.

Let's look at the execution sequence of **chatux**.

Suppose you have a chat server for **chatux** at http://localhost:8080/chat
Specify server endpoint like this.

```js
chatux.init({
    api: {
        endpoint: 'http://localhost:8080/chat',
        method: 'GET',
        dataType: 'json'
    }
});

```


The following is the sequence.

![image](https://user-images.githubusercontent.com/11747460/54331314-d3735f80-465c-11e9-9a22-5a975809f770.png)

- 1.　**chatux** sends user input text to chat server.  
GET http://localhost:8080/chat?text=hello

- 2.　The server processes user input text and returns a response as JSON.

```json
{
  "output": [
    {
      "type": "text",
      "value": "You say 'hello'"
    }
  ]
}
```
- 3.　According to the response, **chatux** renders the result on the chat screen.  
![image](https://user-images.githubusercontent.com/11747460/54341678-c4e97000-467d-11e9-96e5-090d4ac8ba9c.png)

So, if you create chat server that can do this kind of interaction, you can easily create chatbots etc.

Next, let's see how to render.

# Chat server

Let's create a simple chat server.

* initialize npm project and install express

```shell
npm init
npm install express
```

* Write a simple server that returns json.

```js
const express = require('express');
const app = express();
const port = 8080;

// enabling CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});
app.get('/chat', function (req, res) {
    const userInputText = req.query.text;

    const response = {
        output: []
    };

    const msg = response.output;
    msg.push({
        type: 'text',
        value: `You say ${userInputText}`
    });
    res.json(response);
});

app.listen(port, () => {
    console.log('chat server started on port:' + port);
});


```

* start server 

```shell
npm start
```

* Access directory

http://localhost:8081/chat?text=hello

You will get JSON for chatux as follows.

```json
{"output":[{"type":"text","value":"You say hello"}]}
```


* Access from **ChatUX** on browser

```js
chatux.init({
    api: {
        endpoint: 'http://localhost:8080/chat',
        method: 'GET',
        dataType: 'json'
    }
});
chatux.start(true);//true:automatically open chat

```
 
![image](https://user-images.githubusercontent.com/11747460/54860945-e379f600-4d64-11e9-9f23-1636343f3607.png)

<hr>

# Custom query parameters

There are two approaches to specifying query parameters.

1.Custom query parameters can be set at initialization.

```js
chatux.init({
    api: {
        endpoint: 'http://localhost:8080/chat',
        method: 'GET',
        dataType: 'json',
        params:{
            'param1':'value1',
            'param2':'value2'
        }
    }
});

```

chat ux will send parameters like 'https://example.com/api?param1=value1&param2=value2' 

2.Custom parameters can be set at each request.


```js
chatux.init({
    api: {
        endpoint: 'http://localhost:8080/chat',
        method: 'GET',
        dataType: 'json',
        },
     methods:{
        onPrepareRequest: (httpClient) => {
            //intercept http request before sending and set query parameters
            httpClient.params.param1 = 'value1';
            httpClient.params.param2 = 'value2';
        },
        onFinishRequest: (httpClient) => {
            //delete params after sending
            delete httpClient.params.param1;
            delete httpClient.params.param2;
        }
     }   
});

```

If nothing is set, only the query parameter named 'text' will be set when you tap send button. 

# Custom Http Headers

There are two approaches to set http headers.


1.Custom headeres can be set at initialization.

You can specify http-headers like as follows.

```js
chatux.init({
    api: {
        endpoint: 'http://localhost:8080/chat',
        method: 'GET',
        dataType: 'json',
        headers:{
            'Authorization':'Bearer ABCD123ABCD123ABCD123',
            'X-Additional-Headers':'something_value'
        }
    }
});

```

2.Custom headers can be set at each request.


```js
chatux.init({
    api: {
        endpoint: 'http://localhost:8080/chat',
        method: 'GET',
        dataType: 'json',
        },
     methods:{
        onPrepareRequest: (httpClient) => {
            httpClient.headers={};
            httpClient.headers['Authorization'] = 'Bearer ABCD123ABCD123ABCD123';
            httpClient.headers['X-Additional-Headers'] = 'something_value';
        }
     }   
});

```


 **Note**
 - Http headers cannot be sent when using jsonp.
 - Don't forget 'Access-Control-Allow-Headers' when accessing with cors :)

# How to render a chat UI

Since chatux can render various variations of chat UI, I introduce them below.
I want to show raw JSON and code example for chat server respectively.


### Show text

**SERVER CODE**

```js
app.get('/chat', function (req, res) {
    const response = {output: []};
    const msg = response.output;
    msg.push({
        type: 'text',
        value: 'Hello world'
    });
    res.json(response);
});
```

**JSON**

```json
{
  "output": [
    {
      "type": "text",
      "value": "Hello world!"
    }
  ]
}
```

**RESULT**

![image](https://user-images.githubusercontent.com/11747460/54342102-f44cac80-467e-11e9-89c9-05b01ca64e78.png)

<hr>

### Show image

**SERVER CODE**

```js
app.get('/chat', function (req, res) {
    const response = {output: []};
    const msg = response.output;
    msg.push({
        type: 'image',
        value: 'https://avatars1.githubusercontent.com/u/11747460'
    });
    res.json(response);
});
```

**JSON**

```json
{
  "output": [
    {
      "type": "image",
      "value": "https://avatars1.githubusercontent.com/u/11747460"
    }
  ]
}
```

**RESULT**

![image](https://user-images.githubusercontent.com/11747460/54341630-9ff4fd00-467d-11e9-9355-6236785841fb.png)

<hr>

### Show action buttons

**SERVER CODE**

```js
app.get('/chat', function (req, res) {
    const response = {output: []};
    const msg = response.output;
    const opts = [];
    opts.push({label: 'label1', value: 'value1'});
    opts.push({label: 'label2', value: 'value2'});
    opts.push({label: 'label3', value: 'value3'});
    msg.push({type: "option", options: opts});
    res.json(response);
});
```

**JSON**

```json
{
  "output": [
    {
      "type": "option",
      "options": [
        {
          "label": "label1",
          "value": "value1"
        },
        {
          "label": "label2",
          "value": "value2"
        },
        {
          "label": "label3",
          "value": "value3"
        }
      ]
    }
  ]
}
```

**RESULT**

![image](https://user-images.githubusercontent.com/11747460/54356961-389c7480-46a0-11e9-9d47-2b0b5500f3e7.png)

<hr>

### Show html

**SERVER CODE**

```js
app.get('/chat', function (req, res) {
    const response = {output: []};
    const msg = response.output;
    msg.push({
        type: 'html',
        value: 'Click <a href="https://github.com/riversun" target="_blank" >here</a> to open a page.',
        delayMs: 500
    });
    res.json(response);
});
```

**JSON**

```json
{
  "output": [
    {
      "type": "html",
      "value": "Click <a href=\"https://github.com/riversun\" target=\"_blank\" >here</a> to open a page.",
      "delayMs": 500
    }
  ]
}
```

**RESULT**

![image](https://user-images.githubusercontent.com/11747460/54356215-684a7d00-469e-11e9-82b6-c9d99f6d6610.png)

<hr>

### Show youtube

**SERVER CODE**

```js
app.get('/chat', function (req, res) {
    const response = {output: []};
    const msg = response.output;
    const videoId = 'TP4lxliMHXY'; //youtube video id
    msg.push({
        type: 'youtube',
        value: videoId,
        delayMs: 500 // wait(milliseconds)
    });
    res.json(response);
});
```

**JSON**

```json
{
  "output": [
    {
      "type": "youtube",
      "value": "TP4lxliMHXY",
      "delayMs": 500
    }
  ]
}
```

**RESULT**


![image](https://user-images.githubusercontent.com/11747460/54350146-0e42bb00-4690-11e9-9ced-192e47bea481.png)

<hr>

### Show multiple elements

**SERVER CODE**

```js
app.get('/chat', function (req, res) {
    const response = {output: []};
    const msg = response.output;
    msg.push({
        type: 'text',
        value: 'What is this?',
        delayMs: 500
    });
    msg.push({
        type: 'image',
        value: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Aptenodytes_forsteri_-Snow_Hill_Island%2C_Antarctica_-adults_and_juvenile-8.jpg'
    });
    const opts = [];
    opts.push({label: 'bob', value: 'value1'});
    opts.push({label: 'riversun', value: 'value2'});
    opts.push({label: 'john', value: 'value3'});
    msg.push({type: 'option', options: opts});
    res.json(response);
});
```

**JSON**

```json
{
  "output": [
    {
      "type": "text",
      "value": "What is this?",
      "delayMs": 500
    },
    {
      "type": "image",
      "value": "https://upload.wikimedia.org/wikipedia/commons/a/a3/Aptenodytes_forsteri_-Snow_Hill_Island%2C_Antarctica_-adults_and_juvenile-8.jpg"
    },
    {
      "type": "option",
      "options": [
        {
          "label": "bob",
          "value": "value1"
        },
        {
          "label": "riversun",
          "value": "value2"
        },
        {
          "label": "john",
          "value": "value3"
        }
      ]
    }
  ]
}

```

**RESULT**

![image](https://user-images.githubusercontent.com/11747460/54357551-b0b76a00-46a1-11e9-8f75-cdfd97a42e0d.png)

<hr>

## Open sub window (ex.Url you want to show)

**SERVER CODE**

```js
app.get('/chat', function (req, res) {
    const response = {output: []};
    const msg = response.output;
    msg.push({
        type: 'window',
        title: 'iframe page',
        url: 'https://riversun.github.io/i18nice',
        left: 20,
        top: 20,
        width: 400,
        height: 250,
        addYOffset: true,
        overflow: 'hidden',
        backgroundColor: 'black',
        delayMs: 10
    });
    res.json(response);
});
```

**JSON**

```json
{
  "output": [
    {
      "type": "window",
      "title": "iframe page",
      "url": "https://riversun.github.io/i18nice",
      "left": 20,
      "top": 20,
      "width": 400,
      "height": 250,
      "addYOffset": true
    }
  ]
}
```

**RESULT**

![image](https://user-images.githubusercontent.com/11747460/54411353-6cc07580-4732-11e9-8fbf-27e484acd421.png)

<hr>

## Open sub window (ex.Show youtube video on the window)

**SERVER CODE**

```js
app.get('/chat', function (req, res) {
    const response = {output: []};
    const msg = response.output;
    msg.push({
        type: 'window',
        title: 'youtube movie',
        html: '<div style="position: relative; width: 100%; padding-top: 56.25%;background:black;overflow: hidden">' +
            '<iframe style="position: absolute;top: 0;right: 0;width: 100% !important;height: 100% !important;" width="400" height="300"  src="https://www.youtube.com/embed/nepdFs-2V1Y" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>',
        mobileUrl: 'https://www.youtube.com/embed/nepdFs-2V1Y',
        left: 60,
        top: 60,
        width: 400,
        height: 250,
        addYOffset: true,
        overflow: 'hidden',
        backgroundColor: 'black',
        delayMs: 10 // wait(milliseconds)
    });
    res.json(response);
});
```

**JSON**

```json
{
  "output": [
    {
      "type": "window",
      "title": "youtube movie",
      "html": "<div style=\"position: relative; width: 100%; padding-top: 56.25%;background:black;overflow: hidden\"><iframe style=\"position: absolute;top: 0;right: 0;width: 100% !important;height: 100% !important;\" width=\"400\" height=\"300\"  src=\"https://www.youtube.com/embed/nepdFs-2V1Y\" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe></div>",
      "mobileUrl": "https://www.youtube.com/embed/nepdFs-2V1Y",
      "left": 60,
      "top": 60,
      "width": 400,
      "height": 250,
      "addYOffset": true,
      "overflow": "hidden",
      "backgroundColor": "black",
      "delayMs": 10
    }
  ]
}
```

**RESULT**

![image](https://user-images.githubusercontent.com/11747460/54411528-199af280-4733-11e9-8ef5-eceb4af57e6a.png)

<hr>

## Open sub window (ex.Video on Google Drive)

**SERVER CODE**

```js
app.get('/chat', function (req, res) {
    const response = {output: []};
    const msg = response.output;
    msg.push({
        type: 'window',
        title: 'google drive movie',
        html: '<div style="position: relative; width: 100%; padding-top: 56.25%;background:black;overflow: hidden">' +
            '<iframe  style="position: absolute;top: 0;right: 0;width: 100% !important;height: 100% !important;"  src="https://drive.google.com/file/d/1FfOnq85pQgXtNsZeaF7P_CCsdKzcRrQk/preview" width="400" height="300"></iframe>' +
            '</div>',
        mobileUrl: 'https://drive.google.com/file/d/1FfOnq85pQgXtNsZeaF7P_CCsdKzcRrQk/preview',//open this url when open on mobile
        left: 100,
        top: 100,
        width: 400,
        height: 250,
        addYOffset: true,
        overflow: 'hidden',
        backgroundColor: 'black',
        delayMs: 10 // wait(milliseconds)
    });
    res.json(response);
});
```

**JSON**

```json
{
  "output": [
    {
      "type": "window",
      "title": "google drive movie",
      "html": "<div style=\"position: relative; width: 100%; padding-top: 56.25%;background:black;overflow: hidden\"><iframe  style=\"position: absolute;top: 0;right: 0;width: 100% !important;height: 100% !important;\"  src=\"https://drive.google.com/file/d/something_id/preview\" width=\"400\" height=\"300\"></iframe></div>",
      "mobileUrl": "https://drive.google.com/file/d/something_id/preview",
      "left": 100,
      "top": 100,
      "width": 400,
      "height": 250,
      "addYOffset": true,
      "overflow": "hidden",
      "backgroundColor": "black",
      "delayMs": 10
    }
  ]
}
```

**RESULT**

![image](https://user-images.githubusercontent.com/11747460/54411133-9200b400-4731-11e9-8270-f79d318c3252.png)



# Initialization parameters

The following example shows all **ChatUX** initialization parameters.
You can customize the behavior of ChatUX as you like.

```js

    const chatux = new ChatUx();

    //init parameters
    const opt = {
        renderMode: 'auto',//'auto' or 'pc' or 'mobile'
        buttonOffWhenOpenFrame: false,//true:Turn off wakeup button when the chat window is opened.only for pc mode.
        bot: {
            wakeupText: null,//user input which is automatically send to server on startup
            botPhoto: null,//URL of bot photo image
            humanPhoto: null,//URL of human photo image
            widget: {
                sendLabel: 'SEND',//label for SEND button
                placeHolder: 'Say something'//default caption for input box
            }
        },
        api: {
            endpoint: 'http://localhost:8081/chat',//endpoint of chat server
            method: 'GET',//'GET' or 'POST'
            dataType: 'json',//'json' or 'jsonp'
            errorResponse: {
                output: [
                    //Message displayed when a network error occurs when accessing the chat server
                    {type: 'text', value: 'Sorry, an error occurred'}
                ]
            },
            //set http headers
            headers:{
                'Authorization':'Bearer ABCD123ABCD123ABCD123',
                'X-Additional-Headers':'something_value'
            },
            //set query parameters            
            params:{
                  'param1':'value1',
                  'param2':'value2'
            }
        },
        window: {
            title: 'My chat',//window title

            //infoUrl
            // If this value is set, an 'info' icon will appear at the left of the window's
            // title bar, and  clicking this icon will jump to this URL
            infoUrl: 'https://github.com/riversun/chatux',
            size: {
                width: 350,//window width in px
                height: 500,//window height in px
                minWidth: 300,//window minimum-width in px
                minHeight: 300,//window minimum-height in px
                titleHeight: 50//title bar height in px
            },
            appearance: {
                //border - border style of the window
                border: {
                    shadow: '2px 2px 10px  rgba(0, 0, 0, 0.5)',
                    width: 0,
                    radius: 6
                },
                //titleBar - title style of the window
                titleBar: {
                    fontSize: 14,
                    color: 'white',
                    background: '#4784d4',
                    leftMargin: 40,
                    height: 40,
                    buttonWidth: 36,
                    buttonHeight: 16,
                    buttonColor: 'white',
                    buttons: [
                        //Icon named 'hideButton' to close chat window
                        {
                            fa: 'fas fa-times',//specify font awesome icon
                            name: 'hideButton',
                            visible: true
                        }
                    ],
                    buttonsOnLeft: [
                        //Icon named 'info' to jump to 'infourl' when clicked
                        {
                            fa: 'fas fa-comment-alt',//specify font awesome icon
                            name: 'info',
                            visible: true
                        }
                    ],
                },
            }
        },
        //wakeupButton style
        wakeupButton: {
            right: 20,//right position in pixel
            bottom: 20,//bottom position in pixel
            size: 60,//wakeup button size
            fontSize: 25//wakeup button font size for fontawesome icon
        },
        //Define a callback method to be called when an event occurs
        methods: {
            onChatWindowCreate: (win) => {
                //Called only once when a chat window is created
                console.log('#onChatWindowCreate');
            },
            onChatWindowPause: (win) => {
                //Called when the chat window is closed
                console.log('#onChatWindowPause');
            },
            onChatWindowResume: (win) => {
                //Called when the chat window is back to open
                console.log('#onChatWindowResume');
            },
            onUserInput: (userInputText) => {
                //Called back when the user enters text.
                //In other words, this method can intercept text input.
                // If it returns true, it is treated as consumed and no user-input-text is sent to the server.
                console.log('#onUserInput userInputText=' + userInputText);
                if (userInputText === 'end') {
                    const consumed = true;
                    chatux.dispose();
                    return consumed;
                }
            },
            //For local test, get the user input text but stop accessing the chat server.
            // onServerProcess: (userInputText) => {
            //     const response = {"output": [{"type": "text", "value": 'You said "' + userInputText + '"'}]};
            //     return response;
            // },
            // onPrepareRequest: (httpClient) => {
            //     httpClient.params.mykey1 = 'valOfmykey1';//set original query param
            // },
            // onFinishRequest: (httpClient) => {
            //     delete httpClient.params.mykey1;
            // },            
            onServerResponse: (response) => {
                //A callback that occurs when there is a response from the chat server.
                // You can handle server responses before reflecting them in the chat UI.
                console.log('#onServerResponse response=' + JSON.stringify(response));
                return response;
            }
        }
    };

    //initialize
    chatux.init(opt);

    chatux.start(true);//true:open chat UI automatically
```
