import type React from "react"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    className?:string
}

export function Card({ className, ...props }: CardProps) {
  return <div className={`bg-white shadow-lg rounded-lg overflow-hidden ${className}`} {...props} />
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    className?:string
}

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div className={`px-6 py-4 ${className}`} {...props} />
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    className?:string
}

export function CardTitle({ className, ...props }: CardTitleProps) {
  return <h3 className={`text-lg font-semibold text-gray-900 ${className}`} {...props} />
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    className?:string
}

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={`px-6 py-4 ${className}`} {...props} />
}

