---
layout : tutorials
category : tutorials
title : AWS Severless IoT 2 – Cloudformation으로 Base Stack 만들기
subcategory : setlayout
summary : AWS Severless IoT에 대해 알아봅니다.
permalink : /tutorials/weplanet/2Cloudformation
author : marcushong
tags : aws
title\_background\_color : F1F71A
---



### Cloudformation

Cloudformation은 각 서비스의 사양, 설정들을 aws console이 아닌 json이나 yaml문서로 작성해서 배포하므로 문서 버저닝을 한다면 리소스 생성, 수정, 조회를 쉽게 할 수 있어 유지보수를 한결 편리하게 해주는 서비스다.
Cloudformation 자체는 무료이기 때문에 기존에 AWS를 사용한다면 부담없이 도입할 수 있다.



### Base Stack의 목적

- Lambda를 업로드할 S3를 생성한다.
- github에 있는 Cloudformation 템플릿을 가져와서 스택을 생성하게 하는 Codepipeline을 만든다.
- 완료가 되면 SNS로 설정한 email로 결과를 알려준다.
- 여기서는 Codepipeline에서 release branch에 소스가 푸시가 될 경우 Cloudformation으로 보내어 스택의 변경 사항을 반영하게 하는 것이므로, 직접하는 것이 편하다면 삭제해도 된다.



### 전체 코드

Cloudformation은 yaml, json 두가지 타입 모두로 만들 수 있다. 조금 더 동적으로 런타임시에 일부 기능을 추가, 삭제, 변경을 하고 싶다면 json으로, 그것이 아니라면 yaml 형식으로 만드는 것이 좀 더 읽기가 쉽다. 여기서는 yaml 파일을 사용하도록 한다.



#### base-stack.yaml

```yaml
AWSTemplateFormatVersion: 2010-09-09
Description: Base Stack
Parameters:
  TagPrefix:
    Type: String
  TemplateFileName:
    Default: packaged-stack.yaml
    Type: String
  Email:
    Type: String
  GitHubOAuthToken:
    Description: Create a token with 'repo' and 'admin:repo_hook' permissions here https://github.com/settings/tokens
    Type: String
  GitHubUser:
    Description: Enter GitHub userName of the repository owner
    Type: String
  GitHubRepository:
    Type: String
  GitHubBranch:
    Type: String
    Default: master

Metadata:
  AWS::CloudFormation::Interface:
    ParameterGroups:
      - Label:
          default: CodePipeline Settings
        Parameters:
          - TemplateFileName
          - Email
      - Label:
          default: Github Settings
        Parameters:
          - GitHubOAuthToken
          - GitHubUser
          - GitHubRepository
          - GitHubBranch

Resources:
  S3Bucket:
    Type: AWS::S3::Bucket
    Properties:
      VersioningConfiguration:
        Status: Enabled

  CodePipelineSNSTopic:
    Type: AWS::SNS::Topic
    Properties:
      Subscription:
        - Endpoint:
            Ref: Email
          Protocol: email

  Pipeline:
    Type: AWS::CodePipeline::Pipeline
    Properties:
      ArtifactStore:
        Location:
          Ref: S3Bucket
        Type: S3
      DisableInboundStageTransitions: []
      RoleArn:
        Fn::GetAtt: [PipelineRole, Arn]
      Stages:
        - Name: GithubTestSource
          Actions:
            - Name: GitHub
              ActionTypeId:
                Category: Source
                Owner: ThirdParty
                Provider: GitHub
                Version: 1
              Configuration:
                Owner:
                  Ref: GitHubUser
                Repo:
                  Ref: GitHubRepository
                Branch:
                  Ref: GitHubBranch
                OAuthToken:
                  Ref: GitHubOAuthToken
                PollForSourceChanges: true
              OutputArtifacts:
                - Name: TemplateSource
              RunOrder: 1

        - Name: DevStage
          Actions:
            - Name: CreateChangeSet
              ActionTypeId:
                Category: Deploy
                Owner: AWS
                Provider: CloudFormation
                Version: 1
              InputArtifacts:
                - Name: TemplateSource
              Configuration:
                ActionMode: CHANGE_SET_REPLACE
                Capabilities: CAPABILITY_IAM
                RoleArn:
                  Fn::GetAtt: CFNRole.Arn
                StackName:
                  Fn::Sub: ${TagPrefix}-Dev
                ChangeSetName: DevChangeSet
                TemplatePath:
                  Fn::Sub: TemplateSource::dist/${TemplateFileName}
                TemplateConfiguration:
              RunOrder: 2

            - Name: ExecuteChangeSet
              ActionTypeId:
                Category: Deploy
                Owner: AWS
                Provider: CloudFormation
                Version: 1
              Configuration:
                ActionMode: CHANGE_SET_EXECUTE
                ChangeSetName: DevChangeSet
                RoleArn:
                  Fn::GetAtt: [CFNRole, Arn]
                StackName:
                  Fn::Sub: ${TagPrefix}-Dev
              RunOrder: 3
  CFNRole:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Statement:
        - Action: ['sts:AssumeRole']
          Effect: Allow
          Principal:
            Service: [cloudformation.amazonaws.com]
        Version: '2012-10-17'
      Path: /
      Policies:
        - PolicyName: CloudFormationRole
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Action:
                  - "iam:*"
                  - "lambda:*"
                  - "iot:*"
                  - "rds:*"
                  - "ec2:*"
                  - "apigateway:*"
                  - "cloudformation:*"
                  - "cognito-idp:*"
                  - "cognito-identity:*"
                  - "dynamodb:*"
                  - "s3:*"
                Effect: Allow
                Resource: '*'

  PipelineRole:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Statement:
        - Action: ['sts:AssumeRole']
          Effect: Allow
          Principal:
            Service: [codepipeline.amazonaws.com]
        Version: '2012-10-17'
      Path: /
      Policies:
        - PolicyName: CodePipelineAccess
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Action:
                - 's3:*'
                - 'cloudformation:CreateStack'
                - 'cloudformation:DescribeStacks'
                - 'cloudformation:DeleteStack'
                - 'cloudformation:UpdateStack'
                - 'cloudformation:CreateChangeSet'
                - 'cloudformation:ExecuteChangeSet'
                - 'cloudformation:DeleteChangeSet'
                - 'cloudformation:DescribeChangeSet'
                - 'cloudformation:SetStackPolicy'
                - 'iam:PassRole'
                - 'sns:Publish'
                Effect: Allow
                Resource: '*'

Outputs:
  S3Bucket:
    Value:
      Ref: S3Bucket
  CodePipelineURL:
    Value:
      Fn::Sub: "https://${AWS::Region}.console.aws.amazon.com/codepipeline/home?region=${AWS::Region}#/view/${TagPrefix}-DevPipeline"
```

