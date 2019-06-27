```
### 前端branch规范 commit规范  release规范
1. branch
    1. feature/{{品牌名}}-{{ticketId}}
2. commit
    1. A  新增xxx
    2. F  修复xxx
    3. U  更新xxx
3. release
    1. release-v1.0.0(版本和小程序上传版本一致,上传一次打一次tag)
4. 小程序提交体验版命名  {{品牌名字}}-{{日期}}-{{环境}}

```



``` bash

# 测试环境
npm run dev

# UAT环境
npm run uat

# 生产环境
npm run prod
```