/**
 * If the result set is greater than 2000 records too much memory would be
 * consumed to generate the document. Prompt the user with a dialog box and
 * disable the functionality.
 */
function limitDownloads(event)
{
    var resultsFound = $('tr td span:contains("Total Entr")').text().split(' ')[0];

    if (resultsFound > 2000) {
        event.preventDefault(); // Prevent the link from opening up

        var dialog = $('\
            <div style="text-align: left;"> \
                <img src="/img/icons/stop32.png" border="0" align="left" style="padding-right: 10px;" /> \
                <p>It seems that the result set you are trying to download is larger than 2000 records.</p> \
                <p>Please refine your search and try again.</p> \
            </div>').appendTo('body');

        // load remote content
        dialog.dialog({
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
            title: "Export Restricted",
            width: 'auto'
        });

        return false;
    }
}

$(document).ready(function()
{
    $('a#DownloadVacancies').click(limitDownloads);
    // find all vacancies listed
    $('table#vacancy_list').find('.list_a, .list_b').each(function(k, v, cx)
    {
        var that = $(this).find('td:first');
        
        var vacRef = $(that).text();
        // mock a form post
        var form = $('<form />', 
        {
            method: 'post',
            id:     vacRef,
            action: '/pp/cvw/wi_results.php'
        })
        .css({
            display: 'none'
        })
        .append(
            $('<input />', { type: 'hidden', name: 'rtpg', value: document.location.href })
        )
        .append(
            $('<input />', { type: 'hidden', name: 'cmd', value: 'CRITERIA' })
        )
        .append(
            $('<input />', { type: 'hidden', name: 'SourceDesc', value: vacRef })
        )
        .append(
            $('<input />', { type: 'hidden', name: 'control_buttons', value: 'Search' })
        );        

        $(that).html(form);
        
        $('<a href="#" id="pv_vac_ref" style="color: rgb(38, 68, 137)" title="Find postbox candidates who applied for this vacancy">' + vacRef + '</a>')
            .click(function()
            {
                $(this).parent().find('form').submit();
            })
            .appendTo($(that));
     });
});