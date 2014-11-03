---
layout : tutorials
title : Bootstrap을 이용한 반응형 웹 디자인 적용하기
category : tutorials
subcategory : setlayout
summary : 웹사이트에 Bootstrap을 통하여 반응형 웹 디자인을 적용할때 고려해야할 것들에 대하여 배워봅시다.
permalink : /tutorials/bootstrap
title_background_color : RGB(8, 78, 119)
tags : javascript bootstrap responsive
author : nurinamu
---

## 반응형(Responsive) 웹 디자인이란?

사용자에게 같은 컨텐츠를 다양한 화면 크기에서도 같은 경험을 전달하기위해 적용되는 디자인을 말합니다. 이때 보통 화면 레이아웃의 변환과 이미지,동영상등의 컨텐츠 크기 조절등이 이뤄집니다.
[Bootstrap]({{site.baseurl}}/getstarted/bootstrap)을 통하여 이러한 것들을 어떻게 적용할 수 있는지 알아봅니다.

## 반응형 웹 디자인을 위한 Bootstrap 기능들

[Bootstrap]({{site.baseurl}}/getstarted/bootstrap)에서는 반응형 웹디자인 적용을 위한 기능들을 제공합니다. 대표적인 기능들은 아래와 같습니다.

 - Grid system
 - Responsive images
 - Responsive embed
 - Responsive utilities
 
각 기능들에대하여 자세하게 알아봅시다.

### Grid system

[Bootstrap]({{site.baseurl}}/getstarted/bootstrap)의 Grid system은 화면 레이아웃을 격자로 구분해서 관리하는 기능을 제공합니다.
각 격자의 넓이는 상위 컨테이너의 넓이를 등분하여 정해집니다. 등분의 기본값은 12이고 이 값은 Bootstrap 설치시 변경 가능합니다.

