import * as ImageManipulator from 'expo-image-manipulator';

export interface CompressedImage {
  uri: string;
  width: number;
  height: number;
  size: number;
}

export const compressImage = async (
  imageUri: string,
  quality: number = 0.8,
  maxWidth: number = 1200,
  maxHeight: number = 1200
): Promise<CompressedImage> => {
  try {
    const result = await ImageManipulator.manipulateAsync(
      imageUri,
      [
        {
          resize: {
            width: maxWidth,
            height: maxHeight,
          },
        },
      ],
      {
        compress: quality,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    return {
      uri: result.uri,
      width: result.width,
      height: result.height,
      size: 0, // Size will be calculated if needed
    };
  } catch (error) {
    console.error('Image compression failed:', error);
    throw new Error('Failed to compress image');
  }
};

export const validateImage = (uri: string): boolean => {
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const extension = uri.split('.').pop()?.toLowerCase();
  return validExtensions.includes(`.${extension}`);
};

export const getImageDimensions = async (uri: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      reject(new Error('Failed to get image dimensions'));
    };
    img.src = uri;
  });
}; 