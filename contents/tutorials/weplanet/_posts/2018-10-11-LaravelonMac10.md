---
layout : tutorials
category : tutorials
title : PHP 라라벨 5 On Mac - 10.블레이드 템플릿 III(View)
subcategory : setlayout
summary : PHP 라라벨 5에 대해 알아봅니다.
permalink : /tutorials/weplanet/Laravel10
author : danielcho
tags : laravel
title_background_color : F1F71A
---





> 블레이드 템플릿 기능 확장 및 하위 뷰 포함하기를 통해 보다 편리한 개발을 지원합니다.

**@php, @endphp**

```html
@php
    //
@endphp
```

>블레이드가 이 기능을 제공하지만, 이 기능을 너무 빈번하게 사용하는 것은 너무 많은 로직이 템플린 안에 포함을 의미하기 때문에 빈번한 사용을 지양합니다.

#### 하위 뷰 포함
**@include**

```html
<div>
    @include('shared.errors')

    <form>
        <!-- Form Contents -->
    </form>
</div>
```

하위에 포함하게 될 뷰는 부모 뷰의 모든 데이터를 상속하게 되지만, 하위 뷰에 데이터 배열을 직접 전달할 수도 있습니다:

```html
@include('view.name', ['some' => 'data'])
```

**@includeIf**
뷰가 존재하지 않으면 라라벨은 에러를 발생합니다. 이 때 사용하는 지시어 입니다.

```html
@includeIf('view.name', ['some' => 'data'])
```

**@includeWhen**
조건 값에 따라 뷰 파일을 @include 할 때 사용하는 지시어 입니다.

```html
@includeWhen($boolean, 'view.name', ['some' => 'data'])
```

**@includeFirst**
주어진 배열에서 존재하는 첫번째 뷰를 포함하도록 하려면

```html
@includeFirst(['custom.admin', 'admin'], ['some' => 'data'])
```

>블레이드 뷰에서 `__DIR__`와 `__FILE__` 를 사용하지 마십시오. 이를 사용하면 컴파일된 캐시 뷰의 경로가 반환됩니다.

#### 컬렉션을 뷰에서 렌더링 하기
**@each**
반복문을 하나의 줄로 구성 할 때 사용하는 지시어 입니다.

```
#첫번째 인자 : 배열이나 컬렉션의 각 요소를 렌더링하기 위한 뷰의 이름
#두번째 인자 : 반복 처리하는 배열이나 컬렉션
#세번째 인자 : 뷰에서 반복값이 대입되는 변수
#네번째 인자 : 특정 배열이 비었을 경우 렌더링될 뷰를 결정
@each('view.name', $jobs, 'job','view.empty')
```

>@each를 통해서 렌더링 되는 뷰는 부모 뷰에서 변수를 상속받지 않습니다. 만약 자식뷰에서 이 변수들을 사용해야 한다면, 대신 @foreach 그리고 @include 를 사용해야합니다.

#### 스텍
블레이드는 또한 다른 뷰 또는 레이아웃에서 렌더링 할 수 있도록 이름이 지정된 스택에 푸시 할 수 있습니다. 이는 특히 하위 뷰에 필요한 JavaScript 라이브러리를 지정하는 데 유용합니다

```html
@push('scripts')
    <script src="/example.js"></script>
@endpush
```

필요한 경우 여러번 스택에 푸쉬할 수 있습니다. 전체 스택 컨텐츠를 렌더링 하려면, 스택 이름을 @stack 지시어에 전달하면 됩니다

```html
<head>
    <!-- Head Contents -->

    @stack('scripts')
</head>
```

#### 서비스 인젝션-주입
**@inject**
라라벨의 서비스 컨테이너에서 서비스를 반환 할 때 사용하는 지시어 입니다.

```html
#첫번째 인자: 서비스를 할당할 변수
#두번째 인자: 의존성을 해결하려는 서비스 클래스 또는 인터페이스의 이름
@inject('metrics', 'App\Services\MetricsService')

<div>
    Monthly Revenue: {{ $metrics->monthlyRevenue() }}.
</div>
```

#### 블레이드 기능 확장
블레이드에서는 `directive 메소드`를 사용하여 사용자가 고유한 지시어을 정의할 수 있습니다.
블레이드 컴파일러가 사용자가 정의한 지시어을 발견하면 지시어에 정의된 콜백 함수를 호출합니다.

다음의 예제는 전달된 DateTime 인스턴스인 $var의 포맷을 변경하는 @datetime($var) 지시어을 생성합니다

```php
<?php

namespace App\Providers;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Perform post-registration booting of services.
     *
     * @return void
     */
    public function boot()
    {
        Blade::directive('datetime', function ($expression) {
            return "<?php echo ($expression)->format('m/d/Y H:i'); ?>";
        });
    }

    /**
     * Register bindings in the container.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
```

이 지시어에 어떤 것이든 전달된 표현식에서 format 메소드를 체이닝합니다. 따라서 이 예제의 지시어의 경우에는 최종적으로 생성되는 PHP 코드

```php
<?php echo ($var)->format('m/d/Y H:i'); ?>
```

>블레이드 지시어 로직을 수정한 뒤에는, 블레이드 뷰 캐시를 삭제할 필요가 있습니다. 블레이드 뷰의 캐시는 view:clear 아티즌 명령어를 사용하여 제거할 수 있습니다.

#### 커스텀 If구문
커스텀한 지시어를 프로그래밍하면 간단한 조건문을 정의할 때 필요 이상으로 복잡한 경우가 많습니다. 이때문에 블레이드는 클로저를 사용하여 커스텀 If 시지어를 보다 빠르게 정의할 수 있는 Blade::if 메소드를 제공합니다. 예를 들어 현재 어플리케이션의 구동 환경을 확인하는 커스텀 지시어를 정의하면 다음처럼 AppServiceProvider 의 boot 메소드에서 사용할 수 있습니다

```php
use Illuminate\Support\Facades\Blade;

/**
 * Perform post-registration booting of services.
 *
 * @return void
 */
public function boot()
{
    Blade::if('env', function ($environment) {
        return app()->environment($environment);
    });
}
```

위와 같이 정의한 수 다음과 같이 사용할 수 있습니다.

```
@env('local')
    // The application is in the local environment...
@elseenv('testing')
    // The application is in the testing environment...
@else
    // The application is not in the local or testing environment...
@endenv
```
