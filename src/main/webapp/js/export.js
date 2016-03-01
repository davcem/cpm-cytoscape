$(document).ready(function () {

    /**
     * creates a csv with table data
     */         
    function exportToFile(filename) {

        var csvData = "";
        var rowDelim = '\r\n';
        var colDelim = '","';
        
        csvData = localStorage.getItem('cellData1'); 
        csvData  += rowDelim;
        csvData  += localStorage.getItem('cellData2');

        downloadFile(filename,'data:text/csv;charset=UTF-8,' + encodeURIComponent(csvData));
    }
    
    // download can only be handled by a link
    function downloadFile(fileName, urlData){
        var aLink = document.createElement('a');
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("click");
        aLink.download = fileName;
        aLink.href = urlData ;
        aLink.dispatchEvent(evt);
    }

    // click on export csv handler
    $("button[name='exportcsv']").on('click', function ($this, event) {
        var time=new Date().getTime();
        exportToFile('export-cpm-computed-data-'+time+'.csv');
    });
});