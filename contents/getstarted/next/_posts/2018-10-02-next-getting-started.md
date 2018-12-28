---
layout : getstarted
title : nextjs
category : getstarted
subcategory : js
summary : nextjs 프레임워크에 대해 알아봅니다. 
permalink : /getstarted/next
title_background_color : AED5E6
title_color : FFFFFF
tags : javascript next
author : danielcho
---

# [nextJS](https://nextjs.org/)



## NEXT JS 란?

2016년 10월에 Zeit.co 팀에 의해 발표된 React JS를 이용한 서버 사이드 렌더링 프레임워크 (SSR). 따라서 React JS 라이브러리를 핵심으로 한 NEXT JS 프레임워크를 이용해서 처음 페이지를 요청할 때에는 서버 사이트 렌더링을 하고, 그 이후에는 내부에서 페이지가 이동될 때 데이터를 가져와서 페이지를 브라우저에서 렌더링하여 SSR과 CSR의 장점을 모두 취합니다.



### 설치

1. 기본적으로 Node JS, NPM or Yarn 설치
   - Node JS & NPM 설치(<https://nodejs.org/ko/download/package-manager/>)
   - Yarn 설치(<https://yarnpkg.com/lang/en/docs/install/#mac-stable>)
2. 프로젝트 디렉터리 생성 및 next & react & react-dom 설치

- NPM

```text
mkdir [프로젝트 디렉토리]
cd [프로젝트 디렉토리]
npm init
npm install --save next react react-dom
mkdir pages
```

- Yarn

```text
mkdir [프로젝트 디렉토리]
cd [프로젝트 디렉토리]
yarn init -y
yarn add next react react-dom
mkdir pages
```

**이후 npm으로 진행하도록 하겠습니다**

**제약사항** NEXT JS에서는 각 route 에 해당된 파일은 반드시 pages라는 디렉토리 안에 들어가야 하기 때문에 pages 디렉터리를 반드시 생성, 다른 디렉토리는 자유롭게 생성 가능합니다.

package.json에 Script 편집

```text
{
  "name": "hello-next",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "next -p 9090",
    "build": "next build",
    "start": "next start"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "axios": "^0.18.0",
    "next": "^7.0.2",
    "react": "^16.6.3",
    "react-dom": "^16.6.3"
  }
}
```

pages디렉터리에 index.js 파일 생성(**기본 ES6문법으로 작성**)

```text
const Index = () => (
    <div>
        <p>Hello, Next JS </p>
    </div>
);

export default Index
```

Terminal에서 실행

```text
$npm run dev

> hello-next@1.0.0 dev /project/hello-next
> next -p 9090

✔ success server compiled in 178ms
✔ success client compiled in 886ms
...
```

package.json 에 script에 dev를 보시면 -p [포트] 옵션으로 9090이기 때문에 [http://localhost:9090](http://localhost:9090/) 으로 접속하시면 됩니다.





## 참고 자료

[공식 가이드](https://nextjs.org/)





## 튜토리얼

[NEXT JS - 시작하기](http://webframeworks.kr/tutorials/nextjs/nextjs-001/)

[NEXT JS - React JS의 라이프 사이클 이해하기](http://webframeworks.kr/tutorials/nextjs/nextjs-002/)

[NEXT JS - 페이지 추가하기](http://webframeworks.kr/tutorials/nextjs/nextjs-003/)

[NEXT JS - Router](http://webframeworks.kr/tutorials/nextjs/nextjs-004/)

[NEXT JS - 커스텀 NEXT JS 실습](http://webframeworks.kr/tutorials/nextjs/nextjs-005/)

[NEXT JS - Axios (HTTP클라이언트 라이브러리)](http://webframeworks.kr/tutorials/nextjs/nextjs-006/)

[NEXT JS - 커스텀 Document(Bootstrap))](http://webframeworks.kr/tutorials/nextjs/nextjs-007/)

[NEXT JS - 배포)](http://webframeworks.kr/tutorials/nextjs/nextjs-008/)



