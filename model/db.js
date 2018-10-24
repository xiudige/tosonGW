/**

 * http://mongodb.github.io/node-mongodb-native

 * http://mongodb.github.io/node-mongodb-native/3.0/api/
 */

//DB��
var MongoDB=require('mongodb');
var MongoClient =MongoDB.MongoClient;
const ObjectID = MongoDB.ObjectID;

var Config=require('./config.js');

class Db{

    static getInstance(){

        if(!Db.instance){
            Db.instance=new Db();
        }
        return  Db.instance;
    }

    constructor(){

        this.dbClient='';
        this.connect();

    }

    connect(){
      let _that=this;
      return new Promise((resolve,reject)=>{
          if(!_that.dbClient){
              MongoClient.connect(Config.dbUrl,(err,client)=>{
                  if(err){
                      reject(err)
                  }else{
                      _that.dbClient=client.db(Config.dbName);
                      resolve(_that.dbClient)
                  }
              })
          }else{
              resolve(_that.dbClient);
          }
      })
    }

    find(collectionName,json){
       return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                var result=db.collection(collectionName).find(json);
                result.toArray(function(err,docs){
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(docs);
                })
            })
        })
    }
    update(collectionName,json1,json2){
        return new Promise((resolve,reject)=>{
                this.connect().then((db)=>{
                    //db.user.update({},{$set:{}})
                    var result =  db.collection(collectionName).updateOne(json1,{$set:json2},(err,result)=>{
                        if(err){
                            console.log("fail");
                            reject(err);
                        }else{
                            console.log("succeed");
                            resolve(result);
                        }
                    })
                })
        })
    }
    update_muti(collectionName,json1,json2){
        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
            //db.user.update({},{$set:{}})
            var result =  db.collection(collectionName).update(json1,{$set:json2},(err,result)=>{
                if(err){
                    console.log("fail");
                    reject(err);
                }else{
                                console.log("succeed");
                    resolve(result);
                }
            })
            })
        })
    }

    /**
     * target:用于为增加文档内嵌集合的元素
     * @param collectionName    一级集合名
     * @param json1             文档查询json
     * @param json2             文档内嵌集合插入json，eg:{"elementName":{sonEle1:content,sonEle2:content...}}
     * @returns {boolean}
     */
    update_push(collectionName,json1,json2){
        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                //db.user.update({},{$set:{}})
                var result =  db.collection(collectionName).updateOne(json1,{$push:json2},(err,result)=>{
                    if(err){
                        console.log("fail");
                        reject(err);
                    }else{
                        console.log("succeed");
                    resolve(result);
                    }
                })
            })
        })
    }

    /**
     * target：用户删除文档内嵌集合的元素
     * @param collectionName        一级集合名
     * @param jsonOut               第一级文档查询json
     * @param jsonIn                内嵌集合文档查询json
     * @returns {boolean}
     */
    update_pull(collectionName,jsonOut,jsonIn){
        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                var result =  db.collection(collectionName).update(jsonOut,{"$pull":jsonIn},(err,result)=>{
                    if(err){
                        console.log("fail");
                        reject(err);
                    }else{
                        console.log("succeed");
                        resolve(result);
                    }
                })
            })
        })
    }


    insert(collectionName,json){
        return new  Promise((resolve,reject)=>{
            this.connect().then((db)=>{

                db.collection(collectionName).insertOne(json,function(err,result){
                    if(err){
                        reject(err);
                    }else{

                        resolve(result);
                    }
                })


            })
        })
    }

    remove(collectionName,json){
        return new  Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).removeOne(json,function(err,result){
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
                })
            })
        })
    }
    getObjectId(id){    /*mongodb�����ѯ _id ���ַ���ת���ɶ���*/

        return new ObjectID(id);
    }
}


module.exports=Db.getInstance();
