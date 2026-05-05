const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express');
const router = express.Router();

// Initialisation de l'IA
const genAI = new GoogleGenerativeAI(process.env.API_GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

router.post("/IA",async (req, res) => {
    const { Joueur, Enemy, Joueur_hp, Enemy_hp, logs } = req.body;    // 1. Réponse immédiate au client pour l'expérience utilisateur
     console.log("Combat terminé, calcul des récompenses...")

    // 2. Génération du rapport en tâche de fond
    try {
         const prompt = `
        Tu es un chroniqueur de combat pour le jeu Paper Mario.Garde le nom des attaques et des perssonnages comme elle te sont donnée. Ne fait pas de resumé épique un résume simple avec juste les conseils
            
            CONTEXTE :
            duel en 1 contre 1
            - Joueur : ${Joueur} (${Joueur_hp} HP restants)
            - Ennemi : ${Enemy} (${Enemy_hp} HP - restant)
            
            LOGS DU COMBAT (du plus récent au plus ancien) :
        0. Le gagnant (ex le joueur ou le bot)
        1. Le meilleur coup avec le nom.
        2. Un conseil tactique.
        en 5 ligne
            `;

        const result = await model.generateContent(prompt);
        const report = result.response.text();

        // 3. Sauvegarde en BDD ou envoi via WebSocket (Socket.io) au joueur
        res.status(200).json({ report})
        console.log("RAPPORT ENVOYé")
    } catch (error) {
        console.error("Erreur lors de la génération du rapport :", error);
    }
})
module.exports = router;
