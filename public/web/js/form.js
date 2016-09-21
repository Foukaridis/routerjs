// We can't have errors when console.* is used, NULL objectpattern it is.
if (typeof console === 'undefined') {
	var console = {
		log : function() {
			return void(0);
		}
	};
}

// This is our namespace, please use it when creating new modules.
function validCharacters(thing,label) {
	for(i = 0; i < thing.length; i++) {
		//Check allowed characters
		if(!( (thing.charCodeAt(i) == 32) ||  //spaces
				(thing.charCodeAt(i) == 33) || // !
				(thing.charCodeAt(i) == 10) || // LF
				(thing.charCodeAt(i) == 13) || // CR
				(thing.charCodeAt(i) == 128) || //
		    (thing.charCodeAt(i) >= 35 && thing.charCodeAt(i) <= 90) ||			//#$%&
		    (thing.charCodeAt(i) >= 91 && thing.charCodeAt(i) <= 95) ||			//[]\^_
		    (thing.charCodeAt(i) >= 97 && thing.charCodeAt(i) <= 122) ||//a - z, {}|~
		    thing.charCodeAt(i) == 124 || thing.charCodeAt(i) == 126) )// |~
		{
			return "  - " + label + " (Contains invalid characters)\n";
		}
	}
	return "";
}

function selectAllCheckboxes(what, checked, callback){
	var arr = document.getElementsByName(what);
	var brr = new Array();

	for (var i = 0; i < arr.length; i++){
		arr[i].checked = checked;
		brr.push(arr[i].value);
	}

	if (callback != ''){// the callback is set
		if (checked){// is everything selected?
			eval(callback+"(brr)");// then call the callback with everything
		}else{
			eval(callback+"(new Array())");//otherwise, call the callback with nuffing.
		}
	}
}



function noCurlyBrackets(thing, label) {
    //This function will check for single quotes in all text fields
	for(i = 0; i < thing.length; i++) {
		//Check allowed characters
		if(thing.charCodeAt(i) == 123 || thing.charCodeAt(i) == 125) {
			return "  - " + label + " (Curly brackets are not allowed)\n";
		}
	}
	return "";

}

function noSingleQuotes(thing, label) {
    //This function will check for single quotes in all text fields
	for(i = 0; i < thing.length; i++) {
		//Check allowed characters
		if(thing.charCodeAt(i) == 39) {
			return "  - " + label + " (Single quotes / apostrophes are not allowed)\n";
		}
	}
	return "";

}

function invertedCommas(thing,label) {
    //This function will check for inverted command in all text fields
	for(i = 0; i < thing.length; i++) {
		//Check allowed characters
		if(thing.charCodeAt(i) == 34) {
			return "  - " + label + " (Please replace inverted commas.)\n";
		}
	}
	return "";
}

function atLeastOneNotEmpty(things, label) {
  //This function is used to verify an array of fields to ensure that at least one of them is completed
  found = false;
  for(i=0; i < things.length; i++) {
    if(eval(things[i]) != "") {
      found = true;
    }
  }
  if(found) {
    return "";
  } else {
    return "  - " + label + " (At least one field has to be completed)\n";
  }
}

function emptySelect(thing, label){
	//verify that a text field is empty (if something else requires it to be so)
	if (thing.selectedIndex != 0){
		return "  - "+ label + " (Must not be selected)\n";
	}else{
		return "";
	}
}

function empty(thing, label){
	//verify that a text field is empty (if something else requires it to be so)
	if (thing != ''){
		return "  - "+ label + " (Must be empty)\n";
	}else{
		return "";
	}
}

function notEmpty(thing, label) {
	//verify that a text field is not empty
	if(thing == "") {
		return "  - " + label + " (Must be completed)\n";
	} else {
		return "";
	}
}

function notEmptyFile(thing, label){
	if (thing.value == ''){
		return '  - '+label+" (A file must be uploaded)\n";
	}
	return '';
}

function requiredDate(thing,label){
	msg = notEmptyDate(thing,label);

	if (msg == ""){// all date fields are completed.
		day = eval(thing+"Day.value");
		month = eval(thing+"Month.options["+thing+"Month.selectedIndex].value");
		year = eval(thing+"Year.value");

		if(isNaN(parseInt(day))|| day > 31) {
			msg += "  - "+ label + " (Day value greater than 31 or is not a valid number)\n";
		}
		if(month == 0) {
			msg += "  - "+ label + " (Please select a month)\n";
		}
		if(isNaN(parseInt(year)) || year < 1900) {
			msg += "  - "+ label + " (Year can not be less than 1900 or is not a valid number)\n";
		}
	}

	return msg;// msg should be returned.
}

function validTime(thing, label) {
	msg = "";

	eval('var timeHr = '+thing+'Hours');
	eval('var timeMin = '+thing+'Minutes');
	eval('var timeSec = '+thing+'Seconds');

	if (timeHr.value != '' && timeMin.value != '' && (timeSec == null || timeSec.value != '')) {
		hrs = parseInt(timeHr.value);
		mins = parseInt(timeMin.value);
		if (hrs == 0 && mins == 0)
			return "";
		if (isNaN(hrs) || (hrs > 24 || hrs < 1 ) && mins == 0 || mins != 0 && (hrs > 23 || hrs < 0))
			msg += "  - "+label+" (Hours should be a number between 1 and 24)\n";
		if (isNaN(mins) || mins > 59 || mins < 0)
			msg += "  - "+label+" (Minutes should be a number between 0 and 59)\n";

		if(timeSec != null){
			secs = parseInt(timeSec.value);
			if (isNaN(secs) || secs > 59 || secs < 0)
				msg += "  - "+label+" (Seconds should be a number between 0 and 59)\n";
		}
	}
	return msg;
}

function validDate(thing, label) {
	msg = "";

	if(notEmptyDate(thing, label) == "") {
		//All date fields are all filled in - check for valid numbers
		day = eval(thing+"Day.value");
		month = eval(thing+"Month.value");
		year = eval(thing+"Year.value");

		if(isNaN(parseInt(day))|| day > 31) {
			msg += "  - "+ label + " (Day value greater than 31 or is not a valid number)\n";
		}
		if(month == 0) {
			msg += "  - "+ label + " (Please select a month)\n";
		}
		if(isNaN(parseInt(year)) || year < 1900) {
			msg += "  - "+ label + " (Year can not be less than 1900 or is not a valid number)\n";
		}
	} else {
		//All fields are not filled in check if all are blank
		return emptyDate(thing,label);
	}
	return msg;
}

function emptyDate(thing, label) {
	//verify that not one of the date fields are filled in
	day = eval(thing+"Day.value");
	dayThing = eval(thing+"Day");// so that a date filed w/o a day can be empty too (the day defaults to '01'
	month = eval(thing+"Month.value");
	year = eval(thing+"Year.value");

	if((day == "" || dayThing.type == "hidden") && month == 0 && year == "") {
		return "";
	} else {
		return "  - " + label + " (Must be completed)\n";
	}
}

function notEmptyTime(thing, label) {
		msg = "";

	eval('var timeHr = '+thing+'Hours');
	eval('var timeMin = '+thing+'Minutes');
	eval('var timeSec = '+thing+'Seconds');

	if (timeHr.value == '' || timeMin.value == '' || (timeSec != null && timeSec.value == '')) {
		msg += "  - "+label+" (Time must be filled in)\n";
	}
	return msg;
}

function notEmptyDate(thing, label) {
	//verify that all the date fields are filled in
	day = eval(thing+"Day.value");
	month = eval(thing+"Month.value");
	year = eval(thing+"Year.value");

	if(day == "" || month == 0 || year == "") {
		return "  - " + label + " (Must be completed)\n";
	} else {
		return "";
	}
}

function notEmptySelect(thing, label) {
    //Check that a select box has options added.
    if(thing.length == 0) {
		return "  - " + label + " (Add at least one)\n";
    } else {
        return "";
    }
}

