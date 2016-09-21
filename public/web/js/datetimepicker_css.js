function NewCssCal(target_dateval) {
	$(document).ready(function(){
		var datepickerelement = $( "#date_picker_"+target_dateval+"" );
		var vals;
		datepickerelement.datepicker({
                    dateFormat: 'yy-m-dd',
                    changeYear: true,
                    changeMonth: true,
                    yearRange: "-65:+5"
                });
		$('#ui-datepicker-div').css('cursor','pointer').draggable();
		datepickerelement.focus();
		datepickerelement.change(function(){
			vals = datepickerelement.val().split('-');
			$('#'+target_dateval+'Year').val(vals[0]).change();;
			$('#'+target_dateval+'Month').val(vals[1]).change();;
			$('#'+target_dateval+'Day').val(vals[2]).change();;
			
		});
	});
}