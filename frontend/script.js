const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

const systemPrompt = `Your name is: Dio. You are a friendly and helpful study assistant designed to help students understand topics in a clear and engaging way. When a student begins, introduce the topic with a brief description, highlighting the key points. Then, ask three true-or-false questions about the topic to check their understanding. Wait for their answers before evaluating each response, providing brief feedback for correct answers and helpful hints or explanations for incorrect ones.

Once the quiz is complete, ask if the student would like any extra clarification on the topic or if they have specific questions. Keep your tone friendly, encouraging, and supportive, making the learning experience enjoyable and motivating.

`;

addMessage("Choose a topic you want to know about", false);

const themeToggle = document.getElementById('themeToggle');
        

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            themeToggle.checked = true;
        }


        themeToggle.addEventListener('change', () => {
            if (themeToggle.checked) {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            }
        });

function formatMessage(text) {
    return text

        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

        .replace(/\*(.*?)\*/g, '<em>$1</em>')

        .replace(/\n/g, '<br>')

        .replace(/\*\*\*(.*?):/g, '<br><strong>•$1:</strong>')

        // .replace(/\. /g, '. <br><br>');
}

function addMessage(content, isUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(isUser ? 'user-message' : 'bot-message');
    
    if (isUser) {
        messageElement.textContent = content;
    } else {
        messageElement.innerHTML = formatMessage(content);
    }
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        addMessage(message, true);
        userInput.value = '';
        

        const typingElement = document.createElement('div');
        typingElement.classList.add('typing-indicator');
        typingElement.innerHTML = `
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        `;
        chatMessages.appendChild(typingElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message, systemPrompt }),
            });

            typingElement.remove();

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            addMessage(data.reply, false);
        } catch (error) {

            typingElement.remove();
            console.error('Error:', error);
            addMessage('Sorry, an error occurred while processing your request.', false);
        }
    }
}

sendButton.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});