function validEmail(thing, label) {
	//verify that the email address is valid
	//if it was filled in. This function does not
	//ensure that the email address was filled in
	msg = "";
	if( (notEmpty(thing, label) == "") && (validCharacters(thing, label) == "") ) {
		if( (thing.indexOf('@') == -1) ||
			(thing.lastIndexOf('.') == -1) ) {
				msg += "  - " + label + " (Email address not valid)\n";
		}
	}
	return msg;
}

function numericValue(thing, label) {
	//This function will check that a numeric value was enetered
	if (isNaN(new Number(thing))) {
		return "  - " + label + " (Must be a numeric value)\n";
	}
	return "";
}

function validTelephone(thing, label) {
	//This function will check that a standard telephone number has been entered
	msg = "";
	if( (notEmpty(thing, label) == "") && (validCharacters(thing, label) == "") ) {
		for(i = 0; i < thing.length; i++) {
			if(!( (thing.charCodeAt(i) == 32) || // space
			      (thing.charCodeAt(i) == 40) || // (
				  (thing.charCodeAt(i) == 41) || // )
				  (thing.charCodeAt(i) == 43) || // +
			    (thing.charCodeAt(i) >= 48 && thing.charCodeAt(i) <= 57)) )			//0 - 9
			{
				msg += "  - " + label + " (Not a valid telephone number)\n";
				return msg;
			}
		}
	}
	return "";
}

function selectionMade(thing, label) {
	//verify that a selection is made on a drop down box
	msg = "";
	if(thing == 0) {
		msg += "  - " + label + " (Please select an option)\n";
	}
	return msg;
}

function lessThanSelected(thing, number) {
	//This function will check that not more that the given number of
	//options was selected

}

function trim0(value){
	if (value.length == 2 && value.charAt(0) == '0'){
		value = value.charAt(1);
	}

	return value;
}

function dateMoreThanDate(thing1, thing2, label1, label2){// checks that thing1 > thing2
	if (notEmptyDate(thing1, '') != '')// we can't check an empty date.
		return '';
	var date1 = new Date(eval(thing1+"Year.value"),eval(thing1+"Month.value")-1,trim0(eval(thing1+"Day.value")));
	var date2;

if (typeof(eval(thing2)) == 'object'){
		date2 = thing2;
	}else{
		if (notEmptyDate(thing2, '') != '')
			return '';
		date2 = new Date(eval(thing2+"Year.value"),eval(thing2+"Month.value")-1,trim0(eval(thing2+"Day.value")));

	}

	if (date1 <= date2){
		return "  - "+ label1 + " (Date must be greater than "+label2+")\n";

	}
	return "";
}

function dateMoreThanOrEqualDate(thing1, thing2, label1, label2){// checks that thing1 > thing2
	if (notEmptyDate(thing1, '') != '')// we can't check an empty date.
		return '';
	var date1 = new Date(eval(thing1+"Year.value"),eval(thing1+"Month.value")-1,trim0(eval(thing1+"Day.value")));
	var date2;

if (typeof(eval(thing2)) == 'object'){
		date2 = thing2;
	}else{
		if (notEmptyDate(thing2, '') != '')
			return '';
		date2 = new Date(eval(thing2+"Year.value"),eval(thing2+"Month.value")-1,trim0(eval(thing2+"Day.value")));

	}

	if (date1 < date2){
		return "  - "+ label1 + " (Date must be greater than or equaled to "+label2+")\n";

	}
	return "";
}

function dateLessThanDate(thing1, thing2, label1, label2){// checks that thing1 > thing2
	if (notEmptyDate(thing1, '') != '')// we can't check an empty date.
		return '';
	var date1 = new Date(eval(thing1+"Year.value"),eval(thing1+"Month.value")-1,trim0(eval(thing1+"Day.value")));
	var date2;

	if (typeof(eval(thing2)) == 'object'){
		date2 = thing2;
	}else{
		if (notEmptyDate(thing2, '') != '')
			return '';
		date2 = new Date(eval(thing2+"Year.value"),eval(thing2+"Month.value")-1,trim0(eval(thing2+"Day.value")));

	}

	if (date1 >= date2){
		return "  - "+ label1 + " (Date must be less than "+label2+")\n";

	}
	return "";
}

function dateLessThanOrEqualDate(thing1, thing2, label1, label2){// checks that thing1 > thing2
	if (notEmptyDate(thing1, '') != '')// we can't check an empty date.
		return '';
	var date1 = new Date(eval(thing1+"Year.value"),eval(thing1+"Month.value")-1,trim0(eval(thing1+"Day.value")));
	var date2;

if (typeof(eval(thing2)) == 'object'){
		date2 = thing2;
	}else{
		if (notEmptyDate(thing2, '') != '')
			return '';
		date2 = new Date(eval(thing2+"Year.value"),eval(thing2+"Month.value")-1,trim0(eval(thing2+"Day.value")));

	}

	if (date1 > date2){
		return "  - "+ label1 + " (Date must be less than or equaled to "+label2+")\n";

	}
	return "";
}

function moreThanSelected(thing, number) {
	//This function will check that at least the given number of options was
	//selected
}

function valueGreaterThan(thing, label, value) {
	//This function will check that an entered values is greater than the given value
	msg = "";
	if( (notEmpty(thing, label) == "") && (validCharacters(thing, label) == "") ) {
		if(thing < value) {
			//If value is less than it is not greater or equal
			msg += "  - " + label + " (Must be greater than " + value + ")";
		}
	}
	return msg;
}

function valueLessThan(thing, label, value) {
	//This function will check that an entered values is less than the given value
	msg = "";
	if( (notEmpty(thing, label) == "") && (validCharacters(thing, label) == "") ) {
		if(thing > value) {
			//If value is greater than it is not less than or equal
			msg += "  - " + label + " (Must be less than " + value + ")";
		}
	}
	return msg;
}

function validSAID(thing, label) {
	//This function will verify that the ID number
	//is a valid SA idnumber
	msg = "";
	if( (notEmpty(thing, label) == "") && (validCharacters(thing, label) == "") ) {
		 if(thing.length != 13) {
	        msg += "  - " + label + " (SA ID numbers have 13 digits)\n";
		    return msg;
		}
		 if( (thing.substr(0,2) > 99) ||
		     (thing.substr(2,2) < 1) ||
		     (thing.substr(2,2) > 12) ||
		     (thing.substr(4,2) < 1) ||
		     (thing.substr(4,2) > 31) ) {
		         msg += "  - " + label + " (Not a valid birth date)\n";
       	         return msg;
		   }
	}
    //Check for alphanumerics and spaces
    for(i = 0; i < thing.length; i++) {
		if(thing.charCodeAt(i) < 48 ||
		   thing.charCodeAt(i) > 57) {
			  if(thing.indexOf(" ") > -1) {
			  	 msg += "  - " + label + " (No spaces are allowed)\n";
				 return msg;
			} else {
			     msg += "  - " + label + " (Only numbers are allowed)\n";
				 return msg;
			}
			break;
	    }
	}
	return "";
}

function getDateOfBirth(sa_id_num) {
	//This function will return the date of birth given an SA idnumber
    if(validSAID(sa_id_num, "ID") == "" && (sa_id_num != "")) {
	   return "19" + sa_id_num.substr(0,2) + "-" + sa_id_num.substr(2,2) + "-" + sa_id_num.substr(4,2);
	} else {
        return "0000-00-00";
	}
}

function getGender(sa_id_num) {
	//This function will return the gender of a person given the id number
	//It will first verify that the given id is in fact a valid sa id.
	if((validSAID(sa_id_num, "ID") == "") && (sa_id_num != "")) {
		if (sa_id_num.substr(6,4) > 4999) {
			return "M";
		} else {
			return "F";
		}
	} else {
		return "";
	}
}

