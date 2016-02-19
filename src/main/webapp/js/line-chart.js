$(document).ready(function(){
  
  //define arrays for cell data to be plotted as line chart
  var celldata1, celldata2, lightcellcolor, darkcellcolor;

  $("#toggleLineChart").click(function() {
  
    if($("#growthAsLineChartContainer").hasClass("hide")){
      $("#growthAsLineChartContainer").fadeIn().toggleClass('hide show');
      $("#toggleLineChart").text("hide line chart");
      $("#growthAsLineChartContainer").css("top", $("#menuContainer").height()-50);  //-50 because of the container's default 5em margin
      
      if ($("#growthAsLineChartContainer > #lineChart > canvas").width() <= 100) { //resize initially
        updateLineChart();
        $('#toggleLineChart').load();
      }
    } 
    else {
      $("#growthAsLineChartContainer").fadeOut().toggleClass('show hide');
      $("#toggleLineChart").text("show line chart");
    }
    
  });
 
});

// plotting line charts for cell data
function updateLineChart(){ 

  if( $("#cyInitialized canvas").length){
    if( $("#cyInitialized canvas").length && !$("#cyComputed canvas").length ) { // init cell data arrays
      celldata1 = [[-1, 0], [0,$("#areaInitializedTable tbody tr:nth-child(3) td:nth-child(3)").text()]];
      celldata2 = [[-1, 0], [0,$("#areaInitializedTable tbody tr:nth-child(3) td:nth-child(4)").text()]];
    }
    if( $("#cyComputed canvas").length ) {  // add data after computation
       celldata1.push([computationStep,$("#areaComputedTable tbody tr:nth-child(3) td:nth-child(3)").text()]);
       celldata2.push([computationStep,$("#areaComputedTable tbody tr:nth-child(3) td:nth-child(4)").text()]);
    }
    
    lightcellcolor = $("#areaInitializedTable tbody tr:nth-child(3) td:nth-child(3)").css("background-color");
    darkcellcolor = $("#areaInitializedTable tbody tr:nth-child(3) td:nth-child(4)").css("background-color");

    // draw line charts for cell types
    $.plot("#lineChart", [
  			{ label: "cells of cell 1", data: celldata1, color: lightcellcolor },
  			{ label: "cells of cell 2", data: celldata2, color: darkcellcolor }
  		], {
  			series: {
  				lines: { show: true },
  				points: { show: true }
  			},
  			xaxis: {
  				axisLabel: "# computation steps",
  				axisLabelUseCanvas: true,
  				xisLabelFontSizePixels: 13,
          axisLabelFontFamily: 'Verdana, Arial',
          axisLabelPadding: 5,
          minTickSize: 1,
          tickDecimals: 0
  			},
  			yaxis: {
          axisLabel: "# cells",
          axisLabelUseCanvas: true,
          axisLabelFontSizePixels: 13,
          axisLabelFontFamily: 'Verdana, Arial',
          axisLabelPadding: 5,
          minTickSize: 1
        },
  			grid: {
  				backgroundColor: { colors: [ "#fff", "#eee" ] },
  				borderWidth: {
  					top: 1,
  					right: 1,
  					bottom: 1,
  					left: 1
  				}
  			}
  		});
  	}
  	else if( ! $("#cyComputed canvas").length ) { 
      // update graph and only add new points
    }
}