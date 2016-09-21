$(document).ready(function(){
    
    // add a key binding to focus on search (alt+s)
    $(window).keypress(function(e) {
        if ((e.which == 47 || e.which == 63) && e.target instanceof HTMLBodyElement) {
            $('#token-input-companySearch').focus();
            
            // go away
            e.preventDefault();
            return false;
        }
    });
    
    $("#companySearch").tokenInput("ajax/company_search.php", {
        theme: "facebook",
        hintText: "Company Search",

        onAdd: function (results) {
            var cid = $("#companySearch").val();
                        
            document.location.href="update_company.php?ID="+cid;
        },

        minChars: 1,
        tokenLimit: 1,
        resultsFormatter: function(item){
            return "<li style='border-bottom: solid 1px #ddd'><div style='display: inline-block; padding-left: 6px'><div style='color:#910205;'>" + item.name + "</div><div>" + (item.Status || '!!UNKNOWN!!') + "</div><span style='color: #888; font-weight: bold'>" + (item.numUsers || 'Unknown') + "</span></div></li>";}
        }); 
}); 
