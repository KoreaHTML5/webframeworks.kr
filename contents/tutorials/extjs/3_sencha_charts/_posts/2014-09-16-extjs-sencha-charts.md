---
layout : tutorials
title : Sencha Chart따라하기.
category : tutorials
subcategory : data-display
summary : 차트는 Ext JS5에 들어와 향상된 센차터치의  차트를 사용하기 시작했다. 기존 레거시 차트를 ext-chart라 부르고 sencha-charts를 새로운 차트라 부르며 사용한다. 이는 모바일 디바이스에 대응하기 위함이기도 하다.
permalink : /tutorials/extjs/3_sencha_charts
title_background_color : RGB(8, 78, 119)
tags : javascript framework Ext JS tutorial
author : benneykwag
---
#Sencha 차트
차트는 Ext JS5에 들어와 향상된 센차터치의  차트를 사용하기 시작했다. 기존 레거시 차트를 ext-chart라 부르고 sencha-charts를 새로운 차트라 부르며 사용한다. 이는 모바일 디바이스에 대응하기 위함이기도 하다. 이제 우리는 변화된 새로운 sencha-chart에 대해 알아보고 샘플을 통해 작성방법을 배울 수 있을 것이다.

##차트의 종류
차트의 종류는 총 3가지가 존재한다.

1. Cartesian : X-Y 평면에 수치를 표현한다. Bar, Area, Scatter, Line Chart 포함된다.
2. Polar : 원표면에 수치를 표현한다. Pie, Radar Chart가 포함된다.
3. Spacefilling : 차트의 영역을 채우며 수치를 표현한다. Gauge Chart가 포함된다.


![](imgs/img01.png)<br>
**그림 1 3가지 종류의 Chart가 존재한다.**

##차트 아키텍쳐
Sencha Charts패키지는 아래 주요클래스의 설정으로 이루어진다.

- Chart(Ext.chart.AbstractChart)
  모든 종류 chart를 구현하는 공용클래스다. Chart클래스는 아래 기능을 차트 종류에 맞게 관리한다.
  * Axis
  * Legend
  * Theme
  * Grid
  * Interaction
  * Events
- Series(Ext.chart.series.Series)

  이 클래스의 의해 bar, column, line, area등의 차트로 정의된다.
  Series클래스는 차트 내부에 데이터를 표현하는 로직이 포함되어 있다.

- Sprite(Ext.draw.sprite.Sprite)

	Sprite는 다양한 도형을 그리기 위한 클래스다.(직사각형(rectangle), 타원(ellipse)). ....
- Draw(Ext.draw.Container)

  Draw는 차트가 그려지는 메인 컨테이너다. 이 클래스는 Ext.panel.Panel클래스를 확장하여 이 위에 surface클래스가 겹쳐져 그려질 것이다. 또한 이 클래스는 차트를 다운로드 받는 API를 제공한다.

- Surface(Ext.draw.Surface)

  차트는 다양한 계층의 surface로 나뉘어진다. 각 계층의 surface는 특정한 정보에 대해 렌더링을 담당한다. 각 surface는 내부 engine이용 HTML Canvas나 SVG로 렌더링하게 된다.

- Engine(Ext.draw.engine.Canvas , Ext.draw.engine.Svg)

  Sencha Chart Stack에서 가장 낮은 stack의 클래스다. Canvas클래스와 Svg클래스로 구분되고, surface클래스에 관한 API를 제공한다.

![](imgs/img02.png)<br>
**그림 2 Sencha Chart Stack Layer**

##차트 내부 하위 구성요소

차트 내부에서 차트를 구성하는 구성요소를 알아보자.

* Axis(Ext.chart.axis.Axis)

  축(Axis)기반 차트에서 축을 제공한다. Sencha Chart에서는 3종류(Numeric, Category, Time)의 Axis클래스를 지원한다.
* Legend(Ext.chart.Legend)

  Chart의 주석을 구현하는 클래스다. 정상적으로 데이터가 제공된다면 특별한 설정이 필요 없을 것이다.

* Markers(Ext.chart.Markers)

  Axis차트에서 축의 임계치를 정의할때 사용된다. bar, circle Chart에서 series를 렌더링 할때 각 series값을 표현하는데도 사요된다.

* Grid(Ext.chart.grid)

  Axis(축)차트에서 Grid라인을 그리는데 사용된다.

* Interaction(Ext.chart.interaction.Abstract)

  이 클래스는 차트가 사용자와 상호작업할 수 있도록 지원한다.

* Theme(Ext.chart.theme.Theme)

  Theme클래스는 theme에 대한 정의를 확장해 axis, label, series등의 항목을 재정의 한다.

## 차트 클래스 다이어그램

아래 다이어그램은 chart stack에서 다양한 클래스들이 어떤 연관관계를 가지는지 보여준다.

![](imgs/img03.png)<br>
**그림 3 Sencha Chart Class Diagram.**

