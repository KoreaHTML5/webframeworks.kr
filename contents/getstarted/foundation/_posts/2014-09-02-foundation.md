---
layout : getstarted
title : Foundation 시작하기
category : getstarted
subcategory : ui
summary : 
permalink : /getstarted/foundation
title_background_color : 008cba
title_color : FFFFFF
tags : foundation
author : nurinamu
---

## Foundation 특징
Foundation은 반응형 웹 페이지를 제작하기 위한 가장 빠르고 효율적인 방법을 제공합니다. 기본적으로는 Bootstrap과 마찬가지로 각종 UI/UX 컴포넌트를 제공하고 
있지만 Foundation은 빠른 프로토 타이핑을 위한 여러 장치들을 제공하고 있습니다.

- HTML Templates : 웹페이지에 자주 사용되는 기본 HTML Template을 제공하여 불필요한 반복 코드 생산을 줄일 수 있게 하였습니다.
- Stencils : Foundation 컴포넌트들의 스텐실을 제공함으로써 웹디자이너가 개발자에게 보다 정확한 시안을 제공하여 보다 빠른 프로토타이핑이 가능하게 하였습니다.
- Icon packs : 프로토타이핑시 자주 사용하는 icon을 기본적으로 제공하여 보다 빠른 프로토타이핑이 될 수 있도록 도와줍니다.  

