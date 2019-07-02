please go to [newestcode git](https://gitee.com/rockyCode/hourserunning) to get the newest code,the github is too slow for me

# houserun

## Project setup
```
npm install -g @vue/cli
npm install -g typings
npm install

```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


# ts引用js方法
方法一：全局安装typings进行查找并用typings进行安装

1.npm install -g typings //全局安装typings

2.typings search xx.js

3.搜索到以后 npm install xx.js  然后 typings install xx.js

4.在ts 文件中引入时，import * as XX form 'xx.js'

方法二： 如果typings搜索不到文件，可以尝试用npm search 相关ts文件(必须是ts)，然后进行安装

方法三： 如果以上两种办法都没有搜索到，那么我们就要自己手动加了

1.在app目录下建立plugin文件夹，建立相关js名称文件夹xx , 建立文件xx.d.ts 

xx.d.ts内容 declare xx: any

在www文件夹下建立plugin文件夹，建立xx文件夹，将xx.js放进xx文件夹内

在 index.html中引用

<script src = "plugin/xx/xx.js">

在相关ts文件中引用

///<refrence path="plugin/xx/xx.d.ts">

