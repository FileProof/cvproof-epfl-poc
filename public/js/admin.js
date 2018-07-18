$(document).ready(function() {
    registerForm("adm-edit-form", null,
        function(res) {
            $('#comment').html(res.responseJSON.comment);
            $('#new-hash').html(res.responseJSON.hash);
            $('#adm-edit-form').removeClass('loading');
            $('#hash-modal').modal('show');
    });

    $('#submit-edit').click(function(){
        $('#hash-modal').modal('show');
    });

    $('#hash-edit').click(function(){
        // Save form state
        var form = $('#adm-edit-form').html();

        // Register "Got it" and "Cancel" to restore the form before hiding
        $('#got-it-button').click(form, function(e) {
            $('#adm-edit-form').html(e.data);
        });

        $('#cancel-edit').click(form, function(e) {
            $('#edit-hash-modal').modal('hide');
            $('#adm-edit-form').html(e.data);
        });


        $('#edit-hash-modal').modal({
            autofocus: false,
        }).modal('show');

        $('#new-file-input-div').popup({
            position: 'right center',
            title: 'Note',
            target: '#new-file-input',
            content: 'If no document is selected, the old one is used.'
        });
    });

    $('#pop-up-no-block').popup({
        position: 'right center',
        title: 'Help',
        target: '#pop-up-no-block',
        content: 'Once a document gets validated you will be able to try to edit its content to notice how it affects the digital signature.'
    });

      $('#pop-up-block').popup({
        position: 'right center',
        title: 'Help',
        target: '#pop-up-block',
        content: 'Try to edit the document to see how its digital signature is affected.'
    });
});