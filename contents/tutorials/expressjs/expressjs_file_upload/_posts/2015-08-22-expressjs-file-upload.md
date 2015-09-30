---
layout : tutorials
title : ExpressJS에서 이미지파일을 업로드하고 가공하는 방법
category : tutorials
subcategory : data-input
summary : 서버에 이미지파일을 업로드하고, 이미지 리사이징, 메타정보 제거, 블러링등의 가공을 하는 방법에 대해 알아봅니다.
permalink : /tutorials/expressjs/expressjs_file_upload
title_background_color : DD1B16
title_color : FFFFFF
tags : javascript framework expressjs tutorials file
author : 6pack
---
# ExpressJS에서 이미지파일을 업로드하고 가공하는 방법

웹페이지에서 이미지를 업로드하는 건 우리가 쉽게 볼 수 있는 기능 중에 하나입니다. 이번 튜토리얼에서는 웹페이이지에서 이미지파일을 업로드하고 리사이징등 몇가지 추가 기능을 구현하는 방법에 대해서 알아보도록 하겠습니다.
웹에서 파일 업로드하는 방법에는 아래의 두 가지 방식이 있습니다.

* applecation/x-www-urlencoded
* multipart/form-data

전자의 경우 인코딩으로 인한 성능 이슈가 발생할수 있으니 후자의 방법으로 전송하는 것이 좋다고 한다.[참고](http://stackoverflow.com/questions/4007969/application-x-www-form-urlencoded-or-multipart-form-data)

## 이미지 업로드
이미지 파일을 업로드하는 API를 구현해보도록 하겠습니다.

### 파일업로드 API 

우선 이미지 업로드를 위한 프로토콜을 만들어 보겠습니다. 
_POST_ 메소드방식의 /images 프로토콜을 이용해 이미지를 만들건데, 파라메터 file로 하여 이미지 파일을 업로드 하도록 하겠습니다. 
프로토콜 라우팅을 아래와 같이 구현할 것입니다.

{% highlight javascript %}
var express = require('express');
var router = express.Router();

/* Create new image */
router.post('/', function(req, res, next) {
  res.send('test');
});

module.exports = router;
{% endhighlight %}


### multer 설치

이미지 등 바이너리 파일 전송을 위해 익스프레스에서는 [multer](https://guthub.com/expressjs/multer)라는 모듈을 제공하는데,
multer는 위에서 설명한 웹 파일 전송방식 중 multipart/form-data 방식을 지원해 주는 익스프레스 미들웨어입니다.
설치는 npm을 통해 간편하게 진행할 수 있습니다.

```
npm install multer --save
```

### 업로드 로직 구현
가이드 문서에 보면 간단하게 multer를 해당 라우팅에 삽입하여 사용할 수 있는데, 여기서는 몇가지 조건을 추가하도록 하겠습니다. 
1) 파일명 파라매터를 추가해서 업로드 경로를 설정할수 있도록 한다.
2) 구현을 위해서는 파일 데이터 뿐만 아니라 서버에 저장될 파일 이름도 클라이언트로 부터 받아야 한다. filename이라는 파라매터를 추가하자.
3) 업로드 결과 파일명과 확장자를 리턴받는다.

위의 조건을 반영하여, 라우팅 설정을 아래와 같이 하도록 하겠습니다.

{% highlight javascript %}
router.post('/:filename', function(req, res, next) {
  // ...
});
{% endhighlight %}


다음으로 multer 모듈을 래핑한 upload() 함수를 구현하겠습니다.

{% highlight javascript %}
var upload = function (req, res) {
  var deferred = Q.defer();
  var storage = multer.diskStorage({
    // 서버에 저장할 폴더
    destination: function (req, file, cb) {
      cb(null, imagePath);
    },

    // 서버에 저장할 파일 명
    filename: function (req, file, cb) {
      file.uploadedFile = {
        name: req.params.filename,
        ext: file.mimetype.split('/')[1]
      };
      cb(null, file.uploadedFile.name + '.' + file.uploadedFile.ext);
    }
  });

  var upload = multer({ storage: storage }).single('file');
  upload(req, res, function (err) {
    if (err) deferred.reject();
    else deferred.resolve(req.file.uploadedFile);
  });
  return deferred.promise;
};
{% endhighlight %}


