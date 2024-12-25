const apiUrl = "https://api-inference.huggingface.co/models/your-model-id";
const apiKey = "YOUR_HUGGINGFACE_API_KEY";

const chatContainer = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const typingIndicator = document.getElementById('typing-indicator');

// Restore chat history from localStorage
const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];

// Display chat history
chatHistory.forEach(({ sender, message }) => addMessage(sender, message));

// Add event listeners
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Send message
async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    addMessage("You", userMessage);
    saveToHistory("You", userMessage);

    userInput.value = "";
    typingIndicator.classList.remove('d-none');

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: userMessage })
        });

        if (response.ok) {
            const data = await response.json();
            const botResponse = data.generated_text || "I'm not sure about that. Let me look into it.";
            addMessage("NelsonBot", botResponse);
            saveToHistory("NelsonBot", botResponse);
        } else {
            addMessage("NelsonBot", "Sorry, I couldn't fetch the information right now.");
        }
    } catch (error) {
        console.error("Error:", error);
        addMessage("NelsonBot", "An error occurred. Please try again later.");
    } finally {
        typingIndicator.classList.add('d-none');
    }
}

// Add message to the chat
function addMessage(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender === "NelsonBot" ? 'bot' : 'user');
    messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Save to chat history
function saveToHistory(sender, message) {
    chatHistory.push({ sender, message });
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}