---
layout : tutorials
category : tutorials
title : Hyperledger Fabric - configtx.yml 으로 기관 설정
subcategory : setlayout
summary : configtx.yml로 기관을 설정해 봅시다.
permalink : /tutorials/hyperledger-fabric/configtx
author : marcushong
tags : hyperledger fabric
title\_background\_color : F1F71A
---

### cryptogen
채널 정보를 기반으로 초기 블록을 생성해야 한다.(genesis block) 
```bash
configtxgen -profile OneOrgOrdererGenesis -outputBlock ./config/genesis.block
configtxgen -profile OneOrgChannel -outputCreateChannelTx ./config/channel.tx -channelID mychannel
configtxgen -profile OneOrgChannel -outputAnchorPeersUpdate ./config/Org1MSPanchors.tx -channelID mychannel -asOrg Org1MSP

```
### configtx.yml
생성된 인증정보를 토대로 backend에서 사용할 configtx.yml를 만들어보자.
```yaml
Organizations:
    - &OrdererOrg
        Name: OrdererMSP
        ID: OrdererMSP
        MSPDir: crypto-config/ordererOrganizations/example.com/msp

    - &Org1
        Name: Org1MSP
        ID: Org1MSP
        MSPDir: crypto-config/peerOrganizations/org1.example.com/msp
        AnchorPeers:
            - Host: peer0.org1.example.com
              Port: 7051

    - &Org2
        Name: Org2MSP
        ID: Org2MSP
        MSPDir: crypto-config/peerOrganizations/org2.example.com/msp
        AnchorPeers:
            - Host: peer0.org2.example.com
              Port: 7051

Application: &ApplicationDefaults
    Organizations:

Orderer: &OrdererDefaults
    OrdererType: solo
    Addresses:
        - orderer.example.com:7050
    BatchTimeout: 2s
    BatchSize:
        MaxMessageCount: 10
        AbsoluteMaxBytes: 98 MB
        PreferredMaxBytes: 512 KB

    Kafka:
        Brokers:
            - 127.0.0.1:9092

    Organizations:

Profiles:

    TwoOrgsOrdererGenesis:
        Orderer:
            <<: *OrdererDefaults
            Organizations:
                - *OrdererOrg
        Consortiums:
            SampleConsortium:
                Organizations:
                    - *Org1
                    - *Org2
    TwoOrgsChannel:
        Consortium: SampleConsortium
        Application:
            <<: *ApplicationDefaults
            Organizations:
                - *Org1
                - *Org2

```

### genesis block
블록체
