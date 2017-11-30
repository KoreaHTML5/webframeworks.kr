---
layout : tutorials
title : 리액트 컴포넌트 스타일링
category : tutorials
subcategory : setlayout
summary : React에서 CSS Module / Sass / styled-components 를 사용하여 컴포넌트 스타일링하는 방법을 다룹니다
permalink : /tutorials/react/react-component-styling
tags : javascript react
author : velopert
---
# 리액트 컴포넌트 스타일링 - CSS Module / Sass / styled-components

리액트에서 컴포넌트 스타일링에 있어서는, 동일화된 방식이 없습니다. 개발자마다, 그리고 회사들마다, 요구하는 스펙이 다르고, 취향도 많이 타기 때문에 정말 다양한 방식으로 컴포넌트를 스타일링을 할 수 있습니다. 가장 기본적인 방식으로는, CSS 파일을 사용하는 방식이지요.

create-react-app 으로 프로젝트를 만들었을때, 이 방식으로 컴포넌트 스타일링을 하는데요, 먼저 한번 다음 예제를 살펴볼까요?

```css
.App {
  text-align: center;
}

.App-logo {
  animation: App-logo-spin infinite 20s linear;
  height: 80px;
}

.App-header {
  background-color: #222;
  height: 150px;
  padding: 20px;
  color: white;
}

.App-intro {
  font-size: large;
}

@keyframes App-logo-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

```javascript
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
```

일단, 위 방식처럼, 일반 CSS 를, 웹팩의 css-loader 를 통하여 불러오는 방식이 있습니다. CSS 를 작성하다보면 발생 할 수 있는 문제점이, 클래스네임이 중복 될 수 있는 가능성인데요. 이를 방지하기 위해 위 코드에서는 각 클래스네임에 컴포넌트 이름을 접두사로 붙여주었습니다. 예: App-header, App-intro 등

접두사를 붙이는 방식외에도, 다음과 같은 방식으로도 해결 할 수 있겠지요.

```css
.App { ... }
.App .header { ... }
.App .logo { ... }
.App .intro { ... }
```

CSS 를 좀 더 용이하게 작성하기 위해서 우리는 Sass, LESS, Stylus 등의 CSS 전 처리기를 사용하기도 합니다. 만약에 Sass 를 사용한다면 다음과 같이 작성 할 수 있겠죠.

```scss
.App {
  .header { ... }
  .logo { ... }
  .intro { ... }
}
```

이번 포스트에서는, 리액트 프로젝트에서 컴포넌트 스타일링을 할 때 자주 사용되는 방법들을 알아보겠습니다.

- **CSS Module**: 모듈화된 CSS 로서, CSS 클래스를 만들면 자동으로 고유적인 클래스네임을 만들어서 스코프를 지역적으로 제한하는 방식입니다. 
- **Sass**: 자주 사용되는 CSS 전처리기 중 하나이며, 확장된 CSS 문법들을 통하여 CSS 코드를 더욱 용이하게 작성하고, 추가적으로 이를 CSS Module 처럼 사용하는 방법도 알아보겠습니다.
- **styled-components**:  요즘 인기있는 컴포넌트 스타일링 방식 중 하나인, JS 코드 내부에서 스타일을 정의하는 방식입니다.

## 준비하기

우선 create-react-app 을 통하여 리액트 프로젝트를 생성하세요.

```bash
$ create-react-app styling-react
```

그 다음에, 해당 디렉토리로 들어가서 `yarn eject` 명령어를 실행하세요. 만약에 yarn 이 설치되어있지 않다면, `npm run eject` 를 실행하세요.

위 명령어를 입력하면, `node_modules/react-scripts` 경로에 내장되어있는 리액트 프로젝트의 환경설정 파일들이 프로젝트 루트 경로로 이동됩니다.

## CSS Module 
CSS Module 은, CSS 를 모듈화하여 사용하는 방식입니다. CSS 클래스를 만들면 자동으로 고유적인 클래스네임을 만들어서 스코프를 지역적으로 제한하게 됩니다. 모듈화된 CSS 를 웹팩을 통해서 불러오면, 다음과 같이 사용자가 정의했던 클래스네임과 고유화된 클래스네임이 이뤄진 객체가 반환됩니다.

```javascript
{
  box: 'src-App__box--mjrNr'
}
```
그리고 클래스를 적용하게 될 때에는 `className={styles.box}` 이런식으로 사용을 하게 되죠.

우선,  웹팩 설정으로 가서 CSS Module 을 활성화 해볼까요? 일단, create-react-app 에 이미 css-loader 가 이미 적용이 되어있으니, 이 로더의 옵션만 조금 수정해주면 된답니다.

`config/webpack.config.dev.js` 를 열어서 css-loader 를 찾아보세요. 그럼 다음과 같은 설정들이 보일거에요.

```javascript
{
        test: /\.css$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              // Necessary for external CSS imports to work
              // https://github.com/facebookincubator/create-react-app/issues/2677
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9', // React doesn't support IE8 anyway
                  ],
                  flexbox: 'no-2009',
                }),
              ],
            },
          },
        ],
      },
