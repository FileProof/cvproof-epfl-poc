// Validate block form fields
function validateFields(fields) {
    var missingFields = [];
    var yearFormatError = [];
    var yearInvalid = [];

    var required = ['type', 'start_year', 'start_month', 'end_year', 'end_month', 'validator'];
    var years = ['start_year', 'end_year'];

    for (var field in fields) {
        if (required.includes(field)) {
            if (fields[field].length == 0) {
                missingFields.push(field);
            }
        }

        if (years.includes(field)) {
            if (isNaN(fields[field]) || fields[field].length != 4) {
                yearFormatError.push(field);
            }
        }
    }


    var err = {};
    if (missingFields.length > 0) {
        err.missingFields = missingFields;
    }
    if (yearFormatError.length > 0) {
        err.yearFormatError = yearFormatError;
    }
    if (Object.keys(err).length == 0){
        var start_year = fields['start_year'];
        var end_year = fields['end_year'];
        var start_month = fields['start_month']
        var end_month = fields['end_month']
        
        if( (start_year > end_year) || (start_month > end_month && start_year == end_year)){
            yearInvalid.push('start_year', 'start_month', 'end_year', 'end_month');
            err.yearInvalid = yearInvalid;
        }
    }
    return Object.keys(err).length > 0 ? err : null;
}


module.exports = { 
    validateFields: validateFields,
    VALIDATION_ERROR_CODE: 422 
};