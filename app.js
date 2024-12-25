// Hugging Face API setup
const apiUrl = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-alpha";
const apiKey = "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";

// DOM elements
const chatContainer = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const typingIndicator = document.getElementById('typing-indicator');

// Initialize chat history
const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
chatHistory.forEach(({ sender, message }) => addMessage(sender, message));

// Event listeners
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Send message
async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    // Add user message to chat and clear input
    addMessage("You", userMessage);
    saveToHistory("You", userMessage);
    userInput.value = "";
    typingIndicator.classList.remove('d-none');

    try {
        // Fetch response from Hugging Face
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: userMessage }),
        });

        if (response.ok) {
            const data = await response.json();

            // Log response for debugging
            console.log("API Response:", data);

            // Check if response contains generated text
            const botResponse = data.generated_text || "I couldn't find the information. Can you rephrase?";
            addMessage("NelsonBot", botResponse);
            saveToHistory("NelsonBot", botResponse);
        } else {
            // Log API error details
            const errorDetails = await response.json().catch(() => ({})); // Handle cases where error details are not in JSON format
            const errorMessage = errorDetails.error || "An unknown error occurred.";
            console.error("API Error:", response.status, errorMessage);
            addMessage(
                "NelsonBot",
                `Error: Unable to retrieve information. (${response.status}) - ${errorMessage}`
            );
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        addMessage("NelsonBot", "An error occurred. Please check your internet connection or try again later.");
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

// Save message to local storage
function saveToHistory(sender, message) {
    chatHistory.push({ sender, message });
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}