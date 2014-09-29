---
layout : getstarted
title : Grunt and Gulp
category : getstarted
subcategory : tool
summary : 빌드시스템인 Grunt 와 Gulp 에 대한 소개와 사용법에 대해서 알아봅니다. 현재 개발중인 프로젝트에 빌드 시스템을 적용하여 여러가지 빌드에 관련된 작업을 간단하게 처리 할 수 있습니다.
permalink : /getstarted/grunt-and-gulp
title_background_color : FEFEFE
tags : grunt gulp build yeoman
author : ragingwind
---

# Grunt and Gulp, Build your project

웹 개발, 특히 프론트엔드 개발의 트렌드는 굉장히 빠르게 진행되고 있습니다. 다양한 기술, 테그닉이 만들어지고 그에 따라서 다양한 개발툴들이 개발되고 있습니다. 웹브라우즈에 로딩되기전에 소스의 문법을 검사하거나 SASS, Coffee-script 와 같은 컴파일이 필요한 언어나 프레임워크, 퍼포먼스를 위해서 이미지나 파일의 최적화를 도와주고 테스트 작업을 자동화를 도와줍니다. 많은 부분에서 자동화를 요구하게 되었고 점점 더 발전하여 프론트엔드 개발에서도 `빌드과정(Build process)`이 필요하게 되었으며 이를 맡아줄 빌드 시스템이 필요하게 되었습니다. `빌드과정`은 크게 아래와 같은 `테스크(task)` 로 이루어져 있습니다.

