/* 
 * Interface for API
 * 
 * @date 2014/01/27
 *  - Rewrote API interface to use callbacks. 
 *  - @todo Implement RSVP and return promises
 * 
 * @author Ferdi Schmidt <ferdi@parallel.co.za>
 * @copyright 2012, Parallel Software.
 */

var pp = pp || {};

/**
 * Instantiates the API
 * 
 * @param {string} token
 * @param {string} host
 */
pp.initApi = function(token, host)
{
    var self = this;
    
    this.token = token;
    this.host = host;
    
    var makeRequest = function(resource, cb)
    {
        var inner_self = this;
        var query_string = (resource.indexOf('?') === -1) ? '?' : '&';
        var location = document.location.protocol + '//' + this.host + resource + query_string + 'token=' + this.token;
        
        $.ajax({
            url: location,
            dataType: 'json',
            async: true,
            success: function()
            {
                if (typeof cb === 'undefined') {
                    return;
                }
                
                // just push all paramaters forward
                cb.apply(inner_self, arguments);
            },
            
            error: function()
            {
                // pass
            }
        });
    };

    setTimeout(pp.pollApi, 90000);
    
    return {
        request: function()
        {
            return makeRequest.apply(self, arguments);
        }
    };
};

pp.pollApi = function()
{
    if (pp.api) {
        pp.api.request('poll');
        setTimeout(pp.pollApi, 90000);
    }
};