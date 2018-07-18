var Block = require('../models/block.js').Block;
var formUtils = require('../utils/form.js');

var formidable = require('formidable')
var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();

// GET admin page
router.get('/admin', function(req, res, next) {
    if (!req.session.auth){
        res.redirect('/');
        return;
    }

    res.render('admin', {currentBlock: req.session.currentBlock});
});

// Get new hash
router.post('/get-new-hash', function(req, res, next) {
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
                                req.session.currentBlock.validatorId, 
                                fields.type, 
                                fields.start_month + "/" + fields.start_year, 
                                fields.end_month + "/" + fields.end_year, 
                                fields.body,
                                file.size == 0 ? req.session.currentBlock.attachmentPath : "attachments/" + file.name,
                                -1);
        var blockHash = block.hash;

        if(req.session.currentBlock.hash === blockHash)
            res.json({hash: block.hash, comment:"No modification detected (identical fingerprint)"});
        else
            res.json({hash: block.hash, comment: "Changes detected (different fingerprint)"});
    });
});



module.exports = router;