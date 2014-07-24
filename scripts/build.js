var fs = require('fs');

parse(fs, 'contents', '../template/new.html');

function parse(fs_, rootDir_, templateFile_){
	fs_.readdir(rootDir_,function(err_, files_){
		if(files_){
			for(var file in files_){
				var name = files_[file];
				checkDirOrNot(fs_, rootDir_+'/'+name, templateFile_);
			}
		}

	});
}

function checkDirOrNot(fs_, rootDir_, templateFile_){
	fs_.stat(rootDir_, function(err_, stats_){
		if(stats_){
			if(stats_.isFile()){
				parseFileToTemplate(fs_, rootDir_, templateFile_);
			}else{
				parse(fs_, rootDir_, templateFile_);
			}
		}
	});
}

function parseFileToTemplate(fs_, fileURL_, templateFile_){
	fs_.readFileSync(fileURL_, {encoding:'utf8'}, function(err,data){
		console.log(data);
	})
}

