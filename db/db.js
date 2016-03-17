// Setup DB connection
var util = require('../util/utils');
var mongo = require('mongodb');
var mongoose = require('mongoose');

var defectsSchema = new mongoose.Schema({
        name: {type: String, unique: true},
        entryDate: Date,
        teamDefects: [{
            team: String,
            num_defect: Number
        }]
});

var dbConnected = false;

module.exports.init = function () {
//    mongoose.set('debug', true);
    mongoose.connect('localhost:27017/v1-dashboard', function (error) {
        if (error) {
            console.log(error);
        }
    });
        
    var db = mongoose.connection;
    mongoose.set('debug', true);
    
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        // we're connected!
        //setupSchema();
        console.log("MongoDb Connected OK!!!!")
        dbConnected = true;
        initSchema();
        add30DummyDataEntries();
    });
    
};

exports.addDefectStats = function (defectList) {
    var jsonData = [
        {
            team: 'iOS',
            num_defect: defectList.ios.defects.length
        },
        {
            team: 'Android',
            num_defect: defectList.android.defects.length
        },
        {
            team: 'Desktop',
            num_defect: defectList.desktop.defects.length
        },
        {
            team: 'PPC',
            num_defect: defectList.ppc.defects.length
        },
        {
            team: 'No Team',
            num_defect: defectList.noteam.defects.length
        }
    ];
    addDefectStats(jsonData);
};

exports.getDefectStats = function(res){
    if(dbConnected){
        var defectStats = mongoose.model('defectStats', defectsSchema);
        
        defectStats.findOne({
            name: buildDocumentName("defects:") // Find entry for the day
        }, {
            'teamDefects.team': 1,
            'teamDefects.num_defect': 1,
            _id: 0 // Only return the data needed and suppress the '_id' 
        }, function (err, doc) {
             console.log(doc);
             var jsonResponse = [];
             for (var i = 0; i < doc.teamDefects.length; i++) {
                 jsonResponse.push({
                     team: doc.teamDefects[i].team,
                     num_defect: doc.teamDefects[i].num_defect
                 })
             }
             res.json(jsonResponse);
        });

    }
    else {
        Console.log("MongoDb Not Connected!!!!!!")
    }  
}

exports.getHistoricalDefectStats = function(res){
    if(dbConnected){
        var defectStats = mongoose.model('defectStats', defectsSchema);
        
        defectStats.find({},{
            'entryDate':1,
            'teamDefects.team': 1,
            'teamDefects.num_defect': 1,
            _id: 0 // Only return the data needed and suppress the '_id' 
        }).sort({entryDate: 1}).exec(function (arr,docs) {
            console.log(docs);
        });
    }
    else {
        Console.log("MongoDb Not Connected!!!!!!")
    }  
}

function initSchema(){
//    defectsSchema.index({date: 1});
    
    defectsSchema.methods.showNumberOfDefects = function () {
        var message = "Collected on " + this.date + "[";
        for(var i=0; i<this.teamDefects.length; i++){
            message += " team:" + this.teamDefects[i].team + ", No. Defects:" + this.teamDefects[i].num_defect + "\n";
        }
        message += "]";
        console.log(message);
    }
}

function buildDocumentName(prefix){
    d = new Date();
    function pad(n){
        return n<10 ? '0' + n : n
    }
    return prefix + d.getFullYear() + pad(d.getUTCMonth()+1) + pad(d.getUTCDate());
}
        
function addDefectStats(defects){
    if(dbConnected){
        var defectStats = mongoose.model('defectStats', defectsSchema);
        
        console.log("now add the new entries...");
        
        var name = buildDocumentName("defects:");
        var teamDefects = new defectStats({
            name: name,
            date: new Date(),
            teamDefects: defects
        });
        
        teamDefects.showNumberOfDefects();
   
        teamDefects.save(function (err, teamDefects) {
            if (err) return console.error(err);
        });
    }
    else {
        Console.log("MongoDb Not Connected!!!!!!")
    }
}

function add30DummyDataEntries(){
    var defectStats = mongoose.model('defectStats', defectsSchema);
    
    for (var i = 0; i<30; i++){
        var dummyDefects = [
            {
                team: 'iOS',
                num_defect: i*10
            },
            {
                team: 'Android',
                num_defect: i*20
            },
            {
                team: 'Desktop',
                num_defect: i+10
            },
            {
                team: 'PPC',
                num_defect: i
            },
            {
                team: 'No Team',
                num_defect: 100-i
            }
        ];
        
        function pad(n){
            return n<10 ? '0' + n : n
        }
        
        var dummyName = "defects:201603" + pad(i+1);
        
        dummyDate = new Date(16,03,i+1);
        
        var teamDefects = new defectStats({
            name: dummyName,
            date: dummyDate,
            teamDefects: dummyDefects
        });
        
        teamDefects.save(function (err, teamDefects) {
            if (err) return console.error(err);
        });
    }
}



  