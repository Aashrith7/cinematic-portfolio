'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import Navbar                from '@/components/ui/Navbar'
import VideoIntro            from '@/components/sections/VideoIntro'
import HeroSection           from '@/components/sections/HeroSection'
import AboutSection          from '@/components/sections/AboutSection'
import WorkExperienceSection from '@/components/sections/WorkExperienceSection'
import profile               from '@/data/profile.json'

// Snap: 0=video, 1=hero, 2=about. Work exp (3-5) uses free scroll.
const WORK_SLIDES   = profile.experience.length
const TOTAL         = 3 + WORK_SLIDES

export default function Home() {
  const mainRef  = useRef(null)
  const idxRef   = useRef(0)
  const busyRef  = useRef(false)
  const tweenRef = useRef(null)

  useEffect(() => {
    const el = mainRef.current
    if (!el) return

    function goTo(idx) {
      idx = Math.max(0, Math.min(TOTAL - 1, idx))
      if (idx === idxRef.current || busyRef.current) return
      idxRef.current = idx
      busyRef.current = true
      tweenRef.current?.kill()
      // GSAP tween for butter-smooth scroll (better than browser smooth)
      tweenRef.current = gsap.to(el, {
        scrollTop: idx * window.innerHeight,
        duration: 1.0,
        ease: 'power3.inOut',
        onComplete: () => { busyRef.current = false },
      })
    }

    function onWheel(e) {
      e.preventDefault()
      if (busyRef.current) return
      const goingDown = e.deltaY > 0
      goTo(idxRef.current + (goingDown ? 1 : -1))
    }

    let touchY = 0
    function onTouchStart(e) { touchY = e.touches[0].clientY }
    function onTouchEnd(e) {
      const dy = touchY - e.changedTouches[0].clientY
      if (Math.abs(dy) < 40) return
      if (busyRef.current) return
      goTo(idxRef.current + (dy > 0 ? 1 : -1))
    }

    function onScroll() {
      idxRef.current = Math.round(el.scrollTop / window.innerHeight)
    }

    el.addEventListener('wheel',      onWheel,      { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: true  })
    el.addEventListener('touchend',   onTouchEnd,   { passive: true  })
    el.addEventListener('scroll',     onScroll,     { passive: true  })

    return () => {
      el.removeEventListener('wheel',      onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend',   onTouchEnd)
      el.removeEventListener('scroll',     onScroll)
      tweenRef.current?.kill()
    }
  }, [])

  return (
    <>
      <Navbar />
      <main ref={mainRef} style={{ height: '100vh', overflowY: 'scroll' }}>
        <div>
          <VideoIntro />
          <HeroSection />
          <AboutSection />
          <WorkExperienceSection />
        </div>
      </main>
    </>
  )
}
