import createMDX from '@next/mdx'

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    // remarkPlugins: ['remark-gfm'],
    // remarkPlugins: ['remark-frontmatter'],
    rehypePlugins: [],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

export default withMDX(nextConfig)