---
layout : tutorials
title :  Grid로 대용량 데이터 다루기
category : tutorials
subcategory : data-query
summary : 이장에서는 ExtJS 그리드를 통해 대량의 데이터를 다루는 방법에 대해 배워본다. 
permalink : /tutorials/extjs/7_bigdata_grid
title_background_color : RGB(8, 78, 119)
tags : javascript framework Ext JS tutorial
author : benneykwag
---
#Grid로 대용량 데이터 다루기
웹브라우저는 CS 애플리케이션과 달리 대량 데이터를 다루는 데 한계가 있다. 이는 모든 이가 공감하는 부분이고 웹의 지향점과는 분명히 선을 긋는 것이 사실이다. 이러한 대량의 데이터를 표현하기 위해 페이징 처리를 하기도 하지만, 페이징 처리는 사용자로 하여금 많은 데이터를 한눈에 펼쳐보고 마우스를 이용해 재빠르게 스크롤해 원하는 위치의 데이터를 보고 싶은 욕구는 충족시키지 못한다.

Ext JS는 이를 위해 BufferedRenderer를 제공한다. 이 기능은 사용자로 하여금 대량의 데이터를 페이징 없이 보여주며, 원하는 위치로 스크롤 하면 해당 데이터를 빠르게 보여줄 수 있게 고안됐다.

그러나 실제로는 사용자가 눈치채지 못하는 순간에 스크롤 위치를 계산해 해당 데이터를 서버에서 요청 받고 브라우저에 출력하는 것이다. 이러한 메커니즘은 항상 같은 돔 사이즈를 유지해줘 브라우저가 대량 데이터를 표시하는 동안 발생하는 여러 성능 이슈를 피해갈 수 있다.

테스트를 위해 HTML파일을 준비하자.
{%highlight html%}
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="UTF-8">
    <title>Table Layout</title>
    <link rel="stylesheet" type="text/css"
          href="/ext/packages/ext-theme-gray/build/resources/ext-theme-gray-all-debug.css">
    <script type="text/javascript" src="/ext/ext-all-debug.js"></script>

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
        'ext5.view.chapter7.BigDataGrid'
    ]);

    Ext.onReady(function () {
        Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));
        var fp = Ext.create('ext5.view.chapter7.BigDataGrid', {
            stateful: true,     // #3
            stateId: 'stateGrid',   // #4

            renderTo: document.body
        });
    });
</script>
</body>
</html>
{% endhighlight %}
그리드 클래스를 생성한다.
{%highlight javascript%}
Ext.define('ext5.view.chapter7.BigDataGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.chapter7-bigdatagrid',
    requires: [
        'Ext.grid.column.RowNumberer',
        'Ext.data.proxy.JsonP'
    ],
    width: 700,
    height: 280,

    columnLines: true,

    initComponent: function () {
        var me = this;
        var store = Ext.create('Ext.data.Store', {  // #1
            fields: [
                {
                    name: 'title'
                },
                {
                    name: 'forumtitle'
                },
                {
                    name: 'forumid',
                    type: 'int'
                },
                {
                    name: 'username'
                },
                {
                    name: 'replycount',
                    type: 'int'
                },
                {
                    name: 'lastpost',
                    type: 'date',
                    dateFormat: 'timestamp'
                },
                'lastposter'
            ],
            pageSize: 10,
            buffered: true,
            proxy: {
                type: 'jsonp',
                url: 'http://www.sencha.com/forum/remote_topics/index.php',
                reader: {
                    rootProperty: 'topics',
                    totalProperty: 'totalCount'
                }
            },
            autoLoad: true
        });
        Ext.apply(this, {
            dockedItems: [
                {
                    dock: 'bottom',
                    xtype: 'pagingtoolbar',     // #2
                    store: store
                },
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [
                        {
                            xtype: 'component',     // #3
                            itemId: 'status',
                            tpl: '전체 게시물 : {count}',
                            style: 'margin-left:15px'
                        }
                    ]
                }
            ],
            store: store,
            columns: this.getColumnConfig()
        });
        me.callParent(arguments);
        me.store.on('datachanged', me.onStoreSizeChange, me);  // #4
    },

    onStoreSizeChange: function () {    // #5
        this.down('#status').update({count: this.store.getTotalCount()});
    },

    getColumnConfig: function () {
        var me = this;
        return   [
            {
                xtype: 'rownumberer',
                width: 50,
                sortable: false,
                renderer: function (value, meta, record, row, col, store) {
                    // #6
                    return store.getTotalCount() - row - ((store.currentPage - 1) * store.pageSize);
                }
            },
            {
                text: "Topic",
                dataIndex: 'title',
                flex: 1,
                sortable: false
            },
            {
                text: "Author",
                dataIndex: 'username',
                width: 100,
                hidden: true,
                sortable: false
            },
            {
                text: "Replies",
                dataIndex: 'replycount',
                align: 'center',
                width: 70,
                sortable: false
            },
            {
                id: 'last',
                text: "Last Post",
                dataIndex: 'lastpost',
                width: 130,
                renderer: Ext.util.Format.dateRenderer('n/j/Y g:i A'),
                sortable: false
            }
        ];
    }
});
 {% endhighlight %}
