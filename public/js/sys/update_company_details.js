function showCompanyInfo()
{
    try{
	var numUsers = $($("#companySystem").find("tr")[3]).find("td:first").text();
	var cid = $($("#companySystem").find("tr")[3]).find("td:nth-child(4)").text();
	var cdb = $($("#companySystem").find("tr")[3]).find("td:nth-child(3)").text();

	var system_id = $.url($($("#companySystem").find("tr")[3]).find("td:last").find("a").attr('href')).param('ID');
        if(system_id == undefined){
            var system_id = $.url($($("#companySystem").find("tr")[3]).find("td:last").find("a").attr('href')).param('system');
        }

	var tmpHtml = "<a title='View Users' href='ajax/get_system_user_details.php?system=" + system_id + "'>" + numUsers + "</a>";
	$($("#companySystem tr")[3]).find("td:first").html(tmpHtml);
	$($("#companySystem tr")[3]).find("td:first").find('a').click(ajaxDialog);
	

	var tmpHtmlLinks = "<a title='View Web Links' href='ajax/get_web_links.php?client_id=" + cid + "'>" + cid + "</a>";
	$($("#companySystem tr")[3]).find("td").eq(3).html(tmpHtmlLinks);
	$($("#companySystem tr")[3]).find("td").eq(3).find('a').click(ajaxDialog);

	// Check if you have permission to edit any system, if not add preview link
	var editPerm = $($("#companySystem").find("tr")[3]).find("td").eq(6).text();

	var tmpHtmlLinks = "<a target='_blank' title='Log into database' href='phpadmin/index.php?db=" + cdb + "'>" + cdb + "</a>";
	$($("#companySystem tr")[3]).find("td").eq(2).html(tmpHtmlLinks);

	if (editPerm.length <= 1) {
		var tmpSysLinks = "<a title='View System Information' href='ajax/view_system_details.php?system=" + system_id + "'>[details]</a>";
		$($("#companySystem tr")[3]).find("td").eq(6).html(tmpSysLinks);
		$($("#companySystem tr")[3]).find("td").eq(6).html(tmpSysLinks).find('a').click(ajaxDialog);
	}        
    }catch(err){
        //Do some error handling here
        var txt="";
        txt="There was an error on this page.\n\n";
        txt+="Error description: " + err.message + "\n\n";
        txt+="Click OK to continue.\n\n";
        alert(txt);
    }
}

$(document).ready(function()
{
	$.getScript('/js/lib/purl/purl.js', showCompanyInfo);	// Url parser plugin.
        
        //Open up an Ajax window with loaded content
	$(function()
	{
		$('tr td a[title="Click here to send an email"]').first().click(ajaxDialog);
		$('a.ajax').click(ajaxDialog);
	});

});
