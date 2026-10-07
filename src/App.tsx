import { useEffect, useMemo } from 'react'
import { Experience } from './scene/Experience'
import { Overlay } from './ui/Overlay'
import { Page2D } from './ui/Page2D'
import { Sound } from './ui/Sound'
import { hasWebGL } from './ui/useMedia'
import { useStore } from './store'

// 최상위 분기 — WebGL 안 되거나 2D 모드면 Page2D, 아니면 3D 방
export default function App() {
  const view2d = useStore((s) => s.view2d)
  const night = useStore((s) => s.night)
  const webgl = useMemo(() => hasWebGL(), []) // 한 번만 검사

  // html[data-theme] 바꿔서 CSS 변수 통째로 전환
  useEffect(() => {
    document.documentElement.dataset.theme = night ? 'night' : 'day'
  }, [night])

  // forced면 3D로 돌아가는 버튼도 안 띄움
  if (!webgl) return <Page2D forced />

  return (
    <>
      {/* 렌더는 없고 audio 엘리먼트만 들고 있음 */}
      <Sound />
      {view2d ? (
        <Page2D />
      ) : (
        <div className="app">
          <Experience />
          <Overlay />
        </div>
      )}
    </>
  )
}