## 다양한 계층의 Surface
차트는 다양한 계층의 surface가 존재한다. 각 surface클래스는 자신의 content를 차트내부에서 렌더링하게 된다. 그림4와 같이 차트의 각 계층은 HTML의 Z축으로 구조화된다.

![](imgs/img04.png)<br>
**그림 3 차트의 계층구조**

# 차트의 구현
이제 다양한 차트를 직접 구현하며 차트의 특성과 구현방법에 대해 배워보겠다. 우리는 이미 Getting Start에서 개발을 위한 환경을 구축하였다.
## Bar, Column 차트
bar차트와 Column차트는 용어가 다를뿐 동일한 Series클래스이다. 이 두개의 차트는 axes의 Position설정에 의해 가로로 배치되면 bar차트, 세로로 배치되면 column차트로 불리운다.
우리는 Column차트를 구현하고 약간의 설정 변경으로 Bar차트로 변경해 볼 것이다.

### HTML파일 준비

{% highlight html %}
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="UTF-8">
    <title>Table Layout</title>
    <link rel="stylesheet" type="text/css"
          href="/ext/packages/ext-theme-gray/build/resources/ext-theme-gray-all-debug.css">
    <link rel="stylesheet" type="text/css"
          href="/ext/packages/sencha-charts/build/neptune/resources/sencha-charts-all-debug.css">
    <script type="text/javascript" src="/ext/ext-all-debug.js"></script>
    <script type="text/javascript" src="/ext/packages/sencha-charts/build/sencha-charts.js"></script>
</head>
<body>
<script type="text/javascript">
    Ext.Loader.setConfig({
        enabled: true,
        paths: {
            'ext5': '/app'
        }
    });
    Ext.require([
        'ext5.view.chapter9.BasicColumn'
    ]);

    Ext.onReady(function () {
        // 모델을 생성하고 필드를 채운다.
        var board = Ext.create('ext5.view.chapter9.BasicColumn', {
            renderTo : document.body
        });
    });
</script>
</body>
</html>
{% endhighlight %}



클래스를 작성한다. 이 클래스는 Container클래스를 확장하고 Fit레이아웃으로 설정되어 하나의 자식 컴포넌트(차트)를 가질 것이다.

{% highlight javascript %}
Ext.define('ext5.view.chapter9.BasicColumn', {
    extend: 'Ext.container.Container',
    requires: ['ext5.view.chapter9.BasicColumnModel'],
    width: 800,
    height: 400,
    layout: 'fit',
    viewModel: {
        type: 'chapter8-basiccolumn'
    },
    items: [
        {
            xtype: 'cartesian',     // 1
            bind: { // 2
                store: '{recordset}'    // 3
            },
            title: '서울 경기지역 가계지출내역 ',   // 4
            titleAlign: 'center',   // 5
            axes: [     // 6
                {
                    type: 'numeric',    // 7
                    grid: {
                        odd: {      // 8
                            fill: '#e8e8e8'
                        }
                    },
                    position: 'left',   // 9
                    title: '금액'
                },
                {
                    type: 'category',   // 10
                    position: 'bottom', // 11
                    fields: ['group']   // 12
                }
            ],
            series: [   // 13
                {
                    type: 'bar',    // 14
                    xField: 'group',    // 15
                    yField: ['price1'] // 16
                }
            ],
            insetPadding: {     // 17
                top: 40,
                right: 40,
                bottom: 20,
                left: 20
            }
        }
    ]
});
{% endhighlight %}


1. xtype으로 cartesian을 사용했다. cartesian차트는 평면에 수치를 표현하는 타입으로 Bar, Area, Scatter, Line차트 등이 이에 포함된다.
2. 차트에 제공되는 데이터는 뷰모델의 정의된 스토어를 바인딩한다.
3. 바인딩되는 스토어는 "{}"로 감싼다.
4. cartesian클래스는 Ext.panel.Panel클래스를 확장하여 Panel클래스의 Title Config를 사용할 수 있다.
5. (4)의 title을 중앙정렬한다.
6. axes는 축을 설정하는 Config다.
7. 좌측에 위치할 numeric(눈금자)를 설정했다.
8. 눈금에 맞는 눈금선을 그린다. odd는 홀수를 의미하고 눈금의 홀수에 해당하는 영역을 채우도록 한다.(fill:'#e8e8e8')
9. numeric의 위치를 left로 설정한다.
10. category(항목)을 (11)bottom위치에 설정한다.
12. category에 표시할 필드를 설정한다.
13. series내부에 차트의 종류를 설정하면 비로서 차트가 완성된다.
14. bar차트를 추가하겠다.
15. xField는 각 차트가 공통적으로 사용할 가로 필드다. category에 설정된 group과 동일하게 설정한다.
16. bar차트 하나가 표시할 필드를 설정한다. 하나의 bar차트가 **price1** 필드의 값을 표시할 것이다.
17. 차트를 중심으로 상하좌우에 간격을 설정한다.

