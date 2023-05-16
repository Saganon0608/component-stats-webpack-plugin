'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs');

var ComponentStatsWebpackPlugin = /** @class */ (function () {
    function ComponentStatsWebpackPlugin(options) {
        this.statsData = {};
        if (!(options === null || options === void 0 ? void 0 : options.componentPaths))
            throw new Error("ComponentStatsWebpackPlugin: Please set componentPaths!!");
        this.options = Object.assign({ pluginTap: "ComponentStatsWebpackPlugin" }, options);
    }
    ComponentStatsWebpackPlugin.prototype.apply = function (compiler) {
        var _this = this;
        compiler.hooks.compilation.tap("".concat(this.options.pluginTap), function (compilation) {
            compilation.hooks.succeedModule.tap("".concat(_this.options.pluginTap), function (module) {
                var resource = module.resource;
                if (!resource || resource.includes("/node_modules/") || resource.startsWith("/.") || resource.endsWith("?modules"))
                    return;
                var data = {};
                _this.options.componentPaths.forEach(function (componentPath) {
                    module.dependencies
                        .filter(function (dependency) { var _a; return (dependency === null || dependency === void 0 ? void 0 : dependency.name) && dependency.type === "harmony import specifier" && ((_a = dependency.request) === null || _a === void 0 ? void 0 : _a.includes(componentPath)); })
                        .filter(function (dependency) { return (_this.options.dataFilter ? _this.options.dataFilter(dependency) : true); })
                        .forEach(function (dependency) {
                        if (!data[dependency.name])
                            data[dependency.name] = 0;
                        data[dependency.name] += 1;
                    });
                    Object.keys(data).forEach(function (componentName) {
                        var _a;
                        if (!_this.statsData[componentPath])
                            _this.statsData[componentPath] = {};
                        if (!_this.statsData[componentPath][componentName]) {
                            _this.statsData[componentPath][componentName] = { deps: 0, used: 0 };
                        }
                        _this.statsData[componentPath][componentName].used += data[componentName];
                        _this.statsData[componentPath][componentName].deps = (_this.statsData[componentPath][componentName].deps || 0) + 1;
                        if (_this.options.hasResource) {
                            if (!_this.statsData[componentPath][componentName]["resource"])
                                _this.statsData[componentPath][componentName]["resource"] = [];
                            (_a = _this.statsData[componentPath][componentName]["resource"]) === null || _a === void 0 ? void 0 : _a.push(resource);
                        }
                    });
                });
            });
        });
        compiler.hooks.done.tap("".concat(this.options.pluginTap, "Done"), function () {
            fs.writeFileSync(_this.options.outputFilePath || "./component-stats.json", JSON.stringify(_this.statsData, null, 2));
        });
    };
    return ComponentStatsWebpackPlugin;
}());

exports.ComponentStatsWebpackPlugin = ComponentStatsWebpackPlugin;
exports.default = ComponentStatsWebpackPlugin;
