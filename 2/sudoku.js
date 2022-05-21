let connected = false;
let client;
let debug = false;

// taken from url, ex.: sudoku.com/pt will set lang to pt
let lang = config.lang;

let command = "!command";
let allowusersCommand = "!s-allow "
let channel = "";
let allowedUsers = [];
const moderators = []

function debugPrint(...args){
    if(config.debug) console.log("TPS - DEBUG : ", ...args);
}







// wait for page to load, then inject scripts and start dion stuff
document.addEventListener('readystatechange', e => {
    if(document.readyState == "complete"){
        console.log("Hello TPS");
        
        
        let selLang = window.location.pathname.split('/')[1];
        if(selLang in langs) {
            lang = selLang;
        }
        else{
            debugPrint(`Language "${selLang}" not available, using English fallback`);
        }
        
        
        if(window.location.hash != ""){
            channel = window.location.hash.slice(1)
        }
        
        
        let pageUrl = new URL(window.location.href);
        let urlCmd = pageUrl.searchParams.get("cmd");
        if(urlCmd){
            if(urlCmd){
                config.commands.guess = urlCmd;
            }
            else{
                config.commands.guess = "!sdk"
            }
            
        }
        let urlchannel = pageUrl.searchParams.get("cha");
        if(urlchannel){
            config.channel = urlchannel;
        }

        
        
        let guesses = {
            "testing": 1,
            "user2": 3
        }



        // ----------- UI elements -----------


        let container = document.createElement("div");
        container.id = "sdk-controls";
        
        
        // channel
        // channel
        // channel
        let channelInputLabelPre = document.createElement("label");
        channelInputLabelPre.innerText = langs[lang]["channelName"];
        let channelInput = document.createElement("input");
        channelInput.id = "sdk-channel-input";
        channelInput.placeholder = langs[lang]["channelName"];
        if(config.channel != ""){
            channelInput.value = config.channel;
        }
        
        
        
        // command
        // command
        // command
        let commandInputLabel = document.createElement("label");
        commandInputLabel.innerText = langs[lang]["command"];
        let commandInput = document.createElement("input");
        commandInput.id = "sdk-command-input";
        commandInput.placeholder = langs[lang]["command"];
        
        if(config.commands.guess != ""){
            commandInput.value = config.commands.guess;
        }

        let inputTimeout;
        // listen for keyboard and change the command in real-time
        commandInput.addEventListener('keypress', e => {
            if(inputTimeout) clearTimeout(inputTimeout);
            inputTimeout = setTimeout(() => {
                if(e.target.value != ""){
                    if(e.target.value.trim() == config.commands.allow.trim()){
                        alert(langs[lang]["errors"]["duplicate-command"])
                    }
                    else{
                        config.commands.guess = e.target.value;
                        debugPrint(`command changed to "${config.commands.guess}"`);
                    }
                }
            }, 500);
        })
       


       
        // allowed users input
        // allowed users input
        // allowed users input
        let allowUsersLabel = document.createElement("label");
        allowUsersLabel.innerText   = langs[lang]["permit"];
        allowUsersLabel.title       = langs[lang]["permitPlaceholder"];

        let allowUsers = document.createElement("textarea");
        allowUsers.id           = "sdk-permit-input";
        allowUsers.title        = langs[lang]["permitPlaceholder"];
        allowUsers.placeholder  = langs[lang]["permitPlaceholder"];
        allowUsers.value        = config.allowedPlayers.toString();


        // listen for keyboard and change the command in real-time
        allowUsers.addEventListener('keypress', e => {
            if(inputTimeout) clearTimeout(inputTimeout);
            inputTimeout = setTimeout(() => {
                if(e.target.value != ""){
                    config.allowedPlayers = e.target.value.trim().toLowerCase().split(",")
                    debugPrint(`users allowed changed to `, config.allowedPlayers);
                }
            }, 500);
        })
        


        // debug checkbox
        // debug checkbox
        // debug checkbox
        let debugInputLabel = document.createElement("label");
        debugInputLabel.innerText   = langs[lang]["debug"];
        debugInputLabel.for         = "sdk-debug-input";

        let debugInput = document.createElement("input");
        debugInput.id       = "sdk-debug-input";
        debugInput.type     = "checkbox";
        debugInput.checked  = config.debug;

        let inputTypeTimeout;
        debugInput.addEventListener('click', e => {
            if(inputTypeTimeout) clearTimeout(inputTypeTimeout);
            inputTypeTimeout = setTimeout(() => {
                if(e.target.value != ""){
                    config.debug = e.target.checked;
                    debugPrint(`debug changed to "${config.debug ? 'enable' : 'disable'}"`);
                }
            }, 500);
        })


        
        // connection status
        // connection status
        // connection status
        let connectionStatus = document.createElement("label");
        connectionStatus.innerText      = langs[lang]["Disconnected"];
        connectionStatus.id             = "sdk-status";
        connectionStatus.setAttribute("state", "Disconnected");
        
        
        // connect btn
        // connect btn
        // connect btn
        let connectBtn = document.createElement('button');
        connectBtn.innerText = langs[lang]["Connect"];
        connectBtn.addEventListener('click', e => {
            connect(channelInput.value);
        })
        
        
        // guesses
        // guesses
        // guesses
        let lastMessageContainer = document.createElement('div');
        lastMessageContainer.id     = "sdk-last-message"

        let lastMessageLabel = document.createElement("label");
        lastMessageLabel.innerText  = langs[lang]["lastMessage"];


        // information
        // information
        // information
        let info = document.createElement("p");
        info.innerHTML = langs[lang].info;
        
        let lastMessageName = document.createElement("b");
        lastMessageName.innerText = "Name";
        let lastMessageContent = document.createElement("span");
        lastMessageContent.innerText = " !sdk 000 000";
        

        lastMessageContainer.appendChild(lastMessageLabel);
        lastMessageContainer.appendChild(document.createElement("br"));
        lastMessageContainer.appendChild(lastMessageName);
        lastMessageContainer.appendChild(lastMessageContent);
        
        
        container.appendChild(channelInputLabelPre);
        container.appendChild(channelInput);
        
        container.appendChild(commandInputLabel);
        container.appendChild(commandInput);
        
        container.appendChild(connectionStatus);
        container.appendChild(connectBtn);
        
        container.appendChild(document.createElement("br"));
        container.appendChild(allowUsersLabel);
        container.appendChild(allowUsers);
        
        container.appendChild(document.createElement("br"));
        container.appendChild(document.createElement("br"));
        container.appendChild(lastMessageContainer);
        container.appendChild(info);
        container.appendChild(debugInputLabel);
        container.appendChild(debugInput);
        
        let scoreboardLabel = document.createElement("label");
        scoreboardLabel.innerText = "Scoreboard";
        scoreboardLabel.id = "scoreboard-label";
        let scoreboardReload = document.createElement("button");
        scoreboardReload.innerText = "reload";
        scoreboardReload.id = "scoreboard-reload";
        scoreboardReload.addEventListener('click', e => {
            updateScoreBoard();
        })

        let scoreboard = document.createElement("ul");
        scoreboard.id = "scoreboard";
        
        
        container.appendChild(document.createElement("br"));
        container.appendChild(document.createElement("br"));
        
        container.appendChild(scoreboardLabel);
        container.appendChild(scoreboardReload);
        container.appendChild(scoreboard);


        document.querySelector(".legend").querySelector(".row").remove()

        document.querySelector('.legend').appendChild(container)
      
        
        
        let letters = document.createElement("ul");
        letters.id = "coord-cols";
        letters.innerHTML = "<li>A</li> <li>B</li> <li>C</li> <li>D</li> <li>E</li> <li>F</li> <li>G</li> <li>H</li> <li>I</li>";

        let numbers = document.createElement("ul");
        numbers.id = "coord-rows";
        numbers.innerHTML = "<li>1</li> <li>2</li> <li>3</li> <li>4</li> <li>5</li> <li>6</li> <li>7</li> <li>8</li> <li>9</li>";

        document.querySelector(".board").appendChild(letters);
        document.querySelector(".board").appendChild(numbers);

      


        function updateScoreBoard(){
            debugPrint("reload scoreboard");
            let scoreItems = scoreboard.querySelectorAll(".item");
            debugPrint(scoreItems);
            if(scoreItems) {
                for (let i = 0; i < scoreItems.length; i++) {
                    scoreItems[i].remove();
                }
            }
            let players = Object.keys(guesses);
            debugPrint(players);
            let biggestNameLength = 0;
            for (let i = 0; i < players.length; i++) {
                if(players[i].length > biggestNameLength){
                    biggestNameLength = players[i].length;
                }
            }

            debugPrint("longest name is ", biggestNameLength)
            for (let i = 0; i < players.length; i++) {
                let item = document.createElement("li");
                item.className = "item";
                // item.style.color = guesses[players[i]].color;
                // item.style.fontWeight = "bold";
                item.innerText = `${players[i].padEnd(biggestNameLength, ".")}: ${guesses[players[i]]}`;

                scoreboard.appendChild(item);
            }
            
        }

   

        let dismissTimeout;
        // connect/disconnect from chat
        function connect(channel=false){

            if(channel == "") {
                // focus on channel input, it can't be blank
                channelInput.focus();
                return
            }

            if(client && connected) {
                client.disconnect();
            }
            else{
                // create a client
                // you can add multiple channels (["channel1", "channel2"]) but
                // it's not like you should...
                client = new tmi.Client({channels:[channel]})
                
        
                // listen for messages
                client.on('message', (channel, tags, message="!sdk 0 0", self) => {
                    debugPrint(`${tags['display-name']}: ${message}`);
                    let badges = tags.badges || {};

                    // for mods and streamer
                    if(badges.broadcaster || badges.moderator || config.moderators.includes(tags['display-name'])){

                        // add/remove allowed users trough command
                        // @example: !s-allow user1,user2,user3 to allow only them
                        // @example: !s-allow * to clear and allow everyone
                        if(message.startsWith(config.commands.allow)){
                            let msg = message.replace(config.commands.allow, "");

                            debugPrint("mod or broadcaster msg: ", msg);
                            
                            // check if is *
                            if(msg == "*"){
                                config.allowedPlayers = [];
                                allowUsers.value = "";
                                debugPrint(`Allowed users changed to everyone by @${tags['display-name']}`);
                            }
                            else{
                                // try to get users
                                try {
                                    config.allowedPlayers = msg.trim().toLowerCase().split(",");
                                    allowUsers.value = config.allowedPlayers.toString();
                                    debugPrint("Allowed users changed to: ", config.allowedPlayers, `by @${tags['display-name']}`);
                                } catch (error) {
                                    alert(`${langs[lang]["errors"]["allowed-parsing"]} \n\n Received: ${msg}`);
                                    debugPrint(`${langs[lang]["errors"]["allowed-parsing"]} \n\n Received: ${msg}`);
                                }
                            }
                        }




                    }

                    // checks if starts with the command
                    if(message.startsWith(config.commands.guess)){
                        debugPrint("is sdk", message);
                        
                        let username = tags['display-name'];

                        // handle allowed users
                        if(config.allowedPlayers.length != 0 && !(config.allowedPlayers.includes(username.toLowerCase()))){
                            debugPrint(`user ${username} is not allowed`);
                            return;
                        }
                        
                        

                        lastMessageContainer.style.backgroundColor = "";

                        // set "Last Message" element text with username and message
                        lastMessageName.innerText       = tags['display-name'] + ": ";
                        lastMessageName.style.color     = tags['color'];
                        lastMessageContent.innerText    = message;


                        // format message in usable way, replacing command with empty string
                        let formattedMsg = message.replace(config.commands.guess, "");

                        // remove trailing spaces and split to get coord and number
                        formattedMsg = formattedMsg.trim().split(" ");
                        debugPrint(formattedMsg);

                        // checks if the second value is a number
                        if(!isNaN(formattedMsg[1])){
                            
                            // get coord and parse number as an integer
                            let position = formattedMsg[0];
                            let value = parseInt(formattedMsg[1]);

                            
                            
                            debugPrint(`Received ${position}(${coordToIndex(position, 9)}) : ${value}`);
                            

                            // check if is in correct format (<col><row> <number> | A1 1)
                            if(/[A-I]{1,1}[1-9]{1,1} [1-9]{1,1}/gi.test(`${position} ${value}`)){
                                
                                // // send to page side for input
                                // document.dispatchEvent(new CustomEvent('setActiveCell', {detail: {
                                //     time: new Date(),
                                //     position: coordToIndex(position, 9),
                                //     value
                                // }}))


                                if(!(username in guesses)) guesses[username] = 0;

                                try {
                                    let cell = document.querySelectorAll(".cell")[coordToIndex(position, 9)];
                                    if(dismissTimeout) clearTimeout(dismissTimeout);
                                    
                                    cell.click();
                                    cell.querySelector("input").value = value;
                                    if(dismissTimeout) clearTimeout(dismissTimeout);
                                    dismissTimeout = setTimeout(() => {
                                        document.querySelector(".board").click();
                                        if(cell.classList.contains("solved")){
                                            guesses[tags['display-name']] = guesses[tags['display-name']] ? guesses[tags['display-name']] + 1 : 1; 
                                        }
                                    }, config.delays.dismiss);
                                    // setTimeout(() => {
                                    // }, 100);
                                    debugPrint(guesses);
                                } catch (error) {
                                    console.log(error);
                                }
                                updateScoreBoard();
                            }
                            else{
                                debugPrint("invalid formation");
                                lastMessageName.innerText = "SYSTEM: ";
                                lastMessageName.style.color = "#f44336";
                                lastMessageContent.innerText = `Hey @${tags['display-name']}, ${langs[lang]["invalidValueErr"]} -> (${message})`;
                                lastMessageContainer.style.backgroundColor = "#f443361a";
                                
                            }
                        }
                        else{
                            debugPrint("invalid number");
                            lastMessageName.innerText = "SYSTEM: ";
                            lastMessageName.style.color = "#f44336";
                            lastMessageContent.innerText = `Hey @${tags['display-name']}, ${langs[lang]["invalidValueErr"]} -> (${message})`;
                            lastMessageContainer.style.backgroundColor = "#f443361a";
                        }
                    }
                    
        
                })
        
        
                client.on('connecting', (address, port) => {
                    debugPrint(`connecting... ${address}:${port}`);
                    connectionStatus.innerText = langs[lang]["Connecting"];
                    connectionStatus.setAttribute("state", "Connecting");
                    connected = false;
                    
                })
                
                client.on('connected', (address, port) => {
                    debugPrint(`connected! ${address}:${port}`);
                    connectionStatus.innerText = langs[lang]["Connected"];
                    connectionStatus.setAttribute("state", "Connected");
                    connectBtn.innerText = langs[lang]["Disconnect"];
                    connectBtn.setAttribute("state", "Connected");
                    connected = true;

                })
                
                client.on('disconnected', (reason) => {
                    console.warn(`disconnected ${reason}`);
                    connectionStatus.innerText = langs[lang]["Disconnected"];
                    connectionStatus.setAttribute("state", "Disconnected");
                    connectBtn.innerText = langs[lang]["Connect"];
                    connectBtn.setAttribute("state", "Disconnected");

                    connected = false;
                })
        
            
                client.connect()
            }
        }








    }
})