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

function addSimulationButton(method){
    if(method == 'random'){
        document.getElementById('btnHolder').innerHTML = "<button class='btn btn-primary' type='button' onclick='cytoscapeRender(&quot;compute&quot;)'>compute next simulation run</button>";

    }
    else if(method == 'manual'){
        document.getElementById('btnHolder').innerHTML = "<button class='btn btn-primary' type='button' onclick='cytoscapeRenderUserInitialisation(&quot;compute&quot;)'>compute next simulation run</button>";

    }
}


function cytoscapeRenderUserInitialisation(method) {


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

    // initialise areas
    areas =  new Array (maxSigma);
    areas[0] = x*y;
    for(var areaCounter = 1; areaCounter <= maxSigma; areaCounter++){
        areas[areaCounter] = 0;
    }


    colorArray[0] = "#e2e2e2"; //default color for ECM
    colors.push("#e2e2e2")


    var button = document.getElementById("randomInitBtn");
    button.disabled = true;
    button.classList.add("btn-disabled");

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
        sendUserInputToServlet();
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
        var leadingZeros = Math.log10(numberOfNodes) + 1 ;

        

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


            function addColorToNode() {
                colorIndexForNode = document.getElementById("color").value;
                colorIndexForNode = parseInt(colorIndexForNode);

                var newColor = colors[colorIndexForNode];
                console.log("newColor is" + newColor);

                // update area
                if(areas[colorIndexForNode] < x*y){

                    var previousColorIndexForNode = parseInt(nodeToChange.data('cell'));

                    var colorIndexForNodeID = x * y + colorIndexForNode;
                    var previousColorIndexForNodeID = x * y + previousColorIndexForNode;

                    areas[colorIndexForNode] += 1;
                    areas[previousColorIndexForNode] -= 1;

                    var increasedValue = areas[colorIndexForNode];
                    var decreasedValue = areas[previousColorIndexForNode];

                    cy.getElementById(colorIndexForNodeID).data('area', increasedValue);
                    cy.getElementById(previousColorIndexForNodeID).data('area', decreasedValue);
                }
                else {
                    console.log("Error: too many cells of this cell type")
                    return;
                }



                var parentColor;
                if(colorIndexForNode % 2 == 0){
                    parentColor = lightColor;
                }
                else{
                    parentColor = darkColor;
                }


                nodeToChange.data('color', newColor);
                nodeToChange.data('parentcolor', parentColor);
                nodeToChange.data('cell', colorIndexForNode);
                nodeToChange.data('ancestor', colorIndexForNode + x*y);

                console.log(colors);
                console.log(newColor);
                console.log("updated elements are: " + JSON.stringify(cy.elements().jsons()));


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
            height: 500,
            width: 800,
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

        //console.log("elements are: " + elements);

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
            renderer: {},
            ready: function () {
                console.log("cytoscapeRender took: ", performance.now() - t1)
            },
            style: cytoscape.stylesheet()
                .selector('node')
                .style({
                    'content': 'data(id)',
                    //'width' : '10',
                    //'height' : '10',
                    //'font-weight' : 'bold',
                    'font-size': '8',
                    'font-style': 'inherit',
                    'min-zoomed-font-size': '8',
                    'text-halign': 'center',
                    'text-valign': 'center',
                    //'border-width' : '1',
                    //'border-color': '#333',
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

        cy.on('click', function(evt){

            //nodeID = evt.cyTarget.id();
            nodeToChange = evt.cyTarget;
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

/*    function initializeAreas() {
        var i, j = 0;
        area[0] = x * y;
        var sumCellArea = 0;
        var counter = 1;
        var ratioDarkLight = 1;
        ratioDarkLight = ratioDarkToLightCells;

        while(sumCellArea < x * y * matrixDensity){

            i=getRandom(0, x - 1);
            j=getRandom(0, y - 1);

            //if we override a cell, we have to update the area of this cell
            area[sigma[i][j]]--;

            //if we override an already filled cell, we have to reduce the sumCellArea
            if(sigma[i][j] > 0){
                sumCellArea--;
            }

            // adjust relative proportion between light and dark cells by a specified ratio
            if (counter % ratioDarkLight == 0) {
                sigma[i][j] = getRandomOdd(1, maxSigma - 1);
            }
            else {
                sigma[i][j] = getRandomEven(1, maxSigma - 1);
            }

            //for the new cell we have to update the area also
            area[sigma[i][j]]++;
            sumCellArea++;
            counter++;

        }

    }*/

    function sendUserInputToServlet(){

        console.log("compute next steps of user initialised graph");

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

    }



}


