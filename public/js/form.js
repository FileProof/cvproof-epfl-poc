const MAX_FILE_SIZE = 1 * 1000000;
const MB = 1000000;

function registerForm(formId, onSuccess, onComplete) {
    $('#' + formId).submit(function(e) {
        e.preventDefault();

        // Dirty fix preventing form to be submitted twice somehow
        e.stopImmediatePropagation();

        // Make sure the file is not too big
        // Doesnt work with jquery for some reason
        var input = document.getElementById('file-input');
        if (input) {
            var file = input.files[0];
            if (file && file.size > MAX_FILE_SIZE) {
                formErrorMessage('File too large', 'Please upload files less than ' + (MAX_FILE_SIZE / MB) + ' MB.');
                return;
            }
        }


        var formData = new FormData(this);

        var params = 
        {
            url: $('#' + formId).attr('action'),
            type: 'POST',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function() {
                // Show spinner
                $('#' + formId).addClass('loading');
            },
            success: onSuccess,
            error: displayError,
            complete: onComplete
        }

        $.ajax(params);

    });
}

function displayError(jqXHR) {
    $('form').removeClass('loading');
    // We empty the previous errors
    $('#errors').empty();
    var err = jqXHR.responseJSON;

    if (err.missingFields) {
        formErrorMessage('Missing fields', 'Please fill in the missing fields.');

        err.missingFields.forEach(function(field) {
            $('#'+field).addClass('error');
        });
    }

    var bothYearsMissing = err.missingFields ? (err.missingFields.indexOf("start_year") > -1) && (err.missingFields.indexOf("end_year") > -1) : false;


    if (err.yearFormatError && !bothYearsMissing) {
        formErrorMessage('Format error', 'Years should be 4 digits (e.g. 2017).');

        err.yearFormatError.forEach(function(field) {
            $('#'+field).addClass('error');
        });
    }
    if (err.yearInvalid) {
        formErrorMessage('Invalid Date', 'Starting date needs to be before Ending date.');
        err.yearInvalid.forEach(function(field) {
            $('#'+field).addClass('error');
        });
    }
}

function formErrorMessage(title, text) {
    $('form').addClass('error');
    var errMsg = $('<div/>').addClass('ui error message');
    var header = $('<div/>').addClass('header').html(title);
    var msg = $('<p/>').html(text);
    errMsg.append(header).append(msg);
    $('#errors').append(errMsg);
}