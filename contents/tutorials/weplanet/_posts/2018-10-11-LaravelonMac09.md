---
layout : tutorials
category : tutorials
title : PHP 라라벨 5 On Mac - 9.블레이드 템플릿 II(View)
subcategory : setlayout
summary : PHP 라라벨 5에 대해 알아봅니다.
permalink : /tutorials/weplanet/Laravel09
author : danielcho
tags : laravel
title_background_color : F1F71A
---





> 블레이드 템플릿을 사용해 데이터 바인딩을 후 표시되는 데이터를 쉽게 컨트롤 할 수 있습니다. 기존에 사용한 PHP 컨트롤 구조와 유사한 구조로 제공되는 조건문과 반복문을 살표 보도록 하겠습니다.

#### 조건문
**@if, @elseif, @else, @endif**

```html
@if (count($records) === 1)
    I have one record!
@elseif (count($records) > 1)
    I have multiple records!
@else
    I don't have any records!
@endif
```

**@unless**

```html
@unless (Auth::check())
    You are not signed in.
@endunless
```

**@isset, @empty**

```html
@isset($records)
    // $records is defined and is not null...
@endisset

@empty($records)
    // $records is "empty"...
@endempty
```

**@auth, @guest**

```html
@auth
    // The user is authenticated...
@endauth

@guest
    // The user is not authenticated...
@endguest
```

필요한 경우 auth guard 지정하여 사용 가능

```html
@auth('admin')
    // The user is authenticated...
@endauth

@guest('admin')
    // The user is not authenticated...
@endguest
```

**hasSection** : 세션이 내용을 가지고 있는지 확인

```html
@hasSection('navigation')
    <div class="pull-right">
        @yield('navigation')
    </div>

    <div class="clearfix"></div>
@endif
```

**@switch, @case, @break, @default, @endswitch**

```html
@switch($i)
    @case(1)
        First case...
        @break

    @case(2)
        Second case...
        @break

    @default
        Default case...
@endswitch
```

#### 반복문
**@for, @endfor**

```html
@for ($i = 0; $i < 10; $i++)
    The current value is {{ $i }}
@endfor
```

**@foreach, @endforeach**

```html
@foreach ($users as $user)
    <p>This is user {{ $user->id }}</p>
@endforeach
```

**@forelse, @empty, @endforslse**

```html
@forelse ($users as $user)
    <li>{{ $user->name }}</li>
@empty
    <p>No users</p>
@endforelse
```
**@while**

```html
@while (true)
    <p>I'm looping forever.</p>
@endwhile
```

>반목문 사용시 반복중 종료 또는 중단을 할 경우 다음과 같이 사용할 수 있습니다.

```html
@foreach ($users as $user)
    @if ($user->type == 1)
        @continue
    @endif

    <li>{{ $user->name }}</li>

    @if ($user->number == 5)
        @break
    @endif
@endforeach
```

OR

```html
@foreach ($users as $user)
    @continue($user->type == 1)

    <li>{{ $user->name }}</li>

    @break($user->number == 5)
@endforeach
```

#### 루프 변수
반복문 사용시, $loop를 사용하여 인덱스와 반복문의 첫 번째 또는 마지막 위치를 사용할 수 있습니다.

```html
@foreach ($users as $user)
    @if ($loop->first)
        This is the first iteration.
    @endif

    @if ($loop->last)
        This is the last iteration.
    @endif

    <p>This is user {{ $user->id }}</p>
@endforeach
```

반복문이 중첩된 경우라면 `parent`속성을 통해 액세스 할 수 있습니다.

```html
@foreach ($users as $user)
    @foreach ($user->posts as $post)
        @if ($loop->parent->first)
            This is first iteration of the parent loop.
        @endif
    @endforeach
@endforeach
```

이 외, **$loop** 속성

속성 | 설명
--------- | ---------
$loop->itertion|현재 반복문의 횟수(1부터 시작)
$loop->remaining|반복문의 남은 횟수
$loop->count|반복되는 배열의 총 아이템 수
$loop->first|현재 반복문이 첫번째 인지 확인
$loop->last|현재 반복문이 마지막 인지 확인
$loop->depth|중첨된 반복문의 깊이
$loop->parent|반복문이 중첩된 경우 액세스 할 수 있는 루프 변수

#### 주석
블레이드는 또한 뷰에 주석을 정의할 수 있습니다. 하지만 HTML 주석과는 다르게 블레이드 주석은 어플리케이션이 반환하는 HTML에 포함되어 있지 않습니다 

```
{{-- This comment will not be present in the rendered HTML --}}
```

