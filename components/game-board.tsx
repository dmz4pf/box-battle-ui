"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface GameBoardProps {
  currentPlayer: "player1" | "player2"
  onLineClick: (lineId: string) => void
  drawnLines: Set<string>
  completedBoxes: Map<string, "player1" | "player2">
  gridSize?: 3 | 4 | 5 | 6
}

const DOT_SPACING = 80
const DOT_RADIUS = 5

export default function GameBoard({
  currentPlayer,
  onLineClick,
  drawnLines,
  completedBoxes,
  gridSize = 5
}: GameBoardProps) {
  const [hoveredLine, setHoveredLine] = useState<string | null>(null)

  const padding = 40
  const width = (gridSize - 1) * DOT_SPACING + padding * 2
  const height = (gridSize - 1) * DOT_SPACING + padding * 2

  const handleLineClick = (lineId: string) => {
    if (drawnLines.has(lineId)) return
    onLineClick(lineId)
  }

  // Generate horizontal and vertical lines
  const lines = []

  // Horizontal lines (all rows from 0 to gridSize-1)
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize - 1; j++) {
      const hLineId = `h-${i}-${j}-${i}-${j + 1}`
      lines.push({
        id: hLineId,
        x1: padding + j * DOT_SPACING,
        y1: padding + i * DOT_SPACING,
        x2: padding + (j + 1) * DOT_SPACING,
        y2: padding + i * DOT_SPACING,
        isHorizontal: true,
      })
    }
  }

  // Vertical lines (all columns from 0 to gridSize-1)
  for (let i = 0; i < gridSize - 1; i++) {
    for (let j = 0; j < gridSize; j++) {
      const vLineId = `v-${i}-${j}-${i + 1}-${j}`
      lines.push({
        id: vLineId,
        x1: padding + j * DOT_SPACING,
        y1: padding + i * DOT_SPACING,
        x2: padding + j * DOT_SPACING,
        y2: padding + (i + 1) * DOT_SPACING,
        isHorizontal: false,
      })
    }
  }

  // Generate boxes
  const boxes = []
  for (let i = 0; i < gridSize - 1; i++) {
    for (let j = 0; j < gridSize - 1; j++) {
      boxes.push({
        id: `box-${i}-${j}`,
        x: padding + j * DOT_SPACING,
        y: padding + i * DOT_SPACING,
      })
    }
  }

  return (
    <motion.div
      className="flex items-center justify-center overflow-hidden max-h-[80vh]"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring" }}
    >
      <svg
        width={width}
        height={height}
        className="drop-shadow-2xl flex-shrink-0"
        style={{
          background: "linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(30, 10, 60, 0.7) 100%)",
          borderRadius: "16px",
          border: "2px solid rgba(168, 85, 247, 0.5)",
          overflow: "hidden",
        }}
      >
        {/* Draw completed boxes */}
        {boxes.map((box) => {
          const owner = completedBoxes.get(box.id)
          if (!owner) return null

          const isPlayer1 = owner === "player1"
          return (
            <motion.g key={box.id}>
              <motion.rect
                x={box.x}
                y={box.y}
                width={DOT_SPACING}
                height={DOT_SPACING}
                fill={isPlayer1 ? "#00D9FF" : "#FF006E"}
                opacity={0.4}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.4 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <motion.rect
                x={box.x + 5}
                y={box.y + 5}
                width={DOT_SPACING - 10}
                height={DOT_SPACING - 10}
                fill="none"
                stroke={isPlayer1 ? "#00D9FF" : "#FF006E"}
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, delay: 0.1 }}
              />
            </motion.g>
          )
        })}

        {/* Draw lines */}
        {lines.map((line) => {
          const isDrawn = drawnLines.has(line.id)
          const isHovered = hoveredLine === line.id
          const playerColor = currentPlayer === "player1" ? "#00D9FF" : "#FF006E"

          return (
            <g key={line.id}>
              {/* Invisible hitbox */}
              <line
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="transparent"
                strokeWidth="12"
                style={{ cursor: isDrawn ? "default" : "pointer" }}
                onClick={() => handleLineClick(line.id)}
                onMouseEnter={() => setHoveredLine(line.id)}
                onMouseLeave={() => setHoveredLine(null)}
                opacity={isDrawn ? 0 : 0.3}
              />

              {/* Visible line */}
              <motion.line
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={isDrawn ? playerColor : "#8B5CF6"}
                strokeWidth={isDrawn ? 5 : isHovered ? 3 : 1.5}
                strokeDasharray={isDrawn ? "0" : "4,4"}
                initial={isDrawn ? { pathLength: 0, opacity: 0 } : { opacity: 0.3 }}
                animate={isDrawn ? { pathLength: 1, opacity: 1 } : { opacity: isHovered ? 0.8 : 0.3 }}
                transition={{
                  duration: isDrawn ? 0.4 : 0.2,
                  ease: "easeInOut",
                }}
                filter={isHovered && !isDrawn ? `drop-shadow(0 0 8px ${playerColor})` : undefined}
              />
            </g>
          )
        })}

        {/* Draw dots */}
        {Array.from({ length: gridSize }).map((_, i) =>
          Array.from({ length: gridSize }).map((_, j) => (
            <motion.circle
              key={`dot-${i}-${j}`}
              cx={padding + j * DOT_SPACING}
              cy={padding + i * DOT_SPACING}
              r={DOT_RADIUS}
              fill="#A78BFA"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: (i * gridSize + j) * 0.02 + 0.5 }}
              filter="drop-shadow(0 0 4px rgba(167, 139, 250, 0.8))"
            />
          )),
        )}
      </svg>
    </motion.div>
  )
}