라우팅 본문에서 위 업로드 함수를 호출하여 성공하면 파일명과 확장자를 포함한 file객체를 응답하고, 실패시 500 에러와 메세지를 보내게됩니다.

{% highlight javascript %}
/* Create new image */
router.post('/:filename', function(req, res, next) {
  upload(req, res).then(function (file) {
    res.json(file);
  }, function (err) {
    res.send(500, err);
  });
});
{% endhighlight %}


### 업로드 테스트

아래의 이미지는 포스트맨으로 테스트한 결과입니다. POST /images/badge1프로토콜을 호출하고 저장 경로는 badge1으로 하였습니다. 
form-data 에 file 필드에 선택한 파일(배지1.png)을 로드하여 호출하였고, 
그 결과 {name: "badge1", ext: "png"} 객체를 응답받았습니다.

{% bimg imgs/postman_screenshot.png %}이미지 업로드 프로토콜 요청 결과 {% endbimg %}

{% bimg imgs/webstorm_screenshot.png %}이미지 파일 위치 {% endbimg %}

## 이미지 리사이징

multer 모듈로 이미지 업로드에 성공했다면 서버에 업로드된 이미지 파일 경로을 알수 있습니다. 
이제 gm 모듈을 사용하여 이미지 리사이징 하는 방법에 대해 알아보겠습니다.

### gm 설치

노드에서 많이 사용하는 이미지 프로세싱 라이브러리 중 하나인 gm을 npm을 통해 설치합니다.

```
$ npm install --save gm
```

gm 라이브러리를 사용하기 위해서는 GraphicsMagick 이나 ImageMagick 등의 라이브러리를 추가 설치해야하는데, 여기서는  GraphicsMagick을 설치하겠습니다.

```
$ sudo apt-get install graphicsmagick
```


### 섬네일 이미지 만들기

라이브러리 사용법은 매우 간단합니다.  
`require('gm')('파일 경로')` 를 함수 체인으로 이용하여 이미지 처리를 할수 있습니다. 이제 썸네일 이미지를 만들기위해 thumb() 함수를 이용하겠습다.

{% highlight javascript %} 
gm('image.jpg')
    .thumb(100, 100, 'imgs/thumb.jpg', function (err) {
      if (err) console.error(err);
      else console.log('done - thumb');
    });
{% endhighlight %}


### 메타 데이터 제거

이미지 공유시에는, 일부로 이미지 메타정보를 제거하기도 하기 때문에, 이미지 메타정보(EXIF profile data) 제거하기위해 noProfile() 함수를 사용해보겠습니다.

{% highlight javascript %}
gm('image.jpg')
    .noProfile()
    .write('noprofile.jpg', function (err) {
      if (err) console.error(err);
      else console.log('done - noprofile');
    });
{% endhighlight %}


### 블러 이미지 만들기

blur() 함수로 블러 이미지를 생성할 수 있습니다.

{% highlight javascript %}
gm('image.jpg')
    .blur(19, 10)
    .write('blur.jpg', function (err) {
      if (err) console.error(err);
      else console.info('done - blur')
    });
{% endhighlight %}


### 리사이징
업로드되는 이미지 파일을 하나의 사이즈로 저장하기 위하여, resize(width, height) 함수를 통해 이미지를 리사이징 해보겠습니다. 
파라매터로 넘겨주는 width와 height중 이미지 비율을 유지할 수 있는 값으로 width나 height 값을 취하여 리사이징합니다. 
이것은 thumb()이 이미지를 잘라 내는 것과 다른 점입니다.

{% highlight javascript %}
gm('image.jpg')
  .resize(100, 200)
  .write('100_200.jpg', function (err) {
    if (err) console.error(err)
    else console.log('done')
  });
{% endhighlight %}



