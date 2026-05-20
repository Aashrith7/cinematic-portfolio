'use client'

import { useRef } from 'react'
import VideoIntro from '@/components/sections/VideoIntro'
import HeroSection from '@/components/sections/HeroSection'

export default function Home() {
  const heroRef = useRef(null)

  return (
    <main
      style={{
        height: '100vh',
        overflowY: 'scroll',
        scrollSnapType: 'y mandatory',
      }}
    >
      <VideoIntro heroRef={heroRef} />
      <HeroSection ref={heroRef} />
    </main>
  )
}
