---
layout : tutorials
category : tutorials
title : Markdown에서 React를 사용하는 방법
subcategory : setlayout
summary : Markdown에서 React를 사용하는 방법에 대해 알아봅니다. 
permalink : /tutorials/weplanet/how-to-use-react-in-markdown/
author : danielcho
tags : react markdown
title\_background\_color : F1F71A
---

> 본 포스팅은 [Christoph Michel][1] 의 [How to use React in Markdown][2]를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.

이 글에서, 필자는 **Markdown에서 React 요소를 사용하는 법**에 대해서 얘기할 것이다. 우선, 왜 이렇게 하고 싶을까? 그 이유는, 필자가 게시 글을 Markdown에서 작성을 하며 [static site generator][3]를 사용하여 HTML 페이지로 게시 글을 전환하고 그렇게 함으로써 React 요소를 직접적으로 필자의 Markdown 글에 삽입하는데 유용하다. 이것은 React와 Markdown을 한 파일 안에 섞을 수 있도록 한다. 예를 들어, 만약 필자의 글에서 어떤 데이터에 대해서 얘기를 하고 이 데이터를 사용하여 도표 / 차트를 만들고 싶다면, 필자의 글이 다음과 같이 보인다면 좋을 것이다:

	##Markdown Title
	Here is a React component in _Markdown_:
	
	 <Chart data={[...]} />
	
	 Some more **Markdown**.


## 커스텀 React Parser 사용하기

해결책은 꽤나 간단하다. **Markdown parser** 상단에, 우리는 React 요소를 확인하는 **custom parser**를 만들 수 있다. 이 parser는 Markdown parser 이후에 작동되기 때문에 우리는 Markdown에서 React 컴포넌트를 사용하는 방법이 Markdown parser를 방해하지 않도록 주의해야 한다. 그렇게 하기 위해서는, 우리는 syntax를 바꾸어서 HTML Element가 되도록 해야 한다. 간단하게 *div* 태그를 사용하여 구체적인 React Element를  넣어 class 속성(react-라는 접두사를 가진)과 데이터를 JSONstring으로 렌더링해서 우리가 props 라고 부르는 또 다른 속성으로 넣으면 된다. Markdown 게시물에 React 요소를 사용하면 다음과 같이 보인다: 

	##Some Markdown
	Here is a **React component** in _Markdown_:
	
	<div class='react-chart' props='{"data":[1,2,3]}'></div>

후에 JSON string(문자열)에서 큰 따옴표만 지원하는 JSON.parse 를 사용할 것이기 때문에 우리는 속성을 둘러싸기 위해서는 작은 따옴표를 사용하여야 한다.


## React Parser 실행하기

우리는 Markdown parser의 결과물에 접근할 방법이 필요하다. 필자는 [phenomic][4] 을 *static site generator*로 사용하는데, 이것은 결과물을 React 컴포넌트(*Layouts*을 사용하는)의 문자열 속성 *body*로 제공한다. 그 절차는 다음과 같다: 
1. 당신의 게시글에 포함시키고 싶은 React 컴포넌트를 *import*한다. 
2. \<div class='react-*' props='*'\>\</div\> 문자열을 찾고 컴포넌트 이름과 props를  추출한다.
3. 해당 React 컴포넌트를 알맞은 prop과 함께 불러오고 문자열에 *ReactDOMServer.renderToStaticMarkup*을 사용하여 렌더링한다. 
4. *\<div class='react-\*’ props= \'\*'\>\</div\>* 코드를 이 문자열로 대체한다. 
5. Markup과 React 컴포넌트 내용을 *dangerouslySetInnerHTML={{ \_\_html: body }}*와 함께 렌더링한다. 

이것은 `body.replace(RegExp)`을 사용하면 쉽게 할 수 있다:


```javascript
import React, { Component, PropTypes } from 'react'
import ReactDOMServer from 'react-dom/server'
import { Chart } from '../../components'

// matches strings like
// <div class='react-chart' props='{"val":5}'></div>
// <div      class='react-test'    >     </div>
// Make sure to use SINGLE quotes for defining HTML attributes,
// as we need double quotes to parse the JSON props attribute
const pattern = new RegExp(
String.raw<div\s*class='react-(\S*)'\s*(props='(.*)'\s*)?>\s*</div>, 'ig')

export default class PostWithCharts extends Component {

  render () {
let { body, ...otherProps } = this.props
if (body) body = body.replace(pattern, this.replacementBasedOnMatch)
return (
 <div
   dangerouslySetInnerHTML={{ __html: body }}
   {...otherProps}>
</div>
)
  }

  replacementBasedOnMatch (match, name, propsMatch, props) {
props = propsMatch ? JSON.parse(props) : undefined
switch (name) {
  case 'chart': {
return ReactDOMServer.renderToStaticMarkup(<Chart {...props} ></Chart>)
  }
  default: {
console.error(Cannot replace ${name} with a React component. ${match})
return '<h1><del>This paragraph should not be here.</del></h1>'
  }
}
  }
}

PostWithCharts.propTypes = {
  body: PropTypes.string.isRequired   // Markdown post containing the react-div
}
```

좋은 점은 이것이 서버 쪽 렌더링에서 작동한다는 것이다. 그래서, 최종 HTML 파일에서는 *\<div class='react-\* \' props='\*'\>\</div\>* Element는 없을 것이고, 대신에 React 컴포넌트의 렌더링 결과값이 직접적으로 삽입될 것이다.

[1]:	http://cmichel.io/
[2]:	http://cmichel.io/how-to-use-react-in-markdown/
[3]:	http://cmichel.io/wordpress-to-static-site-generator/
[4]:	https://phenomic.io/