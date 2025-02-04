const { s3 } = require("../aws/s3/s3Uploader");
const joi = require("joi");
const CategoriesQueries = require("../v1/categories/categories.queries");
const VendorQueries = require("../v1/vendors/vendors.queries");
const FileQueries = require("../v1/files/files.queries");
const FilesService = require("../v1/files/files.service");
const validateRowSchema = require("../v1/files/dto/rowValidation.dto");
const ProductQueries = require("../v1/products/products.queries");
const { getIo, getSocketId } = require("./socket_config");
const NotificationQueries = require("../v1/notifications/notifications.queries");

exports.excelDataProcessor = async () => {
  const io = getIo();
  const fileData = await FileQueries.getDefaultUrl();
  if (fileData) {
    console.log(Date.now())
    const socketId = getSocketId(fileData.user_id);
    const categories = await CategoriesQueries.getAllCategoriesWithId();
    const vendors = await VendorQueries.getAllVendorsWithId();
    let totalRows = 0;
    let acceptedRows = 0;

    const vendorsArray = vendors.map((v) => v.vendor_name.trim().toLowerCase());
    const vendorsObject = Object.fromEntries(
      vendors.map((v) => [v.vendor_name.trim().toLowerCase(), v.vendor_id])
    );

    const categoriesArray = categories.map((c) =>
      c.category_name.trim().toLowerCase()
    );
    const categoriesObject = Object.fromEntries(
      categories.map((c) => [
        c.category_name.trim().toLowerCase(),
        c.category_id,
      ])
    );

    const categorySchema = joi.object({
      category_name: joi
        .string()
        .valid(...categoriesArray)
        .required(),
    });
    const vendorSchema = joi.object({
      vendor_name: joi
        .string()
        .valid(...vendorsArray)
        .required(),
    });

    await FileQueries.setFileActiveStatus(fileData.file_id);
    io.to(socketId).emit("statusUpdate", {
      file_id: fileData.file_id,
      status: "1",
    });
    const key = fileData.file_url.split(".com/")[1];
    const file = await s3
      .getObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      })
      .promise();
    console.log("Processing started");
    const data = await FilesService.convertExcelToJson(file.Body); // fetching all sheets in a workbook
    let workBook = await FilesService.generateWorkBook(); // create a new workbook
    const requiredHeaders = [
      "product_name",
      "category_name",
      "quantity_in_stock",
      "unit",
      "unit_price",
      "vendors",
    ];

    // Iterating each sheet in a workbook
    for (let i = 0; i < data.length; i++) {
      totalRows += data[i].length;
      const tableHeaders = Object.keys(data[i][0]);
      let bool = false;
      let selectedHeaders = [];

      //Validating headers or columns in a sheet
      for (let j = 0; j < tableHeaders.length; j++) {
        if (requiredHeaders.includes(tableHeaders[j])) {
          selectedHeaders.push(tableHeaders[j]);
        }
      }
      if (selectedHeaders.length < 6) {
        data[i][0]["errors"] =
          "All required fields are not present no row is executed please check schema";
        bool = true;
      } else if (selectedHeaders.length > 6) {
        data[i][0]["errors"] =
          "Duplicate columns no row is executed please check schema";
        bool = true;
      }
      //Bool becomes true if column validation fails
      if (bool) {
        try {
          //Create a new error sheet in the workbook
          workBook = await FilesService.generateErrorSheet(
            workBook,
            data[i],
            i
          );
        } catch (error) {
          console.log(error);
        }
      } else {
        let errorRows = [];
        let validRows = []
        for (let j = 0; j < data[i].length; j++) {
          let curRow = data[i][j];
          let errorToken = false;
          let errorMsg = "";
          let validVendors = []
          let validatedRow = validateRowSchema({
            product_name: curRow["product_name"],
            category_name: curRow["category_name"],
            quantity_in_stock: curRow["quantity_in_stock"],
            unit: curRow["unit"],
            unit_price: curRow["unit_price"],
            vendors: curRow["vendors"],
          });
          if (validatedRow.error) {
            errorToken = true;
            errorMsg = errorMsg + validatedRow.error.message;
          } else {
            let validatedCategory = categorySchema.validate({
              category_name: curRow["category_name"].trim().toLowerCase(),
            });
            if (validatedCategory.error) {
              errorToken = true;
              errorMsg = errorMsg + validatedCategory.error.message;
            }
            let vendorNames = curRow["vendors"]
            .split(",")
            .map(v => v.trim().toLowerCase())
    
            vendorNames.filter((v)=>{
                if(vendorsObject[v]){
                    validVendors.push(vendorsObject[v])
                }
            })

            if(validVendors.length<vendorNames.length){
                errorMsg = errorMsg + " Invalid vendors only " +vendorsArray+ " are allowed"
                errorToken = true;
            }
            
            // for (let k = 0; k < vendorNames.length; k++) {
            //   let validatedVendor = vendorSchema.validate({
            //     vendor_name: curVendor,
            //   });
            //   if (validatedVendor.error) {
            //     errorMsg = errorMsg + validatedVendor.error.message;
            //     invalidVendors.push(vendorNames[k].trim());
            //   } else {
            //     validVendors.push(vendorsObject[curVendor]);
            //   }
            // }
            // if (validVendors.length == 0) {
            //   errorToken = true;
            //   errorMsg = errorMsg + "All vendors are invalid";
            // }
            // if (invalidVendors.length > 0) {
            //   errorToken = true;
            //   errorMsg =
            //     errorMsg + " " + invalidVendors.join(",") + " " + "are invalid";
            // }
          }
          if (errorToken) {
            curRow["errors"] = errorMsg;
            errorRows.push(curRow);
        } else {
            let category_id = categoriesObject[curRow["category_name"].trim().toLowerCase()];
            try{
                validRows.push({
                    product_name: curRow["product_name"],
                    category_id: category_id,
                    quantity_in_stock: curRow["quantity_in_stock"],
                    unit: curRow["unit"],
                    unit_price: curRow["unit_price"],
                    vendors: validVendors
                })
            }catch(error){
                console.log(error)
            }
            // try {
            //   const newProduct = await ProductQueries.addProductData(
            //     curRow,
            //     category_id,
            //     validVendors
            //   );
            //   if (newProduct) {
            //     curRow["errors"] = "Row inserting broken try again";
            //     errorRows.push(curRow);
            //   } else {
            //     acceptedRows += 1;
            //   }
            // } catch (error) {
            //   console.log(error);
            // }
          }
        }
        const result = await ProductQueries.bulkInsert(validRows)
        if(result){
            acceptedRows += validRows.length
        }else{
            errorRows.push(validRows.map(vr=>{
                vr['errors'] = "Row insertion broken try again"
                return vr
            }))
        } 
        if (errorRows.length > 0) {
          try {
            //Create a new error sheet in the workbook
            workBook = await FilesService.generateErrorSheet(
              workBook,
              errorRows,
              i
            );
            // console.log(workBook)
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
    // console.log(workBook)
    if (workBook.SheetNames.length > 0) {
      try {
        //Push the error workbook to s3 and update database
        const s3Data = await FilesService.pushErrorBookToS3(
          fileData.user_id,
          workBook
        );
        await FileQueries.setErrorFileUrl(fileData.file_id, s3Data.Location);
        // io.to(socketId).emit("pushNotification", {
        //   msg: `${fileData.file_name} has been processed and error sheet generated`,
        // });
        // await NotificationQueries.createUserNotification(
        //   `${fileData.file_name} has been processed and error sheet generated `,
        //   fileData.user_id
        // );
      } catch (error) {
        console.log(error);
      }
    }
    try {
      await FileQueries.setFileInactiveStatus(
        fileData.file_id,
        totalRows,
        acceptedRows
      );
      io.to(socketId).emit("countUpdate", {
        file_id: fileData.file_id,
        accepted_rows: acceptedRows,
        total_rows: totalRows,
      });
      if(acceptedRows != totalRows){
        const error_url = await FileQueries.getErrorUrl(fileData.file_id)
        io.to(socketId).emit("reportUpdate",{
          file_id:fileData.file_id,
          error_file:error_url
        })
      }
      io.to(socketId).emit("statusUpdate", {
        file_id: fileData.file_id,
        status: "2",
      });
      let notificationId = await NotificationQueries.createUserNotification(
        `${fileData.file_name} has been processed`,
        fileData.user_id
      );
      let notificationData = await NotificationQueries.getNotificationById(notificationId)
      io.to(socketId).emit("pushNotification",{data:notificationData});
    } catch (error) {
      io.to(socketId).emit("statusUpdate", {
        file_id: fileData.file_id,
        status: "99",
      });
      // io.emit('pushNotification',{msg:`${fileData.file_name}+" "+""`})
      // await NotificationQueries.createUserNotification(`${fileData.file_name}+" "+"has been processed"`,fileData.user_id)
      console.log(error);
    }
    console.log("processing ended");
    console.log(Date.now())
    return fileData.file_name + " has been processed";
  } else {
    return "No files to process";
  }
};
