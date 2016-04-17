//global visible variables
var cyContainer, areaTable, tableHeader, x, y, maxSigma, computationStep;

function cytoscapeRenderUserInitialisation(method) {

    var button = document.getElementById("randomInitBtn");
    button.disabled = true;
    button.classList.add("btn-disabled");

}