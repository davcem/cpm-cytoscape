//global visible variables
var cyContainer, areaTable, tableHeader, x, y, maxSigma;

function cytoscapeRender(method){
	
	/*Because we have two different cytoscape graphs we define to different methods
	 * - init: ajax call is post and cy container is cyInitialized
	 * - compute: ajax call is get and cy container is cyComputed*/	
			
	if (method=='init') {
		httpType = 'POST';
		cyContainer = 'cyInitialized';
		areaTable = 'areaInitializedTable';
		tableHeader = 'areaInitializedTableHeader';
		
	} else if (method='compute') {
		httpType = 'GET';
		cyContainer = 'cyComputed';
		areaTable = 'areaComputedTable';
		tableHeader = 'areaComputedTableHeader';
	} else {
		console.log("Method not defined!");
	}
	
	x = document.getElementsByName("maxX")[0].value;
	y = document.getElementsByName("maxY")[0].value;
	var mcs = document.getElementsByName("mcs")[0].value;
	var mcSubsteps = document.getElementsByName("mcSubsteps")[0].value;
	maxSigma = document.getElementsByName("maxSigma")[0].value;
	var matrixDensity = document.getElementsByName("matrixDensity")[0].value;
	var temperature = document.getElementsByName("temperature")[0].value;

	  var graphP = $.ajax({
	    url: 'http://localhost:8080/cpm/JSONCPMServlet',
	    type: httpType,
	    dataType: 'json',
	    data: {
	    	
	    	'xMax': x,
	    	'yMax': y,
	    	'mcs': mcs,
	    	'mcSubsteps': mcSubsteps,
	    	'sigmaMax': maxSigma,
	    	'matrixDensity': matrixDensity,
	    	'temperature': temperature

	    }		
	  });
	  
	  //if asynchrone requests returns we initialize cytoscape
	  Promise.all([ graphP ]).then(initCy);
	  
	  function initCy( then ){
	    
		//first params is our cytoscape cpm json
	    var expJson = then[0];
	    
	    var elements = expJson.elements;
	    
	    var cy = cytoscape({
	      container: document.getElementById(cyContainer),
	      elements: elements,
	      //choose proper layout --> at the moment available see cytoscape-layouts.js
	      layout: gridLayout(),  	     	  
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
		// rendering options:
		  headless: false,
		  styleEnabled: true,
		  hideEdgesOnViewport: true,
		  hideLabelsOnViewport: false,
		  textureOnViewport: true,
		  motionBlur: false,
		  motionBlurOpacity: 0.2,
		  wheelSensitivity: 0.25,
		  pixelRatio: 1, //'auto',
		  initrender: function(evt){ /* ... */ },
		  renderer: { /* ... */ },
		  style: cytoscape.stylesheet()
			.selector('node')
				  .style({
					  'content': 'data(cell)',
					  'width' : '50',
					  'height' : '50',
					  'font-weight' : 'bold',
					  'font-size' : '12',
					  'font-style' : 'inherit',
					  'min-zoomed-font-size' : '6',
					  'text-halign' : 'center',
					  'text-valign' : 'center',
				      'background-color': function (ele){			    	  
				    	  return ele.data('parentcolor');	//color | parentcolor			    	  				    	  
				      }
				  })
				  /*set special colour for ECM*/
			.selector('node[cell = "0"]')
			      .style({
			    	  'background-color': 'silver'
			      	})
			      /*hide ancestor nodes*/
			.selector('node[x < "0"]')
			      .style({
			    	  'display' : 'none'
			      	})
			.selector('edge')
			      .style({
			    	  'display' : 'none',//add the moment edges are not rendered (+ performance)
			    	  'width' : '1',
			    	  'line-color' : 'gray', //'#E0E0E0', //gray,
			    	  'line-style' : 'solid',
			    	  'curve-style' : 'haystack'
			    	  
			      	})
		});
	    
	    //sortNodes();
	    
	    addAreaOutput();
	    
	    /*Function sorts nodes of cytoscape graph (some layouts depend on sorted nodes)*/
	    function sortNodes(){
	    	
	    	var nodesToremove = cy.nodes();
	        var edgesToAdd = cy.edges();
	        
	        var nodesSorted = cy.nodes().sort(function( a, b ){
	        	  return a.data('id') > b.data('id');
	        	});
	        
	        cy.remove(nodesToremove);
	        cy.add(nodesSorted);
	        cy.add(edgesToAdd);
	    	
	    }
	    
	    /*Function adds the area output at the end of page*/
	    function addAreaOutput(){
	    	
	    	var parentNodes = cy.elements("node[x < 0]");
	    	
	    	parentNodes.sort(function( a, b ){
	    		  return a.data('cell') > b.data('cell');
	    		});
	    	
	    	var currentTableHeader = areaTable+"Header";

	    	var currentAreaTable = document.getElementById(currentTableHeader);
	    	
	    	//we need to add 2 because one for headers in 1 colum and 1 for cell 0 (ECM)
	    	currentAreaTable.colSpan = maxSigma + 2;
    	
	    	var table = document.getElementById(areaTable);
	    	
	    	var rows = document.getElementById(areaTable).rows;
	    	
	    	if (rows.length > 1){
	    		
	    		table.deleteRow(1);
	    		table.deleteRow(1);
	    	}
	    	
	        var rowOne = table.insertRow(1);
	        var cellOne = rowOne.insertCell(0);
	        cellOne.innerHTML = "Cell id";
	        var rowTwo = table.insertRow(2);
	        var cellTwo = rowTwo.insertCell(0);
    		cellTwo.innerHTML = "Area";
	        
	        parentNodes.forEach(function( ele,i ){
	        	var cellOne = rowOne.insertCell(i+1);
	    		cellOne.innerHTML = ele.data('cell');
	    		
	    		var cellTwo = rowTwo.insertCell(i+1);
	    		cellTwo.innerHTML = ele.data('area');
	    		  
	    	});    	
	    }
	  }//cytoscapeInit End
} 
