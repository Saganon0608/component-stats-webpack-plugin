import fs from "fs";
import { Compilation, Compiler, Module, NormalModule } from "webpack";
/**
 * 统计第三方包的组件引用和使用次数
 * pluginTap
 * componentPaths 第三方包路径
 * hasResource 是否统计路径
 */

interface Options {
  componentPaths: string[]; // 需要统计组件包的路径
  pluginTap?: string; // webpack plugin插件名
  hasResource?: boolean; // 是否需要导出引用路径
  outputFilePath?: string; //输出文件路径
  dataFilter?: (dependency: any) => boolean;
}
interface StatsObj {
  used?: number;
  deps?: number;
  resource?: string[];
}
interface StatsKV {
  [componentPatch: string]: {
    [componentName: string]: StatsObj;
  };
}

export class ComponentStatsWebpackPlugin {
  options: Options;
  statsData: StatsKV = {};
  constructor(options: Options) {
    if (!options?.componentPaths) throw new Error("ComponentStatsWebpackPlugin: Please set componentPaths!!");
    this.options = Object.assign({ pluginTap: "ComponentStatsWebpackPlugin" }, options);
  }

  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(`${this.options.pluginTap}`, (compilation: Compilation) => {
      compilation.hooks.succeedModule.tap(`${this.options.pluginTap}`, (module: Module) => {
        const resource: string = (module as NormalModule).resource;
        if (!resource || resource.includes("/node_modules/") || resource.startsWith("/.") || resource.endsWith("?modules")) return;

        const data: any = {};

        this.options.componentPaths.forEach((componentPath: string) => {
          module.dependencies
            .filter((dependency: any) => dependency?.name && dependency.type === "harmony import specifier" && dependency.request?.includes(componentPath))
            .filter((dependency: any) => (this.options.dataFilter ? this.options.dataFilter(dependency) : true))
            .forEach((dependency: any) => {
              if (!data[dependency.name]) data[dependency.name] = 0;
              data[dependency.name] += 1;
            });

          Object.keys(data).forEach((componentName) => {
            if (!this.statsData[componentPath]) this.statsData[componentPath] = {};
            if (!this.statsData[componentPath][componentName]) {
              this.statsData[componentPath][componentName] = { deps: 0, used: 0 };
            }
            this.statsData[componentPath][componentName].used += data[componentName];
            this.statsData[componentPath][componentName].deps = (this.statsData[componentPath][componentName].deps || 0 )+ 1;
            if (this.options.hasResource) {
              if (!this.statsData[componentPath][componentName]["resource"]) this.statsData[componentPath][componentName]["resource"] = [];
              this.statsData[componentPath][componentName]["resource"]?.push(resource);
            }
          });
        });
      });
    });

    compiler.hooks.done.tap(`${this.options.pluginTap}Done`, () => {
      fs.writeFileSync(this.options.outputFilePath || "./component-stats.json", JSON.stringify(this.statsData, null, 2));
    });
  }
}
export default ComponentStatsWebpackPlugin;
