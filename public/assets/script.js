const messagesDiv = document.getElementById('messages');
const input = document.getElementById('command-input');

function appendMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = 'message ' + type;
    msg.innerText = text;
    messagesDiv.appendChild(msg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function displayOutput(output) {
    appendMessage(output, 'terminal');
}

function sendCommand() {
    const command = input.value.trim();
    if (command === "") return;
    appendMessage(command, 'user');
    input.value = '';
    
    // Panggil fungsi Java
    if (typeof Android !== 'undefined' && Android.runTermuxCommand) {
        Android.runTermuxCommand(command);
        appendMessage("FEAC Core: Perintah diproses...", 'system');
    } else {
        appendMessage("ERROR: Android Bridge tidak ditemukan.", 'terminal');
    }
}

input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendCommand();
});