function getSACitizen(sa_id_num) {
    // This function will return 1 if the person is an SA citizen and 0 if not
	if((validSAID(sa_id_num, "ID") == "") && (sa_id_num != "")) {
		res = sa_id_num.substr(10,1);
		if (res = 0) {
			return "SA";
		} else {
			return "NON SA";
		}
	} else {
		return "";
	}
}

function dateAfter(thing, date) {
	//This function will check that the entered date is aftre the given date
}

function dateBefore(thing, date) {
	//This function will check that the entered date is before the given date
}

function valuesMatch(arr){
	var msg = "";
	// This function will check that the group of values are equal.
	for (var group in arr){
		theArray = arr[group];
		if (theArray.length < 2)
			continue;	// no use in matching values if there's only one value.
		testval = null;
		for ( i = 0; i < theArray.length; i++){	// cycle through the array that collects the fields.
			input = document.getElementById(theArray[i]);
			if (testval == null){
				testval = input.value;
				continue;
			}else{
				if (input.value != testval){
					msg += "  - "+group+" (Non matching values)\n";
					break;
				}
			}
		}
	}
	return msg;
}

function getBrowserDetail(){
	var foo = new Array();

	if (navigator.userAgent.indexOf('MSIE 6.0') >= 0) {
		foo["browser"] = "Internet Explorer";
		foo["version"] = "6.0";
	}else if (navigator.userAgent.indexOf('Firefox')>= 0){
		foo["browser"] = "Firefox";
		foo["version"] = navigator.userAgent.substr(navigator.userAgent.indexOf('Firefox')+8);
	}else if (navigator.userAgent.indexOf('IE') >= 0){
		foo["browser"] = "Internet Explorer";
		foo["version"] = navigator.userAgent.substr(navigator.userAgent.indexOf('IE')+3, navigator.userAgent.indexOf(';', navigator.userAgent.indexOf('IE')+3)-3 );
	}else if (navigator.userAgent.indexOf('Opera') >= 0){
		foo["browser"] = "Opera";
		foo["version"] = navigator.userAgent.substr(navigator.userAgent.indexOf('Opera')+6, navigator.userAgent.indexOf(' ')-6);
	}else{
		foo["browser"] = "Unknown";
	}

	return foo;
}

function notifySelectChange(item, form) {
	//This function gets called everytime a select menu is changed.
	//Action that need to be taken will be handled here
	//Build an array of the selected option values

	var browser = getBrowserDetail();

	var ItemSubSelects = ChildMenus[item.id];
	var multiple = item.multiple == true;

	for (var ItemSubSelectIndex in ItemSubSelects){// for each of the Items' Sub Selects
		if (ItemSubSelectIndex == 'is_subselect')
			continue;

		var SubSelect = document.getElementById(ItemSubSelects[ItemSubSelectIndex]);//get the Sub Select
		var SubSelectOptions = eval(ItemSubSelects[ItemSubSelectIndex]);
		/****************************
		/   Clears  all the entries.
		/****************************/
		var SubSelectSelected = new Array();
		for (var SubSelectElemIndex = 0; SubSelectElemIndex < SubSelect.length; SubSelectElemIndex++) {
			if (SubSelect.item(SubSelectElemIndex).selected)
				SubSelectSelected[SubSelect.item(SubSelectElemIndex).value] = true;
		}

		SubSelect.innerHTML = "";

		/*********************************
		/ go through all the item's options and check if they are selected
		/*********************************/

		for (var CurrentSelectOption = 0; CurrentSelectOption < item.options.length; CurrentSelectOption ++){// for each of the Current Select's Options
			if (item.options[CurrentSelectOption].selected){// if the option is selected
				var OptGroup = document.createElement('OptGroup');
				OptGroup.label = item.options[CurrentSelectOption].innerHTML.split("&amp;").join("&").split("&lt;").join("<").split("&gt;").join(">");
				var SelectedSubOptions = SubSelectOptions[item.options[CurrentSelectOption].value];
				if (browser["browser"] == "Internet Explorer" && multiple){// IE is stupid and ugly
					SubSelect.appendChild(OptGroup);
				}

				if (typeof(SelectedSubOptions) == "undefined"){// if there were no previously selected options.
					if (browser["browser"] != "Internet Explorer" && multiple){// IE is still stupid and ugly
						OptGroup.appendChild(new Option('',''));// hack for firefox to display the damn thing correcty.
						SubSelect.appendChild(OptGroup);
						OptGroup.innerHTML = '';// remove the dummy Option
					}
					continue;
				}

				for (var SubOptionIndex = 0; SubOptionIndex < SelectedSubOptions.length; SubOptionIndex ++){// for each option in the array
					var theOption = new Option();
					theOption.selected = SubSelectSelected[SelectedSubOptions[SubOptionIndex][0]];// is it selected? (opera does not play nice with this line)

					theOption.text = SelectedSubOptions[SubOptionIndex][1];
					theOption.value = SelectedSubOptions[SubOptionIndex][0];

					if (browser["browser"] == "Internet Explorer" || !multiple)// IE is stupid and ugly
						SubSelect.options[SubSelect.options.length] = theOption;
					else// the rest of the world does things the sane way.
						OptGroup.appendChild(theOption);
				}

				if (browser["browser"] != "Internet Explorer" && multiple){// IE is still stupid and ugly
					SubSelect.appendChild(OptGroup);
				}
			}

		}
		notifySelectChange(SubSelect, form);
	}

	if (ChildTextFieldNames[item.id] instanceof Array && item.selectedIndex != -1 && item[item.selectedIndex].value != 0){// There are sub-text sets dependant on 'item'
		correctField = item[item.selectedIndex].value;                         // get the correct field VALUE
		for (i = 0; i <  ChildTextFieldNames[item.id].length; i++){           // cycle through all the child sets and set their values
			eval('field = '+item.id+'Children[i][correctField];');             // get the set's correct values
			for (j = 0; j < ChildTextFieldNames[item.id][i].length; j++){     // cycle through al the fields in the set
				eval('document.'+form+'.'+ChildTextFieldNames[item.id][i][j]+'.value = field['+j+'];');// set the value of the set entry
			}
		}

  }
	  // SubTextFields for this select exists AND They should now be cleared.
  if (ChildTextFieldNames[item.id] instanceof Array && (item.selectedIndex == -1 || item[item.selectedIndex].value == 0)){
		for (i = 0; i <  ChildTextFieldNames[item.id].length; i++){           // cycle through all the child sets and set their values
			for (j = 0; j < ChildTextFieldNames[item.id][i].length; j++){
				eval('document.'+form+'.'+ChildTextFieldNames[item.id][i][j]+'.value = \'\';');// set the value of the set entry
			}
		}
  }
}

function updateChildMenus(form) {
	for (var child in ChildMenus){

		if (!ChildMenus[child]['is_subselect'] && typeof(eval('document.'+form+'.'+child)) != "undefined") {// only handle the selects which aren't sub selects, so that they only get processed once.
			recursiveUpdateChildMenus(child,form);
		}//if
	}//for
}//fun

function recursiveUpdateChildMenus(selectName, form){
	var theselect = document.getElementById(selectName);
	notifySelectChange(theselect,form);

	// set this menus' chil menus' values to the defaults (if there are any)
	arr = eval (form+"Defaults");
	for (var ChildMenuNameIndex in ChildMenus[selectName]){// for each of the child selects
		if (ChildMenuNameIndex == 'is_subselect')// skip this one
			continue;

		SubSelectName = ChildMenus[selectName][ChildMenuNameIndex];// the name of the child select
		SubSelect = document.getElementById(SubSelectName);// get the SubSelect itself.
		if (arr instanceof Array && arr[SubSelectName] instanceof Array){// is there a defaults array and is there defaults for this one?
			for (var SelectPos = 0; SelectPos < SubSelect.length; SelectPos++){// for each of the
				SubSelect[SelectPos].selected = (arr[SubSelectName][SubSelect[SelectPos].value] == true);
			}
		}
		recursiveUpdateChildMenus(SubSelectName, form);
	}
}

