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

module.exports.sortIntoTeams = function (defectLists, jsonDefect) {    
    if (jsonDefect['Team.Name'] == "MS_NMP_iOS" ||
        jsonDefect['Team.Name'] == "MS_NMP_iOS_Integration") {
        defectLists.ios.defects.push({
            Number: jsonDefect['Number'],
            Name: jsonDefect['Name'],
        });
    } else if (jsonDefect['Team.Name'] == "MS_NMP_Android" ||
        jsonDefect['Team.Name'] == "MS_NMP_Android Integration") {
        defectLists.android.defects.push({
            Number: jsonDefect['Number'],
            Name: jsonDefect['Name']
        });
    } else if (jsonDefect["Team.Name"] == "MS_NMP_Desktop" ||
        jsonDefect["Team.Name"] == "MS_NMP_Desktop_Integration") {
        defectLists.desktop.defects.push({
            Number: jsonDefect["Number"],
            Name: jsonDefect["Name"]
        });
    } else if (jsonDefect["Team.Name"] == "MS_NMP_Portable_Component" ||
        jsonDefect["Team.Name"] == "MS_NMP_Portable_Component_Integration") {
        defectLists.ppc.defects.push({
            Number: jsonDefect["Number"],
            Name: jsonDefect["Name"]
        });
    } else {
        defectLists.noteam.defects.push({
            Number: jsonDefect["Number"],
            Name: jsonDefect["Name"]
        });
    }
};