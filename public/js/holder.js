$(document).ready(function() {
    // Register form to be async
    registerForm('block-form', function(content) {
        $('#main-block-content').html(content);
        $('#first-step').removeClass('active').addClass('completed');
        $('#second-step').addClass('active');

        $('#pop-up-help-info').popup({
            position: 'right center',
            title: 'Help',
            target: '.message',
            content: 'Here you can see the details of the document you have submitted along with its status'
        });
    });
    
    $('select.dropdown').dropdown();

    $('#pop-up-help-form').popup({
        position: 'right center',
        title: "Help",
        target: '#form-segment',
        content: 'Fill in the form to simulate document submission as a holder.'
    });

    $('#files').popup({
        position: 'left center',
        title: 'Disclaimer',
        target: '#file-input',
        content: 'Upload only dummy documents (1 MB max) as the system does not rely on authentication and anyone might access to your uploads'
    });

    setInterval(function() {
        $('.notification').transition('shake');
    }, 3 * 1000);
});