/**
 * QuickSMS 
 * 
 * A jQuery plugin for sending quick sms'
 * 
 * @depends		jQuery
 * @author		Ferdi Schmidt <ferdi@parallel.co.za>
 * @copyright	2012, Parallel Software. 
 */

(function ($) {

	'use strict';

	$.fn.quickSMS = function (settings) {
		// private vars
		var that	= this,

		defaults = {
			url		: '/pp/ajax/sms/quicksms.php',
			params	: ['cell', 'name'],
			'class' : 'quickSMS',
			charsPerMessage: 160,
			maxMessages: 4
		},

		params = {},
		options = {};
		

		function closeModal($window) {
			return $window.animate({
					top		: $(window).height() * 0.4,
					left	: (($('body').width() / 2) - 200),
					opacity: 0
				}, 150, function(){
					$(this).remove();
			});
		}

		function showLoader($window) {
			params.message = $window.find('textarea').val();

			$window
				.find('.content')
				.hide()
				.html('<div class="loading"><img src="/img/ui/load.gif" alt="loading" /> Sending your message...</div>')
				.fadeIn();

			return true;
		}

		function sendAjax($window) {
            var datetime = '';
            datetime += $window.find('#SmsDateYear').val() + '-';
            datetime += $window.find('#SmsDateMonth').val() + '-';
            datetime += $window.find('#SmsDateDay').val() + ' ';
            datetime += $window.find('input[name="SmsTimeHour"]').val() + ':';
            datetime += $window.find('input[name="SmsTimeMinute"]').val() + ':00';
            
			showLoader($window);

			$.post(options.url, {
				name	: params.name,
				surname : params.surname,
				cell	: params.cell,
				message	: params.message,
				datetime: datetime
			}, function(data){

				if (data === 'OK') {
					$window.find('.content').hide().html('<div class="success"><img src="/img/icons/check32.png" alt="OK" /> Your message has been sent.</div>').fadeIn();
				} else {
					$window.find('.content').hide().html('<div class="success"><img src="/img/icons/warning32.png" alt="BAD" /> Something went wrong.</div>').fadeIn();
				}

				$window.click(function(){
					closeModal($(this));
				});
			});
		}

		function attachEvents($window) {
			$(document).keyup(function(e){
				if(e.keyCode === 27) 
					closeModal($window);
			});

			$window.find('button').click(function(){
				if ($(this).parent().find('textarea').val().length < 1) {
					$('<div />', { title : 'Please note' }).html('Message body is empty').dialog();
					return false;
				}

				sendAjax($window);
				return true;
			});
            
            $window.find('a.showCssCal').on('click', function(e)
            {
                NewCssCal('SmsDate');
                
                $('#ui-datepicker-div').css({
                    top     : ($(window).height() * 0.4) + 25,
                    left    : (($('body').width() / 2) - 100),
                    postition: 'absolute'
                });
            });
            
            $window.find('.date_picker_container select').uniform();
            $window.find('.date_picker_container .selector').append(
                $('<div />', { 'class': 'toggle' }).html('v')
            );
            
            $window.find('.date_picker_container select').change(function(){
                $.uniform.update($(this));
            });
            
            var date = new Date;
            $window.find('input[name="SmsDateYear"]').val(date.getFullYear());
            $window.find('select[name="SmsDateMonth"]').find('option:selected').removeAttr('selected');
            $window.find('select[name="SmsDateMonth"]').find('[value="' + (date.getMonth()+1) + '"]').attr('selected', 'selected');
            $window.find('select[name="SmsDateMonth"]').trigger('change');
            $window.find('input[name="SmsDateDay"]').val(date.getUTCDate());
            

            $window.find('input[name="SmsTimeHour"]').val(date.getHours());
            $window.find('input[name="SmsTimeMinute"]').val(date.getMinutes());

			return false;
		}

		function openDialog() {
			
			var
				$window = $('<div />').addClass(options['class']).css({
					top		: $(window).height() * 0.4,
					left	: (($('body').width() / 2) - 200),
					opacity: 0.2
				}),

				$header = $('<div />', {'class' : 'header'})
					.html('<span style="display:inline-block;width:15px"> </span>Send an SMS to ' + params.name)
					.appendTo($window),

				$close = $('<div />', { 'class' : 'close' }).html('<img src="/img/icons/block32.png" style="width:16px;height:16px;cursor:pointer" title="Close this dialog" />')
					.click(function(){
						closeModal($window);
						return true;
					})
					.appendTo($header),

				$more = $('<div />', { 'class' : 'more' })
					.html('<img src="/img/icons/plus32.png" style="width:16px;height:16px;cursor:pointer" title="Open detailed SMS send page" />')
					.click(function(){
						closeModal($window);

						window.open(options.origin.attr('href'));

						return true;
					})
					.appendTo($header),
			
			// populate
				$body = $('<div />')
					.addClass('content')
					.append(
						'<br /><label for="to" class="to">To</label> <span name="to">' + params.name + ' ' + (params.surname || '') + 
						' <span class="cell">(' + params.cell + ')</span></span>' +
						'<br />' +
                        '<br /><label for="date" class="date">Date</label>' + 
                        '<div class="date_picker_container">\
						    <input style="WIDTH: 23px" maxlength="2" name="SmsDateDay" id="SmsDateDay"> \
					        <select style="width: 60px" name="SmsDateMonth" id="SmsDateMonth">\
					            <option value="0" selected=""></option>\
					            <option value="1">Jan</option>\
                                <option value="2">Feb</option>\
					            <option value="3">Mar</option>\
					            <option value="4">Apr</option>\
					            <option value="5">May</option>\
					            <option value="6">Jun</option>\
					            <option value="7">Jul</option>\
					            <option value="8">Aug</option>\
					            <option value="9">Sep</option>\
					            <option value="10">Oct</option>\
					            <option value="11">Nov</option>\
					            <option value="12">Dec</option>\
					        </select>\
						    <input style="WIDTH: 40px" maxlength="4" size="2" name="SmsDateYear" id="SmsDateYear">\
						    <input type="hidden" name="date_picker_SmsDate" id="date_picker_SmsDate" value="">\
						    <input type="hidden" id="SmsDate" maxlength="25" size="25">\
						    <a class="showCssCal">\
						        <img src="/img/cal.gif" width="16" height="16" alt="Pick a date" border="0">\
						    </a>\
                            <input type="text" name="SmsTimeHour" class="time-hour" />\
                            :\
                            <input type="text" name="SmsTimeMinute" class="time-minute" />\
						</div>' +
                        '<br /><br />' +
						'<label for="message" class="message">Message</label>' + 
						'<span class="credits">You have <strong>' + options.credits + '</strong> credits remaining</span>' +
						'<textarea name="message"></textarea>' +
						'<span class="count"><span>1</span> message(s) will be sent<br /></span>' + 
						'<button>Send</button>'
					)
					.appendTo($window);

			// attach event handlers
			$window.find('textarea').keypress(function(){

				var characters	= $(this).val().length + 1,
					messages	= Math.ceil(characters / options.charsPerMessage),
					content		= '';

				if(messages > options.maxMessages) {
					$(this).val($(this).val().substr(0, (options.charsPerMessage * options.maxMessages) - 1));
					content = options.maxMessages + ' <small>(maximum)</small>';
				} else {
					content = messages;
				}

				$body.find('span.count span').html(content);			
			});


			// display
			$window.appendTo('body').animate({
					top					: (($(window).height() / 2) - 175),
					left				: (($('body').width() / 2) - 200),
					opacity				: 1
			}, 250);

			// focus on the message textarea
			$window.find('textarea').focus();

			return attachEvents($window);
		}
		

		options = $.extend(options, defaults, settings, { origin: this});
		
		// the sms credit balance is written as a data attribute of the script tag
		options.credits = $('script[src$="quickSMS.js"]').data('credits');

		// Is this actually a anchor?
		if (this[0].nodeName !== 'A') {
			return false;
		}
		
		var anchor = document.createElement('a');
		anchor.href = $(this).attr('href');
		
		var glued_params = decodeURIComponent(anchor.search).split('?')[1].split('&');
			
		var partial_params = [];
		$.each(glued_params, function(k, v) {
			partial_params[v.split('=')[0]] = v.split('=')[1];
		});
		
		if (partial_params['cell'].length > 0) {
			params = partial_params;
		} else {
			return false;
		}

		$(this).click(function () {
			openDialog();
			
			// no chain effect unless this breaks
			return false;
		});

		return true;
	};

	return true;
})(jQuery);