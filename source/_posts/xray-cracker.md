---
title: xray社区高级版破解
tags:
  - coding
  - cracker
  - keygen
  - xray
categories:
  - coding
keywords:
  - cracker
  - keygen
  - xray
  - 破解
  - 高级版
date: 2020-06-18 09:06:25
---

> 首先感谢 长亭科技 提供 xray 这款非常方便非常好用的安全工具  
> 俗话说：没有人破解的工具不是好工具  
> 根据没有任何数据支持的统计，大部分安全研究人员使用的安全工具都是盗版  
> 包括但不限于： IDA \ JEB \ BurpSuite \ Vmware

前几天长亭官方有个活动，可以领2个月的xray社区高级版证书，正好趁这个机会逆向分析了一下xray的证书算法，写了一个证书生成器

因为xray证书用到了rsa算法，所以需要替换xray程序中的公钥，将该功能也集成在工具中了

相关算法分析文章后面有空再写

> 更新：增加了证书算法的部分细节

## 工具使用

### 查看帮助

使用 `-h` 查看帮助

```shell
PS > .\xray-cracker -h
破解xray高级版证书，使用 -h 参数查看使用帮助

Usage of xray-cracker:
  -c string
        替换xray程序内置公钥，需要指定xray程序文件路径
  -g string
        生成一个永久license，需要指定用户名
  -p string
        解析官方证书，需要指定证书路径
```

### 生成证书

使用 `-g username` 生成永久证书

```shell
PS > .\xray-cracker -g "我叫啥"
破解xray高级版证书，使用 -h 参数查看使用帮助

证书已写入文件：xray-license.lic
```

### 破解xray

使用 `-c path-to-xray` 修改xray内置公钥

```shell
PS > .\xray-cracker -c .\xray_windows_amd64.exe
破解xray高级版证书，使用 -h 参数查看使用帮助

public key index: 16741321
文件写入成功： .\xray_windows_amd64.exe
```

> 工具虽然是windows平台下运行，但是照样可以破解其他平台xray  
> 目前xray最新版是1.0.0，现在全平台全版本通杀

## 破解效果

使用修改版xray和永久证书后，效果如下

```shell
PS > .\xray_windows_amd64.exe version

 __   __  _____              __     __
 \ \ / / |  __ \      /\     \ \   / /
  \ V /  | |__) |    /  \     \ \_/ /
   > <   |  _  /    / /\ \     \   /
  / . \  | | \ \   / ____ \     | |
 /_/ \_\ |_|  \_\ /_/    \_\    |_|


Version: 1.0.0/62161168/COMMUNITY-ADVANCED
Licensed to 我叫啥, license is valid until 2099-09-09 08:00:00

[xray 1.0.0/62161168]
Build: [2020-06-13] [windows/amd64] [RELEASE/COMMUNITY-ADVANCED]
Compiler Version: go version go1.14.1 linux/amd64
License ID: 00000000000000000000000000000000
User Name: 我叫啥/00000000000000000000000000000000
Not Valid Before: 2020-06-12 00:00:00
Not Valid After: 2099-09-09 08:00:00
```

## 部分细节

> 距离博文发布已经过了快一个月了，补充一点点细节信息，希望能够帮助到部分研究学习的同学

这里只给出使用的关键函数和关键流程，一些重要参数细节需要自己探索，可以动态单步调试获得

### AES解密

```go
decode_data, err := base64.StdEncoding.DecodeString(licenseString)
if err != nil {
  panic(err)
}

aesDecData, err := AesCBCDecryptAndUnPad(decode_data[17:])
if err != nil {
  panic(err)
}

licensePlainJsonBytes := aesDecData[0x102:]
```

### RSA签名验证

```go
sum := sha256.Sum256(licensePlainJsonBytes)
err = rsa.VerifyPSS(pubKey, crypto.SHA256, sum[:], aesDecData[2:0x102], nil)
```

## 工具获取

就不提供工具的公开下载了，如果需要交流学习欢迎邮件联系我

> 如果单纯是想要工具不要联系我，只是为了研究学习，正式使用请支持正版

## 说明

本次工作主要是探索golang逆向的基本方法，仅以学习逆向和证书生成算法为目的，如果你从本站下载了cracker工具，请在学习结束后立即删除

如果本篇文章侵犯了您的利益，请联系我删除
