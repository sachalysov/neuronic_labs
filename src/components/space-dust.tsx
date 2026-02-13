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
  blinkPhase: number
  blinkSpeed: number
}

interface SpaceDustProps {
  className?: string
  style?: React.CSSProperties
  particleDensity?: number
}

export function SpaceDust({ className, style, particleDensity = 8000 }: SpaceDustProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number | undefined>(undefined)
  const isDarkRef = useRef(true)
  const lastMouseUpdateRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true })
    if (!ctx) return

    // Проверка prefers-reduced-motion для отключения анимации (accessibility)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      // Если пользователь предпочитает уменьшенную анимацию, просто рисуем статичные частицы
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const particleCount = Math.floor((canvas.width * canvas.height) / particleDensity)
      
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const size = Math.random() * 1.5 + 0.5
        const opacity = Math.random() * 0.3 + 0.1
        const particleColor = document.documentElement.dataset.theme === 'dark' ? '255, 255, 255' : '20, 20, 20'
        
        ctx.fillStyle = `rgba(${particleColor}, ${opacity})`
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }
      return
    }

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

    // Инициализация частиц с оптимизацией: уменьшаем количество частиц на мобильных устройствах
    const initParticles = () => {
      particlesRef.current = []
      // Оптимизация: уменьшаем плотность частиц на мобильных устройствах для лучшей производительности
      const isMobile = window.innerWidth < 768
      const adjustedDensity = isMobile ? particleDensity * 2 : particleDensity
      const particleCount = Math.floor((canvas.width * canvas.height) / adjustedDensity)
      
      // Ограничиваем максимальное количество частиц для предотвращения перегрузки
      const maxParticles = isMobile ? 200 : 500
      const finalParticleCount = Math.min(particleCount, maxParticles)
      
      for (let i = 0; i < finalParticleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          baseX: Math.random() * canvas.width,
          baseY: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.3 + 0.1,
          blinkPhase: Math.random() * Math.PI * 2, // Начальная фаза мигания (0-2π)
          blinkSpeed: Math.random() * 0.02 + 0.01 // Скорость мигания для каждой частицы
        })
      }
    }

    // Обработка движения мыши с throttling (оптимизация CPU нагрузки)
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      // Throttling: обновляем позицию мыши не чаще чем раз в 16ms (~60fps)
      if (now - lastMouseUpdateRef.current >= 16) {
        mouseRef.current = { x: e.clientX, y: e.clientY }
        lastMouseUpdateRef.current = now
      }
    }

    // Анимация с оптимизацией отрисовки
    const animate = () => {
      // Используем clearRect для оптимальной производительности
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Кэшируем цвет частиц для оптимизации
      const particleColor = isDarkRef.current ? '255, 255, 255' : '20, 20, 20'

      particlesRef.current.forEach((particle) => {
        // Обновление фазы мигания
        particle.blinkPhase += particle.blinkSpeed
        if (particle.blinkPhase > Math.PI * 2) {
          particle.blinkPhase -= Math.PI * 2
        }

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
        
        // Вычисляем opacity с миганием (синусоида от 0.1 до 0.8)
        // Используем (sin + 1) / 2 для диапазона 0-1, затем масштабируем
        const blinkIntensity = (Math.sin(particle.blinkPhase) + 1) / 2
        const minOpacity = 0.1
        const maxOpacity = 0.8
        const currentOpacity = minOpacity + (maxOpacity - minOpacity) * blinkIntensity
        
        // Рисуем частицу (упрощенная версия для лучшей производительности)
        ctx.fillStyle = `rgba(${particleColor}, ${currentOpacity})`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
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
      className={className || "fixed inset-0 pointer-events-none z-[-1]"}
      style={{ 
        ...(style || { opacity: 0.6 }),
        // Оптимизация: will-change для GPU-ускорения (осторожно - используем только для анимированных элементов)
        willChange: 'auto'
      }}
    />
  )
}

