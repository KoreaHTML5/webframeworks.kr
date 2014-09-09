# 참여하는 방법

본 프로젝트에 참여하는 방법은 아래와 같이 있습니다.
  - [사이트내 개선사항에 대한 이슈 등록](#issue)
  - [사이트내 개선을 위한 코드 참여 / 이슈 해결](#fix)
  - [Tutorials / Updates에 기고](#write)

글 작성 방법은 [아래](#detail)에 자세히 설명하였습니다.

## <a name="issue"></a>사이트내 개선사항에 대한 이슈 등록
TBD

## <a name="fix"></a>사이트내 개선을 위한 코드 참여 / 이슈 해결
TBD

## <a name="write"></a>Tutorials / Updates에 기고
본 프로젝트에서 배포되는 모든 컨텐츠는 공개되어 있으며 많은 독자들에게 유용하게 쓰여지도록 작성이됩니다. 그래서 이와 같은 의도로 자신의 지식을 공유하고 싶으신 분들에게 기고를 받고 있습니다.

기고의 순서는 대략 아래와 같습니다.
  - Issue로 자신이 작성하고 싶은 글의 내용을 간략히 등록.
  - Issue 안에서 관리자의 판단하에 작성될 위치의 폴더 협의 후 생성.
  - Fork 후 자신의 폴더안에 글 작성후 Pull request.
  - 리뷰 후 Live

많은 분들의 참여 부탁드리며, 문의사항은 [여기](TBD)로 남겨주시면 감사하겠습니다.

# <a name="detail"></a>글 작성 방법

본 프로젝트의 사이트에 글을 작성하기 위해서는 기본적으로 [Markdown 문법](http://daringfireball.net/projects/markdown/syntax)을 익히셔야합니다.

작성을 위해서는 아래의 순서로 진행이 됩니다.
  1. [작성자 등록](#author)
  2. [폴더 생성](#folder)
  3. [글 작성하기](#syntax)

## <a name="author"></a> 작성자 등록
이 항목은 기존에 이미 기고한 이력이 있는 작성자는 넘어가셔도 됩니다.

처음 기고하시는 작성자 분은 아래와 같은 형태로 **/contents/_data/authors** 폴더 안에 {자신의 id}.json을 생성합니다.
``` javascript
{
  "name" : "이원제",
  "github" : "nurinamu",
  "img" : "https://fbcdn-sphotos-h-a.akamaihd.net/hphotos-ak-xap1/t1.0-9/10455759_756319334390618_9098829359137199788_n.jpg"
}
```
이후 작성되는 글의 Meta 정보란에 author 값으로 자신의 id를 입력하면 됩니다.

## <a name="author"></a> 폴더 생성
기본적으로 상위 폴더는 관리자가 지정하여 생성하지만 글에서 static파일들(image, script, css)을 사용하는 경우 자신의 폴더 하위에 구성을 해야합니다.

Issue를 통해서 자신이 작성할 글의 위치가 **/contents/tutorials/angularjs-basic** 라고 한다면 글에서 사용할 static 파일들의 위치는 그 아래 존재해야지만 작성된 글의 위치에서 접근이 가능합니다.

## <a name="author"></a> 글 작성하기
본 프로젝트는 기본적으로 [Jekyll](http://jekyllrb.com)를 사용하기 때문에 기본 문법은 Markdown + Jekyll 확장을 사용합니다.

그래서 글을 작성할 파일을 위에서 생성한 폴더 하위에 **_posts** 폴더를 생성하여 아래와 같은 명명 규칙으로 생성을 합니다.
```
YYYY-MM-DD-This-is-the-title.md
```
파일명에 쓰여지는 날짜는 글의 작성일이 됩니다.

글을 작성한 후에 최상단에는 글의 Meta 정보를 아래와 같이 작성합니다.
```
---
layout : getstarted
category : getstarted
title : jQuery 시작하기
summary : jQuery란 무엇이고 설치방법과 기본적인 사용법에 대해서 알아봅니다. 최근 웹 어플리케이션 개발할때 필수적으로 사용하는 라이브러리이니 만큼 익숙해지는 것이 좋습니다.
permalink : /getstarted/jquery
author : nurinamu
tags : jquery javascript html
title_background_img : imgs/logo-jquery@2x.png
title_background_color : 0769AD
---
```

#### 필수 Meta 정보
* **layout** - 글에서 사용될 Layout Template을 지정합니다. tutorials라면 tutorials, updates는 updates 입니다.
* **category** - 글의 분류를 위해 작성되는 키워드입니다. 기본적으로 layout명과 동일해야합니다.
* **title** - 글의 제목입니다.
* **summary** - 글이 목록에 표시될때 나타날 글의 요약입니다.
* **permalink** - 이 글이 외부에서 접근될 경로입니다. 기본적으로는 글이 작성되는 폴더명으로 입력하시면 됩니다.
* **author** - 작성자의 id를 적습니다. **/contents/_data/authors**에 추가한 자신의 json 파일명을 입력하면 됩니다.
* **tags** - 글의 TAG 입니다. 접근성을 높이기 위해 사용됩니다.

#### 추가 Meta 정보
* **title_background_img** - 글의 제목부분에 배경으로 넣고자 하는 이미지 경로를 입력합니다.
* **title_background_color** - 글의 제목부분에 배경색을 지정합니다.

---

**많은 분들의 참여 부탁드리며, 문의사항은 [여기](TBD)로 남겨주시면 감사하겠습니다.**
