import { useEffect, useRef } from 'react'
import { useStore } from '../store'

// 이 파일 넣으면 헤더에 음악 버튼 생김. 없으면 버튼째로 숨김
const SRC = '/audio/bgm.mp3'

// 렌더하는 건 없음. audio 엘리먼트만 들고 있는 컴포넌트
export function Sound() {
  const soundOn = useStore((s) => s.soundOn)
  const setSoundAvailable = useStore((s) => s.setSoundAvailable)
  const audio = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const a = new Audio()
    a.loop = true
    a.volume = 0.4
    a.preload = 'metadata'
    a.addEventListener('loadedmetadata', () => setSoundAvailable(true)) // 파일 있을 때만 발화
    a.src = SRC
    audio.current = a
    return () => {
      a.pause()
      audio.current = null
    }
  }, [setSoundAvailable])

  useEffect(() => {
    const a = audio.current
    if (!a) return
    if (soundOn) a.play().catch(() => useStore.getState().setSound(false)) // 자동재생 막히면 버튼 되돌림
    else a.pause()
  }, [soundOn])

  return null
}
