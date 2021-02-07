const {minioClient, listObjectsBucket, downloadObject} = require('../APIminio/APIminio');
const fs = require('fs');
const util = require('util');

const mkdir = util.promisify(fs.mkdir);

const endPoint = 'ENDPOINT'
const accessKey = 'ACCESSKEY'
const secretKey = 'SECRETKEY'

const bucketPro = 'BUCKETNAME'

const createFolder = (folder) => {
        mkdir(`../Backup/${folder}`, {recursive: true})
            .then(console.log(`New folder created successfully: ${folder}`))
            .catch(() => console.error(err))
    }

;(async () => {
    const minio = minioClient(endPoint, accessKey, secretKey)
    const listObject = await listObjectsBucket(minio, bucketPro)

    for (let index in listObject) {
        const path = listObject[index]
        const [folder, type, name] = path.split('/')
        const folderPath = `../Backup/${folder}/${type}`
        const pathDestination = `../Backup/${folder}/${type}/${name}`

        createFolder(folderPath)
        await downloadObject(minio, bucketPro, path, pathDestination)
    }
})()

