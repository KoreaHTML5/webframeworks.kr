---
layout : getstarted
title : Meteor.js
category : getstarted
subcategory : js
summary : Meteor.js는 Node기반의 풀스택 프레임워크입니다.
permalink : /getstarted/meteorjs
title_background_color : eeeeee
title_color : 444444
tags : meteor meteor.js node.js backend javascript library
author : ppillip
---

# Meteor.js 시작하기

##	미티어의 특징
미티어는 브라우저 / 서버 / 데이터베이스에 이르기까지 자바스크립트로 구성된 풀스텍 플랫폼으로 커맨드라인 한 줄만으로 빠르게 개발 환경을 구성할수 있는 풀스텍 자바스크립트 플랫폼이다.
미티어의 특징을 살펴 보면 아래와 같다.

* 빠른 개발환경 구성 : 미티어는 커맨드라인에서 입력하는 한 줄의 프로젝트 생성 명령 만으로 브라우저/서버/데이터베이스 까지 개발 환경 구성이 한번에 끝난다. 내장된 몽고디비(www.mongodb.com)는 JSON(JavaScript Object Notation, www.json.org)을 저장하는 데이터베이스로 요즘 주목 받고 있는 NoSQL 데이터베이스 중 하나이다.
	실시간 데이터 동기화
* 발행/구독(publish/subscribe)이라는 구조로 브라우저와 서버 간의 데이터 교환이 실시간으로 이루어진다. 따라서 채팅,sns 같은 실시간이 필요한 애플리케이션을 쉽게 작성할 수 있다. 짧은 코드로 말이다.
	풀스택 자바스크립트
* 클라이언트와 서버를 지나 데이터베이스에 이르기까지 모두 자바스크립트만으로 구현한다. 데이터는 클라이언트에서 작성된 데이터 포멧을 몽고디비까지 같은 형태로 저장이 가능하다. 그야말로 풀스택 자바 스크립트 플렛폼이다.
	모바일 통합 개발환경
