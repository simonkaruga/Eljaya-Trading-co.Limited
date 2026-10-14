import Image, { type ImageProps } from 'next/image';
import type { Img } from '@/lib/types';

type Props = Omit<ImageProps, 'src' | 'alt' | 'width' | 'height' | 'placeholder' | 'blurDataURL'> & {
  image?: Img | null;
  alt?: string;
};

/**
 * Renders a Sanity or local image through next/image. Respects the focal
 * point the owner sets in the studio (hotspot) when the image is cropped
 * with object-cover, and shows Sanity's blurred preview while loading.
 */
export function SmartImage({ image, alt, fill, style, sizes, ...rest }: Props) {
  if (!image?.src) return null;
  const objectPosition = image.hotspot ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%` : undefined;
  const dims = fill ? {} : { width: image.w ?? 1200, height: image.h ?? 800 };

  return (
    <Image
      src={image.src}
      alt={alt ?? image.alt ?? ''}
      fill={fill}
      sizes={sizes ?? (fill ? '100vw' : undefined)}
      placeholder={image.lqip ? 'blur' : 'empty'}
      blurDataURL={image.lqip}
      style={{ objectPosition, ...style }}
      {...dims}
      {...rest}
    />
  );
}
