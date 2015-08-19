---
layout : getstarted
title : React
category : getstarted
subcategory : js
summary : 페이스북이 만든 자바스크립트 프레임워크(라이브러리)인 React를 Comment를 사용한 예제와 함께 시작해본다.
permalink : /getstarted/reactjs
title_background_color : 593D7C
title_color : FFFFFF
tags : reactjs javascript framework getstarted
author : weplanetJT
---

# React 시작하기

## React란?

React는 사용자 인터페이스를 만들기위해 페이스북과 인스타그램에서 개발한 오픈소스 자바스크립트 라이브러리로써,
사용자 인터페이스(User Interface)에 집중하며, Virtual DOM을 통해 속도와 편의를 높이고,
단방향 데이터플로우를 지원하여 보일러플레이트 코드를 감소시켜, 많은 사람들이 React를 MVC의 V를 고려하여 선택합니다.
즉, React는 지속해서 데이터가 변하는 대규모어플리케이션의 구축이라는 하나의 문제를 풀기 위해서 만들어졌습니다.
아래는 React에서 강점들입니다.

- **단순함**
 당신의 어플리케이션이 어떤 주어진 시점에 어떻게 보여야할지를 단순하게 표현함으로써, React는 그 데이터들이 변할 때,
자동적으로 모든 UI 업데이트들을 관리할 것입니다.
- **선언적인 문법**
 데이터가 변할 때, React는 개념적으로 ‘새로고침’ 버튼을 눌러서, 변화된 부분을 알아채 업데이트하게 됩니다.
- **구성적인 컴포넌트 개발**
 React는 재사용가능한 컴포넌트들을 개발하기 위한 모든 것입니다. 사실, React로 당신이 할 수 있는 오직 한가지는 컴포넌트를 개발하는 것 입니다.
그것들은 캡슐화 되어있기 때문에, 컴포넌트들은 재사용될 수 있고, 테스트될 수 있으며, 관심의 분리(sepration of concerns)를 지키게 해줍니다.


## 설치하기

React를 시작하기 가장 빠른 방법은 CDN(Contents Delivery Network)을 통해서 Javascript를 제공받는 것 입니다.

{% highlight javascript %}
// React Library
<script src="https://fb.me/react-0.13.3.js"> </script>
// In-browser JSX transformer
<script src="https://fb.me/JSXTransformer-0.13.3.js"> </script>
{% endhighlight %}

