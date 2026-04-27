const express = require('express');
const router = express.Router();
const characterService = require('../services/characters-services');

router.get('/', async (req, res) => {
    const serviceResponse = await characterService.getAll();
    return res.json(serviceResponse);
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const serviceResponse = await characterService.getOneById(id);
    return res.json(serviceResponse);
})

module.exports = router;