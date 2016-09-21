//Requires
var request = require('request');
var express = require('express');
var logger = require('./logger');
var domain = require('domain');
var cls = require('continuation-local-storage');
var uuid = require('node-uuid');

//Create the Namespace
var namespace = cls.createNamespace('com.me');

//Constants for Wordpress Site and Monolith
const MONOLITH_SERVICE = 'http://' + process.env.MONOLITH_PORT_80_TCP_ADDR || 'http://www.placementpartner.co.za';
//const MONOLITH_SERVICE = 'http://www.placementpartner.co.za';

//Services
const services = {
  root: process.env.ROOT_SERVICE || MONOLITH_SERVICE,
  home: process.env.HOME_SERVICE || MONOLITH_SERVICE+'/web/home.php',
  who_we_are: process.env.WHO_WE_ARE_SERVICE || MONOLITH_SERVICE+'/web/who_we_are.php',
  what_we_do: process.env.WHAT_WE_DO_SERVICE || MONOLITH_SERVICE+'/web/what_we_do.php',
  demo: process.env.DEMO_SERVICE || MONOLITH_SERVICE+'/web/demo.php',
  benefits: process.env.BENEFITS_SERVICE || MONOLITH_SERVICE+'/web/benefits.php',
  features: process.env.FEATURES_SERVICE || MONOLITH_SERVICE+'/web/features.php',
  faq: process.env.FAQ_SERVICE || MONOLITH_SERVICE+'/web/faq.php',
  contact_us: process.env.CONTACT_US_SERVICE || MONOLITH_SERVICE+'/web/contact_us.php',
  clients: process.env.CLIENTS_SERVICE || MONOLITH_SERVICE+'/web/clients.php',
  logout: process.env.LOGOUT_SERVICE || MONOLITH_SERVICE+'/web/logout.php',
  login: process.env.LOGIN_SERVICE || MONOLITH_SERVICE+'/sys/login.php',
  user_account: process.env.USER_ACCOUNT_SERVICE || MONOLITH_SERVICE+'/sys/user_account.php',
  user_account_password: process.env.USER_ACCOUNT_PASSWORD_SERVICE || MONOLITH_SERVICE+'/sys/user_account.php?/password',
  company_list: process.env.COMPANY_LIST_SERVICE || MONOLITH_SERVICE+'/sys/company_list.php',
  update_company: process.env.UPDATE_COMPANY_SERVICE || MONOLITH_SERVICE+'/sys/update_company.php',
  update_company_contact: process.env.UPDATE_COMPANY_CONTACT_SERVICE || MONOLITH_SERVICE+'/sys/update_company_contact.php',
  update_system: process.env.UPDATE_SYSTEM_SERVICE || MONOLITH_SERVICE+'/sys/update_system.php',
  contact_list: process.env.CONTACT_LIST_SERVICE || MONOLITH_SERVICE+'/sys/contact_list.php',
  access_log_list: process.env.ACCESS_LOG_SERVICE || MONOLITH_SERVICE+'/sys/access_log_list.php',
  site_stats: process.env.SITE_STATS_SERVICE || MONOLITH_SERVICE+'/sys/site_stats.php',
  credit_types: process.env.CREDIT_TYPES_SERVICE || MONOLITH_SERVICE+'/sys/credit_types.php',
  transaction_list: process.env.TRANSACTION_LIST_SERVICE || MONOLITH_SERVICE+'/sys/transaction_list.php',
  orders_list: process.env.ORDERS_LIST_SERVICE || MONOLITH_SERVICE+'/sys/orders_list.php',
  pastel_export: process.env.PASTEL_EXPORT_SERVICE || MONOLITH_SERVICE+'/sys/pastel_export.php',
  debtors_list: process.env.DEBTORS_LIST_SERVICE || MONOLITH_SERVICE+'/sys/debtors_list.php',
  import_fnb_report: process.env.IMPORT_FNB_REPORT_SERVICE || MONOLITH_SERVICE+'/sys/import_fnb_report.php',
  manual_invoice_run: process.env.MANUAL_INVOICE_RUN_SERVICE || MONOLITH_SERVICE+'/sys/manual_invoice_run.php',
  log_run_history: process.env.LOG_RUN_HISTORY_SERVICE || MONOLITH_SERVICE+'/sys/log_run_history.php',
  creditors_list: process.env.CREDITORS_LIST_SERVICE || MONOLITH_SERVICE+'/sys/creditors_list.php',
  db_diff: process.env.DB_DIFF_SERVICE || MONOLITH_SERVICE+'/sys/db_diff.php',
  apc: process.env.APC_SERVICE || MONOLITH_SERVICE+'/sys/apc.php',
  memcached: process.env.MEMCACHED_SERVICE || MONOLITH_SERVICE+'/sys/memcached.php',
  api_active_sessions: process.env.API_ACTIVE_SESSIONS_SERVICE || MONOLITH_SERVICE+'/sys/api_active_sessions.php',
  api_access_control: process.env.API_ACCESS_CONTROL_SERVICE || MONOLITH_SERVICE+'/sys/api_access_control.php',
  clients: process.env.CLIENTS_SERVICE || MONOLITH_SERVICE+'/clients/index.php',
  candidate_update: process.env.CVW_UPDATE_SERVICE || MONOLITH_SERVICE+'/pp/cvw/candidate_update.php',
  candidate_search: process.env.CVW_SEARCH_SERVICE || MONOLITH_SERVICE+'/pp/cvw/candidate_search.php',
  wi_candidate_search: process.env.CVW_WI_SEARCH_SERVICE || MONOLITH_SERVICE+'/pp/cvw/wi_candidate_search.php',
  wi_postbox_stats: process.env.CVW_WI_POSTBOX_STATS_SERVICE || MONOLITH_SERVICE+'/pp/cvw/wi_postbox_stats.php',
  lists_update: process.env.CVW_LISTS_UPDATE_SERVICE || MONOLITH_SERVICE+'/pp/cvw/lists_update.php',
  client_update: process.env.CPR_CLIENT_UPDATE_SERVICE || MONOLITH_SERVICE+'/pp/cpr/client_update.php',
  searchFW: process.env.CPR_SEARCHFW_SERVICE || MONOLITH_SERVICE+'/pp/cpr/searchFW.php',
  contact_list: process.env.CPR_CONTACT_LIST_SERVICE || MONOLITH_SERVICE+'/pp/cpr/contact_list.php',
  client_requests: process.env.CPR_CLIENT_REQUESTS_SERVICE || MONOLITH_SERVICE+'/pp/cpr/client_requests.php',
  vac_new: process.env.VCS_VAC_NEW_SERVICE || MONOLITH_SERVICE+'/pp/vcs/vac_new.php',
  vacancy_list: process.env.VCS_VACANCY_LIST_SERVICE || MONOLITH_SERVICE+'/pp/vcs/vacancy_list.php',
  reminders_initialise: process.env.REM_REMINDERS_INITIALISE_SERVICE || MONOLITH_SERVICE+'/pp/rem/reminders_initialise.php',
  create_custom: process.env.REM_CREATE_CUSTOM_SERVICE || MONOLITH_SERVICE+'/pp/rem/create_custom.php',
  sms_log: process.env.SMS_LOG_SERVICE || MONOLITH_SERVICE+'/pp/sms/sms_log.php',
  sms_send: process.env.SMS_SEND_SERVICE || MONOLITH_SERVICE+'/pp/sms/sms_send.php',
  mysettings: process.env.MYSETTINGS_SERVICE || MONOLITH_SERVICE+'/pp/maintenance/mysettings.php',
  maintenance_system: process.env.MAINTENANCE_SYSTEM_SERVICE || MONOLITH_SERVICE+'/pp/maintenance/maintenance_system.php',
  user_list: process.env.USER_LIST_SERVICE || MONOLITH_SERVICE+'/pp/maintenance/user_list.php'

};

