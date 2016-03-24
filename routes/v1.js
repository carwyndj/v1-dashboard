var v1query = require("../version1/v1query");
var util = require("../util/utils");

v1 = new v1query(
    'http://safe.hq.k.grp/Safe/query.v1',
    'Bearer ' + '1.0ayg3I+R3ojOMipXCVHNDvQZJlI='
);

exports.init = function () {
    v1.retrieveActivePlanningLevel("Secure Player (ART)")
    // Allow 5 seconds for things to start up
    setTimeout(function(){
        // Get the initial Stats
        exports.getDefects();
    
        // Wait till 01:00 to get again    
        var delay = util.calcDelay(1);
        console.log("Waiting for:" + delay + "msecs")
        setTimeout(function(){
                exports.getDefects();
                // Now schedule every 24Hrs
                setInterval(function(){
                        exports.getDefects();
                    },
                util.twentyFourHrsInMilliSecs)
            }, 
        delay)
    },
    5000);
}
               
exports.getEpics = function (req, res) {
    var requestData = {
        'from': 'Epic',
        'select': ['Number', 'Name'],
        'where': {
            'Scope.Name': v1.getPlanningLevel()
        }
    };
    v1.makeRequest(requestData, v1.setHandler(v1.handleEpicResponse, res));
}

exports.getDefects = function (req, res) {
    var requestData = [{
            'from': 'Defect',
            'select': ['Number', 'Name', 'Team.Name', 'Status.Name', 'Priority.Name'],
            'where': {
                'Scope.Name': v1.getPlanningLevel()
            },
            'filter': ["Status.Name!='Done'",
                       "Status.Name!='Accepted'"]
        
        }, {
            'from': 'Defect',
            'select': ['Number', 'Name', 'Team.Name', 'Status.Name', 'Priority.Name'],
            'where': {
                'Scope.Name': "Secure Player (ART)"
            },
            'filter': ["Status.Name!='Done'",
                       "Status.Name!='Accepted'"]
        }
    ];
    v1.makeRequest(requestData, v1.setHandler(v1.handleDefectResponse, res));
}