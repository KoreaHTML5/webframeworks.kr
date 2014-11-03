---
layout : tutorials
title : Border Layout을 활용한 반응형 시스템 레이아웃 구성하기
category : tutorials
subcategory : setlayout
summary : 웹시스템이 사용자의 요구에 반응하도록 한다. Border레이아웃 구성을 사용해 고정 영역과 확장영역이 어떻게 반응하는지 알아본다.  
permalink : /tutorials/extjs/4_responsive_layout
title_background_color : RGB(8, 78, 119)
tags : javascript framework Ext JS tutorial
author : benneykwag
---
##Ext JS 레이아웃
ExtJS가 레이아웃을 구성하기 위해서는 다양한 종류의 레이아웃 매니저를 사용해 콤포넌트를 배치해야 한다.
레이아웃의 종류에 따라 다양한 쓰임새가 있지만 그중 BorderLayout은 시스템을 구성하는 전체 레이아웃을 구성하기에
적합하다. 시스템 레이아웃의 조건은 메뉴와 개별 프로그램이 브라우저의 확장과 축소에 유연하게 반응하고 사용자에게
적절하게 컨텐츠를 보여줘야 한다.

## 시스템 뼈대 구현
본격적인 구현에 들어가자. 상단, 좌측 , 중앙으로 나뉘는 시스템 뼈대를 구현할 것이다. Application.js 파일을 열고 autoCreateViewport 설정을 확인한다.
{% highlight javascript %}
/*
This file is generated and updated by Sencha Cmd. You can edit this file as
needed for your application, but these edits will have to be merged by
Sencha Cmd when upgrading.
*/
Ext.application({
name: 'ext5',
extend: 'ext5.Application',
autoCreateViewport: 'ext5.view.main.Main'
//-------------------------------------------------------------------------
// Most customizations should be made to ext5.Application. If you need to
// customize this file, doing so below this section reduces the likelihood
// of merge conflicts when upgrading to new versions of Sencha Cmd.
//-------------------------------------------------------------------------
});
{% endhighlight %}
Sencha CMD를 이용해 실행할 때 main.Main 클래스가 자동으로 호출된다. Main 클래스에서 시스템 영역을 세 개로 나누게 구현한다.

{%highlight javascript%}
Ext.define('ext5.view.main.Main', {
    extend: 'Ext.container.Viewport', // #1
    controller: 'main', // #2
    viewModel: {
        type: 'main' // #3
    },
    layout: 'border', // #4
    items: [
        {
            region: 'north', // #5
            html : '상단메뉴',
            frame: true,
            xtype: 'panel'
        },
        {
            region: 'center', // #6
            xtype: 'panel',
            frame: true,
            html : '프로그램실행영역'
        },
        {
            xtype: 'panel', // #7
            region: 'east',
            title : '코드보기',
            split: true,
            collapsible: true,
            collapsed: true,
            width: 350,
            minWidth: 100
        }
    ]
});
{% endhighlight %}
1. viewport 클래스를 확장했음을 명심하자. 이 클래스는 따로 renderTo를 설정하지 않아도 생성 즉시 브라우저에 꽉차게 렌더링 된다.
2. 뷰 컨트롤러가 기본 main으로 설정돼 있다. 초기 값으로 MainController 기존 내용은 지우고 이후 새롭게 구현하겠다.
3. 뷰 모델 또한 (#2)와 같다. 이후 구현하겠다.
4. 세 개 영역으로 시스템을 구성하기 위해 border 레이아웃을 사용한다.
5. 북쪽(north) 영역에는 상단 메뉴가 위치한다. 아직 구현하지 않았으므로 panel 클래스로 위치만 확보한다.
6. 중앙(center) 영역에는 프로그램 메뉴와 프로그램 실행 결과를 표시한다.
7. 동쪽(east) 영역에는 각 예제 코드를 보여준다.

![](imgs/img01.png)<br>
**그림 1 뷰포트 내부에 초기 레이아웃을 지정한다.**

##상단메뉴 구성
상단메뉴을 구성하는 첫번째 클래스를 작성하자.
{%highlight javascript%}
Ext.define('ext5.view.TopMenu', {
    extend: 'Ext.toolbar.Toolbar', // #1
    xtype: 'topmenu',
    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'button',
                    cls: 'custom-button-text-bold',
                    text: 'ExtJS Ria Application',
                    menu: {
                        xtype: 'menu',width: 200,
                        items: [
                            {
                                xtype: 'menuitem',
                                itemId: 'about',
                                width: 300,
                                iconCls: 'button-icon-film',
                                text: '애플리케이션 정보',
                                listeners: {
                                    click: 'showAbout' // #2
                                }
                            },
                            {
                                xtype: 'menuseparator'
                            },
                            {
                                xtype: 'menuitem',
                                iconCls: 'button-icon-display',
                                text: '보기설정',
                                menu: {
                                    xtype: 'menu',
                                    width: 120,
                                    items: [
                                        {
                                            xtype: 'menuitem',
                                            itemId: 'fullscreen',
                                            handler: 'onFullScreen', // #3
                                            iconCls: 'button-icon-move',
                                            text: '전체보기 설정'
                                        },
                                        {
                                            xtype: 'menuitem',
                                            disabled: true,
                                            itemId: 'originscreen',
                                            handler: 'onOriginScreen', // #4
                                            iconCls: 'button-icon-trackback',
                                            text: '전체보기 해제'
                                        }
                                    ]
                                }
                            },
                            {
                                xtype: 'menuitem',
                                itemId: 'exit',
                                iconCls: 'button-icon-exit',
                                text: '프로그램 종료',
                                handler: 'onExit' // #5
                            }
                        ]
                    }
                }
            ]
        });
        me.callParent(arguments);
    }
});
{% endhighlight %}
1. toolbar를 확장한 클래스다.
2. 아직 컨트롤러를 만들지 않았으나 이후 컨트롤러에 showAbout 메서드를 구현하면 호출될 것이다.
3. 앱을 전체 화면으로 출력하는 기능을 구현할 것이다.
4. 전체화면에서 이전 화면으로 변경하는 기능을 구현할 것이다.
5. 프로그램 종료 기능을 구현한다.

