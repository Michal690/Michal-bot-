
# MichaľBot Backend

Toto je Node.js backend pre MichaľBota 3.0 – AI asistent s podporou GPT, obrázkov a modulov.

## Inštalácia lokálne

```bash
npm install
npm start
```

## Potrebné premenné
Vytvor `.env` súbor s obsahom:

```
OPENAI_API_KEY=sk-...tvoj_kluc
```

## Nasadenie na Railway
1. Vytvor nový projekt na [https://railway.app](https://railway.app)
2. Prepoj so svojím GitHub repozitárom
3. Pridaj `OPENAI_API_KEY` do Environment Variables
4. Railway automaticky deployne aplikáciu
