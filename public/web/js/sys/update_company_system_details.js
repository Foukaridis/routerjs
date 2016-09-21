/**
 * Show JavaScript JQuery Error Dialog
 *
 * @param  string msg Message to Display
 * @param  integer h   height in pixels
 * @param  integer w   width in pixels
 */
function showError(msg, h, w)
{
	var dialog = $("" +
"<div id='dialog_error' title='An error has occured!'>" +
	"<img src='/img/Actions-window-close-icon.png' style='float: left; padding-right: 5px;' title='Error' />" +
	"<span style='line-height: 22px;'>" + msg + "</span>" +
"</div>"
	);

	dialog.dialog({
		autoOpen: true,
		show: "blind",
		hide: "blind",
		height: h,
		width: w
	});
}

/**
 * Show JavaScript JQuery Dialog
 *
 * @param  string title Dialog Title
 * @param  string msg Message to Display
 * @param  integer h   height in pixels
 * @param  integer w   width in pixels
 */
function genDialog(title, msg)
{
	var dialog = $("" +
"<div id='dialog' title='" + title + "'>" +
	"<img src='/img/pp_wait.gif' style='float: left; padding: 5px;' title='" + title + "' />" +
	"<span style='line-height: 15px;'>" + msg + "</span>" +
"</div>"
	);

	return dialog;
}

/**
 * Make sure the values for the website integration password and the  website
 * integration password confirmation match up.
 *
 * @returns {String}
 */
function validateForWebAdvert()
{
	var new_pass = document.getElementById("Website_Integration_password");
	var verify_new_pass = document.getElementById("Website_Integration_password_confirm");

	if (new_pass.value != verify_new_pass.value) {
		return "  - Website Integration Password (Values do not match)\n";
	}

	return "";	// All good. Return that the passwords are the same.
}

if (typeof(CompanySystemChildFunctions) == "undefined") {
	var CompanySystemChildFunctions = new Array();
}

