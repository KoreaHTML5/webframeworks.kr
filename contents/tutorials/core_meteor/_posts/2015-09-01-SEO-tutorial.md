---
layout : tutorials
title :  SEO 제대로 처리하기
category : tutorials
subcategory : data-binding
summary : facebook/google 등 외부 서비스들이 접근하는 페이지 요청을 서버사이드 렌더링 없이 필요한 부분만 WebApp package를 사용하여 효율적으로 구현한다.는
permalink : /tutorials/core_meteor/1_meteor_seo
title_background_color : RGB(8, 78, 119)
tags : javascript meteor SEO
author : acidsound
---
# [Core Meteor] SEO 제대로 처리하기

SPA(Single Page Application)에서 항상 나오는 이슈들 중에 facebook이나 검색엔진에 어떻게 노출할 것인가 문제가 있다.

SEO(Search Engine Optimization:검색 엔진 최적화)는 한번 해놓으면 월급이 들어가지 않는 성실한 마케팅 부서 직원과도 같아 하지 않을 이유가 없어서 대중에게 노출되는 서비스를 만드는 분들이라면 꼭 한번 쯤 고민해볼 주제다.

일반 브라우저를 통해 들어오지 않는 facebook graph API 같은 SNS 용 링크 첨부나 google과 같은 검색엔진들에 귀중한 서버 자원을 낭비하지 않으면서 어떻게 하면 효율적으로 그들에게 우리의 자료를 제공할 것인가?

phantomJS 같은 headless browser로 요청 URL마다 서버에서 렌더링하여 처리하는 것도 방법일 수 있다. 하지만 실제 서비스에서 돌려보면 매번 System Call을 하는 것이 부담스럽고 오류율도 만만치 않다.

그렇다면, 대안은? 직접 만드는 것이다. 적을 알고 나를 알면 두려워질게 없다. Meteor는 기본적으로 node.js 위에서 작동하므로 당연히 서버사이드 요청을 처리하는 것을 기존 서버사이드 렌더링 방식으로 처리할 수 있다.

크게 두 가지로 나눠 대응 전략을 세워보고 실제로 적용해본다.