function setExitValue(thing, value) {
	//This function will set given field to the given value.
	//typically used on submit to set values required by the destination page
	thing.value = value;
}

function toggleVisible(thing) {
	//This function toggles the given span between visible and hidden
	thisThing = document.getElementById(thing);
	if (thisThing == null ){
		return false;
	}
	thisMenu = thisThing.style;
	if (thisMenu.display == "block" || thisMenu.display == "") {
 		thisMenu.display = "none";
	} else {
 		thisMenu.display = "block";
	}
	return false;
}

function setVisibility(thing, vis) {
	thething = document.getElementById(thing);
	if (thething == null ){
		return false;
	}
	thisMenu = thething.style;
	if (vis) {
    		thisMenu.display = "block";
	} else {
    		thisMenu.display = "none";
	}
}



function setFieldValue(field,form,value){
	var fieldName = field[0];
	switch(field[1]){
		case "date":
			if(value.substr(0,4) == "0000") {
				year_val = "";
			} else {
				year_val = value.substr(0,4);
			}

			// you know what...
			$(document[form][fieldName + 'Year'])
				.val(year_val)
				.trigger('change');

			$(document[form][fieldName + 'Month'])
				.find('option')
				.eq(parseInt(value.substr(5,2), 10)) // convert the damn string to a decimal value.
				.attr('selected', 'selected')
				.trigger('change');

			if(value.substr(8,2) == "00") {
				day_val = "";
			} else {
				day_val = value.substr(8,2);
			}

			$(document[form][fieldName + 'Day'])
				.val(day_val)
				.trigger('change');

			break;

		case "date_time":
			if(value.substr(0,4) == "0000") {
				year_val = "";
			} else {
				year_val = value.substr(0,4);
			}
			eval('document.'+form+'.'+fieldName+'Year.value = year_val;');
			eval('document.'+form+'.'+fieldName+'Month.selectedIndex = value.substr(5,2);');
			if(value.substr(8,2) == "00") {
				day_val = "";
			} else {
				day_val = value.substr(8,2);
			}
			eval('document.'+form+'.'+fieldName+'Day.value = day_val') ;
			// no break, because the time values should be used as well.
		case "time":
			if (value == "0000-00-00 00:00:00"){
				eval('document.'+form+'.'+fieldName+'Hours.value = \'\'; ');
				eval('document.'+form+'.'+fieldName+'Minutes.value = \'\';');
				if (eval('document.'+form+'.'+fieldName+'Seconds')!= null){
					eval('document.'+form+'.'+fieldName+'Seconds.value = \'\';');
				}
				return; // don't set values (i.e. 00 for hour, 00 for minute etc) if the values are all null
			}
			eval('document.'+form+'.'+fieldName+'Hours.value = value.substr(11,2); ');
			eval('document.'+form+'.'+fieldName+'Minutes.value = value.substr(14,2);');
			if (eval('document.'+form+'.'+fieldName+'Seconds')!= null){
				eval('document.'+form+'.'+fieldName+'Seconds.value = value.substr(17,2);');
			}
			break;
		case "day":
		case "single_select":
			var found = false;
			var ParentMenu = Array();
			var theSelect = eval('document.'+form+'.'+fieldName);
			while(!found){

				for (i = 0; i < theSelect.length; i++){
					if (theSelect[i].value == value){
						found = true;
						theSelect[i].selected = true;
						break;
					} // if eval
				} // for (i = 0 )

				// if the value was not found, and there is a 'Values' array, it means that this select is a subselect
				if (!found && typeof(fieldName) !=  'undefined'){
					if (typeof(ParentMenu['name']) == 'undefined'){// if no parent has been found, search.
						for (i in ChildMenus){// cycle through the parent menus
							if (i == 'is_subselect')
								continue;
							for(j in ChildMenus[i]){ // cycle through each of the child menus for the parent menu
								if (ChildMenus[i][j] == fieldName){ // if it matches
									ParentMenu['name'] = document.getElementById(i);
									ParentMenu['orig'] = ParentMenu['name'].selectedIndex;
									ParentMenu['pos'] = 0;
									break;
								}	// if childmenus[i][j]
							} // for j in Child..[i]
						} // for (i in ChildMenus)

						if (typeof(ParentMenu['name']) == 'undefined'){
							theSelect[0].selected = true;
							break;
						}
					} // if (ParentMenu.length)
					else
					{	// if all else fails, then we might just be looking at the wrong thing.
						if (!found && theSelect.options.length == 0 && value == ''){// if the value should be empty, and the
							found = true;
							break;
						}

						if(ParentMenu['pos'] +1 >= ParentMenu['name'].length){
							ParentMenu['name'].selectedIndex = ParentMenu['orig'];
							ParentMenu['name'].onchange();
							break;// could not find the value. such a pitty
						}else
							ParentMenu['pos']++;
					}//else

					ParentMenu['name'].selectedIndex = ParentMenu['pos'];
					ParentMenu['name'].onchange();
				}// if !found
			}

			//Notify that a single select was changed just in case child menus have to be updated
			eval('notifySelectChange(theSelect,\'' + form + '\')');

			// we don't really want people to see them populate..
			if (document.readyState === 'complete' && typeof $.fn.uniform !== 'undefined') {
				$(theSelect).uniform('update');
			}

			break;
		case "checkbox":
			eval('document.'+form+'.'+fieldName+'.checked = ("'+value+'" == "1");');
			break;
		case "constant":
			break;
		case "radio":
			setRadioChange(fieldName, value);
			break;
		default:
			result = eval('document.'+form+'.'+fieldName+'.value = value;');
	}

}

function getFieldValue(field, form){
  var fieldName = field[0];
  var result = '';

  switch(field[1]){
	case "date":
		year_val = eval('document.'+form+'.'+fieldName+'Year.value');
		if(year_val != '') {
			result += year_val+'-';
		} else {
			result += "0000-";
		}
		if (String(eval('document.'+form+'.'+fieldName+'Month.selectedIndex')).length < 2)
			result += '0';

		result += eval('document.'+form+'.'+fieldName+'Month.selectedIndex')+'-';

		day_val = eval('document.'+form+'.'+fieldName+'Day.value');
		if(day_val != '') {
			result += day_val;
		} else {
			result += "00";
		}

		break;

		case "day":
		case "single_select":
			result = "";
			if (eval('document.'+form+'.'+fieldName+'.selectedIndex != -1'))
				result = eval('document.'+form+'.'+fieldName+'[document.'+form+'.'+fieldName+'.selectedIndex].value');
			break;

		case "date_time":
			year_val = eval('document.'+form+'.'+fieldName+'Year.value');
			if(year_val != '') {
				result += year_val+'-';
			} else {
				result += "0000-";
			}
			if (String(eval('document.'+form+'.'+fieldName+'Month.selectedIndex')).length < 2)
				result += '0';

			result += eval('document.'+form+'.'+fieldName+'Month.selectedIndex')+'-';

			day_val = eval('document.'+form+'.'+fieldName+'Day.value');
			if(day_val != '') {
				result += day_val;
			} else {
				result += "00";
			}
			result += ' ';
			if (String(eval('document.'+form+'.'+fieldName+'Hours.value')).length == 0)
				result += '00:';
			else{
				if (String(eval('document.'+form+'.'+fieldName+'Hours.value')).length < 2)
					result += '0';
				result += eval('document.'+form+'.'+fieldName+'Hours.value')+':';
			}

			if (String(eval('document.'+form+'.'+fieldName+'Minutes.value')).length == 0)
				result += "00:";
			else{
				if (String(eval('document.'+form+'.'+fieldName+'Minutes.value')).length < 2)
					result += '0';
				result += eval('document.'+form+'.'+fieldName+'Minutes.value')+':';
			}

			if (eval('document.'+form+'.'+fieldName+'Seconds')!= null){
				if (String(eval('document.'+form+'.'+fieldName+'Seconds.value')).length == 0)
					result += "00";
				else {
					if (String(eval('document.'+form+'.'+fieldName+'Seconds.value')).length < 2)
						result += '0';
					result += eval('document.'+form+'.'+fieldName+'Seconds.value');
				}
			}else
				result += '00';

			break;

		case "time":
			result = '0000-00-00 ';
			if (String(eval('document.'+form+'.'+fieldName+'Hours.value')).length == 0)
				result += '00:';
			else{
				if (String(eval('document.'+form+'.'+fieldName+'Hours.value')).length < 2)
					result += '0';
				result += eval('document.'+form+'.'+fieldName+'Hours.value')+':';
			}

			if (String(eval('document.'+form+'.'+fieldName+'Minutes.value')).length == 0)
				result += "00:";
			else{
				if (String(eval('document.'+form+'.'+fieldName+'Minutes.value')).length < 2)
					result += '0';
				result += eval('document.'+form+'.'+fieldName+'Minutes.value')+':';
			}

			if (eval('document.'+form+'.'+fieldName+'Seconds')!= null){
				if (String(eval('document.'+form+'.'+fieldName+'Seconds.value')).length == 0)
					result += "00";
				else {
					if (String(eval('document.'+form+'.'+fieldName+'Seconds.value')).length < 2)
						result += '0';
					result += eval('document.'+form+'.'+fieldName+'Seconds.value');
				}
			}else
				result += '00';
			break;
		case "checkbox":
			if (eval('document.'+form+'.'+fieldName+'.checked'))
				result = '1';
			else
				result = '0';
			break;
		case "radio":
			result = eval('document.'+form+'.'+fieldName+'.value');
			break;
		case "constant":
				result = fieldName;
				break;
		default:
			result = eval('document.'+form+'.'+fieldName+'.value');
  }
  return result;
}

