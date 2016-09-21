var vac_type = document.getElementById('Vac_type');
function Cust_doc_create_ass_ext(dir, file, vac_type)
{
	// This funtion will create the Documents
	// dir == the client data directory
	// file == the file that will be called 
	// This will only work if the custom_documents table has the document file names in it  
	// and the files are in the client data directory
	arr = getContainerSelectedData('assignment_ext');

	if (arr == false) {
		return false;
	}
		
	cand_id = arr[0];
	start_date = arr[1];
	open("/" + dir + "/CustomDocs/CreateCustDoc.php?CandidateID=" + cand_id + "&VacancyID=" + document.Vacancy.ID.value + "&Vac_type=" + vac_type + "&File_name=" + file + "&Start_Date=" + start_date + "&extention=true");
}

// Do NOT remove this alias!
// One can't simply "rename" JavaScript functions on Placement Partner..
var Cust_doc_create = Cust_doc_create_ass_ext;

function Cust_doc_create_ass_term(dir, file, vac_type)
{
	// This funtion will create the Documents
	// dir == the client data directory
	// file == the file that will be called 
	// This will only work if the custom_documents table has the document file names in it  
	// and the files are in the client data directory
		
	cand_id = document.Vacancy.Candidate_ref.value;
	open("/" + dir + "/CustomDocs/CreateCustDoc.php?CandidateID=" + cand_id + "&VacancyID=" + document.Vacancy.ID.value + "&Vac_type=" + vac_type + "&File_name=" + file + "&extention=true");
}