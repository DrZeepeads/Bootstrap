const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

const API_URL = 'https://api-inference.huggingface.co/models/YOUR_MODEL';
const API_TOKEN = 'YOUR_API_TOKEN';

// Display message in chat
function displayMessage(sender, message) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-message', sender === 'user' ? 'user-message' : 'bot-message');
    msgDiv.innerText = message;
    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Send message to Hugging Face API
async function sendMessage(message) {
    displayMessage('user', message);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputs: message })
        });
        const data = await response.json();
        const botResponse = data[0]?.generated_text || "I'm having trouble understanding that.";
        displayMessage('bot', botResponse);
    } catch (error) {
        console.error('Error:', error);
        displayMessage('bot', 'Something went wrong. Please try again later.');
    }
}

// Event Listener
sendBtn.addEventListener('click', () => {
    const message = userInput.value.trim();
    if (message) {
        sendMessage(message);
        userInput.value = '';
    }
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});
