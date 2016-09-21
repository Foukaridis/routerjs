/* 
 * TinyMCE in PP-Sys
 */
$(function() {
	$('textarea.tinymce').tinymce({
		// Location of TinyMCE script
		script_url : '/js/lib/jquery.tiny_mce/tiny_mce.js',

		// General options
		//mode : "textareas",
		theme : "advanced",
		plugins : "pagebreak,style,save,advlink,iespell,inlinepopups,preview,searchreplace,print,contextmenu,paste,directionality,noneditable,visualchars,nonbreaking,xhtmlxtras",

		// Theme options
		theme_advanced_buttons1 : "save,|,bold,italic,underline,|,justifyleft,justifycenter,justifyright,justifyfull,|,formatselect,fontselect,fontsizeselect,|,print,|,preview,|,visualaid,|,iespell,advhr,|,ltr,rtl",
        theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,hr,|,outdent,indent,blockquote,|,undo,redo,|,sub,sup,|,charmap,|,link,unlink,|,cleanup,removeformat,code,|,forecolor,backcolor",
		theme_advanced_buttons3 : "", //"hr,,|,fullscreen",
        theme_advanced_buttons4 : "",		
		theme_advanced_toolbar_location : "top",
		theme_advanced_toolbar_align : "left",
		theme_advanced_statusbar_location : "bottom",
		theme_advanced_resizing : true,
		paste_auto_cleanup_on_paste : true,
		theme_advanced_path : false,
        setup : function(ed) {
          ed.onKeyUp.add(function(ed, e) {    
				var strip = (tinyMCE.activeEditor.getContent()).replace(/(<([^>]+)>)/ig,"");
				var text = strip.split(' ').length + " Words, " +  strip.length + " Characters"
				tinymce.DOM.setHTML(tinymce.DOM.get(tinyMCE.activeEditor.id + '_path_row'), text);    
			});
		},
		
		// Skin options
        skin : "o2k7",
        skin_variant : "silver"

		// Example content CSS (should be your site CSS)
		//content_css : "css/content.css",
		
	});
});

