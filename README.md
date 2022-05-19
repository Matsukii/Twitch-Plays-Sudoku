# Twitch-Plays-Sudoku
An extension to connect sudoku.com with twitch chat

found any problem? open an issue [here](https://github.com/Matsukii/Twitch-Plays-Sudoku/issues/new)!

## Install
1. Download or clone the repository, or download from releases
2. Open extension settings on your browser
3. toggle "developer mode" ON
4. click on "load unpacked"
5. use it!

## Using
* Go to https://sudoku.com and set you channel name and click on connect
  * IMPORTANT: sudoku.com takes control over backspace and delete keys, insert you channel name correctly or use URL params (see below)
* Send a message with the command you have set, ex.: !sdk A1 1 to place number 1 in the first column of the first row
* Have fun!

## Commands

* !s-allow
    * Allow only a group of users to play 
    * example: !s-allow user1,user2,user3
    * _randomize option comming soon!_

## URL Params
Since the page takes control over some keys, this is here to help you.

You can set you channel and the command using Params in page URL
* use ?cha=<Your_channel_name> to set channel
* use ?cmd=<!your_custom_command> to set command

add them in the url after /, like this:
```
https://sudoku.com/evil/?cha=channel&cmd=!sdk
```

## Hot-it-works
* Using [tmi.js](https://github.com/tmijs/tmi.js) by @tmijs, the extension connects to Twitch's IRC chat
* When a message is received, we check if has the command is the first word of the message
* if is the first content, we try to get coordinates and the number
* coordinates gote'm, now what? parse it! convert letter+number to a index from 0-80, as the website is a linear 'line' that builds rows and columns
* and we check if the number is a number, just to make sure is a number...
* now we send to the website by emiting a custom event (like saying, "hey page, take this informaton and do something with it"), thats because extensions can't access variables from the website
* the website keeps listening for this event, when is detected, we call a function that sets the highlighted position
* then, we generate an keyboard event, saying to the page that a numver was presses in the keyboard
* thats all folks! 

## Language support
currently uses the same language as the website (taken from URL)
* en
* pt
* br

portuguese (pt-pt and pt-br) are the same translation, the site forwarded me to one then to other and made it not work once, I duplicated pt and changed to br just to have both.

## LICENSE: [MIT](https://github.com/Matsukii/Twitch-Plays-Sudoku/blob/main/LICENSE)
