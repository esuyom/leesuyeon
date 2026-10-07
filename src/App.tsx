import { Suspense, lazy, useEffect, useMemo } from 'react'
import { Overlay } from './ui/Overlay'
import { Page2D } from './ui/Page2D'
import { hasWebGL } from './ui/useMedia'
import { useStore } from './store'

// three.js와 R3F, drei가 번들의 대부분이다. 따로 떼어내면 2D로 보는 사람은 아예 안 받는다
const Experience = lazy(() => import('./scene/Experience').then((m) => ({ default: m.Experience })))

// 씬 청크를 받는 동안 빈 화면이 뜨면 깨진 걸로 보인다
function SceneLoading() {
  return (
    <div className="scene-loading" role="status">
      Loading
    </div>
  )
}

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
      {view2d ? (
        <Page2D />
      ) : (
        <div className="app">
          <Suspense fallback={<SceneLoading />}>
            <Experience />
          </Suspense>
          <Overlay />
        </div>
      )}
    </>
  )
}
