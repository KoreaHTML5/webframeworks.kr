---
layout : tutorials
category : tutorials
title : PHP 라라벨 5 On Mac - 8.블레이드 템플릿 I (View)
subcategory : setlayout
summary : PHP 라라벨 5에 대해 알아봅니다.
permalink : /tutorials/weplanet/Laravel08
author : danielcho
tags : laravel
title_background_color : F1F71A
---





> 블래이드는 라라벨에서 제공하는 간단하지만 강력한 템플릿 엔진입니다. 다른 인지도 높은 PHP템플릿 엔진들 과는 달리 블리이드는 뷰에서 순수한 PHP 코드를 작성하는 것을 허용합니다. 실제로는, 모든 블레이드 뷰는 단순한 PHP 코드로 컴파일되고 변경되기 전까지 캐시됩닏. 이는 블레이드가 어플리케이션에 아무런 부담을 주지 않는다는 의미합니다. 블레이드 뷰파일은  `.blade.php` 형식의 파일 확장을 사용하고 주로 `resoures/views`에 저장됩니다.

### 레이아웃 정의하기
블레이드의 가장 주요한  두가지 장점은 _템플릿 상속_ 과 _섹션_ 입니다. 먼저 간단한 예를 살펴보겠습니다. 우선 "마스터" 페이지 레이아웃을 구성할 것입니다. 대부분의 웹 어플리케이션이 다양한 페이지에서 동일한 레이아웃을 유지하기 때문에 이 레이아웃을 하나의 블레이드 뷰로 정의하는 것이 편리합니다

```html
<!-- Stored in resources/views/layouts/app.blade.php -->

<html>
    <head>
        <title>App Name - @yield('title')</title>
    </head>
    <body>
        @section('sidebar')
            This is the master sidebar.
        @show

        <div class="container">
            @yield('content')
        </div>
    </body>
</html>
```

여기서 볼 수 있듯이, 이 파일은 전형적인 HTML 마크업을 가지고 있습니다. 하지만 `@section` 와 `@yield` 지시어을 확인하십시오. `@section` 는 말 그대로 내용의 섹션을 정의하고 `@yield`는 어떤 섹션의 컨텐츠을 나타내는 데에 사용됩니다.
이제 어플리케이션의 레이아웃을 정의하였으니, 이 레이아웃을 상속하는 자식 페이지를 정의하도록 하겠습니다.

### 레이아웃 확장하기
하위 뷰를 정의할 때 블레이드 `@extends` 지시어을 사용해 하위 페이지가 어느 레이아웃을 "상속" 받을지 명시할 수 있습니다. 블레이드 레이아웃을 상속 받는 뷰는 `@section` 지시어를 이용해 레이아웃의 섹션에 컨텐츠를 삽입할 수 있습니다. 위의 예제에서 본 것처럼 이 섹션들의 컨텐츠는 @yield를 통해 레이아웃에 명시됩니다

```php
<!-- Stored in resources/views/child.blade.php -->

@extends('layouts.app')

@section('title', 'Page Title')

@section('sidebar')
    @parent

    <p>This is appended to the master sidebar.</p>
@endsection

@section('content')
    <p>This is my body content.</p>
@endsection
```
>{tip} 이전 예제와는 다르게, sidebar 섹션은 @show 대신에 @endsection 으로 끝납니다. @endsection 지시어는 섹션 만을 정의하고, @show는 정의하는 **즉시 섹션**을 생성 합니다.


이 예제에 sidebar 섹션은 @parent 지시어를 활용해서 레이아웃 사이드바에 컨텐츠를 겹쳐 쓰지 않고 추가합니다. @parent 지시어은 뷰가 렌더링되면 레이아웃의 컨텐츠에 의해 대체됩니다.
블레이드 뷰도 글로벌 view 헬퍼를 사용하여 라우트에서 반환될 수 있습니다

```php
Route::get('blade', function () {
    return view('child');
});
```

#### Component and Slot ####
컴포넌트와 슬롯은 섹션 및 레이아웃과 유사한 장점을 제공합니다. 컴포넌트와 슬롯은 결과 모델을 보다 쉽게 이해할 수 있게 해줍니다. 먼저 어플리케이션에서 재사용이 가능한 "경고(alert)" 컴포넌트를 생각해 보겠습니다.

```php
<!-- /resources/views/alert.blade.php -->

<div class="alert alert-danger">
    {{ $slot }}
</div>
```

