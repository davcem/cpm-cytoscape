/**
 * Created by clemens on 07.04.2016.
 * Modified by radiance on 27.04.2016
 * User Interface Extensions for choosing a profile.
 * The changeProfile() method is used within the index.html within the #profile dropdown.
 * Default selection of #profile is "custom profile".
 */

var profiles = [
    {"name":"Brain cancer", "file":"profile1.json"},
    {"name":"Colocteral cancer", "file":"profile2.json"},
    {"name":"Ovarian cancer", "file":"profile3.json"}
];

function initializeProfiles(){
    var profileSelect = document.getElementById("profile");

    profiles.forEach(function (profile) {
        var option = document.createElement("option");
        option.text = profile.name;
        option.value = profile.file;
        profileSelect.add(option);
    });
}

/* This method is called on the onchange event of a dropdown
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
            }
        }
    };

    xhttp.open("GET", "profiles/" + selectedProfileFileName, true);
    xhttp.send();
}

function  verifyProfile(profile) {
    if(profile == null)
    {
        Console.log("profile is null");
        return false;
    }

    if(!profile.hasOwnProperty("x") || !(profile.x >= 1 && profile.x <= 200)){
        console.log("x-Value allows only an Integer between 1 and 200!");
        return false;
    }

    if(!profile.hasOwnProperty("y") || !(profile.y >= 1 && profile.y <= 200)){
        console.log("y-Value allows only an Integer between 1 and 200!");
        return false;
    }

    if(!profile.hasOwnProperty("mcs") || !(profile.mcs >= 1 && profile.mcs <= 10000)){
        console.log("mcs-Value only allows an Integer between 1 and 10000!");
        return false;
    }

    if(!profile.hasOwnProperty("mcSubsteps") || !(profile.mcSubsteps >= 1 && profile.mcSubsteps <= 10000)){
        console.log("mcSubsteps-Value allows only an Integer between 1 and 10000!");
        return false;
    }

    if(!profile.hasOwnProperty("maxSigma") || !(profile.maxSigma >= 1 && profile.maxSigma <= 50)){
        console.log("maxSigma-Value allows only an Integer between 1 and 50!");
        return false;
    }

    if(!profile.hasOwnProperty("matrixDensity") || !(profile.matrixDensity >= 0.1 && profile.matrixDensity <= 1)){
        console.log("matrixDensity-Value allows only a double in the range between 0.1 and 1!");
        return false;
    }

    if(!profile.hasOwnProperty("temperature") || !(profile.temperature >= 0 && profile.temperature <= 100)){
        console.log("temperature-Value allows only a double between 0 and 100!");
        return false;
    }

    if(!profile.hasOwnProperty("jEcm") || !(profile.jEcm >= 0.1 && profile.jEcm <= 100)){
        console.log("jEcm-Value allows only a double between 0.1 and 100!");
        return false;
    }

    if(!profile.hasOwnProperty("jLightCells") || !(profile.jLightCells >= -99.99 && profile.jLightCells <= 100)){
        console.log("jLightCells-Value allows only numerical values between -99.99 and 100!");
        return false;
    }

    if(!profile.hasOwnProperty("jDarkCells") || !(profile.jDarkCells >= -99.99 && profile.jDarkCells <= 100)){
        console.log("jDarkCells-Value allows only numerical values between -99.99 and 100!");
        return false;
    }

    if(!profile.hasOwnProperty("jDifferentCells") || !(profile.jDifferentCells >= -99.99 && profile.jDifferentCells <= 100)){
        console.log("jDifferentCells-Value allows only numerical values between -99.99 and 100!");
        return false;
    }

    if(!profile.hasOwnProperty("lambdaArea") || !(profile.lambdaArea >= 0.01 && profile.lambdaArea <= 100)){
        console.log("lambdaArea-Value allows only numerical values between 0.01 and 100!");
        return false;
    }

    if(!profile.hasOwnProperty("targetAreaFactorLight") || !(profile.targetAreaFactorLight >= 0.0 && profile.targetAreaFactorLight <= 1.0)){
        console.log("targetAreaFactorLight-Value allows only double values between 0.0 and 1.0!");
        return false;
    }

    if(!profile.hasOwnProperty("targetAreaFactorDark") || !(profile.targetAreaFactorDark >= 0.0 && profile.targetAreaFactorDark <= 1.0)){
        console.log("targetAreaFactorDark-Value allows only double values between 0.0 and 1.0!");
        return false;
    }

    if(!profile.hasOwnProperty("ratioDarkToLightCells") || !(profile.ratioDarkToLightCells >= 2 && profile.ratioDarkToLightCells <= 100)){
        console.log("ratioDarkToLightCells-Value allows only integers between 2 and 100!");
        return false;
    }

    if(!profile.hasOwnProperty("darkCellDecrease")&& (profile.darkCellDecrease == 0 || profile.darkCellDecrease == 1)){
        console.log("darkCellDecrease-Value allows only 0=no and 1=yes!");
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

function parameterChanged(){
    var profileSelect = document.getElementById("profile");
    profileSelect.selectedIndex = 0;
}

function getParamsFromForm(){
    var currentProfile = {};
    
    currentProfile.x = document.getElementsByName("maxX")[0].value;
    currentProfile.y = document.getElementsByName("maxY")[0].value;
    currentProfile.mcs = document.getElementsByName("mcs")[0].value;
    currentProfile.mcSubsteps = document.getElementsByName("mcSubsteps")[0].value;
    currentProfile.maxSigma = document.getElementsByName("maxSigma")[0].value;
    currentProfile.matrixDensity = document.getElementsByName("matrixDensity")[0].value;
    currentProfile.temperature = document.getElementsByName("temperature")[0].value;
    currentProfile.jEcm = document.getElementsByName("jEcm")[0].value;
    currentProfile.jLightCells = document.getElementsByName("jLightCells")[0].value;
    currentProfile.jDarkCells = document.getElementsByName("jDarkCells")[0].value;
    currentProfile.jDifferentCells = document.getElementsByName("jDifferentCells")[0].value;
    currentProfile.lambdaArea = document.getElementsByName("lambdaArea")[0].value;
    currentProfile.targetAreaFactorLight = document.getElementsByName("targetAreaFactorLight")[0].value;
    currentProfile.targetAreaFactorDark = document.getElementsByName("targetAreaFactorDark")[0].value;
    currentProfile.ratioDarkToLightCells = document.getElementsByName("ratioDarkToLightCells")[0].value;
    currentProfile.darkCellDecrease = document.getElementsByName("darkCellDecrease")[0].selectedIndex;

    return currentProfile;
}


$( document ).ready(function() {
    // call for initialization
    initializeProfiles();
});

