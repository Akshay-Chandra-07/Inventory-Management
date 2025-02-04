const { excelDataProcessor } = require("../../utils/excelDataProcessor")

exports.extractDataFromExcel = async(req,res,next)=>{
    const result = await excelDataProcessor();
    return res.status(200).json({msg:result})
}