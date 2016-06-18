$(document).ready(function () {

    /**
     * creates a csv with table data
     */         
    function exportToFile(filename) {

        var csvData = "";
        var rowDelim = '\r\n';
        var colDelim = '","';
        
        csvData = getCurrentParameterSettingsFromUI();
        csvData += rowDelim;
        csvData += rowDelim;
        csvData += "Cells Data: ;";
        csvData += rowDelim;
        csvData += localStorage.getItem('exportableEcmData');
        csvData += rowDelim;
        csvData += localStorage.getItem('exportableCellData1'); 
        csvData += rowDelim;
        csvData += localStorage.getItem('exportableCellData2');

        downloadFile(filename,'data:text/csv;charset=UTF-8,' + encodeURIComponent(csvData));
    }
    
    /**
     * handle file download via temporary link
     */ 
    function downloadFile(fileName, urlData){
        var aLink = document.createElement('a');
        var evt = new Event('click');                       
        aLink.download = fileName;
        aLink.href = urlData ;
        aLink.dispatchEvent(evt);
        if (navigator.userAgent.indexOf("Firefox") > 0) {
          //needed because of firefox bug 395917 
          //( https://bugzilla.mozilla.org/show_bug.cgi?id=395917)
          document.location.href = aLink.href; 
        }
    }
    
    /**
     * get current settings from menu and 
     * return value set as string
     */ 
    function getCurrentParameterSettingsFromUI() {
        var settingsString = "Parameter Settings: ;\r\n";
        
        $("#menuContainer input[type='number']").each(function() {
            if(!isNaN(this.value)) {
                settingsString += this.name + ":" + this.value + ";";
            }
        });
        settingsString += $
        
        return settingsString;
    }

    // click on export csv handler
    $("button[name='exportcsv']").on('click', function ($this, event) {
        var time=new Date().getTime();
        exportToFile('export-cpm-computed-data-'+time+'.csv');
    });
});