#### base-stack.json

```json
[
  {
    "ParameterKey": "TagPrefix",
    "ParameterValue": "Sample"
  },
  {
    "ParameterKey": "TemplateFileName",
    "ParameterValue": "packaged-stack.yml"
  },
  {
    "ParameterKey": "Email",
    "ParameterValue": "email"
  },
  {
    "ParameterKey": "GitHubUser",
    "ParameterValue": "username"
  },
  {
    "ParameterKey": "GitHubRepository",
    "ParameterValue": "sample-backend"
  },
  {
    "ParameterKey": "GitHubBranch",
    "ParameterValue": "release"
  },
  {
    "ParameterKey": "GitHubOAuthToken",
    "ParameterValue": "token"
  }
]
```

리소스를 선언할 때 특정 이름을 지정할 수도 있지만, 대부분의 경우 비워두는 것이 좋다.
이름을 만들게 되면, aws에 같은 이름으로는 같은 이름으로는 리소스를 생성하지 못하기 때문이다.
이름을 비워두게 되면 Cloudformation에서 변수명 뒤에 랜덤값을 넣어 이름을 생성하므로 하나의 템플릿으로 여러 개의  같은 스택을 만들 수 있다.



### 주의점

- CFNRole 에는 Cloudformation에서 스택을 생성할 시에 필요한 모든 권한이 있어야 한다. 스택 생성시에 발생하는 오류의 대부분 권한 문제에서 나온다.
- PollForSourceChanges을 true으로 하게 되면 푸시가 될 때마다 CodePipeline이 동작한다. 같은 branch를 쓰고 싶거나 수동으로 템플릿을 배포하고 싶다면 false를 선택한다.



### 만든 Yaml 파일 배포

Aws에 배포하는 방법은 2가지가 있다.

- Cloudformation Console
  - https://ap-northeast-2.console.aws.amazon.com/cloudformation/designer/home
  - base-stack.json이 필요없이 직접 console에서 입력하면 된다.
- aws-cli
  - http://docs.aws.amazon.com/cli/latest/reference/cloudformation/index.html
  - aws-cli 실행시에 base-params.json에 있는 변수를 불러와야 하기 때문에 반드시 필요하다. 개발스택, 운영스택을 나누고 싶다면 이 방법을 추천한다.