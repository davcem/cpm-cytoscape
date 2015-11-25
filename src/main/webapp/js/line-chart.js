$(document).ready(function(){

 $("#toggleLineChart").click(function() {

  if($("#growthAsLineChartContainer").hasClass("hide")){
    $("#growthAsLineChartContainer").fadeIn().toggleClass('hide show');
    $("#toggleLineChart").text("hide line chart");
  } 
   else {
   $("#growthAsLineChartContainer").fadeOut().toggleClass('show hide');
   $("#toggleLineChart").text("show line chart");
  }

 });
 
});

// plotting line charts for cell data
function updateLineChart(){
  
  /* test values: 
  var celldata1, celldata2 = [];
  for (var i = 0; i < 14; i += 0.5) {
  	celldata1.push([i, cell.data('area')]);
  } */
  if( $("#cyInitialized canvas").length ) { 
    
    var celldata1 = [[-1, 0], [0,$("#areaInitializedTable tbody tr:nth-child(3) td:nth-child(3)").text()]];
    // A null signifies separate line segments
    var celldata2 = [[-1, 0], [0,$("#areaInitializedTable tbody tr:nth-child(3) td:nth-child(4)").text()]];
    
    if( $("#cyComputed canvas").length ) {
       celldata1.push([computationStep,$("#areaComputedTable tbody tr:nth-child(3) td:nth-child(3)").text()]);
       celldata2.push([computationStep,$("#areaComputedTable tbody tr:nth-child(3) td:nth-child(4)").text()]);
    } 
    
    // draw line charts for cell types
    $.plot("#growthAsLineChartContainer", [
  			{ label: "cells of cell 1", data: celldata1, color: "red" },
  			{ label: "cells of cell 2", data: celldata2, color: "green" }
  		], {
  			series: {
  				lines: { show: true },
  				points: { show: true }
  			},
  			xaxis: {
  				
  			},
  			yaxis: {
  				
  			},
  			grid: {
  				backgroundColor: { colors: [ "#fff", "#eee" ] },
  				borderWidth: {
  					top: 1,
  					right: 1,
  					bottom: 2,
  					left: 2
  				}
  			}
  		});
  	}
  	else if( ! $("#cyComputed canvas").length ) { 
      // update graph and only add new points
    }
}