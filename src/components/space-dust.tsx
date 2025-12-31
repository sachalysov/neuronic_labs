import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  baseX: number
  baseY: number
  vx: number
  vy: number
  size: number
  opacity: number
}

export function SpaceDust() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>()
  const isDarkRef = useRef(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Определяем текущую тему
    const checkTheme = () => {
      isDarkRef.current = document.documentElement.dataset.theme === 'dark'
    }
    checkTheme()

    // Устанавливаем размер canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    // Инициализация частиц
    const initParticles = () => {
      particlesRef.current = []
      const particleCount = Math.floor((canvas.width * canvas.height) / 8000) // Плотность частиц
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          baseX: Math.random() * canvas.width,
          baseY: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.3 + 0.1
        })
      }
    }

    // Обработка движения мыши
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    // Анимация
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle) => {
        // Расстояние до курсора
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 150

        // Если курсор близко, частица реагирует
        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance
          const angle = Math.atan2(dy, dx)
          
          // Очень слабое притяжение (едва заметное следование)
          particle.x += Math.cos(angle) * force * 0.5
          particle.y += Math.sin(angle) * force * 0.5
        } else {
          // Возвращение к базовому дрейфу
          particle.x += particle.vx
          particle.y += particle.vy
          
          // Мягкое возвращение к исходному состоянию
          particle.x += (particle.baseX - particle.x) * 0.01
          particle.y += (particle.baseY - particle.y) * 0.01
        }

        // Обновление базовой позиции (медленный дрейф)
        particle.baseX += particle.vx
        particle.baseY += particle.vy

        // Границы экрана
        if (particle.baseX < 0 || particle.baseX > canvas.width) particle.vx *= -1
        if (particle.baseY < 0 || particle.baseY > canvas.height) particle.vy *= -1

        // Держим частицы в пределах экрана
        if (particle.x < 0) particle.x = 0
        if (particle.x > canvas.width) particle.x = canvas.width
        if (particle.y < 0) particle.y = 0
        if (particle.y > canvas.height) particle.y = canvas.height

        // Определяем цвет частиц в зависимости от темы
        const particleColor = isDarkRef.current ? '255, 255, 255' : '20, 20, 20'
        
        // Рисуем частицу
        ctx.fillStyle = `rgba(${particleColor}, ${particle.opacity})`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        // Добавляем легкое свечение вокруг частицы
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        )
        gradient.addColorStop(0, `rgba(${particleColor}, ${particle.opacity * 0.3})`)
        gradient.addColorStop(1, `rgba(${particleColor}, 0)`)
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('mousemove', handleMouseMove)
    animate()

    // Отслеживаем изменения темы
    const observer = new MutationObserver(() => {
      checkTheme()
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      observer.disconnect()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ opacity: 0.6 }}
    />
  )
}

