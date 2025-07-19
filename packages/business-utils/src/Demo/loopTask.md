---
title: LoopTask
nav:
  title: 方法
  path: /base-utils
  order: 3
order: 1
---

# LoopTask

## 简介

循环执行异步任务, 每隔一段时间执行一次, 如果任务成功退出循环, 如果任务失败, 延时重新执行任务, 超过最大次数后退出循环并报错

## 参数

| 参数            | 说明               | 类型                          | 默认值 | 版本 |
| --------------- | ------------------ | ----------------------------- | ------ | ---- |
| fn              | 异步任务           | (params: T) => Promise\<Res\> | -      |      |
| params          | 请求参数           | T                             | -      |      |
| interval        | 最大循环次数       | number                        | 3      |      |
| handler         | 异步任务成功回调   | (params: Res) => Promise<any> | -      |      |
| successCallback | 成功回调           | (res: Res) => void            | -      |      |
| errorCallback   | 失败回调           | (res: Res) => void            | -      |      |
| timeout         | 循环执行延迟(毫秒) | number                        | 1500   |      |
