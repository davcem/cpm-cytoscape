//global visible variables
var cyContainer, areaTable, tableHeader, x, y, maxSigma, computationStep, multipleComputeTimesRun;

function cytoscapeRender(method){

	/*Because we have two different cytoscape graphs we define to different methods
	 * - init: ajax call is post and cy container is cyInitialized
	 * - compute: ajax call is get and cy container is cyComputed*/

    x = document.getElementsByName("maxX")[0].value;
    y = document.getElementsByName("maxY")[0].value;
    var mcs = document.getElementsByName("mcs")[0].value;
    var mcSubsteps = document.getElementsByName("mcSubsteps")[0].value;
    var maxSigma = document.getElementsByName("maxSigma")[0].value;
    var matrixDensity = document.getElementsByName("matrixDensity")[0].value;
    var temperature = document.getElementsByName("temperature")[0].value;
    var jEcm = document.getElementsByName("jEcm")[0].value;
    var jLightCells = document.getElementsByName("jLightCells")[0].value;
    var jDarkCells = document.getElementsByName("jDarkCells")[0].value;
    var jDifferentCells = document.getElementsByName("jDifferentCells")[0].value;
    var lambdaArea = document.getElementsByName("lambdaArea")[0].value;
    var targetAreaFactorLight = document.getElementsByName("targetAreaFactorLight")[0].value;
    var targetAreaFactorDark = document.getElementsByName("targetAreaFactorDark")[0].value;
    var ratioDarkToLightCells = document.getElementsByName("ratioDarkToLightCells")[0].value;
    var darkCellDecrease = document.getElementsByName("darkCellDecrease")[0].selectedIndex;

    var sigmaCounter = 0;
    var colorArray = new Array();
    colorArray[0] = "#e2e2e2"; //default color for ECM

    if (method=='init') {
        httpType = 'POST';
        cyContainer = 'cyInitialized';
        areaTable = 'areaInitializedTable';
        tableHeader = 'areaInitializedTableHeader';
        computationStep = 0;
        if ($('#computeBtn').is(":disabled")) {
            $('#computeBtn').removeAttr("disabled");
        }
        if ($('#multipleComputeBtn').is(":disabled")) {
            $('#multipleComputeBtn').removeAttr("disabled");
        }
        if (maxSigma>=1) { $('#toggleLineChart').show(); }
        else {  $('#toggleLineChart').hide(); }
        $('#resetSimBtn').show();
    }
    else if (method=='compute') {
        httpType = 'GET';
        cyContainer = 'cyComputed';
        areaTable = 'areaComputedTable';
        tableHeader = 'areaComputedTableHeader';
        computationStep++;
    }
    else if (method=='multipleCompute') {
        httpType = 'GET';
        cyContainer = 'cyComputed';
        areaTable = 'areaComputedTable';
        tableHeader = 'areaComputedTableHeader';
        computationStep++;
        multipleComputeTimesRun = 0;
        _doMultipleComputeRuns();
    }
    else {
        console.log("Method not defined!");
    }


    $('.loading-spinner').show(); // show loading feedback when render method called

    ajax1 = performance.now();

    // requesting CPM data
    var graphP = $.ajax({
        url: './JSONCPMServlet',
        type: httpType,
        dataType: 'json',
        data: {
            'xMax': x,
            'yMax': y,
            'mcs': mcs,
            'mcSubsteps': mcSubsteps,
            'sigmaMax': maxSigma,
            'matrixDensity': matrixDensity,
            'temperature': temperature,
            'jEcm': jEcm,
            'jLightCells': jLightCells,
            'jDarkCells': jDarkCells,
            'jDifferentCells': jDifferentCells,
            'lambdaArea': lambdaArea,
            'targetAreaFactorLight': targetAreaFactorLight,
            'targetAreaFactorDark': targetAreaFactorDark,
            'ratioDarkToLightCells' : ratioDarkToLightCells,
            'darkCellDecrease' : darkCellDecrease
        }

    }).done(function(data){
        $('.loading-spinner').fadeOut(); // hide loading feedback after finish
        //var responseTime = (new Date().getTime() - ajaxTime) / 1000;
        //console.log("Ajax Time: " + responseTime + " seconds");
    });

    //if asynchrone requests returns we initialize cytoscape
    Promise.all([ graphP ]).then(initCy);

    function initCy( then ){

        console.log("ajax request response took: ", performance.now()-ajax1 );

        //first params is our cytoscape cpm json
        var expJson = then[0];

        //the elements of the ajax response
        var elements = expJson.elements;

        //choose from available layouts in cytoscape-layouts
        //be careful some layouts need additional options (e.g. sorting...)
        var usedLayout = gridLayout();

        //if we use the grid layout we don't need edges
        //only adding nodes will increase performance for grid layout by factor 2 at least
        if(usedLayout.name == 'grid'){

            //replace elements with only nodes of ajax response
            elements = expJson.elements.nodes;

        }

        var t1 = performance.now();

        //initiliaze cytoscape
        var cy = cytoscape({
            container: document.getElementById(cyContainer),
            elements: elements,
            //choose proper layout --> at the moment available see cytoscape-layouts.js
            layout: usedLayout,
            zoom: 1,
            pan: { x: 0, y: 0 },
            minZoom: 0.125,
            maxZoom: 1.5,
            zoomingEnabled: true,
            userZoomingEnabled: true,
            panningEnabled: true,
            userPanningEnabled: true,
            boxSelectionEnabled: false,
            autolock: false,
            autoungrabify: false,
            autounselectify: false,
            selectionType: 'single',
            boxSelectionEnabled: true,
            // rendering options
            headless: false,
            styleEnabled: true,
            hideEdgesOnViewport: true,
            hideLabelsOnViewport: false,
            textureOnViewport: true,
            motionBlur: true,
            wheelSensitivity: 0.25,
            pixelRatio: 'auto',
            initrender: 'ready',
            renderer: {  },
            ready:    function(){ console.log("cytoscapeRender took: ", performance.now()-t1)},
            style: cytoscape.stylesheet()
                .selector('node')
                .style({
                    'content': 'data(id)',
                    //'width' : '10',
                    //'height' : '10',
                    //'font-weight' : 'bold',
                    'font-size' : '8',
                    'font-style' : 'inherit',
                    'min-zoomed-font-size' : '8',
                    'text-halign' : 'center',
                    'text-valign' : 'center',
                    //'border-width' : '1',
                    //'border-color': '#333',
                    'background-color':
                        function (ele){
                            if (maxSigma > 2) {
                                if (sigmaCounter <= maxSigma) {
                                    if ( $.inArray(ele.data('color'), colorArray) == -1 ){
                                        colorArray[ele.data('cell')] = ele.data('color');
                                        sigmaCounter++;
                                    }
                                }
                                return ele.data('color'); // color specified in NodeJSONAdapter
                            }
                            else {
                                if (sigmaCounter <= maxSigma+1) {
                                    colorArray[ele.data('cell')] = ele.data('parentcolor');
                                    sigmaCounter++;
                                }
                                return ele.data('parentcolor');  // color specified in the NodeJSONAdapter
                            }
                        }
                })
                //set special colour for ECM
                .selector('node[cell = "0"]')
                .style({
                    'background-color': '#e2e2e2'
                })
				/*hide ancestor nodes*/
                .selector('node[x < "0"]')
                .style({
                    'display' : 'none'
                })
                .selector('edge')
                .style({
                    'display' : 'none',//at the moment edges are not rendered (+ performance)
                    'width' : '1',
                    'line-color' : 'gray', //'#E0E0E0', //gray,
                    'line-style' : 'solid',
                    'curve-style' : 'haystack'
                })
        });
        addAreaOutput();

        // Output time for performance measuring
        //var renderTime = (new Date().getTime() - graphRenderInitTime) / 1000;
        //console.log("Graph Rendering Time: " + renderTime + " seconds");

		/*Function sorts nodes of cytoscape graph (some layouts depend on sorted nodes)*/
        function sortNodes(){


            var nodesToremove = cy.nodes();
            var edgesToAdd = cy.edges();

            var nodesSorted = cy.nodes().sort(function( a, b ){
                return a.data('id') < b.data('id'); //may also be sorted by cell-relation or area-size
            });

            cy.startBatch();
            cy.remove(nodesToremove);
            cy.add(nodesSorted);
            cy.add(edgesToAdd);
            cy.forceRender()
            cy.endBatch();
        }

		/*Function adds the area output at the end of page*/

        function addAreaOutput() {

            var parentNodes = cy.elements("node[x < 0]");

            parentNodes.sort(function(a, b) {
                return a.data('cell') > b.data('cell'); // may also be sorted by
                // cell-relation or area
            });

            var currentTableHeader = areaTable + "Header";

            var currentAreaTable = document.getElementById(currentTableHeader);

            // we count computation steps and output them
            if (computationStep > 0) {
                document.getElementById(currentTableHeader).innerHTML = "Cell area after computation step "
                    + computationStep + ":";
                $("#cyComputed canvas").fadeIn();
                $("#areaComputedTable tr").fadeIn();
            } else if (computationStep === 0) { // reset by init
                // put code here to remove older computed results by init
                $("#cyComputed canvas").fadeOut().remove();
                $("#areaComputedTable tr").fadeOut();
            }

            // we need to add 2 because one for headers in 1 colum and 1 for
            // cell 0 (ECM)
            currentAreaTable.colSpan = maxSigma + 2;

            var table = document.getElementById(areaTable);

            var rows = document.getElementById(areaTable).rows;

            if (rows.length > 1) {

                table.deleteRow(1);
                table.deleteRow(1);
            }

            // prepare data table below visualization
            var rowOne = table.insertRow(1);
            var cellOneInRowOne = rowOne.insertCell(0);
            cellOneInRowOne.innerHTML = "Cell id";
            var rowTwo = table.insertRow(2);
            var cellTwoInRowTwo = rowTwo.insertCell(0);
            cellTwoInRowTwo.innerHTML = "Area";

            for (i = 0; i <= maxSigma; i++) {
                rowOne.insertCell(i + 1);
                rowTwo.insertCell(i + 1);
            }

            // update data table
            parentNodes
                .forEach(

                    function(ele, i) {
                        var tableCellIndex = ele.data('cell');
                        tableCellIndex++;

                        var cellForIDLabel = rowOne
                            .getElementsByTagName("td")[tableCellIndex];
                        cellForIDLabel.innerHTML = ele.data('cell');
                        cellForIDLabel.style.background = colorArray[ele
                            .data('cell')];

                        var cellForAreaCount = rowTwo
                            .getElementsByTagName("td")[tableCellIndex];
                        cellForAreaCount.innerHTML = ele.data('area');
                        cellForAreaCount.style.background = colorArray[ele
                            .data('cell')];
                    });

            // update line chart
            if (maxSigma == 2) {
                updateLineChart();
            }

        }
    }//cytoscapeInit End
}

/**
 * compute multiple steps after another for fast forward simulation
 */
function _doMultipleComputeRuns() {
    if (multipleComputeTimesRun < 10) {
        setTimeout(function(){
            $("#computeBtn").click();
            _doMultipleComputeRuns();
        }, 500);
        multipleComputeTimesRun++;
    }
}