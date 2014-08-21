/**
 * Created with JetBrains WebStorm.
 * User: leewonjae
 * Date: 2014. 6. 9.
 * Time: 오전 11:54
 * To change this template use File | Settings | File Templates.
 */
var WEB_SERVER_PORT = process.env.PORT || 80;

var express = require('express');
var fs = require('fs');
var app = express();
var basepath = __dirname + '/..';

parseRoute('/');

function setRoute(path_){
	console.log('setRoute['+path_+']');

	if(path_ == '/'){
		path_ = '';
	}

	app.use(path_, express.static(basepath+'/publish'+path_));
	app.use(path_+'/js', express.static(basepath+'/publish'+path_+'/static/js'));
	app.use(path_+'/css', express.static(basepath+'/publish'+path_+'/static/css'));
	app.use(path_+'/fonts', express.static(basepath+'/publish'+path_+'/static/fonts'));
	app.use(path_+'/img', express.static(basepath+'/publish'+path_+'/static/img'));

}

function parseRoute(rootDir_){
	fs.readdir(basepath+'/publish/'+rootDir_,function(err_, files_){
		if(files_){
			for(var file in files_){
				var name = files_[file];
				if(name == 'index.html'){
					setRoute(rootDir_);
				}else{
					checkIsDir(basepath+'/publish', rootDir_+name, function(isDir_, name_){
						if(isDir_){
							parseRoute(name_+'/');
						}
					});
				}

			}
		}
	});
}

function checkIsDir(rootDir_, name_,  callback_){
//	console.log('checkIsDir['+rootDir_+name_+']');

	fs.stat(rootDir_+name_, function(err_, stats_){
		if(stats_){
			callback_(!stats_.isFile(), name_);
		}
	});
}

app.listen(WEB_SERVER_PORT);

console.log("WebServer is listening : "+WEB_SERVER_PORT);