function clearFieldValue(field, form){
	var fieldName = field[0];
	switch(field[1]){
		case "date":
			$(document[form][fieldName + 'Year']).val('');
			$(document[form][fieldName + 'Month'])
				.find('option')
				.removeAttr('selected');

			var $select = $(document[form][fieldName + 'Month']);

				$select
					.find('option')
					.removeAttr('selected')
					.parent()
					.find('option:eq(0)')
					.attr('selected', 'selected')
					.parent()
					.trigger('change');

			$(document[form][fieldName + 'Day']).val('');

			break;
		case "day":
		case "single_select":// days are anyways single selects?
			eval('document.'+form+'.'+fieldName+'.selectedIndex  = 0;');
			//remeber to notifySelect change
			eval('notifySelectChange(document.' + form + '.'+fieldName+',\'' + form + '\')');

			// we really need dependancy injection of some kind..
			if (typeof $.fn.uniform !== 'undefined') {
				$(document[form][fieldName]).uniform('update');
			}

			break;
		case "date_time":
			eval('document.'+form+'.'+fieldName+'Year.value = \'\'');
			eval('document.'+form+'.'+fieldName+'Month.selectedIndex = 0');
			eval('document.'+form+'.'+fieldName+'Day.value = \'\';');
		case "time":
			eval('document.'+form+'.'+fieldName+'Hours.value = \'\';');
			eval('document.'+form+'.'+fieldName+'Minutes.value = \'\';');
			if (eval('document.'+form+'.'+fieldName+'Seconds')!= null)
				eval('document.'+form+'.'+fieldName+'Seconds.value = \'\';');
			break;
		case "checkbox":
			eval('document.'+form+'.'+fieldName+'.checked = false;');
			break;
		case "constant":// constants should not be cleared.
			break;
		case "radio":
			setRadioChange(fieldName,"");
		break;

		default:// default things that have a .value property and are not special multi-input thingies, are all treated the same.
			eval('document.'+form+'.'+fieldName+'.value = \'\';');
	}
}



function checkContainerEmpty(id){
	eval('form = '+id+'Form;');        // gets the form that the fields are stored in.
	eval('fields = '+id+'Fields;');   // gets the array that stores the fields to add.
	eval('display = '+id+'Display;');// gets the display string array for this id
	eval('editID = '+id+'EditID;'); // gets the current Edit ID for this id
	eval('delim = '+id+'Delim;');  // gets the array delimeters for this id
	eval('uniq = '+id+'Unique;'); // gets the array delimeters for this id
	eval('defaults = '+id+'Defaults;');          // gets the form that the fields are stored in.
	msg = "";

	if (editID != -1){
		msg = "  - "+eval(id+'Label')+" has unsaved data.  Please click Save or Cancel first.\n";
	}

	for (i = 0; i < fields.length; i++){
		if (fields[i][1] == "constant" || fields[i][1] == "radio"){// skip constants...
		  continue;
		}
		val = getFieldValue(fields[i],form);

		if (fields[i][1] == "single_select" || fields[i][1] == "day"){
			element = document.getElementById(fields[i][0]);

			if (element.selectedIndex <= 0 || element[element.selectedIndex].value == defaults[fields[i][0]]){
				continue;
			}else{
				msg = "  - "+eval(id+'Label')+" has unsaved data.  Please click Save or Cancel first.\n";
				break;
			}
		}

		if (val != null){
			if (val != 0 && val != '' && val != '0000-00-00' && val != '0000-00-00 00:00:00' && val != '0' && val != false && val != defaults[fields[i][0]]){
				msg = "  - "+eval(id+'Label')+" has unsaved data.  Please click Save or Cancel first.\n";
				break;
			}
		}
	}
	return msg;
}

/**
 * Yeah, this is the way how to implement to Containers' validation
 * functions. Note, this is the now-we're-stuck-with-it legacy way.
 * So far as I understand, this all gets called from JS rendered by PHP!
 *
 * 		The WTF MO being: "Convenient"... "less duplication that way." - Allie
 * --
 * {id}fields is in the format : array(array('field_name','field_type'),array('field_name','field_type'))
 * {id}form is the name of the form that this function should work with
 * {id}display is the display format that the select should be populated in.
 * format: array('field_name',[,'field_name']);
 * {id}EditID is the currenlty edited id. -1 means not edited.
 * {id}Label is the label given for the container thing.
 * --
 */
