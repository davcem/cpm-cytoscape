/**
 * Created by clemens on 07.04.16.
 */

function changeProfile(){
    var profileSelect = document.getElementById("profile");
    var selectedProfileFileName = profileSelect.options[profileSelect.selectedIndex].value;

    if(selectedProfileFileName.substr(selectedProfileFileName.length - 5).toLowerCase() != ".json"){
        return;
    }

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var tmp_profile = xhttp.responseText;
            var profile = JSON.parse(tmp_profile);

            if(verifyProfile(profile)){
                setSimulationParams(profile);
            }else{
                console.log("no profile found");
            }
        }
    };

    xhttp.open("GET", "profiles/" + selectedProfileFileName, true);
    xhttp.send();
}

function  verifyProfile(profile) {
    //TODO make sanity checks here like x > 0 && x <= 100

    if(profile == null)
    {
        return false;
    }

    if(!profile.hasOwnProperty("x")){
        return false;
    }

    if(!profile.hasOwnProperty("y")){
        return false;
    }

    if(!profile.hasOwnProperty("mcs")){
        return false;
    }

    if(!profile.hasOwnProperty("mcSubsteps")){
        return false;
    }

    if(!profile.hasOwnProperty("maxSigma")){
        return false;
    }

    if(!profile.hasOwnProperty("matrixDensity")){
        return false;
    }

    if(!profile.hasOwnProperty("temperature")){
        return false;
    }

    if(!profile.hasOwnProperty("jEcm")){
        return false;
    }

    if(!profile.hasOwnProperty("jLightCells")){
        return false;
    }

    if(!profile.hasOwnProperty("jDarkCells")){
        return false;
    }

    if(!profile.hasOwnProperty("jDifferentCells")){
        return false;
    }

    if(!profile.hasOwnProperty("lambdaArea")){
        return false;
    }

    if(!profile.hasOwnProperty("targetAreaFactorLight")){
        return false;
    }

    if(!profile.hasOwnProperty("targetAreaFactorDark")){
        return false;
    }

    if(!profile.hasOwnProperty("ratioDarkToLightCells")){
        return false;
    }

    if(!profile.hasOwnProperty("darkCellDecrease")){
        return false;
    }

    return true;
}

function setSimulationParams(profile){
    document.getElementsByName("maxX")[0].value = profile.x;
    document.getElementsByName("maxY")[0].value = profile.y;
    document.getElementsByName("mcs")[0].value = profile.mcs;
    document.getElementsByName("mcSubsteps")[0].value = profile.mcSubsteps;
    document.getElementsByName("maxSigma")[0].value = profile.maxSigma;
    document.getElementsByName("matrixDensity")[0].value = profile.matrixDensity;
    document.getElementsByName("temperature")[0].value = profile.temperature;
    document.getElementsByName("jEcm")[0].value = profile.jEcm;
    document.getElementsByName("jLightCells")[0].value = profile.jLightCells;
    document.getElementsByName("jDarkCells")[0].value = profile.jDarkCells;
    document.getElementsByName("jDifferentCells")[0].value = profile.jDifferentCells;
    document.getElementsByName("lambdaArea")[0].value = profile.lambdaArea;
    document.getElementsByName("targetAreaFactorLight")[0].value = profile.targetAreaFactorLight;
    document.getElementsByName("targetAreaFactorDark")[0].value = profile.targetAreaFactorDark;
    document.getElementsByName("ratioDarkToLightCells")[0].value = profile.ratioDarkToLightCells;
    document.getElementsByName("darkCellDecrease")[0].selectedIndex = profile.darkCellDecrease;
}
