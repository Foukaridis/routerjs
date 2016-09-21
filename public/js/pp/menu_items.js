/* open help screen */
	function cvwSearchHelp() {
		open('../cvw/help/search.htm', 'helpWindow', 'width=600, height=500');	
	}

	function cvwHelp() {
		open('../cvw/help/cvw_help.htm', 'helpWindow', 'width=600, height=500');
	}
	function cprHelp() {
		open('../cpr/help/cpr_help.htm', 'helpWindow', 'width=600, height=500');
	}
	function vcsHelp() {
		open('../vcs/help/ppr_help.htm', 'helpWindow', 'width=600, height=500');
	}
	function maintHelp() {
		open('../maintenance/help/maint_help.htm', 'helpWindow', 'width=600, height=500');
	}


/* --- menu items --- */
var MENU_ITEMS = [
	['Log Out', null,   // page to go to when we log out will be set when menu is loaded.
	],
	['Candidates', null,
			['New', '../cvw/candidate_update.php',],
			['Search', '../cvw/candidate_search.php',],
			['Post Box', '../cvw/wi_candidate_search.php',],
	],

	['Clients', null,
			['New', '../cpr/client_update.php',],
			['Search', '../cpr/searchFW.php',],
			['Contacts', '../cpr/contact_list.php',],
	],

	['Vacancies', null,
			['New', '../vcs/vac_new.php',],
            ['List','../vcs/vacancy_list.php'],
	],

	['Reminders',null,
			['New', '../rem/create_custom.php',],
            ['List', '../rem/reminders_initialise.php'],
	],
    
	['Reports',null ,
	        ['Perm Sales' , '../reports/perm_sales.php' ,],
	        ['Temp Sales' , '../reports/temp_sales.php' ,],
	        ['Contractor Sales' , '../reports/contractor_sales.php' ,],
	        ['Client Int.' , '../reports/client_interactions.php' ,],
			['Cand Int.' , '../reports/candidate_interactions.php' ,],
			['Temp Flow.' , '../reports/temp_flowsheet.php' ,],
			['Contr Flow.' , '../reports/cont_flowsheet.php' ,],
			['Activity Report' , '../reports/activity_report.php' ,],
			['General Report' , '../reports/general_activity_report.php' ,],
			['Advertising Report' , '../reports/advertising_report.php' ,],
			['Referrals' , '../reports/referral_report.php' ,],
			['Sendouts' , '../reports/sendout_report.php' ,],
	],		 		
	['SMS',null ,
	        ['Send SMS' , '../sms/sms_send.php?new' ,],
	        ['SMS Log' , '../sms/sms_log.php' ,],
	],		 		
	['Maintenance', null,
			['System', '../maintenance/maintenance_system.php',],
			['Users', '../maintenance/user_list.php',],
      
	],
	['My Settings', '../maintenance/mysettings.php',],
	['<span style="color:#F00;">What\'s New</span>','../reports/whats_new.php',],
	['Help', null,
			['Candidates', 'javascript:cvwHelp();',],
			['Clients', 'javascript:cprHelp();',],
			['Vacancies', 'javascript:vcsHelp();',],
			['Maintenance', 'javascript:maintHelp();',],
	]
];