만약 [Bower](http://webframeworks.kr/getstarted/bower/)를 선호한다면, 아래와 같은 방법으로 쉽게 React를 이용 가능합니다.

```
$ bower install --save react
```



## JSX

React를 사용하기 위해서 꼭 JSX를 사용해야하는 건 아니지만, JSX를 사용하게 되면, 속성을 가진 트리 구조로 정의를 할 수 있어,
개발을 보다 편하게 할 수 있습니다. 그리고 React의 많은 예제에서도 JSX를 사용하고 있기에, React의 구성을 설명하기 전에,
JSX에 대해서 설명하도록 하겠습니다.

JSX라는 단어는 Javascript와 XML을 합침으로써 탄생하였으며, 기존 XML을 허용하기 위한 Javascript의 확장 문법입니다.
React는 JSX를 지원함으로서, 개발자가 Javascript 내부에 마크업 코드를 직접 작성할 수 있게 하는데,
JSX는 단순히 XML을 허용만 하는게 아니라, Javascript의 변수나 프로퍼티의 값의 바인딩에 대한 추가적인 기능도 제공합니다.
사용 예는 아래와 같습니다.

{% highlight javascript %}
//jsx가 없을 때
React.createElement('a', {href: 'https://facebook.github.io/react/'}, '안녕하세요!')
//jsx를 사용했을 때:
<a href="https://facebook.github.io/react/">안녕하세요!</a>
{% endhighlight %}

React는 컴포넌트가 관심을 분리하는데 있어서 디스플레이 로직(Display Logic)이나 템플릿보다 올바른 방법이라고 강하게 믿고 있습니다.
마크업과 마크업을 만들어내는 코드는 친밀하게 결합되어있고, 디스플레이 로직은 빈번하게 매우 복잡해지기 마련이고,
템플릿언어를 이용해 이것들을 통해 표현하는것은 매우 성가신 일이기 때문입니다.
이 문제를 해결하기 위해 사용자 인터페이스를 만드는 Javascript 코드로부터 HTML과 컴포넌트 트리들을 직접적으로 생성하는 것이
최고의 해결책이라는 것을 발견했고, 개발자로 하여금 HTML 문법을 이용해 아래와 같이 Javascript 객체를 만들게 합니다.

(참고1) JSX는 HTML처럼 보이지만 작업하다보면 마주치게 될 몇가지 중요한 차이점이 있으니
[링크](http://reactkr.github.io/react/docs/jsx-gotchas-ko-KR.html)에서 참고하시기 바랍니다.

## Reactive Data Flow
UI를 가지고 할 수 있는 가장 기본적인 작업은 어떠한 데이터를 표시하는 것입니다.
React는 데이터를 표시하고, 데이터가 변할 때 마다 인터페이스를 가장 최신으로 유지시키는 작업을 쉽게 만듭니다.

간단한 예제와 함께 살펴보도록 하겠습니다. 우선 hello-react.html 이라는 파일을 아래의 코드와 함께 만들어보겠습니다.
{% highlight html %}
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Hello React</title>
    <script src="https://fb.me/react-0.13.3.js"></script>
    <script src="https://fb.me/JSXTransformer-0.13.3.js"></script>
  </head>
  <body>
    <div id="example"></div>
    <script type="text/jsx">

      // ** Example Template **

    </script>
  </body>
</html>
{% endhighlight %}

이제 부터는 아래 sample01.js 코드가 위 예제의 Example Template라고 주석처리 되어있는 부분에 들어갔다고 가정하고 설명하도록 하겠습니다.

{% highlight javascript %}
// sample01.js
var HelloWorld = React.createClass({
  render: function() {
    return (
      <p>
        안녕, <input type="text" placeholder="이름을 여기에 작성하세요" />!
        지금 시간은 {this.props.date.toTimeString()} 입니다.
      </p>
    );
  }
});

setInterval(function() {
  React.render(
    <HelloWorld date={new Date()} />,
    document.getElementById('example')
  );
}, 500);
{% endhighlight %}

위의 예제를 웹브라우저에서 열은 후, 이름을 텍스트 필드에 써보면, 동작을 관리하는 어떤 코드도 작성하지 않았음에도, 텍스트 필드에 쓰여진 이름은 그대로이지만,
시간을 표시하는 부분은 계속 바뀌는 것을 확인할 수 있습니다. 이것이 가능한 것은 React가 필요한 경우에만 DOM을 조작하기 때문입니다.
React는 기존의 DOM보다 빠른 React내부의 DOM모형 (Virtual DOM)을 이용하여 변경된 부분을 측정하고, 가장 효율적인 DOM조작방법을 계산합니다.
위 컴포넌트에 대한 입력은 Properties를 줄인 props라고 불리는데, props들은 JSX문법에서는 속성(attirbutes)로 전달이 됩니다.
props는 컴포넌트 안에서 조작이 불가능한 엘리먼트(immutable elements)로서 생각해야하고, this.props를 덮어씌우려고해서는 안됩니다.
props에 대해서는 아래에서 더 자세히 살펴보도록 하겠습니다.


## 컴포넌트
### 컴포넌트 구성
이번엔 hello-react.html의 예제의 example template에 tutorial1.js의 코드를 삽입하여, 컴포넌트의 구성에 대해 간략히 살펴보도록하겠습니다.
{% highlight javascript %}
// tutorial1.js
var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="commentBox"> Hello, world! I am a CommentBox. </div>
    );
  }
});
React.render( <CommentBox />, document.getElementById('content') );
{% endhighlight %}

