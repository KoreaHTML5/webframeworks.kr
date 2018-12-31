---
layout : tutorials
category : tutorials
title : Hyperledger Fabric - 인증
subcategory : setlayout
summary : 인증을 하는 api를 만들어 봅시다.
permalink : /tutorials/hyperledger-fabric/auth
author : marcushong
tags : hyperledger fabric
title\_background\_color : F1F71A
---

### 인증
express.js에서 Hyperledger Fabric 네트워크로 인증을 한 후 jwt 토큰을 response로 내려주는 어플리케이션을 만들어 보자.

### 설정
Hyperledger Fabric네트워크 설정을 json과 yaml로 설정 후 node.js 에서 초기화 시에 가져온다.

network.yaml
```yaml
name: "balance-transfer"
x-type: "hlfv1"
description: "Balance Transfer Network"
version: "1.0"
channels:
  mychannel:
    orderers:
      - orderer.example.com
    peers:
      peer0.org1.example.com:
        endorsingPeer: true
        chaincodeQuery: true
        ledgerQuery: true
        eventSource: true

      peer1.org1.example.com:
        endorsingPeer: false
        chaincodeQuery: true
        ledgerQuery: true
        eventSource: false

      peer0.org2.example.com:
        endorsingPeer: true
        chaincodeQuery: true
        ledgerQuery: true
        eventSource: true

      peer1.org2.example.com:
        endorsingPeer: false
        chaincodeQuery: true
        ledgerQuery: true
        eventSource: false

    chaincodes:
      - mycc:v0

organizations:
  Org1:
    mspid: Org1MSP

    peers:
      - peer0.org1.example.com
      - peer1.org1.example.com

    certificateAuthorities:
      - ca-org1

    adminPrivateKey:
      path: artifacts/channel/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/5890f0061619c06fb29dea8cb304edecc020fe63f41a6db109f1e227cc1cb2a8_sk
    signedCert:
      path: artifacts/channel/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/Admin@org1.example.com-cert.pem

  Org2:
    mspid: Org2MSP
    peers:
      - peer0.org2.example.com
      - peer1.org2.example.com
    certificateAuthorities:
      - ca-org2
    adminPrivateKey:
      path: artifacts/channel/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp/keystore/1995b11d6573ed3be52fcd7a5fa477bc0f183e1f5f398c8281d0ce7c2c75a076_sk
    signedCert:
      path: artifacts/channel/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp/signcerts/Admin@org2.example.com-cert.pem

orderers:
  orderer.example.com:
    url: grpcs://localhost:7050
    grpcOptions:
      ssl-target-name-override: orderer.example.com

    tlsCACerts:
      path: artifacts/channel/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/ca.crt

peers:
  peer0.org1.example.com:
    url: grpcs://localhost:7051

    grpcOptions:
      ssl-target-name-override: peer0.org1.example.com
    tlsCACerts:
      path: artifacts/channel/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt

  peer1.org1.example.com:
    url: grpcs://localhost:7056
    grpcOptions:
      ssl-target-name-override: peer1.org1.example.com
    tlsCACerts:
      path: artifacts/channel/crypto-config/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/ca.crt

  peer0.org2.example.com:
    url: grpcs://localhost:8051
    grpcOptions:
      ssl-target-name-override: peer0.org2.example.com
    tlsCACerts:
      path: artifacts/channel/crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt

  peer1.org2.example.com:
    url: grpcs://localhost:8056
    eventUrl: grpcs://localhost:8058
    grpcOptions:
      ssl-target-name-override: peer1.org2.example.com
    tlsCACerts:
      path: artifacts/channel/crypto-config/peerOrganizations/org2.example.com/peers/peer1.org2.example.com/tls/ca.crt

certificateAuthorities:
  ca-org1:
    url: https://localhost:7054
    httpOptions:
      verify: false
    tlsCACerts:
      path: artifacts/channel/crypto-config/peerOrganizations/org1.example.com/ca/ca.org1.example.com-cert.pem
    registrar:
      - enrollId: admin
        enrollSecret: adminpw
    caName: ca-org1

  ca-org2:
    url: https://localhost:8054
    httpOptions:
      verify: false
    tlsCACerts:
      path: artifacts/channel/crypto-config/peerOrganizations/org2.example.com/ca/ca.org2.example.com-cert.pem
    registrar:
      - enrollId: admin
        enrollSecret: adminpw
    caName: ca-org2

```


