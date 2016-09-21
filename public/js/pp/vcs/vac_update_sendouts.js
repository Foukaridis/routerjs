function RegretLetter(vacancy_id, what, who)
{
	// T.B.D. ARM - Fix framework so that we can use variable field names on the js side rather that arrays.
	// This will allow js to actually address the correct object
	// We need to find a way to address objects in JS that are in an array
	if (what == 'regret') {
		window.open("document_extension.php?vac_id=" + vacancy_id + "&type=regret&cand_id=" + who);
	}
}
