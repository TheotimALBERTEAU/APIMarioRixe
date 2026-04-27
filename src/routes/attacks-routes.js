const express = require('express');
const router = express.Router();
const attackService = require('../services/attacks-services');

router.get('/', async (req, res) => {
    const serviceResponse = await attackService.getAll();
    return res.json(serviceResponse);
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const serviceResponse = await attackService.getOneById(id);
    return res.json(serviceResponse);
})

module.exports = router;