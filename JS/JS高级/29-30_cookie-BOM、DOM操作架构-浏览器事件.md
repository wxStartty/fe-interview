## Cookie、DOM、BOM

### Cookie

![29_cookie](D:\前端视频\js高级\截图\29_cookie.png)

### cookie常见的属性

#### 生命周期

- expires：设置的是Date.toUTCString()，设置格式是;expires=date-in-GMTString-format;
- max-age：设置过期的秒钟，;max-age=max-age-in-seconds(例如一年60\*60\*24\*365)

#### 作用域：（允许cookie发送给哪些URL）

- Domain：指定哪些主机可以接受cookie
  - 如果不指定，那么默认是origin，不包括子域名。
  - 如果指定Domain，则包含子域名。例如，如果设置 Domain=mozilla.org，则Cookie也包含在子域名中（如develoer.mozilla.org）
- Path：指定主机下哪些路径可以接受cookie
  - 例如设置 Path=/docs，则以下地址都会匹配：
    - /docs
    - /docs/Web/
    - /docs/Web/HTTP
- 大小：4kb

#### 客户端设置Cookie

- 删除   document.cookie = "name=wx;max-age=0"

httpOnly: true，只能通过http的方式去操作cookie的修改删除，为false时则可以通过document.cookie来操作

### BOM

可以看作是JavaScript脚本与浏览器窗口的桥梁

主要包括以下对象模型

- window
- location
- history
- document



Window继承自EventTarget：window.\_\_proto\_\__\.\_\_proto\_\_.\_\_proto\_\_ === EventTarget类

#### window

常用属性

- screenX
- screenY
- scroll
- outerHeight
- innerHeight

window常用方法

- scrollTo

- close

- open

  window.open('https//www.baidu.com', '_self')

- dispatchEvent派发事件

window常用事件

- onload

  ```js
  window.onload = () => console.log('window窗口加载完毕')
  ```

- onfocus

- onblur

- onhashchange

#### location

属性

- href
- host
- origin
- pathname
- hash

![29_location抽象实现URL](D:\前端视频\js高级\截图\29_location抽象实现URL.png)

方法：

- assign同location.href

- replace

- reload

  ```js
  // true 重新向服务器请求资源，false 先取缓存
  location.reload(false)
  ```

  

#### history

属性：

- state
- length

方法：

- pushState

  ```js
  // 第二个参数(修改页面标题title)不需要，浏览器大部分不支持
  history.pushState(state, '', '/detail')
  ```

- replaceState

- back

- forward

- go



### DOM

#### 元素

元素属性：

- nodeName
- nodeType
- nodeValue
- childNodes
- id
- tagName
- children
- className
- classList
- clientWidth
- clientHeight
- offsetLeft
- offsetTop

元素方法：

- appendChild
- querySelector
- getAttribute
- setAttribute

#### document

属性：

- title
- children
- location
- head

方法：

- createElement
- getElementById
- getElementsByTagName
- getElementByName

#### event

属性：

- type(click)
- target()
- currentTarget
- offSetX
- offSetY

方法：

- preventDefault
- stopPropagation