Grid system의 적용은 container tag에 CSS class 삽입하여 동작합니다.
[Bootstrap 페이지](http://getbootstrap.com/css/#grid-options)에서 제공되는 class에 대한 spec은 아래와 같습니다.

{% img imgs/resp_class_table.png %}

일반적인 사용방법은 아래와 같습니다. 
**아래 예제의 동작을 확인해보려면 현재 화면의 창의 넓이를 조절해보면 확인해볼 수 있습니다.** 

<div class="col-xs-8 col-sm-6 col-md-4 col-lg-3" style="background-color:#dddddd;height:30px;">   
    .col-xs-8 .col-sm-6 .col-md-4 .col-lg-3
</div>
<br>

``` html
<!-- 가장 큰 화면에서는 3칸, 중간에서 4칸, 작은 화면에서 6칸, 가장 작은 화면에서 8칸을 차지하는 container입니다. -->
<div class="col-xs-8 col-sm-6 col-md-4 col-lg-3" style="background-color:#dddddd;height:30px;">   
    테스트
</div>
```

이때 만약 xs에 대하여 class가 입력이 되어 있지 않으면 자동적으로 xs는 12 column을 모두 차지하여 그려지게 됩니다.
반대로 xs만을 정의하고 상위 크기의 class가 정의되지 않으면 상위는 모두 xs에서 정의된 column을 차지하게 됩니다.

<div class="col-sm-6" style="background-color:#dddddd;height:30px;">
    .col-sm-6
</div>

<br>

``` html
<!-- xs화면에서는 화면 넓이 전체를 차지하고 다른 화면 에서는 모두 6 column을 차지하는 container -->
<!-- 왜냐하면 sm 상위의 class가 정의되지 않았기 때문에 정의된 md, lg 경우에도 모두 6이   -->
<div class="col-sm-6" style="background-color:#dddddd;height:30px;">
    테스트
</div>
```

위의 예제들은 모두 왼쪽으로 정렬된 경우만의 예제였지만 추가적으로 offset을 설정할 수 있습니다. offset 설정은 간단하게 크기별 prefix뒤에 offset-을 추가하면 가능합니다.

<div class="col-sm-offset-2 col-sm-6" style="background-color:#dddddd;height:30px;">
    .col-sm-offset-2 .col-sm-6
</div>

<br>

``` html
<!-- xs화면에서는 화면 넓이 전체를 차지하고 다른 화면 에서는 모두 6 column을 차지하는 container -->
<!-- 하지만 먼저의 예제와는 다르게 왼쪽에 sm 이상의 화면에 대해서는 2 column의 offset이 존재한다. -->
<div class="col-sm-offset-2 col-sm-6" style="background-color:#dddddd;height:30px;">
    테스트
</div>
```

추가적으로 Bootstrap에서는 해당 container 또는 column을 특정 크기에서만 표시하거나 숨기는 class를 지원합니다. 
[Bootstrap 페이지](http://getbootstrap.com/css/#responsive-utilities)에서는 아래와 같은 형태로 예시를 보여줍니다.

{% img imgs/resp_util_table.png %}

```.visible-*-*``` prefix의 경우에는 해당 크기의 경우에만 화면에 표시되게 됩니다. 첫번쨰 (*)는 사이즈를 나타내고 두번째 (*)는 ```display``` 값을 나타냅니다.
```display```값은 block, inline, inline-block이 있습니다.

<div class="visible-xs-block"  style="background-color:#CCCCCC;height:30px;">
이글은 xs의 경우에만 보입니다.
</div>

<div class="visible-sm-block"  style="background-color:#DDDDDD;height:30px;">
이글은 sm의 경우에만 보입니다.
</div>

<div class="visible-md-block"  style="background-color:#EEEEEE;height:30px;">
이글은 md의 경우에만 보입니다.
</div>

<div class="visible-lg-block"  style="background-color:red;height:30px;">
이글은 lg의 경우에만 보입니다.
</div>

<br>

``` html
<div class="visible-xs-block"  style="background-color:#CCCCCC;height:30px;">
이글은 xs의 경우에만 보입니다.
</div>

<div class="visible-sm-block"  style="background-color:#DDDDDD;height:30px;">
이글은 sm의 경우에만 보입니다.
</div>

<div class="visible-md-block"  style="background-color:#EEEEEE;height:30px;">
이글은 md의 경우에만 보입니다.
</div>

<div class="visible-lg-block"  style="background-color:red;height:30px;">
이글은 lg의 경우에만 보입니다.
</div>
```

```.hidden-*```은 visible과 반대로 해당 크기에서만 숨기게 됩니다. visible과는 다르게 display속성없이 크기만 설정하면 됩니다.

이 Grid system을 통해서 각기 다른 크기의 화면에 따른 레이아웃을 쉽게 구성할 수 있습니다.

작성한 레이아웃이 제대로 모바일 기기에서 동작하는지는 [Troy](http://troy.labs.daum.net/) 사이트에서 쉽게 확인할 수 있습니다.

### Images

웹페이지에서 가장 중요한 부분을 차지하는 것은 역시 이미지입니다. 반응형 웹디자인에 맞게 이미지를 축소/확대 하여야하는데 이것은 그리 어려운 방법은 아닙니다.

단지 이미지가 상위 컨테이너를 초과하지 않도록 ```max-width```에 대한 설정을 하면됩니다.
Bootstrap에서는 이것을 위한 class로 ```img-responsive```를 지원합니다.

```html
<img src="..." class="img-responsive" alt="Responsive image">
```

### Responsive embed

이미지와 마찬가지로 근래에 많이들 사용하시는 동영상 또는 Flash 역시 반응형 웹디자인을 위해 리사이징이 필요합니다.
Bootstrap에서는 이것을 위해서도 class를 아래와 같이 지원합니다.

Youtube (16x9)
<div class="embed-responsive embed-responsive-16by9">
    <iframe class="embed-responsive-item" width="560" height="315" src="//www.youtube.com/embed/gUNrkeg7t8Q" frameborder="0" allowfullscreen></iframe>
</div>

Vimeo (4x3)
<div class="embed-responsive embed-responsive-4by3">
  <iframe class="embed-responsive-item" src="//player.vimeo.com/video/110256895" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> <p><a href="http://vimeo.com/110256895">Web standards for the future</a> from <a href="http://vimeo.com/w3c">W3C</a> on <a href="https://vimeo.com">Vimeo</a>.</p>
</div>

```html
<!-- 16:9 aspect ratio -->
<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="..."></iframe>
</div>

<!-- 4:3 aspect ratio -->
<div class="embed-responsive embed-responsive-4by3">
  <iframe class="embed-responsive-item" src="..."></iframe>
</div>
```

### 마치며..

반응형 웹디자인의 중요성은 모바일 웹브라우징 수요가 늘어나면서 점점 중요해지고 있습니다. 이전에 단순히 데스크탑 브라우저만을 위한 디자인 고려를 벗어나 다양한 기기를 사용하는 모바일 브라우저
사용자까지 고려하는 서비스를 위해 반응형 웹디자인을 숙지하시고 웹페이지 구성을 하시기를 바랍니다.

이 포스트에서는 단순한 레이아웃과 리사이징에 대한 처리만을 언급하였으나 보다 나은 퍼포먼스 개선을 위해서는 추가적인 트릭들이 필요합니다.

[WebFundamentals](https://developers.google.com/web/fundamentals/) 사이트도 참고 하시기를 추천해드립니다.
 