ext5.view.Header 클래스를 구현한다. 앞서 구현한 ext5.view.TopMenu 클래스를 첫 번째 자식 아이템으로 추가하고 나머지 구현을 마치자.
{%highlight javascript%}
Ext.define('ext5.view.Header', {
    extend: 'Ext.container.Container', // #1
    xtype: 'frameheader',
    requires: [
        'Ext.toolbar.Toolbar',
        'Ext.button.Button',
        'Ext.toolbar.Separator',
        'Ext.toolbar.Fill',
        'Ext.ProgressBar',
        'ext5.view.TopMenu',
        'ext5.view.HeaderController'
    ],
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    controller: 'header', // #2
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'topmenu' // #3
                },
                {
                    xtype: 'toolbar',
                    layout: {
                        type: 'hbox'
                    },
                    items: [
                        {
                            xtype: 'button', // #4
                            itemId: 'fullscreen',
                            handler: 'onFullScreen',
                            iconCls: 'button-icon-move'
                        },
                        {
                            xtype: 'button', // #5
                            disabled: true,
                            itemId: 'originscreen',
                            handler: 'onOriginScreen',
                            iconCls: 'button-icon-trackback'
                        },
                        {
                            xtype: 'tbseparator'
                        },
                        {
                            xtype: 'button', // #6
                            handler: 'goDashboard',
                            iconCls: 'button-icon-home'
                        },
                        {
                            xtype: 'tbfill'
                        },
                        {
                            xtype: 'button',
                            itemId: 'help',
                            iconCls: 'button-icon-help'
                        },
                        {
                            xtype: 'progressbar',
                            itemId: 'topprogressbar',
                            maxWidth: 400,
                            minWidth: 300,
                            text: 'Stand By...',
                            value: 0
                        }
                    ]
                }
            ]
        });
        me.callParent(arguments);
    }
});
{% endhighlight %}
1. Container를 확장한 클래스다.
2. 뷰 컨트롤러를 설정한다. 아직 정의되지 않았으므로 이후에 정의한다.
3. TopMenu 클래스를 첫 번째 아이템으로 설정한다.
4. 전체보기 버튼을 배치한다.
5. 전체보기 상태에서 이전 상태로 돌아간다.
6. 대시보드로 바로가는 버튼이다.

Header, TopMenu 클래스에서 사용할 CSS를 common.css에 추가한다.
    
{%highlight css%}
.button-icon-film {
    background-image: url(../images/icons/png/Film.png);
    background-repeat: no-repeat;
}
.button-icon-display {
    background-image: url(../images/icons/png/Display.png);
    background-repeat: no-repeat;
}
.button-icon-move {
    background-image: url(../images/icons/png/Move.png);
    background-repeat: no-repeat;
}
.button-icon-trackback {
    background-image: url(../images/icons/png/Trackback.png);
    background-repeat: no-repeat;
}
.button-icon-exit {
    background-image: url(../images/icons/png/Exit.png);
    background-repeat: no-repeat;
}
.button-icon-home {
    background-image: url(../images/icons/png/Home.png);
    background-repeat: no-repeat;
}
.button-icon-component {
    background-image: url(../images/icons/png/Component.png);
    background-repeat: no-repeat;
}
.button-icon-help {
    background-image: url(../images/icons/png/Helpbook.png);
    background-repeat: no-repeat;
}
{% endhighlight %}

HeaderController 클래스를 정의한다. HeaderController는 Header 클래스가 사용할 뷰 컨트롤러다. Header, TopMenu에서 호출되는 기능을 구현할 수 있게 메서드만 미리 준비한다.
{%highlight javascript%}
    Ext.define('ext5.view.HeaderController', {
        extend: 'Ext.app.ViewController',
        alias: 'controller.header',
        goDashboard: function () {
        },
        showAbout: function () {
        },
        onFullScreen: function () {
        },
        onOriginScreen: function () {
        },
        onExit: function (button) {
        }
    });
    {% endhighlight %}

지금까지 상단 메뉴를 구성하는 Header, TopMenu, HeaderController 클래스를 모두 정의했다. Main 클래스 north 영역을 Header 클래스로 교체한다.
{%highlight javascript%}
    Ext.define('ext5.view.main.Main', {
        extend: 'Ext.container.Viewport',
        requires: ['ext5.view.Header'],
        controller: 'main',
        viewModel: {
            type: 'main'
        },
        layout: 'border',
        items: [
            {
                region: 'north',
                xtype: 'frameheader'
            }
        ]
    });
    {% endhighlight %}

![](imgs/img02.png)<br>
**그림 2 상단메뉴를 툴바와 메뉴아이템등으로 구성을 마쳤다.**