const express = require("express");
const morgan = require("morgan");
const routes = require("./routes/index");
// const errorHandler = require('errorhandler');
require("./database/index");
const dotenv = require('dotenv').config()






const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('short'));
// app.use(errorHandler);
app.use(express.json());

app.use(routes);


if (process.env.NODE_ENV === 'development') {
    app.use(errorHandler());
} else {
    // Creation d'un middleware d'erreur
    app.use((err, req, res, next) => {

        console.log(err);
        // Validators error handling
        if (err.errors) {
            const errors = err.errors
            const errorsArray = [];
            for (const [key, value] of Object.entries(errors)) {
                errorsArray.push(value.message);
            }
            return res.status(500).json({ error_messages: errorsArray });
        }

        // Duplicate document error handling
        if (err.errorResponse && err.errorResponse.code === 11000) {
            const keyName = Object.keys(err.errorResponse.keyValue);
            return res.status(500).json(`Erreur de duplication : ${keyName}`);
        }

        // Single error handling
        const code = err.code || 500;
        return res.status(code).json({
            code: code,
            message: code === 500 ? null : err.message
        })

    });

}

console.log(process.env.NODE_ENV, "/", "port :", port);
app.listen(port);

