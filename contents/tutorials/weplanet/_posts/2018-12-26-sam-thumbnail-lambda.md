---
layout : tutorials
category : tutorials
title : aws sam과 lambda를 사용해 재사용가능한 썸네일 생성기를 만들어 봅시다.
subcategory : setlayout
summary : aws sam과 lambda를 사용해 재사용가능한 썸네일 생성기를 만들어 봅시다.
permalink : /tutorials/weplanet/sam-thumbnail-lambda
author : marcushong
tags : aws sam lambda thumbnail
title\_background\_color : F1F71A
---

### AWS Lambda
s3에 이미지가 업로드 되었을 때 thumbnail 이미지를 만드는 lambda를 만들어 보자.

```javascript
'use strict'

const AWS = require('aws-sdk')
const s3 = new AWS.S3({apiVersion: '2006-03-01'})
const im = require('imagemagick')

exports.generate = async (event, context, callback) => {
  try {
    const bucket = event.Records[0].s3.bucket.name
    const key = decodeURIComponent(event.Records[0].s3.object.key).replace(/\+/g, ' ')
    const s3Object = await getObject({bucket, key})

    const result = await generateImage('thumbnail', 200, bucket, key, s3Object)
    callback(null, result)
  } catch (err) {
    callback(err)
  }
}

exports.images = async (event, context, callback) => {
  try {
    const arr = event.path.replace('/images/', '').split('/')
    const type = arr[0]
    const originalPath = 'images/original/' + arr.splice(1,).join('/')
    if (type === 'thumbnail') {
      const s3Object = await getObject({bucket: process.env.S3BUCKET, key: originalPath})
      let buffer = await resize({width: 200}, s3Object.Body)
      callback(null, {
        statusCode: 200,
        headers: {'Content-Type': s3Object.ContentType},
        body: buffer.toString('base64'),
        isBase64Encoded: true
      })
    } else {
      callback(null, {statusCode: 404})
    }
  } catch (err) {
    console.log(err)
    callback(null, {statusCode: 404})
  }
}

async function generateImage(path, width, bucket, key, s3Object) {
  try {
    const buffer = await resize({width}, s3Object.Body)
    await putObject({image: buffer, path, bucket, key, contentType: s3Object.ContentType})
  } catch (e) {
    throw e
  }
}

async function resize(info, src) {
  const params = {
    srcData: src,
    width: info.width
  }
  return new Promise((resolve, reject) => {
    im.resize(params, (err, stdout) => {
      if (err) reject(err)
      else {
        resolve(Buffer.isBuffer(stdout) ? stdout : new Buffer(stdout, "binary"))
      }
    })
  })
}

async function putObject(options) {
  try {
    const {image, path, contentType, bucket} = options
    const key = `${options.key.replace('original', path)}`
    const params = {
      Bucket: bucket,
      Key: key,
      Body: image,
      ContentType: contentType,
      ACL: 'public-read'
    }
    await s3.putObject(params).promise()
    return key
  } catch (err) {
    throw err
  }
}

async function getObject(options) {
  try {
    const params = {
      Bucket: options.bucket,
      Key: options.key
    }
    return s3.getObject(params).promise()
  } catch (err) {
    throw err
  }
}

```

### AWS SAM(Serverless Application Model)
AWS에서는 SAM이라는 것을 제공하는데, yaml로 인프라 스펙을 명시하고 터미널로 명령어을 실행하면 aws에서 cloudformation으로 
인프라를 생성한다. thumbnail 생성기와 같은 경우는 매 프로젝트마다 생성하므로, sam으로 설정해 놓으면 별도 개발할 필요없이 바로 
인프라를 생성할 수 있다.

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: 'AWS::Serverless-2016-10-31'

Parameters:
  S3BucketName:
    Type: String
    Default: bucketname

Resources:
  ResizingImage:
    Type: 'AWS::Serverless::Function'
    Properties:
      Handler: index.generate
      Runtime: nodejs8.10
      CodeUri: ./thumbnail
      Description: ''
      MemorySize: 128
      Timeout: 30
      Policies: AmazonS3FullAccess
      Events:
        BucketEvent:
          Type: S3
          Properties:
            Bucket:
              Ref: S3Bucket
            Events:
              - 's3:ObjectCreated:*'
            Filter:
              S3Key:
                Rules:
                  - Name: prefix
                    Value: images/original

  S3Bucket:
    Type: 'AWS::S3::Bucket'
    Properties:
      BucketName:
        Ref: S3BucketName
```

### 배포
lambda가 업로드 될 bucket을 미리 생성한 후 아래 명령어를 실행한다.

```bash
sam package --template-file thumbnail.yaml \
    --output-template-file thumbnail-output.yaml \
    --s3-bucket lambda-upload-s3
    --profile aws-profile
```

```bash
sam deploy --template-file thumbnail-output.yaml \
    --stack-name image-resize \
    --capabilities CAPABILITY_IAM \ 
    --profile aws-profile
```
