function doSearch(cmd)
{
	window.location = '/pp/cpr/searchFW.php?cmd=' + cmd;
}

$(document).ready(function()
{
	// Let's bind some events.
	$('input#Refine').click(function() {doSearch('REFINE');} );
	$('input#New').click(function() {doSearch('RESET');});
});