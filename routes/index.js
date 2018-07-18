var Block = require('../models/block.js').Block;
var formUtils = require('../utils/form.js');

var formidable = require('formidable')
var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();

const PASSWORD = "discover-cvproof";

// GET home page
router.get('/', function(req, res, next) {
    if (req.session.auth){
        res.redirect('/holder');
        return;
    }

    res.render('lock');
});

// POST home page
router.post('/', function(req, res, next) {
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        if (fields.password == PASSWORD) {
            req.session.auth = true;
            res.redirect('/holder');
            return;
        }

        res.render('lock');
    });
});

module.exports = router;