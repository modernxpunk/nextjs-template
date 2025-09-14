module.exports = {
  '*.{js,jsx,mjs,ts,tsx,mts,mdx}': [
    'biome format --write',
  ],
  '*.{ts,tsx,mts}': [
    'tsc --noEmit',
  ]
}