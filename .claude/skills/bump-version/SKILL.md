---
description: 同步更新 app/package.json、app/package-lock.json、OpenLucky.iss 三处版本号，仅改文件不提交
disable-model-invocation: true
---

# 同步升级版本号

## 动作

把 `app/package.json`、`app/package-lock.json`、`OpenLucky.iss` 三处版本号同步更新到目标值。**只改文件，不 git add、不 commit、不 tag**——后续走现有的 `/commit-push` → `/write-changelog` → `/new-tag-and-release` 链路。

## 步骤

1. 读取当前 `app/package.json` 的 `.version`，告知用户。
2. 确定目标版本号（按下列优先级判断）：
   - **参数为 `milestone`**：封版——把当前版本的预发布后缀（`-rc.X`、`-beta.X`、`-alphaX` 等）整体去掉。
     - `1.4.3-rc.7` → `1.4.3`
     - `1.4.3-beta1` → `1.4.3`
     - 如果当前版本本来就没有后缀（如 `1.4.3`），直接报错告知用户「当前已是正式版本，无后缀可去」，不要做任何改动。
   - **参数为其他显式版本号**：直接使用该参数作为目标版本。如果带 `v` 前缀，去掉（package.json 的 version 字段不含 v）。接受形如 `1.2.3`、`1.2.3-rc.4`、`1.2.3-rc4`、`1.2.3-beta.1` 等语义化版本，**不要自作主张帮用户纠正后缀的点号风格**（`-rc4` 与 `-rc.4` 都合法）。
   - **无参数**：基于当前版本自动计算目标版本（规则见下），并在执行前告知用户「当前 X → 目标 Y」让其确认。

### 自动升级规则（无参数时）

匹配当前版本字符串，按下列优先级套用第一条命中的规则：

1. 形如 `<base>-<label><sep><n>` 的预发布版本（`label` ∈ `alpha`/`beta`/`rc`，`sep` 为空字符串或 `.`，`n` 为整数）：保留 `base`、`label`、`sep` 不变，把 `n` 加 1。
   - `1.4.3-rc6` → `1.4.3-rc7`
   - `1.4.3-rc.6` → `1.4.3-rc.7`
   - `1.4.3-beta.1` → `1.4.3-beta.2`
   - `1.4.3-beta1` → `1.4.3-beta2`
   - `1.4.3-alpha.1` → `1.4.3-alpha.2`
   - `1.4.3-alpha1` → `1.4.3-alpha2`
2. 形如 `MAJOR.MINOR.PATCH` 的正式版本（无任何后缀）：把 `PATCH` 加 1。
   - `1.4.3` → `1.4.4`
3. 其他形态（如出现陌生后缀、非数字结尾）：不要瞎猜，直接报错告知用户当前版本不在自动升级规则覆盖范围内，请手动传入目标版本。

### 落盘步骤

3. 校验 `OpenLucky.iss` 当前的 `MyAppVersion` 是否与 `app/package.json` 一致。如果不一致，先告知用户当前不一致状态，再继续。
4. 执行 `npm version <new-version> --no-git-tag-version --allow-same-version`（在 `app/` 目录下运行），让 npm 同时更新 `app/package.json` 与 `app/package-lock.json`。
5. 用 Edit 工具把 `OpenLucky.iss` 中 `#define MyAppVersion "..."` 行的版本号替换为新值。
6. 跑 `git diff -- app/package.json app/package-lock.json OpenLucky.iss`，把三处的变化简短报告给用户，确认无误。

   注意：`npm version` 会把版本号规范化（例如 `1.4.3-rc6` 不会被改写，但要确认 npm 写回去的字符串与你的目标完全一致；如有差异要明示用户）。

## 注意

- 全程不要执行 `git add`、`git commit`、`git tag`、`git push` 中的任何一个。
- 不要修改 changelog 或其他文件。
- 如果 `npm version` 报错（例如新版本号不是合法 semver），把错误原样反馈给用户，不要尝试规避。
