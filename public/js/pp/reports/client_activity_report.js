function drawGraph(node) {
    var container = undefined;	// The div that the graph will be rendered to
    var chart = undefined;		// The Highcharts object
    var node = node;			// The node that's clicked to trigger this
    // script

    // See the Highcharts documentation for details on all these options.
    // http://www.highcharts.com/ref/
        
    options = {
        chart: {
            renderTo: 'graph-container'
        },
        credits: {
            href: '#',
            text: 'Placement Partner'
        },
        title: {
            text: 'Client Activity'
        },
        xAxis: {
            categories: []
        },
        tooltip: {
            formatter: function() {
                var s;

                if (this.point.name)
                    s = this.point.name + ': ' + this.y + '%';
                else 
                    s = '' + this.series.name + ': ' + this.y;
                return s;
            }
        },
        labels: {
            items: [{
                html: 'Overall Ratio',
                style: {
                    left: '40px',
                    top: '8px',
                    color: 'black'
                }
            }]
        },
        series: [{
            type: 'column',
            name: 'Vacancies',
            data: []
        }, {   
            type: 'column',
            name: 'Interactions',
            data: []
        }, {
            type: 'column',
            name: 'Placements',
            data: []
        }, {
            type: 'pie',
            name: 'Overall Ratio',
            data: [{
                name: 'Fallaway',
                y: 0,
                color: '#AA4643'
            }, {
                name: 'Total',
                y: 0,
                color: '#4572A7'
            }],
            center: [100, 80],
            size: 100,
            showInLegend: false,
            dataLabels: {
                enabled: false
            }
        }]
    };

    // The click event for the node.
    function onClick() {
        icons = node.find("img");
        icons.each(function() {
            $(this).toggle();
        });	// Switch between the graph  and table icon

        if (icons.first('display').css('display') == 'none') {
            node.attr('title', 'Show Table');		// Show the label for tabel view
        } else {
            node.attr('title', 'Show Graph');		// Show the label for graph view
        }

        container.toggle();							// Switch between the graph and the table output
        container.siblings('table.list_inner').find('tbody tr').first().nextAll().each(function() {
            $(this).toggle()
        });

        if (chart === undefined) {	// The graph doesn't exist yet
            node.unbind('click');	// Disable the click even on the node to prevent multiple AJAX requests
            node.click(function() {
                return false;
            });
            container.spinner();
            buildGraph();			// Call this function to generate the graph
            // Show the spinner, so the user know something's happening and they need to wait

            container.spinner('remove');				// The AJAX is request is complete, remove the spinner
            node.unbind('click');	// Re-enable the click event
            node.click(onClick);
        }

        return false;
    }

    function buildGraph() {
        // Show the spinner, so the user know something's happening and they need to wait

        $.ajax({
            url: '/pp/ajax/reports/client_activity_graph_summary.php',		// Make an AJAX request to get graph data

            success: function(ajaxReturn) {
                var jdata = $.parseJSON(ajaxReturn);

                // company names
                options.xAxis.categories = jdata.cats;
                                
                // companies data
                options.series[0].data = jdata.vacs;
                                
                options.series[1].data = jdata.intr;
                options.series[2].data = jdata.plac;
                                
                // overall/pie ratio chart
                options.series[3].data[1].y = jdata.rato;
                options.series[3].data[0].y = jdata.urat;
            },

            async: false,							// This is important to prevent the graph from rendering before data has been fetched
            cache: false
        });
        
        chart = new Highcharts.Chart(options);		// Generate the graph
    }

    function Construct(node) {
        container = $("<div>").attr({
            "id": "graph-container", 
            "class": "list_inner"
        });	// Create the div where we'd like to render the graph
        node.parents("table.list_inner").last().after(container);						// Inject it into the dom
        tableImage = $("<img>").attr({
            "src": "/img/merge-cells-icon.png", 
            "style": "display: none"
        });
        node.append(tableImage);														// Create the image to switch back to table view
        node.click(onClick);															// Bind the onClick function to the node's click event
    }

    Construct(node);																	// Run the Construct function
}

$(document).ready(function(){
    graph = new drawGraph($('#draw-chart'));	// Define the element we want to click to trigger the graph
})