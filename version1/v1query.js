var request = require('request');
var util = require('../util/utils');
var mdb = require('../db/db');


var DefectList = function (team) {
    this.team = team;
    this.highPrioDefects = [];
    this.medPrioDefects = [];
    this.lowPrioDefects = [];
    this.noPrioDefects = [];
};

var V1Query = function (url, auth) {
    this._url = url;
    this._auth = auth;
    this.active_planning_level = "unknown";
};

V1Query.prototype.getPlanningLevel = function () {
    return this.active_planning_level;
};

V1Query.prototype.handleEpicResponse = function (jsonArray, renderRes) {
    var i;
    var htmlMessage = '';
    for (i = 0; i < jsonArray[0].length; i++) {
        var output = jsonArray[0][i].Number + " - " + jsonArray[0][i].Name;
        console.log(output);
        htmlMessage += (output + '\n');
    }
    if (renderRes) {
        renderRes.send(htmlMessage);
    }
};


V1Query.prototype.handleDefectResponse = function (jsonArray, response) {
    var i, l;
    var DefectLists = {
        ios: new DefectList("MS_NMP_IOS"),
        android: new DefectList("MS_NMP_ANDROID"),
        desktop: new DefectList("MS_NMP_DESKTOP"),
        ppc: new DefectList("MS_NMP_PORTABLE_COMPONENT"),
        noteam: new DefectList("MS_NMP_NO_TEAM_SPECIFIED")
    };

    for (i = 0; i < jsonArray.length; i++) {
        for (l = 0; l < jsonArray[i].length; l++) {
            jsonDefect = jsonArray[i][l];
            util.sortIntoTeams(DefectLists, jsonDefect);
        }
    }

    var totalAndroidDefects = util.getTotalDefectsForTeam(DefectLists.android);
    var totalIOSDefects = util.getTotalDefectsForTeam(DefectLists.ios);
    var totalDesktopDefects = util.getTotalDefectsForTeam(DefectLists.desktop);
    var totalPPCDefects = util.getTotalDefectsForTeam(DefectLists.ppc);    
    var totalNoTeamDefects = util.getTotalDefectsForTeam(DefectLists.noteam);
    
    var output = "Number defects [" +
        " Android: " + totalAndroidDefects +
        " IOS: " + totalIOSDefects +
        " Desktop: " + totalDesktopDefects +
        " PPC: " + totalPPCDefects +
        " No Team: " + totalNoTeamDefects + "]";
    
    console.log(output);
    mdb.addDefectStats(DefectLists);
};

V1Query.prototype.handleScopeResponse = function (jsonArray, context) {
    var i;
    for (i = 0; i < jsonArray[0].length; i++) {
        var output = jsonArray[0][i].Name + " - " + jsonArray[0][i].BeginDate + '-' + jsonArray[0][i].EndDate;
        console.log(output);
    }
    context.active_planning_level = jsonArray[0][0].Name;
}

V1Query.prototype.setHandler = function (callback, context) {
    return function v1Response(req, response, body) {
        if (response.statusCode == 200) {
            var resJSON = JSON.parse(JSON.stringify(body));
            callback(resJSON, context);
        } else {
            console.log('Error:' + response.statusCode);
        }
    };
}

V1Query.prototype.makeRequest = function (requestData, v1Response) {
    var requestOptions = {
        url: this._url,
        method: 'POST',
        headers: {
            "Authorization": this._auth
        },
        json: requestData
    };
    request(requestOptions, v1Response);
}


V1Query.prototype.retrieveActivePlanningLevel = function (art) {
    var d = new Date();
    var dateString = util.ISODateString(d);
    console.log(dateString);
    var requestData = {
        'from': 'Scope',
        'select': ['Name', 'BeginDate', 'EndDate', 'Parent.Name'],
        'where': {
            "Parent.Name": art
        },
        'filter': ["BeginDate<='" + dateString + "'",
                     "EndDate>='" + dateString + "'"]
    };
    var scopeCallback = this.setHandler(this.handleScopeResponse, this);
    this.makeRequest(requestData, scopeCallback);
}
module.exports = V1Query;