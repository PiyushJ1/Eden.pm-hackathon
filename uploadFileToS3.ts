import fs from "fs";
import path from "path";
import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

async function uploadMediaFileToS3(filePath: string, key: string): Promise<AWS.S3.ManagedUpload.SendData> {
    const file = fs.readFileSync(filePath);

    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: key,
        Body: file,
        ContentType: "video/mp4",
    };

    return s3.upload(params).promise();
}