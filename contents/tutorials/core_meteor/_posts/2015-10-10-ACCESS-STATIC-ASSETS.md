---
layout : tutorials
title : 정적 자원의 접근. Assets를 사용해보자
category : tutorials
subcategory : data-binding
summary : Meteor의 Reactive 특성에 대해 알아보고 Reactive Data Source들을 이용하는 방법을 배워보자.
permalink : /tutorials/core_meteor/6_access_static_assets
title_background_color : 1C1C1F
title_color : E4E4E4
tags : javascript meteor package
author : acidsound
---
# [Core Meteor] 정적 자원의 접근. Assets를 사용해보자

서버 프로그래밍을 하다보면 파일 접근을 직접 해야할 경우가 생기는데
Meteor의 경우는 자동으로 전부 소스코드를 합치기 때문에 ```private``` 폴더 아래 넣어야 외부 노출을 피할 수 있다.

디렉토리 구조에 대한 자세한 설명은 [Structuring your application](http://docs.meteor.com/#/full/structuringyourapp) 내용을 참조하도록 하자.

그렇다면 priavte 파일 아래에 넣기만 하면 끝인가?

아니다.

개발시엔 ```.meteor``` 디렉토리 아래에 들어가지만 ```meteor build```한 이후의 경로가
달라지기 때문에 ```fs.read``` [(https://nodejs.org/api/fs.html#fs_fs_read_fd_buffer_offset_length_position_callback)](https://nodejs.org/api/fs.html#fs_fs_read_fd_buffer_offset_length_position_callback)
같은 방법으론 접근할 수 없다.

하지만, 걱정할 필요없다.

그래서 Assets 를 사용하면 된다.

Assets는 크게 두 가지 function을 가지고 있는데 하나 하나 보자.

## Assets.getText

```Assets.getText(assetPath, [asyncCallback])```

와 같은 형식으로 사용하고 당연히 서버에서만 사용 가능하다.

```Assets.getText(경로)``` 형태로만 쓰면 동기로 바로 반환값을 반환하며
```Assets.getText(경로), function(error, result) { ..callback... })``` 과 같이 callback을 사용하면 비동기로
파일을 읽고 난 후에 callback 부분을 실행한다.

*.csv, *.txt 같은 읽을 수 있는 파일들을 쓸때 사용한다.

대표적으로 Email Template 같은 게 좋은 예다.

```Email.send```[(http://docs.meteor.com/#/full/email_send)](http://docs.meteor.com/#/full/email_send) 로 서버에서 가입 축하 메일 같은 건 보낸다고 생각해보자.

```javascript
Email.send({
    to: 'alice@example.com',
    from : 'bob@example.com',
    subject: 'Hello from Meteor!',
    text: 'This is a test of Email.send.'
}
```

이런 형식이 될텐데 text 에 해당하는 내용을 *.txt 나 *.html 로 관리하면 편리할 것이다.

```private/mail/hello.html``` 이라고 만들고
이걸 불러와보자.

동기로 구현하면

```javascript
Email.send({
    to: sender,
    from: receiver,
    subject: title,
    text: Assets.getText('mail/hello.html')
})
```

비동기로 구현하면

```javascript
Assets.getText('mail/hello.html', function(error, result) {
    Email.send({
        to: sender,
        from: receiver,
        subject: title,
        text: result
    })
});
```

와 같이 작성한다.

## Assets.getBinary

```Assets.getText``` 와 거의 같은 데 *.xlsx 와 같이 직접 육안으로 읽을 수 없는 바이너리 파일을 다룰 때 사용한다.

전체적인 사용법은 같은데 반환형은 약간 주목해둘 필요가 있다.

```EJSON.binary```[(http://docs.meteor.com/#/full/ejson_new_binary)](http://docs.meteor.com/#/full/ejson_new_binary)라는 형식인데

실제로 사용할 경우 ```new Buffer```로 초기화해서 쓰는 것을 권장한다.

가령 **netanelgilad:excel** [(https://atmospherejs.com/netanelgilad/excel)](https://atmospherejs.com/netanelgilad/excel) 패키지 같은 것을 사용할 때

예제에 있는 것 처럼

```javascript
var workbook = excel.readFile( basepath+'yourFilesFoler/someExcelFile.xls');
```

이런 식으로 사용하면 안되며.

위에서 언급한 것 처럼 **basepath**는 개발/빌드 환경에 따라 얼마든지 달라질 수 있기 때문이다.

```javascript
var workbook = excel.read(new Buffer(Assets.getBinary("yourFilesFoler/someExcelFile.xlsx")));
```

이와 같이 사용하여야 올바른 결과물을 얻을 수 있으니 주의하자.