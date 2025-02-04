const xlsx = require('xlsx')
const { s3 } = require('../../aws/s3/s3Uploader')
class FilesService{
    static async convertExcelToJson(data){
        try{
            let objects = []
            const workBook = xlsx.read(data,{type:"buffer"})
            for(let i =0;i<workBook.SheetNames.length;i++){
                let sheetName = workBook.SheetNames[i]
                objects.push(xlsx.utils.sheet_to_json(workBook.Sheets[sheetName],{ defval: "" }))
            }
            return objects
        }catch(error){
            console.log(error)
            return error;
        }
    }
    static async generateWorkBook(){
        const workBook =xlsx.utils.book_new()
        return workBook
    }
    static async generateErrorSheet(workBook,data,i){
        const workSheet = xlsx.utils.json_to_sheet(data)
        xlsx.utils.book_append_sheet(workBook, workSheet, `sheet${i}`); 
        return workBook
    }
    static async pushErrorBookToS3(user_id,workBook){
        const buffer = xlsx.write(workBook,{bookType:'xlsx',type:"buffer"})
        return await s3.upload({
            Bucket: process.env.S3_BUCKET_NAME,
            Key : `akv0791/${user_id}/excel-${Date.now()}.xlsx`,
            Body : buffer,
            ContentType : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }).promise()
    }
}

module.exports = FilesService