React의 컴포넌트들은 props와 state를 받아 HTML을 렌더 하는 단순한 함수들로 생각해도 될 만큼 매우 단순합니다.
다만, 여기서 주의 해야할 점은 React의 컴포넌트들은 단 하나의 루트 노드(root node)만을 렌더할 수 있으므로,
만약 여러개의 노드를 리턴하고 싶다면, 여러개의 노드를 단 하나의 루트 노트드로 조합해야 합니다.컴포넌트의 조합에 대해서는 아래에서 더 살펴보도록 하겠습니다.
위 예제를 보면 새로운 React 컴포넌트를 만들기 위해 React.createClass()로 Javascript 객체를 만들어 render메소드를 담아 넘겼습니다.
render메소드는 React 컴포넌트 트리를 리턴해서 최종적으로 실제 HTML을 그리는 역할을 하는데, 개발된 컴포넌트들의 트리를 리턴할 수 도 있기 때문에,
React이 컴포넌트는 보다 조합가능(Compsable)하게 됩니다.
이를 통해 최상위 컴포넌트의 인스턴스를 만들고, 두번째 인수로 전달받은 DOM 엘리먼트에 마크업을 삽입합니다. \<div> 태그는 실제 DOM 노드는 아니고,
React div 컴포넌트의 인스턴스로서, React가 다룰 수 있는 데이터의 표시자나 조각이라고 생각하시면 됩니다.
React는 Raw HTML 문자열을 생성하는 것이 아니기 떄문에 XSS를 기본적으로 방지할 수 있습니다.
참고로 HTML 엘리멘트의 이름은 소문자로 시작하고 커스텀 React클래스 이름은 대문자로 시작하고 있습니다.

### 컴포넌트 조합하기
위 예제에서 나온 CommentBox를 아래의 구조처럼 변경하며, 컴포넌트를 조합해보도록 하겠습니다.

- CommentList
  - Comment
- CommentForm

우선 CommentList와 CommentForm을 위한 뼈대를 구축하겠습니다. 위 예제에서와 마친가지로 단순히 \<div>태그 하나입니다.
{% highlight javascript %}
// tutorial2.js
var CommentList = React.createClass({
  render: function() {
    return (
      <div className="commentList"> 안녕! 난 댓글목록이야. </div>
    );
  }
});
var CommentForm = React.createClass({
  render: function() {
    return (
      <div className="commentForm"> 안녕! 난 댓글 폼이야. </div>
    );
  }
});
{% endhighlight %}

tutorial1예제를 수정하여, CommentBox가 CommentList와 CommentForm과 조합되도록 수정하겠습니다.

{% highlight javascript %}
// tutorial1.js
var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        <h1>댓글</h1>
        <CommentList />
        <CommentForm />
      </div>
    );
  }
});
{% endhighlight %}

### 컴포넌트 프로퍼티 (Component Properties)
위에서 간단하게 설명되었던 props를 통해서 부모로부터 받은 데이터에 의존하는 comment 컴포넌트를 만들어보겠습니다.
부모 컴포넌트로 부터 받은 데이터는 자식 컴포너트에서 ‘프로퍼티’로 사용이 가능합니다.
이 ‘프로퍼티들’은 this.props를 통해 접근가능하며, props를 사용해 Comment 컴포넌트는 CommentList에서 전달받은 데이터를 읽어들이고,
마크업을 렌더할 수 있을 것입니다.

{% highlight javascript %}
// tutorial3.js
var Comment = React.createClass({
  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor"> {this.props.author} </h2>
        {this.props.children}
      </div>
    );
  }
});
{% endhighlight %}

JSX 내부의 중괄호로 둘러싸인 JavaScript 표현식(어트리뷰트나 엘리먼트의 자식으로 사용된)을 통해 텍스트나 React 컴포넌트를 트리에 더할 수 있습니다.
this.props를 통해 컴포넌트에 전달된 특정한 어트리뷰트들에, this.props.children을 통해 중첩된 엘리먼트들에 접근할 수 있습니다.

#### 직접 입력

