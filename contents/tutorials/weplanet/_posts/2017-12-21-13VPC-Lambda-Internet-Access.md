---
layout : tutorials
category : tutorials
title : AWS Severless IoT 13 – VPC Lambda-Internet Access
subcategory : setlayout
summary : AWS Severless IoT에 대해 알아봅니다.
permalink : /tutorials/weplanet/13VPC-Lambda-Internet-Access
author : marcushong
tags : aws
title\_background\_color : F1F71A
---



### VPC - Lambda의 문제

Lambda 함수를 VPC의 Subnet에 할당하는 순간부터 DB에는 접속할 수 있지만, Lambda에서 외부로는 접속을 할 수 없다.
Lambda 함수가 외부 인터넷 접속을 하기 위해서는 Nat Gateway를 연결해야 한다.

### 주요기능

- InternetGateway를 VPC에 연결한다.
- Elastic IP로 고정 IP를 생성한다.
- 생성한 고정 IP를 Nat Gateway에 할당한다.
- 기존에 만든 Private Subnet에 Nat Gateway를 연동한다.
- Private Subnet에 속하는 Public Subnet을 만든 후, VPC에 새롭게 Route Table을 생성해 할당한다.

```yaml
Resources:
  InternetGateway:
    Type: 'AWS::EC2::InternetGateway'
    
  VPCInternetGateway:
    Type: 'AWS::EC2::VPCGatewayAttachment'
    Properties:
      InternetGatewayId:
        Ref: InternetGateway
      VpcId:
        Ref: VPC
        
  PrivateRoute:
    Type: 'AWS::EC2::Route'
    Properties:
      RouteTableId:
        Ref: PrivateRouteTable
      DestinationCidrBlock: 0.0.0.0/0
      GatewayId:
        Ref: InternetGateway
        
  PrivateRouteTable:
    Type: 'AWS::EC2::RouteTable'
    Properties:
      VpcId:
        Ref: VPC
        
  PublicSubnetA:
    Type: 'AWS::EC2::Subnet'
    Properties:
      VpcId:
        Ref: VPC
      AvailabilityZone: ap-northeast-2a
      CidrBlock: 172.34.0.0/18
      
  PublicSubnetB:
    Type: 'AWS::EC2::Subnet'
    Properties:
      VpcId:
        Ref: VPC
      AvailabilityZone: ap-northeast-2c
      CidrBlock: 172.34.64.0/18

  PublicSubnetNetworkAclAssociationA:
    Type: 'AWS::EC2::SubnetNetworkAclAssociation'
    Properties:
      SubnetId:
        Ref: PublicSubnetA
      NetworkAclId:
        Ref: NetworkAcl
        
  PublicSubnetNetworkAclAssociationB:
    Type: 'AWS::EC2::SubnetNetworkAclAssociation'
    Properties:
      SubnetId:
        Ref: PublicSubnetB
      NetworkAclId:
        Ref: NetworkAcl
      
  NatRoute:
    Type: 'AWS::EC2::Route'
    Properties:
      RouteTableId:
        Ref: NatRouteTable
      DestinationCidrBlock: 0.0.0.0/0
      NatGatewayId:
        Ref: NatGateway
        
  NatGateway:
    Type: 'AWS::EC2::NatGateway'
    Properties:
      AllocationId:
        'Fn::GetAtt':
          - NatEIP
          - AllocationId
      SubnetId:
        Ref: PrivateSubnetA
        
  NatEIP:
    Type: 'AWS::EC2::EIP'
    Properties:
      Domain: vpc
      
  NatRouteTable:
    Type: 'AWS::EC2::RouteTable'
    Properties:
      VpcId:
        Ref: VPC
        
  NatSubnetRouteTableAssociationA:
    Type: 'AWS::EC2::SubnetRouteTableAssociation'
    Properties:
      SubnetId:
        Ref: PublicSubnetA
      RouteTableId:
        Ref: NatRouteTable
        
  NatSubnetRouteTableAssociationB:
    Type: 'AWS::EC2::SubnetRouteTableAssociation'
    Properties:
      SubnetId:
        Ref: PublicSubnetB
      RouteTableId:
        Ref: NatRouteTable
```

### 주의사항

- console을 쓰게 되면 간단히 끝나겠지만, Cloudformation을 쓰게 되면 모든 설정을 만들어 주어야 한다.
- NetworkAcl, RouteTable, RouteTableAssociarion 등, 오류가 난다면 빠진 항목이 없는지 꼼꼼이 확인해야 한다.