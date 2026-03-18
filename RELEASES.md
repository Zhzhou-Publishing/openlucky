# OpenLucky v1.0

🎉 首个正式版本发布！OpenLucky 是一个基于 OpenCV 的胶片负片转正处理工具。

## ✨ 功能特点

- **🔬 去色罩处理** - 自动移除胶片片基色罩
- **🎨 多胶片预设** - 内置 Kodak、Fuji、Agfa 等多种胶片预设
- **⚙️ 可自定义配置** - 支持通过 YAML 配置文件创建和编辑自定义预设
- **📊 高精度处理** - 支持 16-bit TIFF 文件处理，保留更多细节
- **🖼️ 图像增强** - 自动色阶、对比度、Gamma 修正

## 📦 安装方式

### 通过源码安装
```bash
pip install -r requirements.txt
```

### Windows 安装程序
下载 `OpenLucky_v1.0_windows_x64_Setup.exe` 进行安装。

## 🚀 快速开始

### 处理负片
```bash
python cmd/openlucky.py film -i input.tif -o output.jpg -c config.yaml -p kodak_ultramax_400
```

### 转换 TIFF 到 JPEG
```bash
python cmd/openlucky.py tiff2jpeg -i input.tif -o output.jpg
```

## 🎬 内置胶片预设

| 预设名称 | 胶片类型 | 特点 |
|----------|----------|------|
| `kodak_gold_200` | Kodak Gold 200 | 民用卷，色彩温暖 |
| `fuji_c200` | Fuji C200 | 民用卷，色彩偏冷 |
| `kodak_ultramax_400` | Kodak UltraMax 400 | 高感民用卷，色彩鲜艳 |
| `fujifilm_c400` | Fujifilm C400 | 民用高感卷，肤色偏粉 |
| `vision3_50d_5203` | Kodak Vision3 50D | 日光电影卷，颗粒极细 |
| `vision3_250d_5207` | Kodak Vision3 250D | 日光电影卷，全能型 |
| `vision3_200t_5213` | Kodak Vision3 200T | 灯光电影卷 |
| `vision3_500t_5219` | Kodak Vision3 500T | 高感灯光电影卷 |
| `agfa_turia_100s_xx1` | Agfa Turia 100S | 民用卷，对比度高 |

## 📚 文档

详细使用说明请查看 [README.md](README.md)

## ⚖️ 许可证

Apache License 2.0 - 详见 [LICENSE](LICENSE)