//Reg Ex for File Extension
const extensionRegEx = /(?:\.([^.]+))?$/;

//Request Logger
var requestLogger = function requestLogger(req, res, next) {
  var start = new Date();
  var end = res.end;
  res.end = function onEnd(chunk, encoding) {
    var responseTime = (new Date()).getTime() - start.getTime();
    end.call(res, chunk, encoding);
    var contentLength = parseInt(res.getHeader('Content-Length'), 10);
    var tid = namespace.get('tid');
    var data = {
      res: res,
      req: req,
      responseTime: responseTime,
      contentLength: isNaN(contentLength) ? 0 : contentLength
    };
    logger.info({TransactionID: tid}, '%s %s %d %dms - %d', data.req.method, data.req.url, data.res.statusCode, data.responseTime, data.contentLength);
  };
  next();
};

module.exports = function(conf) {

  var app = express();
  
  //Exception Logger
  app.use(function (req, res, next) {
    var requestDomain = domain.create();
    requestDomain.add(req);
    requestDomain.add(res);
    requestDomain.on('error', function onError(err) {
      var data = { req: req, res: res, error: err };
      logger.fatal(data, err.message);
    });
    next();
  });

  //Creates Transaction IDs for Requests
  app.use(function(req, res, next) {

      //Get the NameSpace & TID
      var namespace = cls.getNamespace('com.me');
      var tid = uuid.v4();

      //Bind the Request and Response Events to the Namespace
      namespace.bindEmitter(req);
      namespace.bindEmitter(res);

      //Run the Namespace on the Middleware
      namespace.run(function runNamespace() {

          //Set the TID in the Namespace to make it available throughout the application
          namespace.set('tid', tid);
          next();
      });
  });
  
  //Bind the Logger to the App
  app.use(requestLogger);

  //Root
  app.get('/', function rootFunc(req, res) {
    request(services.root)
      .on('error', function(err) { 
        var data = { req: req, res: res, error: err };
        logger.fatal({ERROR: err.message}, data);
      })
      .pipe(res);
  });

  //Web:Service
  app.get('/web/:service', function webServiceFunc(req, res) {
    var ext = extensionRegEx.exec(req.params.service)[1];
    if(ext == 'php') {
      req.params.service = req.params.service.replace(/\.[^/.]+$/, "");
    }
    console.log('SERVICE = '+req.params.service);
    console.log('URL = '+services[req.params.service]);
    if(req.params.service == 'styles.css')
    {
      request(MONOLITH_SERVICE+"/web/styles.css")
        .on('error', function onError(err) { 
          var data = { req: req, res: res, error: err };
          logger.fatal({ERROR: err.message}, data);
        })
        .pipe(res);
    } else {
      request(services[req.params.service])
        .on('error', function onError(err) { 
          var data = { req: req, res: res, error: err };
          logger.fatal({ERROR: err.message}, data);
        })
        .pipe(res);
    }
  });

  //Web
  app.get('/web', function webFunc(req, res) {
    request(MONOLITH_SERVICE+'/web/home.php')
      .on('error', function onError(err) { 
        var data = { req: req, res: res, error: err };
        logger.fatal({ERROR: err.message}, data);
      })
      .pipe(res);
  });

  //Sys:Service
  app.get('/sys/:service', function sysServiceFunc(req, res) {
    var ext = extensionRegEx.exec(req.params.service)[1];
    if(ext == 'php') {
      req.params.service = req.params.service.replace(/\.[^/.]+$/, "");
    }
    console.log('SERVICE = '+req.params.service);
    console.log('URL = '+services[req.params.service]);
    request(services[req.params.service])
      .on('error', function onError(err) { 
        var data = { req: req, res: res, error: err };
        logger.fatal({ERROR: err.message}, data);
      })
      .pipe(res);
  });

  //Sys
  app.get('/sys', function sysFunc(req, res) {
    request(MONOLITH_SERVICE+'/sys/login.php')
      .on('error', function onError(err) { 
        var data = { req: req, res: res, error: err };
        logger.fatal({ERROR: err.message}, data);
      })
      .pipe(res);
      logger.info('In Sys');
  });

  //PP:Service
  app.get('/pp/:service', function ppServiceFunc(req, res) {
    var ext = extensionRegEx.exec(req.params.service)[1];
    if(ext == 'php') {
      req.params.service = req.params.service.replace(/\.[^/.]+$/, "");
    }
    console.log('SERVICE = '+req.params.service);
    console.log('URL = '+services[req.params.service]);
    request(services[req.params.service])
      .on('error', function onError(err) { 
        var data = { req: req, res: res, error: err };
        logger.fatal({ERROR: err.message}, data);
      })
      .pipe(res);
  });

  //PP Rem:Service
  app.get('/pp/rem/:service', function ppServiceFunc(req, res) {
    var ext = extensionRegEx.exec(req.params.service)[1];
    if(ext == 'php') {
      req.params.service = req.params.service.replace(/\.[^/.]+$/, "");
    }
    console.log('SERVICE = '+req.params.service);
    console.log('URL = '+services[req.params.service]);
    request(services[req.params.service])
      .on('error', function onError(err) { 
        var data = { req: req, res: res, error: err };
        logger.fatal({ERROR: err.message}, data);
      })
      .pipe(res);
  });

  //PP Cvw:Service
  app.get('/pp/cvw/:service', function ppServiceFunc(req, res) {
    var ext = extensionRegEx.exec(req.params.service)[1];
    if(ext == 'php') {
      req.params.service = req.params.service.replace(/\.[^/.]+$/, "");
    }
    console.log('SERVICE = '+req.params.service);
    console.log('URL = '+services[req.params.service]);
    request(services[req.params.service])
      .on('error', function onError(err) { 
        var data = { req: req, res: res, error: err };
        logger.fatal({ERROR: err.message}, data);
      })
      .pipe(res);
  });

  //PP Cpr:Service
  app.get('/pp/cpr/:service', function ppServiceFunc(req, res) {
    var ext = extensionRegEx.exec(req.params.service)[1];
    if(ext == 'php') {
      req.params.service = req.params.service.replace(/\.[^/.]+$/, "");
    }
    console.log('SERVICE = '+req.params.service);
    console.log('URL = '+services[req.params.service]);
    request(services[req.params.service])
      .on('error', function onError(err) { 
        var data = { req: req, res: res, error: err };
        logger.fatal({ERROR: err.message}, data);
      })
      .pipe(res);
  });

  //PP VCS:Service
  app.get('/pp/vcs/:service', function ppServiceFunc(req, res) {
    var ext = extensionRegEx.exec(req.params.service)[1];
    if(ext == 'php') {
      req.params.service = req.params.service.replace(/\.[^/.]+$/, "");
    }
    console.log('SERVICE = '+req.params.service);
    console.log('URL = '+services[req.params.service]);
    request(services[req.params.service])
      .on('error', function onError(err) { 
        var data = { req: req, res: res, error: err };
        logger.fatal({ERROR: err.message}, data);
      })
      .pipe(res);
  });

  //PP SMS:Service
  app.get('/pp/sms/:service', function ppServiceFunc(req, res) {
    var ext = extensionRegEx.exec(req.params.service)[1];
    if(ext == 'php') {
      req.params.service = req.params.service.replace(/\.[^/.]+$/, "");
    }
    console.log('SERVICE = '+req.params.service);
    console.log('URL = '+services[req.params.service]);
    request(services[req.params.service])
      .on('error', function onError(err) { 
        var data = { req: req, res: res, error: err };
        logger.fatal({ERROR: err.message}, data);
      })
      .pipe(res);
  });

  //PP Maintenance:Service
  app.get('/pp/maintenance/:service', function maintServiceFunc(req, res) {
    var ext = extensionRegEx.exec(req.params.service)[1];
    if(ext == 'php') {
      req.params.service = req.params.service.replace(/\.[^/.]+$/, "");
    }
    console.log('SERVICE = '+req.params.service);
    console.log('URL = '+services[req.params.service]);
    request(services[req.params.service])
      .on('error', function onError(err) { 
        var data = { req: req, res: res, error: err };
        logger.fatal({ERROR: err.message}, data);
      })
      .pipe(res);
  });

  //Clients
  app.get('/clients/*', function clientsFunc(req, res) {
    request(MONOLITH_SERVICE+'/clients/index.php')
      .on('error', function onError(err) { 
        var data = { req: req, res: res, error: err };
        logger.fatal({ERROR: err.message}, data);
      })
      .pipe(res);
  });

  app.get('/ws/clients/index.php', function wsdlClients(req, res) {
    if(req.query.wsdl === '') {
      request(MONOLITH_SERVICE+'/ws/clients/index.php?wsdl')
        .on('error', function onError(err) {
          var data = { req: req, res: res, error: err};
          logger.fatal({ERROR: err.message}, data);
        })
        .pipe(res);
    } else {
      request(MONOLITH_SERVICE+'/ws/clients/index.php')
        .on('error', function onError(err) {
          var data = { req: req, res: res, error: err};
          logger.fatal({ERROR: err.message}, data);
        })
        .pipe(res);      
    }
  });

  return app;
};
