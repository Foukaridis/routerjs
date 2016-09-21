[![Parallel Logo](https://www.placementpartner.co.za/img/pp_logo_b.jpg)](http://www.placementpartner.co.za/)

#CONTENT ROUTER

## Synopsis

A Proxy Content Router to route between MicroServices and the Placement Partner Monolithic Application.

## Usage

### Environment Variables

* process.env.PORT
* process.env.WORD_SERVICE
* process.env.MONO_SERVICE
* process.env.ROOT_SERVICE
* process.env.HOME_SERVICE
* process.env.WHO_WE_ARE_SERVICE
* process.env.WHAT_WE_DO_SERVICE
* process.env.DEMO_SERVICE
* process.env.BENEFITS_SERVICE
* process.env.FEATURES_SERVICE
* process.env.FAQ_SERVICE
* process.env.CONTACT_US_SERVICE
* process.env.CLIENTS_SERVICE
* process.env.LOGOUT_SERVICE
* process.env.LOGIN_SERVICE  
* process.env.USER_ACCOUNT_SERVICE 
* process.env.USER_ACCOUNT_PASSWORD_SERVICE
* process.env.COMPANY_LIST_SERVICE
* process.env.UPDATE_COMPANY_SERVICE
* process.env.UPDATE_COMPANY_CONTACT_SERVICE
* process.env.UPDATE_SYSTEM_SERVICE
* process.env.CONTACT_LIST_SERVICE
* process.env.ACCESS_LOG_SERVICE
* process.env.SITE_STATS_SERVICE
* process.env.CREDIT_TYPES_SERVICE  
* process.env.TRANSACTION_LIST_SERVICE 
* process.env.ORDERS_LIST_SERVICE 
* process.env.PASTEL_EXPORT_SERVICE 
* process.env.DEBTORS_LIST_SERVICE 
* process.env.IMPORT_FNB_REPORT_SERVICE 
* process.env.MANUAL_INVOICE_RUN_SERVICE 
* process.env.LOG_RUN_HISTORY_SERVICE 
* process.env.CREDITORS_LIST_SERVICE 
* process.env.DB_DIFF_SERVICE  
* process.env.APC_SERVICE 
* process.env.MEMCACHED_SERVICE 
* process.env.API_ACTIVE_SESSIONS_SERVICE
* process.env.API_ACCESS_CONTROL_SERVICE 
* process.env.CLIENTS_SERVICE
* process.env.CVW_UPDATE_SERVICE 
* process.env.CVW_SEARCH_SERVICE
* process.env.CVW_WI_SEARCH_SERVICE
* process.env.CVW_WI_POSTBOX_STATS_SERVICE  
* process.env.CVW_LISTS_UPDATE_SERVICE
* process.env.CPR_CLIENT_UPDATE_SERVICE 
* process.env.CPR_SEARCHFW_SERVICE
* process.env.CPR_CONTACT_LIST_SERVICE
* process.env.CPR_CLIENT_REQUESTS_SERVICE  
* process.env.VCS_VAC_NEW_SERVICE
* process.env.VCS_VACANCY_LIST_SERVICE
* process.env.REM_REMINDERS_INITIALISE_SERVICE 
* process.env.REM_CREATE_CUSTOM_SERVICE
* process.env.SMS_LOG_SERVICE
* process.env.SMS_SEND_SERVICE 
* process.env.MYSETTINGS_SERVICE 
* process.env.MAINTENANCE_SYSTEM_SERVICE
* process.env.USER_LIST_SERVICE

### Constants

* WORDPRESS_SERVICE = 'http://www.placementpartner.co.za'
* MONOLITH_SERVICE = 'https://www.placementpartner.co.za'

### Service & Route Definitions (Constant)

* root: 					WORDPRESS_SERVICE
* home: 					WORDPRESS_SERVICE+'/web/home.php'
* who_we_are: 				WORDPRESS_SERVICE+'/web/who_we_are.php'
* what_we_do: 				WORDPRESS_SERVICE+'/web/what_we_do.php'
* demo: 					WORDPRESS_SERVICE+'/web/demo.php'
* benefits: 				WORDPRESS_SERVICE+'/web/benefits.php'
* features: 				WORDPRESS_SERVICE+'/web/features.php'
* faq: 						WORDPRESS_SERVICE+'/web/faq.php'
* contact_us: 				WORDPRESS_SERVICE+'/web/contact_us.php'
* clients: 					WORDPRESS_SERVICE+'/web/clients.php'
* logout: 					WORDPRESS_SERVICE+'/web/logout.php'
* login: 					MONOLITH_SERVICE+'/sys/login.php'
* user_account: 			MONOLITH_SERVICE+'/sys/user_account.php'
* user_account_password: 	MONOLITH_SERVICE+'/sys/user_account.php?/password'
* company_list: 			MONOLITH_SERVICE+'/sys/company_list.php'
* update_company:   		MONOLITH_SERVICE+'/sys/update_company.php'
* update_company_contact:   MONOLITH_SERVICE+'/sys/update_company_contact.php'
* update_system:   			MONOLITH_SERVICE+'/sys/update_system.php'
* contact_list:   			MONOLITH_SERVICE+'/sys/contact_list.php'
* access_log_list:  		MONOLITH_SERVICE+'/sys/access_log_list.php'
* site_stats:  				MONOLITH_SERVICE+'/sys/site_stats.php'
* credit_types:  			MONOLITH_SERVICE+'/sys/credit_types.php'
* transaction_list:  		MONOLITH_SERVICE+'/sys/transaction_list.php'
* orders_list:  			MONOLITH_SERVICE+'/sys/orders_list.php'
* pastel_export:  			MONOLITH_SERVICE+'/sys/pastel_export.php'
* debtors_list:  			MONOLITH_SERVICE+'/sys/debtors_list.php'
* import_fnb_report:  		MONOLITH_SERVICE+'/sys/import_fnb_report.php'
* manual_invoice_run:  		MONOLITH_SERVICE+'/sys/manual_invoice_run.php'
* log_run_history:  		MONOLITH_SERVICE+'/sys/log_run_history.php'
* creditors_list:  			MONOLITH_SERVICE+'/sys/creditors_list.php'
* db_diff: 					MONOLITH_SERVICE+'/sys/db_diff.php'
* apc:  					MONOLITH_SERVICE+'/sys/apc.php'
* memcached:  				MONOLITH_SERVICE+'/sys/memcached.php'
* api_active_sessions:   	MONOLITH_SERVICE+'/sys/api_active_sessions.php'
* api_access_control:  		MONOLITH_SERVICE+'/sys/api_access_control.php'
* clients:   				MONOLITH_SERVICE+'/clients/index.php'
* cvw_candidate_update:  	MONOLITH_SERVICE+'/pp/cvw/candidate_update.php'
* cvw_candidate_search:   	MONOLITH_SERVICE+'/pp/cvw/candidate_search.php'
* cvw_wi_candidate_search:  MONOLITH_SERVICE+'/pp/cvw/wi_candidate_search.php'
* cvw_wi_postbox_stats: 	MONOLITH_SERVICE+'/pp/cvw/wi_postbox_stats.php'
* cvw_lists_update:   		MONOLITH_SERVICE+'/pp/cvw/lists_update.php'
* cpr_client_update:  		MONOLITH_SERVICE+'/pp/cpr/client_update.php'
* cpr_searchFW:   			MONOLITH_SERVICE+'/pp/cpr/searchFW.php'
* cpr_contact_list:   		MONOLITH_SERVICE+'/pp/cpr/contact_list.php'
* cpr_client_requests: 		MONOLITH_SERVICE+'/pp/cpr/client_requests.php'
* vcs_vac_new:   			MONOLITH_SERVICE+'/pp/vcs/vac_new.php'
* vcs_vacancy_list:   		MONOLITH_SERVICE+'/pp/vcs/vacancy_list.php'
* rem_reminders_initialise: MONOLITH_SERVICE+'/pp/rem/reminders_initialise.php'
* rem_create_custom:   		MONOLITH_SERVICE+'/pp/rem/create_custom.php'
* sms_log:   				MONOLITH_SERVICE+'/pp/sms/sms_log.php'
* sms_send:  				MONOLITH_SERVICE+'/pp/sms/sms_send.php'
* mysettings:  				MONOLITH_SERVICE+'/pp/maintenance/mysettings.php'
* maintenance_system:   	MONOLITH_SERVICE+'/pp/maintenance/maintenance_system.php'
* user_list: 				MONOLITH_SERVICE+'/pp/maintenance/user_list.php'

## Installation

	$ git clone git@github.com:ParallelSoftware/router.git
	$ npm install

## Tests

	$ npm test

## License

© Parallel Software (Pty) Ltd 2015