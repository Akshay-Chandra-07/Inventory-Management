const fs = require('fs');
const { uploadFile,getPresignedUrl } = require('../../aws/s3/s3Uploader');
const userQueries = require('./user.queries')

exports.getUrl = async (req,res,next)=>{
    try{
        const { fileName, fileType} = req.query;
        const userId = req.userId

        const bucketName = process.env.S3_BUCKET_NAME;
        const folderName = `akv0791/users/${userId}`
        const fileKey = `${folderName}/${fileName}`
        
        const url = await getPresignedUrl(bucketName,fileKey,fileType);
        res.status(201).json({msg:"Presigned Url generated",url,fileKey})
    }catch(error){
        console.log(error);
        res.status(400).json({msg:"Error generating presigned url"})
    }
}

exports.updateUrlToDb = async (req,res,next)=>{
    const profilePictureUrl = req.body.url
    const userId = req.userId
    try{
        const result = userQueries.uploadProfilePicture(profilePictureUrl,userId)
        console.log(result);
        res.status(201).json({msg : "Profile picture uploaded"})
    }catch(error){
        console.log(error)
        res.status(400).json({msg:"Error uploading url to db"})
    }
}

// exports.uploadProfilePicture = async (req,res,next)=>{
//     console.log("uploading");
    
//     const bucketName = process.env.S3_BUCKET_NAME
//     try{
//         const userId = req.userId
//         const files = req.files.profilePic
//         console.log(files)
//         const folderName = `akv0791/users/${userId}`
//         const fileKey = `${folderName}/${files[0].originalFilename}`
//         console.log(fileKey)
//         const fileStream = fs.createReadStream(files[0].filepath)
//         const upload = await uploadFile(bucketName,fileKey,fileStream,files.mimetype)
//         const profilePictureUrl = upload.Location
//         console.log(profilePictureUrl);
//         const result = userQueries.uploadProfilePicture(profilePictureUrl,userId)
//         console.log(result);
//         res.status(201).json({msg : "Profile picture uploaded"})
//     }catch(error){
//         console.log(error)
//         res.status(400).json({msg : "Error uploading picture"})
//     }
// }

exports.getUserData = async (req,res,next)=>{
    try{
        const user = await userQueries.getUserData(req.userId)
        res.status(200).json({msg:"User details fetched",user})

    }catch(error){
        console.log(error);
        res.status(400).json({msg:"Error fetching user data"})
    }
}