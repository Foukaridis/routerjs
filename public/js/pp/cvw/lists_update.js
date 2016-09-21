$(document).ready(function(){    
    
    if ($('.tab_page_outer').length === 1) {
        var list_id = $('.tab_page_outer').find('input[name="list_id"]').val();
    }
        
    var initCandidateData = function() {
        pp.api.request(
            'hotlists/' + list_id + '/candidates',
            function(data)
            {
                $(data.candidates).each(function(k, v){
                    var jobSectors = '';
                    
                    $.each(v.job_sectors, function(k, v){
                        jobSectors += '<strong>' + v.sector + '</strong><br />';
                        
                        $.each(v.functions, function(k, v){
                            jobSectors += v + '<br />';
                        });
                    });
                    
                    $('#tbl_lists_candidates').dataTable().fnAddData([v.priority, v.name + ' ' + v.surname, jobSectors, v.id ]);
                });  
                
                bindEvents();
            }
        );
    };
    /*
     *      THIS HAS BEEN COMMENTED OUT DUE TO IT FAILING WITH NEWER dataTables
     */
    // jQuery.extend( jQuery.fn.dataTableExt.oSort, {
    //     "alt-input-pre": function ( a ) {
    //         var a = a.split('value="')[1].split('"')[0];
    //         return a;
    //     },
        
    //     "alt-input-asc": function( a, b ) {
    //         return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    //     },
    
    //     "alt-input-desc": function(a,b) {
    //         return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    //     }
    // } );
    
    var oTable = $('#tbl_lists_candidates').dataTable({
        "oLanguage": {
            "sInfo": "_TOTAL_ Total Candidates (Listing _START_ to _END_)"
        },
        
        "fnInitComplete" : function(){
            initCandidateData();
        },
        "pagingType": "full_numbers",
        "dom": '<"top"i<"clear">>rt<"bottom"p<"clear">>',
        "aoColumns": [       
            { 
                "sTitle": "Order",
                "sWidth":"10%",
                "mRender": function ( data, type, full ) {
                    return '<input type="text" name="priority|' + full[3] + '" style="width:2em;text-align:center" value="' + data + '" />';
                },
                'sType': 'alt-input',
                "sSortDataType": "alt",
                "bSortable": false
            },
            { 
                "sTitle": "Candidate",
                "sWidth":"30%",
                "mRender": function ( data, type, full ) {
                    return full[1];
                },
                "bSortable": false
            },      
            {
                "sTitle": "Job Sectors / Functions",
                "mRender": function ( data, type, full ) {
                    return data;
                },
                "bSortable": false,                
                "sWidth": "30%"
            },
            {
                "sTitle": "Actions",
                "sClass": "center",
                "mRender": function ( data, type, full ) {
                    return '<a href="#" data-lid="' + list_id + '" data-cid="' + data + '" class="preview button">Preview</a> <a href="#" data-lid="' + list_id + '" data-cid="' + data + '" class="view button">View Candidate</a> <a href="#" data-cnm="' + full[1] + '" data-lid="' + list_id + '" data-cid="' + data + '" class="delete button">Remove</a>';
                },
                "bSortable": false,                
                "sWidth": "30%"
            }
        ]
    });     
    
    var bindEvents = function()
    {
        $('#tbl_lists_candidates').find('img[src*="up"]').parents('tr').find('.even, .odd').hover(function(){
            $(this).find('img').css({ opacity: 1 });
        }, function(){
            $(this).find('img').css({ opacity: 0.5 });
        });
        
        $('input[value="Cancel"]').click(function(){
            window.location = 'lists_detail.php' + window.location.search.split('&')[0] + '&requested_tab=' + $('input[name="requested_tab"]').val();
            return false;
        });
        
        $('input[value="Select From Candidate Database"]').click(function(){
            window.location = 'candidate_search.php?Vacancy_ID=lists&list_id=' + list_id;
            return false;
        });
        
        $('#tbl_lists_candidates').on('click', 'a.delete', function() {
            var candName = $(this).data('cnm');
            if (confirm('Are you sure you want to delete ' + candName + ' from this list?') == false) {
                return false;
            }
            var row = $(this).closest('tr');
            $.ajax({
                url: '/pp/ajax/cvw/lists_interface.php',
                type: 'post',
                data: {
                    method                : 'delete_list_candidate',
                    list_id                : $(this).data('lid'),
                    list_candidate_id    : $(this).data('cid'),
                    list_cand_name      : $(this).data('cnm')
                },

                success: function(){
                    oTable.fnDeleteRow(row, function() {
                        $('#mainContainer').append('<div id="alert">' + candName + ' has been removed.</div>');
                        $('#alert').fadeOut();
                        oTable.fnDraw(false);
                    }, false);
                }
            });
        });
        
        $('#tbl_lists_candidates').on('click', 'a.view', function() {
            $.ajax({
                url: '/pp/ajax/cvw/lists_interface.php',
                type: 'post',
                dataType: 'json',
                data: {
                    method                : 'get_candidate_id',
                    list_id                : $(this).data('lid'),
                    list_candidate_id    : $(this).data('cid')                
                }, 
                
                success: function(data) {
                    window.location = 'candidate_detail.php?ID=' + data.id;
                    return true;
                }
            });
        });
        
        $('#tbl_lists_candidates').on('click', 'a.preview', function(){
            open('//' + document.location.host + '/wi/hotlist/#!/' + $('#system_title').val() + '/' + $('#list_alias').val() + '/' + $(this).data('cid'));
        });

    };
    
    $('input[name="title"]').keyup(function(){
        $('input[name="alias"]').val($(this).val().replace(/ /g, '-').toLowerCase());
        return true;
    });
    
    $('input[name="alias"]').keyup(function(){
        $(this).val($(this).val().replace(/ /g, '-'));
        return true;
    });

    
    $('input[value="Back"]').click(function(){
        window.location = 'lists_list.php';
        return false;
    });
    
});
