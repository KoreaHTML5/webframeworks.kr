---
layout : tutorials
title :  DDP로 다리놓기
category : tutorials
subcategory : data-binding
summary : DDP를 이용하여 Meteor와 통신하는 사례를 배워본다
permalink : /tutorials/core_meteor/3_ddp_meteor
title_background_color : 1C1C1F
title_color : E4E4E4
tags : javascript meteor DDP
author : acidsound
---
# [Core Meteor] DDP로 다리놓기

Meteor는 Web Application이지만 기존 HTTP 통신을 최초에 자원을 읽어올때 한번만 사용하고 그 이후로는 DDP(Distributed Data Protocol https://www.meteor.com/ddp)를 이용하여 자료교환을 합니다.

![Meteor 작동방식(http://meteorhacks.com)](imgs/G7FJMkTwwh.png)
