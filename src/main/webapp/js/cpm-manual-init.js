//global visible variables
var cyContainer, areaTable, tableHeader, x, y, maxSigma, computationStep;


var  nodeID, nodeToChange;
var colorIndexForNode;
var dialog, form;
var elements;

var areas = [];

var colors = [];
var lightColor = "#96e0e0";
var darkColor = "#91243e";
var multipleSelection = false;
var multipleSelectionNodes = [];

function addSimulationButton(method){

    if(method == 'random'){
        // random init uses initial values
    }
    else if(method == 'manual'){
        // change some params if set manual
        $("input[name='ratioDarkToLightCells'], #profile, input[name='maxSigma'], input[name='maxX'], input[name='maxY'], input[name='matrixDensity']").prop( "disabled", true );
        $('#computeBtn').attr('onclick','cytoscapeRenderUserInitialisation("compute")');
        $('#computeBtn').removeAttr("disabled");
        $('#multipleComputeBtn').attr('onclick','cytoscapeRenderUserInitialisation("multipleCompute")');
        //$('#multipleComputeBtn').removeAttr("disabled"); // not working for the first manual click. set active after 1st click
        $('#resetSimBtn').show();

    }
    $("#randomInitBtn").prop( "disabled", true );
    $("#manualInitBtn").prop( "disabled", true );
}


