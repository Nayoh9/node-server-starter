const express = require("express");
const morgan = require("morgan");
const errorHandler = require('errorhandler');
require("./database/index");
const dotenv = require('dotenv').config()
const { v4: uuidv4 } = require('uuid');





const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('short'));
app.use(errorHandler);
app.use(express.json());


if (process.env.NODE_ENV === 'development') {
    app.use(errorHandler());
} else {
    // Creation d'un middleware d'erreur
    app.use((err, req, res, next) => {
        const code = err.code || 500;
        res.status(code).json({
            code: code,
            message: code === 500 ? null : err.message
        })
    });
}

console.log(process.env.NODE_ENV, "/", "port :", port);
app.listen(port);

