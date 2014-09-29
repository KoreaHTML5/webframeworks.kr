---
layout : getstarted
title : Bootstrap 시작하기
category : getstarted
subcategory : ui
summary : 가장 보편적으로 사용되는 UI Framework인 Bootstrap에 대하여 알아본다.
permalink : /getstarted/bootstrap
title_background_color : 0769AD
tags : bootstrap
author : nurinamu
---

Bootstrap
----

##Bootstrap이란?
Twitter 내부에서 개발하던 라이브러리로 각종 UI Component들을 모아 놓은 종합선물셋트이다.
Bootstrap을 이용하면 간단한 스크립트와 CSS/HTML 만으로 깔끔한 형태의 UI/UX를 구성할 수 있다. 디자인에 익숙하지 않은 개발자들이
데모 또는 프로토타입을 만들기에 아주 유용하며, 구현하기 까다로운 여러 Javascript action들도 간단하게 라이브러리로 제공하고 있어 쉽게 사용할 수 있다.

##Bootstrap의 구성
Bootstrap은 사용방법에 따라 크게 3가지로 구분이 가능하다.

- [CSS stylesheet](#css_style)
- [Reusable component](#reuse_tag)
- [Javascript component](#js_comp)

### <a name="css_style"></a>CSS stylesheet
HTML 자체의 기능을 확장하고 강화할 수 있게 해주는 css들이다.
Bootstrap의 UI 요소중 가장 간단하게 사용할 수 있는 방법으로 Boostrap의 css에 정의된 class들을 tag에 적용하여 사용하는 방법이다.

예를들어 간단한 버튼을 만들기 위해서는 일일이 마우스 이벤트들을 처리해줘야하지만 이미 Bootstrap에 정의된 버튼 css를 사용하면 간단하게 버튼을 생성할 수 있다.

``` html
<a class="btn btn-primary" >link with bootstrap</a>

<a >link without bootstrap</a>
```

{% img imgs/css_1.png 200x %}

[확인하기](http://jsfiddle.net/3d8sgg0k/4/)

아래는 Bootstrap에서 제공하는 CSS들을 기능별로 구분해 놓은 목록이다. 각 카테고리 별로 자세한 내용은 링크를 통해 확인할 수 있다.

- [Grid system](http://getbootstrap.com/css/#grid) : Grid 형태의 영역구분을 가능하게 해주는 Layout 체계
- [Typography](http://getbootstrap.com/css/#type) : 각종 텍스트 서식을 위한 스타일
- [Code](http://getbootstrap.com/css/#code) : 코드 또는 키코드 표시를 위한 스타일
- [Tables](http://getbootstrap.com/css/#tables) : 테이블 스타일
- [Forms](http://getbootstrap.com/css/#forms) : 폼 스타일
- [Buttons](http://getbootstrap.com/css/#buttons) : 버튼 스타일
- [Images](http://getbootstrap.com/css/#images) : 이미지 스타일
- [Helper classses](http://getbootstrap.com/css/#helper-classes) : 자주 사용하는 기능을 모아 놓은 유틸
- [Responsive utilities](http://getbootstrap.com/css/#responsive-utilities) : 반응형 페이지 동작을 위한 유틸

### <a name="reuse_tag"></a>Reusable component
HTML만으로는 표현할 수 없었던 화면 구성 요소들을 Bootstrap에서 css와 javascript의 조합을 통해 다양하게 제공한다.
버튼 묶음을 예로 들자면 HTML에서는 버튼을 단순하게 나열하는 것만으로 표시할 수 밖에 없었지만 Bootstrap을 통하면 시작적으로나 기능적으로 묶음으로서의
동작을 구현할 수 있다.

이런 Bootstrap 컴포넌트들을 사용할 때는 단순하게 tag안 class 입력만으로 가능하다.

``` html
<div class="btn-group">
  <button type="button" class="btn btn-default">Left</button>
  <button type="button" class="btn btn-default">Middle</button>
  <button type="button" class="btn btn-default">Right</button>
</div>
```

{% img imgs/css_2.png 200x %}

[확인하기](http://jsfiddle.net/3d8sgg0k/5/)

Bootstrap에서 제공되는 Reusable component는 아래와 같다.

- [Glyphicons](http://getbootstrap.com/components/#glyphicons) : 아이콘 컴포넌트
- [Dropdowns](http://getbootstrap.com/components/#dropdowns) : 드랍다운 형태를 만들어주는 컨테이너 컴퓨넌트
- [Button groups](http://getbootstrap.com/components/#btn-groups) : 버튼 그룹 컴포넌트
- [Button dropdowns](http://getbootstrap.com/components/#btn-dropdowns) : 버튼 액션에 드랍다운이 추가된 컴포넌트
- [Input groups](http://getbootstrap.com/components/#input-groups) : 입력폼 묶음 컴포넌트
- [Navs](http://getbootstrap.com/components/#navs) : 탭/버튼 형태의 각종 네비게이션 버튼 묵음 컴포넌트
- [Navbar](http://getbootstrap.com/components/#navbar) : 네비게이션 메뉴바 컴포넌트
- [Breadcrumbs](http://getbootstrap.com/components/#breadcrumbs) : 페이지 이동 경로 표시 컴포넌트
- [Pagination](http://getbootstrap.com/components/#pagination) : 페이징 컴포넌트
- [Labels](http://getbootstrap.com/components/#labels) : 레이블/태그 컴포넌트
- [Badges](http://getbootstrap.com/components/#badges) : 알람등에 사용되는 뱃지 컴포넌트
- [Jumbotron](http://getbootstrap.com/components/#jumbotron) : 타이틀 화면 구성용 컴포넌트
- [Page header](http://getbootstrap.com/components/#page-header) : 페이지 상단 구성용 컴포넌트
- [Thumbnails](http://getbootstrap.com/components/#thumbnails) : 썸네일 컴포넌트
- [Alerts](http://getbootstrap.com/components/#alerts) : 알림 표시를 위한 컴포넌트
- [Progress bars](http://getbootstrap.com/components/#progress-bars) : 프로그레스바 컴포넌트
- [Media object](http://getbootstrap.com/components/#media-object) : 다양한 종류의 자료를 목록형태로 표시하기 위한 컴포넌트
- [List group](http://getbootstrap.com/components/#list-group) : 목록 표 컴포넌트
- [Panels](http://getbootstrap.com/components/#panels) : 제목틀을 가진 패널 컴포넌트
- [Responsive embed](http://getbootstrap.com/components/#responsive-embed) : embed로 삽입된 객체의 반응형 처리를 위한 컴포넌트
- [Wells](http://getbootstrap.com/components/#wells) : 인용문구 표시 컴포넌트




### <a name="js_comp"></a>Javascript component
