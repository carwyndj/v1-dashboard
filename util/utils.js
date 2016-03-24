module.exports.ISODateString = function (d){
    function pad(n){
        return n<10 ? '0' + n : n
    }
    return d.getUTCFullYear()+'-'
    + pad(d.getUTCMonth()+1)+'-'
    + pad(d.getUTCDate())+'T'
    + pad(d.getUTCHours())+':'
    + pad(d.getUTCMinutes())+':'
    + pad(d.getUTCSeconds())+'.0000000'
}

module.exports.ISODateStringDayOnly = function (d){
    function pad(n){
        return n<10 ? '0' + n : n
    }
    return d.getUTCFullYear()+'-'
    + pad(d.getUTCMonth()+1)+'-'
    + pad(d.getUTCDate())+'T'
    + pad(0)+':'
    + pad(0)+':'
    + pad(0)+'.0000000'
}

module.exports.twentyFourHrsInMilliSecs = (1000*60*60*24);
    
module.exports.calcDelay = function (time) {
    var now = new Date()
    var target = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            time,0,0,0);

    if(target.getTime() >= now.getTime()){
        return target.getTime() - now.getTime();        
    }
    else {
        return exports.twentyFourHrsInMilliSecs - (now.getTime() - target.getTime());
    }
}

function sortIntoPriority(highPrioDefects, mediumPrioDefects, lowPrioDefects, noPrioDefects, jsonDefect) {
    switch (jsonDefect['Priority.Name']){
        case "High":
            highPrioDefects.push({
                Number: jsonDefect['Number'],
                Name: jsonDefect['Name']
            });
            break;
        case "Medium": 
            mediumPrioDefects.push({
                Number: jsonDefect['Number'],
                Name: jsonDefect['Name']
            });
            break;
        case "Low":
            lowPrioDefects.push({
                Number: jsonDefect['Number'],
                Name: jsonDefect['Name']
            });
            break;
        default:
            noPrioDefects.push({
                Number: jsonDefect['Number'],
                Name: jsonDefect['Name']
            });
    }
}

module.exports.sortIntoTeams = function (defectLists, jsonDefect) {    
    if (jsonDefect['Team.Name'] == "MS_NMP_iOS" ||
        jsonDefect['Team.Name'] == "MS_NMP_iOS_Integration") {
        sortIntoPriority(defectLists.ios.highPrioDefects,
                         defectLists.ios.medPrioDefects,
                         defectLists.ios.lowPrioDefects,
                         defectLists.ios.noPrioDefects,
                         jsonDefect);
    } else if (jsonDefect['Team.Name'] == "MS_NMP_Android" ||
        jsonDefect['Team.Name'] == "MS_NMP_Android Integration") {
        sortIntoPriority(defectLists.android.highPrioDefects,
                         defectLists.android.medPrioDefects,
                         defectLists.android.lowPrioDefects,
                         defectLists.android.noPrioDefects,
                         jsonDefect);
    } else if (jsonDefect["Team.Name"] == "MS_NMP_Desktop" ||
        jsonDefect["Team.Name"] == "MS_NMP_Desktop_Integration") {
        sortIntoPriority(defectLists.desktop.highPrioDefects,
                         defectLists.desktop.medPrioDefects,
                         defectLists.desktop.lowPrioDefects,
                         defectLists.desktop.noPrioDefects,
                         jsonDefect);
    } else if (jsonDefect["Team.Name"] == "MS_NMP_Portable_Component" ||
        jsonDefect["Team.Name"] == "MS_NMP_Portable_Component_Integration") {
        sortIntoPriority(defectLists.ppc.highPrioDefects,
                         defectLists.ppc.medPrioDefects,
                         defectLists.ppc.lowPrioDefects,
                         defectLists.ppc.noPrioDefects,
                         jsonDefect);
    } else {
        sortIntoPriority(defectLists.noteam.highPrioDefects,
                         defectLists.noteam.medPrioDefects,
                         defectLists.noteam.lowPrioDefects,
                         defectLists.noteam.noPrioDefects,
                         jsonDefect);
    }
};

module.exports.getTotalDefectsForTeam = function(arrays) {
   return arrays.highPrioDefects.length +
       arrays.medPrioDefects.length +
       arrays.lowPrioDefects.length +
       arrays.noPrioDefects.length;
}