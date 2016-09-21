function resultsPager(node)
{
	var selector = undefined;

	this.Construct = function(node)
	{
		selector = node.find('select[name="page"]').first();
		selector.change(this.onChange);

		callback = this.onClick;	// Define the callback as a variable in
									// Construct function's scope so it can be
									// found inside the .each() fucntion.

		pagerbuttons = node.find('input.pagerbuttons');
		pagerbuttons.each(function() {$(this).click(callback);});
	},

	this.onChange = function()
	{
		$(this).parents('form').first().submit();
	},

	this.onClick = function()
	{
		switch ($(this).val())
		{
			case 'Next >':
				selector.val(parseInt(selector.val()) + 1);
				break;

			case '< Prev':
				selector.val(parseInt(selector.val()) - 1);
				break;

			case 'Last >>':
				selector.val(parseInt(selector.find('option:last-child').last().val()));
				break;

			default:
				selector.val(0);
		}
	},

	this.Construct(node);
};

$(document).ready(function()
{
	$('.pager_buttons').each(function() {resultsPager($(this));});
});