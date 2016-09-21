function Cust_doc_create(dir, file, vac_type)
{
	// This funtion will create the Documents
	// dir == the client data directory
	// file == the file that will be called 
	// This will only work if the custom_documents table has the document file names in it  
	// and the files are in the client data directory
	arr = getContainerSelectedData('assignment');

	if (arr == false) {
		return false;
	}
		
	cand_id = arr[0];

	start_date = arr[1];
	open("/" + dir + "/CustomDocs/CreateCustDoc.php?CandidateID=" + cand_id + "&VacancyID=" + document.Vacancy.ID.value + "&Vac_type=" + vac_type + "&File_name=" + file + "&Start_Date=" + start_date);
}

function TempCard(type)
{
	// This funtion will create the Pro-forma invoice
	arr = getContainerSelectedData('assignment');

	if (arr == false) {
		return false;
	}

	cand_id = arr[0];

	if (type=='temp') {
		open("/pp/templates/temp_card.php?vacid=" + document.Vacancy.ID.value + "&cand=" + cand_id);
	} else {
		start_date = arr[1];
		open("/pp/templates/contrac_card.php?vacid=" + document.Vacancy.ID.value + "&cand=" + cand_id + "&start_date=" + start_date);
	}
}

function calcFee(what)
{
	// This function will caluculate the fee
	// Get all the values 
	ServiceFee = document.Vacancy.ServiceFee.value;

	if (ServiceFee == "") {
		// Check if the ServiceFee is empty or not
		alert("Please enter a value for Overhead Service Fee");
	}

	ClientRate = document.Vacancy.ClientRate.value;
	CandidateRate = document.Vacancy.CandidateRate.value;

	ClientRateSat = document.Vacancy.ClientRateSat.value;
	CandidateRateSat = document.Vacancy.CandidateRateSat.value;

	ClientRateSun = document.Vacancy.ClientRateSun.value;
	CandidateRateSun = document.Vacancy.CandidateRateSun.value;

	ClientRateOvt = document.Vacancy.ClientRateOvt.value;
	CandidateRateOvt = document.Vacancy.CandidateRateOvt.value;

	ClientOther = document.Vacancy.ClientOther.value;
	CandidateOther = document.Vacancy.CandidateOther.value;

	if (what == 'ServiceFee') {
		// Check if Client Rates have values in
		if (
			(ClientRate != "" && ClientRate != "0")
			|| (ClientRateSat != "" && ClientRateSat != "0")
			|| (ClientRateSun != "" && ClientRateSun != "0")
			|| (ClientRateOvt != "" && ClientRateOvt != "0")
			|| (ClientOther != "" && ClientOther != "0")
		) {
			document.Vacancy.CandidateRate.value = round(ClientRate / (1 + (ServiceFee / 100)), 2);
			document.Vacancy.CandidateRateSat.value = round(ClientRateSat / (1 + (ServiceFee / 100)), 2);
			document.Vacancy.CandidateRateSun.value = round(ClientRateSun / (1 + (ServiceFee / 100)), 2);
			document.Vacancy.CandidateRateOvt.value = round(ClientRateOvt / (1 + (ServiceFee / 100)), 2);
			document.Vacancy.CandidateOther.value = round(ClientOther / (1 + (ServiceFee / 100)), 2);
		} else if (
			CandidateRate != ""
			|| CandidateRateSat != ""
			|| CandidateRateSun != ""
			|| CandidateRateOvt != ""
			|| CandidateOther != ""
		) {
			// Check if Candidate Rates have values in
			document.Vacancy.ClientRate.value = round(CandidateRate * (1 + (ServiceFee / 100)), 2);
			document.Vacancy.ClientRateSat.value = round(CandidateRateSat * (1 + (ServiceFee / 100)), 2);
			document.Vacancy.ClientRateSun.value = round(CandidateRateSun * (1 + (ServiceFee / 100)), 2);
			document.Vacancy.ClientRateOvt.value = round(CandidateRateOvt * (1 + (ServiceFee / 100)), 2);
			document.Vacancy.ClientOther.value = round(CandidateOther * (1 + (ServiceFee / 100)), 2);
		}
	}//end if what
}//end function

function fallawayReset()
{
	document.Vacancy.Fallaway.value = 0;
	document.Vacancy.FallawayReason.value = null;
	document.Vacancy.FallawayDateDay.value = null;
	document.Vacancy.FallawayDateMonth.value = null;
	document.Vacancy.FallawayDateYear.value = null;
	document.Vacancy.FallawayAmount.value = null;
	assignmentEdited[assignmentEditID] = 1;
	fallawayChanged();
}

function fallawayChanged()
{
	if (document.Vacancy.Fallaway.value == 1) {
		document.Vacancy.FallawayReason.disabled = false;
		document.Vacancy.FallawayDateDay.disabled = false;
		document.Vacancy.FallawayDateMonth.disabled = false;
		document.Vacancy.FallawayDateYear.disabled = false;
		document.Vacancy.FallawayAmount.disabled = false;
	} else {
		document.Vacancy.FallawayReason.disabled = true;
		document.Vacancy.FallawayDateDay.disabled = true;
		document.Vacancy.FallawayDateMonth.disabled = true;
		document.Vacancy.FallawayDateYear.disabled = true;
		document.Vacancy.FallawayAmount.disabled = true;
	}
}