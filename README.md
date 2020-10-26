# fs-json-storage

> Fs Json Storage

## Use

1、npm i --save https://github.com/pashangshangpo/fs-json-storage.git

2、const Storage = require('fs-json-storage')

## Demo

```js
const Storage = require('fs-json-storage')
const storage = Storage('./storage.json')
```

<a name="Storage"></a>

## Storage(storagePath)
储存类

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| storagePath | <code>String</code> | 文件路径 |


* [Storage(storagePath)](#Storage)
    * [~get(key)](#Storage..get) ⇒ <code>Object</code> \| <code>Array</code> \| <code>Null</code>
    * [~set(...args)](#Storage..set)
    * [~add(...args)](#Storage..add)
    * [~remove(key)](#Storage..remove)
    * [~empty()](#Storage..empty)
    * [~find(func)](#Storage..find) ⇒ <code>Array</code>

<a name="Storage..get"></a>

### Storage~get(key) ⇒ <code>Object</code> \| <code>Array</code> \| <code>Null</code>
获取数据

**Kind**: inner method of [<code>Storage</code>](#Storage)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | 键，可选，不写获取全部 |

<a name="Storage..set"></a>

### Storage~set(...args)
替换键数据或添加数据，传递对象则覆盖整个数据

**Kind**: inner method of [<code>Storage</code>](#Storage)  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>any</code> | key,value|{} |

<a name="Storage..add"></a>

### Storage~add(...args)
向数组添加数据

**Kind**: inner method of [<code>Storage</code>](#Storage)  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>any</code> | {}|[...{}] |

<a name="Storage..remove"></a>

### Storage~remove(key)
删除指定键下的数据

**Kind**: inner method of [<code>Storage</code>](#Storage)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | 键，可选，不写删除所有数据 |

<a name="Storage..empty"></a>

### Storage~empty()
清空数据

**Kind**: inner method of [<code>Storage</code>](#Storage)  
<a name="Storage..find"></a>

### Storage~find(func) ⇒ <code>Array</code>
查找符合条件的数组数据

**Kind**: inner method of [<code>Storage</code>](#Storage)  
**Returns**: <code>Array</code> - Promise  

| Param | Type | Description |
| --- | --- | --- |
| func | <code>function</code> | 过滤数据方法 |

