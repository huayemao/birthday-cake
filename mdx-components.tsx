// @ts-nocheck
import { useMDXComponents as useMDXComponentsOrigin } from '@mdx-js/react'
import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
 return useMDXComponentsOrigin(components)
}