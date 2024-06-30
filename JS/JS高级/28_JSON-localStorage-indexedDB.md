## JSON-数据存储

JSON是一种非常重要的数据结构，它并不是编程语言，而是一种可以在服务器和客户端之间传输的数据格式。

全称：JavaScript Object Notation

- JSON.stringify的第二个参数

  1. 传入数组：设置哪些是需要转化的

     ```js
     const obj = {
         name: 'wx'
         age: 18
     }
     const json1 = JSON.stringify(obj, ["name"]) // {name: 'wx'}
     ```

  2. 传入回调函数

     ```js
     const obj = {
         name: 'wx'
         age: 18
     }
     const json1 = JSON.stringify(obj, (key, value) => {
         if (key === 'age') {
             return value + 1
         }
         return value
     })
     ```

- JSON.stringify的第三个参数 space

  ```js
  const obj = {
      name: 'wx'
      age: 18
  }
  const json4 = JSON.stringify(obj, null, 2)
  ```

  ![28_JSONstringify第三个参数](D:\前端视频\js高级\截图\28_JSONstringify第三个参数.png)

- 如果obj对象中有toJSON方法

  ```js
  const obj = {
      name: 'wx'
      age: 18,
      toJSON: function() {
          return '666'
      }
  }
  ```




## localStorage

localStorage 方法

1. setItem
2. length：localStorage.length
3. key
4. getItem
5. removeItem
6. clear



## IndexedDB

- 是一种事务型数据库系统，是一种基于JavaScript面向对象数据库，有点类似于NoSQL（非关系型数据库）
- IndexedDB本身就是基于事务的，我们只需要指定数据库模式，打开与数据库的连接，然后检索和更新一系列事务即可

#### 连接IndexedDB

1. 打开IndexDB的某个数据库

   - 通过IndexDB.open(数据库名称, 数据库版本)方法
   - 如果数据库不存在，那么会创建这个数据库
   - 如果数据库已存在，那么会打开这个数据库

   ```js
   // 打开数据(和数据库建立连接)
   const dbRequest = indexedDb.open('wx')
   dbRequest.onerror = function(err) {
   	console.log('打开数据库失败')
   }
   let db = null
   dbRequest.onsuccess = function(event) {
   	db = event.target.result
   }
   // 第一次打开/或者版本发生升级
   dbRequest.onupgradeneeded = function(event) {
   	const db = event.target.result
       
    	// 创建一些存储对象
       db.createObjectStore("users", { keyPath: "id" })
   }
   
   class User {
       construct(id, name, age) {
           this.id = id
   		this.name = name
           this.age = age
       }
   }
   
   const users = [
       new User(100, 'www', 20),
       new User(101, 'xxx', 30),
       new User(102, 'aaa', 18)
   ]
   
   // 获取btns，监听点击
   const btns = document.querySelectorAll("button")
   for (let i = 0; i < btns.length; i++) {
       btns[i].onclick = function() {
           // db.transaction(["user, xxx"], "readwrite")
           const transaction = db.transaction("user", "readwrite")
           const store = transaction.objectStore("users")
           
           switch(i) {
               case 0:
                   console.log('新增')
                   for (const user of users) {
                       const request = store.add(user)
                       request.onsuccess = function() {
                           console.log(`${user.name}插入成功`)
                       }
                   }
                   transaction.oncomplete = function() {
                       console.log('添加操作全部完成')
                   }
                   break
               case 1:
                   console.log('查询')
                  	// 1.查询方式一(知道主键，根据主键查询)
                   const request = store.get(102)
                   request.onsuccess = function() {
                       console.log(event.target.result) // {...}
                   }
                   // 2.查询方式二
                   const request = store.openCursor()
                   request.onsuccess = function(event) {
                       const cursor = event.target.result
                       if (cursor) {
                           console.log(cursor.key, cursor.value)
                           cursor.continue()
                       } else {
                           console.log('查询完成')
                       }
                   }
                   break
               case 2:
                   console.log('删除')
                   const deleteRequest = store.openCursor()
                   deleteRequest.onsuccess = function(event) {
                       const cursor = event.target.result
                       if (cursor) {
                           if (cursor.key === 101) {
                               cursor.delete()
                           } else {
                               cursor.continue()
                           }
                       } else {
                           console.log('删除完成')
                       }
                   }
                   break
               case 3:
                   console.log('修改')
                   const upDateRequest = store.openCursor()
                   upDateRequest.onsuccess = function(event) {
                       const cursor = event.target.result
                       if (cursor) {
                           console.log(cursor.key, cursor.value)
                           if (cursor.key === 101) {
                               const value = cursor.value
                               value.name = 'ccc'
                               cursor.update(value)
                           } else {
                               cursor.continue()
                           }
                       } else {
                           console.log('修改完成')
                       }
                   }
                   break
           }
       }
   }
   ```
   
   