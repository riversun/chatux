# Overview
'chatux' is a library that allows you to easily create chat windows on your PC or mobile

It is licensed under [MIT](https://opensource.org/licenses/MIT) license.

###  What is '**chatux**' like?
It is an independent and lightweight chat user interface (chat UI) library for javascript.

- You can create pages for chat agents and chat bots that support both smartphones and PCs.
- For PC, show chat in a window that does not disturb existing content
- For mobile dvices like smartphones and tablets, chat UI will be overlaid on existing pages to avoid disturbing existing content

[![guide](https://riversun.github.io/chatux/guide.png)](https://riversun.github.io/chatux/)

# DEMO
https://riversun.github.io/chatux/

<img src="https://riversun.github.io/chatux/chatux_qr.png">

**How to play demo.**

This demo is simple echo chat.
But a few command available.If you write "show buttons", you can see action buttons in chat.
Or you write "show image", you can see image in chat.

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

**Show on PC**

[![guide](https://riversun.github.io/chatux/onpc.png)](https://riversun.github.io/chatux/)


**Show on mobile**

[![guide](https://riversun.github.io/chatux/onmobile.png)](https://riversun.github.io/chatux/)


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

So, if you create chat server that can do this kind of interaction, you can easily create chatbots etc.

Next, let's see how to render.

## How to render a chat UI

Rendering is indicated by simple JSON.

### show text


