const { minioClient, listObjectsBucket, copyObject } = require('../APIminio/APIminio')

const endPoint = 'ENDPOINT'
const accessKey = 'ACCESSKEY'
const secretKey = 'SECRETKEY'

const bucketDev = 'BUCKETNAME'
const bucketPro = 'BUCKETNAME'

;(async () => {
  const minio = minioClient(endPoint, accessKey, secretKey)
  const listObject = await listObjectsBucket(minio, bucketDev)

  for (const index in listObject) {
    const path = listObject[index]
    await copyObject(minio, bucketDev, path, bucketPro, path)
  }
})()