Comment 컴포넌트를 만들었으니, 컴포넌트에 글쓴이와 댓글을 넘겨보도록 합시다. 이런 방식을 통하여 각 고유한 comment에서 같은 코드를 재사용할 수 있습니다.
먼저 댓글 몇 개를 CommentList에 추가해 봅시다:

{% highlight javascript %}
// tutorial2.js
var CommentList = React.createClass({
  render: function() {
    return (
      <div className="commentList">
        <Comment author="Pete Hunt">댓글입니다</Comment>
        <Comment author="Jordan Walke">또 다른 댓글입니다</Comment>
      </div>
    );
  }
});
{% endhighlight %}

부모 컴포넌트인 CommentList에서 자식 컴포넌트인 Comment에 데이터들을 전달하고 있는것을 확인할 수 있습니다.
예를 들어, 우리는 어트리뷰트로 Pete Hunt를, XML 형식의 자식 노드로 댓글입니다를 첫 번째 Comment로 넘겼습니다.
위에서 언급했듯이 Comment 컴포넌트는 그들의 '프로퍼티'를 this.props.author, this.props.children를 통해 접근합니다.

#### 데이터 모델 연결

지금까지는 소스코드에 직접 댓글을 넣었습니다. 이제부터는 tutorial5.js의 JSON 데이터 덩어리를 댓글 목록에 렌더해보겠습니다.
최종적으로는 서버에서 데이터가 내려오겠지만, 지금은 소스에 직접 데이터를 넣어봅시다:

{% highlight javascript %}
// tutorial5.js
var data = [
  {author: "Pete Hunt", text: "댓글입니다"},
  {author: "Jordan Walke", text: "*또 다른* 댓글입니다"}
];
{% endhighlight %}

위 데이터를 모듈화된 방식으로 CommentList에 넣어야 합니다. props을 이용해 데이터를 넘기도록 CommentBox와 React.render()의 호출 코드를 수정합시다.

{% highlight javascript %}
// tutorial1.js
var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        <h1>댓글</h1>
        <CommentList data={this.props.data} />
        <CommentForm />
      </div>
    );
  }
});

React.render(
  <CommentBox data={data} />,
  document.getElementById('content')
);
{% endhighlight %}

이제 CommentList에서 데이터를 다룰 수 있으니, 댓글을 동적으로 렌더할 수 있게 코드를 수정해보겠습니다.

{% highlight javascript %}
// tutorial4.js
var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function (comment) {
      return (
        <Comment author={comment.author}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});
{% endhighlight %}

#### 서버에서 데이터모델 가져오기

이제 데이터를 소스에 직접 넣는 방식에서 서버에서 동적으로 받아서 처리하는 방식으로 바꾸기위해, 데이터 prop을 삭제하고 처리할 URL로 변경해 줍시다.
tutorial5.js는 commnents.json으로 파일명을 변경합니다.

{% highlight javascript %}
// tutorial1.js
React.render(
  <CommentBox url="comments.json" />,
  document.getElementById('content')
);
{% endhighlight %}

이 컴포넌트는 이전 것과 다르게, 스스로 다시 렌더링해야 합니다. 컴포넌트는 서버에서 요청이 들어올때까지는 아무 데이터도 가지고 있지 않다가,
특정한 시점에서 새로운 댓글을 렌더할 필요가 있을 것입니다

### 컴포넌트 스테이트 (Component State)
#### 반응적 스테이트
위의 예제들은, 각각의 컴포넌트는 props를 기반으로 한번 렌더되었습니다. props는 불변성을 갖고있고, 부모에서 전달되어 부모에게 "소유" 되어 있습니다.
그래서 컴포넌트에 상호작용을 구현하기 위해선 props가 아닌, 가변성을 갖는 state를 이용하는게 좋습니다.
this.state는 컴포넌트에 한정(private)되며 this.setState()를 통해 변경할 수 있고, state가 업데이트 되면, 컴포넌트는 자신을 스스로 다시 렌더링합니다.
render() 메소드는 this.props와 this.state를 위한 함수로 선언적으로 작성됩니다. 프레임워크에서 입력값에 따른 UI가 항상 일관성 있음을 보장해줍니다.
이제 댓글 데이터의 배열을 CommentBox의 state로 추가해서, 서버가 데이터를 가져오면 댓글 데이터가 변경되도록 수정해보겠습니다.

