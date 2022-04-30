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

## URL Params
Since the page takes control over some keys, this is here to help you.

You can set you channel and the command using Params in page URL
* use ?cha=<Your_channel_name> to set channel
* use ?cmd=<!your_custom_command> to set command

add them in the url after /, like this:
```
https://sudoku.com/evil/?cha=channel&cmd=!sdk
```

## Language support
currently uses the same language as the website (taken from URL)
* en
* pt
* br

portuguese (pt-pt and pt-br) are the same translation, the site forwarded me to one then to other and made it not work once, I duplicated pt and changed to br just to have both.

## LICENSE: [MIT](https://github.com/Matsukii/Twitch-Plays-Sudoku/blob/main/LICENSE)
