# component-stats-webpack-plugin

用于统计三方包或者指定路径下组件的引用和使用次数.

## 说明

目前只在 umi 项目中通过测试。

## 使用

```javascript
import ComponentStatsWebpackPlugin from "component-stats-webpack-plugin";

export default {
  chainWebpack(config, { webpack }) {
    config
      .plugin("compent-stats-webpack-plugin")
      .use(
        new ComponentStatsWebpackPlugin({
          componentPaths: ["antd-mobile"],
          hasResource: true,
        })
      )
      .end();
  },
};
```
## 相关参数
| 参数名 | 类型 | 说明 | 默认值 |
|-|-|-|-|
|componentPaths|string[]|需要统计组件包的路径|必填|
|pluginTap|string|webpack plugin插件名|ComponentStatsWebpackPlugin|
|hasResource|boolean|是否需要导出引用路径|false|
|outputFilePath|string|输出文件路径|./component-stats.json|
|dataFilter|(dependency: any) => boolean|过滤输出结果|()=>true|


## 输出内容
```json
{
  "antd-mobile": {
    "_Modal": {
      "deps": 21,
      "used": 26,
      "resource": [
        //"/Users/.../文件名.jsx" 文件路径,
        //...
      ]
    },
    "_Button": {
      "deps": 75,
      "used": 101,
      "resource": [
        //"/Users/.../文件名.jsx" 文件路径,
        //...
      ]
    },
    // ...
  }
```