{% highlight javascript %}
// tutorial1.js
var CommentBox = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>댓글</h1>
        <CommentList data={this.state.data} />
        <CommentForm />
      </div>
    );
  }
});
{% endhighlight %}

getInitialState() 는 컴포넌트의 생명주기동안 한 번만 실행되며 컴포넌트의 초기 state를 설정합니다.

#### 스테이트 업데이트하기
서버에서 GET 방식으로 JSON을 넘겨받아 최신의 데이터가 state에 반영되도록 정적 JSON 파일을 사용해서 간단하게 만들어보겠습니다.

{% highlight javascript %}
// tutorial5.json
[
  {"author": "Pete Hunt", "text": "댓글입니다"},
  {"author": "Jordan Walke", "text": "*또 다른* 댓글입니다"}
]
{% endhighlight %}

서버에 비동기 요청을 위해 jQuery를 사용합니다.
주의: 우리의 앱이 AJAX 애플리케이션으로 변화하고 있기 때문에, 이제 파일 시스템의 파일을 참조하는 대신 웹서버를 사용하도록 앱을 개발해야 합니다.
React의 GitHub을 참고해주세요.

{% highlight javascript %}
// tutorial1.js
var CommentBox = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>댓글</h1>
        <CommentList data={this.state.data} />
        <CommentForm />
      </div>
    );
  }
});
{% endhighlight %}

componentDidMount는 컴포넌트가 렌더링 된 다음 React에 의해 자동으로 호출되는 메소드이고, 동적 업데이트의 핵심은 this.setState()의 호출입니다.
우리가 이전의 댓글 목록을 서버에서 넘어온 새로운 목록으로 변경하면 자동으로 UI가 업데이트 될 것입니다.
이 반응성 덕분에 실시간 업데이트에 아주 작은 수정만 이루어집니다.
이제 AJAX 호출을 별도의 메소드로 분리하고, 컴포넌트가 처음 로드된 시점부터 2초 간격으로 계속 호출(폴링)되도록 해보겠습니다.

{% highlight javascript %}
// tutorial1.js
var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>댓글</h1>
        <CommentList data={this.state.data} />
        <CommentForm />
      </div>
    );
  }
});

React.render(
  <CommentBox url="comments.json" pollInterval={2000} />,
  document.getElementById('content')
);
{% endhighlight %}

#### 새로운 댓글 추가하기
위에서 댓글목록을 만들었으니, 이제는 사용자에게 이름과 내용을 입력받고 댓글을 저장하는 CommentForm 컴포넌트를 만들어보도록 하겠습니다.

{% highlight javascript %}
// tutorial4.js
var CommentForm = React.createClass({
  render: function() {
    return (
      <form className="commentForm">
        <input type="text" placeholder="이름" />
        <input type="text" placeholder="내용을 입력하세요..." />
        <input type="submit" value="올리기" />
      </form>
    );
  }
});
{% endhighlight %}

이제 폼에 상호작용을 붙여 보겠습니다. 사용자가 폼을 전송하는 시점에 우리는 폼을 초기화하고 서버에 요청을 전송하고 댓글목록을 업데이트해야 합니다.
우선 폼의 submit 이벤트를 감시하고 초기화 해주는 부분을 작성하겠습니다.

{% highlight javascript %}
// tutorial4.js
var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var author = React.findDOMNode(this.refs.author).value.trim();
    var text = React.findDOMNode(this.refs.text).value.trim();
    if (!text || !author) {
      return;
    }
    // TODO: 서버에 요청을 전송합니다
    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = '';
    return;
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="이름" ref="author" />
        <input type="text" placeholder="내용을 입력하세요..." ref="text" />
        <input type="submit" value="올리기" />
      </form>
    );
  }
});
{% endhighlight %}


