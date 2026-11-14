require('dotenv').config();
const express = require('express');
const path = require('path');
const rootDir = require('./utils/pathUtils');
const { notFound } = require('./controllers/error');
const { hostRouter } = require('./routes/hostRouter');
const { mongoConnect } = require('./utils/databaseUtils');
const storeRouter = require('./routes/storeRouter');

const app = express();
const PORT = process.env.PORT || 3001;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(rootDir, 'uploads')));
app.use(express.static(path.join(rootDir, 'public')));

app.use(storeRouter);
app.use('/host', hostRouter);

app.use(notFound);

mongoConnect(() => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
});