Foundation [홈페이지](http://foundation.zurb.com/)에서는 Learn 항목을 따로 내놓고 Foundation을 처음 접하는 개발자와 디자이너들을 위한 강좌들
이 개설되어있습니다.

## Foundation 구성 요소
 
 
### Structure
반응형 웹 페이지 구성을 위한 각종 레이아웃 구성을 위한 기능들을 제공합니다.

- [Media Quries](http://foundation.zurb.com/docs/media-queries.html) : CSS Media Query를 이용한 화면 크기별 CSS 적용법입니다.
- [Visibility](http://foundation.zurb.com/docs/components/visibility.html) : 화면 크기 또는 화면 방향에 따른 표시 여부를 설정할 수 있는 기능입니다.
- [Grid](http://foundation.zurb.com/docs/components/grid.html) : 다양한 레이아웃을 화면 크기에 따라 적용할 수 있는 영역 설정법입니다.
- [Block Grid](http://foundation.zurb.com/docs/components/block_grid.html) : 화면 크기에 따라 컨텐츠 블럭의 배열을 조정할 수 있는 영역 설정법입니다.
- [Interchange Responsive Content](http://foundation.zurb.com/docs/components/interchange.html) : 화면 크기의 변경에 따라 javascript 이벤트가 발생하여 상황에 맞추어 처리할 수 있습니다.

### Navigation
화면 이동 / 선택 등의 기능들을 제공합니다.

- [Offcanvas](http://foundation.zurb.com/docs/components/offcanvas.html) : 메인 컨텐츠의 좌우에 메뉴를 숨겼다 열 수 있습니다. 안드로이드의 Drawer와 비슷한 기능.
- [Top Bar](http://foundation.zurb.com/docs/components/topbar.html) : 웹페이지 상단에 다양한 형태의 메뉴를 표시할 수 있는 Navigation 바를 만드는 기능.
- [Icon Bar](http://foundation.zurb.com/docs/components/icon-bar.html) : Navigation Bar에 Icon을 넣은 메뉴를 만드는 기능.
- [Side Nav](http://foundation.zurb.com/docs/components/sidenav.html) : 화면 양 옆에 표시할 수 있는 Navigation 바를 만드는 기능. 
- [Magellan Sticky Nav](http://foundation.zurb.com/docs/components/magellan.html) : 스크롤시에 상단에 따라오는 Navigation 바를 만드는 기능.
- [Sub Nav](http://foundation.zurb.com/docs/components/subnav.html) : 간단한 Navigation 메뉴를 만드는 기능.
- [Breadcrumbs](http://foundation.zurb.com/docs/components/breadcrumbs.html) : 단계가 있는 메뉴를 따라 이동시에 현재 단계를 나타내는 기능.
- [Pagination](http://foundation.zurb.com/docs/components/pagination.html) : 페이지 구분을 기능을 간편하게 제공하는 컴포넌트. 


### Media
컨텐츠 사용되는 미디어를 표시하기 위한 기능들을 제공합니다.

- [Orbit Slider](http://foundation.zurb.com/docs/components/orbit.html) : 이미지 슬라이더를 만드는 기능. 모바일의 경우 Swipe도 지원.
- [Thumbnails](http://foundation.zurb.com/docs/components/thumbnails.html) : Thumbnail 이미지를 테두리와 함께 표시하는 기능.
- [Clearing Lightbox](http://foundation.zurb.com/docs/components/clearing.html) : 화면의 크기에 따라 내부 컨텐츠의 표시 위치를 자동으로 변경해주는 기능.
- [Flex Video](http://foundation.zurb.com/docs/components/flex_video.html) : 화면의 크기에 따라 Youtube, vimeo 등의 embed 된 Video의 크기를 자동으로 변경해주는 기능.

### Forms
사용자 입력 데이터를 처리하기 위한 UI 기능들입니다.

- [Forms]() : Form layout을 구성할 수 있는 기능.
- [Switches]() : checkbox, radiobutton을 switch 형태로 표시하는 기능.
- [Range Sliders]() : Slider를 구현할 수 있는 기능.
- [Abide Validation]() : 입력 값의 형태가 유효한지 확인할 수 있는 기능.

### Buttons
입력 버튼을 다양하게 구현할 수 있는 기능들입니다.

- [Buttons]() : Button을 구현할 수 있는 기능.
- [Button Groups]() : Button을 묶음으로 구현할 수 있는 기능.
- [Split Buttons]() : Dropdown Button과 유사하지만 Dropdown 메뉴 표시 영역이 차이가 있습니다.
- [Dropdown Buttons]() : Dropdown Menu가 포함된 Button을 구현할 수 있는 기능.

### Typography
문자를 목적에 맞게 표현하기 위한 기능들입니다.
  
- [Type]() : 각 표시 목적별로 Style이 정의 되어있음.
- [Inline Lists]() : List를 가로로 표시할 수 있는 기능.
- [Labels]() : 다양한 형태의 Label을 구현할 수 있는 기능.
- [Keystrokes]() : 키 입력을 표시할 수 있는 기능.

### Callouts & Prompts
특정 조건이나 시점에 알려줘야하는 알림이나 팝업에 관한 기능들입니다.

- [Reveal Modal]() : Modal을 구현할 수 있는 기능.
- [Alerts]() : 알림 메세지를 표현하는 기능.
- [Panels]() : 여러 컴포넌트를 묶어서 표현할 수 있는 기능.
- [Tooltips]() : 풍선 도움말을 표시하는 기능.
- [Joyride]() : Step by Step 설명을 동적 화면 이동과 함께 표현할 수 있는 기능.

### Content
내용을 목적에 맞추어 가독성을 높이는 등 다양하게 표현하는 기능들입니다.

- [Dropdowns]() : Dropdown을 구현할 수 있는 기능.
- [Pricing Tables]() : 가격 테이블을 표현할 수 있는 기능.
- [Progress Bars]() : 진행 상태 표시바를 구현할 수 있는 기능.
- [Tables]() : Table 화면을 구성할 수 있는 기능.
- [Accordion]() : Accordion 화면을 구성할 수 있는 기능.
- [Tabs]() : Tab 화면을 구성할 수 있는 기능.
- [Equalizer]() : 다양한 화면 크기에도 동일한 크기의 Panel을 구성해주는 기능.

## 설정 방법
Foundation은 3가지 설치 방법을 제공합니다.
 
- CSS 설치 : 가장 단순한 설치로 기본 CSS / JS를 사용할 페이지에서 바로 로드해서 사용하는 방법입니다.
- Sass 설치 : Ruby / Grunt 를 통하여 Foundation Web Project를 생성하고 Sass Compile하여 CSS / JS를 사용하는 방법입니다.
- App 생성 : Ruby on Rails 를 이용하여 Foundation Web Project를 생성하는 방법입니다. 보다 세밀한 부분을 사용자의 입맛에 맞추어 변경하여 사용할 수 있습니다.
  
### CSS 설치
미리 Download한 Foundation CSS/JS 파일과 Foundation과 종속관계를 가지는 ModernizrJS를 페이지에 로드하도록 link/script TAG를 삽입합니다.

``` html
<head>
    <!-- css와 modernizr 로딩은 head에 삽입합니다.-->
    <link rel="stylesheet" href="css/foundation.css">
    <script src="js/vendor/modernizr.js"></script>
</head>    

<body>
    <!-- jquery와 Foundation JS 로딩은 body 맨 마지막에 삽입합니다.-->
    <script src="js/vendor/jquery.js"></script>
    <script src="js/foundation.min.js"></script>
    <script>
        $(document).foundation();
    </script>
</body>    
```

### Sass 설치
Foundation에서는 SCSS를 통하여 CSS를 생성하는 Sass를 지원합니다. 대표적인 Sass 컴파일러인 Compass를 통해서 생성할 수도 있고 Foundation 에서 
제공하는 libsass와 grunt를 통하여 생성할 수 있습니다. 두가지 구분을 나누게 되는 경우는 Ruby의 설치 여부 입니다.

{% img imgs/scssflow-med.svg %}

#### **Compass 프로젝트 생성 방법**
1) Compass를 설치합니다.

```
$ gem install compass
```

2) Foundation Client를 통해서 프로젝트를 생성합니다.
 
```
$ foundation new MY_PROJECT
```

3) 생성된 프로젝트 디렉토리로 이동합니다.

```
$ cd MY_PROJECT
```

4) 변경사항이 생길때는 반드시 `bundle` 명령어를 수행하고 프로젝트를 실행하기 위해 아래의 명령어를 사용합니다.

```
$ bundle exec compass watch
```


#### **Libsass 프로젝트 생성 방법**
1) 프로젝트를 생성할 위치로 이동합니다.

```
$ cd path/to/sites
```

2) Foundation Client를 통해서 프로젝트를 생성합니다.

```
$ foundation new project_name --libsass
```

3) 프로젝트가 생성되었고 프로젝트를 시작하기 전에 컴파일을 수행한다.

```
$ cd project_name
$ grunt build
```

4) 변경사항이 생기면 매번 `grunt`를 수행한다.

```
$ grunt
```

## 자세히 알아보기
Foundation에 대한 더 자세한 정보는 위에서 언급한 것처럼 Foundation [홈페이지](http://foundation.zurb.com/)의 [Training 사이트](http://foundation.zurb.com/learn/training.html)를 참고하면 됩니다.