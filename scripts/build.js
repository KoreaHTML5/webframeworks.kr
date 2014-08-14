var fs = require('fs');
var mkdirp = require('mkdirp');
var ncp = require('ncp').ncp;

var TARGET_URL = '/../pages';
var SOURCE_URL = '/../contents';

//folder 내부 검색 index.html을 확인해서 template를 입혀야하는 경우에는 해당 template 적용
function searchIndex(rootDir_, callback_){
	console.log('searchIndex : '+rootDir_);

	fs.readdir(__dirname+SOURCE_URL+rootDir_,function(err_, files_){
		if(files_){
			for(var file in files_){
				var name = files_[file];
				if(name == 'index.html'){
					callback_(true, rootDir_, files_);
					return;
				}else if(name == 'static'){
					continue;
				}
			}
			callback_(false, rootDir_, files_);
		}else{
			console.log(err_);
		}
	});
}

function checkIsDir(rootDir_,  callback_){
	fs.stat(__dirname+'/'+SOURCE_URL+rootDir_, function(err_, stats_){
		if(stats_){
			callback_(!stats_.isFile(), rootDir_);
		}
	});
}

function startParse(){
	var searchCallback = function(hasIndex_, rootDir_, files_){
		if(hasIndex_){
			parseIndex(rootDir_)
		}

		if(files_){
			for(var file in files_){
				var name = files_[file];
				if(name != 'index.html' && name != 'static'){
					checkIsDir(rootDir_+'/'+name, function(isDir_, retDir_){
						if(isDir_){
							searchIndex(retDir_, searchCallback);
						}else{
							copyFile(retDir_);
						}
					});
				}
			}
		}

	};

	searchIndex('/', searchCallback);
}


function parseIndex(indexDirURL_){
	console.log('parseIndex : '+indexDirURL_+'/index.html');
	copyFile(indexDirURL_+'/index.html')
	copyFolder(indexDirURL_+'/static');
}

function copyFolder(rootDir_){
	var srcURL = __dirname+SOURCE_URL+rootDir_;
	var targetURL = __dirname+TARGET_URL+rootDir_;

	console.log('mkdirs!-->'+targetURL);

	fs.exists(srcURL,function(exists_){
		if(exists_){
			mkdirp(targetURL, function(mkErr_){
				if(mkErr_){
					console.error('Failed to mkdir : '+mkErr_);
				}else{
					ncp(srcURL, targetURL, function(err_){
						if(err_){
							console.error(err_);
						}else{
							console.log('copy folder from : '+srcURL+' to : '+targetURL);
						}
					});
				}
			});
		}else{
			console.log('skip the copy : '+rootDir_);
		}
	});

}

function copyFile(rootDir_){
	var srcURL = __dirname+SOURCE_URL+rootDir_;
	var targetURL = __dirname+TARGET_URL+rootDir_;
	var lastIdx = targetURL.lastIndexOf('/');

	console.log('src?['+srcURL+']');
	console.log('mkdir!!->'+targetURL.substr(0, lastIdx));

	mkdirp(targetURL.substr(0, lastIdx), function(mkErr_){
		if(mkErr_){
			console.error('Failed to mkdir : '+mkErr_);
		}else{
			ncp(srcURL, targetURL, function(err_){
				if(err_){
					console.error(err_);
				}else{
					console.log('copy file from : '+srcURL+' to : '+targetURL);
				}
			});
		}
	});


}

startParse(SOURCE_URL);