/* --- geometry and timing of the menu --- */
var MENU_POS1 = new Array();
	// item sizes for different levels of menu
	MENU_POS1['height'] = [15, 15];
	MENU_POS1['width'] = [70, 69];
	// menu block offset from the origin:
	//	for root level origin is upper left corner of the page
	//	for other levels origin is upper left corner of parent item
	MENU_POS1['block_top'] = [71, 16];
	MENU_POS1['block_left'] = [5, 0];
	// offsets between items of the same level
	MENU_POS1['top'] = [0, 17];
	MENU_POS1['left'] = [75, 0];
	// time in milliseconds before menu is hidden after cursor has gone out
	// of any items
	MENU_POS1['hide_delay'] = [200, 200];
	
/* --- dynamic menu styles ---
note: you can add as many style properties as you wish but be not all browsers
are able to render them correctly. The only relatively safe properties are
'color' and 'background'.
*/
var MENU_STYLES1 = new Array();
	// default item state when it is visible but doesn't have mouse over
	MENU_STYLES1['onmouseout'] = [
		'color', ['#ffffff', '#ffffff'], 
		'background', [menu_color, menu_color],
		'fontWeight', ['normal', 'normal'],
		'textDecoration', ['none', 'none'],
	];
	// state when item has mouse over it
	MENU_STYLES1['onmouseover'] = [
		'color', ['#ffffff', '#ffffff'], 
		'background', [menu_color, default_color],
		'fontWeight', ['normal', 'normal'],
		'textDecoration', ['none', 'none'],
	];
	// state when mouse button has been pressed on the item
	MENU_STYLES1['onmousedown'] = [
		'color', ['#ffffff', '#ffffff'], 
		'background', [menu_color, default_color],
		'fontWeight', ['normal', 'normal'],
		'textDecoration', ['underline', 'underline'],
	];
	