function doSaveContainer(id){
	$(document).ready(function(){
	eval('var ValidFunc = '+id+'ValidFunc');

	if (ValidFunc != ''){
		var result = eval(ValidFunc);

		if (typeof(result) == 'boolean' && result == false){
			return false; // the validation function returned false;
		}
		if (typeof(result) == 'string' && result != ""){
			alert("Please correct the following:\n"+result);  // the validation fuction was a child function, thus returning a string, this is an errrrror
			return false;// always return false. this form should never trigger a submit.
		}
	}

	eval('ajaxFunction = '+id+'AjaxFunction;');        // gets the form that the fields are stored in.
	eval('form = '+id+'Form;');        // gets the form that the fields are stored in.
	eval('fields = '+id+'Fields;');   // gets the array that stores the fields to add.
	eval('display = '+id+'Display;');// gets the display string array for this id
	eval('editID = '+id+'EditID;'); // gets the current Edit ID for this id
	eval('delim = '+id+'Delim;');  // gets the array delimeters for this id
	eval('uniq = '+id+'Unique;'); // gets the primary key fields
	eval('edited = '+id+'Edited;'); // gets the array of dirty flags for this id

	//Build the string to put into the value field
	str = "";
	for (i = 0; i < fields.length; i++){
		if (fields[i][1] == "constant"){
		  str += fields[i][0]+delim[1];
		  continue;
		}
		val = getFieldValue(fields[i],form);
		if (val != null){
		  if (i != 0)
		    str += delim[1];
		  str += val;
		}
	}
	var unique = true;
	if (editID == -1){//this is an add
		editID = eval('document.'+form+'.'+id+'Select.length');
		eval(id+'EditID = editID;');
		if (uniq.length> 0){  //start checking for unique value duplicates.
				exploded = eval('document.'+form+'.'+id+'.value.split(delim[0])');
			for (row = 0; row < exploded.length && unique > 0; row++){
				unique = uniq.length;
				exploded2 = exploded[row].split(delim[1]);
				for (pos = 0; pos < uniq.length && unique > 0; pos++){
					thePos = parseInt(uniq[pos]);
					val = getFieldValue(fields[thePos],form);

					if (thePos < exploded2.length && val == exploded2[thePos]){ // Don't allow any duplicates if vacancy is a temp position and the candidate and date are equal
						if (vac_type == "2" && getFieldValue(fields[0],form) == exploded2[0] && getFieldValue(fields[1],form) == exploded2[1] ) {
							unique = 0;
						} else {
							unique--;
						}

					}
				}
				if (unique == 0){
			        var dialogv = $('<div style="display: none" title="Duplicate Entry"><img src="/img/icons/stop32.png" style="float: left; margin-right :10px;" />The '+eval(id+'Label')+' already exists.  Please ensure that no duplicates are present in your selection.</div>');
			        dialogv.dialog({
                        modal : true,
                        autoOpen: true,
                        height: "150",
                        width: "450",
                        closeOnEscape: true,
                        draggable: false,
                        resizable: false,
                        buttons: [ { text: "Ok", click: function() { $( this ).dialog( "close" ); } } ]
			        });					
					editID = -1;// because it's not being added, editID should be reset.
					eval(id+'EditID = -1;');
					return false;
				}
			}
		}

		eval('content_holder = \'#'+id+'\'');
		var values = $(content_holder).attr('value');

		if (values != ''){
			save_me = delim[0] + str;
		} else {
			save_me = str;
		}

		/**
		 * CREATE
		 * The new ajax method.
		 */
		container_map = $('input#container_map').val(); //Definition of table structure.
		container_table = $('input#container_table').val(); //Table name.
		container_label = $('input#container_label').val(); //English label.
		container_ref_field = $('input#container_ref_fields').val();
		autonum_map = $('input#autonum_map').val();
		if(container_map && str && container_ref_field){
			create_arguments = {'action': 'create',
								'container_label': container_label,
								'container_table': container_table,
								'container_ref_field': container_ref_field,
								'container_map': container_map,
								'autonum_map': autonum_map,
								'new_row': str,
								'delimiter': delim[1]};
			var receipt = null;
			$('body').spinner(['', '<br />Saving...']); //It's important that the spinner is called before jQuery messes with the target element's attributes.

			// Well then... Duplication does occur when pages are slow.
			// Fixing the duplication issues by removing the onclick event on the "Save" button until
			// the ajax request is finsihed, and then re-adding it.
			// P.S. A better method would be to actually show the spinner with an overlay
			// over the button so that they can't be clicked..
			// - Ferdi

			// Remove control buttons' functionailty
			$('#container_control').each(function(k, v){
				$(v).prop('disabled', true);
				$(v).val('Saving...');
				return false; // Not needed, but since we just the same ID for *all* the buttons...
			});


			$.post('../ajax/container_catcher.php',create_arguments,function(data){
				receipt = data;
				$('#notice').spinner('remove');
				save_me = save_me + delim[1] + receipt.key;
				$(content_holder).attr('value',values + save_me);
				populateSelect(id);
				clearAllFields(id);

				// restore control buttons
				$('#container_control').each(function(k, v){
					$(v).prop('disabled', false);
					$(v).val('Add/Save');
					return false; // Not needed, but since we just the same ID for *all* the buttons...
				});
				// remove spinner
				$('body').spinner('remove');
			}, 'json');
		} else {
		/**
		 * The original.
		 */
			$(content_holder).attr('value',values + save_me);
			populateSelect(id);
			// clears all the fields.
			clearAllFields(id);
		}
		//Reset the EditID to -1;
		eval(id+'EditID = -1;');
		return false;// always return false. this form should never trigger a submit.
	} else {
		if (uniq.length> 0) {  //start checking for unique value duplicates.
			eval('content_holder = \'#'+id+'\'');
			var values = $(content_holder).attr('value');
			exploded = values.split(delim[0]);

			for (row = 0; row < exploded.length && unique > 0; row++){
				if (editID == row)// don't try to compare the editing row to itself.
					continue;
				unique = uniq.length;
				exploded2 = exploded[row].split(delim[1]);
				for (pos = 0; pos < uniq.length && unique > 0; pos++){
					thePos = parseInt(uniq[pos]);
					val = getFieldValue(fields[thePos],form);
					if (thePos < exploded2.length && val == exploded2[thePos]){
						unique--;
					}
				}
				if (unique == 0){
					alert('This '+eval(id+'Label')+' already exists.');
					return false;
				}
			}

		}

		var values = $(content_holder).attr('value');
		exploded = values.split(delim[0]);

		// Fixing the duplication issues by removing the onclick event on the "Save" button until
		// Remove control buttons' functionailty
		$('#container_control').each(function(k, v){
			$(v).prop('disabled', true);
			$(v).val('Saving...');
			return false; // Not needed, but since we just the same ID for *all* the buttons...
		});			
					
		/**
		 * UPDATE
		 * The new ajax method.
		 */
		key = $('input#key').val();
		container_map = $('input#container_map').val();
		container_table = $('input#container_table').val();
		container_ref_field = $('input#container_ref_fields').val();
		container_label = $('input#container_label').val(); //English label.
		if(container_map && key && str) {
			key_value = exploded[editID].split(delim[1]).pop(); //currently only supports one key (the last value).
			$('#notice').spinner({position: 'center'});
			update_arguments = {'action': 'update',
				'key': key,
				'key_value': key_value,
				'updated_row': str,
				'container_map': container_map,
				'container_table': container_table,
				'container_label': container_label,
				'container_ref_field': container_ref_field,
				'delimiter': delim[1]};
			$.post('../ajax/container_catcher.php',update_arguments,function(data){

				// restore control buttons
				$('#container_control').each(function(k, v){
					$(v).prop('disabled', false);
					$(v).val('Add/Save');
					return false; // Not needed, but since we just the same ID for *all* the buttons...
				});									
				$('#notice').spinner('remove');

				/**
				 * New
				 */
				str = str + delim[1] + key_value; //Restore so we can re-edit.
				exploded[editID] = str;
				to_be_saved = exploded.join(delim[0]);
				$(content_holder).attr('value', to_be_saved);
				populateSelect(id);
				clearAllFields(id);
			}, 'json');

		} else {
		/**
		 * The original.
		 */
			exploded[editID] = str;
			to_be_saved = exploded.join(delim[0]);
			$(content_holder).attr('value', to_be_saved);
			populateSelect(id);
			clearAllFields(id);

			// restore control buttons
			$('#container_control').each(function(k, v){
				$(v).prop('disabled', false);
				$(v).val('Add/Save');
				return false; // Not needed, but since we just the same ID for *all* the buttons...
			});										
		}
	}

	eval(id+'EditButton.value = "Edit"');
	if (ajaxFunction == ''){
		edited[editID] = 1;
	}
	//Reset the EditID to -1;
	eval(id+'EditID = -1;');
	return false;// always return false. this form should never trigger a submit.
	});
}

function getContainerSelectedData(id){
	eval('form = '+id+'Form;');        // gets the form that the fields are stored in.
	eval('delim = '+id+'Delim;');  // gets the array delimeters for this id
	eval('defaults = '+id+'Defaults;');          // gets the form that the fields are stored in.
	eval ('values = document.getElementById(\''+id+'\').getAttribute(\'value\');');  // gets the imploded array from the form
	eval('edited = '+id+'Edited;'); // gets the array of dirty flags for this id
	eval('editID = '+id+'EditID;'); // get the edit ID

	var index = eval('document.'+form+'.'+id+'Select.selectedIndex');
	if (index == -1){  //BAD BAD BAD!!!
		alert('Please select a '+eval(id+'Label')+' first.');
		return false;
	}

	if (editID == index){
		alert('You are busy editing the selected '+eval(id+'Label')+'.\nPlease Save your changes first and click Apply or click Cancel.');
		return false;
	}

	if (edited[index] != 0){
		alert('You have not saved the selected '+eval(id+'Label')+'.\nPlease save by clicking Apply.');
		return false;
	}

	rows = values.split(delim[0]);// splits the implodeded array into rows
	// get the cols for the selected ID

	return rows[index].split(delim[1]); // splits the imploded row into cols
}

