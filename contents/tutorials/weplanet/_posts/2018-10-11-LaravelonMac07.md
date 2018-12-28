---
layout : tutorials
category : tutorials
title : PHP 라라벨 5 On Mac - 7.Routing
subcategory : setlayout
summary : PHP 라라벨 5에 대해 알아봅니다.
permalink : /tutorials/weplanet/Laravel07
author : danielcho
tags : laravel
title_background_color : F1F71A
---





> 파일 중 "resources/views/welcome.blade.php" 처음 라라벨을 세팅 후 기본 페이지 이다. http://myProject.dev/ 를 입력하면 기본 페이지로 설정된 resources/views/welcome.blade.php 가 출력된다.
이유는 Routing이 해당 페이지와 경로를 맵핑해 주고 있기 때문이다.

* app/Http/routes.php

```php
Route::get('/', function () {
    return view('welcome');
});
```

>위와 같이 '/'를 요청하면, function 으로 싸진 Clousure가 동작한다. Closure 안을 보면, view()라는 function에 'welcome'이란 인자를 넘겨서 반환된 값을 다시 반환한다. 'welcome'이란 인자는 resources/views/welcome.blade.php 란것을 알 수 있다. 즉, Closure에서 반환된 값이 Http 응답으로 전달된다.
view(string $view)가 아니라 스트링을 반환하면 어떻게 될까? 브라우저에 스트링이 출력된다.

```php
Route::get('/', function () {
    return 'Hello World';
});
```

또한 라라벨에 기본 내장 되어 있는 resources/views/errors/503.blade.php과 같이 하위 뷰를 응답하려면 어떻게 해야할까? 하위 디렉토리는 '.' 또는 '/'로 구분한다.

```php
Route::get('/', function () {
    return view('errors.503');
});
```

`참고` 파일명 뒤에 *.blade.php 은 blade 템플릿 파일을 의미한다.

`참고` `view()`는 Helper Function 이다. `return View::make('welcome')` 와 같이 라라벨이 제공하는 Facade('파사드' 또는 '빠사드'라 읽는다.)를 이용할 수도 있다. `view()->` 까지 입력했을 때 코드힌트가 나와서 Helper Function을 더 권장한다. 그리고, Facade는 Static Access 형태를 빌려 쓰고 있지만, 실제로 백그라운드에서는 Service Container에 의해서 새로운 instance를 생성하여 메소드에 접근하므로, Anti Pattern이 아니다

`참고` resources/views/errors/503.blade.php 뷰는 라라벨 어플리케이션이 유지보수 모드에 들어갔을 때 사용자에게 보여주는 뷰이다.

```
$ artisan down
#alias 설정을 안했다면
$ php artisan down
```

명령으로 유지보수 상태로 전환하고,

```
$ artisan up
#alias 설정을 안했다면
$ php artisan up
```

으로 서비스 상태로 복귀할 수 있다. 유지보수 모드는 **웹 서버를 중지 시킨 것은 아니다**.
