function filterList(node) {
	this.Construct = function(node)
	{
		this.container = $("<form>").attr({"class":"filter-form","action":"#"});
		node.before(this.container);

	    input = $("<input>").attr({"class":"filterinput","type":"text"});
	    $(input).change(this.onChange).keyup(function () {
	        // fire the above change event after every letter
	        $(this).change();
	    });

	    this.container.append(input);
	    this.container.append(node);
	},

	this.onChange = function()
	{
		var filter = $(this).val(); // get the value of the input, which we filter on
		list = $(this).next();

		if (filter) {
		    $(list).find(":not(:contains(" + filter + "))").closest('li').slideUp();
		    $(list).find(":contains(" + filter + ")").closest('li').slideDown();
		}  else {
           $(list).find("li").slideDown();
	    }

	},

	this.Construct(node);
};