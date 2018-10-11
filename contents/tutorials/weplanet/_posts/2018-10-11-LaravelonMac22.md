---
layout : tutorials
category : tutorials
title : PHP 라라벨 5 On Mac - 22.route
subcategory : setlayout
summary : PHP 라라벨 5에 대해 알아봅니다.
permalink : /tutorials/weplanet/Laravel22
author : danielcho
tags : laravel
title_background_color : F1F71A
---





> 뷰와 컨트롤을 매칭해주는 라우터에서 라우터 URL 의 길이가 너무 길었을 때에 수정이 이뤄진다면 어떨까요? 긴 URL 풀 네임을 모두 변경을 해야 하며, 재 호출(redirect)를 할 경우
너무 긴 이름으로 난감할 때가 있습니다. 이 때, route 에 Alias 를 지정해준 다면 편해집니다.

### Alias for a URL route

`routes\web.php`

```php
Route::('very/long/URL/and/long/really', function (){
        return 'hello world';
});
```

위의 경로로 URL을 연결 할 때 다음과 같이 작성합니다

```php
Route::('/short/url', function (){
        return redirect('very/long/URL/and/long/really');
});
```

하지만 긴 URL에 Alias 를 붙인다면 쉽게 연결 할 수 있게 됩니다.

```php
Route::get('very/long/URL/and/long/really', ['as' => 'longUrlRoute'], function (){

        return 'hello world';
});
Route::get('VLURL', function() { return redirect()->route('longUrlRoute'); });
```

Route Alias로 지정을 하면 View 에서도 동일 하게 사용 할 수 있습니다.

```html
<!DOCTYPE html>
<html>
...
<body>
//블레이드 템풀릿
<a href="{{ route('longUrlRoute') }}">very/long/URL/and/long/really 로 가기</a>
<body>
</html>
```

##### 주의 사항
중복된 Route의 경우, 항상 위에 정의된 것이 아래에 정의된 것을 오버라이드 합니다.
예를 들어 [GET ]users/count 라는 Route가 있다면 RESTful Resource 정의보다 먼저 정의하는게 안전합니다.

### Route Parameter

> 게시판에서 수정 또는 상세/삭제가 이뤄 질 때, 해당 게시물에 대한 IDX(게시물 id)를 Get Parameter 형식으로 전달하여
이를 Controller에서 이용할 때 다음 내용을 참고하면 됩니다.

artisan CLI

```
$ php artisan make:controller PostReplyController --resource
```

`routes\api.php`

```php
Route::resource('posts.reply', 'PostReplyController');
```

다음의 방법으로 확인

```
$ php artisan route:list

+--------+-----------+-------------------------------------+---------------------+--------------------------------------------------+--------------+
| Domain | Method    | URI                                 | Name                | Action                                           | Middleware   |
+--------+-----------+-------------------------------------+---------------------+--------------------------------------------------+--------------+
|        | GET|HEAD  | /                                   |                     | App\Http\Controllers\WelcomeController@index     | web          |
|        | GET|HEAD  | api/posts                           |                     | App\Http\Controllers\PostsController@show        | api          |
|        | GET|HEAD  | api/posts/{post}/reply              | posts.reply.index   | App\Http\Controllers\PostReplyController@index   | api          |
|        | POST      | api/posts/{post}/reply              | posts.reply.store   | App\Http\Controllers\PostReplyController@store   | api          |
|        | GET|HEAD  | api/posts/{post}/reply/create       | posts.reply.create  | App\Http\Controllers\PostReplyController@create  | api          |
|        | GET|HEAD  | api/posts/{post}/reply/{reply}      | posts.reply.show    | App\Http\Controllers\PostReplyController@show    | api          |
|        | PUT|PATCH | api/posts/{post}/reply/{reply}      | posts.reply.update  | App\Http\Controllers\PostReplyController@update  | api          |
|        | DELETE    | api/posts/{post}/reply/{reply}      | posts.reply.destroy | App\Http\Controllers\PostReplyController@destroy | api          |
|        | GET|HEAD  | api/posts/{post}/reply/{reply}/edit | posts.reply.edit    | App\Http\Controllers\PostReplyController@edit    | api          |
|        | GET|HEAD  | api/user                            |                     | Closure                                          | api,auth:api |
|        | GET|HEAD  | index                               |                     | App\Http\Controllers\indexController@index       | web          |
+--------+-----------+-------------------------------------+---------------------+--------------------------------------------------+--------------+
```


Controller 에서는 다음과 같이 전달 인자 값을 설정 하여 접근 할 수 있습니다.

`app\Http\Controllers\PostReplyController.php`

```php
class PostReplyController extends Controller
{
    public function index($id)
    {
        // GET http://localhost:8080/posts/1/reply
        // [App\Http\Controllers\PostReplyController::index] $id = 1
        return '[' . __METHOD__ . "] \$postId = {$id}";
    }

    ...

    public function show($id, $replyId)
    {
        // GET http://localhost:8080/posts/1/reply/10
        // [App\Http\Controllers\PostReplyController::show] $id = 1, $replyId = 10
        return $id . '-' . $replyId;
    }
}
```
