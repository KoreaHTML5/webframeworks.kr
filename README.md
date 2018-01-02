[WebFrameworks.kr](http://webframeworks.kr)
=================

Web Application 개발을 위해 필요한 지식과 정보를 공유하는 사이트 코드입니다. 
모든 코드는 공개되어 있으며 자신의 지식과 정보를 공유하고자하시는 분들은 Guideline에 맞추어 글을 작성하셔서 pull request를 남겨주시면 됩니다. 
아래 설명에 나오는 모든 실행 구문은 Linux/Mac등의 UNIX 환경에만 해당됩니다.

[웹프레임웍스 사이트 바로가기](http://webframeworks.kr)

# 필요사항

본 프로젝트를 구동하기 위해서는 아래의 것들이 우선적으로 설치되어 있어야합니다.

- [Node.js](http://nodejs.org/)
- [Ruby > 2.0.0](https://www.ruby-lang.org/ko/)
- [Bundler >= 1.12.5](http://bundler.io/)
- [gulp](http://gulpjs.com/)

# 실행방법

이 사이트는 ```Jekyll``` 기반의 사이트로 ```contents``` 아래의 여러 문서를 편집후에 확인을 위해서는 반드시 ```Jekyll``` 빌드를 하여야 합니다.
이때 라이브러리 의존성 문제로 인해 ```Bundler```를 사용하여 지킬을 실행합니다.
또한 node.js 기반의 웹서버와 Browsersync 를 활용한 ```serve``` 기능을 제공하여 바로바로 업데이트된 파일을 확인 할 수 있습니다. 
저희는 이 모든 작업을 ```gulp``` 작업관리자를 이용하여 개발과 배포에 필요한 자동화된 여러가지 작업을 제공합니다. 
자세한 사항은 각각의 작업을 참고하세요

## jekyll build

```contents``` 아래의 템플릿 파일과 작성된 markdown 글들은 아래 명령을 통해서 ```publish``` 디렉토리에 layout에 맞게 생성, 복사 되어 Web으로 노출될 페이지들을 생성합니다.
``` shell
$ gulp

또는

$ gulp jekyll
```
위의 명령으로 문제없이 모든 파일들이 ```publish``` 생성이 완료되면 간단한 웹서버를 사용해서 서비스를 구동 시킬수 있습니다. 

## gulp serve 명령을 통한 개발
```gulp serve``` 명령을 Browsersync 을 이용하여 사이트 개발을 통해서 문서나 어플리케이션의 변화를 감지하여 자동으로 Clean/Jekyll/Reload 작업을 통해서 변경 사항을 웹브라우저에 바로 반영 시켜줍니다. 
개발자는 별다른 추가 작업없이 자신의 변경사항을 바로 확인할 수 있습니다. 
```contents``` 아래의 문서파일(.md) 과 웹사이트 관련 파일들이 변경 감시의 대상이 됩니다. 
실행은 아래 명령으로 간단히 가능합니다.

``` shell
gulp serve
```

## github page 로 publish 하기
```gulp gh``` 명령은 빌드되어서 ```publish``` 에 있는 파일을 현재 github 저장소의 gh_page 브랜치로 바로 push 시켜줍니다.

## distribution (배포판) 패키지 만들기
```gulp dist``` 명령은 빌드/복사된 ```publish``` 파일과 ```node.js``` 기반의 어플리케이션 파일을 ```dist``` 아래에 복사하여 서버에서 바로 구동될 수 있는 패키지로 만들어 주는 명령입니다. 
복사된 파일을 서버에서 실제 서비스에 바로 사용될 수 있습니다.

# 글 작성 방법
[확인하기](CONTRIBUTE.md)

# 라이센스
[MIT license](LICENSE)

**많은 분들의 참여 부탁드리며, 문의사항은 [여기](https://www.facebook.com/groups/337590103082210/)로 남겨주시면 감사하겠습니다.**
