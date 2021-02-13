const { minioClient, listObjectsBucket, removeObjects } = require('../APIminio/APIminio')

const endPoint = 'ENDPOINT'
const accessKey = 'ACCESSKEY'
const secretKey = 'SECRETKEY'

const bucketPro = 'BUCKETNAME'

;(async () => {
  const minio = minioClient(endPoint, accessKey, secretKey)
  const listObject = await listObjectsBucket(minio, bucketPro)
  removeObjects(minio, bucketPro, listObject)
})()
