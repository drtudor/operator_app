import { useEffect, useRef } from 'react'

const COLORS = ['#c8a84b', '#c8a84b', '#3d9e72', '#5a96c8', '#ddd5c0', '#c8a84b']

export default function Confetti({ active, onDone }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 100,
      w: Math.random() * 10 + 4,
      h: Math.random() * 5 + 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      rot: Math.random() * 360,
      vrot: (Math.random() - 0.5) * 8,
    }))

    const duration = 3200
    let start = null
    let raf

    const animate = (ts) => {
      if (!start) start = ts
      const elapsed = ts - start
      const progress = elapsed / duration

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const fade = Math.max(0, 1 - Math.max(0, progress - 0.55) / 0.45)

      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.rot += p.vrot
        p.vy += 0.08

        ctx.save()
        ctx.globalAlpha = fade
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rot * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      })

      if (elapsed < duration) {
        raf = requestAnimationFrame(animate)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        onDone?.()
      }
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [active, onDone])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 999,
      }}
    />
  )
}
