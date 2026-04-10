import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn('flex items-center text-sm', className)}>
      <ol className="flex items-center gap-1">
        <li>
          <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors">
            <Home className="w-4 h-4" />
          </button>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            {item.href ? (
              <a
                href={item.href}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <span
                className={cn(
                  'text-gray-900',
                  index === items.length - 1 && 'font-medium'
                )}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
