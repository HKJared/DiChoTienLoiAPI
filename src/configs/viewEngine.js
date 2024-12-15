const express = require('express');

const configViewEngine = (app) => {
    app.use(express.static('./public'));
};

module.exports = configViewEngine;