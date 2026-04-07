# OpenLucky v1.3.1-rc2

## Bug 修复

### 打包应用中的模块解析问题
- 修复了打包后的 Electron 应用中的"Cannot find module"错误
- 将 `imageFormats.js` 常量直接整合到 `main.js` 中
- 将 `versionChecker.js` 功能直接整合到 `main.js` 中
- 移除了外部模块依赖，防止 asar 归档文件中的模块解析问题
- 解决了应用程序打包时的构建时模块加载问题

## 文档

### 技能文档
- 添加了 `new_tag_and_release` 技能文档
- 改进了项目文档结构

## 代码质量与维护
- 版本号更新至 v1.3.1-rc2
- 通过减少模块依赖简化了代码结构
- 提高了生产构建的应用程序稳定性
