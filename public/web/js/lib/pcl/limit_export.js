/**
 * If the result set is greater than limit records too much memory would be
 * consumed to generate the document. Prompt the user with a dialog box and
 * disable the functionality.
 */
function limitExport(node, limit)
{
	if (limit === undefined) {
		limit = 2000;
	}

	var resultsFound = node.closest('table[data-row-total]').attr('data-row-total');

	if(resultsFound > limit) {
		node.click(function(event)
		{
			event.preventDefault();	// Prevent the link from opening up
			var title = this.title;
			var dialog = $("" +
"<div style='text-align: left;' title='" + title + "'>" +
	"<img src='/img/Actions-window-close-icon.png' border='0' align='left' style='padding-right: 10px;' />" +
	"<p>It seems that the result-set you are trying to download is larger than " + limit + " records. Please refine your search and try again.</p>" +
"</div>").appendTo('body');

			// load remote content
			dialog.dialog({
				autoOpen: true,
				show: "drop",
				hide: "drop",
				width: 'auto',
				minHeight: 'auto'
			});

			return false;
		});
	}
};