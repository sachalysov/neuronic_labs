import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface MobileAccordionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
}

export function MobileAccordion({
  title,
  children,
  defaultOpen = false,
  className = "",
}: MobileAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Card className={`border-border transition-all duration-300 ${className}`}>
      <button
        className="w-full flex items-center justify-between p-4 sm:p-6 text-left hover:bg-secondary/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${title}`}
      >
        <h3 className="text-lg sm:text-xl font-bold pr-4">{title}</h3>
        <div className="flex-shrink-0">
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-primary" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          )}
        </div>
      </button>
      <div
        id={`accordion-content-${title}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!isOpen}
      >
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {children}
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

