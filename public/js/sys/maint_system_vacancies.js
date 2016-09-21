;!(function($)
{
    var system_id = window.location.search.replace(/\?system=(.*).*?/, '$1');

    var bindTokenInput = function()
    {
        $('.vacancy-search').tokenInput(
            '/sys/ajax/search_vacancy.php?system=' + system_id, 
            {
                theme: 'facebook',
                hintText: 'Vacancy Reference',
                minChars: 3,
                tokenLimit: 1,
                method: 'GET',
                queryParam: 'vacancy_id',
                placeholder: 'Vacancy reference...',
                
                tokenFormatter: function(item)
                {
                    return '<li>' + item.id + '</li>'
                },
                
                resultsFormatter: function(item)
                {
                    // fn undefined at parse time, defined at run-time.
                    $('.vacancy-search-confirm').removeAttr('disabled').click(preliminaryCheck);
                    
                    return (
                        '<li>\
                            <div style="display: inline-block;">\
                                <div>' + item.id + '</div>\
                                <div style="color:orange; font-weight: bold;">' + item.name + '</div>\
                            </div>\
                        </li>'
                    );
                }
            }
        );
    };
    
    var preliminaryCheck = function(e)
    {
        var vacancy_reference = $('.vacancy-search').val();
        var confirmDeletion = function()
        {
            return confirm('You are about to delete ' + vacancy_reference + ',' + "\n" + 
                            'Do you want to continue?');
        };
        
        if (vacancy_reference.length === 0) {
            return false;
        } else if (!confirmDeletion()) {
            return false;
        }

        var data = {
            vacancy_id: vacancy_reference,
            system: system_id
        };
        
        var dialog = function()
        {
            $('<div />', { title: 'Remove Vacancy: ' + vacancy_reference })
                        .html('Loading...')
                        .addClass('vacancy-deletion-dialog')
                        .appendTo('body')
                        .dialog({ width: 600 });
            return $('.vacancy-deletion-dialog');
        }();
        
        dialog.html('Deletion in progress...<br>Please wait.');
        
        $.ajax({
            type: 'POST',
            url: '/sys/ajax/delete_vacancy.php',
            data: data,
            dataType: 'json',
            
            success: function(res)
            {
                if (res.status == 0) {
                    // why on earth would you send a 20x for a failure????
                    dialog.html('Something successfully went wrong.');
                    return false;
                }
                
                dialog.html(
                    '<strong>Vacancy successfully removed!</strong><br>\
                     <br>\
                     Summary of changes:<br>'                    
                     + ('<ul>' + res.message.replace(/\-\ (.*)\n/g, '<li>$1</li>') + '</ul>').replace(/\n/g, '<br>')
                );
            },
            
            complete: function()
            {
                setTimeout(function()
                {
//                    dialog.dialog('close');
                }, 1500);
            }
        });
        
        // Prevent the browser to follow the link
        e.preventDefault();
        e.stopPropegation();
        
        return false;
    };
    
    $(document).ready(bindTokenInput);
})(jQuery);