```
CSS 를 불러오는 과정에서, 총 3가지의 로더가 사용되었는데요, style-loader 가 스타일들을 불러와서 페이지에서 활성화 해주는 역할을 하고, css-loader 는 css 파일에서 `import` 와 `url(...)` 문들을 webpack 의 `require` 기능을 통하여 처리해주는 역할을 한답니다. postcss-loader 의 경우에는, 우리가 입력한 CSS 구문이 모든 브라우저에서 제대로 작동할 수 있도록 자동으로 -webkit, -mos, -ms 등의 접두사를 붙여주지요.

여기서, css-loader 의 options에서 CSS Module 을 사용 하도록 설정을 해주면 됩니다. 이를 설정하기 위해서는 두가지의 속성을 설정해야합니다:

```javascript
       modules: true,
       localIdentName: '[path][name]__[local]--[hash:base64:5]'
```

첫번째 속성은 CSS Module 을 활성화 하는 속성이고, 두번째 속성 localIdentName 은 CSS Module 에서 고유적으로 생성되는 클래스네임의 형식을 정해줍니다.

위 두 속성을 삽입해주고 나면 설정코드가 다음과 같이 됩니다:

```javascript
  {
        test: /\.css$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
              modules: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]'
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              (...)
            },
          },
        ],
      },
