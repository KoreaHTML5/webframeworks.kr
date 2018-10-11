---
layout : tutorials
category : tutorials
title : PHP 라라벨 5 On Mac - 21.Controller II
subcategory : setlayout
summary : PHP 라라벨 5에 대해 알아봅니다.
permalink : /tutorials/weplanet/Laravel21
author : danielcho
tags : laravel
title_background_color : F1F71A
---





> ROA(Resource Oriented Architecture) 설계의 중심에 Resource가 있고 HTTP Method를 통해 Resource를 처리 할 수 있도록
RESTful 컨트롤러를 작성 해보도록 하겠습니다.

Http Method를 통해 리소스를 제공하기 때문에 우선 기본적인 부분부터 살펴보겠습니다.

Verb | Endpoint |   Method Override  |  Controller Method  | Description
-----| -------- | ------------------ | ------------------- | ------------
GET	 | /posts/	| |index()|	Post 모델 Collection 보기
GET	 | /posts/{id} | |show()|	id를 가지는 Post Instance 보기
GET	 | /posts/create| |create()|	새로운 Post Instance 생성을 위한 폼
POST | /posts| |store()|	새로운 Post Instance 생성
GET	 |/posts/{id}/edit| |edit()|	id를 가진 Post Instance 업데이트 폼
POST |/posts/{id}|	_method=PUT (x-http-method-override: PUT)|	update()|	id를 가진 Post Instance 업데이트
POST |/posts/{id}|	_method=DELETE (x-http-method-override: DELETE)|	delete()|	id를 가진 Post Instance 삭제

또한, 표준된 문서는 없지만 다음의 특징을 잘 숙지하여 작성함으로써 성공적인 프로젝트를 만들 수 있습니다.

- 클라이언트/서버 구조 : 일관적으로 독립되어야 한다.
- 동일한 요청에 동일한 응답을 주어야 합니다.
- 무상태(Stateless) : 각요청 간 클라이언트의 Context는 서버에 저장되어서는 안 된다.
- 캐시가능(Cacheable) : WWW에서와 같이 클라이언트는 응답을 Caching 할 수 있어야 한다.
- 계층화(Layered System) : 클라이언트는 보통 대상 서버에 직접 연결 또는 중간 서버를 통해 연결되는지 모른다.
- Code on demand(option) : 자바 애플릿/ 자바스크립의 제공으로 서버가 클라이언트를 실행 시킬 수 있는 로직을 전송하여, 기능을 확장 할수 있다.
- 인터페이스 일관성 : 아키텍처를 단순화하고, 작은 단위로 분리하여, 클라이언트-서버 파트 별로 독립적으로 개선 될 수 있도록 한다.
- 자체 표현구조(Self-Descriptiveness) : API 메시지만 보고도 어떤 API인지를 이해 할수 있는 자체 표현 구조를 가진다.

## RESTful 리소스 컨트롤러 생성

1\. artisan CLI 를 통해 다음과 같은 명령을 실행합니다.

```
$ php artisan make:controller PostsController --resource
```

2\. `app/Http/Controllers`에 PostsController.php 가 자동으로 생성되었습니다.
`--resource` 옵션을 붙임으로써 다음과 같은 메소드 들이 자동으로 생성되었음을 확인 할 수 있습니다.

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PostsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
```

3\. 이번에는 `/routes/api.php`에 라우트 설정을 다음과 같이 작성합니다. 이전 라라벨에서는 라우터의 구분없이 `route.php`에서 통합관리 하였지만, 이번 버전에서는 분리되었네요.
`api.php`파일에 다른 http method 는 동일하지만, get()은 resource()로 써야 한다는 것에 주의 하시기 바랍니다.

```php
<?php

use Illuminate\Http\Request;

Route::resource('posts', 'PostsController');
```

4\. 라라벨에서 생성한 라우터 경로들을 CLI 로 리스트로 확인할 수 있습니다. 지금까지 진행한 내용을을 이 CLI 로 확인 해보도록 하겠습니다.

```
$ php artisan route:list
```

결과

```
+--------+-----------+-----------------------+---------------+----------------------------------------------+--------------+
| Domain | Method    | URI                   | Name          | Action                                       | Middleware   |
+--------+-----------+-----------------------+---------------+----------------------------------------------+--------------+
|        | GET|HEAD  | /                     |               | App\Http\Controllers\WelcomeController@index | web          |
|        | GET|HEAD  | api/posts             | posts.index   | App\Http\Controllers\PostsController@index   | api          |
|        | POST      | api/posts             | posts.store   | App\Http\Controllers\PostsController@store   | api          |
|        | GET|HEAD  | api/posts/create      | posts.create  | App\Http\Controllers\PostsController@create  | api          |
|        | GET|HEAD  | api/posts/{post}      | posts.show    | App\Http\Controllers\PostsController@show    | api          |
|        | PUT|PATCH | api/posts/{post}      | posts.update  | App\Http\Controllers\PostsController@update  | api          |
|        | DELETE    | api/posts/{post}      | posts.destroy | App\Http\Controllers\PostsController@destroy | api          |
|        | GET|HEAD  | api/posts/{post}/edit | posts.edit    | App\Http\Controllers\PostsController@edit    | api          |
|        | GET|HEAD  | api/user              |               | Closure                                      | api,auth:api |
|        | GET|HEAD  | index                 |               | App\Http\Controllers\indexController@index   | web          |
+--------+-----------+-----------------------+---------------+----------------------------------------------+--------------+
```

여기서 확인 할 수 있듯이, `/routes/web.php` 와  `/routes/api.php`의 쓰임이 다름을 확인할 수 있습니다.
