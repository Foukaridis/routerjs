function getCand()
{
	arr = getContainerSelectedData('referrals');

	if (arr == false) {
		return false;
	}	

	cand_id = arr[0];

	if (arr[4] == 0){
		alert("Selected candidate was not found in database");
		return false;
	} else {
		document.Vacancy.cand.value = cand_id;
		document.Vacancy.view.value = 'true';

		return true;
	}

	return false;
}