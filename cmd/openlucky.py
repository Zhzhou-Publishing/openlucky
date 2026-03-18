import argparse
import sys
from pathlib import Path

from lib.process_film import process_film
from lib.tiff_to_jpeg import convert_tiff_to_jpeg


def find_config_file():
    """
    查找配置文件，按以下顺序尝试：
    1. 当前工作目录的 config.yaml 或 config.yml
    2. 用户家目录下的 .openlucky/config.yaml 或 .openlucky/config.yml

    Returns:
        Path: 找到的配置文件路径，如果都没找到则返回 None
    """
    # 尝试当前工作目录
    cwd = Path.cwd()
    cwd_config_yaml = cwd / 'config.yaml'
    cwd_config_yml = cwd / 'config.yml'

    if cwd_config_yaml.exists():
        return cwd_config_yaml
    if cwd_config_yml.exists():
        return cwd_config_yml

    # 尝试用户家目录
    home_dir = Path.home()
    home_config_yaml = home_dir / '.openlucky' / 'config.yaml'
    home_config_yml = home_dir / '.openlucky' / 'config.yml'

    if home_config_yaml.exists():
        return home_config_yaml
    if home_config_yml.exists():
        return home_config_yml

    return None


def main():
    parser = argparse.ArgumentParser(description="OpenLucky - 胶片负片处理工具")
    subparsers = parser.add_subparsers(dest='command', help='可用的子命令')

    # film 子命令
    film_parser = subparsers.add_parser('film', help='胶片负片转正处理 (Kodak UltraMax 400 优化)')
    film_parser.add_argument('--input', '-i', required=True, help='输入负片文件路径 (支持 .tif, .tiff, .jpg)')
    film_parser.add_argument('--output', '-o', required=True, help='输出文件保存路径')
    film_parser.add_argument('--config', '-c', required=False, help='预设配置文件 (yaml) 路径 (留空则自动查找)')
    film_parser.add_argument('--preset', '-p', default='kodak_ultramax_400',
                             help='使用的预设名称 (默认: kodak_ultramax_400)')

    # tiff2jpeg 子命令
    tiff_parser = subparsers.add_parser('tiff2jpeg', help='TIFF 转 JPEG 格式转换')
    tiff_parser.add_argument('--input', '-i', required=True, help='输入 TIFF 文件路径')
    tiff_parser.add_argument('--output', '-o', required=True, help='输出 JPEG 文件路径')

    args = parser.parse_args()

    if args.command == 'film':
        input_file = Path(args.input)
        output_file = Path(args.output)

        # 如果未指定配置文件，则自动查找
        if args.config is None:
            print("未指定配置文件，正在自动查找...")
            config_file = find_config_file()
            if config_file is None:
                print("错误: 未找到配置文件。请在以下位置之一创建 config.yaml 或 config.yml：")
                print("  1. 当前工作目录")
                print("  2. 用户家目录下的 .openlucky 目录 (例如 C:\\Users\\YourName\\.openlucky)")
                sys.exit(1)
            print(f"找到配置文件: {config_file}")
        else:
            config_file = Path(args.config)

        if not input_file.exists():
            print(f"错误: 输入文件不存在: {input_file}")
            sys.exit(1)

        if not config_file.exists():
            print(f"错误: 配置文件不存在: {config_file}")
            sys.exit(1)

        process_film(input_file, output_file, config_file, args.preset)

    elif args.command == 'tiff2jpeg':
        convert_tiff_to_jpeg(args.input, args.output)

    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
