const DB = require('../../model/db.js');


exports.getImages = function () {
    return new Promise(async function(resolve,reject){
        try{
            var result =await DB.find('lunboImages',{'using':"1"});
            resolve(JSON.stringify(result));
        }catch (err){
            reject(err)
        }
    })
}

exports.addImages = function (imagePath) {
    return new Promise(async function (resolve,reject) {
        try{
            var result =await DB.insert('lunboImages',{'imagePath':imagePath,'using':'1'});
            resolve(JSON.stringify(result));
        }catch (err){
            reject(err);
        }
    })
}

exports.remove = function (imagePath) {
    return new Promise(async function (resolve,reject) {
        try{
            var result =await DB.remove('lunboImages',{'imagePath':imagePath});
            resolve(JSON.stringify(result));
        }catch (err){
            reject(err);
        }
    })
}

