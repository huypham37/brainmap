// Color palette for level-based assignment
// Each level gets a distinct color
export const LEVEL_COLORS = [
  '#FF6B6B',  // Level 0 (Root) - Red
  '#4ECDC4',  // Level 1 - Teal
  '#45B7D1',  // Level 2 - Blue
  '#FFA07A',  // Level 3 - Light Salmon
  '#98D8C8',  // Level 4 - Mint
  '#F7DC6F',  // Level 5 - Yellow
  '#BB8FCE',  // Level 6 - Purple
  '#85C1E2'   // Level 7 - Sky Blue
]

export const getColorForLevel = (level) => {
  return LEVEL_COLORS[level % LEVEL_COLORS.length]
}