- concat(enate): 여러개로 나누어진 관련된 파일을 병합한다.
- lint: 빌드과정에서 문법과 코딩스타일의 오류를 잡아낸다.
- mifify/unglify: 특히 Javascript 파일의 최적화를 도와준다. 자세한 사항은 [위키피디아의 Minification](http://goo.gl/V3Emke) 을 참고한다.
- image optimization: 이미지 최적화툴 사용의 자동화를 도와준다.
- testing: jasmine, mocha 와 같은 테스팅의 자동화를 도와준다.
- watch: 파일의 변경사항을 추적해서 추가 작업을 지정한다.
- serve/preview: 내장된 서버와 Livereload / Browsersync 와 같은 툴을 이용해서 자동으로 리로딩 하여 변경된 사항을 바로 볼 수 있다.

지금은 크게 [Grunt](http://goo.gl/pTSlf) 와 [Gulp](http://goo.gl/2OPX57) 가 사용되어지고 있습니다. Grunt 는 jQuery plugins 개발을 손쉽게 하려는 노력에서 개발되었으며 현재 많은 프론트엔드, Nodejs 프로젝트에서 사용중입니다. Gulp 의 경우 상대적으로 Grunt 에 비해서 발표된 기간은 짧지만 빠르게 성장하는 프로젝트입니다. 이 문서에서는 각 `빌드` 시스템에 대한 소개와 간단한 사용법을 알아보도록 하겠습니다.

## Prerequirements

여기에 소개되는 모든 툴은 Nodejs 를 기본으로 사용하고 있습니다. Nodejs 를 최신으로 먼저 설치하세요. 설치후 아래 명령을 통해서 버전을 검사합니다.

```
# node 는 v0.10.1 이상, npm 은 v1.4.x 를 권장합니다.
node --version && npm --version
```
## Grunt and Gulp installation

Nodejs 를 설치하셨다면 Grunt 와 Gulp 를 먼저 시스템에 설치합니다. 설치한 다음 버전을 확인하도록 합니다.

```
# 현재는 같이 설치하지만 필요에 따라서 따로 설치하셔도 됩니다. 이미 설치하셨다면 update 를 통해서 최신 버전을 설치하세요.
npm install -g grunt-cli gulp

# gulp 경우 global / local 버전이 따로 존재 함으로 두개가 보입니다.
grunt --version && gulp --version
```

## [Grunt](http://goo.gl/pTSlf)

### Grunt 의 동작

이 문서에서 다루는 Grunt 는 버전 0.4 를 다룹니다. 0.4 버전 부터는 Nodejs 의 `require()` 명령을 통해서 현재 로컬에 설치된 grunt 를 실행시키는 구조로 되어 있습니다. 이유는 여러버전의 grunt 의 기능을 잘 지원하기 위함입니다. Grunt CLI 에서 실행된 grunt 는 Gruntfile.js 를 로드하여 동작하도록 되어 있습니다.

### Grunt 프로젝트

Grunt 는 각각의 프로젝트별로 특정 버전의 로컬 `grunt 러너 (runner)` 가 설치되어야 합니다. 또한 사용되는 테스크별로 Grunt 플러그인(plugin) 을 설치하거나 package.json 을 통해서 Grunt 에서 사용하는 플러그인을 설치 할 수 있도록 package.json[1] 을 제공해야 합니다. package.json 이 존재한다면 특정 버전의 Grunt 와 플러그 인을 ```npm install``` 명령을 통해서 설치하도록 합니다. 만약 새로운 프로젝트 라면 ```npm install grunt-PLUGINS --save-dev``` 명령을 통하여 설치 할 수 있습니다. 아래는 package.json 의 예제입니다. grunt 는 0.4.5 버전 이상을 사용하며 jshint, nodeunit, uglify Grunt 플러그인을 사용하고 있습니다.

```
{
  "name": "my-project-name",
  "version": "0.1.0",
  "devDependencies": {
    "grunt": "~0.4.5",
    "grunt-contrib-jshint": "~0.10.0",
    "grunt-contrib-nodeunit": "~0.4.1",
    "grunt-contrib-uglify": "~0.5.0"
  }
}
```

package.json 에 대해서 추가적인 정보는 아래 자료를 참고하세요.

- [package.json으로 npm 의존성 모듈 관리하기 :: Outsider's Dev Story](http://goo.gl/Ku6ggw)

### Grunt 플러그인 (Plugins)

Grunt 는 자체에는 내장된 테스크가 없습니다. 모두 외부 플러그인을 통해서 설치하셔야 합니다. Grunt 를 사용하는 존재하는 프로젝트에는 반드시 package.json 이 있으며 사용된 플러그인의 종류를 알 수 있으며 ```npm install``` 명령을 통해서 설치가 가능합니다. 현재 개발되어 사용되는 플러그인 들은 아래 페이지에서 찾을 수 있습니다. 플러그인 이름에 `contrib` 가 존재한다면 해당 커뮤니티에서 관리하는 신뢰성이 높은 플러그인입니다.

- [Plugins - Grunt: The JavaScript Task Runner](http://goo.gl/WXA85)

### Gruntfile.js

Grunt 는 Gruntfile.js 파일안의 설정에 기반하여 동작하는 ``테스크러너 (Javascript task runner)` 입니다. 로컬 grunt 러너와 플러그인을 설치하였다면 원하는 작업을 Gruntfile.js 에 설정해서 사용할 수 있습니다. Gruntfile.js 는 프로젝트의 루트에 존재하고 아래처럼 구성되어 있습니다.

- "wrapper" function
- 프로젝트와 테스크 설정
- 플러그인 로딩
- 커스텀 테스크

아래 Gruntfile.js 예제를 통해서 각 구성요소들에 대해서 자세히 설명하도록 하겠습니다.

```
// "wrapper" function
module.exports = function(grunt) {

  // 프로젝트 설정
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    }
  });

  // uglify 플러그인 로딩
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Grunt 기본 테스트(Default task)
  grunt.registerTask('default', ['uglify']);
};
```

#### "wrapper" function

모든 Gruntfile.js 에는 기본적으로 아래 코드가 들어가 있습니다. Grunt 관련 코드는 아래 함수 안에 반드시 구현되어야 합니다.

```
module.exports = function(grunt) {
  // 여기에 Grunt 코드 구현
};
```

#### 프로젝트와 테스크 설정

Grunt 설정은 ```grunt.initConfig``` 함수에 오브젝트 형태로 전달됩니다. 샘플에서와 같이 ```grunt.initConfig``` 함수의 인자에 있는 오브젝트를 보면 `pkg` 필드에 Grunt API 인 ```grunt.file.readJSON``` 를 이용하여 package.json 읽어 들여서 얻은 메타데이터를 저장합니다. Grunt API 에 대해서 더 자세한 사항은 아래 자료를 참고하세요.

- [grunt - Grunt: The JavaScript Task Runner](http://goo.gl/uUm2hq)

예제에 설정된 테스트는 ```grunt-contrib-uglify``` 입니다. ```uglify``` 테스크를 예제처럼 설정하고 Grunt 를 실행하면 ```uglify``` 테스크는 Javascript 코드를 압축하거나 변수이름과 같은 코드를 짧게 만들어서 코드의 양을 줄여주는 작업을 실행합니다. ```uglify``` 테스크는 테스크내에 전역적인 `options` 를 가지고 있으며 하나의 `build` 라는 타겟(target) 으로 구성되어 있습니다. `build` 타켓 설정에는 ```uglify``` 테스크 실행시에 필요한 소스파일 (src) 과 저장할 대상파일 (dest) 에 대한 경로값을 가지고 있습니다. `pkg` 에 존재하는 메타데이터에서 `name` 값을 이용하고 있습니다. 예제에서는 `banner`(소스파일 상단에 문구추가)을 추가로 진행합니다.

#### 플러그인 로딩

설정된 테스크들이 실행이 되려면 설치된 플러그인을 로딩하는 작업을 추가 해야 합니다. ```npm install`` 을 통해서 설치가 되어 있어야 하고 아래 Grunt API 로 불러 올 수 있습니다.

```
grunt.loadNpmTasks('grunt-contrib-uglify');
```

#### 커스텀 테스크

Gruntfile.js 에 존재하는 모든 테스크들은 Grunt 플러그인(plugins) 과 `커스텀 테스트(Custom task)` 두가지로 구성됩니다. 이후 ```grunt``` 또는 ```grunt 테스크이름``` 같은 형태로 Grunt 테스크를 실행 시킬 수 있습니다. 테스크 이름이 없이 실행한다면 Grunt 는 `default` 테스크를 찾아 실행 할 것입니다.

```
## default grunt task 실행
grunt

## 특정 grunt task 실행
grunt uglify
```

커스텀 테스크는 ```grunt.registerTask``` API 를 통해서 추가가 가능합니다. 예제에서는 ```default``` 커스텀 테스트를 아래처럼 구현했으며 실제로는 ```grunt uglify``` 와 동일한 작업을 수행합니다.

```
grunt.registerTask('default', ['uglify']);
```

또한 커스텀 테스크는 설정된 테스크외에 아래처럼 함수객체를 인자로 받는 형태로도 구성이 가능합니다. 여러가지 조건에 따라서 실행 할 수 있는 커스텀 테스크를 만들 수가 있습니다. 아래 코드로 등록된 테스크는 ```grunt log``` 로 실행 가능합니다.

```
grunt.registerTask('log', 'Log some stuff.', function() {
    grunt.log.write('Logging some stuff...').ok();
  });
```

## [Gulp](http://goo.gl/pTSlf)

### Gulp vs Grunt

Gulp 는 Nodejs 의 `스트림(Stream)` 을 기반으로 하는 빌드시스템입니다. 예를 들어서 읽어들인 파일의 내용을 `pipe` 로 바로 다른 테스크에 전달이 가능한 구조입니다. (Grunt 0.5 에서는 Grunt 도 변경될 예정입니다.) 또 다른 차이점은 설정 기반이 아니라 Javascript (Nodejs) 코드로 테스크의 작업을 실행 시킬수 있습니다. 작업이 많아지게 되면 복잡도가 많이 올라가는 설정파일 기반의  Grunt 와 달리 Gulp 는 Javascript (Nodejs) 코딩을 할 줄 아는 사람이면 쉽게 접근할 수 있는 것이 장점입니다. 또한 Grunt 는 내장된 테스크가 없는 반면에 Gulp 는 기본적인 테스크에 대해서는 지원합니다. 따라서 전역으로 설치하였다면 별도의 설치과정이 필요 없습니다.

아래 예제는 각각의 빌드 시스템에서 사용되는 테스크 관련 파일입니다. `less` 와 `autoprefixer` 작업들을 실행하는 것을 유의해서 비교해 보세요. 먼저 Gruntfile.js 입니다.

```
// Gruntfile.js
grunt.initConfig({
   less: {
      development: {
         files: {
            "build/tmp/app.css": "assets/app.less"
         }
      }
   },

   autoprefixer: {
      options: {
         browsers: ['last 2 version', 'ie 8', 'ie 9']
      },
      multiple_files: {
         expand: true,
         flatten: true,
         src: 'build/tmp/app.css',
         dest: 'build/'
      }
   }
});

grunt.loadNpmTasks('grunt-contrib-less');
grunt.loadNpmTasks('grunt-autoprefixer');

grunt.registerTask('css', ['less', 'autoprefixer']);
```

다음은 Gulp 에서 사용하는 gulpfile.js 입니다. Nodejs 코드와 동일한 것을 알 수 있습니다.
```
var gulp = require('gulp'),
var less = require('gulp-less'),
var autoprefix = require('gulp-autoprefixer');

gulp.task('css', function () {
   gulp.src('assets/app.less')
      .pipe(less())
      .pipe(autoprefix('last 2 version', 'ie 8', 'ie 9'))
      .pipe(gulp.dest('build'));
});
```


#### gulpfile.js

Gulp 도 Gruntfile.js 와 같이 실행될 테스크가 명시되어 있는 파일이 필요합니다. gulpfile.js 라고 불리며 프로젝트의 루트에 존재하여야 합니다. 아래는 간단한 gulpfile.js 의 예제입니다.

```
var gulp = require('gulp');

gulp.task('default', function() {
  // 여기에 default 테스크 코드를 작성합니다.
});
```

Nodejs 코드와 같이 `gulp` 를 로딩하고 `gulp.task` API 를 통해서 테스크를 등록하고 있습니다. 더 자세한 API 는 아래 자료를 참고하세요.

- [gulp/API.md at master · gulpjs/gulp](http://goo.gl/p8K32Q)

### Gulp 실행

gulp 를 실행 시키기 위해서는 Grunt 와 동일한 방식을 아래 처럼 사용합니다.

```
# default 테스크 호출
gulp

# uglify 테스크 호출
gulp uglify
```

### Gulp 테스크 구현하기

이제 좀 더 복잡한 테스크를 구현해 보겠습니다. Grunt 에서 보았던 uglify 라는 작업을 해보도록 하겠습니다. 여기서도 추가 플로그인을 위해서는 `npm` 명령을 통해서 설치합니다. Gulp 플러그인은 `gulp-` prefix 로 시작합니다.

```
npm install --save-dev gulp-uglify
```

다음 gulpfile.js 를 아래처럼 코딩 합니다.

```
'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');

// package.json 에서 name 을 읽어 들이는 함수를 선언
var getProjectName = function() {
  require('./package.json').name;
};

// uglify 테스크 구현
gulp.task('uglify', function() {
  var name = getProjectName();

  return gulp.src('src/' + name + '.js')
      .pipe(uglify({mangle: false}))
      .pipe(gulp.dest('build/' + name + '.min.js'));
  };
});

// default 테스크
gulp.task('default', ['uglify']);

```
gulpfile.js 는 Nodejs 소스코드와 동일합니다. Grunt 에서 사용한 템플릿변수와 init 과정에서 설정값을 넘기는 것과 다르게 `require()` 를 사용하여 플러그인을 로딩하고 일반 함수를 선언할 수 있으며 Nodejs 의 Stream 을 이용해서 테스크의 과정을 구현합니다. 위에 코드에서는 `gulp.src` 를 통해서 정해진 소스파일을 읽어서 `uglify()` 테스크로 `gulp.pipe` 를 이용하여 스트림을 넘깁니다. `uglify` 테스크 수행후에 최종적으로 `gulp.dest` 에서 대상파일을 쓰게 됩니다.

좀 더 다양한 예제는 아래 자료를 참고하세요.

- [gulp/docs/recipes at master · gulpjs/gulp](http://goo.gl/u7xjlk)

### Gulp or Grunt?

현재 gulp 는 여러 추가 플러그인이 개발되었지만 아직은 Grunt 에 비해서 충분히 보급되거나 커뮤니티가 확장되지 않고 문서화가 잘 이루어지지 상황입니다. 하지만 [Yeoman](http://goo.gl/zgpqqA) 과 [Web Starter Kit](http://goo.gl/YNV3lb) 에 사용되고 있고 앞으로 다른 프로젝트에서도 사용될 것임으로 익혀두는 것이 좋을 것입니다. [이 사이트의 Starter Kits 에서는 두가지 버전을 모두 제공하고 있습니다.]

## References

- [Getting started - Grunt: The JavaScript Task Runner](http://goo.gl/agi7g)
- [gulp/getting-started.md at master · gulpjs/gulp](http://goo.gl/rzpTVZ)
- [Build Wars: Gulp vs Grunt](http://goo.gl/fcaOPF)
- [Building With Gulp | Smashing Magazine](http://goo.gl/cZ3bHS)
