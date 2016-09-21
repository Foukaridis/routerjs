function Sendsms(con_type, name, contact_id)
{
	// This function is used to get the cell number of the contact selected 
	// and send a SMS to the specified contact
	if (con_type == '1') {
		// This section is for the contact
		var cellphone = document.Vacancy.Cellphone.value;

		if (cellphone) {
			contact_select = document.Vacancy.CompanyContact.selectedIndex;

			if (contact_id == (document.Vacancy.CompanyContact.value)) {
				// specify the location with cell + name + RTPG
				ID = document.Vacancy.ID.value;
				RTPG = "/pp/vcs/vacancy_update.php?ID="+ID+"&tab=client";
				param = "/pp/sms/sms_send.php?cell="+cellphone+"&name="+name+"&RTPG="+RTPG;
				document.location = param;
			} else {
				alert("The contact has changed, please SAVE the form.");
			}
		} else {
			alert("Please enter a Cellphone number!!");
		}
	} else {
		// This section is for the Account Contact
		var cellphone = document.Vacancy.AccCellphone.value;

		if (cellphone) {
			contact_select = document.Vacancy.CompanyAccContact.selectedIndex;

			if (contact_id == (document.Vacancy.CompanyAccContact.value)) {
				// Specify the location with cell + name + RTPG
				ID = document.Vacancy.ID.value;
				RTPG = "/pp/vcs/vacancy_update.php?ID=" + ID + "&tab=client";
				param = "/pp/sms/sms_send.php?cell=" + cellphone + "&name=" + name + "&RTPG=" + RTPG;
				document.location = param;
			} else {
				alert("The contact has changed, please SAVE the form.");
			}
		} else {
			alert("Please enter a Cellphone number!!");
		}
	}
}

function Sendemail(type)
{
	if (type == '1') {
		if (document.Vacancy.Email.value != '') {
			parent.location = 'mailto:' + document.Vacancy.Email.value;
		}
	}

	if (type == '2') {
		if (document.Vacancy.AccEmail.value != '') {
			parent.location = 'mailto:' + document.Vacancy.AccEmail.value;
		}
	}
}

$( document ).ready(function() {
	// Changes the width of the Main Contact field, selected contact span
	$('div.selector span').css('width', '120px');
});