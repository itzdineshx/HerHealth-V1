
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    gradient?: boolean;
    hover?: boolean;
    glass?: boolean;
    glow?: boolean;
    subtle?: boolean;
    variant?: "default" | "pink" | "purple" | "blue" | "green";
  }
>(({ className, gradient, hover, glass, glow, subtle, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "",
    pink: "bg-gradient-to-br from-herhealth-pink-light/40 to-herhealth-pink/20 border-herhealth-pink/20",
    purple: "bg-gradient-to-br from-herhealth-purple-light/40 to-herhealth-purple/20 border-herhealth-purple/20",
    blue: "bg-gradient-to-br from-herhealth-blue-light/40 to-herhealth-blue/20 border-herhealth-blue/20",
    green: "bg-gradient-to-br from-herhealth-green-light/40 to-herhealth-green/20 border-herhealth-green/20",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200",
        gradient && "bg-gradient-to-br from-herhealth-pink-light/50 to-herhealth-blue-light/50",
        hover && "hover:shadow-lg hover:-translate-y-1",
        glass && "bg-white/10 backdrop-blur-md border border-white/20",
        glow && "shadow-[0_0_15px_rgba(255,105,180,0.15)]",
        subtle && "bg-white/50 backdrop-blur-sm",
        variant !== "default" && variantStyles[variant],
        className
      )}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    gradient?: boolean;
  }
>(({ className, gradient, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 p-6",
      gradient && "bg-gradient-to-r from-transparent to-muted/50 rounded-t-xl",
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    gradient?: boolean;
  }
>(({ className, gradient, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      gradient && "bg-gradient-to-r from-herhealth-pink to-herhealth-purple bg-clip-text text-transparent",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    bordered?: boolean;
  }
>(({ className, bordered, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center p-6 pt-0", 
      bordered && "pt-4 mt-2 border-t",
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
