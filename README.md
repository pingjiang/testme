# 在线测评平台

提供题库的创建和管理，试卷的设计和管理，考试的安排和管理，灵活的评分系统，全面的分析系统以及及时的反馈系统，为用户量身打造适合自己的测试平台。

## 配置和运行

```
> mongod
> grunt
or
> grunt serve
> open http://localhost:9000/
```
## 主要功能

* 题库的创建和管理。 Question
  1. 导入导出题库。（仅限自己创建的题库）
  2. 导入导出word里面的题目。（仅能导入导出部分格式）
  
* 试卷的设计和管理。 Paper
* 考试的安排和管理。 Test
* 灵活的评分系统。 Score
* 全面的分析系统。 Analyze
* 及时的反馈系统。 Feedback

## 多媒体文件管理

* /api/medias/ GET/POST/PUT/DELETE
