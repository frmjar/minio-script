const Minio = require('minio');
const fs = require('fs');

const minioClient = (endPoint, accessKey, secretKey) => {
    return new Minio.Client({
        endPoint: endPoint,
        accessKey: accessKey,
        secretKey: secretKey
    });
}

const listObjectsBucket = (minioClient, bucket) => {
    const filesStream = minioClient.listObjectsV2(bucket, '', true, '')
    let files = []
    return new Promise(function (resolve, reject) {
        filesStream.on('data', ({name}) => {
            const fixedName = name.replace(/&#39;/gi, "\'")
            files.push(fixedName)
        })
        filesStream.on('end', () => resolve(files))
        filesStream.on('error', reject)
    })
}

const downloadObject = async (minioClient, bucket, pathSource, pathDestination) => {
    await minioClient.getObject(bucket, pathSource)
        .then((dataStream) => {
            const writeStream = fs.createWriteStream(pathDestination)

            dataStream.on('data', chunk => {
                writeStream.write(chunk)
            })

            dataStream.on('end', () => {
                console.log(`Downloaded ${pathSource} in ${pathDestination}`)
                writeStream.end()
            })

            dataStream.on('error', (err) => {
                console.error(err)
            })
        })
        .catch(err => console.error(err))
}

const copyObject = (minioClient, bucketSource, pathSource, bucketDestination, pathDestination) => {
    return minioClient.copyObject(bucketDestination, pathDestination, `${bucketSource}/${pathSource}`, null)
        .then(() => console.log(`Copied ${bucketSource}/${pathSource} in ${bucketDestination}/${pathDestination}`))
        .catch((err) => console.error(err))
}

const removeObjects = (minioClient, bucket, objectsList) => {
    return minioClient.removeObjects(bucket, objectsList)
        .then(() => console.log('Removed the objects successfully'))
        .catch((err) => console.log('Unable to remove objects', err))
}

const removeObject = (minioClient, bucket, path) => {
    return minioClient.removeObject(bucket, path)
        .then(() => console.log(`Removed the object: ${path}`))
        .catch((err) => console.log('Unable to remove object', err))
}

module.exports = { minioClient, listObjectsBucket, downloadObject, copyObject, removeObjects, removeObject };