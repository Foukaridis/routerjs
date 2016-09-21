$(document).ready(function(){
	$('#active_sessions').dataTable({
			"bProcessing": true,
				"aaData" : [],
				"oLanguage": {
					"sInfo": "_TOTAL_ Total Entries (Listing _START_ to _END_)"
				},


				"aaSorting": [[ 2, "desc" ]],

				"aoColumns": [
					{
						"sTitle": "System",
						"sWidth":"20%"
					},

					{
						"sTitle": "Token",
						"sWidth":"30%"
					},

					{
						"sTitle": "Last Access",
						"sWidth":"15%"
					},

					{
						"sTitle": "Expires",
						"sWidth":"15%"
					},

					{
						"sTitle": "Actions",
						"sClass": "center",
						"mRender": function ( data, type, full ) {
							var sReturn = data;
							sReturn = '[ <a href="#" class="inspect" data-id="' + sReturn + '">Inspect</a> ]  [ <a href="#" class="kick" data-id="' + sReturn + '">Kick</a> ]';
                    		return sReturn;
                		},
						// "fnRender": function(obj) {
						// 	var sReturn = obj.aData[ obj.iDataColumn ].toString();
						// 	sReturn = '[ <a href="#" class="inspect" data-id="' + sReturn + '">Inspect</a> ]  [ <a href="#" class="kick" data-id="' + sReturn + '">Kick</a> ]';
						// 	return sReturn;
						// },
						"bSortable": false,
						"sWidth": "20%"
					}
				],
				
				"fnDrawCallback": function( oSettings ) {
					$('#active_sessions td a.inspect').unbind('click');
					$('#active_sessions td a.inspect').click(function(){
						var id = $(this).data('id'),
							xhr_ret = false;
						
						$.ajax({
							async: false,
							url: 'ajax/api_active_sessions.php?act=inspect&id=' + id,
							success: function(data) {
								xhr_ret = data;
							}
						});		
						
						$('<div />', { title: 'Inspect ' + id})
							.html(xhr_ret)
							.dialog({
								width: 500,
								height: 350
							});
						
					});

					$('#active_sessions td a.kick').unbind('click');
					$('#active_sessions td a.kick').click(function(){
						var id = $(this).data('id'), $that = $(this);
						
						$.ajax({
							async: false,
							url: 'ajax/api_active_sessions.php?act=kick&id=' + id,
							success: function(data) {
								
								var c = confirm('Are you sure?');
								if (c) $that.parent().parent().remove();
							}
						});		
						
					});
				}
		});
	
	var data = $.parseJSON($('script#activeSessionData').text());
	$(data).each(function(k, v){
		$('#active_sessions').dataTable().fnAddData([v[0], v[1], v[2], v[3], v[4] ]);
	});
	
	
	$('#drop_all_sessions').click(function(){
		var c = confirm("Are you sure you want to drop ALL sessions related to the API?");
		if (c) {
			p = prompt("Re-type \"DROP ALL\" to drop all sessions:");
			if (p == "DROP ALL") {
				alert('I\'m sorry Dave, I can\'t let you do that..' + "\n\n" + 'If you\'re trying to drop the sessions from here you obviously don\'t know what you\'re doing.');
			}
		}
	});
	
	$('table#sessions_filter').find('input:first').keyup(function(){
		var $title 	= $(this);
		$('#active_sessions').dataTable().fnFilter( $title.val(), 0);
		
	});
	
	$('table#sessions_filter').find('input:last').keyup(function(){
		var $title 	= $(this);
		$('#active_sessions').dataTable().fnFilter( $title.val(), 1);
		
	});
	
});