$(document).ready(function(){
	$('#acl_list').accordion({
        icons: null
    });
	
	$('#acl_list button').click(function(){
		var id = $(this).parent().parent().data('id'),
			title = $(this).parent().parent().data('title');
		
		$.ajax({
			async: false,
			url: 'ajax/api_access_control.php?act=perm_1&id=' + id,
			success: function(data) {
				$('<div />', { title: 'Add permision to ' + title, id: 'add_permission_dlg'}).html(data).dialog({
					width: 350,
					height: 150
				});
				
				$('#add_permission_dlg').find('button').click(function(){
					$.ajax({
						async: false,
						method: 'post',
						data: {
							'id' : id,
							'name' : $('#add_permission_dlg').find('input[name="name"]').val()
						},
						url: 'ajax/api_access_control.php?act=perm_2',
						success: function(data) {
							$('#add_permission_dlg').html(data);
							window.location.reload();
						}
					});
				});
			}
		});
	});
	
	
	$('button#add_resource').click(function(){
		
		$.ajax({
			async: false,
			url: 'ajax/api_access_control.php?act=res_1',
			success: function(data) {
				$('<div />', { title: 'Add resource', id: 'add_res_dlg'}).html(data).dialog({
					width: 350,
					height: 150
				});
				
				$('#add_res_dlg').find('button').click(function(){
					$.ajax({
						async: false,
						method: 'post',
						data: {
							'name' : $('#add_res_dlg').find('input[name="name"]').val()
						},
						url: 'ajax/api_access_control.php?act=res_2',
						success: function(data) {
							$('#add_res_dlg').html(data);
							window.location.reload();
						}
					});
				});
			}
		});
	});
	
	
	$('#acl_list').find('a[data-id]').click(function(){
		var c = confirm('Are you sure?'), id = $(this).data('id');
		if (c) {
			$.ajax({
				async: false,
				data: {
					id: id 
				},
				url: 'ajax/api_access_control.php?act=del_perm',
				success: function(data){
					$('<div />', { title: 'Delete permission', id: 'del_perm_dlg'}).html(data).dialog({
						width: 550,
						height: 200
					});
				}
			});
		}
	})
	
});