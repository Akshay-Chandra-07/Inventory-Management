const Files = require("../../models/filesModel");
const db = require("../../mysql/db");

class FileQueries{
    static async getDefaultUrl(){
        try{
            const fileData = await db('files').first("file_id","user_id","file_url","file_name").where("status","=","0").andWhere("purpose",'=',"1")
            return fileData
            }catch(error){
            console.log(error)
            return error
        }
    }
    static async setErrorFileUrl(file_id,url){
        console.log("logging",url)
        try{
            await Files.query(db).patch({error_file:url}).where("file_id","=",file_id)
            return;
        }catch(error){
            console.log(error)
            return error;
        }
    }
    static async getErrorUrl(file_id){
        try{
            return await Files.query(db).select("error_file").where("file_id",'=',file_id)
        }catch(error){
            console.log(error)
            return error
        }
    }
    static async setFileActiveStatus(file_id){
        return await Files.query(db).patch({status:"1"}).where("file_id",'=',file_id)
    }
    static async setFileInactiveStatus(file_id,total_rows,accepted_rows){
        return await Files.query(db).patch({status:"2",total_rows:total_rows,accepted_rows:accepted_rows}).where("file_id",'=',file_id)
    }
}

module.exports = FileQueries 