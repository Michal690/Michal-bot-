const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();
const app = express();
const port = 80;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

// Základná testovacia route
app.get("/", (req, res) => {
  res.send("MichaľBot API beží.");
});

// Hlavná odpoveďová route
app.post("/ask", async (req, res) => {
  const userMessage = req.body.message;
  const language = req.body.language || "slovak";
  const tone = req.body.tone || "funny";

  const prompt = `Odpovedz v jazyku: ${language}${tone === "funny" ? ", buď trochu vtipný, kamarát, a neformálny" : ", odpovedz slušne a vecne"}.\nPoužívateľ: ${userMessage}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error("Chyba OpenAI:", err);
    res.status(500).send("Chyba AI odpovede.");
  }
});

app.listen(port, () => {
  console.log(`Server beží na porte ${port}`);
});
