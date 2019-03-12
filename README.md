# Overview
'chat-kit' is a library that allows you to easily create chat windows on your PC or mobile

It is licensed under [MIT](https://opensource.org/licenses/MIT) license.

###  What is '**chat-kit**' like?
It is an independent and lightweight chat user interface (chat UI) library for javascript.

- You can create pages for chat agents and chat bots that support both smartphones and PCs.
- For PC, show chat in a window that does not disturb existing content
- For mobile dvices like smartphones and tablets, chat UI will be overlaid on existing pages to avoid disturbing existing content

# DEMO
https://riversun.github.io/chatkit/

# How to use

```html

<!DOCTYPE html>
<html lang="en">
<head>
    <title>chat-kit example</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
</head>
<body style="padding:0px;margin:0px;">
<div style="padding:40px">
    <h1>chat-kit example</h1>
    <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

</div>
<script src="chat-kit.min.js"></script>
<script>

    const chatkit = new ChatKit();

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
            infoUrl: 'https://github.com/riversun/chat-kit'
        }
    };

    //initialize
    chatkit.init(opt);
    chatkit.start(true);


</script>


</body>
</html>

```


## install
### using npm

```
npm install chat-kit --save
```

### using with script tag

```
<script src="https://riversun.github.io/chatkit/chat-kit.min.js"></script>
```
