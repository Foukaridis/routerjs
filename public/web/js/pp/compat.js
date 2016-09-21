$(document).ready(
	function() 
	{
		$("li.menu_element + .base").hover(
			function()
			{
				$(this).find("ul.child").css('display', 'block').css('margin-left', '-11px').css('margin-top', '20px');
			},

			function()
			{
				$(this).find("ul.child").css('display', 'none');
			}
		);
	
		$('.menu_container .child a[data-url]').click(
			function(ev, ji)
			{
				helpDialog($(this).data('url'), $(this).text());
			}
		);

		// the plugin isn't registered if there's no creidts.
		if (typeof $.fn.quickSMS !== 'undefined') {
			$('a[href*="sms/sms_send.php?cell="]').each(
				function(k, v)
				{
					$(this).quickSMS();
				}
			);
		}

		// make child-parent menu items behave the same as their child anchor.
		$('.menu_element').find('.child').each(
			function(k, v)
			{
				if ($(this).find('a').length !== 1) {
					return true; // continue
				}
	
				$(this).click(function()
				{
					window.location.href = $(this).find('a').attr('href');
					return true;
				});
			}
		);

		// make tab pages cliable
		$('table.tab_page_outer tr.tab_page_header a[id^="tab"]').each(
			function(k,v)
			{
				$(v).parent().click(
					function()
					{
						$(v).trigger('click');
					}
				);
			}
		);
	}
);