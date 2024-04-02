import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function timeSince(dateString: string): string {
  const seconds: number = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
  const intervals: [number, string][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
    [1, 'second']
  ];

  for (const [intervalInSeconds, label] of intervals) {
    const interval: number = Math.floor(seconds / intervalInSeconds);
    if (interval >= 1) {
      return `${interval} ${label}${interval === 1 ? '' : 's'} ago`;
    }
  }
  return 'just now';
}
export const checkIsLiked = (likeList: string[], userId: string): boolean => {
  return likeList.includes(userId);
};

export const readImages = async () => {
  try {
    const response = await fetch('http://localhost:3000/api');
    const { data } = await response.json();

    // Map over the image paths and fetch each image
    const imgs = await Promise.all(data.map(async path => {
      const response = await fetch('/images/' + path);
      const blob = await response.blob();
      return blob;
    }));

    const imgUrls = imgs.map(blob => URL.createObjectURL(blob));
    return imgUrls; // Return the array of image blobs

  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to handle it in the caller function
  }
};
