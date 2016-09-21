$(document).ready(function()
{
    var failToErrorDialog = function()
    {
        $('<div />', { title: 'Something went wrong...' })
            .html('Something went wrong while trying to perform this action.<br>Please try again later.')
            .appendTo('body')
            .dialog({
                buttons: {
                    'Ok' : function()
                    {
                        $(this).dialog('destroy');
                    }
                }
            });
    };
    
    var updateExpiryDays = function(event)
    {
        var cx = $('.expiry-container .controls');
        
        $.ajax({
           url: '/pp/ajax/maint/update_password_expiry.php',
           type: 'post',
           datatype: 'json',
           data: {
               days: parseInt(cx.find('input').val(), 10)
           },
           success: function(data)
           {
               if (data !== '"success"') {
                   failToErrorDialog();
                   return;
               }
                   
               $('<div />', { title: 'Password Expiry Modified'})
                   .html('The number of days that consultants will need to change their password after have been updated successfully.')
                   .appendTo('body')
                   .dialog({
                       buttons: {
                           'Ok' : function()
                           {
                               $(this).dialog('destroy');
                           }
                       }
                   });
           },
           
           error: failToErrorDialog
        });
    };
    
    $('.expiry-container .controls').find('button').bind('click', updateExpiryDays);  
    
    var passwordExpiryUpdate = function()
    {
        var cx = $('.expiry-container .controls');
        cx.find('input').keyup(function()
        {
           // strip out invalid characters
           $(this).val($(this).val().replace(/[^\d]/, ''));
           
           if (parseInt($(this).val(), 10) > 999 || parseInt($(this).val(), 10) < 1) {
               $(this).css('border-color', '#cc0000');
               $(this).parent().find('button').animate({ opacity: 0}).prop('disabled', true); 
               return;
           } else {
               $(this).css('border-color', '#B7B7B7');
           }
           
           // bind change event if field's not empty
           if ($(this).val().length !== 0) {  
               $(this).parent().find('button').animate({ opacity: 1}).prop('disabled', false); 
           }
        });
    };
    
    
    $('div#expiry_toggle').buttonset();
    $('div#expiry_toggle input').click(function()
    {
        var enabled = $(this).attr('id') == 'expiry_on';

        if (enabled) {
            $('.expiry-container .controls').slideDown();
            passwordExpiryUpdate();
        } else {
            $('<div />', { title: 'Are you sure?' })
                .html('Are you sure you want to disable password expiry?<br>Note that <u>all</u> consultants will be affected!')
                .appendTo('body')
                .dialog({
                    buttons: {
                        'No' : function()
                        {
                            $('div#expiry_toggle input').prop('checked', false);
                            $('div#expiry_toggle input#expiry_on').click();
                            $(this).dialog('destroy');
                        },
                        'Yes' : function()
                        {
                            var that = this;
                            $.ajax({
                                url: '/pp/ajax/maint/update_password_expiry.php',
                                type: 'post',
                                datatype: 'json',
                                data: {
                                    days: -1
                                },
                                success: function(data)
                                {
                                    console.log(data);
                                    if (data !== '"success"') {
                                        failToErrorDialog();
                                        return;
                                    }

                                    $('.expiry-container .controls').slideUp(); 
                                    $(that).dialog('destroy');
                                },
                                
                                error: failToErrorDialog
                             });
                        }
                    }
                });
        }
    });
    
    $('div#expiry_toggle input#expiry_on[checked]').click();
});