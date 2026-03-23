import { ingestWiki, processFile, getResponse } from './botLogic.js';
import { speak } from './voiceSystem.js';

const chatH = document.getElementById('chat-history');
const userInput = document.getElementById('user-input');

// --- THE MASTER SEND FUNCTION ---
async function handleSend() {
    const val = userInput.value.trim();
    if (!val && !document.getElementById('file-input').files[0]) return;

    addMessage(val || "(File Sent)", 'user');
    userInput.value = "";
    document.getElementById('file-status').innerText = "";

    // Show a "Thinking" message
    const tempId = Date.now();
    addMessage("...", 'ai', tempId);

    try {
        const aiRes = await getResponse(val);
        // Replace the "..." with actual answer
        document.getElementById(tempId).innerText = aiRes;
        
        // Add the Talk button to the new message
        const talkBtn = document.createElement('button');
        talkBtn.innerText = "🔊 Talk";
        talkBtn.onclick = () => speak(aiRes);
        document.getElementById(tempId).appendChild(talkBtn);
        
        speak(aiRes);
    } catch (e) {
        document.getElementById(tempId).innerText = "Error: Check your API Key or Connection.";
    }
}

// --- 1. CLICK Rocket Button (Mobile/PC) ---
document.getElementById('send-btn').onclick = handleSend;

// --- 2. HIT Enter Key (PC/iMac) ---
userInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // Stops the page from refreshing
        handleSend();
    }
});

// --- 3. OTHER UI BUTTONS ---
document.getElementById('build-btn').onclick = async () => {
    const name = document.getElementById('bot-name').value;
    const url = document.getElementById('wiki-url').value;
    if(!url) return alert("Paste a Wiki link!");
    const status = await ingestWiki(url, name);
    addMessage(status, 'ai');
};

document.getElementById('upload-btn').onclick = () => document.getElementById('file-input').click();

document.getElementById('file-input').onchange = async (e) => {
    const fileName = await processFile(e.target.files[0]);
    document.getElementById('file-status').innerText = `📎 Attached: ${fileName}`;
};

// --- UI HELPER ---
function addMessage(text, side, id = null) {
    const div = document.createElement('div');
    div.className = `msg ${side}`;
    div.innerText = text;
    if (id) div.id = id;
    
    if (side === 'ai' && !id) {
        const btn = document.createElement('button');
        btn.innerText = "🔊 Talk";
        btn.onclick = () => speak(text);
        div.appendChild(btn);
    }
    
    chatH.appendChild(div);
    chatH.scrollTop = chatH.scrollHeight;
}
