---
layout : tutorials
category : tutorials
title : AWS Severless IoT 8 – Lambda Proxy + Express.js
subcategory : setlayout
summary : AWS Severless IoT에 대해 알아봅니다.
permalink : /tutorials/weplanet/8Lambda-Proxy-express
author : marcushong
tags : aws
title\_background\_color : F1F71A
---



### AWS SAM + express.js

Lambda와 API Gateway로 API Backend를 만드는 것은 매력적이긴 하지만 2가지 큰 단점이 있다.

- 로컬에서 테스트하기 어렵다.(SAM Local이 있긴 하지만 제한적이다.)
- Header, Response, Request를 일반적인 방법이 아닌 AWS에 종속적이게 만들어야 한다. 

2가지 단점은 크게 다가온다. 일반적으로 node.js를 쓴다면 express를 사용할텐데 간단히 사용할 수 있었던 body-parser의 부재가 뼈아프다.

### aws-serverless-express

AWS에서 제공하는 aws-serverless-express를 사용하면 Lambda로 express를 local과 같은 환경에서 사용할 수 있다.

여기에는 3가지 큰 장점이 있다.

- Lambda에서 실행되는 환경과 Local을 동일하게 설정할 수 있다.
- 추후에 Lambda관련 이슈가 있을 때 EC2나 설치형 서버, 혹은 다른 서비스로 쉽게 이주가 가능하다.
- 만들어야하는 Lambda함수의 개수가 줄어든다. 권한 이슈가 없으면 1개로도 처리 가능하다.

### 주의할 점

- Lambda 가 재사용 가능하긴 하지만 같은 환경에서 Lambda가 실행되리라는 보장이 없다. 메모리를 사용하거나 순차적으로 처리를 하고자 하는 작업이 있다면 RDS나 DynamoDB를 사용해 상태를 저장해야 한다.
- Lambda 소스 폴더의 크기를 최소화해야 응답속도가 향상된다.
  - ex) fcm을 사용하기 위해 firebase-admin을 사용하게 되면 용량이 비약적으로 커진다. 이런 경우는 axios와 같은  모듈로 http request형식으로 처리하는 것이 좋다.
- aws-sdk와 node.js 기본 (ex: fs, path….) 을 제외하고 package.json 에 선언한 서드파티 모듈은 'cloudformation packge' 을 실행할 때 소스 폴더 안에 위치해서 같이 압축되게 해야한다. Lambda에서는 npm install을 하지 않는다.

### 설치

아래와 같이 aws-serverless-express 를 설치한다.

```text
npm install aws-serverless-express
```

Lambda에서 사용할 함수를 만든 후,

```js
// lambda.js
'use strict'
const awsServerlessExpress = require('aws-serverless-express')
const app = require('./app')
const server = awsServerlessExpress.createServer(app)

exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context)
```

express App를 초기화할 때 SAM_EXPRESS = true 라는 환경 변수를 체크 하도록 해 아래와 같이 Lambda일 때만 미들웨어가 동작하도록 한다.

```js
if (process.env.SAM_EXPRESS) {
  const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
  app.use(awsServerlessExpressMiddleware.eventContext())  
}
```

