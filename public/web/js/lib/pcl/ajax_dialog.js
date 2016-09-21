function ajaxDialog(e)
{
	var d = $('<div style="display: none" title="' + $(this).attr('title') + '"><img src="/img/pp_wait.gif" /><p style="float: right; padding-left: 1em;" >Loading. Please wait.</p></div>');

	d.dialog({
		autoOpen: true,
		show: "blind",
		hide: "blind",
		width: 'auto',
		height: 'auto',
		resizable: true,
		scrollable: true,
	    position: 'center',
	})
	.load($(this).attr('href'), function() {
    	d.css('max-height', '600px');
    	d.css('max-width', 1024);
    	d.dialog( "option", "position", 'center');
    });
	
	// Prevent the browser to follow the link
	e.stopPropagation();
	e.preventDefault();
	
	return false;
};