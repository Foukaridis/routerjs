$(document).ready(function() {

	// define object
	var upObj = {};

	// This event handler counts up the total number of users within
	// the sorted table, NOT rows.
	// @param object 	e 	event object
	// @param object 	v 	DOM object of the sorted table
	$(upObj).bind('update_totals', function(e,v){
		// define int for sum
		var sum = 0;

		// count the specific cloumns
		$(v).find('tr:not(.searchhide)').find('.ajax').each(function(k, v){
			sum += ($(v).text() * 1);
			return true; // continue;
		});

		// asign new total
		$('#headerTotalUsers').html(sum);
	});

	// Call advancedtable plugin
	$("#companyListResults").advancedtable({
		searchField: "#search",
		loadElement: "#loader",
		searchCaseSensitive: false,
		sorting: true,
		ascImage: "/img/up.png",
		descImage: "/img/down.png",
		rowsPerPage: 300,
		customEvent: {
			object: upObj,
			event: 'update_totals'
		}
	});

	//Set Focus to #Name Attributes
	// *cough*, #search.
	$("#search").focus();

	// minimize / expand buttons for .list_outer
	// firstly, calculate x/y
	var form = $('.list_outer').find('tr:first').find('td:last');

	// create a cache variable for the form
	var form_cache = false;

	// create a div to sotre buttons in, and add to DOM
	$('<div />', {id: 'expand_buttons'}).css({cursor: 'pointer'}).appendTo('body');

	buttons_html = '                                                   \
		<img src="./images/button-expand.png" id="btn-form-max" />   \
		<img src="./images/button-minimize.png" id="btn-form-min" /> \
	';
	// I like chain.s
	$('#expand_buttons').hide().html(buttons_html).find('#btn-form-max').hide().parent();
	$('#expand_buttons').css({
		width: '25px',
		height: '25px',
		position: 'absolute',
		top: (form.position().top + form.height()+5) + 'px',
		left: (form.position().left + form.width()-12) + 'px'
	});

	// hack pass webkit
	if (!$.browser.safari) {
		$('#expand_buttons').css({
		width: '25px',
		 height: '25px',
		   position: 'absolute',
			top: (form.position().top + form.height()-11) + 'px',
		  left: (form.position().left + form.width()-12) + 'px'
		});
	}

	// gently fade in the min/max buttons
	$('#expand_buttons').fadeIn();

	// set click handler for minimize button
	$('#btn-form-min').click(function(){
		$(this).hide();
		$('#btn-form-max').show();
		form_cache = $('.list_outer').html();
		$('.list_outer').html('<tr><td>Please click the maximize button to expand the default form.</td></tr>');

		$('.list_outer').find('td').css({height: '18px', color: '#000'});
	});

	// set click handler for maximize button
	$('#btn-form-max').click(function() {
		$(this).hide();
		$('#btn-form-min').show();
		$('.list_outer').html(form_cache);
	});

	// hide the form by default
	$('#btn-form-min').trigger('click');

	// users popup
	$('.ajax').click(function(){
		var p = $(this).parent();
		var txtKnownAs = p.find('.txt_name').attr('title').split(':')[1];
		var txtKnownAs = txtKnownAs.substring(1, txtKnownAs.length);

        var system_id = p.find('.ajax').attr('system_id');
		var txtDatabase = p.find('.cl_status').attr('title');

		var human_company = txtKnownAs + ((txtKnownAs.substring(txtKnownAs.length -1, txtKnownAs.length) == 's') ? '' : '\'s');
//		console.log(txtKnownAs.substring(txtKnownAs.length -1, txtKnownAs.length));
		var cur_xhr_uri = 'ajax/get_system_user_details.php?system=' + system_id + '&cdb=' + txtDatabase;

        var dialog = $('<div style="display: none" title="' + human_company + ' Users' + '"><img src="/img/pp_wait.gif" /><p style="float: right; padding-left: 1em;" >Loading. Please wait.</p></div>');

        dialog.dialog({
            autoOpen: true,
            show: "blind",
            hide: "blind",
            resizable: true,
            height: "auto",
            width: "auto"
        });

        // load remote content
        dialog.load(cur_xhr_uri);

        // Prevent the browser to follow the link
        return false;

	});
});
