/**
 * Javascript resource for Web Requests in CRP
 * Written as a jQuery plugin for convenience.
 * 
 * @author Ferdi Schmidt <ferdi@parallel.co.za>
 * @copyright 2012, Parallel Software Pty. Ltd.
 */

!(function($){
	
	/**
	 * A jQuery plugin to manipulate the a specfic <tr>
	 * Used on CPR web requests, because creating an additional page
	 * for this is maddness.
	 */
	$.fn.webRequestItem = function() {
		
		// The joys of working with a "library" like jQuery
		var that = this;
		
		// Groups stateful data
		this.context = {
			jObj: $(this)
		};
		
		// A small pool of events, this keeps them organized
		this.eventPool = {
			clickMore: function(e) {
				// do not follow through to w.loc=href
				e.preventDefault();

				// clone, there's an event attached to the anchor
				that.context.ojObj = that.context.jObj.clone(false, false);
				that.context.jObj.find('.toggle').html('<img src="/img/ui/load.gif" />');

				that.context.ojObj.addClass('is-open');
				$('.qtip').remove();
				
				that.context.id = that.context.jObj.find('td:first').find('span[data-id]').data('id');
				that.context.status = (that.context.jObj.find('td:last').text() == 'Completed') ? 1 : 0;
				
				// fail-safe way of seeing if we can modify this row
				var data;
				$.ajax({
					async: false,
					dataType: 'json',
					url: '/pp/ajax/cpr/web_request.php',
					type: 'post',
					data: {
						id: that.context.id,
						type: 'data'
					},
					
					success: function(sData) {
						data = sData;
					},
					
					error: function() {
						that.shutdown();
					}
				});
				
				that.context.data = data;
				
				if (typeof that.context.jObj == 'undefined' || typeof data == 'undefined') {
					return false;
				}
				
				that.eventPool.openRow(data);
			},
			
			openRow: function(data) {
				// remove and re-render

				if (that.context.jObj.find('td').length > 6) {
					that.context.jObj.find('td:not(:first)').remove().end();
				} else {
					that.context.jObj.find('td').remove().end();
				}
				that.context.jObj.append(that.buildTemplate(data));
				that.context.jObj.find('a[href*="sms"]').each(function(){
					$(this).quickSMS();
				});
				
				// bind events
				$('<div />').html('Show Less').addClass('toggle').appendTo(that.context.jObj.find('td:first'));
				
				that.context.jObj.find('.toggle').click(function(e){
					e.preventDefault();
					that.context.jObj.replaceWith(that.context.ojObj);
					that.context.jObj = that.context.ojObj;
					that.context.jObj.webRequestItem();
				});
				that.context.jObj.find('.toggle').css({
					left: that.context.jObj.offset().left + ((that.context.jObj.width() / 2) - 75) + 'px',
					top: (that.context.jObj.offset().top + 14) + 'px',
					display: 'block'
				})
				
				if (that.context.status == 1) {
					that.context.jObj.find('button.add-notes').removeClass('add-notes').addClass('view-notes').text('View notes').click(that.viewNotes);
				} else {
					that.context.jObj.find('button.add-notes').data('cid', data.consultant_id).click(that.recordCompleted);
				}
			}
		};
		
		/**
		 * Builds a template to be used from the data parameter passed.
		 * @param object data
		 * @returns object{Array[rows[2]]}
		 */
		this.buildTemplate = function(data) {
			
			Handlebars.registerHelper('rawValue', function() {
			  return new Handlebars.SafeString(this.value);
			});
		
			var src = '{{! Each row has three cells }}'
				+ '<td colspan="6">'
				+ '	<table class="inline-request">'
				+ '		<td class="date">'
				+ '			{{rdate}}'
				+ '		</td>'
				+ '		<td class="requester">'
				+ '			{{#requester}}'
				+ '			{{#if value}}'
				+ '			<div>'
				+ '				<span>{{name}}</span>{{rawValue}}'
				+ '			</div>'
				+ '			{{/if}}'
				+ '			{{/requester}}'
				+ '			<br /><strong>Notes</strong>'
				+ '			<pre>{{rnotes}}</pre>'
				+ '		</td>'
				+ '		<td class="requestee">'
				+ '			{{#requestee}}'
				+ '			{{#if value}}'
				+ '			<div>'
				+ '				<span>{{name}}</span>{{rawValue}}'
				+ '			</div>'
				+ '			{{/if}}'
				+ '			{{/requestee}}<br />'
				+ '			<a style="width:30%;margin:0 auto;display: block;text-align: center" target="_new" href="/pp/cvw/candidate_detail.php?ID={{candidate_id}}" class="button">View Candidate</a>'
				+ '		</td>'
				+ '		<td class="actions">'
				+ '			<button class="add-notes">Mark completed</button>'
				+ '		</td>'
				+ '	</table>'
				+ '</td>';
				
			return Handlebars.compile(src)(data);
		};
		
		// removes all events.
		this.shutdown = function() {
			that.context.jObj.find('td:last').html('Err');
			delete that.context.jObj;
		};
		
		this.recordCompleted = function(e){
			e.preventDefault();			
			
			var data = {
				consultant_name: $('div#user_name').after().html().split('</strong>')[1].split('<')[0].split('&')[0],
			};
			
			var consultant_id = $(this).data('cid');
			
			var src = ''
				+ '<label for="consultant">Consultant</label><br />'
				+ '<input type="text" disabled value="{{consultant_name}}" />'
				+ '<br />'
				+ '<label for="notes">Notes</label><br />'
				+ '<textarea rows="4" id="notes" name="notes"></textarea>';
			
			var tpl = Handlebars.compile(src)(data);
			$('<div />', { title: 'Mark web request as Completed' }).addClass('dialog-mark-completed').html(tpl).dialog({
				buttons: {
					Complete: function() {
						
						var notes = $(this).find('#notes').val();
						if (notes.length == 0) {
							$('<div />', { title: 'Something went wrong...' }).html('Please fill in a note!').dialog({
								modal: true
							});
							return false;
						}
						
						$(this).parent().remove();
						$.ajax({
							url: 	'/pp/ajax/cpr/web_request.php',
							type: 	'post',
							data: {
								type: 'complete',
								id: that.context.id,
								cid: consultant_id,
								notes: notes
							},
							
							success: function(data) {
//								window.location.reload();
							}
						});
					}
				}
			});
		};
		
		this.viewNotes = function(e){
			e.preventDefault();
			
			console.log(that.context.data);
			
			var src = ''
				+ '<strong>Consultant:</strong> {{rcname}}<br /><br />'
				+ '<p>{{rcnotes}}</p>';
			
			var tpl = Handlebars.compile(src)(that.context.data);
			
			$('<div />', { title: 'View consultant\'s notes'}).html(tpl).dialog();
		};
		
		// add toggle button
		$('<div />').text('Show More').addClass('toggle').appendTo(this.context.jObj.find('td:first'));
		this.context.jObj.hover(function(){
			$('.toggle').hide();
			$(this).find('.toggle').css({
				left: $(this).parent().parent().offset().left + (($(this).parent().parent().width() / 2) - 75) + 'px',
				'margin-top': '-19px'
			}).fadeIn(150);
		},
		function(){
			$(this).find('.toggle').fadeOut(50);
		});
		this.context.jObj.find('.toggle').click(this.eventPool.clickMore);
		
	};
})($ || jQuery);


/// additional stuff for domReady
$(document).ready(function(){
	$('form#clients_list').find('.list_a, .list_b').each(function(){		
		new $(this).webRequestItem();
	});
	
	// keeps the dates after initial submission
	$('div.date_picker_container').each(function(k,v){
		$(this).find('input').trigger('change');
	});
});