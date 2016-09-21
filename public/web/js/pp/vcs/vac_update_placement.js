function Cust_doc_create(dir, file, vac_type)
{
	// This funtion will create the Documents
	// dir == the client data directory
	// file == the file that will be called 
	// This will only work if the custom_documents table has the document file names in it  
	// and the files are in the client data directory
	arr = getContainerSelectedData('placements');

	if (arr == false) {
		return false;
	}
		
	cand_id = arr[0];
	open("/" + dir + "/CustomDocs/CreateCustDoc.php?CandidateID=" + cand_id + "&VacancyID=" + document.Vacancy.ID.value + "&Vac_type=" + vac_type + "&File_name=" + file);
}

function ConfirmLetter(dir)
{
	// This funtion will create the Confirmation Letter
	// dir == the client data directory
	// This will only be displayed if the directory contains the Confirm.php file
	arr = getContainerSelectedData('placements');

	if (arr == false) {
		return false;
	}

	cand_id = arr[0];
	open("/" + dir + "/Templates/Confirm.php?CandidateID=" + cand_id + "&VacancyID=" + document.Vacancy.ID.value);
}

function PLCard()
{
	// This funtion will create the Pro-forma invoice
	arr = getContainerSelectedData('placements');

	if (arr == false) {
		return false;
	}

	cand_id = arr[0];
	open("/pp/templates/placement_card.php?vacid=" + document.Vacancy.ID.value + "&cand=" + cand_id);

}

function calcFee()
{
	// This function will caluculate the fee
	Package_value = document.Vacancy.Package.value;
	FeePercentage_value = document.Vacancy.FeePercentage.value;
	FeeTotal_value = document.Vacancy.FeeTotal.value;

	if (Package_value == ""
		&& FeePercentage_value == ""
		&& document.Vacancy.FeeTotal.value == ""
	) {
		// Nothing was entered
		alert("The following needs to be filled in:\n - Placement: Enter either a Flat Fee or a Total Package and Fee Percentage\n");

		return;
	}

	if (Package_value != "" && FeePercentage_value != "") {
		// Package and fee % were entered
		perc = FeePercentage_value / 100;
		new_val = Package_value * perc;
		NewFeeTotalValue = Math.round(new_val * 100) / 100;

		// Check if fee was calculated correctly
		if (FeeTotal_value != "" && FeeTotal_value != NewFeeTotalValue) {
			// Fee calculated wrong
			document.Vacancy.FeeTotal.value = "";
			document.Vacancy.FeeTotal.value = NewFeeTotalValue;
			alert("Total Package or Fee Percentage have changed so the Fee Total has been recalculated!\n");
		} else {
			// Set the fee value in
			document.Vacancy.FeeTotal.value = NewFeeTotalValue;
		}
	}
}

function fallawayReset()
{
	document.Vacancy.Fallaway.value = "0";
	document.Vacancy.FallawayReason.value = "";
	document.Vacancy.FallawayDateDay.value = "";
	document.Vacancy.FallawayDateMonth.value = 0;
	document.Vacancy.FallawayDateYear.value = "";
	document.Vacancy.FallawayAmount.value = "";
	placementsEdited[placementsEditID] = 1;
	fallawayChanged();
}

function fallawayChanged()
{
	if (document.Vacancy.Fallaway.value == "1") {
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