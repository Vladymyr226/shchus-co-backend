import AWS from 'aws-sdk'
require('aws-sdk/lib/maintenance_mode_message').suppress = true

AWS.config.update({ region: 'eu-west-3' })

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
  throw new Error('Отсутствуют переменные окружения AWS_ACCESS_KEY_ID и AWS_SECRET_ACCESS_KEY')
}

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
})

export async function uploadFileToS3(uploadParams) {
  return new Promise((resolve, reject) => {
    s3.upload(uploadParams, function (err, data) {
      if (err) {
        console.log('Ошибка загрузки файла:', err)
        return reject(new Error('Ошибка загрузки файла'))
      }
      console.log('Файл успешно загружен на S3:', data.Location)
      resolve(data.Location)
    })
  })
}
