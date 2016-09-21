$(document).ready(function(){
    var data;
    var table_rows = $('input[type="checkbox"]');
    var count = table_rows.length;
    var inter;
    var i;
    var place;
    var path;
    var show;
    var what;
    var gender;
    var sortbutton;
    sortbutton = $("html body form#wi_candidates_list table.list_inner tbody tr.sorted_list_header td input.sortbuttons:last");
    sortbutton.attr('value', '-').css('color', 'silver');
    for(inter = 0; inter < count;     inter++){
        candidate_id = table_rows[inter].value;
        if(candidate_id != '' && candidate_id != "undefined"){
            $.post("../ajax/duplicate_candidate_check.php", {id: candidate_id, num: inter},function(data){
                show = data;
                if(show.duplicate){
                    $("form#wi_candidates_list table.list_inner tbody tr#"+show.inter_return+" td.duplicate_check").append(show.duplicate);    
                }
                //This is to add the 'open' button which is used on the row click event for expanding and injecting more detail.
                $("form#wi_candidates_list table.list_inner tbody tr#"+show.inter_return+" td.duplicate_check").append('<div class="row_open_button" title="Click to see more info on this page.">more</div>');
                $("form#wi_candidates_list table.list_inner tbody tr#"+show.inter_return+" td.read_unread").html(show.read_unread);
                // redraw qtip on the span's title, but only if it's there..
                $("form#wi_candidates_list table.list_inner tbody tr#"+show.inter_return+" td.read_unread span[title]").qtip();
            },"json");
    }}
});