const express = require('express');
const router = express.Router();
const UserService = require("../services/users-services");

router.post("/login", async (req, res) => {
    const serviceResponse = await UserService.connectUser(req.body);
    return res.json(serviceResponse);
});

router.post("/signup", async (req, res) => {
    const serviceResponse = await UserService.signupUser(req.body);
    return res.json(serviceResponse);
})

module.exports = router;