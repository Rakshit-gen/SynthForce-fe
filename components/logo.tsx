"use client"

import Image from "next/image"

interface LogoProps {
  size?: number
  className?: string
}

export function Logo({ size = 32, className }: LogoProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <Image
        src="/icon.svg"
        alt="Synthetic Workforce Simulator"
        width={size}
        height={size}
        priority
        className="w-full h-full"
      />
    </div>
  )
}

