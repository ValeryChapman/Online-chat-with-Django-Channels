// get url params
function params(str) {
    var res = {};
    (str || location.search).replace(/^\?/, "").split("&").forEach(function (str) {
        str = str.split("=");
        res[str[0].toLowerCase()] = str[1] || true;
    });
    return res;
}

// scroll messages block to bottom
function ScrollBottom() {
    var message_block = document.getElementById("message-block");
    message_block.scrollTop = message_block.scrollHeight;
}

// connect to server
let socket = new WebSocket(`ws://localhost:8000/ws/chat/${params().chat}/`);

// Send message func
let Send = function (data) {
    if (!socket.readyState) {
        setTimeout(function () { Send(data); }, 100);
    } else {
        socket.send(data);
    }
};

// get message
socket.onmessage = async function (event) {
    responce = JSON.parse(event.data)

    let message_block = document.getElementById("messages");
    let message = document.createElement('fieldset');

    if (responce.status == 'root' && responce.username == params().username) {
        console.log('by root')
    } else if (responce.status == 'root' && responce.username != params().username) {
        message.className = "message from-them";
        message.innerHTML = `<legend style='text-align: left; font-weight: 600;'>root</legend>${responce.message}`;
        message_block.append(message)
        ScrollBottom()
    } else {
        if (responce.username == params().username) {
            message.className = "message from-me";
        } else {
            message.className = "message from-them";
        }
        message.innerHTML = `<legend style='text-align: left; font-weight: 600;'>${decodeURI(responce.username)}</legend>${responce.message}`;
        message_block.append(message)
        ScrollBottom()
    }
};

root_chat_message(`${params().username} joined the chat`)
root_local_message(`You have joined a group: ${params().chat}`)

// if user close window (chat page)
window.onbeforeunload = function () {
    root_chat_message(`${params().username} left the chat`)
}

// send message by root
function root_chat_message(message) {
    Send(JSON.stringify({ "chat": params().chat, "username": params().username, "message": message, "time": Date.now(), "status": "root" }));
};

// send local message by root
function root_local_message(text) {
    let message_block = document.getElementById("messages");
    let message = document.createElement('fieldset');
    message.className = "message from-them";
    message.innerHTML = `<legend style='text-align: left; font-weight: 600;'>root</legend>${text}`;
    message_block.append(message)
    ScrollBottom()
};

// send message
send.onclick = function () {
    let message = document.getElementById('message').value;
    if (message != "" && message.length < 3000) {
        Send(JSON.stringify({ "chat": params().chat, "username": params().username, "message": message, "time": Date.now(), "status": "user" }));
    }
    document.getElementById('message').value = "";
};

// ENTER button click
$(document).keypress(function (e) {
    if (e.which == 13) {
        document.getElementById("send").click();
    }
});
