---
layout : tutorials
category : tutorials
title : Hyperledger Fabric - 체인코드
subcategory : setlayout
summary : 체인코드를 api로 처리해 봅시다
permalink : /tutorials/hyperledger-fabric/chaincode
author : marcushong
tags : hyperledger fabric
title\_background\_color : F1F71A
---

### Chaincode
채널로 조인했으니 이제 체인코드로 데이터를 처리하는 것만 남았다.
체인코드는 install -> initiate -> invoke 순으로 진행해야 한다.

### Route
```javascript
app.post('/chaincodes', async function(req, res) {
	var peers = req.body.peers;
	var chaincodeName = req.body.chaincodeName;
	var chaincodePath = req.body.chaincodePath;
	var chaincodeVersion = req.body.chaincodeVersion;
	var chaincodeType = req.body.chaincodeType;
	if (!peers || peers.length == 0) {
		res.json(getErrorMessage('\'peers\''));
		return;
	}
	if (!chaincodeName) {
		res.json(getErrorMessage('\'chaincodeName\''));
		return;
	}
	if (!chaincodePath) {
		res.json(getErrorMessage('\'chaincodePath\''));
		return;
	}
	if (!chaincodeVersion) {
		res.json(getErrorMessage('\'chaincodeVersion\''));
		return;
	}
	if (!chaincodeType) {
		res.json(getErrorMessage('\'chaincodeType\''));
		return;
	}
	let message = await installChaincode(peers, chaincodeName, chaincodePath, chaincodeVersion, chaincodeType, req.username, req.orgname)
	res.send(message);});

app.post('/channels/:channelName/chaincodes', async function(req, res) {
	var peers = req.body.peers;
	var chaincodeName = req.body.chaincodeName;
	var chaincodeVersion = req.body.chaincodeVersion;
	var channelName = req.params.channelName;
	var chaincodeType = req.body.chaincodeType;
	var fcn = req.body.fcn;
	var args = req.body.args;
	if (!chaincodeName) {
		res.json(getErrorMessage('\'chaincodeName\''));
		return;
	}
	if (!chaincodeVersion) {
		res.json(getErrorMessage('\'chaincodeVersion\''));
		return;
	}
	if (!channelName) {
		res.json(getErrorMessage('\'channelName\''));
		return;
	}
	if (!chaincodeType) {
		res.json(getErrorMessage('\'chaincodeType\''));
		return;
	}
	if (!args) {
		res.json(getErrorMessage('\'args\''));
		return;
	}

	let message = await instantiate.instantiateChaincode(peers, channelName, chaincodeName, chaincodeVersion, chaincodeType, fcn, args, req.username, req.orgname);
	res.send(message);
});

app.post('/channels/:channelName/chaincodes/:chaincodeName', async function(req, res) {
	var peers = req.body.peers;
	var chaincodeName = req.params.chaincodeName;
	var channelName = req.params.channelName;
	var fcn = req.body.fcn;
	var args = req.body.args;
	if (!chaincodeName) {
		res.json(getErrorMessage('\'chaincodeName\''));
		return;
	}
	if (!channelName) {
		res.json(getErrorMessage('\'channelName\''));
		return;
	}
	if (!fcn) {
		res.json(getErrorMessage('\'fcn\''));
		return;
	}
	if (!args) {
		res.json(getErrorMessage('\'args\''));
		return;
	}

	let message = await invokeChaincode(peers, channelName, chaincodeName, fcn, args, req.username, req.orgname);
	res.send(message);
});

app.get('/channels/:channelName/chaincodes/:chaincodeName', async function(req, res) {
	var channelName = req.params.channelName;
	var chaincodeName = req.params.chaincodeName;
	let args = req.query.args;
	let fcn = req.query.fcn;
	let peer = req.query.peer;

	if (!chaincodeName) {
		res.json(getErrorMessage('\'chaincodeName\''));
		return;
	}
	if (!channelName) {
		res.json(getErrorMessage('\'channelName\''));
		return;
	}
	if (!fcn) {
		res.json(getErrorMessage('\'fcn\''));
		return;
	}
	if (!args) {
		res.json(getErrorMessage('\'args\''));
		return;
	}
	args = args.replace(/'/g, '"');
	args = JSON.parse(args);

	let message = await queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	res.send(message);
});

app.get('/chaincodes', async function(req, res) {
	var peer = req.query.peer;
	let message = await getInstalledChaincodes(peer, null, 'installed', req.username, req.orgname)
	res.send(message);
})
```

