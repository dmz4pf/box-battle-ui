/**
 * Grid Generator Utility
 * Generates game board structure for any supported grid size
 * Includes dots, lines, and boxes with proper coordinate system
 */

import { type GridSize, GRID_CONFIGS } from "@/config/grid-layouts"

export interface Dot {
  id: string
  x: number
  y: number
  row: number
  col: number
}

export interface Line {
  id: string
  type: "horizontal" | "vertical"
  x1: number
  y1: number
  x2: number
  y2: number
  row: number
  col: number
  boxesAdjacent: string[] // IDs of boxes this line is part of
}

export interface Box {
  id: string
  x: number
  y: number
  row: number
  col: number
  adjacentLines: {
    top: string
    bottom: string
    left: string
    right: string
  }
}

export interface GridStructure {
  size: GridSize
  dotSpacing: number
  dots: Dot[]
  horizontalLines: Line[]
  verticalLines: Line[]
  boxes: Box[]
  totalElements: {
    dots: number
    lines: number
    boxes: number
  }
}

/**
 * Generate complete grid structure
 */
export function generateGridStructure(size: GridSize, dotSpacing = 80): GridStructure {
  const config = GRID_CONFIGS[size]
  const dots = generateDots(size, dotSpacing)
  const horizontalLines = generateHorizontalLines(size, dotSpacing)
  const verticalLines = generateVerticalLines(size, dotSpacing)
  const boxes = generateBoxes(size, dotSpacing, horizontalLines, verticalLines)

  return {
    size,
    dotSpacing,
    dots,
    horizontalLines,
    verticalLines,
    boxes,
    totalElements: {
      dots: dots.length,
      lines: horizontalLines.length + verticalLines.length,
      boxes: boxes.length,
    },
  }
}

/**
 * Generate all dots for the grid
 * Example: 3x3 grid = 9 dots arranged in 3 rows and 3 columns
 */
function generateDots(size: GridSize, dotSpacing: number): Dot[] {
  const dots: Dot[] = []

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      dots.push({
        id: `dot-${row}-${col}`,
        x: col * dotSpacing,
        y: row * dotSpacing,
        row,
        col,
      })
    }
  }

  return dots
}

/**
 * Generate all horizontal lines
 * Horizontal lines connect dots left-to-right
 * For NxN grid: N rows × (N-1) lines per row
 */
function generateHorizontalLines(size: GridSize, dotSpacing: number): Line[] {
  const lines: Line[] = []

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size - 1; col++) {
      const lineId = `h-${row}-${col}`

      lines.push({
        id: lineId,
        type: "horizontal",
        x1: col * dotSpacing,
        y1: row * dotSpacing,
        x2: (col + 1) * dotSpacing,
        y2: row * dotSpacing,
        row,
        col,
        boxesAdjacent: getAdjacentBoxesForHorizontalLine(row, col),
      })
    }
  }

  return lines
}

/**
 * Generate all vertical lines
 * Vertical lines connect dots top-to-bottom
 * For NxN grid: N columns × (N-1) lines per column
 */
function generateVerticalLines(size: GridSize, dotSpacing: number): Line[] {
  const lines: Line[] = []

  for (let col = 0; col < size; col++) {
    for (let row = 0; row < size - 1; row++) {
      const lineId = `v-${row}-${col}`

      lines.push({
        id: lineId,
        type: "vertical",
        x1: col * dotSpacing,
        y1: row * dotSpacing,
        x2: col * dotSpacing,
        y2: (row + 1) * dotSpacing,
        row,
        col,
        boxesAdjacent: getAdjacentBoxesForVerticalLine(row, col),
      })
    }
  }

  return lines
}

/**
 * Generate all boxes
 * For NxN grid: (N-1) × (N-1) boxes
 * Each box has references to its 4 surrounding lines
 */
function generateBoxes(size: GridSize, dotSpacing: number, horizontalLines: Line[], verticalLines: Line[]): Box[] {
  const boxes: Box[] = []
  const boxGridSize = size - 1

  for (let row = 0; row < boxGridSize; row++) {
    for (let col = 0; col < boxGridSize; col++) {
      boxes.push({
        id: `box-${row}-${col}`,
        x: col * dotSpacing,
        y: row * dotSpacing,
        row,
        col,
        adjacentLines: {
          top: `h-${row}-${col}`, // Horizontal line above
          bottom: `h-${row + 1}-${col}`, // Horizontal line below
          left: `v-${row}-${col}`, // Vertical line to the left
          right: `v-${row}-${col + 1}`, // Vertical line to the right
        },
      })
    }
  }

  return boxes
}

/**
 * Helper: Get adjacent boxes for a horizontal line
 */
function getAdjacentBoxesForHorizontalLine(row: number, col: number): string[] {
  const boxes: string[] = []

  // Box above (if exists)
  if (row > 0) {
    boxes.push(`box-${row - 1}-${col}`)
  }

  // Box below (if exists)
  boxes.push(`box-${row}-${col}`)

  return boxes.filter((id) => id !== undefined)
}

/**
 * Helper: Get adjacent boxes for a vertical line
 */
function getAdjacentBoxesForVerticalLine(row: number, col: number): string[] {
  const boxes: string[] = []

  // Box to the left (if exists)
  if (col > 0) {
    boxes.push(`box-${row}-${col - 1}`)
  }

  // Box to the right (if exists)
  boxes.push(`box-${row}-${col}`)

  return boxes.filter((id) => id !== undefined)
}

/**
 * Check if a line ID is horizontal or vertical
 */
export function isHorizontalLine(lineId: string): boolean {
  return lineId.startsWith("h-")
}

/**
 * Get all lines that form a box
 */
export function getBoxLines(boxId: string, gridStructure: GridStructure): Line[] {
  const [, row, col] = boxId.split("-").map((v) => (isNaN(Number(v)) ? v : Number(v)))
  const box = gridStructure.boxes.find((b) => b.id === boxId)

  if (!box) return []

  const lineIds = Object.values(box.adjacentLines)
  return [
    ...gridStructure.horizontalLines.filter((l) => lineIds.includes(l.id)),
    ...gridStructure.verticalLines.filter((l) => lineIds.includes(l.id)),
  ]
}

/**
 * Check if a box is complete (all 4 lines drawn)
 */
export function isBoxComplete(boxId: string, drawnLines: Set<string>, gridStructure: GridStructure): boolean {
  const lines = getBoxLines(boxId, gridStructure)
  return lines.every((line) => drawnLines.has(line.id))
}