1. 스토어를 생성한다. 페이징 처리를 위해 pageSize를 10으로 설정해 페이지당 10개 데이터를 표시한다.
2. 페이징 처리를 위해 docktedItems에 페이징 툴바를 추가한다.
3. 전체 게시물 수를 파악하기 위해 필요하다.
4,5. 게시물 수가 변경되면 onStoreSizeChange() 메서드를 호출한다. 이 코드는 캐시가 적용된 상태(Bufferedrender)에서 작동한다.
6. rownumberer 표기를 1부터가 아닌 전체 게시물 개수부터 거꾸로 보이게 한다.

코드를 실행하면 그림 1과 같은 결과를 얻을 것이다
![](imgs/img01.png)<br>
**그림 1 페이징툴바가 적용된 그리드의 모습.**

여기까지는 평범한 페이징 툴바가 있는 그리드일 뿐이다. 그러나 고객이 페이징 처리에 불만을 가지고 모든 데이터를 한 페이지에 보여달라고 한다. 이 때 서버는 Ext Js가 보내는 페이지 번호를 처리하지 않고 데이터베이스에 있는 모든 정보를 반환하면 될 것이다. 이 예제에서는 sencha.com 페이지를 이용하므로 모든 데이터를 출력하기 위해 데이터 전체 개수보다 많은 10,000건을 한페이지에 보여주게 스토어 pageSize 설정을 변경하면 된다.

pageSize : 10000,

위의 코드를 실행하자. 실행과 동시 7천여 건 데이터를 서버로부터 전달 받고 전달받은 데이터를 그리드에 표시하기 위해 총 10초 정도 긴 시간이 소요된다. 물론 7천 여건에 맞는 스크롤바가 생성돼 원하는 데이터를 확인할 수 있다. 하지만 과연 적절한 방식일까? 전체 데이터를 표시하기 위해 그리드는 분주하게 움직여야하고 모든 데이터를 브라우저가 감당할 수 있을지도 미지수다. ExtJS 4에서는 이런 때 모든 데이터를 브라우저에 렌더링하므로 성능에 문제가 발생해 플러그인으로 bufferedrender를 사용해 성능 문제를 해결했다. Ext JS 5에서는 이 bufferrender를 기본으로 사용해 많은 양의 데이터를 브라우저에 한 번에 렌더링 하지 않고 일부만 렌더링하고, 스크롤을 이용해 동적으로 렌더링 데이터를 조작하게 한다.

개발자도구 콘솔를 열고 다음 코드를 실행하자.

document.getElementsByTagName("*").length

이 코드는 7천 여건 전체 데이터를 렌더링했을 때 돔 사이즈를 보여준다. 데이터량에 비해 현저히 낮은 수준이다.
![](imgs/img02.png)<br>
**그림 2 bufferrender가 기본 적용된 그리드는 많은량 데이터에도 돔사이즈는 작다.**
개발자도구 Elements 탭에서 실제 렌더링 결과를 확인해 보자. 그림 3은 Table 태그로 시작하는 반복 구간 시작점을 보여준다.
![](imgs/img03.png)<br>
**그림 3  그리드 렌더링 결과 중 데이터 반복구간의 시작점.**

그림 4 처럼 좀 더 아래쪽으로 내려가 데이터가 끝나는 반복 구간으로 스크롤해 이동하자.
![](imgs/img04.png)<br>
**그림 4 그리드의 렌더링 결과 중 데이터 반복구간의 끝지점.**

