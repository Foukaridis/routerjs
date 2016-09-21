window.fbAsyncInit = function()
{
	FB.init({
		appId : '190497711117978',
		channelUrl : '//' + document.location.host + '/wi/fb_channel.html', // Channel file for x-domain comms
		status     : true,                                 // Check Facebook Login status
	});

	$('.fb-button-post').fadeTo(300, 1);
	
	$('.fb-button-post').click(function()
	{
		FB.login(function(response)
		{
			if (response.authResponse) {
				var userId = response.authResponse.userID;
				
				// call needed to regenerate authorization token
				FB.api('/' + userId + '/accounts', function(response)
				{
					var pageData = JSON.parse($.cookie('pp-facebook-app-page'));
					var authToken = false;
					var pageName = '';
											
					// already available
					if (pageData && pageData.id) {
						pageId = pageData.id;
						pageName = pageData.name;
						
						$.each(response.data, function(k, v)
						{
							if (v.id == pageId) {
								authToken = v.access_token;
							}
						});
						
						if (authToken) {
							doFacebookPostEvent(pageId, authToken, pageName);
							return;
						}
					}
					
					$('<div />', { title: 'Select a Page', 'class': 'fb-select-page-dialog'})
						.html(
							'Please select a page to post to below:<br /><br />' +
							(function(r)
							{
								var tpl = '';
								for (i in r) {
									tpl += '<input data-name="' + r[i].name + '" data-authtoken="' + r[i].access_token + '" type="radio" id="fb-page-radio-' + i + '" name="fb-page-radio" value="' + r[i].id +'" /><label for="fb-page-radio-' + i + '">' + r[i].name + '</label><br />';
								}
								
								tpl += '<br /><input type="checkbox" name="remember-me" id="remember-me"> <label for="remember-me">Always use this page when posting</label>'
								return tpl;
							})(response.data)
						).dialog({
							width: 500,
							modal: false,
							buttons: {
								'Post' : function()
								{
									pageId = $('.fb-select-page-dialog input[type="radio"]:checked').val();
									authToken = $('.fb-select-page-dialog input[type="radio"]:checked').data('authtoken');
									pageName = $('.fb-select-page-dialog input[type="radio"]:checked').data('name');
									
									if (!pageId) {
										alert('Please select a page!');
										return;
									}

									if ($('.fb-select-page-dialog input[type="checkbox"]').prop('checked')) {
										$.cookie('pp-facebook-app-page', { id: pageId, name: pageName }, { json: true });
									}

									$(this).dialog('destroy');
									
									// cache the id and token
									doFacebookPostEvent(pageId, authToken, pageName);
								}
							}
						});
				});
				
			} else {
				alert('You did not grant permission to use the Application.');
			}
		}, { scope : 'manage_pages,publish_stream' });
	});

	function doFacebookPostEvent(pageId, authToken, pageName) {
		// Additional initialization code such as adding Event Listeners goes here
		var islive = $('.fb-button-post').data('islive');
		var description = $('.fb-button-post').data('description');
		var title = $('.fb-button-post').data('title');
		var link = $('.fb-button-post').data('link');
		var picture = $('.fb-button-post').data('pic');
		
		if (!islive) {
			alert('Cannot post to Facebook if advert is not live.');
			return;
		}
		
		$('<div />', { title: 'Please wait...', 'class': 'fb-posting-dialog'}).html(
			'<div style="text-align: center">' +
			'	<br /><img src="/img/pp_wait.gif" /><br />' +
			'	<br />Posting to <strong>' + pageName + '</strong>...' +
			'</div>'
		).dialog();
		
		FB.api('/' + pageId + '/feed', 'POST', {
			access_token : authToken,
			name : title,
			caption : title,
			description : description,
			link : link,
			picture : picture
		},

		// fn, "cb" - callback
		function(response)
		{
			if (response && response.id) {
				$('.fb-posting-dialog').dialog('destroy');
				$('<div />', { title: 'Successfully Posted'}).html(
					'The advert has been posted successfully.'
				).dialog({buttons: { 'Close' : function() { $(this).dialog('destroy'); }}});
			} else {
				$('.fb-posting-dialog').find('div').fadeOut().end().parent().html(
					'Something went wrong while trying to post your advert.<br/>' +
					'Please try again later.'
				).dialog({buttons: { 'Close' : function() { $(this).dialog('destroy'); }}});
			}
		});	
	}
};

$(document).ready(function()
{
	// Load the SDK asynchronously
	(function(d, s, id)
	{
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {
			return;
		}
		js = d.createElement(s);
		js.id = id;
		js.src = "/js/lib/facebook_all.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
});