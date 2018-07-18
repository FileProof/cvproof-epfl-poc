var Block = require('../models/block.js').Block;
var formUtils = require('../utils/form.js');

var formidable = require('formidable')
var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();


// GET validator page
router.get('/validator', function(req, res, next) {
    if (!req.session.auth){
        res.redirect('/');
        return;
    }

    res.render('validator', {currentBlock: req.session.currentBlock});
});

// Edit form
router.post('/edit-block', function(req, res, next) {
    if (!req.session.auth){
        res.redirect('/');
        return;
    }

    // Check if session expired
    if (!req.session.currentBlock) {
        res.redirect('/validator');
        return;
    }

    // Create incoming form
    var form = new formidable.IncomingForm();

    // Log any errors that occur
    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
    });

    form.parse(req, function(err, fields, files) {
        // Validate fields
        var err = formUtils.validateFields(fields);
        if (err) {
            res.status(formUtils.VALIDATION_ERROR_CODE).send(err)
            return;
        }

        var block = new Block(req.session.currentBlock.holderId, 
                                req.session.currentBlock.validatorId, 
                                fields.type, 
                                fields.start_month + "/" + fields.start_year, 
                                fields.end_month + "/" + fields.end_year, 
                                fields.body,
                                req.session.currentBlock.attachmentPath,
                                req.session.currentBlock.submissionTime);

        // Save block in session
        req.session.currentBlock = block.json;

        res.render('validator-block-waiting', {currentBlock: req.session.currentBlock});

    });
});


// Reject current block
router.get('/reject-block', function(req, res, next) {
    if (!req.session.auth){
        res.redirect('/');
        return;
    }

    var currentBlock = Block.fromJSON(req.session.currentBlock);
    currentBlock.process(false);
    req.session.currentBlock = currentBlock.json;

    res.render('validator', {currentBlock: req.session.currentBlock});
});

// Reject current block
router.get('/accept-block', function(req, res, next) {
    if (!req.session.auth){
        res.redirect('/');
        return;
    }

    var currentBlock = Block.fromJSON(req.session.currentBlock);
    currentBlock.process(true);
    req.session.currentBlock = currentBlock.json;

    res.render('validator', {currentBlock: req.session.currentBlock});
});


module.exports = router;