---
layout : tutorials
category : tutorials
title : AWS Severless IoT 7 – API Gateway + Lambda Proxy
subcategory : setlayout
summary : AWS Severless IoT에 대해 알아봅니다.
permalink : /tutorials/weplanet/7API-Gateway-Lambda-Proxy
author : marcushong
tags : aws
title\_background\_color : F1F71A
---



### Lambda Proxy

API Gateway에 매번 일일이 리소스와 메서드를 만들 필요없이 하나의 Lambda 함수로 특정 path 이하의 모든 path를 처리할 수 있다.

### 주요기능

- 각 Lambda 마다 필요한 권한만을 할당한 Role을 만들어 할당한다.
- 각 Lambda 마다 Log Group을 지정해 CloudWatch에서 로그를 확인할 수 있도록 한다.
- 각 Lambda 마다 Environment로 실행할 때 필요한 리소스를 참조할 수 있도록 한다. 여기에 선언된 변수는 process.env로 참조 가능하다.

```yaml
Resource:
  BasicExecutionRole:
    Type: 'AWS::IAM::Role'
    Properties:
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service:
                - lambda.amazonaws.com
                - apigateway.amazonaws.com
            Action: 'sts:AssumeRole'
      Policies:
        - PolicyName: LambdaDatabasePolicy
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: Allow
                Action:
                  - 'dynamodb:*'
                  - 'lambda:InvokeFunction'
                  - 's3:*'
                  - 'iot:*'
                Resource: '*'
      ManagedPolicyArns:
        - 'arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole'
        
  CognitoExecutionRole:
    Type: 'AWS::IAM::Role'
    Properties:
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service:
                - lambda.amazonaws.com
                - apigateway.amazonaws.com
            Action: 'sts:AssumeRole'
      Policies:
        - PolicyName: LambdaCognitoPolicy
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: Allow
                Action:
                  - 'cognito-idp:*'
                  - 'lambda:InvokeFunction'
                Resource: '*'
      ManagedPolicyArns:
        - 'arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole'
  
  PublicApis:
    Type: 'AWS::Serverless::Function'
    Properties:
      CodeUri: src
      Handler: bin/lambda.handler
      Runtime: nodejs6.10
      Role:
        'Fn::GetAtt':
          - CognitoExecutionRole
          - Arn
      Environment:
        Variables:
          NODE_ENV: development
          UserPoolId:
            Ref: CognitoUserPool
          UserPoolWebClient:
            Ref: CognitoUserPoolWebClient
          IdentityPoolId:
            Ref: CognitoIdentityPool
      Timeout: 30
      Events:
        ProxyApiRoot:
          Type: Api
          Properties:
            RestApiId:
              Ref: ApiGatewayApi
            Path: /common
            Method: ANY
        ProxyApiGreedy:
          Type: Api
          Properties:
            RestApiId:
              Ref: ApiGatewayApi
            Path: '/common/{proxy+}'
            Method: ANY
            
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
          NODE_ENV: development
          S3Bucket:
            Ref: S3Bucket
      Timeout: 30
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
            
  PublicApisLogGroup:
    Type: 'AWS::Logs::LogGroup'
    DependsOn: PublicApis
    Properties:
      RetentionInDays: 14
      LogGroupName:
        'Fn::Join':
          - ''
          - - /aws/lambda/
            - Ref: PublicApis
            
  PrivateApisV1LogGroup:
    Type: 'AWS::Logs::LogGroup'
    DependsOn: PrivateApisV1
    Properties:
      RetentionInDays: 14
      LogGroupName:
        'Fn::Join':
          - ''
          - - /aws/lambda/
            - Ref: PrivateApisV1
```

### 추가정보

- LogGroup을 설정하지 않아도 LogGroup은 생성된다. 하지만 이렇게 만들어진 그룹은 유효기간이 무제한이라 CloudWatch 비용이 상승할 수 있다. 또한 스택이 삭제될 때 같이 삭제가 되지 않으므로 추후 관리에 문제가 발생할 수 있다.