---
layout : tutorials
title : Google Map을 위한 AngularJS 지시자 만들어 보기
category : tutorials
subcategory : data-display
summary : AngularJS 지시자를 이용하여 재사용 가능한 구글 Map의 지시자를 만들어 본다.
permalink : /tutorials/angularjs/angularjs_google_map_directive
title_background_color : DD1B16
title_color : FFFFFF
tags : javascript framework angularjs tutorials map direcitve
author : jeadoko
---

# Google Map을 위한 AngularJS 지시자 만들어 보기

이전에 [UI 컴포넌트를 위한 지시자 알아보기](/tutorials/angularjs/directive_for_ui_component)에서 우리는 지시자를 만드는 법을 간단히 알아 보았다면 이번 튜토리얼은 좀 다른 시각으로 지시자로 UI 컴포넌트를 만드는 법에 대하여 살펴보겠다.

## 외부 라이브러리를 이용한 지시자 개발

AngualrJS의 지시자를 이용하여 UI 컴포넌트 개발 방식은 크게 2가지로 볼 수 있다. 하나는 이전 튜토리얼에서 한 방법과 같이 템플릿을 이용하여 처음부터 끝까지 직접 개발하는 방식이고 다른 하나는 바퀴를 맨땅에서부터 다시 발명할 필요 없이<sup>Don't reinvent the wheel</sup> 이미 만들어진 라이브러리를 활용하여 AngularJS 프레임워크와 잘 맞춰 돌아가게 만드는 것이다.

## Google Map 지시자 만들기

Google Map은 자바스크립트를 이용하여 특정 좌표를 중심으로 지도를 보여주거나 다음 그리과 같이 지도안에 별도의 윈도우창을 만들어 정보를 보여줄 수 있다. 우리보고 이런 지도를 만들라면...... 할 말이 없다.

{% bimg imgs/google_map_tutorial_01.png 600x300 %}구글지도 그림{% endbimg %}

다음 코드는 자바스크립트로 google map을 초기화하고 지도에 서울을 표시하는 코드이다.

{% highlight javascript %}
var mapOptions = {
  center: new google.maps.LatLng(37.561192, 127.030487),
  zoom: 8,
  mapTypeId: google.maps.MapTypeId.ROADMAP
};
var map = new google.maps.Map(document.getElementById("map_canvas"),mapOptions);
{% endhighlight %}

그럼 우선 지시자를 설계해보자. 지시자의 이름은 gMap으로하고 지도의 중심점은 center 그리고 줌레벨은 zoom으로하겠다. 그리고 각 이름을 태그 속성명으로 하고 속성값을 통하여 값을 받겠다. 그러면 다음과 같이 구글맵 지시자를 정의할 수 있을 것이다.

{% highlight html %}
<g-map center="[37.561192, 127.030487]" zoom="8"></g-map>
{% endhighlight %}

