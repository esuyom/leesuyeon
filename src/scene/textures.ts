import * as THREE from 'three'

// 텍스처 전부 캔버스로 그려 씀 — 이미지 파일 안 들고 다니려고

// 시드 고정 난수. 새로고침해도 같은 모양
export function rng(seed: number) {
  let s = seed
  return () => {
    s |= 0
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// 캔버스에 그린 걸 THREE 텍스처로
export function canvasTexture(w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void) {
  const cv = document.createElement('canvas')
  cv.width = w
  cv.height = h
  draw(cv.getContext('2d')!, w, h)
  const t = new THREE.CanvasTexture(cv)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

// 바닥 마루 8줄
export function floorTexture() {
  const rnd = rng(11)
  return canvasTexture(1024, 1024, (g, w, h) => {
    g.fillStyle = '#4a3a4c'
    g.fillRect(0, 0, w, h)
    const pw = w / 8
    for (let i = 0; i < 8; i++) {
      let y = -rnd() * 300
      while (y < h) {
        const len = 260 + rnd() * 260
        const l = 26 + rnd() * 10
        g.fillStyle = `hsl(${300 + rnd() * 20},${14 + rnd() * 6}%,${l}%)`
        g.fillRect(i * pw + 2, y + 2, pw - 4, len - 4)
        g.strokeStyle = 'rgba(0,0,0,.12)'
        g.lineWidth = 1.5
        for (let k = 0; k < 4; k++) {
          g.beginPath()
          const xx = i * pw + 10 + rnd() * (pw - 20)
          g.moveTo(xx, y + 10)
          g.bezierCurveTo(xx + 8, y + len * 0.3, xx - 8, y + len * 0.6, xx + 3, y + len - 10)
          g.stroke()
        }
        y += len
      }
    }
  })
}

// 창밖 하늘. 밤엔 노을+별, 낮엔 구름
export function skyTexture(night: boolean) {
  const rnd = rng(3)
  return canvasTexture(512, 512, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h)
    if (night) {
      gr.addColorStop(0, '#2c3170')
      gr.addColorStop(0.55, '#b9668f')
      gr.addColorStop(1, '#ffb05a')
    } else {
      gr.addColorStop(0, '#6fa8e8')
      gr.addColorStop(1, '#cfe6ff')
    }
    g.fillStyle = gr
    g.fillRect(0, 0, w, h)
    if (night) {
      g.fillStyle = 'rgba(255,255,255,.85)'
      for (let i = 0; i < 40; i++) {
        g.beginPath()
        g.arc(rnd() * w, rnd() * h * 0.4, rnd() * 1.6 + 0.4, 0, 7)
        g.fill()
      }
      g.fillStyle = '#fff3d6'
      g.beginPath()
      g.arc(w * 0.72, h * 0.22, 26, 0, 7)
      g.fill()
    } else {
      g.fillStyle = 'rgba(255,255,255,.9)'
      for (const [cx, cy, s] of [[120, 120, 1], [360, 80, 0.8], [300, 200, 0.6]]) {
        for (let k = 0; k < 4; k++) {
          g.beginPath()
          g.arc(cx + k * 28 * s, cy + (k % 2) * 8, 26 * s, 0, 7)
          g.fill()
        }
      }
    }
    // 산 + 마을 불빛
    const r2 = rng(5)
    g.fillStyle = night ? '#2a2350' : '#6b8fb8'
    g.beginPath()
    g.moveTo(0, h)
    for (let x = 0; x <= w; x += 32) g.lineTo(x, h * 0.82 - (r2() * 70 + (x % 96 === 0 ? 50 : 0)))
    g.lineTo(w, h)
    g.fill()
    if (night) {
      g.fillStyle = '#ffd27a'
      for (let i = 0; i < 26; i++) g.fillRect(rnd() * w, h * 0.84 + rnd() * h * 0.12, 4, 6)
    }
  })
}

// 코르크 — 점 2500개 뿌림
export function corkTexture() {
  const rnd = rng(21)
  return canvasTexture(256, 256, (g, w, h) => {
    g.fillStyle = '#c99566'
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 2500; i++) {
      g.fillStyle = rnd() > 0.5 ? 'rgba(90,50,20,.18)' : 'rgba(255,230,190,.15)'
      g.fillRect(rnd() * w, rnd() * h, 2, 2)
    }
  })
}

