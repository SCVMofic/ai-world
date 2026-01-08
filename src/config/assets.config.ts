export interface AssetConfig {
  baseUrl: string
  useCdn: boolean
}

const config: AssetConfig = {
  baseUrl: '/src/assets/images', // Local path for Dev
  useCdn: false,
}

export const getAssetPath = (category: string, filename: string): string => {
  if (!filename) return ''
  // Ensure no double slashes if baseUrl has trailing slash or category has leading slash
  const base = config.baseUrl.replace(/\/$/, '')
  const cat = category.replace(/^\//, '').replace(/\/$/, '')
  return `${base}/${cat}/${filename}`
}

export default config