뷰모델 클래스를 작성하자. 이 클래스는 BasicColumn클래스가 사용할 스토어를 정의하고 있다.
{% highlight javascript %}
Ext.define('ext5.view.chapter9.BasicColumnModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.chapter8-basiccolumn',
    stores: {
        recordset: {
            data: [
                {group: '서울',  gubun:'1', price1:102920, price2:120010, price3:302920 },
                {group: '인천',  gubun:'2', price1:760000, price2:890100, price3:230100 },
                {group: '수원',  gubun:'3', price1:120010, price2:301000, price3:129000 },
                {group: '고양',  gubun:'4', price1:420100, price2:203000, price3:400000 },
                {group: '성남',  gubun:'5', price1:190100, price2:902000, price3:250390 }
            ],
            fields:['group', 'price1', 'price2','price3']
        }
    }
});
{% endhighlight %}


완성된 코드를 실행하면 그림 5와 같이 Column 차트가 확인 될 것이다.

![](imgs/img05.png)<br>
**그림 5 Column차트의 기본 구현**




위의 차트는 **price1** 필드 하나만 표시하고 있는데 **price2, price3**필드도 함께 표시하도록 변경하자.
{% highlight javascript %}
series: [
    {
        type: 'bar',
        xField: 'group',
        yField: ['price1', 'price2', 'price3'] // 1
    }
],
{% endhighlight %}

1. yField Config를 배열로 처리하고 **price1, price2, price3 ** 필드 모두를 채워 넣었다.

수정 내용을 확인하자. 그림 6은 우리가 원하는 결과가 아니다 우리는 3개의 Column차트가 함께 그룹을 이루며 보여지길 원했으나 3개의 Column차트가 층을 이뤄 쌓이고 말았다.
![](imgs/img06.png)<br>
**그림 6 Series의 yField를 수정하면 Column차트를 추가할 수 있다.**

이를 해결하기 위한 bar series에 stacked: false Config를 추가한다. 이 설정은 3개의 Column 층을 이뤄 쌓이지 않도록 해준다.
이와 함께 범례(레전드)가 보이도록 같이 설정하겠다.
{% highlight javascript %}
{
    xtype: 'cartesian',
    ...
    legend: {                       // 1
        docked: 'bottom'       // 2
    },
    ...
    series: [
        {
            type: 'bar',
            xField: 'group',
            title: ['식비', '통신비', '의복'], // 3
            yField: ['price1', 'price2', 'price3'],
            stacked: false    // 4
        }
    ],
    ...
}
{% endhighlight %}


1. 차트에 범례(레전드)를 추가하고 위치(2)를 bottom으로 설정했다.
3. price1, price2, price3필드를 대신할 한글명을 설정했다. 이 설정은 범례에 표시되게 된다.
4. stacked Config는 기본 true로 yField를 여러개 설정하면 필드들이 모두 하나로 쌓이게 되므로 이 설정을 false로 변경한다.

그림 7을 통해 수정된 코드를 확인하자. 레전드가 추가되었고 Column차트가 쌓이지 않고 독립적으로 3개의 차트가 출력되었다.
![](imgs/img07.png)<br>
**그림 7 stacked:false설정으로 Column차트를 분리하고 레전드를 추가했다.**

지금까지 결과물은 Column차트였다. 이제는 차트의 막대를 회전시켜 가로로 표시되는 bar차트로 변경되도록 기존 코드를 수정할 것이다.

차트를 수정하려면 먼저 축을 이루는 **numeric, category**의 position을 변경하고 flipXY Config를 true로 설정해야한다.
{% highlight javascript %}
axes: [
    {
        type: 'numeric',
        grid: {
            odd: {
                fill: '#e8e8e8'
            }
        },
        position: 'bottom',   // 1
        title: '금액'
    },
    {
        type: 'category',
        position: 'left',       // #2
        fields: ['group']
    }
],
flipXY: true,   // 3
{% endhighlight %}

1. numeric의 **position** Config를 기존 **left**에서 **bottom**으로 변경했다. 이제 눈금을 가진 Y축은 하단으로 이동할 것이다.
2. category의 **position** Config를 기존 **bottom**에서 **left** 로 변경했다.
3. flipXY:true로 설정하자. 축이 변경 될 것이다.

결과를 확인하자. 그림 8처럼 세로형태의 Column차트가 가로형태의 Bar차트로 전환 된것이 확인되었다.
![](imgs/img08.png)<br>
**그림 8 axes의 position과 flipXY변경하여 Column차트를 Bar차트로 변경했다..**

이렇듯 Column차트와 Bar차트는 동일 클래스의 설정을 변경한다는 것을 배우게 되었다.


###참조
- http://docs.sencha.com/extjs/5.0/components/introduction_to_charting.html
- http://blogs.walkingtree.in/2014/08/30/sencha-ext-js-5-charts-architecture/
- http://docs-origin.sencha.com/extjs/5.0/whats_new/5.0/charts_upgrade_guide.html
