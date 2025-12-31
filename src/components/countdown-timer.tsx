import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

interface CountdownTimerProps {
  hours?: number
}

export function CountdownTimer({ hours = 48 }: CountdownTimerProps) {
  // Вычисляем время окончания (48 часов от текущего момента)
  const [timeLeft, setTimeLeft] = useState({
    hours: hours,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    // Проверяем, есть ли сохраненное время окончания
    const savedEndTime = localStorage.getItem("promoEndTime")
    let endTime: number

    if (savedEndTime) {
      endTime = parseInt(savedEndTime)
    } else {
      // Создаем новое время окончания
      endTime = Date.now() + hours * 60 * 60 * 1000
      localStorage.setItem("promoEndTime", endTime.toString())
    }

    const updateTimer = () => {
      const now = Date.now()
      const difference = endTime - now

      if (difference <= 0) {
        // Таймер истек, создаем новый
        const newEndTime = Date.now() + hours * 60 * 60 * 1000
        localStorage.setItem("promoEndTime", newEndTime.toString())
        setTimeLeft({
          hours: hours,
          minutes: 0,
          seconds: 0
        })
      } else {
        const hoursLeft = Math.floor(difference / (1000 * 60 * 60))
        const minutesLeft = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const secondsLeft = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({
          hours: hoursLeft,
          minutes: minutesLeft,
          seconds: secondsLeft
        })
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [hours])

  const formatNumber = (num: number) => num.toString().padStart(2, "0")

  return (
    <div className="flex items-center justify-center gap-4 py-6">
      <Clock className="h-6 w-6 text-primary animate-pulse" />
      
      <div className="flex items-center gap-2">
        <div className="text-center">
          <div className="bg-primary/10 border border-primary/30 rounded-lg px-3 py-2 min-w-[60px]">
            <span className="text-2xl md:text-3xl font-bold text-primary">
              {formatNumber(timeLeft.hours)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">часов</p>
        </div>

        <span className="text-2xl font-bold text-primary">:</span>

        <div className="text-center">
          <div className="bg-primary/10 border border-primary/30 rounded-lg px-3 py-2 min-w-[60px]">
            <span className="text-2xl md:text-3xl font-bold text-primary">
              {formatNumber(timeLeft.minutes)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">минут</p>
        </div>

        <span className="text-2xl font-bold text-primary">:</span>

        <div className="text-center">
          <div className="bg-primary/10 border border-primary/30 rounded-lg px-3 py-2 min-w-[60px]">
            <span className="text-2xl md:text-3xl font-bold text-primary">
              {formatNumber(timeLeft.seconds)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">секунд</p>
        </div>
      </div>
    </div>
  )
}

