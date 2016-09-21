$(document).ready(function(){	
	
	if ($('.tab_page_outer').length === 1) {
		// we have tab, which means list view/edit.
		// find find find find find IDIDID
		var list_id = $('.tab_page_outer').find('input[name="list_id"]').val();
	}
		
	var initCandidateData = function() {
		
		$(pp.api('lists/' + list_id + '/candidates?full_ids=true').candidates).each(function(k, v){
			
			$.ajax({
				url: '/pp/ajax/jobsectors_functions.php',
				data: {
					id:v.candidate_id,
					num: 9
				},
				dataType: 'json',
				type: 'post',
				
				success: function(data) {
					$('#tbl_lists_candidates').dataTable().fnAddData([v.priority, v.name + ' ' + v.surname, 
					                                                  data['JobSector'], v.id ]);
				},
				
				error: function(e, r, r) {
					console.log(arguments);
				}
			});
			
			return true;
			
		});
		
		
	};
	
	$('#tbl_lists_candidates').dataTable({
		"oLanguage": {
			"sInfo": "_TOTAL_ Total Candidates (Listing _START_ to _END_)"
		},
		"aaSorting": [[ 0, "desc" ]],
		
		"fnInitComplete" : function(){
			initCandidateData();
		},
		
		"aoColumns": [
		  			
		  	{ 
		  		"sTitle": "Priority",
		  		"sWidth":"10%"
		  	},
		  	
			{ 
				"sTitle": "Candidate",
				"sWidth":"40%"
			},
		  	
			{ 
				"sTitle": "Job Sectors / Functions",
				"sWidth":"30%"
			},
			
			
			{
				"sTitle": "Actions",
				"sClass": "center",
				"mRender": function ( data, type, full ) {
                    return '[ <a href="#" data-lid="' + list_id + '" data-cid="' + data + '">Preview</a> ]';
                },
				// "fnRender": function(obj) {
				// 	var sReturn = obj.aData[ obj.iDataColumn ].toString();
				// 	console.log(sReturn);
				// 	sReturn = '[ <a href="#" data-lid="' + list_id + '" data-cid="' + sReturn + '">Preview</a> ]';
				// 	return sReturn;
				// },
				"bSortable": false,				
				"sWidth": "20%"
			}
		]
	});	
	
	$('input[value="Back"]').click(function(){
		window.location = 'lists_list.php';
		return false;
	});
	
	$('input[value="Update"]').click(function(){
		window.location = 'lists_update.php' + window.location.search.split('&')[0] + '&requested_tab=' + $('input[name="requested_tab"]').val();
		return false;
	});
	
	$('input[value="Delete"]').click(function(){
		var con = confirm('Are you sure?');
		
		if (con !== false) {
			return true;
		}
		
		return false;
	});
});