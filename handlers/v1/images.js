const AWS = require('aws-sdk');
const { v4: uuid } = require('uuid');

const {S3_ID: accessKeyId, S3_SECRET: secretAccessKey, S3_BUCKET: Bucket} = process.env;
const s3 = new AWS.S3({accessKeyId,secretAccessKey });

const uploadImageS3 = async(req, res) => {
    try {
        const {file} = req.files;
        const [name, fileType] = file.name.split('.');
        const Key = `${uuid()}.${fileType}`;
        const Body = file.data;
        const ContentType = file.mimetype
        await s3.upload({Bucket, Key, Body, ContentType}).promise();
        res.json({
            message: "Succesfully to upload image",
            data: {
                path: `/images/${Key}`,
                options: { source: "s3", bucket: Bucket }
            }
        });
    } catch (error) {
        console.error(error);
        res.send("Something wrong.")        
    }
    
}

const deleteImages = async(req, res) => {
    try {
        let {images} = req.body;
        images = images.map(e => {
            let img = e.split('/images/');
            img = img[img.length - 1];
            return {Key: img};
        });
        let params = { Bucket, Delete: {Objects:images} };
        res.json(params);
        await s3.deleteObjects(params).promise();
    } catch (error) {
        console.error(error.message);
        res.status(error.statusCode).send('');
    }
    
}

const getImage = async(req, res) => {
    try {
        let {key: Key} = req.params;
        let params = { Bucket, Key };
        const file = await s3.getObject(params).promise();
        res.set('Content-Type', file.ContentType);
        res.set('file-name', Key);
        s3.getObject(params).createReadStream().pipe(res);
    } catch (error) {
        console.error(error.message);
        res.status(error.statusCode).send('');
    }
    
}

module.exports = {
    uploadImageS3,
    getImage,
    deleteImages
}