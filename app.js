import {config} from "dotenv";
config();
import express from "express";
import path from "path";
import cors from 'cors';
import { fileURLToPath } from 'url';
import {Completion} from "./completion.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(cors());

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Single-Chat interface API server Listening on port ${port}`)
});

// verificação da chave de api estática
var checkApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (apiKey !== process.env.API_KEY) {
        return res.status(401).json({ message: "Invalid API Key"})
    }

    next();
};

app.all('/api/*', checkApiKey);

// recebe texto em base64 pra evitar problemas com json e caracteres especiais
app.post('/api/summarize', (req, res) => {
    console.log("New request at Single-Chat SUMMARIZE endpoint at ", Date.now());

    const b64text = req.body['content'];
    const buff = new Buffer.from(b64text, 'base64');
    const text = buff.toString('utf-8');

    if (!text) {
        return res.status(400).json({ message: "Text to summarize is required" });
    }

    console.log(text);

    Completion(text)
    .then(result => {
        res.status(200).json({ summary: result });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    });

})