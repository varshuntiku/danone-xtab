const  azureStorage = require('@azure/storage-blob');
const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");

const uploadStream=async (fileName,content,len)=>{
    const sharedKeyCredential = new StorageSharedKeyCredential(process.env['ACCOUNT_NAME'], process.env['ACCOUNT_KEY']);
    const blobServiceClient = new BlobServiceClient(`https://${process.env['ACCOUNT_NAME']}.blob.core.windows.net`,sharedKeyCredential)
    const containerClient = blobServiceClient.getContainerClient(process.env['CONTAINER_NAME']);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    const uploadBlobResponse = await blockBlobClient.upload(content, len);
    //console.log(`Upload block blob ${fileName} successfully`, uploadBlobResponse.requestId);
    return uploadBlobResponse
}

exports.uploadStream = uploadStream;