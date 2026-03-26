import cv2
import numpy as np

def process_film_bytestream_with_params(input_bytes, preset_mask_r, preset_mask_g, preset_mask_b, preset_gamma=1.0, preset_contrast=1.0):
    # 1. 从字节流解码图片 (UNCHANGED 保持原始位深)
    nparr = np.frombuffer(input_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_UNCHANGED)
    if img is None:
        return None

    # 判断输入是 8位 还是 16位，并统一归一化到 0.0 - 1.0 空间
    # 这一步是支持高位深的关键
    max_input_val = 65535.0 if img.dtype == np.uint16 else 255.0
    img = img.astype(np.float32) / max_input_val

    # 2. 去色罩 (在 0-1 空间操作)
    # 假设输入的参数 mask_r/g/b 依然是用户习惯的 0-255 范围
    img[:, :, 0] /= (preset_mask_b / 255.0)  # Blue
    img[:, :, 1] /= (preset_mask_g / 255.0)  # Green
    img[:, :, 2] /= (preset_mask_r / 255.0)  # Red

    # 这一步 clip 很重要，防止除法后数值溢出 1.0
    img = np.clip(img, 0, 1.0)

    # 3. 颜色反转 (在 0-1 空间即为 1.0 - img)
    img = 1.0 - img

    # 4. Gamma 修正
    if preset_gamma != 1.0:
        # 在 0-1 空间进行幂运算，精度最高
        img = np.power(img, preset_gamma)

    # 5. 自动色阶与对比度微调
    for i in range(3):
        low = np.percentile(img[:, :, i], 0.5) 
        high = np.percentile(img[:, :, i], 99.5)
        # 线性拉伸并应用对比度
        img[:, :, i] = np.clip((img[:, :, i] - low) * (1.0 / (high - low + 1e-5)) * preset_contrast, 0, 1.0)
    # 6. 根据输入位深，动态决定输出位深
    if max_input_val == 255.0:
        # 输入是 8 位，输出 8 位
        img_final = (img * 255.0).astype(np.uint8)
        # 使用 PNG 格式编码（支持 8 位）
        success, encoded_img = cv2.imencode('.png', img_final)
    else:
        # 输入是 16 位，输出 16 位
        img_final = (img * 65535.0).astype(np.uint16)
        # 使用 TIFF 格式编码（支持 16 位）
        success, encoded_img = cv2.imencode('.tif', img_final)

    if not success:
        return None

    # 7. 返回字节流
    output_bytes = encoded_img.tobytes()

    return output_bytes

def process_film_with_params(input_path, output_path, preset_mask_r, preset_mask_g, preset_mask_b, preset_gamma=1.0, preset_contrast=1.0):
    # 1. 读取输入文件为字节流
    try:
        with open(input_path, 'rb') as f:
            input_bytes = f.read()
    except Exception as e:
        print(f"Error: Cannot read input file '{input_path}': {e}")
        return

    # 2. 调用字节流处理函数
    output_bytes = process_film_bytestream_with_params(
        input_bytes,
        preset_mask_r=preset_mask_r,
        preset_mask_g=preset_mask_g,
        preset_mask_b=preset_mask_b,
        preset_gamma=preset_gamma,
        preset_contrast=preset_contrast
    )

    # 3. 将输出字节流写入文件
    if output_bytes is None:
        print(f"Error: Failed to process image from '{input_path}'")
        return

    try:
        with open(output_path, 'wb') as f:
            f.write(output_bytes)
        print(f"Successfully saved to: {output_path}")
    except Exception as e:
        print(f"Error: Cannot write output file '{output_path}': {e}")
