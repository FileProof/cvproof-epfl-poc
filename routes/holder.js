var Block = require('../models/block.js').Block;
var formUtils = require('../utils/form.js');

var formidable = require('formidable')
var glob = require('glob');
var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();

// GET holder page
router.get('/holder', function(req, res, next) {
    if (!req.session.auth){
        res.redirect('/');
        return;
    }

    res.render('holder', {currentBlock: req.session.currentBlock});
});

// Cancel current block
router.get('/cancel-block', function(req, res, next) {
    if (!req.session.auth){
        res.redirect('/');
        return;
    }

    if (req.session.currentBlock) {
        delete req.session.currentBlock;
    }

    res.redirect('/holder');
});

// Process form
router.post('/submit-block', function(req, res, next) {
    if (!req.session.auth){
        res.redirect('/');
        return;
    }

    // Create incoming form
    var form = new formidable.IncomingForm();

    // Set up some stuff
    form.uploadDir = path.join(__dirname, '../public/attachments/');
    form.keepExtensions = true;
    form.multiples = false;

    // Rename it
    form.on('file', function(field, file) {
        // For some reason there is always at least one empty file
        if (file.size > 0)
        {
            fs.rename(file.path, path.join(form.uploadDir, file.name));
        }

        // Clean fake files
        cleanFormidableFakeUploadFiles();
    });

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

        var file = files.files;
        var block = new Block("John Smith", 
                            fields.validator, 
                            fields.type, 
                            fields.start_month + "/" + fields.start_year, 
                            fields.end_month + "/" + fields.end_year, 
                            fields.body,
                            file.size == 0 ? null : "attachments/" + file.name,
                            -1);

        // Save block in session
        req.session.currentBlock = block.json;

        res.render('holder-block-info', {currentBlock: req.session.currentBlock});
    });
});

function cleanFormidableFakeUploadFiles() {
    var options = {cwd: 'public/attachments/'};
    glob.glob("upload_*", options, function(er, files) {
        files.forEach(function(file) {
            var path = process.cwd() + '/public/attachments/' + file;

            if (fs.statSync(path).size == 0) {
                fs.unlink(path, function() {
                    console.log('Dummy formidable file deleted');
                });
            }
        });
    });
}

module.exports = router;