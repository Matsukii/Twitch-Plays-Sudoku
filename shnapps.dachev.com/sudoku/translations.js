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
        permit: "Allowed users separated by ,",
        permitPlaceholder: "users,separated,by,comma",
        errors: {
            "duplicate-command": "Duplicated command!\nThis command is reserved to add allowed users and can't be used for guesses!",
            "allowed-parsing": "Something went wrong while trying to ser allowed users, please review.\n\nList must be users separated by comma (',')\n\nExample:\n\t!s-allow user1,user2",
        },

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
        permit: "Usuários pernitidos",
        permitPlaceholder: "usuarios,separados,por,virgula",
        errors: {
            "duplicate-command": "Comando duplicado!\nEste comando é reservado para adicionar usuários permitidos e não pode ser usado para tentativas!",
            "allowed-parsing": "Algo deu errado ao adicionar os usuários a lista de permitidos\n\nA lista deve conter nomes separados por virgula (',')\n\nExemplo:\n\t!s-allow usuario1,usuario2",
        },


        info: `
            <br>
            Twitch Plays Sudoku Habilitado!
            <br>
            <br>
            Envie "${config.commands.guess} {coordenadas} {numero}" no chat para jogar!
            <br>
            <br>
            
            Exemplo:
            <br>
            Envie ${config.commands.guess} B2 1 para colocar o numero 1 na posição B2
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
        permit: "Usuários pernitidos",
        permitPlaceholder: "usuarios,separados,por,virgula",
        errors: {
            "duplicate-command": "Comando duplicado!\nEste comando é reservado para adicionar usuários permitidos e não pode ser usado para tentativas!",
            "allowed-parsing": "Algo deu errado ao adicionar os usuários a lista de permitidos\n\nA lista deve conter nomes separados por virgula (',')\n\nExemplo:\n\t!s-allow usuario1,usuario2",
        },


        info: `
            <br>
            Twitch Plays Sudoku Habilitado!
            <br>
            <br>
            Envie "${config.commands.guess} {coordenadas} {numero}" no chat para jogar!
            <br>
            <br>
            
            Exemplo:
            <br>
            Envie ${config.commands.guess} B2 1 para colocar o numero 1 na posição B2
        `
    },
}
