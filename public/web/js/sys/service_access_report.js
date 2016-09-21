$(document).ready(function() {

	// Call advancedtable plugin
	$("#serviceAccessListResults").advancedtable({ 
		searchField: "#search", 
		loadElement: "#loader", 
		searchCaseSensitive: false, 
		sorting: true, 
		ascImage: "/img/up.png", 
		descImage: "/img/down.png",
		rowsPerPage: 40
	});

	//Set Focus to #Name Attributes
	// *cough*, #search.
	$("#search").focus();
	$("#helpBtn").click(function(){
            var title = 'Service Access Legend';
            var msg = $("#legend").html();
            var d = $("" +
                "<div id='dialog' title='" + title + "'>" +
                        "<img src='/img/faq-icon.png' style='float: right; padding: 2px;' title='" + title + "' />" +
                        "<span style='line-height: 15px;'>" + msg + "</span>" +
                "</div>"
            );
            d.dialog({
                    autoOpen: true,
                    show: "blind",
                    hide: "blind",
                    height: 'auto',
                    width: 'auto'
            });
        });
        
}); 
