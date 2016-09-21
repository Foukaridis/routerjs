/* 
 * Help module for Placement Partner
 * 
 * @author		Ferdi Schmidt <ferdi@parallel.co.za>
 * @copyright	2012, Parallel Software.
 */
var pp = (typeof pp === 'object') ? pp : {};

pp.help = function(){
		
		var 
			$overlay = $('<div />', { id : 'modalOverlay' }),
			
			$window = $('<div />', { id : 'helpModal'}).css({
				top		: (($(window).height() / 2) - (375 / 1.2)),
				left	: (($('body').width() / 2) - 450)
			}),
			
			$header = $('<div />', {'class' : 'header'})
						.html('<span style="display:inline-block;width:15px"> </span>Helpful Resources')
		;
		
		var minmax = false,
		
			maximize = function(){
				if (minmax == true)
					return;

				minmax = true;
				
				$('#helpModal').width('900px').css({
					border: '0'
				});
				$('#helpModal').find('.navigation').show();
				$('#helpModal').find('.content');
				$('#modalOverlay').show();
				$('#helpModal').draggable('destroy');

				$('#helpModal')
					.find('.header')
					.css({
						cursor : 'default'
					})
					.parent()
					.find('.minimize')
					.find('img')
					.attr('src', '/img/icons/minus32.png')
					.unbind('click')
					.click(minimize)
					.parent()
					.parent()
					.parent()
					.css({
						'box-shadow' : '0'
					})
				;

				$window.css({
					top		: (($(window).height() / 2) - (375 / 1.2)),
					left	: (($('body').width() / 2) - 450)
				});
				
				$('#helpModal').find('.content').css({
					width: '65%',
					padding: '15px'
				});
				
				
				minmax = false;

				return false;
			},
			
			minimize = function(){
				
				if (minmax == true)
					return;

				minmax  = true;
				
				$('#helpModal').animate({
					width :'500px',
					border: 'solid 1px rgba(100,100,100,0.3)',
					top					: (($(window).height() / 2) - (375 / 1.2)),
					left				: (($('body').width() / 30))
				});
				$('#helpModal').find('.navigation').hide();
				$('#helpModal').find('.content').css({
					right : 0,
					left: 0,
					width: '470px',
					padding: '15px'
				});
				$('#modalOverlay').hide();
				$('#helpModal').draggable({
					handle : '.header'
				});

				$('#helpModal').find('.header').css({
					cursor : 'pointer'
				}).parent().find('.minimize').find('img').attr('src', '/img/icons/plus32.png').unbind('click').click(maximize).parent().parent().parent().css({
					'box-shadow' : '0 0 10px rgba(0,0,0,0.3)'
				});

				minmax = false;


				return false;
			},
			
			$minimize = $('<div />', { 'class' : 'minimize' })
				.html('<img src="/img/icons/minus32.png" style="width:16px;height:16px;cursor:pointer" />')
				.click(minimize),
				
			$close = $('<div />', { 'class' : 'close' }).html('<img src="/img/icons/block32.png" style="width:16px;height:16px;cursor:pointer" />')
				.click(function(){
				$('#modalOverlay').remove();
				$('#helpModal').remove();			
			})
		;
		
		$close.appendTo($header);
		$minimize.appendTo($header);
		
		$header.appendTo($window);
		
		var $window_navigation = $('<div />', { 'class' : 'navigation' }).html('<strong>Navigation</strong><br /><br />');		

		$.ajax({
			url: '/pp/ajax/help/navigation.php?list=1',
			dataType: 'json',
			success: function(data){
				var triggered = false;
				// gather page from context
				var section = 'general';
				if (typeof document.location.pathname.split('/')[2] === 'string') {
					section = document.location.pathname.split('/')[2];
				}
					
				var section_map = {
					'cvw' : 'candidates',
					'postbox' : 'postbox',
					'cpr' : 'clients',
					'vcs' : 'vacancies',
					'maintenance' : 'maintenace'
				};
				
				section = section_map[section];
				
				var bindVideo = function(elm) {
				    $(elm).find('a[data-video]').click(function(){
                        var video_id = $(this).data('video');
                        
                        $('<div />').addClass('video-overlay').appendTo($('#helpModal'));
                        var $content = $('<div />').addClass('video-overlay-content');
                        
                        var title =  $(this).parent().parent().find('h5').text() || $(this).parents('tr').find('a:not([data-video]').text();
                        
                        $header = $('<div />', {'class' : 'header'})
                        .html('<span style="display:inline-block;width:15px"> </span>' + title)
                        $close = $('<div />', { 'class' : 'close' }).html('<img src="/img/icons/block32.png" style="width:16px;height:16px;cursor:pointer" />')
                            .click(function(){
                            $('#helpModal .video-overlay').remove();
                            $('#helpModal .video-overlay-content').remove();  
                        });
                        
                        $close.appendTo($header);
                        
                        $header.appendTo($content);
                        var video_template = 
                            '<object width="640" height="360">\
                              <param name="movie" value="https://www.youtube.com/v/' + video_id + '?color=white&theme=light&version=3"></param>\
                              <param name="allowFullScreen" value="true"></param>\
                              <param name="allowScriptAccess" value="always"></param>\
                              <embed src="https://www.youtube.com/v/' + video_id + '?color=white&theme=light&version=3" type="application/x-shockwave-flash" allowfullscreen="true" allowScriptAccess="always" width="640" height="360"></embed>\
                            </object>';
                        
                        $content.append(video_template);
                        $content.appendTo($('#helpModal'));
                        
                        $('#helpModal .video-overlay').fadeIn('fast', function()
                        {
                           $('#helpModal .video-overlay-content').fadeIn('fast'); 
                        });
                    });
				}
				
				$.each(data, function(k, v){
					var aref = $('<a />', { href: '#'})
						.text(k.charAt(0).toUpperCase() + k.slice(1))
						.click(function(){
							$.ajax({
								url: '/pp/ajax/help/navigation.php?page=' + k,
								success: function(data) {									
									$window_content.html(data);
									// lazy man's approach of foing it, but I don't want to complicate this all to much.
									// a depth of 3 is enough for the help section.
									$($window_content).find('a[href]:not([data-video])').click(function(){
										$.ajax({
											url: '/pp/ajax/help/' + k + '/' + $(this).attr('href') + '.phtml',
											success: function(data) {
												$window_content.html(data);
			                                    bindVideo($window_content);
			                                    
												return false;
											}
										});
										
										return false;
									});
									
									bindVideo($window_content);
									
									return false;
								}
							})
						});
						
					$window_navigation.append(
						aref
					);
						
					if (k == section) {
						triggered = true;
						
						aref.trigger('click');
					}
				});
				
				if (triggered == false) {
					$($window_navigation.find('a')[0]).trigger('click');
				}
			}
		});			
		
		var $window_content = $('<div />', { 'class' : 'content' });		
		
		$window_navigation.appendTo($window);
		$window_content.appendTo($window);
		
		$overlay.hide();
		$window.hide();
		
		
		$('body')
			.append($overlay)
			.append($window);	
			
		$overlay.fadeIn();
		$window.fadeIn();
		
};