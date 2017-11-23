---
layout : tutorials
category : tutorials
title : Node.js 에서 Headless Chrome 사용하기
subcategory : setlayout
summary : Node.js 에서 Headless Chrome 사용하는 방법에 대해 알아봅니다. 
permalink : /tutorials/weplanet/headless-chrome-in-nodejs
author : danielcho
tags : chrome node 
title\_background\_color : F1F71A
---

> 본 포스팅은 [Christoph Michel][1] 의 [Headless Chrome in Node.js][2]를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.

몇 달 전부터, 크롬은 브라우저 행동을 제어할 수 있는 *headless* 옵션을 제공하고 있다. 이는 기본적으로 [*phantomjs*][3]와 같지만 Chrome 엔진을 사용하는 것이다. 필자는 [월간 진행 보고서][4]의 데이터를 수집하고 스크린 샷을 찍는 등의 기능을 자동화하는 몇 가지 스크립트를 작성하였다. 


## 어떻게 작동하는가?
[Chrome DevTools Protocol][5]를 사용하여 페이지로 이동하거나, *javascript*를 삽입하거나, 스크린샷을 찍을 수 있다. 프로토콜의 기능과 옵션이 아직은 최종이 아니기 때문에 최신 크롬 canary 버전을 설치하는 것이 좋다. 

*headless* 크롬을 *Node.js* 에서 사용하는 가장 쉬운 방법은 [chrome-remote-interface][6] 에 기존의 *wrapper*를 사용하는 것이다. 필자는 [simple-headless-chrome][7]이 간단하고 좋았다. 거의 어떤 구성이나 수정 없이 바로 사용할 수 있었다. 

*참고: 이제 Google의 [puppeteer][8] 도 있다.*

## *headless* 크롬으로 구글 애널리틱스의 스크린샷 찍기

필자는 직접 만든 [time-tracking software][9], 구글 애널리틱스, 구글 애드몹을 긁어 모아서 지난 달 차트의 스크린 샷을 만든다. 전체 코드는 [GitHub][10]에 있고, *headless* 크롬으로 구글 애널리틱스 웹사이트 통계의 스크린샷 찍는 부분은 다음과 같다.

```javascript
// index.js to start headless chrome
const HeadlessChrome = require("simple-headless-chrome");
const fs = require("fs");
const scrapeAnalytics = require("./analytics");

const browser = new HeadlessChrome({
  headless: true, // can be set to false to see the browser window
  deviceMetrics: {
width: 1920,
height: 1080
  }
});

async function scrapeSites() {
  try {
await browser.init();
await scrapeAnalytics(browser);
  } catch (err) {
console.log("ERROR!", err);
  } finally {
await browser.close();
  }
}

scrapeSites();

// analytics.js
const fs = require("fs");
const moment = require("moment");
const config = require("./config/config.json");
const { needsGoogleLogin, googleLogin } = require("./common");

module.exports = async function scrapeAnalytics(browser) {
  try {
console.log("=== Scraping Google Analytics ===");
const dateYearMonth = moment().subtract(1, "month").format("YYYYMM");
const lastDayOfLastMonth = moment().subtract(1, "month").daysInMonth();
const url = ${config.analytics.url}/%3F_u.date00%3D${dateYearMonth}01%26_u.date01%3D${dateYearMonth}${lastDayOfLastMonth}/;
const mainTab = await browser.newTab({ privateTab: false });
console.log(url);
// Navigate to a URL
await mainTab.goTo(url);

if (await needsGoogleLogin(mainTab)) {
  console.log("Logging in ...");
  await googleLogin(mainTab);
} else {
  console.log("Already logged in ...");
}

// Wait some time! (2s)
await mainTab.wait(2000);
await mainTab.goTo(url);
await mainTab.waitForSelectorToLoad("#ID-overview-graph");

console.log("Getting Image Viewport ...");
const graphClip = await mainTab.getSelectorViewport("#ID-overview-graph");
const infoClip = await mainTab.getSelectorViewport(
  "#ID-overview-graph + table"
);
const clip = {
  x: graphClip.x,
  y: graphClip.y,
  width: graphClip.width,
  height: graphClip.height + 10 + infoClip.height,
  scale: graphClip.scale
};
console.log(clip);
// wait until the svg animation finishes
await mainTab.wait(1000);

console.log("Saving Screenshot ...");
await mainTab.saveScreenshot(${config.outputDir}website-traffic, {
  clip
});
  } catch (err) {
console.log("ERROR!", err);
  }
};
```

Node 버전 8로 실행하면, 다음과 같은 스크린 샷을 볼 수 있다: 

![][image-1]

[1]:	http://cmichel.io/
[2]:	http://cmichel.io/headless-chrome-in-nodejs/
[3]:	http://phantomjs.org/
[4]:	http://cmichel.io/progress-report-august-2017/
[5]:	https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-captureScreenshot
[6]:	https://github.com/cyrus-and/chrome-remote-interface
[7]:	https://github.com/LucianoGanga/simple-headless-chrome
[8]:	https://github.com/GoogleChrome/puppeteer
[9]:	https://www.rescuetime.com/
[10]:	http://cmichel.io/headless-chrome-in-nodejs/

[image-1]:	http://cmichel.io/progress-report-august-2017/website-traffic.png