### Install Chaincode
```javascript
var installChaincode = async function(peers, chaincodeName, chaincodePath,
	chaincodeVersion, chaincodeType, username, org_name) {
	logger.debug('\n\n============ Install chaincode on organizations ============\n');
	let error_message = null;
	try {
		var client = await getClientForOrg(org_name, username);
		var request = {
			targets: peers,
			chaincodePath: chaincodePath,
			chaincodeId: chaincodeName,
			chaincodeVersion: chaincodeVersion,
			chaincodeType: chaincodeType
		};
		let results = await client.installChaincode(request);
		var proposalResponses = results[0];
		var proposal = results[1];

		var all_good = true;
		for (var i in proposalResponses) {
			let one_good = false;
			if (proposalResponses && proposalResponses[i].response &&
				proposalResponses[i].response.status === 200) {
				one_good = true;
			} 
			all_good = all_good & one_good;
		}
	} catch(error) {
		error_message = error.toString();
	}

	if (!error_message) {
		let message = 'Successfully installed chaincode';
		let response = {
			success: true,
			message: message
		};
		return response;
	} else {
		let message = util.format('Failed to install due to:%s',error_message);
		throw new Error(message);
	}
};
```

### Instantiate Chaincode
```javascript
var instantiateChaincode = async function(peers, channelName, chaincodeName, chaincodeVersion, functionName, chaincodeType, args, username, org_name) {
	var error_message = null;
	try {
		var client = await getClientForOrg(org_name, username);
		var channel = client.getChannel(channelName);
		if(!channel) {
			let message = `Channel ${channelName} was not defined in the connection profile`;
			throw new Error(message);
		}
		var tx_id = client.newTransactionID(true); 
		var deployId = tx_id.getTransactionID();

		var request = {
			targets : peers,
			chaincodeId: chaincodeName,
			chaincodeType: chaincodeType,
			chaincodeVersion: chaincodeVersion,
			args: args,
			txId: tx_id,
			'endorsement-policy': {
			        identities: [
					{ role: { name: 'member', mspId: 'Org1MSP' }},
					{ role: { name: 'member', mspId: 'Org2MSP' }}
			        ],
			        policy: {
					'2-of':[{ 'signed-by': 0 }, { 'signed-by': 1 }]
			        }
		        }
		};

		if (functionName)
			request.fcn = functionName;
		let results = await channel.sendInstantiateProposal(request, 60000); //instantiate takes much longer
		var proposalResponses = results[0];
		var proposal = results[1];
		var all_good = true;
		for (var i in proposalResponses) {
			let one_good = false;
			if (proposalResponses && proposalResponses[i].response &&
				proposalResponses[i].response.status === 200) {
				one_good = true;
			} 
			all_good = all_good & one_good;
		}

		if (all_good) {
			var promises = [];
			let event_hubs = channel.getChannelEventHubsForOrg();
			event_hubs.forEach((eh) => {
				let instantiateEventPromise = new Promise((resolve, reject) => {
					let event_timeout = setTimeout(() => {
						eh.disconnect();
					}, 60000);
					eh.registerTxEvent(deployId, (tx, code, block_num) => {
						clearTimeout(event_timeout);

						if (code !== 'VALID') {
							let message = 'The chaincode instantiate transaction was invalid, code: ' + code;
							reject(new Error(message));
						} else {
							let message = 'The chaincode instantiate transaction was valid.';
							resolve(message);
						}
					}, (err) => {
						clearTimeout(event_timeout);
						reject(err);
					},
						{unregister: true, disconnect: true}
					);
					eh.connect();
				});
				promises.push(instantiateEventPromise);
			});

			var orderer_request = {
				txId: tx_id,
				proposalResponses: proposalResponses,
				proposal: proposal
			};
			var sendPromise = channel.sendTransaction(orderer_request);
			promises.push(sendPromise);
			let results = await Promise.all(promises);
			let response = results.pop(); //  orderer results are last in the results
			if (response.status === 'SUCCESS') {
			} else {
				error_message = 'Failed to order the transaction. Error code: ' + response.status;
			}
			for(let i in results) {
				let event_hub_result = results[i];
				let event_hub = event_hubs[i];
				if(typeof event_hub_result === 'string') {
				} else {
					if(!error_message) error_message = event_hub_result.toString();
				}
			}
		} else {
			error_message = 'Failed to send Proposal and receive all good ProposalResponse';
		}
	} catch (error) {
		error_message = error.toString();
	}

	if (!error_message) {
		let message = `Successfully instantiate chaincode in organization ${org_name} to the channel ${channelName}`;
		let response = {
			success: true,
			message: message
		};
		return response;
	} else {
		let message = 'Failed to instantiate. cause:%s' + error_message;
		throw new Error(message);
	}
};
```

