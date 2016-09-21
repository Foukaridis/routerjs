var request = require('supertest');
var assert = require('assert');
var service = require('../service/router');
var express = require('express');

var app = service();

app.use(express.static(__dirname + '/public'));

//ROUTER

describe('Router - : ', function() {
//WEB
  describe('Web: ', function() {

	describe('Root Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/')
	      .expect(200, done);
	    });
	});

	describe('Home Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/web/home')
	      .expect(200, done);
	    });
	});

	describe('Who We Are Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/web/who_we_are')
	      .expect(200, done);
	    });
	});

	describe('What We Do Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/web/what_we_do')
	      .expect(200, done);
	    });
	});

	describe('Demo Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/web/demo')
	      .expect(200, done);
	    });
	});

	describe('Benefits Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/web/benefits')
	      .expect(200, done);
	    });
	});

		describe('Features Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/web/features')
	      .expect(200, done);
	    });
	});

	describe('FAQ Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/web/faq')
	      .expect(200, done);
	    });
	});

	describe('Contact Us Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/web/contact_us')
	      .expect(200, done);
	    });
	});

	describe('Clients Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/web/clients')
	      .expect(200, done);
	    });
	});

    describe('Logout Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/web/logout')
	      .expect(200, done);
	    });
	});

  });

//SYS

  describe('Sys: ', function() {

	describe('Login Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/sys/login')
	      .expect(200, done);
	    });
	});

	describe('User Account Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/sys/user_account')
	      .expect(200, done);
	    });
	});

	describe('User Account Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/sys/user_account')
	      .expect(200, done);
	    });
	});

	describe('User Account Password Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/sys/user_account_password')
	      .expect(200, done);
	    });
	});

	describe('Company List Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/sys/company_list')
	      .expect(200, done);
	    });
	});

	describe('Update Company Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/sys/update_company')
	      .expect(200, done);
	    });
	});

	describe('Update System Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/sys/update_system')
	      .expect(200, done);
	    });
	});

	describe('Contact List Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/sys/contact_list')
	      .expect(200, done);
	    });
	});

	describe('Access Log Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/sys/access_log_list')
	      .expect(200, done);
	    });
	});

	describe('Site Stats Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/sys/site_stats')
	      .expect(200, done);
	    });
	});

	describe('Credit Types Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/sys/credit_types')
	      .expect(200, done);
	    });
	});

	describe('Transaction List Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/sys/transaction_list')
	      .expect(200, done);
	    });
	});

	describe('UOrders List Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/sys/orders_list')
	      .expect(200, done);
	    });
	});

	describe('Pastel Export Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/sys/pastel_export')
	      .expect(200, done);
	    });
	});

	describe('Debtors List Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/sys/debtors_list')
	      .expect(200, done);
	    });
	});

	describe('Import FNB Report Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/sys/import_fnb_report')
	      .expect(200, done);
	    });
	});

	describe('Manual Invoice Run Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/sys/manual_invoice_run')
	      .expect(200, done);
	    });
	});

	describe('Log Run History Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/sys/log_run_history')
	      .expect(200, done);
	    });
	});

	describe('Creditors List Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/sys/creditors_list')
	      .expect(200, done);
	    });
	});

	describe('DB Diff Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/sys/db_diff')
	      .expect(200, done);
	    });
	});

	describe('APC Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/sys/apc')
	      .expect(200, done);
	    });
	});

	describe('Memcached Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/sys/memcached')
	      .expect(200, done);
	    });
	});

	describe('API Active Sessions Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/sys/api_active_sessions')
	      .expect(200, done);
	    });
	});

	describe('API Access Control Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/sys/api_access_control')
	      .expect(200, done);
	  });
	});

  });

//CLIENTS

  describe('Clients', function() {
    it("renders successfully", function(done) {
      request(app)
        .get('/clients/*')
        .expect(200, done);
    });
  });

//PP

  describe('PP: ', function() {

//CANDIDATE

	describe('Candidate Update Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/pp/cvw/candidate_update')
	      .expect(200, done);
	    });
	});

	describe('Candidate Search Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/pp/cvw/candidate_search')
	      .expect(200, done);
	    });
	});

	describe('Candidate WI Search Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/pp/cvw/wi_candidate_search')
	      .expect(200, done);
	    });
	});

	describe('Candidate Postbox Stats Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/pp/cvw/wi_postbox_stats')
	      .expect(200, done);
	    });
	});

	describe('Candidate Lists Update Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/pp/cvw/lists_update')
	      .expect(200, done);
	    });
	});

//CLIENTS

	describe('Client Update Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/pp/cpr/client_update')
	      .expect(200, done);
	    });
	});

	describe('Client Search FW Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/pp/cpr/searchFW')
	      .expect(200, done);
	    });
	});

	describe('Client Contact List Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/pp/cpr/contact_list')
	      .expect(200, done);
	    });
	});

	describe('Client Requests Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/pp/cpr/client_requests')
	      .expect(200, done);
	    });
	});

//VACANCIES

	describe('Vacancy New Vac Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/pp/vcs/vac_new')
	      .expect(200, done);
	    });
	});

	describe('Vacancy List Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/pp/vcs/vacancy_list')
	      .expect(200, done);
	    });
	});

//REMINDERS

	describe('Reminders Initialise Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/pp/rem/reminders_initialise')
	      .expect(200, done);
	    });
	});

	describe('Reminders Create Custom Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/pp/rem/create_custom')
	      .expect(200, done);
	    });
	});

//SMS

	describe('SMS Log Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/pp/sms/sms_log')
	      .expect(200, done);
	    });
	});

	describe('SMS Send Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/pp/sms/sms_send')
	      .expect(200, done);
	    });
	});

//MAINTENANCE

	describe('Maintenance MySettings Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/pp/maintenance/mysettings')
	      .expect(200, done);
	    });
	});

	describe('Maintenance System Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/pp/maintenance/maintenance_system')
	      .expect(200, done);
	    });
	});

	describe('Maintenance Users Page', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/pp/maintenance/user_list')
	      .expect(200, done);
	    });
	});

	describe('WSDL Test', function() {
	  it("renders successfully", function(done) {
	    request(app)
	      .get('/ws/clients/index.php')
	      .expect(200, done);
	    });
	});

  });

});