// 세로 height에 맞췄을 때의 가로·세로. 늘이거나 자르지 않음
// portrait은 휴대폰 원본 그대로 꽂았을 때 보험 — resize-assets 거친 건 안 탐
export function fitPhoto(tex: THREE.Texture, height: number, portrait = false) {
  const img = tex.image as { width: number; height: number }
  let w = img.width
  let h = img.height
  if (portrait && w > h) {
    tex.center.set(0.5, 0.5)
    tex.rotation = Math.PI / 2 // 거꾸로 서면 여기 부호만 뒤집기
    ;[w, h] = [h, w]
  }
  tex.colorSpace = THREE.SRGBColorSpace // 안 켜면 사진만 색 바래 보임
  tex.anisotropy = 8
  tex.repeat.set(1, 1) // 잘라 쓰던 값이 캐시에 남아 있을 수 있어서 리셋
  tex.offset.set(0, 0)
  tex.needsUpdate = true
  return { w: height * (w / h), h: height }
}

// 멀리서 보이는 모니터 화면. 줌인하면 진짜 HTML로 교체됨
export function screenTexture(name: string) {
  return canvasTexture(1024, 600, (g, w, h) => {
    g.fillStyle = '#232a47'
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#1a1f36'
    g.fillRect(0, 0, w, 26)
    g.fillStyle = '#ffb547'
    g.font = 'bold 15px monospace'
    g.fillText(`${name} OS`, 14, 18)
    g.fillStyle = '#f3efe6'
    g.beginPath()
    g.roundRect(60, 70, 620, 400, 14)
    g.fill()
    ;['#e07a6b', '#ffb547', '#7fe3c4'].forEach((c, i) => {
      g.fillStyle = c
      g.beginPath()
      g.arc(84 + i * 22, 92, 7, 0, 7)
      g.fill()
    })
    for (let i = 0; i < 3; i++) {
      g.fillStyle = '#e6dfd0'
      g.fillRect(200 + i * 160, 140, 140, 110)
      g.fillStyle = '#1e2236'
      g.fillRect(200 + i * 160, 265, 100, 12)
      g.fillStyle = '#9ea2b3'
      g.fillRect(200 + i * 160, 285, 120, 8)
    }
    g.fillStyle = '#1e2236'
    g.fillRect(80, 130, 100, 28)
    g.fillStyle = '#c9c3b5'
    for (let i = 0; i < 3; i++) g.fillRect(80, 175 + i * 30, 90, 10)
    g.fillStyle = '#12152a'
    g.beginPath()
    g.roundRect(640, 300, 340, 220, 12)
    g.fill()
    g.font = '18px monospace'
    g.fillStyle = '#7fe3c4'
    g.fillText('$ whoami', 660, 345)
    g.fillStyle = '#e6e8f2'
    g.fillText(name, 660, 375)
    g.fillStyle = '#7fe3c4'
    g.fillText('$ npm run dev', 660, 405)
    g.fillStyle = '#ffb547'
    g.fillRect(660, 420, 12, 20)
    g.fillStyle = 'rgba(26,31,54,.9)'
    g.beginPath()
    g.roundRect(w / 2 - 130, h - 64, 260, 52, 12)
    g.fill()
    ;['#ffb547', '#12152a', '#f3efe6', '#9fb4ff'].forEach((c, i) => {
      g.fillStyle = c
      g.beginPath()
      g.roundRect(w / 2 - 118 + i * 62, h - 56, 40, 36, 8)
      g.fill()
    })
  })
}

// 탁상 달력. 오늘 날짜에 동그라미
export function deskCalendarTexture(date = new Date()) {
  const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']
  return canvasTexture(320, 256, (g) => {
    g.fillStyle = '#f7f4ec'
    g.fillRect(0, 0, 320, 256)
    g.fillStyle = '#1e2236'
    g.font = 'bold 30px sans-serif'
    g.fillText(String(date.getMonth() + 1).padStart(2, '0'), 18, 42)
    g.fillStyle = '#9ea2b3'
    g.font = '15px sans-serif'
    g.fillText(`${months[date.getMonth()]} ${date.getFullYear()}`, 70, 40)
    const first = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    const days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    g.font = '13px sans-serif'
    for (let d = 1; d <= days; d++) {
      const idx = first + d - 1
      const c = idx % 7
      const r = Math.floor(idx / 7)
      const x = 20 + c * 41
      const y = 80 + r * 32
      g.fillStyle = c === 0 ? '#e07a6b' : '#55586a'
      g.fillText(String(d), x, y)
      if (d === date.getDate()) {
        g.strokeStyle = '#e07a6b'
        g.lineWidth = 3
        g.beginPath()
        g.arc(x + 7, y - 5, 14, 0, 7)
        g.stroke()
      }
    }
  })
}
