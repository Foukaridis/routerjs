$(document).ready(function(){
    $("select, input:file").uniform();
    $("select, input:file").change(
        function(){
            $.uniform.update();
            return true;
        }
    );
        
    $('.selector').each(function(k, v){
        $(this)
            .append(
            $('<div />', { 'class': 'toggle' })
                .html('v')
            );
    });
    
    // QuickSMS functionalit
    if (typeof $.fn.quickSMS == 'function') {
        $('body').find('a[href*="sms/sms_send.php?cell="]').each(function(k, v){
            $(this).quickSMS();
        });
    }
    
    $.getScript('/js/lib/plugin/redrawQtip.js', function(){
        $('body').redrawQtip();
    });
    
    $.getScript('/js/lib/jquery.cookie.js', function(){
        
        // notification for styles changes
//        if ($.cookie('pp_styles_change_alert') === null) {
//            $('<div />', { title: 'Please take note!', 'id' : 'stylesChangeAlert'})
//            .html(
////                '<strong>Some changes were made to Placement Partner!</strong><br /><br />' +
//                '<p>A recent update was made to Placement Partner that requires you to refresh your browsers cache.<br />' +
//                '<br />This can be done by ' +
//                'pressing Ctrl and F5(together) a couple of times(5 times should be sufficient).</p>' +
//                '<br />' +
//                '<p>Alternatively, please feel free to contact <a href="mailto:support@parallel.co.za">support@parallel.co.za</a> should you have any question and/or concerns.</p>'
//            ).appendTo('body');
//            $('div#stylesChangeAlert').dialog({
//                    width: 400,
//                    height: 250,
//                    modal: true,
//                    buttons: {
//                        Ok : function(){
//                            $.cookie('pp_styles_change_alert', 'true');
//                            $(this).remove();
//                        }
//                    }
//            });
//        
//        }        
        
        // Font size changer
        var 
        currentFontSize = parseInt($('body').css('font-size'), 10),
        fontSizeIncrement = 1,
        fontChanger        = function(i) {
            
            if (currentFontSize > 15 || currentFontSize < 7) {
                return true;
            }
            
            switch (i > 0) {
                case true :
                    currentFontSize += fontSizeIncrement;
                    if (currentFontSize > 15) {
                        currentFontSize -= fontSizeIncrement;
                    }
                    break;
                    
                case false :
                    currentFontSize -= fontSizeIncrement;
                    if (currentFontSize < 8) {
                        currentFontSize += fontSizeIncrement;
                    }
                    break;
            }
            
            if (i > 1) {
                // this indicated a specific size
                currentFontSize = parseInt(i, 10);
            }
            
            $.cookie('pp_font_size', currentFontSize);
            
            $('body').css({
                'font-size' : currentFontSize + 'px'
            });
            
            // fire an event on the DOM
            $(document).trigger('fontChange', currentFontSize);
            
            // additional checks for iframes that may lay on the DOM
            if ($('iframe').length > 0) {
                $('iframe').each(function(k, v){
                    $(this.contentWindow.document).find('body').css({
                        'font-size' : currentFontSize + 'px'                        
                    }).end();
                });
            }
        },
        
        fontBigger        = $('<img />', {
            src : '/img/ui/bigger_font.gif',
            title: 'Increase the overall font size'
        }).click(function() {
            fontChanger(1);
        }),
        fontSmaller        = $('<img />', {
            src : '/img/ui/smaller_font.gif',
            title: 'Decrease the overall font size'
        }).click(function() {
            fontChanger(-1);
        }),
        
        $fontChangerDiv    = $('<div />', {
            'class' :  'font_changer'
        });
                            
        fontBigger.appendTo($fontChangerDiv);
        fontSmaller.appendTo($fontChangerDiv);
        $('#user_name').after($fontChangerDiv);
        
    });
    
    var url = '/sys/piwik/';

    window._paq = [
       ['enableLinkTracking'],
       ['setTrackerUrl', url + 'piwik.php'],
       ['setSiteId', 1],
       ['setCustomVariable', 1, 'System', $('body').data('company'), 'visit'],
       ['setCustomVariable', 3, 'Consultant', $('body').data('consultant'), 'visit'],
       ['trackPageView']
   ];  
    
   $.getScript(url + 'piwik.js');
});

