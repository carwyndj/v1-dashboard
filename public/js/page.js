function drawTable(data) {
    for (var i = 0; i < data.length; i++) {
        drawRow(data[i]);
    }
}

function drawRow(rowData) {
    var row = $("<tr />"); // Create row tag
    $("#defects").append(row); //this will append tr element to table... keep its reference for a while since we will add cels into it
    row.append($("<td>" + rowData.team + "</td>"));
    row.append($("<td>" + rowData.num_defect + "</td>"));
}

function drawTableAndPieChart(){   
    console.log("Requesting json...");
    $.getJSON("http://localhost:5000/defects", function(result){

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Team');
        data.addColumn('number', 'Defects');

        var charData = [];

        for(var i = 0; i < result.length; i++){
            charData.push([result[i].team, result[i].num_defect]);
        }

        console.log(charData);
        data.addRows(charData);

        // Set chart options
        var options = {
                    //'width':500,
                    //'height':380,
                       'backgroundColor': '#2a2a2a',
                       legend:{position: 'top', textStyle: {color: 'white', fontSize: 10}}};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart($('.main-chart').get(0));

        drawTable(result);
        chart.draw(data, options);
    });
}

function buildLineChartData(results, charData) {
    charData.push(['Date', 'iOS', 'Android', 'Desktop', 'PPC', 'No Team']);
    
    for(var i=0; i<results.length; i++){
        console.log("Date:" + results[i].entryDate);
        var date = new Date(results[i].entryDate);
        var row = [];
        var teamDefects = results[i].teamDefects;
        row[0] = (date.getMonth() + 1) + "-" + date.getDate();
//                console.log(row[0]);
//                console.log("teamDefects length:" + teamDefects.length);
        for(var j=0; j<teamDefects.length; j++){
            var team = teamDefects[j].team;
            var num_defect = teamDefects[j].num_defect;
//                    console.log("team:" + team + "no. defect:" + num_defect);
            switch (team){
                case "iOS":
                    row[1] = num_defect;
                    break;
                case "Android": 
                    row[2] = num_defect;
                    break;
                case "Desktop":
                    row[3] = num_defect;
                    break;
                case "PPC": 
                    row[4] = num_defect;
                    break;
                case "No Team":
                    row[5] = num_defect;
                    break;
            }
        }
        charData.push(row);
    }
}

function drawLineChart() {
    $.getJSON("http://localhost:5000/defects/history", function(results){
        console.log("Got historical Data...[results:" + results.length + "]");
        var charData = [];
        
        buildLineChartData(results,charData);
        
        console.log(charData);

        var data = google.visualization.arrayToDataTable(charData);

        var options = {
            curveType: 'line',
            backgroundColor: '#2a2a2a',
            legend: { 
                position: 'top', 
                textStyle: {
                    color: 'white', 
                    fontSize: 10
                }
            },
            vAxis: {
                title: "No. Defects",
                titleTextStyle: { color: 'white', fontsize:10},
                textStyle: {
                    color: 'white', 
                    fontSize:10} 
            },
            hAxis: { 
                title: "Date",
                titleTextStyle: { color: 'white', fontsize:10},
                textStyle: {color: 'white', fontSize:10}
            }
        };

        var chart = new google.visualization.LineChart($('.main-chart-hist').get(0));

        chart.draw(data, options);
    });
}

function drawCharts() {
    drawTableAndPieChart();
    drawLineChart();
}

$(document).ready(function () {
    console.log("Ready!!! Loading charts...");

    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['corechart']});

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawCharts);

});