이 `{{ $slot }}` 변수는 컴포넌트에 주입될 내용을 가지고 있습니다. 이 컴포넌트를 구성하기 위해서 `@component` 블레이드 지시어를 사용합니다.

```php
@component('alert')
    <strong>Whoops!</strong> Something went wrong!
@endcomponent
```

때로는 컴포넌트에 여러개의 슬롯을 정의하는 것이 유용합니다. "제목(title)" 주입이 가능하도록 경고(alert) 컴포넌트를 수정해보겠습니다. 이름이 지정된 슬롯은 일치하는 이름의 변수가 "출력" 되도록 표시할 수 있습니다

```php
<!-- /resources/views/alert.blade.php -->

<div class="alert alert-danger">
    <div class="alert-title">{{ $title }}</div>

    {{ $slot }}
</div>
```

그러면 이제, `@slot` 지시어를 사용하여 이름이 지정된 슬롯에 내용을 주입할 수 있습니다. `@slot` 지시어에 포함되어 있지 않는 컨텐츠는 `$slot` 변수의 컴포넌트로 전달됩니다

```php
@component('alert')
     @slot('title')
         Forbidden
     @endslot

     You are not allowed to access this resource!
 @endcomponent
```

> 컴포넌트로 추가적인 데이터를 전달할 필요가 있는 경우, `@component` 지시어의 두번째 인자로 데이터 배열을 전달하면 됩니다. 전달된 데이터는 컴포넌트 템플릿 에서 변수로 사용 가능

```php
@component('alert', ['foo' => 'bar'])
    ...
@endcomponent
```

#### 데이터 표시하기
블레이드 뷰로 전달된 데이터를 표시하기 위해 중괄호로 쌓인 변수를 전달할 수 있습니다.

```php
Route::get('main', function () {
    return view('welcome', ['name' => 'Steven']);
});
```

_`index.bleade.php`_

```php
Hello, {{ $name }}
```

뷰에는 전달된 변수들의 컨텐츠만 표시할 수 있는 것은 아닙니다. PHP 함수의 모든 결과는 출력될 수 있습니다. 블레이드에서는 출력되는 어떠한 PHP 코드도 넣을 수 있습니다

```php
The current UNIX timestamp is {{ time() }}.
```

>{tip} 블레이드 {{ }} 문장들은 XSS 공격을 방지하기 위해 자동으로 PHP의 'htmlspecialchars' 함수를 통과합니다.

#### Escape 처리되지 않은 데이터 표시하기
기본적으로 블레이드 {{ }} 문장은 XSS 공격을 방지하기 위해 PHP의 htmlspecialchars 함수를 통과합니다. 데이터를 escape 처리를 하지 않으려면 다음과 같이 작성하면 됩니다

```php
Hello, {!! $name !!}.
```

>{note} 어플리케이션의 사용자들로 부터 입력하여 표시되는 컨텐츠를 출력할 때는 escape-이스케이프에 대한 주의가 필요합니다. 사용자가 제공 한 데이터를 표시 할 때 XSS 공격을 방지하려면 항상 이스케이프 처리 된 이중 중괄호 문법을 사용하면 됩니다.

#### JSON 렌더링
자바스크립트 변수를 초기화할 때, 사용하기 위해 뷰에 배열을 전달하여 json으로 렌더링하는 방법입니다.

```html
<script>
    const app = <?php echo json_encode($array); ?>;
</script>
```

와 같은 방법으로 배열을 인코딩 했다면, 블레이드 템플릿에서는 `@json`을 사용하면 됩니다.

```html
<script>
    const app = @json($array);
</script>
```

#### 블레이드 & 자바스크립트 프레임워크
많은 자바스크립트 프레임워크에서 또한 중괄호를 사용하여 특정 표현이 브라우저에서 표시되어야 한다는 것을 명시하기 위해 `@`기호를 써서 이 중괄호 표현을 유지할 수 있도록 블리이드에서 지원합니다.

```html
<h1>Laravel</h1>

Hello, @{{ name }}.
```

>화면에 렌더링 될 때에는 `@`은 표시 되지 않습니다.

*`@verbatim` 지시어 : HTML 문서에 `@verbatim`을 선언함으로써 `@`을 매번 붙이지 않아도 된다

```html
@verbatim
    <div class="container">
        Hello, {{ name }}.
    </div>
@endverbatim
```
