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
        var isFirefox = typeof InstallTrigger !== 'undefined';
        var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
        if (isFirefox || isSafari) {
          //needed because of firefox bug 395917 
          //and because of navigating in safari
          window.open(aLink.href, '_blank'); //open download in new window
        }
        else {
          aLink.dispatchEvent(evt);
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