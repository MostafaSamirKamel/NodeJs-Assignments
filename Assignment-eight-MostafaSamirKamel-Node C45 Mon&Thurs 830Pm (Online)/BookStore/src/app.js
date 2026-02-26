const express = require('express');
const cors = require('cors');
const collectionRoutes = require('./routes/collectionRoutes');
const bookRoutes = require('./routes/bookRoutes');
const logRoutes = require('./routes/logRoutes');
const authorRoutes = require('./routes/authorRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/collection', collectionRoutes);
app.use('/books', bookRoutes);
app.use('/logs', logRoutes);
app.use('/authors', authorRoutes);

module.exports = app;