* 미티어에서 개발한 앱은 데스크탑 뿐만 아니라 Android, iOS에서 사용 할 수 있는 패키지로 배포 할 수 있다. 특히 모바일 환경은 내장된 코드로바(http://cordova.apache.org/)를 통하여 하이브리드 앱 형태로 배포하므로 별도의 컴파일 환경을 구축할 필요가 없이 미티어 만으로 앱 제작이 가능하다.
	풍부한 패키지

미티어는 프레임워크가 아니며, atmosphere(http://atmosphere.meteor.com)라는 미티어 패키지 저장소가 존재한다.
여기서 여러분이 좋아하는 프레임워크들을 프론트 부터 백엔드 까지 골라서 사용 할수 있다.

## 미티어 설치
미티어는 MAC OSX 나 LINUX 환경에서 설치는 아래와 같이 셸에서 간단하게 설치 가능하다.

```
$ curl https://install.meteor.com/ | sh
```

만약 윈도우 환경이라면 미티어 홈페이지(https://www.meteor.com/)에서 다운로드 하여 설치가 가능하다.
미티어 설치가 완료 됬다면 이제 간단히 프로젝트를 생성해보자. 미리 준비한 Projects 폴더에서 다음과 같이 입력한다.

```
~/Projects$ meteor create test
test: created.

To run your new app:
cd test
meteor
```

이제 생성한 test 프로젝트를 구동하기위해 test 프로젝트 폴더로 이동하자. meteor 입력 후 엔터를 치면 아래 그림처럼 미티어가 구동된다. 이게 전부다. 정말 쉽고 간단하다!

```
~/Projects$ cd test
~/Projects/test$ meteor
[[[[[ ~/test ]]]]

=> Started proxy.
=> Started MongoDB.
=> Started your app.

=> App running at: http://localhost:3000/
```

이제 브라우저에서 확인 해보면 다음 화면이 우리를 반겨준다.
![Metoer 구동화면](imgs/welcome_to_meteor.png)

종료는 콘솔에서 “Ctrl+c” 입력으로 가능하다.

## 미티어의 디렉토리와빌드
미티어는 우리가 작성하는 모든 코드들을 읽어들여 컴파일한 후 구동 위치에 맞게 빌드/배포 한다. 모든게 자동으로 이루어 지지만 미티어는 폴더명 파일명에 따라 빌드순서 배포 위치를 결정한다.
이번 장에서는 다음순서로 미티어가 어떻게 폴더/파일명을 인식하는지 알아보자.

###	프로젝트 생성 및 설치 확인
테스트 프로젝트 이름은 myFriends 정하고 다음 그림 처럼 프로젝트를 생성한다.

![Metoer 프로젝트 생성](imgs/proj_001.png)

설치 하는 동안 그림과는 달리 몇가지 변화를 눈치 챘겠지만 미티어 서버로 부터 필요한 파일들을 다운받고 버전을 체크 하기도 한다.
이제 미티어를 구동해보자. 우선 myFriends 라는 디렉토리로 이동후 meteor run 이라는 명령으로 미티어를 구동한다.

![Metoer 프로젝트 생성](imgs/proj_002.png)

위 명령만으로 내부에서는 많은 일이 일어난다. 내부 프록시를 구동하고 , 몽고디비를 구동하며 미티어 어플리케이션 서버가 300번 포트에서 구동함을 볼수 있다.
이제 브라우저에서 http://localhost:3000 으로 접속 하여보자.

![Metoer 프로젝트 생성](imgs/proj_003.png)

우리의 첫번째 어플리케이션이 명령 몇줄 만에 구동 되었다.
몽고디비? 정말 구동 하는지 확인 해볼까? 좋다 확인해보자. 확인을 위하여 미티어는 그대로 두고 쉘하나를 더 열어 보자. 그리고 프로젝트 폴더(myFriends) 에서 “meteor mongo” 라고 명령을 실행해보자

![Metoer 프로젝트 생성](imgs/proj_004.png)

미티어는 구동시에 3001번 포트로 몽고디비를 구동한다. 미티어는 기본으로 meteor 란 데이터베이스를 사용한다. 물론 외부에 몽고디비를 사용 하고 있다면 외부 몽고디비 사용도 가능하다.

###	기본폴더구조
미티어가 기본으로 생성하는 폴더 및 파일 구조는 다음과 같다.

```
/.meteor
myFriends.css
myFriends.html
myFriends.js
```

우리가 생성한 myFriends 라는 폴더 안의 구조 이다. 제일 왼편에 .meteor 라는 폴더는 우리가 작성한 코드가 빌드되어 구동될 실제 프로그램이 담길 소스이다. 미티어가 최초 구동되거나, 또는 구동 후 파일이 수정될 경우, 변경사항을 미티어가 실시간으로 감지한뒤 실제 구동될 소스를 .meteor에 빌드한다. 우리가 직접 만질 필요는 거의 없다. (폴더안의 내용은 다음 기회에 자세히 알아 본다)
미티어가 어떻게 빌드 하는지 개발자가 전부 알아야할 필요는 없다. 하지만 미티어가 폴더 이름에 따라 빌드하는 순서 및 사용되는 위치를 결정하므로 폴더 이름에 따른 규칙을 알아야 할 필요가 있다.
이제, 실제로 프로젝트에 사용될 폴더를 생성하면서 미티어의 디렉토리에 대하여 알아 보자 우선 미티어가 만들어준 3개의 파일은 삭제한다. 그리고 다음 그림과 같이 폴더 5개를 생성한다.

```
/client
/lib
/private
/public
/server
```

폴더에 대한 특징을 살펴 보면

* client: client 폴더 안의 파일들은 오로지 브라우저에서만 실행될 코드이다. lib 폴더에서 if(Meteor.isClient){ … } 구문으로 작성된 코드들과 동작 위치가 같다.
* lib: 이 폴더안의 파일들은 서버와 클라이언트 모두 동작한다. 따라서 각종 js 유틸이라던가 collection정의된 파일 또는 공통 method 들을 작성하여 저장한다. 이 폴더안에 자바스크립트 코드들은 Meteor.isClient , Meteor.isServer를 이용하여 동작하는 곳이 어딘가를 알수 있다. 따라서 구동위치에 따라 다른 동작의 코드를 작성 할 수 있다.
* private: 서버쪽에서만 사용될 리소스들을 넣어둘수 있다. Assets API 를 통하여 서버쪽에서만 접근 할 수 있다.
* server: 폴더이름 그대로, 서버에서 구동될 코드들이 위치할 폴더이다.
* public: public 폴더는 미티어가 웹서버가 되어 정적 리소스를 서비스 하는 폴더이다. 루트 패스 “/” 로 서비스 한다. 가령 public 폴더 안에 images 폴더를 생성할 경우 “/images” 경로로 서비스 한다. favicon.ico , robots.txt 화일들을 위치하는데 적합하다. 따라서 미티어 프로젝트이전에 서비스 하였던 기본 html 들이나 rest 서비스만 있으면 동작하는 angularjs 또는  jQuery 프로젝트들을 정상 구동 실수 있다.
* server: 서버측 프로그램들이 위치 하여야한다. Publish 가 선언된 서버측 파일이나 서버에서 구동되는 method 등이 위치한다. lib 폴더에서 if(Meteor.isServer){ … } 구문으로 작성된 코드들과 동작 위치가 같다.

### 로딩순서

개발시에 순서에 민감한 코드들은 packages 를 작성하거나 Meteor.startup 함수를 이용할 것을 추천한다. 이렇게 작성된 코드들은 meteor 가 의존성 및 민감성 관리를 해준다. 따라서 미티어를 사용하는 개발자들은 grunt.js 같은 의존성 관리 패키지들을 별도로 사용 할 필요가 없다. 다만 미티어가 로딩하는 순서를 알고 코드를 작성하면 undefined 오브젝트 에러나 특정패키지를 찾지 못하는 경우를 막을수가 있다. 미티어가 파일을 로딩하는 순서는 다음과 같다.

1.	하위디렉토리 파일을 먼저 로딩한다. 따라서 루트는 가장 마지막에 로딩된다.
2.	같은 위치의 파일과 폴더는 alphabetical order 를 따른다.
3.	lib 폴더는 우선 로딩된다. 라이브러리에 해당하는 자바스크립트코드들은 꼭 lib 폴더에 넣는다.
4.	main.* 파일은 제일 마지막에 로딩된다.

미티어가 위 순서대로 로딩하는것은 꼭 알아 두자.

### 추천하는 폴더 구조

#### 루트레벨의 폴더 구조

```
/customer/lib
/customer/client
/customer/server
/posts/lib
/posts/client
/posts/server
```
위 구조처럼 사용자 관련 , 포스트 관련 하여 폴더를 결정하고 그 하위에 공통 / 서버 / 클라이언트 를 구분 하는 방법이다. 업무별로 개발시 장점을 가지고 있을수 있겠다.

#### 폴더 안에 서버 클라이언트를 구분하는 방법

```
/lib/customer
/lib/posts
/client/customer
/client/posts
/server/customer
/server/posts
```

위 방법은 서버/클라이언트/공통 등으로 구분을 지어 파일 및 소스를 관리 하고 싶을때 사용 하기 위한 방법이다.
case1 에서 case 2 간의 이동이 가능하고 심지어 프로젝트 운영중에 바꾸어도 동작하는데 이상이 없다. 이는 우리가 미티어가 인식하는 폴더명을 잘 알고 그에 맞게 작성한다면 미티어는 폴더명이나 구조를 큰 문제 삼지 않는다. 심지어 운영하고 있는 실시간으로 바꾸어도 큰 문제가 없었다.

#### 저자의 실제 프로젝트 케이스
실제 프로젝트에서는 다음과 같이 형태로 작성 하였다.

```
/server – method.js , method4angular.js , router.js , publish.js
/client – 매뉴별로 폴더를 정하고 폴더안에 a.html,a.js 로 한쌍씩 넣었습니다.
/public – angularjs 소스 파일 (meteor 로 넘어 바꾸기전 소스들)
/lib - 기본 collection api만을 사용한 코드. asser.js , schema.js , util.js 등등
```

## 템플릿 (Template)
미티어의 프론트 엔드 프레임워크인 Blaze 는 Spacebar 라는 템필리팅 엔진을 사용, 개발자들이 ui 를 작성 할수 있도록 개발 방법을 제공한다.

###	템플릿으로 뷰 정의하기

우선 코드 작성에 앞서 client 폴더에 화일 3개(friendsList.html, friendsList.js, main.html)를 작성한다.

![템플릿뷰정의](imgs/template001.png)

미티어에서 화면은 template 단위로 작성하며 작성된 코드를 뷰에 나타내기 위하여 {{>템플릿}} 과 같은 형태의 코드를 사용한다.

![템플릿삽입](imgs/template002.png)

```<template name=”friendsList”>``` 안의 내용이 body 안에 삽입되어 실제로 다음 그림과 같이 브라우저에 보이게 된다.

![결과화면](imgs/template003.png)


우리가 작성한 friendsList 라는 이름의 html 템플릿은 Template.friendsList 라는 오브젝트의 하위 메소드들을 통하여 기능을 구성하게 된다.

![친구목록템플릿](imgs/template004.png)

위 그림처럼 하위 메소드는 helpers,events 라는 매니저 함수와 onCreated , onRendered , onDestroyed 라는 함수들로 이루어저 있다.
여기서 Template 라는 오브젝트는 Blaze 의 하위 오브젝트이다.
우선 helpers 를 통하여 html 템플릿에 데이터를 제공 하여 보자. listName 이라는 표현식 헬퍼를 사용하여 helpers 로 부터 데이터를 제공받아 html 로 랜더링하는 코드는 다음과 같다.

![친구목록템플릿](imgs/template005.png)

이제 #each 블록 헬퍼를 사용하여 리스트를 표현하여 보자. 코드는 다음과 같다.

{% highlight javascript %}
//client/friendsList.html
<template name="friendsList">
    {% raw %} {{listName}} {% endraw %}
    <table>
        {% raw %} {{#each list}} {% endraw %}
        <tr>
            <td>{{no}}</td>
            <td>{{name}}</td>
            <td>{{email}}</td>
            <td><button name="remove">삭제</button></td>
        </tr>
        {% raw %} {{/each}} {% endraw %}
    </table>
</template>
{% endhighlight %}

{%highlight javascript %}
// client/friendsList.js
Template.friendsList.helpers({
    listName : function(){
        return "나의 친구들 목록";
    },
    list : function(){
        var arr = [
             {no:4,name:"박승현",email:"ppillip@gmail.com"}
            ,{no:3,name:"전지현",email:"jjh@gmail.com"}
            ,{no:1,name:"김완선",email:"kws@gmail.com"}
            ,{no:2,name:"카라",email:"kara@gmail.com"}
        ];
        arr = _.sortBy(arr,function(obj){ return obj.no;});
        return arr;
    }
});
{% endhighlight %}

위코드에서 헬퍼 함수를 보면 언더스코어 함수 ( _.sort ) 를 이용하여 간단한 sort 를 구현하여 리턴하였다. 실제로 each 와 list 헬퍼함수와의 관계를 그림으로 그려보면 다음과 같다.

![each와list의 관계](imgs/template006.png)

Template.friendList.helper 에 list 라는 헬퍼 함수가 {{#each list}} 형태로 사용되어 진다. 또한 each 안에서 list 로부터 리턴된 배열의 각 요소(JSON)의 key 와 value 값이 key 로 직접 접근 하여 표현이 가능하다. {{no}} , {{name}} 이런 형태로 접근한다.
지금까지 구현의 화면은 다음 그림과 같다.

![구현결과](imgs/template007.png)


###	이벤트 처리하기
템플릿에서 클릭 이벤트를 처리 하는 방법에 대하여 알아보자.
하위 템플릿으로 분리 하기 위하여 다음과 같이 파일을 생성한다.

![하위템플릿파일생성](imgs/event001.png)


생성후에 friendsList 템플릿의 코드를 수정한다.

{% highlight javascript %}
// client/friendsList.html
<template name="friendsList">
    {% raw %}{{listName}} {% endraw %}
    <table>
        {% raw %}{{#each list}}
            {{>friendsListItem}}
        {{/each}}{% endraw %}
    </table>
</template>
{% endhighlight %}

그리고 friendsListItem.html 코드를 다음과 같이 만든다.

{% highlight javascript %}
// client/friendsListItem.html
<template name="friendsListItem">
    <tr>
        <td>{{no}}</td>
        <td>{{name}}</td>
        <td>{{email}}</td>
        <td><button name="remove">삭제</button></td>
    </tr>
</template>
{% endhighlight %}

{{#each list}} 에서 list 가 리턴한 각 배열의 요소가 friendsListItem 의 컨텍스트로 자동 주입 되므로 실제로 화면에는 아무 변화가 없다.
자 이제 remove 라는 이름의 버튼이 클릭 될경우 현재 컨텍스트를 콘솔에 찍는 기능을 구현해보자.
우선 friendsListItem.js 화일에 다음과 같이 이벤트를 정의 한다.

{% highlight javascript %}
// client/friendsListItem.js
Template.friendsListItem.events({
    "click button[name=remove]" : function(evt , tmpl){

        console.log(this);

    }
});
{% endhighlight %}

위의 코드처럼 구현한 뒤 리스트의 모든 버튼을 한번씩 클릭한 결과는 다음 그림과 같다.

![클릭결과](imgs/event002.png)

콘솔에 this 를 출력 하였는데 위 그림처럼 #each 로 부터 주입된 컨텍스트들이 모두 출력 되었다.
(이제 더이상 리스트를 만든 값을 유지하기 위해 고생스러운 코딩을 하지 않아도 된다) html 템플릿 오브젝트로 부터 event를 정의 하는 자세한 방법에 대하여 다음 그림을 참조 하자.

![이벤트내용](imgs/event003.png)

위 그림에서 evt 라는 파라메터는 클릭이 일어난 버튼이 되겠다. jQuery 로 $(evt.target) 으로 호출하면 실제 오브젝트를 제어 할수 있다. 또한 2번째 파라메터인 tmpl 은 함수내에서 tmpl.find(돔셀렉터) 를 이용하여 해당 이벤트가 일어난 tmpl 안에서 셀렉터를 사용하여 또다른 html오브텍트를 찾아 낼수 있다. 만약 텍스트 박스가 있었다면 tmpl.find(“input[type=text]”).value 로 값을 찾아 낼수 있겠다. 사용패턴은 차차 알아보기로 하자.

## 컬렉션 (Collection)
미티어의 내장 데이터베이스인 몽고디비를 다루기 위한 필수 오브젝트가 미티어 컬렉션이다. 이번장에서는 컬렉션을 다루는 방법에 대하여 알아본다.

###	컬렉션 선언
우선 lib/collections.js 화일을 생성하자.

![컬렉션화일생성](imgs/collection001.png)

collections.js 파일에 다음과 같이 컬렉션을 선언한다.

{% highlight javascript %}
// lib/collections.js
Friends = new Mongo.Collection("friends");
{% endhighlight %}

여기서 Friends는 미티어 컬렉션 오브젝트 이고 몽고디비의 friends 라는 컬렉션을 처리 하는 함수(메소드)들을 가지고 있다.

###	Insert 맛보기
이제 초기 데이터를 입력 하는 코드를 lib/collections.js 화일에 작성한다.
lib 폴더에 있는파일은 서버와 클라이언트 모두에 배포 되는 파일이므로 Meteor.isServer 코드를 사용하여 서버쪽에서만 구동되게 작성한다. 코드는 다음과 같다.

{% highlight javascript %}
// lib/collections.js
Friends = new Mongo.Collection("friends");
if(Meteor.isServer){ /* 서버에서만 구동 되게함 */
    /*미티어가 구동시 최초 한번 실행함*/
    Meteor.startup(function(){
        if( Friends.find().count() == 0 ) {
            Friends.insert({no: 1, name: "김완선", email: "kws@gmail.com"});
            Friends.insert({no: 2, name: "카라", email: "kara@gmail.com"});
            Friends.insert({no: 3, name: "전지현", email: "jjh@gmail.com"});
            Friends.insert({no: 4, name: "박승현", email: "ppillip@gmail.com"});
        }
    });

}
{% endhighlight %}

위 코드에서 Friends(미티어컬렉션)의 2가지 메소드를 사용해 보았다. 미티어 처음 구동시에 find 메소드를 이용하여 count 가 0일경우에 insert를 실행 하도록 하였다. 몽고디비가 처음이라면 약간 낯설수도 있는 문장이다. 몽고디비는 json 형태의 데이터를 저장하는 데이터베이스로서 입력값 또한 json 형태로 받는다. 이제 콘솔을 다시 하나 열고 프로젝트 폴더로 이동한뒤 ```meteor mongo``` 명령을 실행하여 보자.
![콘솔몽고실행](imgs/collection002.png)

실행 되었다면 미티어 컬렉션의 insert 명령으로 doc(몽고디비 컬렉션에 저장되는 단위 데이터)로 저장 되었는지 확인해보자. 확인 해보기 위하여 현재 콘솔에서 ```db.friends.find()``` 명령을 수행한다.
![콘솔몽고파인드실행](imgs/collection003.png)

4개가 정상적으로 입력 되었다. 여기에는 우리가 입력하지 않은 _id 가 자동으로 들어가 있는데, _id 값이란 몽고디비 컬렉션에 유일(unique)키이다. insert 시에 _id 값을 정해주지 않으면 자동으로 _id 값을 생성하여 insert 한다. 이제 4건이 json doc(다큐먼트) 가 저장되어 저장되었음을 확인 했다.


###	find 맛보기

고정 배열로 friendsList 목록을 작성 하였는데 이제 미티어 컬렉션을 이용해서 몽고디비에서 가져오려고 한다. 기존의 코드를 아래 코드처럼 수정해보자.

{% highlight javascript %}
// client/friendsListItem.js
Template.friendsList.helpers({
        listName : function(){
            return "나의 친구들 목록";
        },
        list : function(){
            return Friends.find({} , { sort : {no:-1} });
        }
    });
{% endhighlight %}

미티어 컬렉션 find 메소드의 첫번째 입력 값은 조회 조건이다. 두번째 값으로 no 필드를 기준으로 역순 정렬 하여 리턴 하게 하였다. 이제 화면을 확인 해보자.

![파인드브라우져확인](imgs/collection004.png)

정상적으로 가져 왔다. 성공이다.

###	remove 맛보기
미티어 컬렉션을 remove 를 실제로 삭제를 구현 하면서 테스트 해보자. 위 그림에서 삭제 버튼이 누르면 this 를 출력하게 작성 하였는데, 실제로 this 를 클릭 하였을경우 콘솔에 찍힌 데이터를 확인 해보면 다음 그림과 같다.
![브라우져콘솔확인](imgs/collection005.png)

_id 가 보인다. 이제 몽고디비 컬렉션의 유일키 인_id 값을 기준으로 삭제하는 코드를 작성해보자.

{% highlight javascript %}
// client/friendsListItem.js
Template.friendsListItem.events({
    "click button[name=remove]" : function(evt , tmpl){
        console.log(this);
        Friends.remove({_id:this._id});
    }
});
{% endhighlight %}

삭제 조건도 find 의 검색조건과 같다. 위 코드에서는 _id 가 this._id 와 같은 다큐먼트를 삭제 하라는 의미이다. 이제 버튼을 클릭해서 삭제해보자. 아래 그림처럼 2건이 정상적으로 삭제 되었다.

![브라우져콘솔확인2](imgs/collection006.png)

##	발행(Publish)과 구독(Subscribe)
###	발행 구독의 원리

미티어는 서버측 데이터베이스로 몽고디비를 기본으로 사용한다. 최근에는 postgreSQL이나 mysql 도 사용 가능하다. 반면 클라이언트는 미니몽고라고하는 작은 몽고디비가 있으며 우리가 사용하는 미티어컬렉션 오브젝트로 대부분의 질의가 가능하다.
우리가 지금까지 작성한 클라이언트측의 질의문은 사실 미니몽고에 하는 질의문이었다. 이것은 다음 그림처럼 서버와 클라이언트간 발행/구독을 통하여 서버측의 데이터 일부분을 클라이언트로 내려 주고 변경분을 sync 하기 때문이다.

![구독원리](imgs/pub001.png)

하지만 우리는 한번도 발행/구독 코드를 작성한 적이 없었다. 이것은 autopublish 라고 하는 기본 패키지가 설치 되어 있었기 때문이다.
하지만 이 패키지는 위험하기 짝이 없다. 서버에 있는 모든 컬렉션의 모든 다큐먼트(데이터)를 브라우저로 내려보내주기 때문이다. 그래서 MDG(meteor developer group) 에서도 프로토 타이핑용이라고 말하고 있다.

지금부터 저 autopublish 패키지를 삭제 하고 발행/구독을 구현해보자.

![콘솔명령어](imgs/pub002.png)

위 콘솔을 자세히 살펴보면

1.	meteor list 라는 명령으로 현재 프로젝트에 설치 되어 있는 패키지들을 확인 가능하다. 현재는 1.2 기본 패키지만 설치 되어 있는 상태임을 알수 있다.
2.	autopublish 1.0.4 버전의 패키지가 설치 되어 있음을 확인 할 수 있다.
3.	meteor remove autopublish 라는 명령으로 해당 패키지를 삭제 하였다.

이제 화면을 살펴 보자.
![진행결과](imgs/pub003.png)

목록이 사라 졌다. 우리는 발행도 구독도 설정하지 않았으니 미니몽고에 데이터가 없을테고 화면에 보이지도 않을것이다.

###	발행구독 구현하기

지금부터 사라진 데이터를 돌려 놓아 보자.
발행은 서버에서 동작하기 때문에 다음 그림처럼 publish.js 화일을 server 폴더에 작성한다.

![프로젝트브라우저](imgs/pub004.png)

발행 코드를 다음과 같이 작성 한다.

{% highlight javascript %}
Meteor.publish("friendsList",function(obj){
    var condition = obj || {};
    console.log(condition);
    return Friends.find(condition);
});
{% endhighlight %}

서버쪽에서는 데이터를 보낼 준비가 다 되었다. 설명은 뒤로 하고 일단 클라이언트 쪽에서 구독하는 코드를 작성한다. 작성위치는 friendsList 의 onCreated 콜백 함수에 작성한다.

{% highlight javascript %}
Template.friendsList.onCreated(function () {
    this.subscribe("friendsList",{});
});
{% endhighlight %}

onCreated 는 템플릿 인스턴스가 생성되는 시점에 한번 호출되는 함수 이다. 이것으로 인하여 friendsList 템플릿이 파괴될때까지 서버로 부터 지속적으로 데이터의 변경사항을 주고 받는다.
너무 오래 기다렸다. 일단 화면부터 살펴 보자.
![구독결과화면](imgs/pub005.png)

다시 돌아 왔다!! 이제 서버소스와 클라이언트 소스를 살펴 보자.
![소스](imgs/pub006.png)

subscribe 함수는 Meteor.subscribe 함수와 동일하다. 만약 onCreated 시에 Meteor 오브젝트의 subscribe 를 사용하면 onDestoryed에서 구독을 중지 하여야한다. subscribe 함수가 구독 핸들러를 리턴하므로 구독핸들러에 있는 stop 함수를 이용하여 구독을 중지 하여 주면 된다. 하지만, 템플릿내부에 있는 subscribe 함수를 사용하면 별도로 stop 을 해줄 필요가 없다.

그리고 subscribe 의 두번째 파라메터는 구독 요청시 발행하는 측에 인자로 전달된다. 따라서 publish 구문에서는 구독 요청으로 부터 넘어오는 인자를 가지고 적절하게 조회조건으로 사용 하면 된다.

