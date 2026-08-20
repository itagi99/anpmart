import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(n: number): string {
  return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export function imageSrc(path: string | null | undefined): string {
  if (!path) return 'https://via.placeholder.com/150x150?text=No+Image&bg=eee';
  if (path.startsWith('http')) return path;
  return path;
}

export function bannerSrc(path: string | null | undefined): string {
  if (!path) return 'https://via.placeholder.com/1200x300?text=Banner&bg=f0f0f0';
  if (path.startsWith('http')) return path;
  return path;
}
