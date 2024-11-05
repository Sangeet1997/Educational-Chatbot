import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// app.post('/chat', async (req, res) => {
//     const { message, systemPrompt } = req.body;
    
//     try {
//         const response = await axios.post(
//             'http://localhost:11434/api/chat',
//             { 
//                 "model": "llama3.2",
//                 "messages": [
//                     { "role": "system", "content": systemPrompt },
//                     { "role": "user", "content": message }
//                 ]
//             }
//         );

//         const responseLines = response.data.trim().split('\n');
//         let combinedMessage = '';

//         responseLines.forEach(line => {
//             const parsedLine = JSON.parse(line);
//             combinedMessage += parsedLine.message.content;
//         });

//         console.log(combinedMessage);
//         res.json({ reply: combinedMessage});
//     } catch (error) {
//         console.error('Error:', error);
//         console.log("error in backend");
//         res.status(500).json({ error: 'An error occurred while processing your request' });
//     }
// });

const conversations = {};

app.post('/chat', async (req, res) => {
    const { message, systemPrompt, sessionId } = req.body;
    
    if (!conversations[sessionId]) {
        conversations[sessionId] = [
            { "role": "system", "content": systemPrompt }
        ];
    }

    conversations[sessionId].push({ "role": "user", "content": message });

    try {
        const response = await axios.post(
            'http://localhost:11434/api/chat',
            {
                "model": "llama3.2",
                "messages": conversations[sessionId]
            }
        );

        const responseLines = response.data.trim().split('\n');
        let combinedMessage = '';

        responseLines.forEach(line => {
            const parsedLine = JSON.parse(line);
            combinedMessage += parsedLine.message.content;
        });
        
        conversations[sessionId].push({ "role": "assistant", "content": combinedMessage });

        console.log(combinedMessage);
        res.json({ reply: combinedMessage });
    } catch (error) {
        console.error('Error:', error);
        console.log("error in backend");
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

app.get('/healthz', async (req, res) => {
    try {
        console.log("test start");
        const response = await axios.post(
            'http://localhost:11434/api/chat',
            {
                "model": "llama3.2",
                "messages": [
                  { "role": "user", "content": "This is the health check of a chatbot. I'm just trying to check if the LLM is working. Please respond with the LLM model being used" }
                ]
            }
        )

        const responseLines = response.data.trim().split('\n');
        let combinedMessage = '';

        responseLines.forEach(line => {
            const parsedLine = JSON.parse(line);
            combinedMessage += parsedLine.message.content;
        });

        res.json(combinedMessage);
        console.log(combinedMessage);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred during the test' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

        // const response = await ollama.chat({
        //     model: 'llama3.2',
        //     messages: [{ role: 'user', content: 'Why is the sky blue?' }],
        // });
        // console.log(response.message.content);


        // const response = await axios.post(
        //     'http://localhost:11434/api/chat',
        //     {
        //         "model": "llama3.2",
        //         "messages": [
        //           { "role": "user", "content": "why is the sky blue?" }
        //         ]
        //     }
        // )
        // res.json({ response: response.data });
        // console.log(response.data);
        //works

        // const ollamaClient = new Ollama({
//     baseUrl: 'http://localhost:11434', 
//   });

