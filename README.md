dev.koreahtml5.kr
=================

Web Front-end 개발을 위해 필요한 지식과 정보를 공유하는 사이트 코드입니다.
모든 코드는 공개되어 있으며 자신의 지식과 정보를 공유하고자하시는 분들은 Guideline에 맞추어 글을 작성하셔서 pull request를 남겨주시면 됩니다.

아래 설명에 나오는 모든 실행 구문은 Linux/Mac등의 UNIX 환경에만 해당됩니다.

# 필요사항
본 프로젝트를 구동하기 위해서는 아래의 것들이 우선적으로 설치되어 있어야합니다.
- [Node.js](http://nodejs.org/)
- [Ruby > 2.0.0](https://www.ruby-lang.org/ko/)
- [Jekyll > 2.1.2](http://jekyllrb.com/)
- [gulp](http://gulpjs.com/)

# 실행방법
아래의 명령을 실행하여 Web으로 노출될 페이지들을 생성합니다.
``` shell
# 작성된 markdown 글을 layout에 맞게 생성합니다.
$ gulp
```

애러없이 생성이 완료되면 개발용 또는 배포용으로 서버를 실행할 수 있습니다.
개발용으로 실행된 경우에는 8888 포트로 실행이되어 http://localhost:8888 로 웹사이트가 열립니다.

``` shell
# 웹서버를 개발용 실행합니다.
$ ./run.sh
```

배포용으로 실행된 경우에는 80 포트로 실행이되어 http://localhost 또는 http://domain 으로 웹사이트가 열립니다.
``` shell
# 웹서버를 배포용으로 실행합니다. - super user 권한이 필요합니다.
$ ./run.sh deploy
```

# 글 작성 방법
TBD

# 라이센스
TBD
