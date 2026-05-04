require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors())

app.use(express.json());

const charactersRouter = require('./routes/characters-routes');
app.use('/characters', charactersRouter);

const itemsRouter = require('./routes/items-routes');
app.use('/items', itemsRouter);

const attacksRouter = require('./routes/attacks-routes');
app.use('/attacks', attacksRouter);

const fightRouter = require('./routes/fight-routes');
app.use('/fight', fightRouter);

const usersRouter = require('./routes/users-routes');
app.use('/users', usersRouter);

const IARouter = require('./routes/IA-routes');
app.use( IARouter);

require('./dao/mongoose/connection').connect_mongoose();

app.listen(3000, () => {
    console.log(`🚀 Server started on port 3000`);
})
