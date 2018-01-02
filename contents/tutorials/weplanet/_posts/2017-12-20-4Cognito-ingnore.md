---
layout : tutorials
category : tutorials
title : AWS Severless IoT 4 – Cognito 인증 생략
subcategory : setlayout
summary : AWS Severless IoT에 대해 알아봅니다.
permalink : /tutorials/weplanet/4Cognito-ingnore
author : marcushong
tags : aws
title\_background\_color : F1F71A
---



### 인증 생략

Cognito User Pool에서는 보안을 위해 이메일을 사용할 경우 인증을 강제하고 있다.
인증을 생략하도록 하고 싶다면 LambdaConfig.PreSignUp 에서 자동으로 인증이 되게 Lambda함수를 만들수도 있다. 여기서는 간단히 Lambda 함수를 선언하는 부분을 구현하고 BasicExecutionRole부분은 추후에 구현하도록 한다.

### Cloudformation

```yaml
Resources:
  CognitoPreSignUp:
    Type: 'AWS::Serverless::Function'
    Properties:
      CodeUri: src
      Handler: lambda/auth.preSignUp
      Runtime: nodejs6.10
      Role:
        'Fn::GetAtt':
          - BasicExecutionRole
          - Arn
      Environment:
        Variables:
          NODE_ENV: development
      Timeout: 30
  CognitoPreSignUpLogGroup:
    Type: 'AWS::Logs::LogGroup'
    DependsOn: CognitoPreSignUp
    Properties:
      RetentionInDays: 14
      LogGroupName:
        'Fn::Join':
          - ''
          - - /aws/lambda/
            - Ref: CognitoPreSignUp
  CognitoLambdaConfigPermission:
    Properties:
      Action: lambda:InvokeFunction
      FunctionName:
        Ref: CognitoPreSignUp
      Principal: cognito-idp.amazonaws.com
      SourceArn:
        Fn::GetAtt:
        - CognitoUserPool
        - Arn
    Type: AWS::Lambda::Permission
```

### Lambda

```js
// lambda/auth.js
module.exports.preSignUp = (event, context, callback) => {
  event.response.autoConfirmUser = true
  event.response.autoVerifyEmail = true
  callback(null, event)
}
```

### 추가정보

- 이번 예제소스 부터 --Transform: 'AWS::Serverless-2016-10-31'-- 이 추가되었다. 이 것은 AWS-SAM 문법을 사용하겠다는 뜻이다. API Gateway, Lambda의 간소화 된 문법을 쓰고 싶다면 추가하자.
- CognitoLambdaConfigPermission 처럼 User Pool이 Lambda함수를 실행할 수 있는 권한을 주지 않으면 Cognito에서 Lambda 함수는 실행되지 않는다.