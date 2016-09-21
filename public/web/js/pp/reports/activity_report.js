function drawGraph(graph_node)
{
	var container = undefined;	// The div that the graph will be rendered to
	var chart = undefined;		// The Highcharts object
	var node = graph_node;		// The node that's clicked to trigger this
								// script

	// See the Highcharts documentation for details on all these options.
	// http://www.highcharts.com/ref/
	var options = {
		chart: {
			defaultSeriesType: 'bar',
			zoomType: 'xy',
			renderTo: 'graph-container'
		},
		credits: {
			href: '#',
			text: 'Placement Partner'
		},
		plotOptions: {
			bar: {
				stacking: 'normal'
			}
		},
		series: [],
		title: {
			text: 'Activity Report'
		},
		xAxis: {
			categories: [
				'CVs Sent',
				'Interviews',
				'Send Outs',
				'Vacancies',
				'Client<br />Interactions',
				'Candidate<br />Interactions',
				'SMSes'
			],
			title: {
				text: 'Activities'
			}
		},
		yAxis: {
			title: {
				text: 'Total'
			}
		}
	};

	// The click event for the node.
	function onClick()
	{
		icons = node.find("img");
		icons.each(function() {$(this).toggle();});	// Switch between the graph  and table icon

		if (icons.first('display').css('display') == 'none') {
			node.attr('title', 'Show Table');	// Show the label for tabel view
		} else {
			node.attr('title', 'Show Graph');	// Show the label for graph view
		}
		
		node.qtip('destroy');
		node.parent().redrawQtip();

		container.toggle();						// Switch between the graph and the table output
		container.siblings('table.list_inner').find('tbody tr').first().nextAll().each(function() {$(this).toggle();});

		if (chart === undefined) {	// The graph doesn't exist yet
			node.unbind('click');	// Disable the click even on the node to prevent multiple AJAX requests
			node.click(function() { return false; });
			buildGraph();			// Call this function to generate the graph
			node.unbind('click');	// Re-enable the click event
			node.click(onClick);
		}

		return false;
	}

	function buildGraph()
	{
		container.spinner();						// Show the spinner, so the user know something's happening and they need to wait

		$.ajax({
			url: '/pp/ajax/reports/activity_graph_summary.php',		// Make an AJAX request to get graph data

			success: function(ajaxReturn)
			{
				series = $.parseJSON(ajaxReturn);

				if (series.length > 1) {			// Change output format for single users
					options.plotOptions.bar.stacking = 'percent';
					options.yAxis.title.text = '%';
				}

				options.series = series;			// Set the data to the graph
			},

			async: false,							// This is important to prevent the graph from rendering before data has been fetched
			cache: false
		});

		container.spinner('remove');				// The AJAX is request is complete, remove the spinner
		chart = new Highcharts.Chart(options);		// Generate the graph
	}

	function Construct(node)
	{
		container = $("<div>").attr({"id": "graph-container", "class": "list_inner"});	// Create the div where we'd like to render the graph
		container.width(node.parents("table.list_inner").last().width());
		node.parents("table.list_inner").last().after(container);						// Inject it into the dom
		tableImage = $("<img>").attr({"src": "/img/merge-cells-icon.png", "style": "display: none"});
		node.append(tableImage);														// Create the image to switch back to table view
		node.click(onClick);															// Bind the onClick function to the node's click event
	}

	Construct(node);																	// Run the Construct function
}

/**
 * Sets period to specific period.
 *
 * This function will change the value of period to "Specific Event" when
 * called. It's used to automatically set the period when the user changes
 * the value of one of the date range boxes
 *
 * @return void
 */
function setSpecificPeriod()
{
	$('select#period option:selected').removeAttr('selected');
	$('select#period option[value="10"]').attr('selected', '');
	$('select#period').change();
}

$(document).ready(function()
{
	graph = new drawGraph($('#draw-chart'));	// Define the element we want to click to trigger the graph

	// Bind some events
	$('input#FromDateDay').change(setSpecificPeriod);
	$('input#ToDateDay').change(setSpecificPeriod);
});