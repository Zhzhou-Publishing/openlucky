import rawpy
import cv2
from pathlib import Path


def raw_to_tiff(input_path, output_path):
    """
    Convert RAW format image to TIFF format

    Args:
        input_path: Path to input RAW file (supports .arw, .cr2, .cr3, .nef, .dng, .orf, .raf)
        output_path: Path to output TIFF file

    Returns:
        bool: True if conversion successful, False otherwise
    """
    try:
        input_path = Path(input_path)
        output_path = Path(output_path)

        # Check if output_path has valid TIFF extension
        valid_tiff_extensions = {'.tif', '.tiff'}
        if output_path.suffix.lower() not in valid_tiff_extensions:
            output_path = output_path.with_suffix('.tif')

        # 1. Read RAW file using rawpy
        with rawpy.imread(str(input_path)) as raw:
            # 2. Postprocess with specified parameters
            # user_qual 10, gamma 1.1, no_auto_bright=True, output_bps 16
            img = raw.postprocess(
                user_qual=10,
                gamma=(1, 1),
                no_auto_bright=True,
                output_bps=16
            )

        # 3. Convert to BGR for OpenCV encoding (rawpy outputs RGB)
        img_bgr = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

        # 4. Encode to TIFF
        success, encoded_img = cv2.imencode(".tif", img_bgr)

        if not success:
            print(f"❌ Failed to encode TIFF: {output_path}")
            return False

        # 5. Write to file
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'wb') as f:
            f.write(encoded_img.tobytes())

        print(f"✅ RAW to TIFF conversion successful: {output_path}")
        return True

    except Exception as e:
        print(f"❌ Error converting RAW to TIFF: {e}")
        import traceback
        traceback.print_exc()
        return False
