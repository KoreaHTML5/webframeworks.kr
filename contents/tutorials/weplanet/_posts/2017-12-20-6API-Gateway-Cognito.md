---
layout : tutorials
category : tutorials
title : AWS Severless IoT 6 – API Gateway + Cognito
subcategory : setlayout
summary : AWS Severless IoT에 대해 알아봅니다.
permalink : /tutorials/weplanet/6API-Gateway-Cognito
author : marcushong
tags : aws
title\_background\_color : F1F71A
---



### API Gateway

인증 부분이 준비되었으니 API의 차례다. 
10개 내외의 http api를 만들 예정이 아니라면 Lambda proxy로 express.js를 실행하는 것이 여러모로 편리하다.
Lambda로 API를 만들 생각이라면 [API Gateway-Lambda]을 참고.
Cognito와 API Gateway를 연동해서 보안을 강화하고, API Gateway와 Lambda를 연동시켜 Serverless API를 만들어 본다.
API를 만들때 Swagger 문법을 지원하므로, Inline-Swagger로 Lambda를 선언한다.
AWS-SAM 문법을 사용하는 것이 순수 Cloudformation보다 쉽고 간편하기 때문에 이번부터는 AWS-SAM을 사용한다.

### 주요기능

- 인증이 필요없는 common과 핵심 로직이 담겨있는 v1, 그리고 swagger용인 swagger의 3개의 path로 구성한다.
- 각 path마다 하나의 Lambda함수로 구성하기 위해 lambda proxy를 사용. 선언된 Lambda는 해당 path 이하의 모든 path를 처리한다.
- 인증이 필요한 v1 proxy Lambda는 Header에 Cognito IdToken을 넣지 않으면 401이 반환되도록 Cognito와 연동한다.
- CORS가 가능하도록 options를 추가한다.

### Cloudformation

