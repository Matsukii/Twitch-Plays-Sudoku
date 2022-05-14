let connected = false;
let client;
let debug = false;

// taken from url, ex.: sudoku.com/pt will set lang to pt
let lang = "en";

// set command and channel then you don't need to change in page or URL 
let command = "!command";
let channel = "";

function debugPrint(...args){
    if(debug) console.log("TPS - DEBUG : ", ...args);
}

// Translations
let langs = {
    en: {
        Connect: "Connect",
        Connected: "Connected",
        Connecting: "Connecting",
        Disconnect: "Disconnect",
        Disconnected: "Disconnected",
        lastMessage: "Last Guess",
        channelName: "Channel name",
        command: "!command",
        invalidValueErr: "your input coordinates or value is invalid!",
        debug: "debug",

        info: `
            <br>
            Twitch Plays Sudoku Enabled!
            <br>
            <br>
            Send "!sdk {coordinates} {number}" to make a guess!
            <br>
            <br>
            
            Example:
            <br>
            Send !sdk B2 1 to put number 1 in position B2
        `
    },
    pt: {
        Connect: "Conectar",
        Connected: "Conectado",
        Connecting: "Conectando",
        Disconnect: "Desconectar",
        Disconnected: "Desconectado",
        lastMessage: "Ultima tentativa",
        channelName: "Nome do Canal",
        command: "!comando",
        invalidValueErr: "seu numero ou coordenadas são invalidos!",
        debug: "depuração",

        info: `
            <br>
            Twitch Plays Sudoku Habilitado!
            <br>
            <br>
            Envie "${command} {coordenadas} {numero}" no chat para jogar!
            <br>
            <br>
            
            Exemplo:
            <br>
            Envie ${command} B2 1 para colocar o numero 1 na posição B2
        `
    },
    br: {
        Connect: "Conectar",
        Connected: "Conectado",
        Connecting: "Conectando",
        Disconnect: "Desconectar",
        Disconnected: "Desconectado",
        lastMessage: "Ultima tentativa",
        channelName: "Nome do Canal",
        command: "!comando",
        invalidValueErr: "seu numero ou coordenadas são invalidos!",
        debug: "depuração",

        info: `
            <br>
            Twitch Plays Sudoku Habilitado!
            <br>
            <br>
            Envie "${command} {coordenadas} {numero}" no chat para jogar!
            <br>
            <br>
            
            Exemplo:
            <br>
            Envie ${command} B2 1 para colocar o numero 1 na posição B2
        `
    },
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
            command = urlCmd;
        }
        let urlchannel = pageUrl.searchParams.get("cha");
        if(urlchannel){
            channel = urlchannel;
        }
        
        
        
        // https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events
        // https://stackoverflow.com/questions/596481/is-it-possible-to-simulate-key-press-events-programmatically
        
        // script that actually selects the cell and enter the number
        // see it with syntax highlight on "injectedWorker.js"
        let scr = document.createElement("script");
        scr.innerHTML = `
            function inject(){
                console.log("injecting");

                let sdkKeys = [0, 49, 50, 51, 52, 53, 54, 55, 56, 57]
                document.addEventListener('setActiveCell', e => {
                    console.log(e.detail.position, ":", e.detail.value);
                    gameScene.setActiveCell(e.detail.position)
                    setTimeout(() => {
                        
                        document.dispatchEvent(new KeyboardEvent('keydown', {keyCode: sdkKeys[e.detail.value]}))

                    
                    }, 200);

                })
            }
            inject()
            console.log("page side injected");

        `;
        // insert the script on head
        document.head.appendChild(scr);

        
        // for extension-side testing
        // let e = new CustomEvent('setActiveCell', {detail: {
        //     time: new Date(),
        //     position: parseInt(Math.random() * 80),
        //     value: parseInt(Math.random() * 5)
        // }})

        // document.dispatchEvent(e);


        // ----------- UI elements -----------
        let container = document.createElement("div");
        container.id = "sdk-controls";


        let channelInputLabelPre = document.createElement("label");
        channelInputLabelPre.innerText = langs[lang]["channelName"];
        let channelInput = document.createElement("input");
        channelInput.id = "sdk-channel-input";
        channelInput.placeholder = langs[lang]["channelName"];
        if(channel != ""){
            channelInput.value = channel;
        }



        
        let commandInputLabel = document.createElement("label");
        commandInputLabel.innerText = langs[lang]["command"];
        let commandInput = document.createElement("input");
        commandInput.id = "sdk-command-input";
        commandInput.value = command;
        commandInput.placeholder = langs[lang]["command"];

        let inputTimeout;
        // listen for keyboard and change the command in real-time
        commandInput.addEventListener('keypress', e => {
            if(inputTimeout) clearTimeout(inputTimeout);
            inputTimeout = setTimeout(() => {
                if(e.target.value != ""){
                    command = e.target.value;
                    debugPrint(`command changed to "${command}"`);
                }
            }, 500);
        })
        


        let debugInputLabel = document.createElement("label");
        debugInputLabel.innerText = langs[lang]["debug"];
        debugInputLabel.for = "sdk-debug-input";
        let debugInput = document.createElement("input");
        debugInput.id = "sdk-debug-input";
        debugInput.type = "checkbox";
        debugInput.checked = debug;
        debugInput.value = command;
        debugInput.placeholder = langs[lang]["debug"];

        let inputTypeTimeout;
        debugInput.addEventListener('click', e => {
            if(inputTypeTimeout) clearTimeout(inputTypeTimeout);
            inputTypeTimeout = setTimeout(() => {
                if(e.target.value != ""){
                    debug = e.target.checked;
                    debugPrint(`debug changed to "${command}"`);
                }
            }, 500);
        })


        
        let channelInputLabel = document.createElement("label");
        channelInputLabel.innerText = langs[lang]["Disconnected"];
        channelInputLabel.id = "sdk-status";
        channelInputLabel.setAttribute("state", "Disconnected");
        
        
        
        let connectBtn = document.createElement('button');
        connectBtn.innerText = langs[lang]["Connect"];
        connectBtn.addEventListener('click', e => {
            connect(channelInput.value);
        })
        
        
        let lastMessageContainer = document.createElement('div');
        lastMessageContainer.id = "sdk-last-message"
        let lastMessageLabel = document.createElement("label");
        lastMessageLabel.innerText = langs[lang]["lastMessage"];

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
        container.appendChild(channelInputLabel);
        container.appendChild(connectBtn);
        
        
        container.appendChild(document.createElement("br"));
        container.appendChild(document.createElement("br"));
        container.appendChild(lastMessageContainer);
        container.appendChild(info);
        container.appendChild(debugInputLabel);
        container.appendChild(debugInput);
        document.querySelector('div[class="app-teaser-wrapper"]').appendChild(container)
      
        
        
        let letters = document.createElement("ul");
        letters.id = "coord-cols";
        letters.innerHTML = "<li>A</li> <li>B</li> <li>C</li> <li>D</li> <li>E</li> <li>F</li> <li>G</li> <li>H</li> <li>I</li>";

        let numbers = document.createElement("ul");
        numbers.id = "coord-rows";
        numbers.innerHTML = "<li>1</li> <li>2</li> <li>3</li> <li>4</li> <li>5</li> <li>6</li> <li>7</li> <li>8</li> <li>9</li>";

        document.getElementById("game").appendChild(letters);
        document.getElementById("game").appendChild(numbers);

      
      
   

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
                    debugPrint(`${tags['display-name']}: ${message}`)
        
                    // checks if starts with the command
                    if(message.startsWith(command)){
                        debugPrint("is sdk", message);

                        lastMessageContainer.style.backgroundColor = "";

                        // set "Last Message" element text with username and message
                        lastMessageName.innerText = tags['display-name'] + ": ";
                        lastMessageName.style.color = tags['color'];
                        lastMessageContent.innerText = message;


                        // format message in usable way, replacing command with empty string
                        let formattedMsg = message.replace(command, "");

                        // remove trailing spaces and split to get coord and number
                        formattedMsg = formattedMsg.trim().split(" ");
                        debugPrint(formattedMsg);

                        // checks if the second value is a number
                        if(!isNaN(formattedMsg[1])){
                            
                            // get coord and parse number as an integer
                            let position = formattedMsg[0];
                            let value = parseInt(formattedMsg[1]);

                            /**
                             * @description convert coordinates to index
                             * table is linear,
                             * for example:
                             * A1(first) = 0,
                             * A1(second row, first column) = 9
                             * I9(last) = 80
                             * 
                             * 
                             * @param {String} coord        column+row position, ex. A1, B5 
                             * @param {Number} rowCellCount number of columns in the table
                             * that will be multiplied to get the row
                             * @returns {Number} index/position as integer
                             */
                            function coordToIndex(coord, rowCellCount = 26){
                                let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                                coord = coord.split("");
                                return ((parseInt(coord[1]) - 1) * rowCellCount) + alphabet.lastIndexOf(coord[0].toLocaleUpperCase());
                            }
                            
                            debugPrint(`Received ${position}(${coordToIndex(position, 9)}) : ${value}`);
                            

                            // check if is in correct format (<col><row> <number> | A1 1)
                            if(/[A-I]{1,1}[1-9]{1,1} [1-9]{1,1}/gi.test(`${position} ${value}`)){
                                
                                // send to page side for input
                                document.dispatchEvent(new CustomEvent('setActiveCell', {detail: {
                                    time: new Date(),
                                    position: coordToIndex(position, 9),
                                    value
                                }}))
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
                    channelInputLabel.innerText = langs[lang]["Connecting"];
                    channelInputLabel.setAttribute("state", "Connecting");
                    connected = false;
                    
                })
                
                client.on('connected', (address, port) => {
                    debugPrint(`connected! ${address}:${port}`);
                    channelInputLabel.innerText = langs[lang]["Connected"];
                    channelInputLabel.setAttribute("state", "Connected");
                    connectBtn.innerText = langs[lang]["Disconnect"];
                    connectBtn.setAttribute("state", "Connected");
                    connected = true;

                })
                
                client.on('disconnected', (reason) => {
                    console.warn(`disconnected ${reason}`);
                    channelInputLabel.innerText = langs[lang]["Disconnected"];
                    channelInputLabel.setAttribute("state", "Disconnected");
                    connectBtn.innerText = langs[lang]["Connect"];
                    connectBtn.setAttribute("state", "Disconnected");

                    connected = false;
                })
        
            
                client.connect()
            }
        }








    }
})