## google의 검색 봇
검색을 위해 작동하는 크롤러들은 사용자와는 다르게 브라우저를 거치지 않고 직접 들어와서 일회성으로 페이지를 요청하기 때문에 Meteor를 포함한 대부분의 SPA에서는 클라이언트 javascript가 작동하지 않아 올바른 내용을 가져가지 않을 수 있다.
네이버는 [```신디케이션(Syndication)```](http://webmastertool.naver.com/index.naver) 을 사용하는 것이 효율적이지만 예외적인 경우라 이 글의 범주를 넘으므로 언급하지 않는다.

[https://developers.google.com/webmasters/ajax-crawling/docs/specification](https://developers.google.com/webmasters/ajax-crawling/docs/specification) 를 참조하면 ajax crawling의 경우 URL 뒤에 ```?_escaped_fragment_=```를 포함하고 접근할 때 검색엔진에 노출하고 싶은 내용은 보내주면 되겠다.

## facebook 및 SNS
facebook을 비롯한 SNS에서 신경 써줘야 할 부분은 내가 서비스하고 있는 URL의 링크가 미리보기 같은 기능이 정상적으로 작동할 수 있도록 맞춰야 한다.

medium의 경우를 보면

{% highlight html %}
<meta property="og:site_name" content="Medium">
<meta property="og:title" content="Medium">
<meta property="og:url" content="https://medium.com/">
<meta property="og:image" content="https://cdn-static-1.medium.com/_/fp/img/default-preview-image.IsBK38jFAJBlWifMLO4z9g.png">
<meta property="fb:app_id" content="542599432471018">
<meta property="og:description" content="Welcome to Medium, a place to read, write, and interact with the stories that matter most to you. Every day thousands of new voices share…">
<meta name="twitter:site" content="@Medium">
<link rel="publisher" href="https://plus.google.com/103654360130207659246">
<meta name="twitter:card" content="summary">
<meta name="twitter:app:name:iphone" content="Medium">
<meta name="twitter:app:id:iphone" content="828256236">
<meta name="twitter:app:url:iphone" content="medium:/">
<meta property="al:ios:app_name" content="Medium">
<meta property="al:ios:app_store_id" content="828256236">
{% endhighlight %}

이처럼 facebook의 opengraph를 포함한 다양한 내용을 제공한다.

그럼, 접근한 대상이 무엇인지는 어떻게 알 수 있을까? 정답은 HTTP Request의 user-agent를 살펴보는 것이다.

전략은 나왔다. 그러면 이제 어떻게 구현할 것인지 살펴보자.

## Connect package를 사용하자
Meteor는 다른 javascript framework(angularJS, Backbone, Dojo, Ember, React..)들과 달리 full-stack javascript platform이다.

node.js 기반이기 때문에 당연히 서버사이드 프로그래밍을 할 수 있고, 기존 HTTP요청에 응답하는 전통적인 구조의 웹 어플리케이션도 만들 수 있다.

그 진입점은 [WebApp package](http://docs.meteor.com/#/full/webapp) 에서 출발해보자.

WebApp package는 namespace가 없는 Meteor 기본 패키지이므로 ```meteor add webapp```을 꼭 하지 않아도 기본적으로 사용할 수 있다.

먼저, meteor docs의 사용 예를 한번 보자.

{% highlight javascript %}
// Listen to incoming HTTP requests, can only be used on the server
WebApp.connectHandlers.use("/hello", function(req, res, next) {
  res.writeHead(200);
  res.end("Hello world from: " + Meteor.release);
});
{% endhighlight %}
그렇다. node.js를 처음 접하시는 분들이 많이 사용하는 express.js의 사용패턴과 비슷하다.

WebApp.connectHandlers는 express.js의 근간을 이루고 있는 Connect(https://github.com/senchalabs/connect) 객체를 그대로 반환한다.

특정 상황인 요청을 따로 처리하고 나머지는 Meteor 가 처리하도록 하는 예제를 보자.

{% highlight javascript %}
var app = WebApp.connectHandlers;
app.use('/api/rss.xml', function(req, rss, next) {
  if(headers['user-agent']==='bot') {
    res.end(req.headers);
  } else {
    next();
  }
});
{% endhighlight %}

일반적인 경우엔 그냥 next()를 타고 ```curl -A "bot" http://localhost:3000/api/rss.xml``` 과 같이 ```bot```이라는 특정 user-agent를 지정하고 요청할 경우 res객체를 통해 응답하고 Meteor가 처리하지 않게 할 수 있다.

```/post/:id``` 와 같이 인자를 받고 싶다면 connect 패키지의 미들웨어인 https://www.npmjs.com/package/connect-route 를 사용하거나 아니면 이를 직접 구현한 https://atmospherejs.com/meteorhacks/picker 같은 패키지를 사용하면 더욱 편리하다.

## phantomJS를 Meteor에서 쓰는 방법
Meteor는 대체로 빠른 프로토타이핑을 위해 덜 좋지만 학습곡선이 낮은 도구들을 미리 제공한다.

Collection을 빠르게 만들고 바로 테스트하기 위하기 위해 항상 조건 없이 모든 내용을 Find 하는 ```autopublish```라던가 클라이언트 콘솔에서 insert, remove 같은 명령을 바로 적용할 수 있는 ```insecure``` 같은 패키지들이 그렇다.

만일, 검색엔진이 문제라면 대부분의 경우 ```meteor add spiderable```하여 ```spiderable``` 패키지를 추가하는 것으로 해결할 수 있다.

문제는 head 태그 부분인데 클라이언트에서 해결 할 수 없는 것은 아니지만 가볍고 정교한 처리를 위해 spiderable은 실서버에 적용하지 않고 직접 구현하기 위해 ```spiderable```의 작동구조를 이해할 필요가 있다.

[https://github.com/meteor/meteor/blob/release-1.1/packages/spiderable/spiderable_server.js#L55](https://github.com/meteor/meteor/blob/release-1.1/packages/spiderable/spiderable_server.js#L55) 소스의 내용을 한번 살펴보자. 생각보다 복잡하지 않다.

{% highlight javascript %}
Spiderable.userAgentRegExps = [
    /^facebookexternalhit/i, /^linkedinbot/i, /^twitterbot/i];
.
.
.
WebApp.connectHandlers.use(function (req, res, next) {
  // _escaped_fragment_ comes from Google's AJAX crawling spec:
  // https://developers.google.com/webmasters/ajax-crawling/docs/specification
  if (/\?.*_escaped_fragment_=/.test(req.url) ||
      _.any(Spiderable.userAgentRegExps, function (re) {
        return re.test(req.headers['user-agent']); })) {
{% endhighlight %}

위에서 말한 두 가지의 전략을 그대로 따른다.
정규식 함수를 사용하여 req.url이 _escaped_fragment_를 포함하고 있거나 user_agent가 facebookexternalhit, linkedinbot, twitterbot 과 같은 문자열로 시작하는지 검사하고 있다.

server/ 폴더 아래에 위와 같은 구현을 추가하면 된다.

## 서버사이드에서 템플릿 엔진을 사용한 렌더링
결론은 간단하다. connect를 사용하여 특정 URL에 접근하는 대상을 선별하여 SNS나 검색엔진의 봇들이 원하는 결과를 response에 보내는 것이 전부다.

실제로 해보면 상황별로 템플릿을 만들어 놓고 필요한 부분만 렌더링하면 편리한데

Blaze Template을 사용하는 경우 [meteorhacks:ssr]
(https://github.com/meteorhacks/meteor-ssr) 을 사용하면 ```/private``` 폴더안에 template 파일을 넣어놓고 필요한 컬렉션을 직접 가져와서 사용할 수 있다.


## 실 적용 사례
```meteor add meteorhacks:meteor-ssr``` 을 사용하여 두 개의 코드를 만든다.

/private/seoTemplate.html

{% highlight html %}
<html xmlns:cc="http://creativecommons.org/ns#">
<head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# krown-meteor-com: http://ogp.me/ns/fb/krown-meteor-com#">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{title}}</title>
    <link id="feedLink" rel="alternate" type="application/rss+xml" title="RSS" href="/feed{{url}}">
    <link rel="canonical" href="{{url}}">
    <meta name="title" content="{{title}}">
    <meta name="referrer" content="always">
    <meta name="description"
          content="{{summarize content}}">
    <meta property="og:site_name" content="krown">
    <meta property="og:title" content="{{title}}">
    <meta property="og:url" content="{{url}}">
    <meta property="og:image" content="{{featuredImage}}">
    <meta property="fb:app_id" content="{{appId}}">
    <meta property="og:description"
          content="{{summarize content}}">
</head>
</html>
{% endhighlight %}

/server/seo.js

{% highlight javascript %}
var userAgentRegExps = [
    /^facebookexternalhit/i, /^linkedinbot/i, /^twitterbot/i];
WebApp.connectHandlers.use(function (req, res, next) {
    if (/\?.*_escaped_fragment_=/.test(req.url) ||
        _.any(userAgentRegExps, function (re) {
            return re.test(req.headers['user-agent']);
        })) {
        if (/^\/postView\/.+/.test(req.url)) {
            SSR.compileTemplate("seo", Assets.getText('postView.html'));
            var post = Posts.findOne(req.url.match(/^\/postView\/(.+)/)[1]));
            Template.seo.helpers({
                author: function () {
                    return Meteor.users.findOne(post.createdUser);
                },
                summarize: function (text) {
                    return summarize(text, 100, ' ...').replace(/\n/g, ' ');
                },
                appId: function () {
                    return Meteor.settings.facebook.production.appId
                }
            });
            res.end("<!DOCTYPE html>" + SSR.render("seo", _.extend(post, {
                    url: req.url
                })));
        }
    } else {
        next();
    }
});
{% endhighlight %}

Posts라는 Collection에서 해당 ID를 바라보는 한 건에 대해 렌더링하는 예인데 클라이언트에서 하듯 Template을 작성하고 seo.js 안에서 ```SSR.compileTemplate```을 통해 Template html 파일을 설정하고 helpers에 필요한 값들을 설정하고 난 뒤 SSR.render를 통해 response로 내보낸다.

만일 React를 사랑하고 익숙한 경우라면 ```meteor add react```를 이용해 react npm package를 사용해서 처리해보자.

Meteor에선 클라이언트와 서버 양쪽 모두 추가가 되므로 별다른 설정없이 바로 쓰면 된다. 매우 편리하고 매력적이지 않은가!