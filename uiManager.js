import { ingestWiki, processFile, getResponse } from './botLogic.js';
import { speak } from './voiceSystem.js';

const chatH = document.getElementById('chat-history');

// Handle UI buttons
document.getElementById('build-btn').onclick = async () => {
    const name = document.getElementById('bot-name').value;
    const url = document.getElementById('wiki-url').value;
    const status = await ingestWiki(url, name);
    addMessage(status, 'ai');
};

document.getElementById('upload-btn').onclick = () => document.getElementById('file-input').click();

document.getElementById('file-input').onchange = async (e) => {
    const fileName = await processFile(e.target.files[0]);
    document.getElementById('file-status').innerText = `📎 Attached: ${fileName}`;
};

document.getElementById('send-btn').onclick = async () => {
    const input = document.getElementById('user-input');
    const val = input.value;
    addMessage(val || "(File Sent)", 'user');
    input.value = "";
    document.getElementById('file-status').innerText = "";

    const aiRes = await getResponse(val);
    addMessage(aiRes, 'ai');
    speak(aiRes);
};

function addMessage(text, side) {
    const div = document.createElement('div');
    div.className = `msg ${side}`;
    div.innerText = text;
    if (side === 'ai') {
        const btn = document.createElement('button');
        btn.innerText = "🔊 Talk";
        btn.onclick = () => speak(text);
        div.appendChild(btn);
    }
    chatH.appendChild(div);
    chatH.scrollTop = chatH.scrollHeight;
}