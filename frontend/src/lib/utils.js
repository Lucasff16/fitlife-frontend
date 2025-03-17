/**
 * Combines multiple class names into a single string
 * Similar to the classnames or clsx libraries
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
} 