###### 이벤트
React는 카멜케이스 네이밍 컨벤션으로 컴포넌트에 이벤트 핸들러를 등록합니다. 폼이 유효한 값으로 submit되었을 때 폼필드들을 초기화하도록 onSubmit 핸들러를 등록합니다.
폼 submit에 대한 브라우저의 기본동작을 막기 위해 이벤트시점에 preventDefault()를 호출합니다.

###### Refs

우리는 자식 컴포넌트의 이름을 지정하기 위해 ref 어트리뷰트를, 컴포넌트를 참조하기 위해 this.refs를 사용합니다. 고유한(native) 브라우저 DOM 엘리먼트를 얻기 위해 React.findDOMNode(component)를 호출할 수 있습니다.

###### props으로 콜백 처리하기

사용자가 댓글을 등록할 때, 새로운 댓글을 추가하기 위해 댓글목록을 업데이트해주어야 합니다.
CommentBox가 댓글목록의 state를 소유하고 있기 때문에 이 로직 또한 CommentBox에 있는것이 타당합니다.
자식 컴포넌트가 그의 부모에게 데이터를 넘겨줄 필요가 있습니다. 부모의 render 메소드에서 새로운 콜백(handleCommentSubmit)을 자식에게 넘겨주고,
자식의 onCommentSubmit 이벤트에 그것을 바인딩해주는 식으로 구현합니다. 이벤트가 작동될때(triggered)마다, 콜백이 호출됩니다.

{% highlight javascript %}
// tutorial1.js
var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment) {
    // TODO: 서버에 요청을 수행하고 목록을 업데이트한다
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>댓글</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});
{% endhighlight %}

사용자가 폼을 전송할 때, CommentForm에서 콜백을 호출해 봅시다:

{% highlight javascript %}
// tutorial2.js
var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var author = React.findDOMNode(this.refs.author).value.trim();
    var text = React.findDOMNode(this.refs.text).value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = '';
    return;
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="이름" ref="author" />
        <input type="text" placeholder="이름을 입력하세요..." ref="text" />
        <input type="submit" value="올리기" />
      </form>
    );
  }
});
{% endhighlight %}

이제 콜백이 제자리를 찾았습니다. 우리가 할 일은 서버에 요청을 날리고 목록을 업데이트하는 것 뿐입니다:

{% highlight javascript %}
// tutorial1.js
var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment) {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>댓글</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});
{% endhighlight %}


## 프러덕션
### 미리 컴파일된 JSX
npm 모듈을 가지고 있다면, 간단히 npm install -g react-tools를 실행해 커맨드 라인 jsx 툴을 설치할 수 있습니다.
이 툴은 JSX 구문을 일반적인 JavaScript파일로 변환해 브라우져에서 바로 실행할 수 있도록 합니다.
디렉터리를 감시해 파일이 변경되었을 때 자동으로 변환하도록 할 수도 있습니다. 예를 들면 jsx --watch src/ build/ 이렇게요.
기본적으로는 JSX 파일들은 .js 확장자로 변환됩니다. jsx --extension jsx src/ build/를 사용해 .jsx 확장자로 파일들을 변환할 수 있습니다.
먼저 커맨드라인 도구를 설치합니다. (npm 필요):

```
npm install -g react-tools
```

그다음, src/helloworld.js 파일을 일반 JavaScript 파일로 변환합니다.

```
jsx --watch src/ build/
```

수정할 때마다 build/helloworld.js 파일이 자동생성됩니다.

{% highlight javascript %}
React.render(
  React.createElement('h1', null, 'Hello, world!'),
  document.getElementById('example')
);
{% endhighlight %}

아래의 내용대로 HTML 파일을 업데이트합니다:

{% highlight html %}
<!DOCTYPE html>
<html>
  <head>
    <title>Hello React!</title>
    <script src="build/react.js"></script>
    <!-- JSXTransformer는 이제 불필요합니다! -->
  </head>
  <body>
    <div id="example"></div>
    <script src="build/helloworld.js"></script>
  </body>
</html>
{% endhighlight %}



















