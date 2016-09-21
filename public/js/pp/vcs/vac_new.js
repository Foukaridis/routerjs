/**
 * Company contact on Vacancy New page
 * This script allows the user to select an additional contact for
 * a company on the vac_new page. It does this through the use of 
 * an Ajax request that fetches the contacts for the company, and
 * then lists them within a dropdown.
 * 
 * @author Ferdi Schmidt <ferdi@parallel.co.za>
 * @copyright Parallel Software (Pty) Ltd, 2013.
 */

$(document).ready(function(){

    $('#alpha').change(function(ev){
        // due to external factors, the below does not happen.
        // we'll have to trigger this onChange event manually
        $('#compid').trigger('change');
    });
    
    $('#compid').change(function(ev){

        // if the main company selector only has one entry, select it by default
        if ($('#compid').find('option').length == 1) {
            $('#compid').find('option:first').attr('selected', 'selected');
        }
        
        // prepare the tertiary dropdown, 
        $('#contact').find('option').remove().attr('disabled', 'disabled').trigger('change');
        
        // fidn hte selected option element and built an object
        // containing all the information the server needs to 
        // make a decision as to what to retrieve for us.
        var selectedElm = $(this).find(':selected'),
            prop = {
            id: selectedElm.val(),
            title: selectedElm.text()
        };
        
        // NOTE! This ajax call is not asynchronous(blocking), since we do not
        // want requests flying around for no use.
        $.ajax({
            async: false, // blocking
            cache: true, // irrelevant, but useful
            url: '/pp/ajax/vcs/vac_new_contacts.php',
            dataType: 'json',
            type: 'post', 
            data: prop, 
            success: function(data, xhr) {

                if (data.length == 0) {
                    // there are no contact listed for this company,
                    // but instead of failing, provide a quick route 
                    // for them o add one.
                    // Scrap that idea - #1195. 
                    
                    return false;
                }
                
                // popualte the contacts into the selector
                $.each(data, function(k,v) {
                    $('#contact').append(
                        $('<option />', { value: v.id }).text(v.name)
                    );
                });
                
                // for convience, select the firest option by default
                $('#contact').find('option:first').attr('selected', 'selected');
                
                // finally, trigger an onChange event
                $('#contact').trigger('change');
            },
            
            error: function(e,r,r) {
                // display a nice error message, and stop gracefully.
                $('<div />', { title: 'Oops!'}).text('Something went wrong... please try again.').dialog();
                return false;
            }
        });
        
        $('#contact').removeAttr('disabled');

        // there's nothng left that still needsto happen, so stop 
        // the JS event loop from bubling up to parents and wasting 
        // precious time and resources
        ev.preventDefault();
        return false;
    });

    // there's one finaly state which needs to be taken care of: initial
    // simply trigger a premature onChange event on the company selector
    $('#compid').trigger('change');
    
});