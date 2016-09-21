/**
 * Reminders class
 * @type object
 * 
 * @author Ferdi Schmidt <ferdi@parallel.co.za>
 * @company Parallel Software
 * 
 * @date 31 May 2012
 */
var reminders = {

	/**
	 * General settings for this class
	 * @type object
	 */
	settings: {
		isShowing: {
			calendar: false,
			list: true
		},
		calendar: {
			ready: false,
			json_url: 'http://ferdi/pp/rem/fullcalendar-1.5.3/demos/json-events.php',
			call: 'id'
		},
		toggleBehavoir: 'slide',
		eventTypes : {},
		moreCache: {}
	},

	// private cache
	_privCache: {},

	init: function () {
		if (typeof (jQuery) == 'undefined') return false;

		$('#reminders_cal_view, #reminders_cal_view_a').click(function () {
			// compatibility, also it will render the calendar horribly wrong
			if ($(document).width() < 900) {
				alert('Your display resolution does not support this feature.' + "\nPlease choose a resolution greater than 800x600.");
				return false;
			}

			$.ajax('/pp/ajax/rem/calendar.json.php?session=1');

			if (!reminders.settings.calendar.ready) reminders.setupCalendar();
			else reminders.showCalendar();

		});

		$.ajax('/pp/ajax/rem/calendar.json.php?session=2').done(function (data) {
			if (data == '1') $('#reminders_cal_view').trigger('click');
		});

		return true;
	},

	/* Calendar Specific */

	setupCalendar: function () {

		$.getScript('/js/lib/jquery.qtip-1.0.0-rc3.min.js');
		reminders.utillity.getStylesheet('/js/lib/fullcalendar/fullcalendar.css');

		$.getScript('/js/lib/fullcalendar/fullcalendar.min.js', function () {
			var events = {};

			var branch = $('#Branch').val(), 
				consultant = ($('#Consultant').val()) ? $('#Consultant').val() : '',
				candidateBirthdays = ($('#includeCandidateBirthday').prop('checked')) ? '1' : '0'
			$('#reminders_calendar').fullCalendar({

				// Settings
				editable: false,
				cache: true,
				height: 650,
				events: {
					url: "/pp/ajax/rem/calendar.json.php?branch=" + branch + "&consultant=" + consultant + '&candbirthdays=' + candidateBirthdays,
					cache: true
				},
				disableDragging: true,
				disableResizing: true,
				weekends: !false,

				eventClick: function (event, jsEvent, view) {

					var actual_content = '<div id="overlay_inner"><div>' + event.title + '</div><div class="text"><img src="http://pp.ferdi/img/pp_wait.gif" class="load" /></div></div>';
					var overlay = $('<div class="ui-widget-overlay"></div>' + actual_content).hide().appendTo('body');

					overlay.width($(document).width());
					overlay.height($(document).height());
					overlay.css('z-index', '998');

					$('#overlay_inner').css({
						width: '400px',
						height: '350px',
						position: 'absolute',
						top: (($(document).height() / 2) - 175) + 'px',
						left: (($(document).width() / 2) - 200) + 'px',
						'border-radius': '5px',
						'box-shadow': '0px 0px 50px rgba(0,0,0,0.2)',
						'background-color': '#FFF',
						padding: '0px',
						'text-align': 'left'
					});



					if ($.browser.msie) {
						$('.ui-widget-overlay').remove();
						$('#overlay_inner').css({
							border: 'solid 2px rgba(0,0,0,0.2)'
						});
					}
					

					// content therewithin
					$('#overlay_inner div:last').css({
						padding: '10px',
						'text-align': 'left',
						'font-size': '12px',
						'overflow-y': 'auto',
						'overflow-x': 'hidden',
						'height': '300px'

					});

					// title
					var ev_style = $(this).find(':parent').attr('style').split(';');

					var bgC = ev_style[0].split(':')[1];
					var bdC = ev_style[1].split(':')[1];

					var c1 = bgC,
						c2 = reminders.utillity.changeHex(bdC, -30);

					$('#overlay_inner div:first').css({
						background: bgC,
						color: '#FFF',
						padding: '0px 10px',
						height: '30px',
						'line-height': '30px',
						'border-top-left-radius': '5px',
						'border-top-right-radius': '5px',
						'text-align': 'left',
						'font-size': '11px',
						'font-weight': '700'

					});

					if ($.browser.webkit) {
						$('#overlay_inner div:first').css('background', '-webkit-linear-gradient(top, ' + c1 + ' 0%, ' + c2 + ' 100%)');
					}

					if ($.browser.msie) {
						//alert('IE detected! RUUNNN..');
						$('.ui-widget-overlay').css({
							background: '#CCC',
							opacity: '0.3',
							filter: 'alpha(opacity = 30)',
							zoom: 1,
							filter: 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + $('ui-widget-overlay').attr('src') + '\',sizingMethod=\'scale\')'
						});
					}


					// hide me with ESC
					$(document).keyup(function (e) {
						if (e.keyCode == 27) {
							hideOverlay(overlay);
						}
					});

					// hide me when user clicks outside of box
					$('.ui-widget-overlay').click(function () {
						hideOverlay(overlay);
					});

					// hide with button click
					$('#overlay_inner').append('<div class="close"> x </div>');
					$('#overlay_inner .close').click(function () {
						hideOverlay(overlay);
					});

					function hideOverlay(overlay) {
						overlay.fadeOut('fast', function () {
							// remove the element
							$(this).remove();
						});

						// unbind ESC key
						$(document).unbind('keyup');
					}

					// show me
					overlay.fadeIn();

					// overlay is being shown, pull the data
					var e = this;
					var ee = event;
					var json_data;

					if (typeof reminders._privCache['' + event.id + ''] != 'object') {
						var _date = new Date(event.start);
						var date = _date.getFullYear() + '-' + _date.getMonth() + '-' + _date.getDate();
						var more = (typeof event.more === 'undefined') ? '' : '&more=true';

						$.getJSON('/pp/ajax/rem/calendar.json.php?id=' + event.id + '&type=' + event.type + '&date=' + date + more, {
							cache: true
						}, function (data) {

							// error handling
							if (typeof data.error != 'undefined') {
								if (typeof console != 'undefined')
									console.log(data);
								$('#overlay_inner div.text').html(data.error);
								$('#overlay_inner div:first').html('An error occurred!');
								return false;
							}

							var json_data = data;
							$(reminders._privCache).attr(event.id, data);

							$('#overlay_inner div.text').html(json_data.text);
							$('#overlay_inner div:first').html(event.type + ': ' + json_data.title);
						
							// Size buttons neatly
							var buttons = $('#overlay_inner').find('button');
							if (typeof buttons == 'object') {
								var ammount = buttons.size();
								var button_width = (80 / ammount);
								$(buttons).css('width', button_width + '%');

								$(buttons).click(function() {
									window.open($(this).attr('url'));
								});
							}
						});
					} else {
						json_data = $(reminders._privCache).attr(event.id);
						
						// Size buttons neatly
						var buttons = $('#overlay_inner').find('button');
						if (typeof buttons == 'object') {
							var ammount = buttons.size();
							var button_width = (80 / ammount);
							$(buttons).css('width', button_width + '%');

							$(buttons).click(function() {
								window.open($(this).attr('url'));
								$(this).attr('url', 'OK');
							});
						}
						
						$('#overlay_inner div.text').html(json_data.text);
						$('#overlay_inner div:first').html(event.type + ': ' + json_data.title);
						

					}

					

					return false;
				},

				loading: function (bool) {
					if (bool) $('body').spinner(['', '<br />Please wait...']);
					else $('body').spinner('remove');

				},

				eventAfterRender: function (event, element, view) {
					var border = this.borderColor;
					var background = this.backgroundColor;

					$(event).find('span').css('color', reminders.utillity.changeHex(background, -80));
				}
			});

			reminders.settings.calendar.ready = true;
			reminders.showCalendar();
		});
	},

	renderMore: function(id, type) {
		var raw_id = id.id.split('|');
		var id = id.id, date = raw_id[1];
		$.getJSON('/pp/ajax/rem/calendar.json.php?id=' + id + '&type=' + type + '&date=' + date, {
			cache: true
		}, function (data) {
			// cache the result
			reminders.settings.moreCache = {
				title: $('#overlay_inner div:first').html(),
				text: $('#overlay_inner div.text').html()
			};

			// Assume the modal window is already rendered
			$('#overlay_inner div.text').html(function(){
				var html = data.text.replace('</button>', '</button><button id="moreBack">Go Back</button>');
				return html;
			});
			$('#overlay_inner div:first').html(data.title);

			// well, we actually need a "back" button..
			$('#moreBack').click(function(){
				data = reminders.settings.moreCache;
				$('#overlay_inner div.text').html(data.text);
				$('#overlay_inner div:first').html(data.title);
			});
			
		});
		return true;
	},

	showCalendar: function () {
		$('#reminders_calendar').css('display', 'none');
		$('#reminders_wrap').fadeOut('fast', function () {

			$('#reminders_calendar').fadeIn('fast');

			var buttons_html = '<input type="button" id="rem_return" value="Return to List View" />' + 
								' <input type="button" id="export_to_vcal" value="Export to vCal" />' + 
								' <input type="button" id="helpme" value="Help" />';

			if (!$('div.go_back').attr('class')) $('#reminders_calendar').prepend('<div class="go_back">' + buttons_html + '</div>');

			// set-up click event now.
			$('#rem_return').click(function () {
				$.ajax('/pp/ajax/rem/calendar.json.php?session=0').done(function () {
					$('#reminders_calendar').fadeOut('fast', function () {
						$('#reminders_wrap').fadeIn('fast');
					});
				});
			});

			$('#export_to_vcal').click(function () {

				// a couple of things needs to be done in order to format these items into vCal
				// Firstly, get all the "events" on the calendar
				// Secondly, check the _privCache that each has data, and if not, get it

				// Get all events
				var calEvents = $('#reminders_calendar').fullCalendar('clientEvents'),

					// loop through them and check cache validity
					calJSON = {
						events: []
					},
					i = -1;
				$(calEvents).each(function (k, v) {

					var k = this;

					if (typeof $(reminders._privCache).attr(k.id) == 'undefined') {
						var _date = new Date(k.start);
						var date = _date.getFullYear() + '-' + _date.getMonth() + '-' + _date.getDate();

						$.getJSON('/pp/ajax/rem/calendar.json.php?id=' + k.id + '&type=' + k.title + '&date=' + date, {
							cache: true
						}, function (data) {
							$(reminders._privCache).attr(k.id, data);
							var oD = data;

							var _date = new Date(k.start);
							var date = _date.getFullYear() + '-' + _date.getMonth() + '-' + _date.getDate();

							var oJ = {
								type: k.title,
								time: date,
								title: oD.title,
								description: oD.text
							};

							// store object
							calJSON.events[++i] = oJ;

						});
					} else {
						var oD = $(reminders._privCache).attr(k.id);						

						var _date = new Date(k.start);
						var date = _date.getFullYear() + '-' + _date.getMonth() + '-' + _date.getDate();

						var oJ = {
							type: k.title,
							time: date,
							title: oD.title,
							description: $(oD.text).text()
						};

						// store object
						calJSON.events[++i] = oJ;
					}
				});

				// we have all the data we need, parse it and send it off
				$.post('/pp/ajax/rem/calendar.json.php?vcal=1', {
					output: reminders.vCal.parse(calJSON)
				}, function (x) {
					if (x == '1') {
						window.open('/pp/ajax/rem/calendar.json.php?download=vcal');
					}
					return;
				});
			});

			$('#helpme').click(function(){
				var text = '<div title="Help" style="text-align: left">' +
							'<p>Each reminder has it\'s own colour on the calendar to help you quickly identify the specific' + 
							' item.<br />These are as follows:</p><p>';
				var colours = [
					'#4DCBC2',
					'#4DCBC2',
					'#99E1DD',
					'#B1DC58',
					'#8CBA2C',
					'#C44D58',
					'#FF6B6B',
					'#556270',
					'#BFB9A4'
				];

				var types = [
					"Starters",
					"Finishers",
					"Client Interviews",
					"Client Interaction",
					"Candidate Interaction",
					"After Service Care",
					"Client Birthday",
					"Candidate Birthday",
					'Custom Reminders'
				];

				for(var i = 0;i<9;i++) {
					text += '<div style="border-radius:3px;border:solid 1.5px #FFF;padding:5px;background-color: ' + colours[i] + ';color:#FFF;font-weight:bold">' +
							types[i] + '</div>';
				}

				text += '</p></div>';
				$(text).dialog({modal: true});

			});

			$('#reminders_calendar').fullCalendar('rerenderEvents');
		});

	},

	/**
	 * Either 3rd party or additional functions
	 * @type object
	 */
	utillity: {

		/**
		 * Changes the shade of a colour
		 * @param  string   hex     i.e. #CC0000, CC0000, #CC0, CC0.
		 * @param  integer  a       Functions as incremental if possible value, 
		 *                          decrease is done by passing a negative number, 
		 *                          e.g. -10
		 * @return string   HEX Colour value, in lower case.
		 */
		changeHex: function (hex, a) {
			if (hex[0] == "#") hex = hex.substr(1);

			// if (hex.length == 3) {
			// 	var temp = hex;
			// 	hex = '';
			// 	ihateIE = new RegExp('^([a-f0-9])([a-f0-9])([a-f0-9])$', 'i');
			// 	temp = ihateIE.exec(temp).slice(1);
			// 	for (var i = 0; i < 3; i++) hex += temp[i] + temp[i];
			// }
			var ihateIE = new RegExp('^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$', 'i');
			if ($.browser.msie) var triplets = [
			hex.substring(0, 1), hex.substring(2, 3), hex.substring(4, 5)];
			else var triplets = ihateIE.exec(hex).slice(1);

			var al = {
				red: parseInt(triplets[0], 16),
				green: parseInt(triplets[1], 16),
				blue: parseInt(triplets[2], 16)
			}

			// not pretty, but it *does* work...
			var red = parseInt(al.red) + a < 0 ? 0 : parseInt(al.red) + a > 255 ? 255 : parseInt(al.red) + a;
			var green = parseInt(al.green) + a < 0 ? 0 : parseInt(al.green) + a > 255 ? 255 : parseInt(al.green) + a;
			var blue = parseInt(al.blue) + a < 0 ? 0 : parseInt(al.blue) + a > 255 ? 255 : parseInt(al.blue) + a;

			var rgb = blue | (green << 8) | (red << 16);
			return '#' + rgb.toString(16);
		},

		/**
		 * Retrieves a stylesheet and appends it to the DOM
		 * @param  string url URL to stylesheet
		 * @return void
		 */
		getStylesheet: function (url) {
			jQuery.get(url, function (data, status) {
				if (status == "success") {
					jQuery("head").append("<style type=\"text/css\">" + data + "</style>");
				}
			});
		}
	},

	vCal: {
		parse: function (object) {
			if (typeof (object) != 'object') return false;

			var format = {
				head: 'BEGIN:VCALENDAR\n' + 'VERSION:1.0',
				foot: 'END:VCALENDAR'
			};

			var body = this.parseEvents(object.events);
			format.body = body;

			var complete = format.head + '\n' + format.body + '\n' + format.foot;

			return complete;
		},

		parseEvents: function (events) {
			var events_formatted = [];
			for (var i = 0; i <= (events.length - 1); i++)
			events_formatted[i] = this.parseEvent(events[i]);
			return events_formatted.join('\n');
		},

		parseEvent: function (event) {
			var format = 'BEGIN:VEVENT\n' + 'CATEGORIES:' + event.type + '\n' + 'DTSTART:' + event.time + '\n' + 'DTEND:' + event.time + '\n' + 'SUMMARY:' + event.title + '\n' + 'DESCRIPTION:' + event.description.replace('<br />', '\n\r') + '\n' + 'END:VEVENT';
			return format;
		}
	}
};

// Get ready...
$(document).bind('ready', reminders.init);