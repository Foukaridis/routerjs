/**
* Redraws qtip's on a certain element.
*/
$.fn.redrawQtip = function(){
   $(this).find('a[title]').qtip({
	   content: {
		  text: false // Use each elements title attribute
	   },
	   position: {
		   corner: {
			  tooltip: 'leftTop', // Use the corner...
			  target: 'rightBottom' // ...and opposite corner
		   }
	   },
		style: {
		   border: {
			  width: 1,
			  radius: 2,
			  color: '#264489'
		   },
		   padding: 3, 
		   textAlign: 'center',
		   tip: true // Give it a speech bubble tip with automatic corner detection
		}
	});
};