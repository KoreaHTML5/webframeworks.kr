---
layout : tutorials
category : tutorials
title : Hyperledger Fabric - 채널
subcategory : setlayout
summary : 정보를 공유할 수 있는 채널을 api로 만들어 봅시다.
permalink : /tutorials/hyperledger-fabric/channel
author : marcushong
tags : hyperledger fabric
title\_background\_color : F1F71A
---

### Channel
기관을 생성했다고 끝이 아니다.
기관을 생성한 후 채널을 생성. 그리고 그 채널에 조인을 완료해야 체인코드로 접근이 가능하다.
express.js로 체인코드를 생성, 조인하는 것을 만들어보자.

### Route
```javascript
app.post('/channels', async function(req, res) {
	var channelName = req.body.channelName;
	var channelConfigPath = req.body.channelConfigPath;
	if (!channelName) {
		res.json(getErrorMessage('\'channelName\''));
		return;
	}
	if (!channelConfigPath) {
		res.json(getErrorMessage('\'channelConfigPath\''));
		return;
	}
	let message = await createChannel(channelName, channelConfigPath, req.username, req.orgname);
	res.send(message);
});

app.post('/channels/:channelName/peers', async function(req, res) {
	var channelName = req.params.channelName;
	var peers = req.body.peers;
	if (!channelName) {
		res.json(getErrorMessage('\'channelName\''));
		return;
	}
	if (!peers || peers.length == 0) {
		res.json(getErrorMessage('\'peers\''));
		return;
	}

	let message =  await joinChannel(channelName, peers, req.username, req.orgname);
	res.send(message);
});

app.get('/channels', async function(req, res) {
	var peer = req.query.peer;
	if (!peer) {
		res.json(getErrorMessage('\'peer\''));
		return;
	}

	let message = await getChannels(peer, req.username, req.orgname);
	res.send(message);
});
```

### Create Channel
```javascript
var createChannel = async function(channelName, channelConfigPath, username, orgName) {
	try {
		var client = await getClientForOrg(orgName);
		var envelope = fs.readFileSync(path.join(__dirname, channelConfigPath));
		var channelConfig = client.extractChannelConfig(envelope);
		let signature = client.signChannelConfig(channelConfig);

		let request = {
			config: channelConfig,
			signatures: [signature],
			name: channelName,
			txId: client.newTransactionID(true) // get an admin based transactionID
		};

		// send to orderer
		var response = await client.createChannel(request)
		if (response && response.status === 'SUCCESS') {
			let response = {
				success: true,
				message: 'Channel \'' + channelName + '\' created Successfully'
			};
			return response;
		} else {
			throw new Error('Failed to create the channel \'' + channelName + '\'');
		}
	} catch (err) {
		throw new Error('Failed to initialize the channel: ' + err.toString());
	}
};
```

### Join Channel
```javascript
var joinChannel = async function(channel_name, peers, username, org_name) {
	var error_message = null;
	var all_eventhubs = [];
	try {
		var client = await helper.getClientForOrg(org_name, username);
		var channel = client.getChannel(channel_name);
		if(!channel) {
			let message = `Channel ${channel_name} was not defined in the connection profile`;
			throw new Error(message);
		}

		let request = {
			txId : 	client.newTransactionID(true) //get an admin based transactionID
		};
		let genesis_block = await channel.getGenesisBlock(request);

		var promises = [];
		promises.push(new Promise(resolve => setTimeout(resolve, 10000)));

		let join_request = {
			targets: peers, //using the peer names which only is allowed when a connection profile is loaded
			txId: client.newTransactionID(true), //get an admin based transactionID
			block: genesis_block
		};
		let join_promise = channel.joinChannel(join_request);
		promises.push(join_promise);
		let results = await Promise.all(promises);
		let peers_results = results.pop();
		for(let i in peers_results) {
			let peer_result = peers_results[i];
			if(peer_result.response && peer_result.response.status == 200) {
			} else {
				let message = 'Failed to join peer to the channel ' + channel_name;
				error_message = message;
			}
		}
	} catch(error) {
		error_message = error.toString();
	}

	all_eventhubs.forEach((eh) => {
		eh.disconnect();
	});

	if (!error_message) {
		let message = `Successfully joined peers in organization ${org_name} to the channel:${channel_name}`;
		let response = {
			success: true,
			message: message
		};
		return response;
	} else {
		let message = 'Failed to join all peers to channel. cause:' + error_message;
		throw new Error(message);
	}
};

```

### Get Channels
```javascript
var getChannels = async function(peer, username, org_name) {
	try {
		var client = await getClientForOrg(org_name, username);

		let response = await client.queryChannels(peer);
		if (response) {
			var channelNames = [];
			for (let i = 0; i < response.channels.length; i++) {
				channelNames.push('channel id: ' + response.channels[i].channel_id);
			}
			return response;
		} else {
			return 'response_payloads is null';
		}
	} catch(error) {
		return error.toString();
	}
};
```
