import { Shell, Window, StringLights, WallClock, Corkboard } from './Shell'
import { Bookshelf } from './Bookshelf'
import { Cabinet } from './Cabinet'
import { Desk, DeskItems, Lamp, Phone } from './Desk'
import { Monitor } from './Monitor'
import { Chair } from './Chair'
import { Hotspot } from './Hotspot'
import { useStore } from '../store'
import { sections, type SectionId } from '../data/content'

// 번호·제목은 content.ts 한 군데서만 관리
const meta = (id: SectionId) => sections.find((s) => s.id === id)!

// 방 조립 — 섹션 5개는 Hotspot으로 감싸서 클릭 가능하게
export function Room() {
  const setFocus = useStore((s) => s.setFocus)
  const toggleNight = useStore((s) => s.toggleNight)
  const go = (id: SectionId) => () => setFocus(id)

  return (
    <group>
      <Shell />
      <Window />
      <StringLights />
      <WallClock />
      <Desk />
      <DeskItems />
      <Chair />

      {/* labelPosition은 물건마다 눈으로 맞춘 값 */}
      <Hotspot id="projects" no={meta('projects').no} label={meta('projects').title} labelPosition={[0.75, 4.9, 4.4]} labelSide="left" onSelect={go('projects')}>
        <Monitor />
      </Hotspot>
      <Hotspot id="skills" no={meta('skills').no} label={meta('skills').title} labelPosition={[2.5, 5.45, 0.9]} onSelect={go('skills')}>
        <Bookshelf />
      </Hotspot>
      <Hotspot id="experience" no={meta('experience').no} label={meta('experience').title} labelPosition={[0.1, 5.75, 8.4]} labelSide="left" onSelect={go('experience')}>
        <Corkboard />
      </Hotspot>
      <Hotspot id="about" no={meta('about').no} label={meta('about').title} labelPosition={[6.4, 1.9, 0.65]} onSelect={go('about')}>
        <Cabinet />
      </Hotspot>
      <Hotspot id="contact" no={meta('contact').no} label={meta('contact').title} labelPosition={[2.2, 2.6, 6.45]} labelSide="left" onSelect={go('contact')}>
        <Phone />
      </Hotspot>
      {/* 스탠드만 섹션 아님. 라벨 없이 밤낮 토글만 */}
      <Hotspot id="lamp" onSelect={toggleNight}>
        <Lamp />
      </Hotspot>
    </group>
  )
}
