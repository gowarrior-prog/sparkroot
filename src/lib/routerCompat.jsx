'use client';

import React from 'react';
import NextLink from 'next/link';
import { useRouter, useParams as useNextParams, useSearchParams as useNextSearchParams } from 'next/navigation';

export function useNavigate() {
  const router = useRouter();
  return (path) => {
    if (path === -1) {
      router.back();
    } else {
      router.push(path);
    }
  };
}

export function useParams() {
  return useNextParams() || {};
}

export function useSearchParams() {
  const searchParams = useNextSearchParams();
  return [searchParams];
}

export function Link({ to, href, children, ...props }) {
  const target = to || href || '#';
  return (
    <NextLink href={target} {...props}>
      {children}
    </NextLink>
  );
}

export default Link;
