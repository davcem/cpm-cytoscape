//global visible variables
var cyContainer, areaTable, tableHeader, x, y, maxSigma, computationStep;


var  nodeID, nodeToChange;
var colorForNode;
var dialog, form;

var colors = [];
var lightColor = "#96e0e0";
var darkColor = "#91243e";


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
    colorArray[0] = "#e2e2e2"; //default color for ECM
    colors.push("#e2e2e2")

    //var area = new Array(maxSigma);
    //var sigma = new Array(maxSigma);

    var button = document.getElementById("randomInitBtn");
    button.disabled = true;
    button.classList.add("btn-disabled");

    if (method=='init') {
        httpType = 'POST';
        cyContainer = 'cyInitialized';
        areaTable = 'areaInitializedTable';
        tableHeader = 'areaInitializedTableHeader';
        computationStep = 0;
        if (maxSigma>=1) { $('#toggleLineChart').show(); }
        else {  $('#toggleLineChart').hide(); }

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

        

        var elements = '[';
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
                elements = elements + '"area":1024,'; //?
            }
            else {
                elements = elements + '"area":0,'; // ?
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
                colorForNode = document.getElementById("color").value;

                var newColor = colors[colorForNode];

                var parentColor;
                if(colorForNode % 2 == 0){
                    parentColor = lightColor;
                }
                else{
                    parentColor = darkColor;
                }


                // todo: check again if calculated correctly
                nodeToChange.data('color', newColor);
                nodeToChange.data('parentcolor', parentColor);
                nodeToChange.data('cell', colorForNode);
                nodeToChange.data('ancestor', colorForNode + x*y);


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
                        if (maxSigma > 2) {
                            if (sigmaCounter <= maxSigma) {
                                if ($.inArray(ele.data('color'), colorArray) == -1) {
                                    colorArray[ele.data('cell')] = ele.data('color');
                                    sigmaCounter++;
                                }
                            }
                            return ele.data('color'); // color specified in NodeJSONAdapter
                        }
                        else {
                            if (sigmaCounter <= maxSigma + 1) {
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

            nodeID = evt.cyTarget.id();
            nodeToChange = evt.cyTarget;
            console.log("nodeToChange is on click: ")
            console.log(nodeToChange);
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



}