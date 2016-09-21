/*
 This file contains validations that are too specific to be part of the core
 Please reference the file AFTER the translation file or the rules will be overwritten
 Use at your own risk. We can't provide support for most of the validations
*/
(function($){
	if($.validationEngineLanguage == undefined || $.validationEngineLanguage.allRules == undefined )
		alert("Please include other-validations.js AFTER the translation file");
	else {
		$.validationEngineLanguage.allRules["ajaxCheckAccountNumber"] = {
                    "url": "/sys/ajax/company_account_number_validation.php",
                    // you may want to pass extra data on the ajax call
                    "extraDataDynamic": ['#OrgAccountNumber'],
                    // if you provide an "alertTextOk", it will show as a green prompt when the field validates
                    "alertTextOk": "This account number is available",
                    "alertText": "This account number is already in use. Please try again!",
                    "alertTextLoad": "Validating, please wait..."
        };
	//	# more validations may be added after this point
	}
})(jQuery);
