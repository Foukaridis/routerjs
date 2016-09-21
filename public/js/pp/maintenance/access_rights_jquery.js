$(document).ready(function(){
	/**
	 * Update candidates.
	 */
	//Make sure all the rules are kept at startup.
	if($("input#cand_updt_all").attr('checked')){
		$("input#cand_updt_branch").attr('checked',false);
		$("input#cand_updt_own").attr('checked',false);
	}
	if($("input#cand_updt_branch").attr('checked')){
		$("input#cand_updt_own").attr('checked',false);
	}
	//Click update all.
	$("input#cand_updt_all").click( function(event){	
		if($("input#cand_updt_all").attr('checked')){
			//Uncheck
			$("input#cand_updt_branch").attr('checked',false);
			$("input#cand_updt_own").attr('checked',false);
		}
	});
	//Click update branch.
	$("input#cand_updt_branch").click( function(event){	
		if($("input#cand_updt_branch").attr('checked')){
			//Uncheck
			$("input#cand_updt_all").attr('checked',false);
			$("input#cand_updt_own").attr('checked',false);
		}
	});
	//Click update own.
	$("input#cand_updt_own").click( function(event){	
		if($("input#cand_updt_own").attr('checked')){
			//Uncheck
			$("input#cand_updt_all").attr('checked',false);
			$("input#cand_updt_branch").attr('checked',false);
		}
	});
	
	/**
	 * View Contact Details and CV Contents
	 */
	//Rules enforcement on load.
	if($("input#cand_view_all").attr("checked")){
		$("input#cand_view_branch").attr("checked",false);
	}
	if($("input#cand_view_branch").attr("checked")){
		$("input#cand_view_all").attr("checked",false);
	}
	//Clicks check boxes.
	$("input#cand_view_branch").click(function(event){
		if($("input#cand_view_branch").attr("checked")){
			$("input#cand_view_all").attr("checked",false);	
		}
	});
	$("input#cand_view_all").click(function(event){ 
		if($("input#cand_view_all").attr("checked")){
			$("input#cand_view_branch").attr("checked",false);
		}
	});
	
	
	/**
	 * Delete candidates.
	 */
	//Rules are to be followed.
	if($("input#cand_delete_all").attr("checked")){
		$("input#cand_delete_branch").attr("checked",false);
		$("input#cand_delete_own").attr("checked",false);
	}
	if($("input#cand_delete_branch").attr("checked")){
		$("input#cand_delete_own").attr("checked",false);
	}
	//Alters selections.
	$("input#cand_delete_all").click(function(event){
		$("input#cand_delete_branch").attr("checked",false);
		$("input#cand_delete_own").attr("checked",false);
	});
	$("input#cand_delete_branch").click(function(event){
		$("input#cand_delete_all").attr("checked",false);
		$("input#cand_delete_own").attr("checked",false);
	});
	$("input#cand_delete_own").click(function(event){
		$("input#cand_delete_branch").attr("checked",false);
		$("input#cand_delete_all").attr("checked",false);
	});
	
	/**
	 * Add to vacancy.
	 */
	//Rules, do not break.
	if($("input#cand_2_vacancy_all").attr("checked")){
		$("input#cand_2_vacancy_branch").attr("checked",false);
	}
	//Changes are made to options.
	$("input#cand_2_vacancy_all").click(function(event){
		$("input#cand_2_vacancy_branch").attr("checked",false);
	});
	$("input#cand_2_vacancy_branch").click(function(event){
		$("input#cand_2_vacancy_all").attr("checked",false);
	});
	
	/**
	 * Clients - Update
	 */
	//Ensure compliance.
	if($("input#client_updt_all").attr("checked")){
		$("input#client_updt_branch").attr("checked",false);
		$("input#client_updt_own").attr("checked",false);
	}
	if($("input#client_updt_branch").attr("checked")){
		$("input#client_updt_own").attr("checked",false);
	}
	//Clicky buttons.
	$("input#client_updt_all").click(function(event){
		$("input#client_updt_branch").attr("checked",false);
		$("input#client_updt_own").attr("checked",false);
	});
	$("input#client_updt_branch").click(function(event){
		$("input#client_updt_all").attr("checked",false);
		$("input#client_updt_own").attr("checked",false);
	});
	$("input#client_updt_own").click(function(event){
		$("input#client_updt_branch").attr("checked",false);
		$("input#client_updt_all").attr("checked",false);
	});
	
	/**
	 * Clients - View
	 */
	//Make sure!
	if($("input#client_view_all").attr("checked")){
		$("input#client_view_branch").attr("checked",false);
	}

	if($("input#client_view_branch").attr("checked")){
		$("input#client_view_all").attr("checked",false);
	}

	//Clicks for you?
	$("input#client_view_all").click(function(event){
		$("input#client_view_branch").attr("checked",false);
	});
	$("input#client_view_branch").click(function(event){
		$("input#client_view_all").attr("checked",false);
	});
	
	/**
	 * Clients - Delete
	 */
	//Them rules.
	if($("input#clients_delete_all").attr("checked")){
		$("input#clients_delete_branch").attr("checked",false);
		$("input#clients_delete_own").attr("checked",false);
	}
	if($("input#clients_delete_branch").attr("checked")){
		$("input#clients_delete_own").attr("checked",false);
	}
	//Them clickies.
	$("input#clients_delete_all").click(function(event){
		$("input#clients_delete_branch").attr("checked",false);
		$("input#clients_delete_own").attr("checked",false);
	});
	$("input#clients_delete_branch").click(function(event){
		$("input#clients_delete_all").attr("checked",false);
		$("input#clients_delete_own").attr("checked",false);
	});
	$("input#clients_delete_own").click(function(event){
		$("input#clients_delete_branch").attr("checked",false);
		$("input#clients_delete_all").attr("checked",false);
	});
	
	/**
	 * Vacancies - Update
	 */
	//Ensure the rules are kept.
	if($("input#vac_update_all").attr("checked")){
		$("input#vac_update_branch").attr("checked",false);
		$("input#vac_update_own").attr("checked",false);
	}
	if($("input#vac_update_branch").attr("checked")){
		$("input#vac_update_own").attr("checked",false);
	}
	//Clicks make a difference.
	$("input#vac_update_all").click(function(event){
		$("input#vac_update_branch").attr("checked",false);
		$("input#vac_update_own").attr("checked",false);
	});
	$("input#vac_update_branch").click(function(event){
		$("input#vac_update_all").attr("checked",false);
		$("input#vac_update_own").attr("checked",false);
	});
	$("input#vac_update_own").click(function(event){
		$("input#vac_update_branch").attr("checked",false);
		$("input#vac_update_all").attr("checked",false);
	});
	
	/**
	 * Vacancies - View
	 */
	//Keep to the rules.
	if($("input#vac_client_info_all").attr("checked")){
		$("input#vac_client_info_branch").attr("checked",false);
	}
	//Clicks for you?
	$("input#vac_client_info_branch").click(function(event){
		$("input#vac_client_info_all").attr("checked",false);
	});
	$("input#vac_client_info_all").click(function(event){
		$("input#vac_client_info_branch").attr("checked",false);
	});
 });