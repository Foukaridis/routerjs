function doneTicked() {
	if (document.Candidate.Done.value == ""
			|| document.Candidate.Done.value == "0000-00-00 00:00:00") {
		var now = new Date(),
			nowTime = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
		
		if (typeof $ == 'function') {
			document.Candidate.Done.value = $.datepicker.formatDate('yy-mm-dd', new Date()) + ' ' + nowTime; 
		}
	}
}

function doneUnTicked()
{
	if (document.Candidate.Done.value != ""	&& document.Candidate.Done.value != "0000-00-00 00:00:00") {
		document.Candidate.Done.value = "0000-00-00 00:00:00";
	}

	document.Candidate.DoneCheck.disabled = false;
	document.Candidate.DoneCheck.checked = false;
}

function checkBoxChanged() {
	if (document.Candidate.Done.value != "0000-00-00 00:00:00"
			&& document.Candidate.Done.value != "") { // checks if the
														// checkbox should be
														// ticked or not by the
														// Done value
		doneTicked();
		document.Candidate.DoneCheck.disabled = true;
		document.Candidate.DoneCheck.checked = true;
	} else {
		doneUnTicked();
	}
}

function saveOrDeleteClicked() { // either the cancel or delete buttons were
									// pressed. clear the checkbox and make
									// editable
	document.Candidate.DoneCheck.disabled = false;
	document.Candidate.DoneCheck.checked = false;
}

// automatically set reminder to "Yes" when a date is filled in.
$(document).ready(function() {
	if (typeof (document.getElementById('DateYear')) != 'undefined') {
		$('#DateYear').change(function()
		{
			$('#Reminder').val('2');
			$(this).unbind('onchange');
		});
	}
});
