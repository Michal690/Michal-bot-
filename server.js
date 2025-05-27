
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/ask', async (req, res) => {
    const userMessage = req.body.message;
    const tone = req.body.tone || 'funny';
    const language = req.body.language || 'slovak';
    const langPrompt = `Odpovedz v jazyku: ${language}${tone === 'funny' ? ', buď trochu vtipný, kamarát, a neformálny' : ', odpovedz slušne a vecne'}.`;
    const fullPrompt = `${langPrompt}\n${userMessage}`;
    try {
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: fullPrompt }],
        });
        res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).send('Chyba pri odpovedi bota.');
    }
});

app.post('/module', async (req, res) => {
    const number = req.body.module;
    const tone = req.body.tone || 'funny';
    const language = req.body.language || 'slovak';
    const langPrefix = `Odpovedz v jazyku: ${language}${tone === 'funny' ? ', štýlom ako kámoš s humorom' : ', odpovedz slušne a profesionálne'}.`;
    const prompts = {
        1: "Vystupuj ako učiteľ a začni výučbu v ľubovoľnej zaujímavej oblasti. Polož otázku a čakaj na odpoveď.",
        3: "Napíš túto správu v troch jazykoch: angličtina, nemčina, taliančina: Ahoj, ako sa máš?",
        4: "Prelož vetu 'Zajtra pôjdeme do hôr' do angličtiny, francúzštiny a poľštiny.",
        5: "Predstav si, že si GPS navigácia. Nasimuluj hlasovú navigáciu do najbližšej kaviarne.",
        6: "Navrhni obrázok, ktorý môžem vygenerovať pomocou AI (napr. DALL·E).",
        7: "Povedz jeden vtip, jednu hádanku a jednu krátku zábavnú historku.",
        9: "Navrhni 3 nové kreatívne funkcie pre osobného AI asistenta.",
        10: "Vystupuj ako tréner. Navrhni krátky 5-minútový tréningový plán bez pomôcok."
    };

    const prompt = prompts[number];
    const fullPrompt = `${langPrefix}\n${prompt}`;
    if (!prompt) {
        return res.status(400).json({ reply: "Modul nie je dostupný." });
    }

    try {
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: fullPrompt }],
        });
        res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).send('Chyba pri spustení modulu.');
    }
});

app.listen(3000, () => {
    console.log('MichaľBot GPT backend beží na porte 3000');
});


const axios = require('axios');

// Obrázkový prompt → generuj obrázok (DALL·E)
app.post('/image-gen', async (req, res) => {
    const { prompt } = req.body;
    try {
        const response = await openai.createImage({
            prompt: prompt,
            n: 1,
            size: "512x512"
        });
        res.json({ image_url: response.data.data[0].url });
    } catch (error) {
        console.error("Image generation error:", error);
        res.status(500).send('Nepodarilo sa vygenerovať obrázok.');
    }
});

// Textový opis obrázka (via GPT)
app.post('/image-describe', async (req, res) => {
    const { description } = req.body;
    const prompt = tone === 'funny' ? `Predstav si, že niekomu vtipne opisuješ obrázok na základe tohto popisu: "${description}"` : `Popíš obrázok presne a vecne na základe tohto popisu: "${description}"`

    try {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }]
        });
        res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Image describe error:", error);
        res.status(500).send("Nepodarilo sa získať popis obrázka.");
    }
});
