
// configure here, then you don't need to change in page or URL 
let config = {
    // supported: en|pt|br
    lang: "en",

    channel: "",
    commands: {
        guess: "!command",
        allow: "!s-allow", // allow only certain users to play
    },
    moderators: [],
    allowedPlayers: [],


    delays:{
        // when a number is added to board and is wrong,
        // it is removed only when click outside (when input is done by the extension)
        // this delays an click outside of the cell to trigger the remove
        // BUT ATTENTION: this can prevent insertion of numbers if the click to dismiss and a
        // click to select an cell are excuted at the same time, chances are not high, but isn't imposible,
        // specially in chat with a lot of players
        // 
        // change the following number in millisseconds, this basically indicates how much time
        // a number will stay in the cell if is wrong
        dismiss: 100,
    },


    debug: true,

    // change to "true" to hide channel, command, users inputs and chat guesses
    // CONNECT/DISCONNECT Button will be always available 
    hideConnectionControls: false,

}