function doEditContainer(id){
	$(document).ready(function(){
	eval('form = '+id+'Form;');                                         // gets the form that the fields are stored in.

	if (eval('document.'+form+'.'+id+'Select.selectedIndex == -1')){  //BAD BAD BAD!!!
		alert('Please select a '+eval(id+'Label')+' to edit.');
		return false;
	}

	eval('form_fields = '+id+'Fields;');
	// gets the array that stores the fields to add.
	eval('display = '+id+'Display;');    // gets the display string array for this id
	//eval('editID = '+id+'EditID;');   // gets the current Edit ID for this id  // need to write to the original
	eval('delim = '+id+'Delim;');      // gets the array delimeters for this id

		eval('content_holder = \'#'+id+'\'');
		var values = $(content_holder).attr('value');

	eval (id+'EditID = document.'+form+'.'+id+'Select.selectedIndex;');

	rows = values.split(delim[0]);// splits the implodeded array into rows
	// get the cols for the selected ID
	cols = rows[eval('document.'+form+'.'+id+'Select.selectedIndex;')].split(delim[1]); // splits the imploded row into cols

	for (field_idx = 0; field_idx < form_fields.length; field_idx++){            // for each of the entries in fields, populate the form
		if (fields[field_idx][1] != "constant"){              // if the field value is a constant and not linked to any input, skip it!
			if (typeof(cols[field_idx]) == 'undefined')
				setFieldValue(form_fields[field_idx], form, '');
			else
				setFieldValue(form_fields[field_idx], form, cols[field_idx]);  // sets the field with name fields[0], in form form, to cols[i]
		}
	}

	return false;// always return false. this form should never trigger a submit.
	});
}

function doDeleteContainer(id){
	$(document).ready(function(){
	var remove_me = null;
	eval('form = '+id+'Form;');   // gets the form that the fields are stored in.
	eval('delim = '+id+'Delim;');// gets the array delimeters for this id
	eval('ajaxFunction = '+id+'AjaxFunction;');        // gets the ajax function.
	eval('edited = '+id+'Edited;'); // gets the array of dirty flags for this id

	if (eval (id+'EditID != -1')){
		alert('You cannot delete while editing.\nPlease click Save or Cancel first.');
		return false;
	}

	if (eval('document.'+form+'.'+id+'Select.selectedIndex == -1')){// no thing selected
		alert('Please select a '+eval(id+'Label')+' to delete.');
		return;
	} else {// some thing selected.
		if (confirm('Are you sure you want to delete the selected '+eval(id+'Label')+'?')){           // confirm please
            eval('num_options = document.'+form+'.'+id+'Select.length');                                                                             // Determine the number of option in the select field
	   			eval('content_holder = \'#'+id+'\'');
				var arr = $(content_holder).attr('value').split(delim[0]); // get the arr from the hidden value.
            for(pos = num_options-1; pos >= 0; pos--) {
                eval('OptionIsSelected = document.'+form+'.'+id+'Select.options['+pos+'].selected');
                if(OptionIsSelected) {
        			/**
        			 * DELETE
        			 */
                	remove_me = arr[pos];
	            		//$(document).ready(function(){
            				exploded = remove_me.split((delim[1]));
            				key_value = exploded.pop(); //currently only supports one key (the last value).
            				key = $('input#key').val();
            				container_table = $('input#container_table').val();
            				container_label = $('input#container_label').val(); //English label.
            				if(key_value && key && container_table){
            					delete_arguments = {'action': 'delete',
            										'key': key,
            										'key_value': key_value,
            										'container_label': container_label,
            										'container_table': container_table};
            					$('#notice').spinner({position: 'left'});
            					$.post('../ajax/container_catcher.php',delete_arguments,function(data){
            						$('#notice').spinner('remove');
            					}, 'json');
            				}
	            		//});

            		/*
            		 * The original.
            		 */
                	arr.splice(pos,1);	//Remove the offending thingy from the hidden value array
	        			$(content_holder).attr('value', arr.join(delim[0])); //Store the new fixed string.
        			eval('document.'+form+'.'+id+'Select.options[pos] = null;'); //Remove the offending entry from the select.
        			edited.splice(pos,1);
                }
            }
		}
	}
	return false;// always return false. this form should never trigger a submit.
	});
}

function toggleContainerEditCancel(id,button){
	eval('form = '+id+'Form;');          // gets the form that the fields are stored in.
	eval(id+'EditButton = button');
	if (button.value == 'Edit'){
		doEditContainer(id);
		if (eval('document.'+form+'.'+id+'Select.selectedIndex != -1'))
			button.value = 'Cancel';
	}else{
		clearAllFields(id);
		eval(id+'EditID = -1;');
		eval('document.'+form+'.'+id+'Select.selectedIndex = -1');
		button.value = 'Edit';
	}

	eval('hook = '+id+'EditCancelFunction;');      // gets the array delimeters for this id

	if (hook != ''){
		eval(hook+'()');
	}
}

