/*File is used to store the different layouts for cytoscape*/

function presetLayout(){
	
	return {
		name : 'preset',
		fit : true,
		zoom : '1',
		animate : false,
		animationDuration : '500',
		positions : function(ele) {
			return {
				x : ele.data('x') * 5,
				y : ele.data('y') * 5
			};
		},
		padding : '25'
	};
	
}

function gridLayout(){
    
	return {
		name : 'grid',
		fit : true,
		padding : 10,
		animate : false,
		rows : x,
		columns : y,
		position : function(node) {
			return {
				x : node.data('x'),
				y : node.data('y')
			};
		},
	};
}

function circleLayout(){
	
	return {
		
		name: 'circle',
	  	avoidOverlap: false,
	  	sort: function (a,b){return a.data('id') > b.data('id');},
	  	animate: true,
	  	animationDuration: 10000

	};
}

function concentricLayout(){
	
	return {
		
		name: 'concentric',
		fit: true, // whether to fit the viewport to the graph
		padding: 10, // the padding on fit
	    concentric: function(){ return this.data('cell'); },
	    levelWidth: function( nodes ){ return 10; },
	    padding: 10

	};
}

function concentricLayoutOld(){
    
    return {
        
        name: 'concentric',
        fit: true, // whether to fit the viewport to the graph
        padding: 10, // the padding on fit
        startAngle: 3/2 * Math.PI, // the position of the first node
        counterclockwise: false, // whether the layout should go counterclockwise/anticlockwise (true) or clockwise (false)
        minNodeSpacing: 1, // min spacing between outside of nodes (used for radius adjustment)
        boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
        avoidOverlap: false, // prevents node overlap, may overflow boundingBox if not enough space
        concentric: function(node){ // returns numeric value for each node, placing higher nodes in levels towards the centre
          return node.data('x');
        },
        levelWidth: function(node){ // the variation of concentric values in each level
              return node.data('x');
        },
        animate: false, // whether to transition the node positions
        animationDuration: 500, // duration of animation in ms if enabled
        ready: undefined, // callback on layoutready
        stop: undefined // callback on layoutstop

    };
}

function breadthfirstLayout(){
	
	return {
		
		fit: true, 
		  directed: false, // whether the tree is directed downwards (or edges can point in any direction if false)
		  padding: 30, 
		  circle: false, // put depths in concentric circles if true, put depths top down if false
		  spacingFactor: 1.75, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
		  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
		  avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
		  roots: undefined, // the roots of the trees
		  maximalAdjustments: 0, // how many times to try to position the nodes in a maximal way (i.e. no backtracking)
		  animate: false, // whether to transition the node positions
		  animationDuration: 500, // duration of animation in ms if enabled
		  ready: undefined, // callback on layoutready
		  stop: undefined // callback on layoutstop

	};
}

/*Layout depends on 3rd party library in js.libraries/dagre.min.js*/
function dagreLayout(){
	
	return {
		
		name: 'dagre',
	  	fit: true,
	  	animate: true,
	  	nodeSep: 1,
	  	rankDir: 'LR',
	  	padding: 1

	};
}

/*Layout needs sorting of nodes (see cpm.js function)*/
function coseLayout(){
	
	return{	
		name: 'cose',
	  	padding: 1,
	  	fit: true,
	  	nestingFactor: 5,
	  	gravity: 500,
	  	edgeElasticity: 200,
	  	//idealEdgeLength : 5,
	  	nodeRepulsion       : 1000000
	};
}

/*Layout depends on 3rd party library in js.libraries/cola.v3.min.js*/
function colaLayout(){
	
	return {
		name : 'cola',
		maxSimulationTime : 10000,
		padding : 1,
		avoidOverlap : true,
		fit : true,
		randomize : false,
		flow : 'dag',
		infinite : true
	};
}

/*Layout depends on 3rd party library in js.libraries/springy.js*/
function springyLayout(){
	
	return {
		
	  	name: 'springy',
	  	animate: true,
	  	fit: true,
	  	padding: 1,
	  	random: false,
	  	stiffness: 400,
	    repulsion: 400,
	    damping: 0.5
		
	};
}