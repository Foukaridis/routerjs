/**
 * Reminder Event UI
 */
$(document).ready(function(e)
{
    
    // help dialog
    $('.reminder-events.action')
        .find('.help')
        .click(
            function()
            {
                if ($(this).parent().parent().attr('disabled')) {
                    return;
                }
                
                $('.reminder-events.help-dialog.' + $(this).data('for'))
                    .dialog({
                      buttons: {
                          'Close' : function()
                          {
                              $(this).dialog('destroy');
                          }
                      },
                      
                      width: 464                      
                    });
            }
        )
        
    // input validation
   $('.reminder-events.action')
       .find('td.active input')
       .click(
           function()
           {
               var disabled = ($(this).parent().parent().attr('disabled') != undefined) 
                               ? true  : false;
               
               switch(disabled) {
                   case true:
                       // jQuery has no notion of "remove this attribute".
                       delete $(this).parent().parent()[0].disabled;
                       
                       $(this).parent().parent().removeAttr('disabled');
                       $(this).parent().parent().next('tr').removeAttr('disabled');
                       
                       $(this).parent().parent().find('input[type="number"], select').removeAttr('disabled');
                       $(this).parent().parent().next('tr').find('textarea').removeAttr('disabled');
                       break;
                       
                   case false:
                       $(this).parent().parent().attr('disabled', 'true');
                       $(this).parent().parent().next('tr').attr('disabled', 'true');
                       
                       $(this).parent().parent().find('input[type="number"], select').attr('disabled', true);
                       $(this).parent().parent().next('tr').find('textarea').attr('disabled', true);
               }
           }
       )
       
    // expand slide
    $('.reminder-events.container')
        .find('.expand-button')
        .click(
            function()
            {
                switch($(this).text() == '+') {
                    case true:
                        $(this).text('-');
                        break;
                        
                    case false:
                        $(this).text('+');
                }
                
                $(this).parent().next('.expandable').slideToggle(
                    function()
                    {
                    }
                );
            }
        );
    
    $('.reminder-events.container .expandable').toggle();
});