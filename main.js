/**
 * Created with JetBrains WebStorm.
 * User: leewonjae
 * Date: 2014. 6. 9.
 * Time: 오전 11:54
 * To change this template use File | Settings | File Templates.
 */
var WEB_SERVER_PORT = 80;

var express = require('express');
var fs = require('fs');
var app = express();

setRoute('/');
setRoute('/getstarted');
setRoute('/search');
setRoute('/tutorials');
setRoute('/updates');

var headers = {};
headers['Content-Type'] = 'text/html';

function setRoute(path_){
	var filePath = "pages/"+path_+"/index.html";
	app.get(path_, function(req_, res_){
		fs.readFile(filePath, function(err_, data_){
			if(err_){
				res_.send("error!"+err_);
			}else{
				res_.writeHead(200, headers);
				res_.end(""+data_);
			}
		});
	});
}

app.listen(WEB_SERVER_PORT);

console.log("WebServer is listening : "+WEB_SERVER_PORT);