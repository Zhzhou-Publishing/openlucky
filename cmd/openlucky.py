import argparse
import sys
from pathlib import Path

from lib.process_film import process_film
from lib.tiff_to_jpeg import convert_tiff_to_jpeg


def main():
    parser = argparse.ArgumentParser(description="OpenLucky - 胶片负片处理工具")
    subparsers = parser.add_subparsers(dest='command', help='可用的子命令')

    # film 子命令
    film_parser = subparsers.add_parser('film', help='胶片负片转正处理 (Kodak UltraMax 400 优化)')
    film_parser.add_argument('--input', '-i', required=True, help='输入负片文件路径 (支持 .tif, .tiff, .jpg)')
    film_parser.add_argument('--output', '-o', required=True, help='输出文件保存路径')
    film_parser.add_argument('--config', '-c', required=True, help='预设配置文件 (yaml) 路径')
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
        config_file = Path(args.config)

        if not input_file.exists():
            print(f"错误: 输入文件不存在: {input_file}")
            sys.exit(1)

        process_film(input_file, output_file, config_file, args.preset)

    elif args.command == 'tiff2jpeg':
        convert_tiff_to_jpeg(args.input, args.output)

    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