이제 실제 지시자를 구현해보자. google-map.js라는 파일을 만들어 다음 코드와 같이 작성한다. 전체 코드는 [GitHub web-angular-sample 프로젝트의 google-map Branch](https://github.com/jeado/web-angular-sample/tree/google-map)에서 google-map.html과 gmap 폴더를 확인하면 된다.

{% highlight javascript %}
angular.module('ngGMap', [])
  .directive('gMap', ['$timeout',function ($timeout) {
    return {
      restrict: 'EA',
      link: function (scope, iElement, iAttrs) {
        //지도를 담고 있는 div요소 생성과 스타일 지정
        var el = document.createElement("div");
        el.style.width = "100%";
        el.style.height = "100%";
        iElement.prepend(el);
        
        //구글 맵을 만든다.
        var map = new google.maps.Map(el, {});
        //옵션을 정의
        var mapOptions = {
          center: new google.maps.LatLng(37.561192, 127.030487),
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        //부분적으로만 그려지는 것을 방지하기 위한 코드
        $timeout(function() {
          google.maps.event.trigger(map, "resize");
        });

        //옵션 적용
        map.setOptions(mapOptions);

      }
    };
  }]);
{% endhighlight %}

이제 위 코드를 사용할 html 파일을 다음과 같이 만든다.

{% highlight html %}
<!DOCTYPE html>
<html ng-app="demoApp">
  <head>
    <meta charset="UTF-8">
    <title>AngualrJS Google Map Directive 데모 엡</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
    <style>
      .map-container { height: 300px; width: 300px; margin: 20px; padding: 0; border: 1px solid #000; }    
    </style>
    <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=weather,visualization,panoramio"></script>
    <script type="text/javascript" src="libs/angular/angular.min.js"></script>
    <script src="gmap/directive/google-map.js"></script>
    <script>
    angular.module('demoApp', ['ngGMap']);
    </script>
  </head>
  <body>
    <div class="map-container">
      <g-map></g-map>
    </div>
  </body>
</html>
{% endhighlight %}

브라우저에서 확인하면 확인을 하면 서울을 나타내는 구글 지도가 잘 보일 것이다. 하지만 위 지시자는 앞에서 설계한 것과는 다르게 특정 위치와 줌래밸에 소스에 밖혀있다. 그럼 외부에서 위치와 줌래밸을 받을 수 있도록 아래와 같이 지시자 코드를 수정하자.

{% highlight javascript %}
angular.module('ngGMap', [])
  .directive('gMap', ['$timeout',function ($timeout) {
    return {
      restrict: 'EA',
      link: function (scope, iElement, iAttrs) {
        var el = document.createElement("div");
        el.style.width = "100%";
        el.style.height = "100%";
        iElement.prepend(el);

        //iAttrs.center를 이용하여 지시자가 적용된 DOM의 center 속성값을 가지고 온다. 하지만 해당 값이 문자열이라서 JSON.parse를 이용해 배열로 변환한다. zoom은 숫자여야 하기에 Number를 이용하여 숫자로 변환한다.
        var cordi = (iAttrs.center !== undefined) ? JSON.parse(iAttrs.center) : [37.561192, 127.030487],
            zoom = (iAttrs.zoom !== undefined) ? Number(iAttrs.zoom) : 8;

        var map = new google.maps.Map(el, {}),
            mapOptions = {
              center: new google.maps.LatLng(cordi[0], cordi[1]),
              zoom: zoom,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            };
      
      //생략...

      }
    };
  }]);
{% endhighlight %}

이제 지시자 사용하는 코드를 아래와 같이 부산의 좌표로 변경하고 줌래밸값을 더 높게하여 수정하고 브라우저에서 확인하자.

{% highlight html %}
<g-map center="[35.178202, 129.078666]" zoom="12"></g-map>
{% endhighlight %}

그럼 아래 부산이 더 줌인되서 보이는 구글지도를 확인할 수 있을 것이다.

{% bimg imgs/google_map_tutorial_02.png 300x300 %}부산 구글지도 그림{% endbimg %}

## 속성 Observe 기능 추가

우리가 만든 gMap 지시자를 좀 더 동적으로 사용되는 시나리오를 생각해보자. 여러 좌표정보를 포함하는 배열이 있고 이를 콤보박스로 표현했다. 해당 콤보박스를 선택하면 선택한 좌표로 지도의 중심점이 변경되는 것이다. 

단순히 제이쿼리를 이용해 구현한다고 생각하면 컨트롤 요소에 변경 이벤트 리스너를 구현하고 그때마다 지도의 중심 위치를 변경하는 코드를 작성할 것이다. 하지만 AngularJS의 데이터 바인딩 기능과 지시자 기능이 있기 때문에 쉽게 사용할 수 있는 gMap 지시자를 만들 수 있다. 그럼 google-map.js 파일을 다음과 같이 수정한다.

{% highlight javascript %}
//생략
  var map = new google.maps.Map(el, {}),
      mapOptions = {
        center: new google.maps.LatLng(cordi[0], cordi[1]),
        zoom: zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

  //center 속성을 감시하고 있다 값이 변경하면 해당 콜백함수를 호출한다. 이때 바뀐 값이 전달된다.
  iAttrs.$observe("center",function(value) {
    var latlng = JSON.parse(value);
    //구글 맵의 setCenter 메소드로 바뀐 값으로 맵의 중앙위치를 변경한다.
    map.setCenter({lat:latlng[0], lng:latlng[1]});
  });
  //위와 마찬가지로 zoom 속성을 감시한다.
  iAttrs.$observe("zoom",function(value) {
    map.setZoom(Number(value));
  });
//생략
{% endhighlight %}

이제 콤보박스와 zoom을 제어하는 요소들을 추가한 구글맵지시자 데모페이지를 아래와 같이 수정한다.

{% highlight html %}
<!-- 생략 -->
<script>
angular.module('demoApp', ['ngGMap']).
  controller('demoCtrl', ['$scope', function ($scope) {
    //서울과 부산의 좌표를 가지고 있는 목록이다.
    $scope.cordiList = [
      {
        name : '서울',
        center : [37.561192, 127.030487]
      },
      {
        name : '부산',
        center : [35.178202, 129.078666]
      }
    ];
    //콤보박스에서 선택한 좌표 정보이다.
    $scope.selectedCord = $scope.cordiList[0];
    //지도의 줌래밸이다.
    $scope.zoom = 12;
  }]);
</script>
</head>
<body ng-controller="demoCtrl">
  <form class="form-inline search-container">
    <div class="form-group">
      <select ng-model="selectedCord" class="form-control" ng-options="cord.name for cord in cordiList" >
      <input type="number" class="form-control" ng-model="zoom">
    </select>
    </div>
  </form>
  <div class="map-container">
    <!-- {{ "{{  " }}}} 를 이용하여 데이터 바인딩 처리를 한다. -->
    <g-map center="{{ "{{ selectedCord.center " }}}}" zoom="{{ "{{ zoom " }}}}"></g-map>
  </div>
</body>
<!-- 생략 -->
{% endhighlight %}

브라우저에서 데모 페이지를 읽으면 아래 그림과 같은 화면을 볼 수 있다.

{% bimg imgs/google_map_tutorial_03.png 300x300 %}변경된 구글지도 그림{% endbimg %}

지금까지 구글 지도 지시자를 만들어 보았는데 사실 더 많은 기능을 추가해야 된다. 이벤트 처리와 인포메이션 윈도우 처리 등... 정말 많은 기능이 필요로 한다. 우리가 원하는 데로 만들수도 있지만 벌써 훌륭한 오픈소스 개발자들이 만들어 공개하고있다. 그래서 몇 가지 지시자를 추천하며 튜토리얼을 맞추겠다.

* [Angularjs-Google-Maps](http://ngmap.github.io/)

* [Angular UI팀의 Google Maps](https://angular-ui.github.io/angular-google-maps/)

## References

- [angularjs official document](https://docs.angularjs.org/)
- [시작하세요 angularjs 프로그래밍](http://wikibook.co.kr/beginning-angularjs/)
- [Google Maps JavaScript API v3](https://developers.google.com/maps/documentation/javascript/)
