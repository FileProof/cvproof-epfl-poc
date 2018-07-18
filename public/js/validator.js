$(document).ready(function() {
    setUp();
});

function setUp() {
    registerForm("validator-edit-form", function(content) {
        $('#main-block-content').html(content);
        setUp();
        $('#review-modal').modal('show');
    });

    $('#review-button').click(function(){
        $('#review-modal').modal('show');
    });

    $('#review-edit').click(function(){
        $('#edit-modal').modal({
            autofocus: false,
        }).modal('show');
    });

    $('#cancel-edit').click(function(){
        $('#review-modal').modal('show');
    });

    $('#pop-up-help-validator-block').popup({
        position: 'right center',
        title: 'Help',
        target: '#pop-up-help-validator-block',
        content: "Here you can see documents submitted by the holder. Click on 'Review submission' to decide wether to accept it or not."
    });

    $('#pop-up-help-validator-no-block').popup({
        position: 'right center',
        title: 'Help',
        target: '#pop-up-help-validator-no-block',
        content: 'Once a new document is submitted you can review its content, edit it and decide wether to accept or reject it.'
    });
}