function cytoscapeRenderUserInitialisation(method) {

    var sigmaCounter = 0;
    var colorArray = new Array();
    colorArray[0] = "#e2e2e2"; //default color for ECM

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

    // initialise areas
    areas =  new Array (maxSigma);
    areas[0] = x*y;
    for(var areaCounter = 1; areaCounter <= maxSigma; areaCounter++){
        areas[areaCounter] = 0;
    }

    colors.push("#e2e2e2");//default color for ECM

    var button = document.getElementById("randomInitBtn");
    button.disabled = true;

    if (method=='init') {
        httpType = 'POST';
        cyContainer = 'cyInitialized';
        areaTable = 'areaInitializedTable';
        tableHeader = 'areaInitializedTableHeader';
        computationStep = 0;
        if (maxSigma >= 1) {
            $('#toggleLineChart').show();
        }
        else {
            $('#toggleLineChart').hide();
        }
    }
    else if(method == 'compute'){

        if(computationStep == 0){
            sendUserInputToServlet();
            //console.log("compute with senduserinputtoservlet");
            $('#multipleComputeBtn').removeAttr("disabled"); // not working for the first manual click. set active after 1st click
        }
        else{
            computeNextStep();
            //console.log("compute with after "+computationStep);
        }
        return;
    }
    else {
        console.log("Method not defined!");
    }

    initCy();

    function initCy( then ) {

        //choose from available layouts in cytoscape-layouts
        //be careful some layouts need additional options (e.g. sorting...)
        var usedLayout = gridLayout();

        var t1 = performance.now();

        // calculation for leading zeros
        var numberOfNodes = x*y;
        var leadingZeros = Math.log10(numberOfNodes + maxSigma) + 1 ;

        elements = '[';
        var id = 0;
        var format = Array(Math.floor(leadingZeros + 1)).join('0');

        // visible nodes
        for (i = 0; i < x; i++){
            for(j = 0; j < y; j++){
                elements = elements + '{"data":{';
                var idFormatted  = (format+id).substr(-format.length, format.length);
                elements = elements + '"id":"' + idFormatted + '",';
                elements = elements + '"x":' + i +  ',';
                elements = elements + '"y":' + j +  ',';
                elements = elements + '"index":"' + i + '-' + j + '",';
                elements = elements + '"cell":"0",';
                var ancestor = 0 + numberOfNodes; // cell type plus numberOfNodes
                elements = elements + '"ancestor":"' + ancestor + '",';
                elements = elements + '"area":0,';
                elements = elements + '"color":"#96E0EA",';
                elements = elements + '"parentcolor":"#96e0e0"}}';
                id++;
                if(j + 1 != y){
                    elements = elements + ',';
                }
            }
            if(i + 1 != x){
                elements = elements + ',';
            }
        }

        if(maxSigma != 0){
            elements = elements + ',';
        }



        // invisible nodes, according to sigma
        for(sigma = 0; sigma <= maxSigma; sigma++){
            elements = elements + '{"data":{';
            var idFormatted  = (format+id).substr(-format.length, format.length);
            elements = elements + '"id":"' + idFormatted + '",';
            elements = elements + '"x":' + "-1" +  ',';
            elements = elements + '"y":' + "-1" +  ',';
            elements = elements + '"index":"' + "-1" + '-' + "-1" + '",';
            elements = elements + '"cell":"' + sigma + '",';
            elements = elements + '"ancestor":"' + id + '",';
            if(sigma == 0){
                elements = elements + '"area":' + x*y + ',';
            }
            else {
                elements = elements + '"area":0,';
            }

            var cellType = sigma;
            if(cellType == 0){
                elements = elements + '"color":"#96E0EA",';
                elements = elements + '"parentcolor":"#96e0e0"}}';
            }
            else {


                if(cellType % 2 == 0){
                    var color = getColor(lightColor, cellType, false);
                    elements = elements + '"color":"' + color + '",';
                    elements = elements + '"parentcolor":"' + lightColor + '"}}';
                    colors.push(color);
                }
                else {
                    var color = getColor(darkColor, cellType, true);
                    elements = elements + '"color":"' + color + '",';
                    elements = elements + '"parentcolor":"' + darkColor + '"}}';
                    colors.push(color);
                }

            }

            function addColor(node){
                colorIndexForNode = document.getElementById("color").value;
                colorIndexForNode = parseInt(colorIndexForNode);

                var newColor = colors[colorIndexForNode];

                // update area
                var previousColorIndexForNode = parseInt(node.data('cell'));

                var colorIndexForNodeID = x * y + colorIndexForNode;
                var previousColorIndexForNodeID = x * y + previousColorIndexForNode;

                colorIndexForNodeID  = (format+colorIndexForNodeID).substr(-format.length, format.length);
                previousColorIndexForNodeID  = (format+previousColorIndexForNodeID).substr(-format.length, format.length);

                areas[colorIndexForNode] += 1;
                areas[previousColorIndexForNode] -= 1;

                var increasedValue = areas[colorIndexForNode];
                var decreasedValue = areas[previousColorIndexForNode];

                //console.log("elements to update are: " + JSON.stringify(cy.elements().jsons()));


                cy.getElementById(colorIndexForNodeID).data('area', increasedValue);
                cy.getElementById(previousColorIndexForNodeID).data('area', decreasedValue);




                var parentColor;
                if(colorIndexForNode % 2 == 0){
                    parentColor = lightColor;
                }
                else{
                    parentColor = darkColor;
                }


                node.data('color', newColor);
                node.data('parentcolor', parentColor);
                node.data('cell', colorIndexForNode);
                node.data('ancestor', colorIndexForNode + x*y);


                //console.log("updated elements are: " + JSON.stringify(cy.elements().jsons()));
            }



            function addColorToNode() {


                if(multipleSelection ){
                    for(var n = 0; n < multipleSelectionNodes.length; n++){
                        addColor(multipleSelectionNodes[n]);

                    }
                    multipleSelectionNodes = [];
                    multipleSelection = false;
                }
                else {
                    addColor(nodeToChange);
                }




                dialog.dialog( "close" );

                return true;
            }



            id++;
            if(sigma != maxSigma){
                elements = elements + ',';
            }
        }


        elements = elements + ']';

        var colorCounter = 0;
        var colorsString = '[';
        for(colorCounter = 0; colorCounter < colors.length; colorCounter++){
            colorsString = colorsString + '"' + colors[colorCounter] + '"';
            if(colorCounter + 1 != colors.length){
                colorsString = colorsString + ','
            }
        }
        colorsString = colorsString + ']';


        $('[name="color"]').paletteColorPicker({
            position: 'downside',
            colors: JSON.parse(colorsString)
        });

        dialog = $( "#colorpicker" ).dialog({
            autoOpen: false,
            height: 400,
            width: 400,
            modal: true,
            buttons: {
                "Add cell type": addColorToNode,
                Cancel: function() {
                    dialog.dialog( "close" );
                }
            },
            close: function() {
                form[ 0 ].reset();
            }
        });


        form = dialog.find( "form" ).on( "submit", function( event ) {
            event.preventDefault();
            addColorToNode();
        });

        //console.log("user's initial elements are: " + elements);

        // create JSON object from string
        elements = JSON.parse(elements);


        //initiliaze cytoscape
        var cy = cytoscape({
            container: document.getElementById(cyContainer),
            elements: elements,
            //choose proper layout --> at the moment available see cytoscape-layouts.js
            layout: usedLayout,
            zoom: 1,
            pan: {x: 0, y: 0},
            minZoom: 0.125,
            maxZoom: 1.5,
            zoomingEnabled: true,
            userZoomingEnabled: true,
            panningEnabled: true,
            userPanningEnabled: false,
            autolock: false,
            autoungrabify: true,
            autounselectify: true,
            selectionType: 'single'; //'additive',
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
            renderer: {},
            ready: function () {
                //console.log("cytoscapeRender took: ", performance.now() - t1)
            },
            style: cytoscape.stylesheet()
                .selector('node')
                .style({
                    'content': 'data(id)',
                    'font-size': '8',
                    'font-style': 'inherit',
                    'min-zoomed-font-size': '8',
                    'text-halign': 'center',
                    'text-valign': 'center',
                    'background-color': function (ele) {
                        return ele.data('color');
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
                    'display': 'none'
                })
                .selector('edge')
                .style({
                    'display': 'none',//at the moment edges are not rendered (+ performance)
                    'width': '1',
                    'line-color': 'gray', //'#E0E0E0', //gray,
                    'line-style': 'solid',
                    'curve-style': 'haystack'
                })




        });


        cy.on('click', 'node', function(evt){
            if(evt.cyTarget){
                nodeToChange = evt.cyTarget;
                dialog.dialog("open");
            }
        });




        cy.on('select', 'node', function(evt){
            window["selectedNodes"] = cy.$('node:selected');
            multipleSelection = true;
            multipleSelectionNodes.push(evt.cyTarget);
            dialog.dialog("open");
        });
    }

    function getColor(initialColor, cellType, isDark) {

        if(isDark) {
            cellType = cellType*(-1);
        }
        var color = initialColor.substring(1); // get rid of #
        color = "0x" + color;
        color = parseInt(color);
        color = color + 10*cellType;
        color = color.toString(16);

        if(color.length > 6){
            color = color.substring(color.length - 6);
        }
        else {
            if(color.length != 6){
                // add padding
                var zeros = 6 - color.length;
                var i;
                for(i = 0; i < zeros; i++){
                    color = "0" + color;
                }

            }
        }
        color = "#" + color;

        return color;
    }


    /* compute next steps of user initialised graph */
    function sendUserInputToServlet(){

        // create CPM
        httpType = 'POST';
        cyContainer = 'cyInitialized';
        areaTable = 'areaInitializedTable';
        tableHeader = 'areaInitializedTableHeader';
        computationStep = 0;
        if (maxSigma>=1) { $('#toggleLineChart').show(); }
        else {  $('#toggleLineChart').hide(); }

         $('.loading-spinner').show(); // show loading feedback when render method called

         ajax1 = performance.now();

         // requesting CPM data
         var graphP = $.ajax({
         url: './JSONCPMServlet',
         type: httpType,
         dataType: 'json',
         data: {
         'method': 'manual',
         'elements' : JSON.stringify(elements),
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
         });

        Promise.all([ graphP ]).then(initCyCPM);


        function initCyCPM( then ){

            console.log("ajax request response took: ", performance.now()-ajax1 );

            //first params is our cytoscape cpm json
            var expJson = then[0];
            // console.log("cytoscape cpm json is:" + JSON.stringify(expJson));

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
           // console.log("random elements are: " + JSON.stringify(elements));

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
                userPanningEnabled: false,
                autolock: false,
                autoungrabify: true,
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
                ready:    function(){
                    //console.log("cytoscapeRender took: ", performance.now()-t1)
                },
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
                cy.forceRender();
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

            computeNextStep();
        }

    }

    function computeNextStep() {
        httpType = 'GET';
        cyContainer = 'cyComputed';
        areaTable = 'areaComputedTable';
        tableHeader = 'areaComputedTableHeader';
        computationStep++;

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
            // console.log("cytoscape cpm json is:" + JSON.stringify(expJson));

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
            //console.log("elements of computation are: " + JSON.stringify(elements));

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
                userPanningEnabled: false,
                autolock: false,
                autoungrabify: true,
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
                ready:    function(){
                    //console.log("cytoscapeRender took: ", performance.now()-t1)
                },
                style: cytoscape.stylesheet()
                    .selector('node')
                    .style({
                        'content': 'data(id)',
                        'font-size' : '8',
                        'font-style' : 'inherit',
                        'min-zoomed-font-size' : '8',
                        'text-halign' : 'center',
                        'text-valign' : 'center',
                        'background-color':
                            function (ele){
                                /*return ele.data('color');
                            }
                                */if (maxSigma > 2) {
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
            //
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
                cy.forceRender();
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

                // we need to add 2 because one for headers in 1 column and 1 for
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
        }

  }//cytoscapeInit End
}
