function doneTicked()
{
	if (document.Client.Done.value == "" || document.Client.Done.value == "0000-00-00 00:00:00") {
		document.Client.Done.value = moment().format('YYYY-MM-DD HH:mm:ss');
	};
}

function doneUnTicked()
{
	if (document.Client.Done.value != "" && document.Client.Done.value != "0000-00-00 00:00:00") {
		document.Client.Done.value = "0000-00-00 00:00:00";
	}

	document.Client.DoneCheck.disabled = false;
	document.Client.DoneCheck.checked = false;
}

function checkBoxChanged()
{
	if (document.Client.Done.value != "0000-00-00 00:00:00" && document.Client.Done.value != "") {
		// Checks if the checkbox should be ticked or not by the Done value
		doneTicked();
		document.Client.DoneCheck.disabled = true;
		document.Client.DoneCheck.checked = true;
	} else {
		doneUnTicked();
	}
}

function saveOrDeleteClicked()
{
	// Either the cancel or delete buttons were pressed. clear the checkbox and make editable
	document.Client.DoneCheck.disabled = false;
	document.Client.DoneCheck.checked = false;
}

// Automatically set reminder to "Yes" when a date is filled in.
$(document).ready(function()
{
	if (typeof(document.getElementById('DateYear')) != 'undefined') {
		$('#DateYear').change(function()
		{
			$('#Reminder').val('2');
			$(this).unbind('onchange');
		});
	}
});