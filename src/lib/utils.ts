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
  if (path.startsWith('uploads/')) return path;
  return 'uploads/' + path.replace(/^\/+/, '');
}

export function bannerSrc(path: string | null | undefined): string {
  if (!path) return 'https://via.placeholder.com/1200x300?text=Banner&bg=f0f0f0';
  if (path.startsWith('http')) return path;
  if (path.startsWith('uploads/')) return path;
  return 'uploads/' + path.replace(/^\/+/, '');
}

export function discountBadgeText(product: any): string {
  const mrp = Number(product.mrp || 0);
  const price = Number(product.price || 0);
  const type = product.discount_type || 'none';
  const value = Number(product.discount_value || 0);
  if (mrp <= price || value <= 0) return '';
  if (type === 'amount') return '₹' + Math.round(value) + ' OFF';
  if (type === 'percentage') return Math.round(value) + '% OFF';
  return '';
}

export function getUnitConversion(product: any): string {
  const unitConv = Number(product.unit_conversion || 1);
  const primary = product.primary_unit || '';
  const secondary = product.secondary_unit || '';
  if (unitConv > 0 && unitConv !== 1 && primary && secondary) {
    const formatted = Number.isInteger(unitConv) ? unitConv.toFixed(0) : unitConv.toFixed(2);
    return `1 ${primary} = ${formatted} ${secondary}`;
  }
  return '';
}

export function getHeaderTheme(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 19) return 'evening';
  return 'night';
}

export function getHeaderThemeStyles(theme: ReturnType<typeof getHeaderTheme>) {
  const styles: Record<string, React.CSSProperties> = {
    morning: { background: 'linear-gradient(135deg, #115e59 0%, #0c831f 100%)' },
    afternoon: { background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)' },
    evening: { background: 'linear-gradient(135deg, #b45309 0%, #701a75 100%)' },
    night: { background: 'linear-gradient(135deg, #1e1b4b 0%, #030712 100%)' },
  };
  return styles[theme];
}