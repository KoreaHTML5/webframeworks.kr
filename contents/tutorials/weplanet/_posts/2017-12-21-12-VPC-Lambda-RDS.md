---
layout : tutorials
category : tutorials
title : AWS Severless IoT 12 – VPC Lambda-RDS
subcategory : setlayout
summary : AWS Severless IoT에 대해 알아봅니다.
permalink : /tutorials/weplanet/12-VPC-Lambda-RDS
author : marcushong
tags : aws
title\_background\_color : F1F71A
---



### Lambda VPC

RDS를 VPC에 속하도록 만들었으므로 VPC에서만 접속할 수 있게 되었다.
하지만, Lambda는 아직 VPC의 Subnet에 속하지 않으므로 DB에 접속할 수 없다.
여기서는 Lambda를 VPC의 Subnet Group 내에 위치하도록 설정한다.

### Cloudformation

```yaml
Resources:
  VPCLambdaSecurityGroup:
    Properties:
      GroupDescription: Security Group for our private VPC
      SecurityGroupEgress: []
      SecurityGroupIngress:
      - CidrIp: 0.0.0.0/0
        FromPort: 0
        IpProtocol: -1
        ToPort: 65535
      VpcId:
        Ref: VPC
    Type: AWS::EC2::SecurityGroup
    
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
          UserPoolId:
            Ref: CognitoUserPool
          UserPoolWebClient:
            Ref: CognitoUserPoolWebClient
          IdentityPoolId:
            Ref: CognitoIdentityPool
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
          S3Bucket:
            Ref: S3Bucket
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

- 기존에 선언해 놓은 Lambda 함수에 VPCLambdaSecurityGroup 를 선언한 값과 subnet을 선언해 주면 간단하게 설정이 끝난다.
- VPC Wizard로 만들었다면 Lambda 함수 설정 console에서 설정 가능하다.
- PublicSubnetA, PublicSubnetB 부분은 Lambda 함수의 인터넷 접속을 위한 부분으로 Lambda - Internet Access 에서 설명한다.