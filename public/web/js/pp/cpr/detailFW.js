$(document).ready(function()
{
	// Open up an Ajax window with loaded content
	$(function()
	{
		$('a.ajax').click(function()
		{
			var url = this.href;
			var dialog = $('<div style="display:none" title="' + this.title + '"></div>').appendTo('body');
			var $this = $(this);
			var opts = { position: 'left' };

			$this.spinner(opts);

			// load remote content
			dialog.load(
				url,
				{},

				function (responseText, textStatus, XMLHttpRequest)
				{
					dialog.dialog({
						autoOpen: true,
						show: "blind",
						hide: "blind",
						height: 'auto',
						width: 'auto'
					});

					$this.spinner('remove');
				}
			);

			// Prevent the browser to follow the link
			return false;
		});
	});

    $(".view_branch_details a").click(function(e)
    {
        e.preventDefault();
        e.stopPropagation();

        $(this).parent().prepend($('<span class="loader"><img src="/img/ui/load.gif" style="height: 10px; padding-right: 5px; vertical-align: middle;" /></span>'));

		$.ajax({
			dataType: 'json',
			cache: true,
			url: e.currentTarget.href,
			success: exceptionCheck,
			error: requestFailed
		});

        return false;		
    });

    var exceptionCheck = function(data) {  
    	$('.list_inner').find('.loader').remove();
    	if (data != "exception" && data != "") {
    		showDetails(data);
    	} else {
    		requestFailed("Processing Error", "There was an error processing your request");
    	}
    }

	var showDetails = function(data) {    
		var dialogv = $('<div />', { title: data.BranchName, 'class' : 'branchPreviewDialog' });
		var tableContent = '<table class="branch_preview_table">';
			tableContent += '<tr>';
			tableContent += '<td>Branch Name</td>';
			tableContent += '<td>' + data.BranchName + '</td>';
			tableContent += '</tr>';
			tableContent += '<tr>';
			tableContent += '<td>Telephone</td>';
			tableContent += '<td>' + data.Telephone + '</td>';
			tableContent += '</tr>';
			tableContent += '<tr>';
			tableContent += '<td>Fax</td>';
			tableContent += '<td>' + data.Fax + '</td>';
			tableContent += '</tr>';	
			tableContent += '<tr>';
			tableContent += '<td>Email</td>';
			tableContent += '<td><a href="mailto:' + data.email + '">' + data.Email + '</a><br /><br /></td>';
			tableContent += '</tr>';						
			tableContent += '<tr>';
			tableContent += '<td>Postal Address</td>';
			tableContent += '<td>' + data.Address2 + '<br /><br /></td>';
			tableContent += '</tr>';	
			tableContent += '<tr>';
			tableContent += '<td>Physical Address</td>';
			tableContent += '<td>' + data.Address1 + '<br /><br /></td>';
			tableContent += '</tr>';
			tableContent += '<tr>';
			tableContent += '<td>Directions</td>';
			tableContent += '<td>' + data.Directions + '<br /><br /></td>';
			tableContent += '</tr>';					
			tableContent += '</table>';

		dialogv.append(tableContent);

		dialogv.dialog({ modal: false, width: 400 });
		return false;		
	}

	var requestFailed = function(title, message){
		$('.list_inner').find('.loader').remove();
	    var dialogv = $('<div style="display: none" title="' + title + '"><img src="/img/icons/stop32.png" style="float: left; margin-right :10px;" />' + message + '</div>');
	    dialogv.dialog({
	                    modal : true,
	                    autoOpen: true,
	                    height: "150",
	                    width: "450",
	                    closeOnEscape: true,
	                    draggable: false,
	                    resizable: false,
	                    buttons: [ { text: "Ok", click: function() { $( this ).dialog( "close" ); } } ]
	    });	
	};	
});