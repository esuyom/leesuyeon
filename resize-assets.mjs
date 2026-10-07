// _original/ 에 원본 넣고 돌리면 긴 변 512px로 줄여서 assets/ 에 떨굼. import 경로 그대로
// Jimp이 읽을 때 EXIF 회전을 이미 적용해줘서 휴대폰 사진도 똑바로 섬
import { Jimp } from 'jimp'
import fs from 'node:fs/promises'
import path from 'node:path'

const SRC = 'src/assets/_original'
const OUT = 'src/assets'
const LONG = 512

for (const name of await fs.readdir(SRC)) {
  const ext = path.extname(name).toLowerCase()
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue
  const img = await Jimp.read(path.join(SRC, name))
  const { width: w, height: h } = img.bitmap
  img.resize(w >= h ? { w: LONG } : { h: LONG })
  const out = path.join(OUT, name)
  if (ext === '.png') await img.write(out)
  else await fs.writeFile(out, await img.getBuffer('image/jpeg', { quality: 82 }))
  console.log(`${name}  ${w}x${h} -> ${img.bitmap.width}x${img.bitmap.height}`)
}
