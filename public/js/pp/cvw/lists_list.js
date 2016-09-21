$(document).ready(function(){
	
	var initListsData = function() {
		var data = pp.api('hotlists');

		$(data.lists).each(function(k, v){
			
			var fields = '';
			var o=v;
			
			$(v.fields).each(function(k, v){
				fields += v.replace('_', ' ').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
			        return $1.toUpperCase();
			    });
				
				if (k % 3 === 0 && k !== 0) {
					fields += '<br />';
				} else if(o.fields[k+1]) {
					fields += ', ';
				}
			});
			
			$('#tbl_lists').dataTable().fnAddData([v.title + ' <span>(' + v.alias + ')</span>', v.candidates, fields, v.id ]);
		});
		
		// filter
		
		$('table#lists_filter').find('input[value="Apply"]').click(function(){
			// there are three possible fields.
			// both title and alias exist in the same column.
			
			var $title 	= $('table#lists_filter').find('input[name="title"]'),
				$alias 	= $('table#lists_filter').find('input[name="alias"]'),
				$fields	= $('table#lists_filter').find('select[name="fields"]');
			
			
			if ($title.val().length > 0) {
				$('#tbl_lists').dataTable().fnFilter( $title.val(), 0);
			}
			
			if ($alias.val().length > 0) {
				$('#tbl_lists').dataTable().fnFilter( $title.val(), 0);
			}
			
			if ($fields.find(':selected').length > 0) {
				// ok, do some traversing through selected options
				$fields.find(':selected').each(function(k, v){
					$('#tbl_lists').dataTable().fnFilter( $(this).text(), 2);
				});
			}
			
		});
		
		$('table#lists_filter').find('input[value="Default"]').click(function(){
			$('#tbl_lists').dataTable().fnFilter('', 0);
			$('#tbl_lists').dataTable().fnFilter('', 1);
			$('#tbl_lists').dataTable().fnFilter('', 2);
		});
	};
	
	$('#tbl_lists').dataTable({
		"bProcessing": true,
		"aaData" : [],
		"oLanguage": {
			"sInfo": "_TOTAL_ Total Entries (Listing _START_ to _END_)"
		},
		"fnInitComplete" : function(){
			initListsData();
		},
		"aaSorting": [[ 1, "desc" ]],
		"aoColumns": [
			{ 
				"sTitle": "Title",
				"sWidth":"25%"
			},
			{ 
				"sTitle": "Candidates",
				"sWidth":"10%"
			},	
			{ 
				"sTitle": "Criteria",
				"sWidth":"45%"
			},
			{
				"sTitle": "",
				"sClass": "center",
				"mRender": function ( data, type, full ) {
                    return '[ <a href="./lists_update.php?list_id=' + data + '">Update</a> ]';
                },
				// "fnRender": function(obj) {
				// 	var sReturn = obj.aData[ obj.iDataColumn ].toString();
				// 	sReturn = '[ <a href="./lists_update.php?list_id=' + sReturn + '">Update</a> ]';
				// 	return sReturn;
				// },
				"bSortable": false,				
				"sWidth": "10%"
			}
		],
		"fnDrawCallback": function( oSettings ) {
			$('.dataTables_wrapper').find('.header').find('.actions').html($('<a />', { href: '#' }).html('Create a new list'));
	    }
	});	
});