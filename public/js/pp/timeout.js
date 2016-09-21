$(document).ready(function(){
	
	var 
		maxTime = 3600,
		currentTime = 0,
		
		timeout = setInterval(function() {
			if (currentTime >= maxTime) {
				clearInterval(timeout);

				$('<div />', { title: 'You have been logged out', id : 'timeoutModal' })
					.html('<img src="/img/icons/warning32.png" style="float: left; margin-right :10px;margin-top:5px" /> Your session has expired.<br /><br />Please log in again to continue using Placement Partner.')
					.dialog({ 
						modal : true,
						buttons : {
							'Login again' : function() {
								window.location.replace(logout_link);
								return true;
							}
						},
						closeOnEscape: false,
						draggable: false,
						resizable: false
					});
					
					$('div[aria-labelledby="ui-dialog-title-timeoutModal"]').find('.ui-dialog-titlebar-close').remove();
			} else {
				currentTime++;
				
				// update the warning thingy each minute.
				if (currentTime % 60 === 0 && (currentTime / 60) > 45) {
					$expire_warning = $('.session_expire_warning').length === 0 
										? $('<div />').addClass('session_expire_warning').insertBefore('#user_name').end()
										: $('.session_expire_warning');
										
					// yes, ceil isn't really acurate, but what do we care. It's just for being pretty.
					$expire_warning.html('Your session will expire in less than <strong>' + (Math.floor((61 - (currentTime / 60)))) + '</strong> minutes');
					
//					console.log('Warning Timeout: ', $expire_warning);
				}
			}
		}, 1000);
});