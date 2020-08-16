---
title: proxypool
tags:
  - coding
  - golang
  - proxy
categories:
  - coding
date: 2020-08-16 19:20:25
---

这两天完成的一个小项目，自动抓取tg频道、订阅地址、公开互联网上的ss、ssr、vmess节点信息，聚合去重测试可用性后提供节点列表

说实话，起这个名字一开始主要是想做隧道型的代理池的，因为目前互联网上提供的付费代理池我买不起，而免费的代理池都是给的http和socks代理，这两种类型的代理虽然方便爬虫程序使用，但是极其容易被封杀，所以大部分都处于不可用状态

而ss、ssr、vmess等翻墙使用的代理协议，不容易被封杀，但是却没有人提供这样的列表，当然，即使提供了也不方便使用，不能让爬虫方自己去维护各种协议的连接，而应该用隧道的形式将这些翻墙协议转换为http协议，提供api接口给爬虫便于其切换代理

基于以上需求，我便开始了这个项目，因为使用golang编写，在将这些协议转换为http协议方面，我可以直接调用开源软件clash的代码，它支持上述所有协议并且非常方便使用

所以，我目前的工作就转变为从互联网上爬取各种公开的ss、ssr、vmess代理，去重、聚合、检测可用性，维护一个代理列表

> 同时，这个列表还被各种翻墙软件所支持，就不多说了

## 支持

- 支持ss、ssr、vmess节点链接与订阅
- 任意 Telegram 频道抓取
- 机场订阅地址抓取解析
- 公开互联网页面模糊抓取
- 翻墙党论坛新节点信息
- 其他节点分享网站
- 定时抓取更新
- 使用配置文件提供抓取源
- 自动检测节点可用性

## 安装

### 从源码编译

需要安装Golang

```sh
$ go get -u -v github.com/zu1k/proxypool
```

### 下载预编译程序

从这里下载预编译好的程序 [release](https://github.com/zu1k/proxypool/releases)

### 使用docker

```sh
docker pull docker.pkg.github.com/zu1k/proxypool/proxypool:latest
```

## 使用

### 共享抓取配置文件

每一次抓取前会自动从github下载最新的抓取配置文件

直接运行 `proxypool` 程序即可

### 自定义抓取配置文件

```shell
proxypool -c source.yaml
```

### 帮助更新配置文件

可以在 https://github.com/zu1k/proxypool/issues/3 进行留言

### 用户使用

目前公开版本： https://proxy.tgbot.co

直接在clash添加配置文件即可使用： https://proxy.tgbot.co/clash/config

## 截图

{% asset_img speedtest.png [Speedtest] %}

{% asset_img fast.png [Fast] %}
