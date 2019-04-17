# showdoc-push

扫描项目目录，将文档推送到指定的`showdoc`服务器

## 功能

1. 根据配置扫描目录，推送api文档
   * config检查和生成
   * 目录扫描
   * 注释信息提取
   * 调用开放api上传
2. 根据配置推送数据字典文档(下一版再做)
   * config检查和生成
   * 获取数据库表结构
   * 调用开放api上传

## 使用方法

### 生成实例配置文件

```
$ showdoc-push init
```

### 上传

```
$ showdoc-push
```