```yaml
Transform: 'AWS::Serverless-2016-10-31'

Resources:
  ApiGatewayApi:
    Type: 'AWS::Serverless::Api'
    Properties:
      DefinitionBody:
        swagger: 2
        info:
          title: Dev
        basePath: /Dev
        schemes:
          - https
        x-amazon-apigateway-binary-media-types:
          - '*/*'
        definitions:
          Empty:
            type: object
            title: Empty Schema
        paths:
          /common:
            x-amazon-apigateway-any-method:
              produces:
                - application/json
              responses:
                '200':
                  description: 200 response
                  schema:
                    $ref: '#/definitions/Empty'
              x-amazon-apigateway-integration:
                responses:
                  default:
                    statusCode: 200
                uri:
                  'Fn::Sub': >-
                    arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/arn:aws:lambda:${AWS::Region}:${AWS::AccountId}:function:${PublicApis}/invocations
                credentials:
                  'Fn::GetAtt':
                    - CognitoExecutionRole
                    - Arn
                passthroughBehavior: when_no_match
                httpMethod: POST
                type: aws_proxy
            options:
              consumes:
                - application/json
              produces:
                - application/json
              responses:
                '200':
                  description: 200 response
                  schema:
                    $ref: '#/definitions/Empty'
                  headers:
                    Access-Control-Allow-Origin:
                      type: string
                    Access-Control-Allow-Methods:
                      type: string
                    Access-Control-Allow-Headers:
                      type: string
              x-amazon-apigateway-integration:
                responses:
                  default:
                    statusCode: 200
                    responseParameters:
                      method.response.header.Access-Control-Allow-Methods: '''DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'''
                      method.response.header.Access-Control-Allow-Headers: >-
                        'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'
                      method.response.header.Access-Control-Allow-Origin: '''*'''
                passthroughBehavior: when_no_match
                requestTemplates:
                  application/json: '{\"statusCode\": 200}'
                type: mock
          '/common/{proxy+}':
            x-amazon-apigateway-any-method:
              produces:
                - application/json
              parameters:
                - name: proxy
                  in: path
                  required: true
                  type: string
              responses: {}
              x-amazon-apigateway-integration:
                uri:
                  'Fn::Sub': >-
                    arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/arn:aws:lambda:${AWS::Region}:${AWS::AccountId}:function:${PublicApis}/invocations
                credentials:
                  'Fn::GetAtt':
                    - CognitoExecutionRole
                    - Arn
                httpMethod: POST
                type: aws_proxy
            options:
              consumes:
                - application/json
              produces:
                - application/json
              responses:
                '200':
                  description: 200 response
                  schema:
                    $ref: '#/definitions/Empty'
                  headers:
                    Access-Control-Allow-Origin:
                      type: string
                    Access-Control-Allow-Methods:
                      type: string
                    Access-Control-Allow-Headers:
                      type: string
              x-amazon-apigateway-integration:
                responses:
                  default:
                    statusCode: 200
                    responseParameters:
                      method.response.header.Access-Control-Allow-Methods: '''DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'''
                      method.response.header.Access-Control-Allow-Headers: >-
                        'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'
                      method.response.header.Access-Control-Allow-Origin: '''*'''
                passthroughBehavior: when_no_match
                requestTemplates:
                  application/json: '{\"statusCode\": 200}'
                type: mock
          /v1:
            x-amazon-apigateway-any-method:
              produces:
                - application/json
              responses:
                '200':
                  description: 200 response
                  schema:
                    $ref: '#/definitions/Empty'
              x-amazon-apigateway-integration:
                responses:
                  default:
                    statusCode: 200
                uri:
                  'Fn::Sub': >-
                    arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/arn:aws:lambda:${AWS::Region}:${AWS::AccountId}:function:${PrivateApisV1}/invocations
                credentials:
                  'Fn::GetAtt':
                    - BasicExecutionRole
                    - Arn
                passthroughBehavior: when_no_match
                httpMethod: POST
                type: aws_proxy
              security:
                - CognitoUserPool: []
            options:
              consumes:
                - application/json
              produces:
                - application/json
              responses:
                '200':
                  description: 200 response
                  schema:
                    $ref: '#/definitions/Empty'
                  headers:
                    Access-Control-Allow-Origin:
                      type: string
                    Access-Control-Allow-Methods:
                      type: string
                    Access-Control-Allow-Headers:
                      type: string
              x-amazon-apigateway-integration:
                responses:
                  default:
                    statusCode: 200
                    responseParameters:
                      method.response.header.Access-Control-Allow-Methods: '''DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'''
                      method.response.header.Access-Control-Allow-Headers: >-
                        'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'
                      method.response.header.Access-Control-Allow-Origin: '''*'''
                passthroughBehavior: when_no_match
                requestTemplates:
                  application/json: '{\"statusCode\": 200}'
                type: mock
          '/v1/{proxy+}':
            x-amazon-apigateway-any-method:
              produces:
                - application/json
              parameters:
                - name: proxy
                  in: path
                  required: true
                  type: string
              responses: {}
              x-amazon-apigateway-integration:
                uri:
                  'Fn::Sub': >-
                    arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/arn:aws:lambda:${AWS::Region}:${AWS::AccountId}:function:${PrivateApisV1}/invocations
                credentials:
                  'Fn::GetAtt':
                    - BasicExecutionRole
                    - Arn
                httpMethod: POST
                type: aws_proxy
              security:
                - CognitoUserPool: []
            options:
              consumes:
                - application/json
              produces:
                - application/json
              responses:
                '200':
                  description: 200 response
                  schema:
                    $ref: '#/definitions/Empty'
                  headers:
                    Access-Control-Allow-Origin:
                      type: string
                    Access-Control-Allow-Methods:
                      type: string
                    Access-Control-Allow-Headers:
                      type: string
              x-amazon-apigateway-integration:
                responses:
                  default:
                    statusCode: 200
                    responseParameters:
                      method.response.header.Access-Control-Allow-Methods: '''DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'''
                      method.response.header.Access-Control-Allow-Headers: >-
                        'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'
                      method.response.header.Access-Control-Allow-Origin: '''*'''
                passthroughBehavior: when_no_match
                requestTemplates:
                  application/json: '{\"statusCode\": 200}'
                type: mock
          /swagger:
            x-amazon-apigateway-any-method:
              produces:
                - application/json
              responses:
                '200':
                  description: 200 response
                  schema:
                    $ref: '#/definitions/Empty'
              x-amazon-apigateway-integration:
                responses:
                  default:
                    statusCode: 200
                uri:
                  'Fn::Sub': >-
                    arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/arn:aws:lambda:${AWS::Region}:${AWS::AccountId}:function:${Swagger}/invocations
                credentials:
                  'Fn::GetAtt':
                    - BasicExecutionRole
                    - Arn
                passthroughBehavior: when_no_match
                httpMethod: POST
                type: aws_proxy
            options:
              consumes:
                - application/json
              produces:
                - application/json
              responses:
                '200':
                  description: 200 response
                  schema:
                    $ref: '#/definitions/Empty'
                  headers:
                    Access-Control-Allow-Origin:
                      type: string
                    Access-Control-Allow-Methods:
                      type: string
                    Access-Control-Allow-Headers:
                      type: string
              x-amazon-apigateway-integration:
                responses:
                  default:
                    statusCode: 200
                    responseParameters:
                      method.response.header.Access-Control-Allow-Methods: '''DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'''
                      method.response.header.Access-Control-Allow-Headers: >-
                        'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'
                      method.response.header.Access-Control-Allow-Origin: '''*'''
                passthroughBehavior: when_no_match
                requestTemplates:
                  application/json: '{\"statusCode\": 200}'
                type: mock
          '/swagger/{proxy+}':
            x-amazon-apigateway-any-method:
              produces:
                - application/json
              parameters:
                - name: proxy
                  in: path
                  required: true
                  type: string
              responses: {}
              x-amazon-apigateway-integration:
                uri:
                  'Fn::Sub': >-
                    arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/arn:aws:lambda:${AWS::Region}:${AWS::AccountId}:function:${Swagger}/invocations
                credentials:
                  'Fn::GetAtt':
                    - BasicExecutionRole
                    - Arn
                httpMethod: POST
                type: aws_proxy
            options:
              consumes:
                - application/json
              produces:
                - application/json
              responses:
                '200':
                  description: 200 response
                  schema:
                    $ref: '#/definitions/Empty'
                  headers:
                    Access-Control-Allow-Origin:
                      type: string
                    Access-Control-Allow-Methods:
                      type: string
                    Access-Control-Allow-Headers:
                      type: string
              x-amazon-apigateway-integration:
                responses:
                  default:
                    statusCode: 200
                    responseParameters:
                      method.response.header.Access-Control-Allow-Methods: '''DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'''
                      method.response.header.Access-Control-Allow-Headers: >-
                        'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'
                      method.response.header.Access-Control-Allow-Origin: '''*'''
                passthroughBehavior: when_no_match
                requestTemplates:
                  application/json: '{\"statusCode\": 200}'
                type: mock
        securityDefinitions:
          CognitoUserPool:
            type: apiKey
            name: Authorization
            in: header
            x-amazon-apigateway-authtype: cognito_user_pools
            x-amazon-apigateway-authorizer:
              type: cognito_user_pools
              providerARNs:
                - 'Fn::Sub': >-
                    arn:aws:cognito-idp:${AWS::Region}:${AWS::AccountId}:userpool/${CognitoUserPool}
      StageName: Dev
      Variables: {}

Outputs:
  ApiGatewayStage:
    Value: Dev
  ApiGatewayRestApiId:
    Value:
      Ref: ApiGatewayApi

```

### 추가정보

- Swagger는 2.0 문법만 지원한다.
- DefinitionBody 외에 DefinitionUri로 파일을 분리해서 로드할 수 있지만, 그렇게 되면 ${AWS::AccountId}, ${CognitoUserPool} 와 같은 참조를 쓰지 못하고 직접 입력해야 되기 때문에 DefinitionBody를 사용하는 것이 관리가 편하다.

### x-amazon-apigateway-integration

예제 소스 중 본인의 필요에 따라 path를 추가하거나 삭제하고, securityDefinitions을 선언해 주면 cognito와 연동된다.
x-amazon-apigateway-integration에 :function:${PublicApis}/invocations 부분이 Lambda함수를 선언하는 부분인데 이 부분은 role과도 연관되어 있는 부분이라 다음에 설명한다.