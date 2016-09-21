function checkDuplicates()
{
    link = '/pp/ajax/cvw/check_duplicates.php?' + $.param({name: document.Candidate.KnownAs.value, surname: document.Candidate.Surname.value, IDNumber: document.Candidate.IDNumber.value, ID: document.Candidate.ID.value});

    $.ajax({
        url: link,    // Make an AJAX request to get duplicate data

        success: function(ajaxReturn)
        {
            var dialog_title = undefined;    // The title of the dialog that's spawned.
            var buttons = '';                // If we have a dialog it's going to need buttons.
            var hits = [];                    // An array of all the possible duplictes found.
                                            //
                                            // 0 => The candidate's ID in the database.
                                            // 1 => The machine readable access right that the logged in consultant has to the candidate.

            var reset = [];                    // An array of fields to reset if the dialog is closed without choosing a candidate to edit or view.
            var focus = undefined;            // Focus can be set to this element if the dialog is closed without choosing a candidate to edit or view.

            var pointer = 0;                // This value points to the current 

            result = $.parseJSON(ajaxReturn);

            access = result.access;
            result = result.results;

            if (result.length == 0) {
                return;
            } else if (undefined !== result.duplicates) {
                dialog_title = 'Warning: The entered ID number appears to be that of ' + result.duplicates[0].KnownAs + ' ' + result.duplicates[0].Surname + ', already in the database.';

                for (var i in result.duplicates) {
                    if (result.duplicates[i].Candidate_ID === $.url().param('ID')) {
                        continue;    // This warning is only useful when the match is not the client you're currently editing.
                    }

                    hits[pointer] = [result.duplicates[i].Candidate_ID, result.duplicates[i].Access];
                    buttons += '<input type="radio" id="radio1" name="radio" value="' + pointer + '" /><label for="radio1">Discard changes to this candidate and go to  ' + result.duplicates[0].KnownAs + ' ' + result.duplicates[0].Surname + '\'s details.</label>';
                    pointer++;
                }

                buttons += '<input type="radio" id="radio2" name="radio" checked="checked" /><label for="radio2">Continue with this candidate and change the entered ID number.</label>';

                reset.push($('input#IDNumber'));
                focus = $('input#IDNumber');
            } else if (undefined !== result.possibles) {
                dialog_title = 'Warning: This candidate might already be in the database.';

                for (var i in result.possibles) {
                    if (result.possibles[i].Candidate_ID === $.url().param('ID')) {
                        continue;    // This warning is only useful when the match is not the client you're currently editing.
                    }

                    hits[pointer] = [result.possibles[i].Candidate_ID, result.possibles[i].Access];
                    buttons += '<input type="radio" id="radio' + i + '" name="radio" value="' + pointer + '" /><label for="radio' + i + '">Discard changes to this candidate and go to  ' + result.possibles[i].KnownAs + ' ' + result.possibles[i].Surname + ' (' + result.possibles[i].IDNumber + ')  \'s details.</label>\n';
                    pointer++;
                }

                buttons += '<input type="radio" id="radiox" name="radio" checked="checked" /><label for="radiox">Continue with this candidate.</label>';
            }

            if (hits.length > 0) {
                modal_node = $(
                    '<div />',
                    {
                        html: '\
        <img src="/img/icons/warning32.png" style="float: left; margin-right: 10px; margin-top: 5px" /> \
        <p style="line-height: 37px;">What would you like to do?</p> \
        <form> \
            <div id="radio">' + buttons + '</div> \
        </form>'
                    }
                );

                modal_node.appendTo('body').dialog({
                    buttons: {
                        "Ok": function()
                        {
                            if (modal_node.find('input[name=radio]:checked').val() == 'on') {
                                // The user does not want to load the existing candidate, we should reset the values as needed.

                                for (var i in reset) {
                                    reset[i].val('');
                                }

                                if (undefined !== focus) {
                                    focus.focus();
                                }

                                $(this).remove();
                            } else {
                                if (hits[modal_node.find('input[name=radio]:checked').val()][1] == access.DUPLICATE_ACCESS_UPDATE) {
                                    window.location.replace('/pp/cvw/candidate_update.php?' + $.param({ID: hits[modal_node.find('input[name=radio]:checked').val()][0]}));
                                } else if (hits[modal_node.find('input[name=radio]:checked').val()][1] == access.DUPLICATE_ACCESS_VIEW) {
                                    window.location.replace('/pp/cvw/candidate_detail.php?' + $.param({ID: hits[modal_node.find('input[name=radio]:checked').val()][0]}));
                                } else {
                                    error_dialog = $('\
<div style="text-align: left;"> \
    <img src="/img/icons/block32.png" border="0" align="left" style="padding-right: 10px;" /> \
    <p>It seems that you do not have sufficient privileges to access this candidate.</p> \
    <p>If feel you should have access to this candidate you can contact your admistrative user regarding your access level.</p> \
</div>').appendTo('body');

                                    // load remote content
                                    error_dialog.dialog({
                                        autoOpen: true,
                                        buttons: {
                                            "Ok": function() { $(this).remove(); }
                                        },
                                        draggable: false,
                                        height: 'auto',
                                        hide: "drop",
                                        modal: "true",
                                        resizable: false,
                                        show: "drop",
                                        title: "Access Denied",
                                        width: 'auto'
                                    });
                                }
                            }
                        }
                    },
                    closeOnEscape: false,
                    draggable: false,
                    height: 'auto',
                    modal: true,
                    resizable: false,
                    title: dialog_title,
                    width: 'auto'
                });

                // Start of IE8 bugfix where the first and last items are styled as selected when the dialog is spawned.
                //
                // $.browser is deprecated in jQuery 1.9 in favour of feature detection. Unfortunately we're trying to
                // target a bug in a specific browser not a feature. Thanks jQuery, if you weren't enforcing standards
                // good behaviour who knows what crazy stuff we'd get up to.
                if (undefined == $.browser) {
                    jQuery.browser = {};
                    jQuery.browser.mozilla = /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase());
                    jQuery.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
                    jQuery.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
                    jQuery.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
                }

                if ($.browser.msie) {
                    if (undefined === $.browser.version || parseInt($.browser.version.substring(0, $.browser.version.indexOf('.'))) < 10 ) {
                        modal_node.find('div#radio input[name="radio"]').last().focus();
                    };
                }
                // End of IE8 bugfix where the first and last items are styled as selected when the dialog is spawned.

                modal_node.parent().find('.ui-dialog-titlebar-close').hide(); // JQuery doesn't have an option to remove their silly titlebar close button.
                modal_node.find("#radio").buttonset();
            }
        },

        async: false,    // This is important to prevent the graph from rendering before data has been fetched
        cache: false
    });
};

