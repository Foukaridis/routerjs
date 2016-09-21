$(document).ready(function(ev)
{
   $('input[type="button"][name="ctrl"]:not([disabled]):not([data-check-type])').click(function(ev)
   {
      if ($(this).data('document')) {
          return window.open($(this).data('document'));
      } else if ($(this).data('id')) {
          document.location = document.location + '&request=' + $(this).data('id');
          return;
      }
   });
   
   $('input[type="button"][data-check-type]').click(function(e)
   {
       var check_type = $(this).data('check-type');
       $('#request_type').val(check_type);
       
       var confirmChecks = {
           '16' : verifyExperianTerms,
           '8': verifyTransunionTerms
       };
       
       var performSubmit = function()
       {
           $('form#Candidate').submit();
       };
       
       if (confirmChecks.hasOwnProperty(check_type)) {
           confirmChecks[check_type](performSubmit);
           return;
       }
       
       performSubmit();
       
   });
});

var verifyTransunionTerms = function(cb)
{
    var text = '<p>You are about to perform an TransUnion Credit Check.</p><br>';
    text += '<p>By performing this check, you confirm your acceptable of TransUnion Credit Bureau\'s Terms of Use.<br>';
    text += 'A copy of their Terms of Use is available here: <strong><a target="_blank" href="/pp/cvw/docs/Tranunion-TermsofUse.pdf">TransUnion Credit Bureau Terms of Use</a></strong>.</p>';
        
    $('<div />', { html: text, title: 'TransUnion - Terms of Use' }).dialog({
        width: 600,
        buttons: {
            'Cancel' : function()
            {
                $(this).dialog('destroy');
            }, 
            
            'Continue': function()
            {
                $(this).dialog('destroy');
                cb()
            }
        }
    });
};

var verifyExperianTerms = function(cb)
{
    var text = '<p>You are about to perform an Experian Credit Check.</p><br>';
    text += '<p>By performing this check, you confirm your acceptable of Experian\'s Terms of Use.<br>';
    text += 'A copy of their Terms of Use is available here: <strong><a target="_blank" href="/pp/cvw/docs/Experian-TermsandConditions.pdf">Experian Terms of Use</a></strong>.</p>';
        
    $('<div />', { html: text, title: 'Experian - Terms of Use' }).dialog({
        width: 600,
        buttons: {
            'Cancel' : function()
            {
                $(this).dialog('destroy');
            }, 
            
            'Continue': function()
            {
                $(this).dialog('destroy');
                cb()
            }
        }
    });
};