$(document).ready(function()
{
	var initial_login_name = $("LoginName").val();

	$("#VacancyID").tokenInput("/sys/ajax/search_vacancy.php?system=" + $("input#ID").val(), {
		theme: "facebook",
		hintText: "Vacancy ID",
		minChars: 3,
		tokenLimit: 1,
		method: 'GET',
		queryParam: 'vacancy_id',
		tokenFormatter: function(item)
		{
			return "<li>" + item.id + "</li>"
		},
		resultsFormatter: function(item)
		{
			return "" +
"<li>" +
	"<div style='display: inline-block; padding-left: 6px;'>" +
		"<div>" + item.id + "</div>" +
		"<div style='color:orange; font-weight: bold;'>" + item.name + "</div>" +
	"</div>" +
"</li>";
		}
	});

	var actionUrl = "ajax_system_server.php";

	// URL To Post To
	// Only Allow This functionality on new systems
	$("#LoginName").keyup(function()
	{
		var dbn="pp_" + $("#LoginName").val();

		$("#dbName").text(dbn);		// Update Text Before Create button
		$("#database").val(dbn);	// Update Database Value
	});
	
	// Save the page
//	$('input#ok_button').click(function(){
//		setExitValue(document.CompanySystem.control_buttons, 'OK');
//
//		if (verifyCompanySystem()) {
//			document.CompanySystem.submit();
//		}
//	});
//
//	$('input#apply_button').click(function(){
//		setExitValue(document.CompanySystem.control_buttons, 'Apply');
//
//		if (verifyCompanySystem()) {
//			document.CompanySystem.submit();
//		}
//	});

	// Create new system button was pressed.
	$("#btnCreateDB").click(function()
	{
		var dbn = $("#dbName").text();
		var data = {database_name: dbn, action: "createDatabase"};
		var d = genDialog("Creating new system", "Attempting to create new database: " + dbn + "<p><center>Please wait...</center></p>");

		$.ajax({
			type: "POST",
			url: actionUrl,
			data: data,
			dataType: "json",

			beforeSend: function()
			{
				// Handle the beforeSend event
				d.dialog({
					autoOpen: true,
					show: "blind",
					hide: "blind",
					height: 'auto',
					width: 'auto'
				});
			},

			success: function(res)
			{
				if (res.status == 0) {
					showError(res.message, 95, 320);
				} else {
					var dialog = $("" +
"<div id='dialog_msg' title='New System Successfully Created!'>" +
	"<img src='/img/success-icon.png' style='float: left; padding: 5px; width: 48px; border: none;' />" +
	"<span style='line-height: 22px;'>" +
		res.message +
	"</span>" +
"</div>"
					);

					dialog.dialog({
						autoOpen: true,
						show: "blind",
						hide: "blind",
						height: 'auto',
						width: 'auto'
					});
				}
			},

			complete: function()
			{
				d.dialog("close");
			}
		});

		// Prevent the browser to follow the link
		return false;
	});

	$("#LoginName").blur(function()
	{
		var loginName = $("#LoginName").val();
		var postbox = $("#Post_Box").is(":checked");

		if (loginName !== initial_login_name && postbox) {
			// LoginName changed, remember to update web service if integration is enabled.
			var data = {ol: currentLoginName, nl: loginName};

			var message = "Company Login Details Changed, would you like to update the web service login details as well?";
			var title = "Company Login Changed";
			var d = $("" +
"<div id='dialog_msg' title='" + title + "'>" +
	"<img src='/img/faq-icon.png' style='float: left; padding: 5px; width: 48px; border: none;' />" +
	"<span style='line-height: 22px;'>" + message + "</span>" +
"</div>"
			);

			d.dialog({
				autoOpen: true,
				show: "blind",
				hide: "blind",
				height: 'auto',
				width: 'auto',
				buttons: [
					{
						text: "Yes",
						click: function()
						{
							$(this).dialog("close");
							$.ajax({
								type: "POST",
								url: "update_ws_login_details.php",
								data: data,
								dataType: "json",

								beforeSend: function()
								{
									$("#CompanySystem").spinner({afterHTML: "<br/>Updating Web Service<br/>Login Details..."})
								},

								success: function(res)
								{
									if (res.status == 0) {
										showError(res.message, 95, 320);
									} else {
										var dialog = $("" +
"<div id='dialog_msg' title='Web Service Login Updated Successfully!'>" +
	"<img src='/img/success-icon.png' style='float: left; padding: 5px; width: 48px; border: none;' />" +
	"<span style='line-height: 22px;'>" + res.message + "</span>" +
"</div>"
										);

										dialog.dialog({
											autoOpen: trule,
											show: "blind",
											hide: "blind",
											height: 'auto',
											width: 'auto'
										});

										$("#control_buttons").val("Apply");
										$("#CompanySystem").submit();
									}
								},

								complete: function()
								{
									$("#CompanySystem").spinner("remove");
								}
							});
						}
					},
					{
						text: "No",

						click: function()
						{
							$(this).dialog("close");

							return false;
						}
					}
				]
			});
		}
	});

	// Reset User button was pressed.
	$("#ResetButton").click(function()
	{
		var un = $("#ResetUserName").val();
		var sid = $("#ID").val();
		var data = {username: un, system_id: sid, action: "resetUser"};

		if (un.length <= 0) {
			showError("Please supply a valid username!", 95, 320);

			return false;
		}

		var d = genDialog("Reset User", "Attempting to reset username: " + un + "<p><center>Please wait...</center></p>");

		$.ajax({
			type: "POST",
			url: actionUrl,
			data: data,
			dataType: "json",
			beforeSend: function()
			{
				// Handle the beforeSend event
				d.dialog({
					autoOpen: true,
					show: "blind",
					hide: "blind",
					height: 'auto',
					width: 'auto'
				});
			},
			success: function(res)
			{
				if (res.status == 0) {
					showError(res.message, 95, 320);
				} else {
					var dialog = $("" +
"<div id='dialog_msg' title='User Reset Successful!'>" +
	"<img src='/img/success-icon.png' style='float: left; padding: 5px; width: 48px; border: none;' />" +
	"<span style='line-height: 22px;'>" + res.message + "</span>" +
"</div>"
					);

					dialog.dialog({
						autoOpen: true,
						show: "blind",
						hide: "blind",
						height: 'auto',
						width: 'auto'
					});
				}
			},

			complete: function()
			{
				d.dialog( "close" );
			}
		});

		// Prevent the browser to follow the link
		return false;
	});

	// Delete vacancy button was pressed.
	$("#DeleteBtn").click(function()
	{
		var vid = $("#VacancyID").val();
		var system = $("input#ID").val();
		var data = {vacancy_id: vid, system: system};

		if (vid.length <= 0) {
			showError("Please supply a valid vacancy reference number!", 95, 320);

			return false;
		} else {
			var message = "Are you sure you want to remove vacancy ref#: " + vid;
			var title = "Remove Vacancy";
			var d = $("" +
"<div id='dialog_msg' title='" + title + "'>" +
	"<img src='/img/faq-icon.png' style='float: left; padding: 5px; width: 48px; border: none;' />" +
	"<span style='line-height: 22px;'>" + message + "</span>" +
"</div>"
			);

			d.dialog({
				autoOpen: true,
				show: "blind",
				hide: "blind",
				height: 'auto',
				width: 'auto',
				buttons: [
					{
						text: "Yes",
						click: function()
						{
							$(this).dialog("close");

							var d = genDialog("Remove Vacancy", "Removing all references to vacancy ref#: " + vid + "<p><center>Please wait...</center></p>");

							$.ajax({
								type: "POST",
								url: '/sys/ajax/delete_vacancy.php',
								data: data,
								dataType: "json",
								beforeSend: function()
								{
									// Handle the beforeSend event
									d.dialog({
										autoOpen: true,
										show: "blind",
										hide: "blind",
										height: 'auto',
										width: 'auto'
									});
								},
								success: function(res)
								{
									if (res.status == 0) {
										showError(res.message, 95, 380);
									} else {
										var dialog = $("" +
"<div id='dialog_msg' title='Vacancy Removed Successfully!'>" +
	"<img src='/img/success-icon.png' style='float: left; padding: 5px; width: 48px; border: none;' />" +
	"<span style='line-height: 22px;'>" + res.message.replace(/\n/g, '<br />\n') + "</span>" +
"</div>"
										);

										dialog.dialog({
											autoOpen: true,
											show: "blind",
											hide: "blind",
											height: 'auto',
											width: 'auto'
										});
									}
								},
								complete: function()
								{
									d.dialog("close");
								}
							});
						}
					},
					{
						text: "No",
						click: function()
						{
							$(this).dialog("close");

							return false;
						}
					}
				]
			});
		}

		// Prevent the browser to follow the link
		return false;
	});

	// Check CJ Login Details button was pressed.
	$("#CheckPassword").click(function()
	{
		var un = $("#CJ_clientid").val();
		var pwd = $("#CJ_password").val();
		var data = {cj_username: un, cj_password: pwd, action: "checkCJPassword"};

		if (un.length <= 0 || pwd.length <= 0) {
			showError("Please supply valid login details!", 95, 320);

			return false;
		}

		var d = genDialog("Validate CJ FTP Details", "Validating FTP Login Details. Please wait...");

		$.ajax({
			type: "POST",
			url: actionUrl,
			data: data,
			dataType: "json",

			beforeSend: function()
			{
				// Handle the beforeSend event
				d.dialog({
					autoOpen: true,
					show: "blind",
					hide: "blind",
					height: 'auto',
					width: 'auto'
				});
			},

			success: function(res)
			{
				if (res.status == 0) {
					showError(res.message, 95, 320);
				} else {
					var dialog = $("" +
"<div id='dialog_msg' title='Successful!'>" +
	"<img src='/img/success-icon.png' style='float: left; padding: 5px; width: 48px; border: none;' />" +
	"<span style='line-height: 22px;'>" + res.message + "</span>" +
"</div>"
					);

					dialog.dialog({
						autoOpen: true,
						show: "blind",
						hide: "blind",
						height: 'auto',
						width: 'auto'
					});
				}
			},

			complete: function()
			{
				d.dialog("close");
			}
		});

		// Prevent the browser to follow the link
		return false;
	});
        
        $('a.ajax').click(ajaxDialog);
});