페이지당 출력되는 데이터 수를(pageSize) 10,000으로 변경했지만 실제 렌더링된 데이터는 20건이다. 그리드 스크롤을 움직여 보자. 스크롤의 움직에 반응해 Elements 탭의 table 태그가 반응하는 모습을 볼수 있다. 자세히 보면 스크롤을 위로 올리든 아래로 내리든 항상 20개 데이터를 유지하는 모습을 확인할 수 있다. 이는 buffererRender가 기본으로 적용되기 때문이다. 그리드에 다음 코드와 같이 bufferedRender를 설정해 기본 설정값을 바꿔보자.

{%highlight javascript%}
plugins: [
    {
        ptype: 'bufferedrenderer',
        trailingBufferZone: 10, // #1
        leadingBufferZone: 10 // #2
    }
],
{% endhighlight %}

1. 눈에 보이는 그리드 영역 이전에 대기할 행 갯수를 설정한다. 기본 값은 10이다.
2. 눈에 보이는 그리드 영역 이후에 대기할 행 갯수를 의미한다. 기본 값은 20이다.

BufferedRenderer는 전체 데이터의 갯수 중 그리드 크기에 따라 보이는 행과 스크롤에 대비해 보여질 수 있는 예비 행만 렌더링해 부하를 줄일 수 있게 하는 것이다.
![](imgs/img05.png)<br>
**그림 5 leadingBufferZone과 trainingBufferZone은 스크롤에 대비 미리갖는 행을 갖는다.**

코드를 실행하고 개발자도구 Elements 탭에서 렌더링된 그리드를 살펴보자. 다음 그림과 같이 총 30개 행이 렌더링 된 모습이 보일 것이다.

30개 = 눈에 보이는 그리드의 10개 + 이전 예비 행 10개 + 이후 예비 행 10개
![](imgs/img06.png)<br>
**그림 6 bufferrender플러그인을 추가하고 설정을 변경한 결과.**

이 상태에서 그리드 스크롤을 작동시켜 어떻게 바뀌는지 관찰하자. BufferRenderer가 스크롤 위치에 따라 상하로 행을 지우고, 추가하며 항상 30개 행을 유지한다. 스크롤을 빠르게 움직여도 적절하게 반응하고 알맞은 행을 보여준다. BufferRenderer는 서버가 전달한 데이터를 캐시에 넣고 필요한 만큼에 일부 데이터만 그리드에 표시해 성능을 개선한 것이다. 일반적으로 10보다는 큰값을 유지하는 게 좋다.

그림 7처럼 개발자 도구 콘솔에 돔 사이즈를 다시 확인하자. 이전에 비해 크기가 작아졌다. bufferedRender 설정 이전에 leadingBufferZone 기본값이 20이었으므로 약간에 차이를 생기는 것이 이해될 것이다.

![](imgs/img07.png)<br>
**그림 7 bufferrender 플러그인을 설정한 후 돔사이즈에 약간에 변화가 있다.**

이는 leadingBufferZone과 trailingBufferZone이 준비된 행만 렌더링하고 나머지 데이터는 캐시에 저장하기 때문이다.

지금까지 그리드 성능은 향상됐지만, 아직 실행에는 문제가 있다. BufferRenderer를 활용해 7천 여건 데이터 중 일부만 보여주는 방법으로 성능을 향상시켰지만, 여전히 7천 여건 데이터를 가져오기 위한 로딩 시간은 줄일수 없는 것일까? 이에 대한 해답을 스토어에서 찾아보자.

스토어에 buffered를 true로 설정하고 pageSize를 10,000건에서 100건으로 줄인다.
{%highlight javascript%}
{
    …
    buffered: true,
    pageSize: 100,
    ...
}
 {% endhighlight %}

그리드 bufferedrender 설정도 현실적인 값으로 변경한다.
{%highlight javascript%}
plugins: [
    {
        ptype: 'bufferedrenderer',
        trailingBufferZone: 100,
        leadingBufferZone: 100
    }
],
 {% endhighlight %}
위 설정을 변경하고 실행하면 이전에 비해 데이터 로딩 시간이 확연하게 줄어든다. 이는 스토어 buffered를 true로 설정했기 때문에 그리드 leadingBufferZone과 trailingBufferZone이 모두 소비되면 다음 페이지의 정보를 서버에 자동으로 요청하기 때문이다. 페이징 처리를 스크롤을 이용하게되고 스크롤 위치를 급작스럽게 변경해도 이를 계산해 스크롤 위치에 맞는 데이터를 서버에 요청하고 그리드에 보여주게 된다.