### Invoke Chaincode
```javascript
var invokeChaincode = async function(peerNames, channelName, chaincodeName, fcn, args, username, org_name) {
	var error_message = null;
	var tx_id_string = null;
	try {
		var client = await getClientForOrg(org_name, username);
		var channel = client.getChannel(channelName);
		if(!channel) {
			let message = `Channel ${channelName} was not defined in the connection profile`;
			throw new Error(message);
		}
		var tx_id = client.newTransactionID();
		tx_id_string = tx_id.getTransactionID();
		var request = {
			targets: peerNames,
			chaincodeId: chaincodeName,
			fcn: fcn,
			args: args,
			chainId: channelName,
			txId: tx_id
		};
		let results = await channel.sendTransactionProposal(request);

		var proposalResponses = results[0];
		var proposal = results[1];

		var all_good = true;
		for (var i in proposalResponses) {
			let one_good = false;
			if (proposalResponses && proposalResponses[i].response &&
				proposalResponses[i].response.status === 200) {
				one_good = true;
			} 
			all_good = all_good & one_good;
		}

		if (all_good) {
			var promises = [];
			let event_hubs = channel.getChannelEventHubsForOrg();
			event_hubs.forEach((eh) => {
				let invokeEventPromise = new Promise((resolve, reject) => {
					let event_timeout = setTimeout(() => {
						let message = 'REQUEST_TIMEOUT:' + eh.getPeerAddr();
						eh.disconnect();
					}, 3000);
					eh.registerTxEvent(tx_id_string, (tx, code, block_num) => {
						clearTimeout(event_timeout);

						if (code !== 'VALID') {
							let message = 'The invoke chaincode transaction was invalid, code: ' + code;
							reject(new Error(message));
						} else {
							let message = 'The invoke chaincode transaction was valid.';
							resolve(message);
						}
					}, (err) => {
						clearTimeout(event_timeout);
						reject(err);
					},
						{unregister: true, disconnect: true}
					);
					eh.connect();
				});
				promises.push(invokeEventPromise);
			});

			var orderer_request = {
				txId: tx_id,
				proposalResponses: proposalResponses,
				proposal: proposal
			};
			var sendPromise = channel.sendTransaction(orderer_request);
			promises.push(sendPromise);
			let results = await Promise.all(promises);
			let response = results.pop(); //  orderer results are last in the results
			if (response.status !== 'SUCCESS') {
			  error_message = 'Failed to order the transaction. Error code: ' + response.status;
			} 

			for(let i in results) {
				let event_hub_result = results[i];
				let event_hub = event_hubs[i];
				if(typeof event_hub_result === 'string') {
				} else {
					if(!error_message) error_message = event_hub_result.toString();
				}
			}
		} else {
			error_message = 'Failed to send Proposal and receive all good ProposalResponse';
			logger.debug(error_message);
		}
	} catch (error) {
		error_message = error.toString();
	}

	if (!error_message) {
	let message = `Successfully invoked the chaincode ${org_name} to the channel ${channelName} for transaction ID: ${tx_id_string}`;
		return tx_id_string;
	} else {
		let message = util.format('Failed to invoke chaincode. cause:%s',error_message);
		throw new Error(message);
	}
};
```

### Query Chaincode
```javascript
var queryChaincode = async function(peer, channelName, chaincodeName, args, fcn, username, org_name) {
	try {
		var client = await getClientForOrg(org_name, username);
		var channel = client.getChannel(channelName);
		if(!channel) {
			let message = 'Channel %s was not defined in the connection profile' + channelName;
			throw new Error(message);
		}

		// send query
		var request = {
			targets : [peer], //queryByChaincode allows for multiple targets
			chaincodeId: chaincodeName,
			fcn: fcn,
			args: args
		};
		let response_payloads = await channel.queryByChaincode(request);
		if (response_payloads) {
			return args[0]+' now has ' + response_payloads[0].toString('utf8') +
				' after the move';
		} else {
			return 'response_payloads is null';
		}
	} catch(error) {
		return error.toString();
	}
};

```

### Get All Chaincode
```javascript
var getInstalledChaincodes = async function(peer, channelName, type, username, org_name) {
	try {
		var client = await getClientForOrg(org_name, username);

		let response = null
		if (type === 'installed') {
			response = await client.queryInstalledChaincodes(peer, true); //use the admin identity
		} else {
			var channel = client.getChannel(channelName);
			if(!channel) {
				let message = 'Channel %s was not defined in the connection profile' + channelName;
				throw new Error(message);
			}
			response = await channel.queryInstantiatedChaincodes(peer, true); 
		}
		if (response) {
			var details = [];
			for (let i = 0; i < response.chaincodes.length; i++) {
				details.push('name: ' + response.chaincodes[i].name + ', version: ' +
					response.chaincodes[i].version + ', path: ' + response.chaincodes[i].path
				);
			}
			return details;
		} else {
			return 'response is null';
		}
	} catch(error) {
		return error.toString();
	}
};
```
