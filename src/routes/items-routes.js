const express = require('express');
const router = express.Router();
const itemService = require('../services/items-services');

router.get('/', async (req, res) => {
    const serviceResponse = await itemService.getAll();
    return res.json(serviceResponse);
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const serviceResponse = await itemService.getOneById(id);
    return res.json(serviceResponse);
})

module.exports = router;