function populateSelect(id){
	$(document).ready(function(){
	//This function will creat the display string from the data string hidden field
	eval('form = '+id+'Form;');          // gets the form that the fields are stored in.
	eval('delim = '+id+'Delim;');       // gets the array delimeters for this id
	eval('fields = '+id+'Fields;');    // gets the array that stores the fields to add.
	eval('display_fields = '+id+'Display;'); // gets the display string array for this id
	eval('display_settings = '+id+'DisplaySettings;');
	eval('editID = '+id+'EditID;'); // gets the current Edit ID for this id
	eval('edited = '+id+'Edited;'); // gets the array of dirty flags for this id
		eval('content_holder = \'#'+id+'\'');


	//if the display string is empty - dont bother to continue
		var content = $(content_holder).attr('value');
		if (!content) {
		return;
	}
		explod = content.split(delim[0]);

	if (edited.length == 0){
		for (i = 0; i < explod.length; ++i){
			edited[i] = 0;
		}
	}

	select = eval ('document.'+form+'.'+id+'Select');              //get the select

	//Clean out the closet before we start - NOTE always do this from the back forward

	start = 0; end = explod.length;
	if (editID == -1){
		for(select_idx = select.length; select_idx >= 0; --select_idx) {
			select.options[select_idx] = null;
		}
	}else{
		start = editID;
		end = editID+1;
	}

	for (row = start; row < end; row++){
		field = explod[row].split(delim[1]);
		dispstr = '';                             //the string that will be displayed in the select
		for (display_str_entry = 0; display_str_entry < display_fields.length; display_str_entry++){    // run through the display entries.
			found = false;
			display_fields_entry = display_fields[display_str_entry];

			for (display_field_index = 0; display_field_index < fields.length; display_field_index++){//check if the display entry is actually a field
				if (fields[display_field_index][0] == display_fields_entry){ // if  the field is found, break out of the loop
						found = true;
						break;
					}
				}  // for k

			if (found) {
				//Now check if we need to do anything to this fields and what
				//Check if this field is in the display settings array
				display_settings_entry = -1;
				for(disp_idx = 0; disp_idx < display_settings.length; ++disp_idx){
					if(display_settings[disp_idx][0] == display_fields_entry) {
						display_settings_entry = display_settings[disp_idx];
						break;
					}
				} // for disp_idx

				if(display_settings_entry != -1) {
					//Do what is nessesary to the field
					switch(display_settings_entry[1]){  //Check the type of settings
						case "label_lookup":
								//we need to lookup a label, where do we have to check
								switch(display_settings_entry[2]) {
									case "array":
										//Lookup the label
										the_array = eval(display_settings_entry[3]);
										arr_length = the_array.length;
										comp_idx = eval(display_settings_entry[4]);
										label_idx = eval(display_settings_entry[5]);

										for(arr_idx = 1; arr_idx < arr_length; ++arr_idx) {
											if(the_array[arr_idx][comp_idx] == field[display_field_index]) {
												dispstr += the_array[arr_idx][label_idx];
											}
										}
										break;

										case "menu":// in case you want to use the text of the select instead of the value.
											eval('theSelect = document.'+form+'.'+display_fields_entry+'.options');  //get the options array
											if (theSelect.length == 0 || eval('document.'+form+'.'+display_fields_entry+'.value != field[display_field_index]')){// the selected option is NOT the right field (happens when page loads).
												item_label = "";

												for (pos = 0; pos < theSelect.length; pos++ ){ //cycle through the options
													if (theSelect[pos].value == field[display_field_index]){ // if the value is the value of the field
														item_label = theSelect[pos].text; // then we want to use that text
														break; // of course, this breaks if there are multiple 'options' with the same value
													}
												}

												if (pos == theSelect.length){
													// the entry was not found in the select, which means it is probably a subselect.
													//Time for more drastic measures.  use getFieldValue and setFieldValue to get the correct value.
													oldvalue = getFieldValue(Array(display_fields_entry, 'single_select'),form);
													setFieldValue(Array(display_fields_entry, 'single_select'),form,field[display_field_index]);
													if (theSelect.selectedIndex != -1){
														item_label = theSelect[theSelect.selectedIndex].text;
													}else{
														item_label = '???';
													}
													setFieldValue(Array(display_fields_entry, 'single_select'),form,oldvalue);
												}
												//item_label = eval('document.'+form+'.'+display[j]+'.options[' + field[k] + '].text');//left here for reference
												dispstr += item_label;  // append to the options
											}else{ // the selected option IS the correct option. so we dont have to search for it.
												eval('dispstr += document.'+form+'.'+display_fields_entry+'[document.'+form+'.'+display_fields_entry+'.selectedIndex].text');
											}
										break;

									default:
										dispstr += 'Dont know where to get this label';
										break;
								}
							break;

						case "if":
							//This is an if situation
							condition = eval("field[display_field_index]"+display_settings_entry[2]);
							if(condition) {
								dispstr += display_settings_entry[3];
							} else {
								if(display_settings_entry[4] != null) {
									dispstr += display_settings_entry[4];
								} else {
										dispstr += field[display_field_index];// the display entry was found in fields, thus it should be populated by the corresponding entry in the field arr
								}
							}
							break;

						default:
							dispstr += field[display_field_index];// the display entry was found in fields, thus it should be populated by the corresponding entry in the field arr
							break;
					}
				} else {
					dispstr += field[display_field_index];// the display entry was found in fields, thus it should be populated by the corresponding entry in the field arr
				}

			} else {
				dispstr += display_fields_entry;  // the display entry was not found in fields, thus it is a constant and should be added as such.
			}  // found
		}  //for j
		if (editID == -1){
			select[select.length] = new Option(dispstr, select.length);
		}else{
			select[editID] = new Option(dispstr, select.length);
		}
	} // for row
	});
}

function clearAllFields(id){

	eval('form = '+id+'Form;');            // gets the form that the fields are stored in.
	eval('fields = '+id+'Fields;');       // gets the array that stores the fields to add.
	eval('defaults = '+id+'Defaults;');          // gets the form that the fields are stored in.
	for (a = 0; a < fields.length; a++){  // cycle through all inputs

		if (typeof(defaults[fields[a][0]])!= "undefined"){
			setFieldValue(fields[a],form, defaults[fields[a][0]]);  // clears the forms.
		}else{
			clearFieldValue(fields[a],form);  // clears the forms.
		}
	}
	return false;                      // always return false. this form should never trigger a submit.
}

function setFieldsByIdNumber(form, id_field, gender_field, dob_field) {
	//This function will set the gender drop down box to the gender that corresponds to the given id number
	//This function should be called on the OnBlur event of the id field
	//jump_focus can be used to set the focus of the nect field after this function has run

    //NB!! This function assumes that the gender drop down has a 0 option that is something like 'please select'

	// I WILL KEEL YOU, if this eval thing is /ever/ done again.

	//Do gender if the gender box is specified


	if(gender_field != null) {
		// there's two way's we can pass a reference of something to jQuery.
		// I'm using the object itself.
		var gender_sel = document[form][gender_field],
			$gender = $(gender_sel);

	    switch(getGender(document[form][id_field].value)) {

			case "F":
				$gender
					.find('option:eq(2)')
					.attr('selected', 'selected')
					.trigger('change');
				break;

			case "M":
				$gender
					.find('option:eq(1)')
					.attr('selected', 'selected')
					.trigger('change');
				break;

			default:
				// Transexual; we're not going anywhere near that.
	    }
	}

	//Get date of birth if required.
	if(dob_field != "") {
		var field = new Array(dob_field, 'date');
		setFieldValue(field, form, getDateOfBirth(eval('document.' + form + '.' + id_field + '.value')));
	}
}

function setRadioChange(group, value){
	eval('moo = '+group+'Arr');

	rad_but = document.getElementById(group+'_'+value);
	if (rad_but == null){
		return;
	}

	for (i = 0; i < moo.length; i++){
		rad_but = document.getElementById(group+'_'+moo[i]);
		if (moo[i] == value){
			rad_but.checked = true;
		}else{
			rad_but.checked = false;
		}
	}
	var parent = document.getElementById(group);
	parent.value= value;
}

function round(num, des){
    scale = 1;
    for(i = 0; i < des; i++) {
        scale = scale * 10;
    }
    return Math.round(num * scale) / scale;
}

function formatTelNumber(recipient){
    //This function will take a valid telephone number and return a propper
    // vodazone cell number for sms transmittal
    return recipient;
}

function validCellNumber(thing,label){
	
    parts = thing.split(" ");// split the number
	thing = parts.join("");// than join it again without the spaces
    var regexTest = /^(?=.{8,20}$)([0-9\(\)\/\+ \-]*)$/;

    //Not a valid mobile number
    if(!regexTest.test(thing)){
        return "  - " + label + " (Not a valid cellphone number. E.g. +27821231234 or 0731231234)\n";
    }else{
        return "";
    }

}

function validSACellNumber(thing, label) {
	
	// Regex for valid sa numbers
	// The expression is based on http://www.techcentral.co.za/icasa-cracks-open-06-number-range/38185/
	// there's a few errors with this expression, but for the sake of simplicity,
	// it works.
	var expression = /^(?=.{10,18}$)(0|2|\+)(2|[6-8])([0-9])([0-9\ \-\+\(\)])*$/;
	
	if (thing.length > 0 && expression.test(thing) == false) {
		return "  - " + label + " (Not a valid SA cellphone number. E.g. +27821231234 or 0731231234)\n";
	} else {
		return "";
	}
}

function isMaxLength(obj){
    var mlength=obj.getAttribute? parseInt(obj.getAttribute("maxlength")) : "";
    if (obj.getAttribute && obj.value.length>mlength)
    obj.value=obj.value.substring(0,mlength);
}

function notification_persist(choice){
	$(document).ready(function(){
		if(choice == ''){
			asked_about_messages = true;
			return $.cookie("show_messaging");
		} else {
			$.cookie("show_messaging", choice, { expires: 2 });
			if(choice == 'false'){
				$('#notice').fadeOut();
			}
		}
	});
}

// Override alert for everything that supports it.
if ($.browser.msie === false) {
	alert = function(message) {
		message = message.split('\n').join('<br />');
		message = message.replace('Please correct the following', '<strong>Please correct the following</strong>');
		$('<div />', { title: 'Notice', align: 'left' }).html(message).dialog({ modal: true });
	};
}