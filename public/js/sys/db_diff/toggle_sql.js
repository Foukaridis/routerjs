/**
 * This fucntion will show add the contents of the addme textbox to the execute
 * textbox if when the checkbox for the addme box is ticked.
 *
 * I don't know who write this function, I'm moving it from its current location
 * to a file so it can be injected into the header dynamically.
 */
function toggleSQL(thing)
{
	elements = document.getElementsByName('addme');
	execute = document.getElementById('execute');

	sql = execute.firstChild;

	if (sql === null) {
		sql = document.createTextNode('');
		execute.appendChild(sql);
	}

	if (thing.checked) {
		specific = document.getElementById(thing.value);
		sql.nodeValue += specific.value;
	} else {
		sql.nodeValue = '';

		for (var i = 0; i < elements.length; ++i) {
			var cb = elements.item(i);
			
			if (cb.checked) {
				var tb = document.getElementById(cb.value);
				sql.nodeValue += tb.value;
			}
		}
	}
}

/**
 * This function finds all the child boxes linked to a check-all box.
 */
function _findToggleChildren(box)
{
	// Find parent table
	p = box;

	while (p.getAttribute('class') != 'db-diff-table') {
		p = p.parentNode;

		if (p.tagName == "body") {
			break;
		}
	}

	// Find all child checkboxes
	return p.getElementsByTagName('input');
}

/**
 * This function toggles all the checkboxes on the parent table.
 */
function toggleAll(box)
{
	// Find element to inject text into.
	execute = document.getElementById('execute');

	sql = execute.firstChild;

	if (sql === null) {
		sql = document.createTextNode('');
		execute.appendChild(sql);
	}

	inputs = _findToggleChildren(box);

	if (box.checked) {
		for (i=0;i<inputs.length;i++)
		{
			// Skip inputs that aren't 'addme' checkboxes.
			if (inputs[i].getAttribute('type').toLowerCase() != 'checkbox' ||
				inputs[i].getAttribute('name') != 'addme') {
				continue;
				i++;
			}

			// Set all the values in the output and tick all boxes.
			sql_part = document.getElementById(inputs[i].value);
			sql.nodeValue += sql_part.value;
			inputs[i].checked = true;
		}
	} else {
		// Iterate each checkbox
		sql.nodeValue = '';

		for (i=0;i<inputs.length;i++)
		{
			// Skip inputs that aren't 'addme' checkboxes.
			if (inputs[i].getAttribute('type').toLowerCase() != 'checkbox' ||
				inputs[i].getAttribute('name') != 'addme') {
				continue;
				i++;
			}

			inputs[i].checked = false;
		}
	}
}