---
layout : tutorials
category : tutorials
title : AWS Severless IoT 18 – FCM without Firebase-admin
subcategory : setlayout
summary : AWS Severless IoT에 대해 알아봅니다.
permalink : /tutorials/weplanet/18-FCM-without-firebase-admin
author : marcushong
tags : aws
title\_background\_color : F1F71A
---





### Push Notification

소켓으로 메세지를 보낼 수 있게 되었으니, 이제 유저가 접속을 하지 않았을 경우에 Push를 보내는 일만 남았다.
AWS SNS는 아직 FCM을 지원하지 않고 있고, AWS Pinpoint는 과금이 SNS의 두배이기 때문에 부담스럽다.
따라서 무료인 firebase를 사용하는 것이 대안인데, firebase admin sdk를 사용하게 되면 Lambda 함수의 용량이 너무 커지는 문제가 있다.
axios를 통해 http request로 처리하게 되면 용량에 문제없이 처리할 수 있다.

### Cloudformation

- 앞서 만들었던 PrivateApisV1에 환경변수를 추가한다.
- Firebase에 프로젝트를 생성하고 생성된 서버키를 추가한다.

```yaml
Resource:
  PrivateApisV1:
    Type: 'AWS::Serverless::Function'
    Properties:
      CodeUri: src
      Handler: bin/lambda.handler
      Runtime: nodejs6.10
      Role:
        'Fn::GetAtt':
          - BasicExecutionRole
          - Arn
      Environment:
        Variables:
          IOTEndPoint:
            'endpoint'
          IotAccessPolicy:
            Ref: IotAccessPolicy
          FirebaseServerKey:
            'serverKey'
      Timeout: 30
      VpcConfig:
        SecurityGroupIds:
          - Ref: VPCLambdaSecurityGroup
        SubnetIds:
          - Ref: PublicSubnetA
          - Ref: PublicSubnetB
      Events:
        ProxyApiRoot:
          Type: Api
          Properties:
            RestApiId:
              Ref: ApiGatewayApi
            Path: /v1
            Method: ANY
        ProxyApiGreedy:
          Type: Api
          Properties:
            RestApiId:
              Ref: ApiGatewayApi
            Path: '/v1/{proxy+}'
            Method: ANY
```

### express.js

- Push Count를 위해 count 개수별로 구분해서 Push Notification을 보낸다.

```js
const axios = require('axios')

function asFcmRequest(options) {
  const request = {
    url: 'https://fcm.googleapis.com/fcm/send',
    headers: {
      Authorization: 'key=' + process.env.FirebaseServerKey,
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: options
  }
  return axios(request)
}

module.exports.sendChatMessage = async (users, payload) => {
  try {
    const arr = users.reduce((ret, user) => {
      if (ret.hasOwnProperty(user.pushCount)) {
        ret[user.pushCount].push(user)
      }
      else {
        ret[user.pushCount] = [user]
      }
      return ret
    }, {})
    for (const count of Object.keys(arr)) {
      const newPayload = Object.assign({}, payload)
      const tokens = arr[count].map(i => i.fcmToken)
      newPayload.badge = parseInt(count)
      await asFcmRequest({
        registration_ids: tokens,
        priority: 'high',
        notification: newPayload.notification,
        data: newPayload.data
      })
    }
  }
  catch (err) {
    throw err
  }
}
```