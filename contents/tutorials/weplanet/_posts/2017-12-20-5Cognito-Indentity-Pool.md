---
layout : tutorials
category : tutorials
title : AWS Severless IoT 5 – Cognito Indentity Pool
subcategory : setlayout
summary : AWS Severless IoT에 대해 알아봅니다.
permalink : /tutorials/weplanet/5Cognito-Indentity-Pool
author : marcushong
tags : aws
title\_background\_color : F1F71A
---



### Cognito Indentity Pool

Cognito에 있는 또 다른 서비스인 Indentity Pool은 User Pool에 있는 유저 정보로 토대로 자격 증명을 할 수 있게 한다.

### 주요기능

- Facebook, Twitter등 서드파티로 회원 가입 및 로그인이 가능한다.
- 인증된 Role, 인증되지 않은 Role을 만들 수 있어서 역할을 분리할 수 있다.
- API Gateway, Iot 등 인증이 필요한 서비스가 있다면 Identity Pool을 통해 인증된 사용자만 사용가능하도록 할 수 있다.

### Cloudformation

- Identity Pool 과 앞서 만든 User Pool을 연동한다.
- Identity Pool을 사용할 수 있게 앞서 만든 Client와 연동한다.
- 인증된 유저와 그렇지 않은 유저를 구분지어서 Role에 할당한다.

```yaml
Resources:
  CognitoIdentityPool:
    Type: 'AWS::Cognito::IdentityPool'
    Properties:
      IdentityPoolName:
        'Fn::Sub': '${Environment}IdentityPool'
      AllowUnauthenticatedIdentities: false
      CognitoIdentityProviders:
        - ClientId:
            Ref: CognitoUserPoolAppClient
          ProviderName:
            'Fn::GetAtt':
              - CognitoUserPool
              - ProviderName
        - ClientId:
            Ref: CognitoUserPoolWebClient
          ProviderName:
            'Fn::GetAtt':
              - CognitoUserPool
              - ProviderName
  IdentityPoolRoleMapping:
    Type: 'AWS::Cognito::IdentityPoolRoleAttachment'
    Properties:
      IdentityPoolId:
        Ref: CognitoIdentityPool
      Roles:
        authenticated:
          'Fn::GetAtt':
            - CognitoAuthorizedRole
            - Arn
        unauthenticated:
          'Fn::GetAtt':
            - CognitoUnAuthorizedRole
            - Arn
  CognitoAuthorizedRole:
    Type: 'AWS::IAM::Role'
    Properties:
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Federated: cognito-identity.amazonaws.com
            Action:
              - 'sts:AssumeRoleWithWebIdentity'
            Condition:
              StringEquals:
                'cognito-identity.amazonaws.com:aud':
                  Ref: CognitoIdentityPool
              'ForAnyValue:StringLike':
                'cognito-identity.amazonaws.com:amr': authenticated
      Policies:
        - PolicyName: CognitoAuthorizedPolicy
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: Allow
                Action:
                  - 'mobileanalytics:PutEvents'
                  - 'cognito-sync:*'
                  - 'cognito-identity:*'
                  - 'iot:*'
                Resource: '*'
  CognitoUnAuthorizedRole:
    Type: 'AWS::IAM::Role'
    Properties:
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Federated: cognito-identity.amazonaws.com
            Action:
              - 'sts:AssumeRoleWithWebIdentity'
            Condition:
              StringEquals:
                'cognito-identity.amazonaws.com:aud':
                  Ref: CognitoIdentityPool
              'ForAnyValue:StringLike':
                'cognito-identity.amazonaws.com:amr': unauthenticated
      Policies:
        - PolicyName: CognitoUnauthorizedPolicy
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: Allow
                Action:
                  - 'mobileanalytics:PutEvents'
                Resource: '*'
Outputs:
  IdentityPoolId:
    Value:
      Ref: CognitoIdentityPool
```

### 추가정보

- 별도의 유저 정보를 보관해야 하는 경우가 있다면 회원가입을 Client가 아닌 Backend에서 진행한 후, Client에서는 로그인만 처리해야 한다.
- 이메일로 회원가입을 하면서 별도의 유저 ID(ex: 숫자만으로 구성된)를 사용하고 싶다면 preferred_username 을 사용하고 변경 불가능하게 만들면 된다.

### [amazon-cognito-identity-js](https://github.com/aws/amazon-cognito-identity-js)

- aws에서 회원가입 및 인증을 js로 좀 더 쉽게 구현할 수 있는 기능을 제공한다. 
- package.json에 선언하게 되면 빌드 시에 aws-sdk까지 설치해 버리므로 라이브러리 파일만 추가하는 것이 좋다.
- preferred_username을 사용하고, Backend에서 jwt token을 파싱해서 쓴다면 AccessToken에는 해당 정보가 없으니, IdToken을 사용해야 한다.

### email과 preferred_username으로 회원가입을 구현한 예제소스

```js
const AmazonCognitoIdentity = require('../lib/amazon-cognito-identity.min')

function getCognitoUserPool() {
  return new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId: process.env.UserPoolId,
    ClientId: process.env.UserPoolWebClient
  })
}

module.exports.signUp = (userId, options, callback) => {
  try {
    const attributeList = []
    const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: 'email',
      Value: options.userName
    })
    const attributeId = new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: 'preferred_username',
      Value: userId
    })
    attributeList.push(attributeEmail)
    attributeList.push(attributeId)

    getCognitoUserPool().signUp(options.userName, options.password, attributeList, null, callback)
  }
  catch (err) {
    throw err
  }
}

// Client가 구현되지 않으면 IdToken 가져올 수 없으므로 Id Token 테스트 용으로만 사용.
module.exports.login = (userName, password, callback) => {
  const authenticationData = {
    Username: userName,
    Password: password
  }
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

  const userPool = getCognitoUserPool()
  const userData = {
    Username: userName,
    Pool: userPool
  }
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)
  cognitoUser.authenticateUser(authenticationDetails, callback)
}
```