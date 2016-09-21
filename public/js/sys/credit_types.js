/**
 * Credit Types
 * 
 * @author Ferdi Schmdit <ferdi@parallel.co.za>
 * @copyright Parallel Software (Pty) Ltd, 2013.
 */
jQuery(document).ready(function()
{
    // localise scope
    (function(cx)
    {
        // event handler for "Add new"
        cx.find('input.add-new').click(function(ev)
        {
            // navigate away
            window.location.search = '?create';
            
            return false;
        });
        
        // event handler for all "Update" anchors
        cx.find('a.edit').click(function(ev)
        {
            // navigate away
            window.location.search = '?edit=' + $(this).data('id');
            
            return false;
        });
        
        // event handler for all "Update" anchors
        cx.find('a.del').click(function(ev)
        {
            if (confirm('Are you sure?')) {
                // navigate away
                window.location.search = '?del=' + $(this).data('id');
            }
            
            return false;
        });
        
        cx.find('input.cancel').click(function(ev)
        {
            // remove any query properties
            window.location.search = "";
            
            
            return false;
        });
    })(jQuery('.credit-container'));
});