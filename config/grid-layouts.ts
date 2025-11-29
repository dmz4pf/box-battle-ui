/**
 * BoxBattle Grid Layout Configuration
 * Defines dimensions and properties for all supported grid sizes
 * Ready to be used by AI to generate game boards
 */

export type GridSize = 3 | 4 | 5 | 6

export interface GridConfig {
  size: GridSize
  totalDots: number
  totalBoxes: number
  totalHorizontalLines: number
  totalVerticalLines: number
  totalLines: number
  dotSpacing: number
  svgWidth: number
  svgHeight: number
  description: string
}

/**
 * Complete grid configurations for all supported sizes
 * Format: NxN grid where N is the number of dots in each dimension
 */
export const GRID_CONFIGS: Record<GridSize, GridConfig> = {
  3: {
    size: 3,
    totalDots: 9, // 3 x 3
    totalBoxes: 4, // 2 x 2
    totalHorizontalLines: 6, // 3 rows × 2 lines per row
    totalVerticalLines: 6, // 3 columns × 2 lines per column
    totalLines: 12,
    dotSpacing: 80,
    svgWidth: 200, // (3-1) * 80 + 40 padding
    svgHeight: 200,
    description: "3x3 grid - Perfect for quick games and training",
  },
  4: {
    size: 4,
    totalDots: 16, // 4 x 4
    totalBoxes: 9, // 3 x 3
    totalHorizontalLines: 12, // 4 rows × 3 lines per row
    totalVerticalLines: 12, // 4 columns × 3 lines per column
    totalLines: 24,
    dotSpacing: 80,
    svgWidth: 280, // (4-1) * 80 + 40 padding
    svgHeight: 280,
    description: "4x4 grid - Standard competitive gameplay",
  },
  5: {
    size: 5,
    totalDots: 25, // 5 x 5
    totalBoxes: 16, // 4 x 4
    totalHorizontalLines: 20, // 5 rows × 4 lines per row
    totalVerticalLines: 20, // 5 columns × 4 lines per column
    totalLines: 40,
    dotSpacing: 80,
    svgWidth: 360, // (5-1) * 80 + 40 padding
    svgHeight: 360,
    description: "5x5 grid - Extended matches with more strategy",
  },
  6: {
    size: 6,
    totalDots: 36, // 6 x 6
    totalBoxes: 25, // 5 x 5
    totalHorizontalLines: 30, // 6 rows × 5 lines per row
    totalVerticalLines: 30, // 6 columns × 5 lines per column
    totalLines: 60,
    dotSpacing: 80,
    svgWidth: 440, // (6-1) * 80 + 40 padding
    svgHeight: 440,
    description: "6x6 grid - Epic championship matches",
  },
}

/**
 * Get configuration for a specific grid size
 */
export function getGridConfig(size: GridSize): GridConfig {
  return GRID_CONFIGS[size]
}

/**
 * Calculate SVG dimensions
 */
export function calculateSvgDimensions(size: GridSize, dotSpacing = 80) {
  const baseSize = (size - 1) * dotSpacing
  return {
    width: baseSize + 40,
    height: baseSize + 40,
  }
}

/**
 * Get all available grid sizes
 */
export function getAvailableGridSizes(): GridSize[] {
  return [3, 4, 5, 6]
}