### express.js
```javascript
'use strict';
var log4js = require('log4js');
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var app = express();
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var bearerToken = require('express-bearer-token');
var cors = require('cors');
var hfc = require('fabric-client');
var logger = log4js.getLogger('Helper');
logger.setLevel('DEBUG');


var port = process.env.PORT || hfc.getConfigSetting('port');

app.options('*', cors());
app.use(cors());
//support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({
	extended: false
}));
// set secret variable
app.set('secret', 'thisismysecret');
app.use(expressJWT({
	secret: 'thisismysecret'
}).unless({
	path: ['/users']
}));
app.use(bearerToken());
app.use(function(req, res, next) {
	if (req.originalUrl.indexOf('/users') >= 0) {
		return next();
	}

	var token = req.token;
	jwt.verify(token, app.get('secret'), function(err, decoded) {
		if (err) {
			res.send({
				success: false,
				message: 'Failed to authenticate token. Make sure to include the ' +
					'token returned from /users call in the authorization header ' +
					' as a Bearer token'
			});
			return;
		} else {
			// add the decoded user name and org name to the request object
			// for the downstream code to use
			req.username = decoded.username;
			req.orgname = decoded.orgName;
			return next();
		}
	});
});

var server = http.createServer(app).listen(port, function() {});
server.timeout = 240000;

function getErrorMessage(field) {
	var response = {
		success: false,
		message: field + ' field is missing or Invalid in the request'
	};
	return response;
}

// Register and enroll user
app.post('/users', async function(req, res) {
	var username = req.body.username;
	var orgName = req.body.orgName;
	if (!username) {
		res.json(getErrorMessage('\'username\''));
		return;
	}
	if (!orgName) {
		res.json(getErrorMessage('\'orgName\''));
		return;
	}
	var token = jwt.sign({
		exp: Math.floor(Date.now() / 1000) + parseInt(hfc.getConfigSetting('jwt_expiretime')),
		username: username,
		orgName: orgName
	}, app.get('secret'));
	let response = await getRegisteredUser(username, orgName, true);
	if (response && typeof response !== 'string') {
		response.token = token;
		res.json(response);
	} else {
		res.json({success: false, message: response});
	}
});

var getRegisteredUser = async function(username, userOrg, isJson) {
	try {
		var client = await getClientForOrg(userOrg);
		logger.debug('Successfully initialized the credential stores');
			// client can now act as an agent for organization Org1
			// first check to see if the user is already enrolled
		var user = await client.getUserContext(username, true);
		if (user && user.isEnrolled()) {
			logger.info('Successfully loaded member from persistence');
		} else {
			// user was not enrolled, so we will need an admin user object to register
			logger.info('User %s was not enrolled, so we will need an admin user object to register',username);
			var admins = hfc.getConfigSetting('admins');
			let adminUserObj = await client.setUserContext({username: admins[0].username, password: admins[0].secret});
			let caClient = client.getCertificateAuthority();
			let secret = await caClient.register({
				enrollmentID: username,
				affiliation: userOrg.toLowerCase() + '.department1'
			}, adminUserObj);
			logger.debug('Successfully got the secret for user %s',username);
			user = await client.setUserContext({username:username, password:secret});
			logger.debug('Successfully enrolled username %s  and setUserContext on the client object', username);
		}
		if(user && user.isEnrolled) {
			if (isJson && isJson === true) {
				var response = {
					success: true,
					secret: user._enrollmentSecret,
					message: username + ' enrolled Successfully',
				};
				return response;
			}
		} else {
			throw new Error('User was not enrolled ');
		}
	} catch(error) {
		logger.error('Failed to get registered user: %s with error: %s', username, error.toString());
		return 'failed '+error.toString();
	}
};

async function getClientForOrg (userorg, username) {
	let config = '-connection-profile-path';
	let client = hfc.loadFromConfig(hfc.getConfigSetting('network'+config));
	client.loadFromConfig(hfc.getConfigSetting(userorg+config));
	await client.initCredentialStores();
	if(username) {
		let user = await client.getUserContext(username, true);
		if(!user) {
			throw new Error(util.format('User was not found :', username));
		} else {
			logger.debug('User %s was found to be registered and enrolled', username);
		}
	}
	logger.debug('getClientForOrg - ****** END %s %s \n\n', userorg, username)
	return client;
}

```

