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

$(document).ready(function () {
    console.log("Ready!!! Loading charts...");

    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['corechart']});

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
    function drawChart() {
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
            var options = {'width':500,
                           'height':400,
                           'backgroundColor': '#2a2a2a',
                           legend:{position: 'top', textStyle: {color: 'white', fontSize: 10}}}

            // Instantiate and draw our chart, passing in some options.
            var chart = new google.visualization.PieChart($('.main-chart').get(0));
            
            drawTable(result);
            chart.draw(data, options);
        });
    }

});