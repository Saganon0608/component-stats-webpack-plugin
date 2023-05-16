import { Compiler } from "webpack";
/**
 * 统计第三方包的组件引用和使用次数
 * pluginTap
 * componentPaths 第三方包路径
 * hasResource 是否统计路径
 */
interface Options {
    componentPaths: string[];
    pluginTap?: string;
    hasResource?: boolean;
    outputFilePath?: string;
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
export declare class ComponentStatsWebpackPlugin {
    options: Options;
    statsData: StatsKV;
    constructor(options: Options);
    apply(compiler: Compiler): void;
}
export default ComponentStatsWebpackPlugin;