```

그리고, webpack.config.prod.js 파일에서도 동일하게 설정을 해주세요. webpack.config.dev.js 는 우리가 개발 할 때 사용하는 웹팩 개발 서버 전용 설정이며, webpack.config.prod.js 는 나중에 리액트 프로젝트를 완성하고 배포하게 될 때 빌드하는 과정에서 사용되는 환경설정 파일입니다.

### 사용해보기
우선, `src/App.css` 파일에 있는 내용을 비워주고 box 라는 클래스를 만들어보겠습니다.

#### `src/App.css`
```javascript
.box {
  display: inline-block;
  width: 100px;
  height: 100px;
  border: 1px solid black;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

그리고, 이를 App.js 에서 적용을 해보겠습니다. 

#### `src/App.js`
```javascript
import React, { Component } from 'react';
import styles from './App.css';

console.log(styles); // 콘솔에 뭐가 프린트되는지 확인해보세요!

class App extends Component {
  render() {
    return (
      <div className={styles.box}>
        
      </div>
    );
  }
}

export default App;
```
이제 `yarn start` 를 해서 웹팩 개발 서버를 실행하세요. 그 다음엔 브라우저에서 페이지에 들어가보세요. 페이지의 정 가운데에 흰 페이지가 보여졌나요? 그리고, 테스트 삼아 styles 가 어떤 객체인지 확인해보고자 `console.log` 도 했었습니다. 개발자 도구의 콘솔란도 확인해보세요.

![](http://i.imgur.com/j7N3kZf.png)

개발자도구의 Elements 탭을 열어서 코드를 보면 다음과 같이 되어있습니다
```html
<div data-reactroot="" class="src-App__box--mjrNr"></div>
```

이렇게, 클래스네임 고유적으로 설정되어있으니, CSS 클래스가 중복되서 충돌이 날 일은 없겠지요?

#### 클래스네임이 여러개일땐?
여러개의 클래스네임이 있을땐 어떻게 할까요? styles.box 도 결국 문자열형태이기 때문에, 사이에 공백을 두고 합쳐주면 됩니다.

만약에 다음과 같이 blue 라는 클래스를 새로 만들어 주었다면,

#### `src/App.js`
```css
.box {
  display: inline-block;
  width: 100px;
  height: 100px;
  border: 1px solid black;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.blue {
  background: blue;
}
```

이를 사용 할 때에는 다음과 같이 사용하면 됩니다:
#### `src/App.js`
```javascript
import React, { Component } from 'react';
import styles from './App.css';

class App extends Component {
  render() {
    return (
      <div className={[styles.box, styles.blue].join(' ')}>
        
      </div>
    );
  }
}

export default App;
```

그런데 이것보다 훨씬 더 편하게 하는 방법이 있습니다. 바로, classnames 라는 라이브러리를 사용하는것입니다.
해당 라이브러리를 설치하세요

```bash
$ yarn add classnames
```

classnames 를 설치하고나면 다음과 같이 여러개의 클래스를 적용 할 수 있답니다.

#### `src/App.js`
```javascript
import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './App.css';

class App extends Component {
  render() {
    return (
      <div className={classNames(styles.box, styles.blue)}>
        
      </div>
    );
  }
}

export default App;
```

아직까지는, 그렇게 편한지 모르겠죠? classNames 의 bind 기능을 사용하고 나면, 우리가 스타일을 넣을때마다 `styles.` 를 붙여주는걸 생략 할 수 있답니다.


#### `src/App.js`
```javascript
import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './App.css';
const cx = classNames.bind(styles);


class App extends Component {
  render() {
    return (
      <div className={cx('box', 'blue')}>
        
      </div>
    );
  }
}

export default App;
```

classNames 가 정말 편한 이유는, 이를 사용 할 때 여러가지 포맷으로 사용 할 수 있다는 점입니다. 우리가 사용한 예제에서는 그냥 파라미터를 그대로 나열하기만 했었는데요, 이를 객체형식으로, 혹은 배열 형식으로도 전달해줘도 됩니다.

#### classNames 사용 예제
```javascript
classNames('foo', 'bar'); // => 'foo bar'
classNames('foo', { bar: true }); // => 'foo bar'
classNames({ 'foo-bar': true }); // => 'foo-bar'
classNames({ 'foo-bar': false }); // => ''
classNames({ foo: true }, { bar: true }); // => 'foo bar'
classNames({ foo: true, bar: true }); // => 'foo bar'
classNames(['foo', 'bar']); // => 'foo bar'

// 동시에 여러개의 타입으로 받아올 수 도 있습니다.
classNames('foo', { bar: true, duck: false }, 'baz', { quux: true }); // => 'foo bar baz quux'

// false, null, 0, undefined 는 무시됩니다.
classNames(null, false, 'bar', undefined, 0, 1, { baz: null }, ''); // => 'bar 1'
```

객체형식으로 사용을 한다면, 조건부 스타일링을 하게 될 때 매우 편합니다.
다음 코드에서는, isBlue 값이 true 일 때에만 blue 클래스를 적용합니다.

#### `src/App.js`
```javascript
import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './App.css';
const cx = classNames.bind(styles);


class App extends Component {
  render() {
    const isBlue = true;
    
    return (
      <div className={cx('box', {
        blue: isBlue
      })}>
        
      </div>
    );
  }
}

export default App;
```

파란색 박스가 나타났나요? 이제 isBlue 값을 false 로 설정해보고 다시 브라우저를 열어보세요. 파란색이 사라졌죠? 지금은 isBlue 값을 직접 설정했지만, 이 값을 props 로 받아와서 사용하면, 손쉽게 props 에 따라 다른 스타일을 줄 수 있게 되겠지요?

이제 CSS Module 을 어떻게 사용하는지 잘 알았지요? CSS Module 을 프로젝트에서 사용하게 될때는, 각 컴포넌트마다 스타일 파일을 만들어 불러와서 사용하면 됩니다.

## Sass 

Sass 를 사용하면,  CSS 에서 사용 할 수 있는 문법을 확장하여 중복되는 코드를 줄이고, 더욱 보기 좋게 코드를 작성 할 수 있게됩니다. Sass 에 익숙하지 않다면 https://sass-guidelin.es/ko/ 를 읽어보시면 아주 큰 도움이 될 것 입니다.

이를 사용하기 위해선 두가지 패키지를 설치해야합니다.

```bash
$ yarn add node-sass sass-loader
```
sass-loader 는 webpack 에서 sass 파일들을 읽어오는 역할을 하고, node-sass 는 sass 로 작성된 코드들을 CSS 로 변환해줍니다.

설치를 하고 나면, 웹팩환경설정을 수정해주어야 합니다.

config/webpack.config.dev.js 파일을 열은다음에, file-loader 를 검색해보세요 그럼 이러한 코드가 나타날것입니다.
```javascript
{
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.css$/,
          /\.json$/,
          /\.bmp$/,
          /\.gif$/,
          /\.jpe?g$/,
          /\.png$/,
        ],
        loader: require.resolve('file-loader'),
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
```
file-loader 는, exclude 쪽에 설정된 확장자가 아니라면 그대로 파일을 불러와서 지정된 경로에 고유한 이름으로 저장을 해줍니다. 이 로더가 우리가 작성할 Sass 파일을 처리하지 않게끔 .scss 확장자는 무시하도록 설정하겠습니다.

```javascript
{
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.css$/,
          /\.json$/,
          /\.bmp$/,
          /\.gif$/,
          /\.jpe?g$/,
          /\.png$/,
          /\.scss$/,
        ],
        loader: require.resolve('file-loader'),
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
```
그다음에는, css-loader 에서 사용하는 설정을 그대로 복사해서 조금 수정해주어야 합니다. css-loader 설정 부분 하단에 그대로 복사를 하고 `test` 을 변경하고 최하단에 sass-loader 를 불러와서 설정하세요.

#### `config/webpack.config.dev.js`
```javascript
      {
        test: /\.scss$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
              modules: true,
              localIdentName: '[name]__[local]__[hash:base64:5]'
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              // Necessary for external CSS imports to work
              // https://github.com/facebookincubator/create-react-app/issues/2677
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9', // React doesn't support IE8 anyway
                  ],
                  flexbox: 'no-2009',
                }),
              ],
            },
          },
          {
            loader: require.resolve('sass-loader'),
            options: {
              // 나중에 입력
            }
          }
        ],
      },
```
위 코드처럼 sass-loader 설정을 postcss-loader 하단에 위치시키면 됩니다. options 의 경우엔 이번엔 비워두고, 나중에 입력을 하도록 하겠습니다.

webpack.config.prod.js 파일에서도 file-loader 에서 scss 를 제외시키고, css-loader 부분 코드를 동일하게 복사 후 수정하세요
#### `config/webpack.config.prod.js` 
```javascript
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          Object.assign(
            {
              fallback: require.resolve('style-loader'),
              use: [
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 1,
                    minimize: true,
                    sourceMap: true,
                    modules: true,
                    localIdentName: '[name]__[local]__[hash:base64:5]'
                  },
                },
                {
                  loader: require.resolve('postcss-loader'),
                  options: {
                    // Necessary for external CSS imports to work
                    // https://github.com/facebookincubator/create-react-app/issues/2677
                    ident: 'postcss',
                    plugins: () => [
                      require('postcss-flexbugs-fixes'),
                      autoprefixer({
                        browsers: [
                          '>1%',
                          'last 4 versions',
                          'Firefox ESR',
                          'not ie < 9', // React doesn't support IE8 anyway
                        ],
                        flexbox: 'no-2009',
                      }),
                    ],
                  },
                },
                {
                  loader: require.resolve('sass-loader'),
                  options: {
                     // 나중에 입력
                  }
                }
              ],
            },
            extractTextPluginOptions
          )
        ),
        // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
      },
```

현재 우리는, CSS Module 을 적용했었던 css-loader 설정을 복사해서 사용했기 때문에, Sass 를 사용 할 때에도 CSS Module 이 적용되어있습니다. 만약에 CSS Module 을 사용하지 않고자 한다면, modules 값과 localIdentName 을 지워주어야 합니다.

이제 웹팩 개발서버를 종료하고 재시작해보세요.

이제 프로젝트에 Sass 가 적용되었습니다. 한번 Sass 가 제공하는 멋진것들 몇가지를 사용해볼까요?

### 현재 선택자 참조 (`&`)
특정 클래스에 마우스가 올라갔을때, 그리고 클릭했을때 스타일을 주기 위해서는 CSS 를 사용한다면 다음과 같이 작성하게됩니다.

```css
.box:hover {
  background: red;
}

.box:active {
  background: yellow;
}
```

Sass 에서 사용하는 현재 선택자 참조 기능을 사용한다면 다음과 같이 작성할수 있게 되지요.

```scss
.box {
  /* 스타일 설정.. */
  &:hover {
    background: red;
  }
  &:active {
    background: yellow;
  }
}
```



이런식으로 감싸진 구조로 CSS 를 작성 할 수 있기 때문에 가독성이 훨씬 높아집니다. 그럼 한번 바로 적용을 해볼까요? 우선 기존의 App.css 파일을 App.scss 로 파일 이름을 변경하세요.

그 다음엔, App.js 에서 `import` 할 때 사용하는 파일 이름도 App.scss 로 변경하세요.

그리고 App.scss 파일을 다음과 같이 수정하세요.

```scss
.box {
  display: inline-block;
  width: 100px;
  height: 100px;
  border: 1px solid black;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  
  &.blue {
    background: blue;
  }

  &:hover {
    background: yellow;
  }

  &:active {
    background: red;
  }
}
```

.blue 클래스도 현재 선택자 참조 기능을 사용하여 .box 안에 넣어주었습니다.

### 네스트된 구조
Sass 를 사용하면 네스트된 구조, 즉 감싸진 구조로 코드를 입력 할 수 있습니다. 우선 App.js 코드를 다음과 같이 수정해보세요.


#### `src/App.js` - render 메소드
```javascript
  render() {
    const isBlue = true;
    
    return (
      <div className={cx('box', {
        blue: isBlue
      })}>
        <div className={cx('box-inside')}/>
      </div>
    );
  }
```
box 내부에 box-inside 라는 클래스를 가진 div 엘리먼트를 만들어주었습니다.

이제 .box-inside 라는 클래스를 만들건데요, 만약에 이 클래스가 box 클래스 내부에 있을때만 작동을 하게끔 하고 싶다면 CSS 로는 다음과 같이 작성합니다.

```css
.box .box-inside {
	/* ... */
}
```

Sass 를 사용하면, 다음과 같이 작성 할 수 있게 됩니다.
```scss
.box {
  .box-inside {
	  /* ... */
  }
}
```

그럼 한번, 우리의 App.scss 에서 위 문법을 사용해서 box-inside 클래스를 스타일링 해보겠습니다.

#### `src/App.scss`
```scss
.box {
  display: inline-block;
  width: 100px;
  height: 100px;
  border: 1px solid black;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  
  &.blue {
    background: blue;
  }

  &:hover {
    background: yellow;
  }

  &:active {
    background: red;
  }

  .box-inside {
    background: black;
    width: 50px;
    height: 50px;
  }
}
```

어떤가요? 이렇게 하니까 편하기도 하고, App 컴포넌트의 코드를 함께 읽지 않아도 .box-inside 클래스가 .box 엘리먼트 내부에 있다는것을 알 수 있으니 가독성도 높아지는것같지 않나요?

### 변수 사용하기
Sass 에서는 자주 사용되는 값은 변수에 넣어서 사용 할 수 있습니다. 한번 .box 의 width 와 height 을 설정된 100px 를 	$size 라는 변수 안에 넣어서 사용해보겠습니다.


```scss
$size: 100px;

.box {
  display: inline-block;
  width: $size;
  height: $size;
  (...)
}
```

### 믹스인 사용하기
자주 사용 되는 값은 변수에 넣어서 사용하고, 자주 사용되는 구문들은 믹스인이라는것을 만들어서 재사용 할 수 있습니다. 한번 가운데에 위치시키는 CSS 구문들을 `place-at-center` 라는 믹스인에 만들어서 호출해보겠습니다.

```scss
$size: 100px;

@mixin place-at-center() {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.box {
  display: inline-block;
  width: $size;
  height: $size;
  border: 1px solid black;
  position: fixed;
  
  @include place-at-center();

  (...)
}
```

### 전역적으로 사용하기
변수와 믹스인은, 여러곳에서 재사용하자고 만드는것인데, 현재 우리는 CSS Module 이 적용되어있는 상태이기 때문에, 믹스인과 변수들이 파일마다 공유되고있지 않습니다. 따라서, 우리는 이를 전역적으로 사용 할 수 있는 방법을 고안해야하는데요, 그 방법중 하나는, 스타일 디렉토리를 만들어서 전역적으로 사용되는 코드를 따로 구분시킨다음에 스타일에서 불러와서 사용하는 방법입니다.

src 디렉토리에 styles 라는 디렉토리를 만들고, utils.scss 라는 파일을 만드세요.

이 파일에 공용으로 사용할 코드를 잘라내서 넣으세요.

#### `src/styles/utils.scss`
```javascript
$size: 100px;

@mixin place-at-center() {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

이렇게 파일을 만들고 나면,  App.scss 에서 다음과 같이 불러와서 사용 할 수 있답니다.

#### `src/App.scss`
```scss
@import './styles/utils';

.box {
  (...)
```

그런데, 앞으로 컴포넌트를 저장하는 디렉토리가 조금 깊어진다면, 저 파일을 불러와야 할 때마다 상위 디렉토리로 가야되서 이런 코드를 작성하게 될 지도 모릅니다.

`scss`
```scss
@import '../../../styles/utils'
```

조금 비효율적이지요? 헷갈리기도 하구요. 이런 복잡한 상대 경로를 작성하는걸 피하기 위해서, webpack 에서 sass-loader를 설정 할 때 `includePaths` 라는 설정을 통하여 경로를 간소화 할 수 있습니다.

이를 설정하기 위해선, 먼저 config/paths.js 파일을 수정해주어야 합니다.

##### `config/paths.js` - 하단부
```javascript
// config after eject: we're in ./config/
module.exports = {
  (...),
  styles: resolveApp('src/styles')
};
```

해당 파일의 하단부를 보면 경로들이 들어있는 객체를 내보내는 코드가 있습니다. 이 부분에 styles 를 추가하세요.

그 다음엔, webpack.config.dev.js 와, webpack.config.prod.js 파일의 sass-loader 설정 부분을 다음과 같이 수정하세요.


#### `config/webpack.config.dev.js`, `webpack.config.prod.js` - sass-loader 설정 부분
```javascript
          {
            loader: require.resolve('sass-loader'),
            options: {
              includePaths: [paths.styles]
            }
          }
```
이렇게 설정을 하고 나서 웹팩 개발서버를 재시작하면 새로운 설정이 적용됩니다. 위 설정을 하고 나면 다음과 같은 방식으로 util.scss 파일을 불러와서 사용 할 수 있게 됩니다.

#### `src/App.scss`
```javascript
@import 'utils';

.box {
  (...)
```

어떤가요? 훨씬 더 쉽게 불러올수있겠죠?

### Sass 라이브러리
Sass 를 사용하면 다양한 스타일 관련 라이브러리를 사용 할 수 있게 됩니다. 이번 Sass 공부 섹션을 마치기 전에, 반응형 디자인을 쉽게 할 수 있게 해주는 include-media 와, 손쉽게 색상을 골라서 사용 할 수 있는 색상 팔레트 open-color 라이브러리를 사용하여 멋진 버튼을 만들어보도록 하겠습니다.

우선 위 라이브러리를 npm 을 통해 설치하세요.

```bash
$ yarn add include-media open-color
```

설치를 하고 나면, utils.scss 파일쪽에서 불러와야 합니다.

#### `src/styles/utils.scss`
```javascript
@import '~open-color/open-color';
@import '~include-media/dist/include-media';

$breakpoints: (
  small: 376px, 
  medium: 768px, 
  large: 1024px, 
  huge: 1200px
);


$size: 100px;

@mixin place-at-center() {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

npm 혹은 yarn 으로 설치한 패키지 내부에 있는 파일을 불러올때에는 `~` 문자를 통해서 node_modules 디렉토리에 접근 할수 있습니다.

그리고, $breakpoints 라는 변수를 설정해주었는데요, 여기에 있는 값은 추후 반응형 디자인 코드를 작성하게 될 때 사용하게 됩니다.

#### 버튼 만들기
방금 설치한 라이브러리를 활용하여 멋진 버튼을 만들어봅시다.

버튼 컴포넌트는 `src/components/Button/` 디렉토리에 저장을 하겠습니다. 해당 디렉토리에 다음 파일들을 만드세요.

- Button.js
- Button.scss
- index.js

우선 컴포넌트 파일부터 작성을 해봅시다.

#### `src/components/Button/Button.js`
```javascript
import React from 'react';
import styles from './Button.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Button = ({children, ...rest}) => {
  return (
    <div className={cx('button')} {...rest}>
      {children}
    </div>
  );
};

export default Button;
```

CSS Module 형식으로 스타일을 설정해주었구요, 함수형 컴포넌트로 만들어주었습니다. props 에서는 children 과 ...rest 가 있는데요, 여기서 rest 는 나중에 이 컴포넌트가 받을 모든 props 를 칭합니다. 비구조화 할당 문법에서 `...foo` 이런식으로 입력을 하면, 비구조화 할당을 할 때에 따로 지정되지 않은것들은 foo 에 객체형태로 담겨지게 됩니다.

#### 예제
```javascript
const object = {
  a:1,
  b:2,
  c:3
};

const { a, ...foo } = object;

console.log(a); // 1
console.log(foo); // { b: 2, c: 3 }
```

그리고, 컴포넌트를 렌더링 하는 부분에서 { ...rest } 를 넣어주었는데요, 이는 객체 안에 있는 모든 값들을 props 로 지정한다는 의미입니다. 예를들어서 rest 객체 안에 onClick 이 들어있다면, `<div onClick={onClick}>` 이런식으로 설정이 됩니다.

이제 스타일을 작성해봅시다.
#### `src/components/Button/Button.scss`
```javascript
@import 'utils';

.button {
  background: $oc-green-7;
  transition: all .2s ease-in;
  display: inline-block;
  padding-top: 2rem;
  padding-bottom: 2rem;
  text-align: center;
  color: white;
  position: fixed;
  font-size: 2rem;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;

  @include place-at-center();
	
  width: 1200px;
  
  // 반응형 디자인
  @include media("<huge") {
    width: 1024px;
  }

  @include media("<large") {
    width: 768px;
  }
  
  @include media("<medium") {
    width: 90%;
  }

  // 마우스 상태에 따라 다른 효과 지정
  &:hover {
    background: $oc-green-6;
  }
  &:active {
    margin-top: 3px;
    background: $oc-green-8;
  }
}
```

open-color 를 적용하고나면 변수를 사용하여 여러가지 색깔을 쉽게 사용 할 수 있습니다. 변수의 형식은 `$oc-색상이름-밝기` 입니다. 색상의 종류는 https://yeun.github.io/open-color/ 에서 참고 할수 있습니다.

예를 들어, 초록색을 사용한다면 `$oc-green-6` 이런식으로 사용하면 되겠습니다.

그리고 include-media 의 경우엔 믹스인으로 구성된 라이브러리인데요, 사용을 할 때는 이전에 설정했던 breakpoints 에서 지정한 값들을 참조하여 `@include media('<huge') { ... }` 와 같은 형식으로 작성하면 됩니다.

위 코드에서는, 기본 넓이를 1200px 로 설정하고, 창의 크기가 1200px 미만으로 되면 1024px 로 설정하고, 창의 크기가 그것보다 작아지면 768px, 그리고 그 다음에는 90% 의 크기로 설정하도록 했습니다.

이제 컴포넌트 관련 코드를 다 작성했는데요, Button 디렉토리에 index.js 를 마지막으로 만들어주겠습니다. 우리는, 컴포넌트 자바스크립트 파일과 스타일 파일을 보기 쉽게 정리하기 위해서 Button 디렉토리를 따로 만들어주었는데요, 만약에 이대로 한다면 나중에 컴포넌트 파일을 불러오게 될 때에 `'./components/Button/Button'` 형식으로 불러와야 합니다. Button 이 두번이나 중복되는 것은 보기에 깔끔하지 않으므로, index.js 파일을 만들어서, 컴포넌트를 불러온뒤 바로 내보내주겠습니다.

#### `src/components/Button/index.js`
```javascript
import Button from './Button';
export default Button;
```

위 코드를 한 줄로 작성하면 다음과 같습니다:
```javascript
export { default } from './Button';
```

여러분이 편한 문법을 사용하시면 됩니다.

자, 이제 이 컴포넌트를 App 에서 랜더링해볼까요?

#### `src/App.js`
```javascript
import React, { Component } from 'react';
import Button from './components/Button';

class App extends Component {
  render() {
    return (
      <div>
        <Button>버튼</Button>
      </div>
    )
  }
}

export default App;
```

![](http://i.imgur.com/TlF35qW.png)

모든 브라우저 사이즈에서 짤리지 않는 컴포넌트를 만들어주었습니다!

## styled-components
styled-components 는 자바스크립트 파일안에 스타일 자체를 선언하는 방식으로 스타일을 관리합니다. 이 라이브러리에서 제공되는 기능은 다양한데요, 이번에는 직접 사용해보면서 맛보기로만 익혀보고, 다음에 더욱 더 자세히 알아보도록 하겠습니다.


먼저 패키지를 설치하세요.

```bash
$ yarn add styled-components
```

그리고, 또 다른 버튼 컴포넌트를 만들어보겠습니다. components 디렉토리에 StyledButton.js 라는 파일을 만드세요.

####`src/components/StyledButton.js`
```javascript
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  border: 1px solid black;
  display: inline-block;
  padding: 1rem;
  border-radius: 3px;
  &:hover {
    background: black;
    color: white;
  }
`;

const StyledButton = ({children, ...rest}) => {
  return (
    <Wrapper {...rest}>
      {children}
    </Wrapper>
  );
};

export default StyledButton;
```

styled-components 를 불러온 다음에, styled 를 사용하여 Wrapper 라는 값에 스타일링된 div 엘리먼트를 만들어주었습니다. 이 과정에서 익숙하지 않은 문법이 사용됐지요?

```javascript
styled`...`
```
위 문법은 ES6 의 Tagged Template Literals 라는 문법입니다.

한번, 크롬 개발자 코드를 열어서 다음 코드를 입력해보세요.
```javascript
function myFunction(...args) {
   console.log(args);
}
myFunction`1+1 = ${1+1} and 2+2 = ${2+2}!`
```

그러면, 다음과 같은 결과물이 나타납니다.

```text
[
  [
    "1+1 = ",
    " and 2+2 = ",
    "!"
  ],
  2,
  4
]
```

backquote (\`) 사이에 `${자바스크립트표현}` 을 사용하면 위와 같이 끊어서 함수의 인자로 전달해준답니다.

이 문법이 사용되는 이유는, 스타일링을 할 때, props 에 접근하기 위해서 다음과 같이 함수를 내부에 입력하기도 하는데요:
```javascript
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  border: 1px solid black;
  display: inline-block;
  padding: 1rem;
  border-radius: 3px;
  font-size: ${(props)=>props.fontSize};
  &:hover {
    background: black;
    color: white;
  }
`;

const StyledButton = ({children, ...rest}) => {
  return (
    <Wrapper fontSize="1.25rem" {...rest}>
      {children}
    </Wrapper>
  );
};

export default StyledButton;
```

만약에 Tagged Template Literal 기능을 사용하지 않으면 다음과 같이 함수가 문자열 자체로 들어가게 되지만,
![](http://i.imgur.com/Rfb4LoP.png)

이 문법을 사용하면 자바스크립트 표현은 끊어서 처리하기 때문에, 함수가 함수 형태 그대로 남아지게 됩니다. 따라서, styled-components 라이브러리가 끊어진 값들을 참조해서 스타일을 정의 해 줄 수 있겠지요.

![](http://i.imgur.com/tv22mjQ.png)

이제 이번에 만든 컴포넌트를 App 에서 렌더링 해보겠습니다.

#### `src/App.js`
```javascript
import React, { Component } from 'react';
import StyledButton from './components/StyledButton';

class App extends Component {
  render() {
    return (
      <div>
        <StyledButton>버튼</StyledButton>
      </div>
    )
  }
}

export default App;
```
![](http://i.imgur.com/wPiOMqA.png)

styled-components 의 최대 장점은, 자바스크립트 내부에서 스타일을 정의하다보니, 자바스크립트와 스타일링 사이의 벽이 허물어져서 동적 스타일링이 더욱 편해진다는 것 입니다.

한번 big 이라는 props 통해 버튼 크기를 동적으로 변경해보는 코드를 작성해보겠습니다.

#### `src/components/StyledButton.js`
```javascript
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  border: 1px solid black;
  display: inline-block;
  padding: 1rem;
  border-radius: 3px;
  font-size: ${(props)=>props.fontSize};
  ${props => props.big && `
    font-size: 2rem;
    padding: 2rem;
  `}
  &:hover {
    background: black;
    color: white;
  }
`;

const StyledButton = ({children, big, ...rest}) => {
  return (
    <Wrapper fontSize="1.25rem" {...rest} big={big}>
      {children}
    </Wrapper>
  );
};

export default StyledButton;
```

위 코드에서 
```javascript
  ${props => props.big && `
    font-size: 2rem;
    padding: 2rem;
  `}
```
이 부분이,  props 를 받아와서 이에따라 스타일을 설정하는 부분입니다.
그리고 props 를 받아오는 부분에서 big 이란 값을 불러와서 Wrapper 안에 그대로 넣어주었습니다.

자 이제, App 에서 big props 를 설정해줘봅시다.

#### `src/App.js`
```javascript
import React, { Component } from 'react';
import StyledButton from './components/StyledButton';

class App extends Component {
  render() {
    return (
      <div>
        <StyledButton big>버튼</StyledButton>
      </div>
    )
  }
}

export default App;
```

여기서 `<StyledButton big>`, 이렇게 입력을 해주었는데요 이 표현은 `<StyledButton big={true}>` 와 동일한 표현입니다.

![](http://i.imgur.com/Xq4BvJR.png)

이번 포스트에서는 styled-components 는 여기까지만 알아보도록 하겠습니다. 이 포스트에서 제시된 기능 외에도 많은 기능을 제공해 주는데요, 예를들어 우리가 Sass 에서 사용한 include-media 믹스인처럼, 함수를 따로 만들어서 사용할수도있습니다. 또한, 우리가 Sass 에서 네스트된 구조로 스타일을 작성하는 것 처럼, styled-components 에서도 동일하게 네스트된 구조로 스타일을 작성 할수 있답니다. 이에 대해선 다음번에 다룰 강좌에서 더욱 더 자세히 알아보도록 하겠습니다.


## 정리

이번 포스트에서는, 다양한 방법으로 컴포넌트를 스타일링 하는 방법을 배웠습니다. 이 포스트에서 제시된 방법중에서, 어떤것이 가장 좋은지에 대한 해답은 없습니다.  일반 CSS 를 사용한다면, 이미 CSS 가 익숙한 개발자들에겐 매우 친숙할것이고, CSS Module 을 사용하면 스코프 이슈가 해결 될 것이며, 여기서 Sass 를 사용하면 더욱 확장된 CSS 문법들을 통하여 깔끔하고 편안한 코드를 작성 할 수 있게 됩니다. Sass 가 아니더라도, LESS, Stylus 등을 사용 할 수도 있겠지요. 

styled-components 의 경우엔 자바스크립트와 CSS 의 벽을 허물어주고, JS 파일 자체에 스타일 코드를 입력하기 때문에 여러 파일을 만들 필요도 없고 동적 렌더링을 하게 될때에는 매우 효과적입니다. 하지만, 단점으로는 기존 CSS 파일을 통한 스타일링과 사뭇 다른 방식으로 관리를 하기 때문에, HTML/CSS 를 따로 작성하는 디자이너가 따로 있다면, 이를 일일히 포팅해야 되기 때문에 조금 힘들어질 수도 있습니다.

어떤 방법을 택할지는, 여러 방식으로 작업을 해보고 여러분에게 가장 편안한 방법으로 하는것이 가장 좋습니다. 


