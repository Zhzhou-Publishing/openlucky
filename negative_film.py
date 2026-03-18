import argparse
import sys
from pathlib import Path

from lib.process_film import process_film


def main():
    parser = argparse.ArgumentParser(description="胶片负片转正处理工具 (Kodak UltraMax 400 优化)")

    parser.add_argument('--input', '-i', required=True, help='输入负片文件路径 (支持 .tif, .tiff, .jpg)')
    parser.add_argument('--output', '-o', required=True, help='输出文件保存路径')
    parser.add_argument('--config', '-c', required=True, help='预设配置文件 (yaml) 路径')
    parser.add_argument('--preset', '-p', default='kodak_ultramax_400',
                        help='使用的预设名称 (默认: kodak_ultramax_400)')

    args = parser.parse_args()

    input_file = Path(args.input)
    output_file = Path(args.output)
    config_file = Path(args.config)

    if not input_file.exists():
        print(f"错误: 输入文件不存在: {input_file}")
        sys.exit(1)

    process_film(input_file, output_file, config_file, args.preset)


if __name__ == "__main__":
    main()