/**
 * Checks whether user is ZA citizen, or resident, and
 * change the select box to "No" if not.
 * @param e Event
 * @returns undefined
 */
function checkNonZAResidency(e)
{
    var el = $(e.target), val = el.val();
    
    console.log(val.length, parseInt(val.charAt(10), 10));
    // if 0000000000100
    //              ^---- this one...
    // is 1.
    if (val.length === 13 && parseInt(val.charAt(10), 10) === 1) {        
        // show a message explaining that they're not a resident
        $('<div />', { title: 'Non-South-Afircan Resident detected!'})
            .html('Please take note that the ID Number provided for the ' +
                  'candidate indicates that they are not a South African' +
                  ' resident.')
            .appendTo('body')
            .dialog({
                buttons: {
                    'Ok' : function() 
                    {
                        $(this).dialog('destroy');
                    }
                }
            });
    }
};

function enableDisableButton()
{
    document.Candidate.RefNoButton.disabled = document.Candidate.EmployeeNumber.value != '';
};

$(document).ready(function()
{
    var $alternative_upload = $('<div class="uploader focus alternative" id="uniform-avatar">' +
                            '<span class="filename"></span>' + 
                            '<span class="action">Replace</span>' +
                            '</div>' +
                            '<a href="' + document.location + '&remove_avatar=1" class="button bad" style="font-weight:bold;float: right;margin-top:-25px;margin-right:2px;padding: 5px 3px">Remove</a>');
    
    if ($('#avatar_upload_box').attr('data-filename').length > 0) {
        $alternative_upload.find('.filename').text($('#avatar_upload_box').data('filename'));

        $alternative_upload.find('.action').click(function()
        {
            $('#avatar_upload_box').find('div.alternative').hide();
            $('#avatar_upload_box').find('div.main').show();
        });
        
        $('#avatar_upload_box').find('.uploader').addClass('main').hide();
        $('#avatar_upload_box').append($alternative_upload);
    }

    // Let's bind some events.
    $.getScript('/js/lib/purl/purl.js', function() // We need purl.js for this.
    {
        // Let's bind some events.
        $('input#Surname').change(checkDuplicates);
        $('input#KnownAs').change(checkDuplicates);
        
        // make use of event bubling to detect non-ZA id numbers
        $('input#IDNumber').change(checkNonZAResidency);
        $('input#IDNumber').change(checkDuplicates);
    });
});