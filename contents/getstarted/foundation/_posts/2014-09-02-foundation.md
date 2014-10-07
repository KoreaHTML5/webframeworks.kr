---
layout : getstarted
title : Foundation 시작하기
category : getstarted
subcategory : ui
summary : 
permalink : /getstarted/foundation
title_background_color : 008cba
tags : bootstrap
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

### Navigation

### Media

### Forms

### Buttons

### Typography

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
1. Compass를 설치합니다.

```
$ gem install compass
```

2. Foundation Client를 통해서 프로젝트를 생성합니다.
 
```
$ foundation new MY_PROJECT
```

3. 생성된 프로젝트 디렉토리로 이동합니다.

```
$ cd MY_PROJECT
```

4. 변경사항이 생길때는 반드시 `bundle` 명령어를 수행하고 프로젝트를 실행하기 위해 아래의 명령어를 사용합니다.

```
$ bundle exec compass watch
```


#### **Libsass 프로젝트 생성 방법**
1. 프로젝트를 생성할 위치로 이동합니다.

```
$ cd path/to/sites
```

2. Foundation Client를 통해서 프로젝트를 생성합니다.

```
$ foundation new project_name --libsass
```

3. 프로젝트가 생성되었고 프로젝트를 시작하기 전에 컴파일을 수행한다.

```
$ cd project_name
$ grunt build
```

4. 변경사항이 생기면 매번 `grunt`를 수행한다.

```
$ grunt
```

## 자세히 알아보기
Foundation에 대한 더 자세한 정보는 위에서 언급한 것처럼 Foundation [홈페이지](http://foundation.zurb.com/)의 [Training 사이트](http://foundation.zurb.com/learn/training.html)를 참고하면 됩니다.