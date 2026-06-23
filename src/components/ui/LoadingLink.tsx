'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { navigationStart } from './TopLoader';
import type { ComponentProps } from 'react';

type LoadingLinkProps = ComponentProps<typeof Link>;

export function LoadingLink({ href, onClick, ...props }: LoadingLinkProps) {
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Check if it's a different route
    const targetPath = typeof href === 'string' ? href : href.pathname || '';
    if (targetPath !== pathname) {
      navigationStart();
    }

    // Call original onClick if provided
    onClick?.(e);
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}

