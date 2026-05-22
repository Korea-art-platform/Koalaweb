import { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import * as THREE from 'three';
import { useQuery } from '@tanstack/react-query';
import { getSkus } from '@/api/sku';
import type { Sku, PageResponse } from '@/api/types';
import './gallery.css';

/* =========================================================
   Types
   ========================================================= */
interface Artwork {
  id: number;
  skuCode: string;
  titleKo: string;
  artistKo: string;
  medium: string;
  kind: string;
  desc: string;
  price: number;
  palette: [string, string, string];
  motif: string;
  imageUrl?: string;
}

/* =========================================================
   Palette / Motif pools
   ========================================================= */
const PALETTES: [string, string, string][] = [
  ['#efe6d4', '#cfc0a1', '#7a6b52'],
  ['#1d1a16', '#3a322a', '#a78a5a'],
  ['#e84a3a', '#f3c44b', '#0e0e10'],
  ['#0e2a3d', '#1f5f7a', '#d6c184'],
  ['#cfcabc', '#8a8270', '#2a2620'],
  ['#5a0f12', '#a51b1f', '#f4c89c'],
  ['#0a0a0a', '#7c7c80', '#e6e6ea'],
  ['#f1e3c8', '#bd9a6a', '#503a22'],
];
const MOTIFS = ['jar', 'bronze', 'toy', 'mountain', 'stone', 'dawn', 'garden', 'hanji'];

function skuToArtwork(sku: Sku, idx: number): Artwork {
  return {
    id: idx + 1,
    skuCode: sku.skuCode,
    titleKo: sku.name,
    artistKo: sku.artistName ?? '작가',
    medium: sku.genre ?? '현대미술',
    kind: (sku.genre ?? 'ART').toUpperCase(),
    desc: sku.description ?? '',
    price: (sku as any).price ?? 0,
    palette: PALETTES[idx % PALETTES.length],
    motif: MOTIFS[idx % MOTIFS.length],
    imageUrl: sku.primaryImageUrl,
  };
}

/* =========================================================
   Procedural texture helpers
   ========================================================= */
function hexToRgba(hex: string, a: number) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
function shade(hex: string, amt: number) {
  const h = hex.replace('#', '');
  let r = parseInt(h.substring(0, 2), 16);
  let g = parseInt(h.substring(2, 4), 16);
  let b = parseInt(h.substring(4, 6), 16);
  if (amt >= 0) { r = Math.round(r + (255 - r) * amt); g = Math.round(g + (255 - g) * amt); b = Math.round(b + (255 - b) * amt); }
  else { r = Math.round(r * (1 + amt)); g = Math.round(g * (1 + amt)); b = Math.round(b * (1 + amt)); }
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}
function mix(h1: string, h2: string, t: number) {
  const c1 = h1.replace('#',''); const c2 = h2.replace('#','');
  const r = Math.round(parseInt(c1.substring(0,2),16)*(1-t)+parseInt(c2.substring(0,2),16)*t);
  const g = Math.round(parseInt(c1.substring(2,4),16)*(1-t)+parseInt(c2.substring(2,4),16)*t);
  const b = Math.round(parseInt(c1.substring(4,6),16)*(1-t)+parseInt(c2.substring(4,6),16)*t);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}
function clampByte(v: number) { return Math.max(0, Math.min(255, v)); }

function drawMotif(g: CanvasRenderingContext2D, art: Artwork, w: number, h: number) {
  const [a, b, d] = art.palette;
  g.save();
  g.translate(w / 2, h * 0.48);
  switch (art.motif) {
    case 'jar': {
      g.fillStyle = hexToRgba('#ffffff', 0.82); g.beginPath();
      const r = w * 0.28; g.ellipse(0, 0, r, r * 1.05, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = hexToRgba('#000', 0.15); g.beginPath(); g.ellipse(0, -r, r*0.34, r*0.08, 0, 0, Math.PI*2); g.fill();
      g.fillStyle = hexToRgba('#000', 0.15); g.beginPath(); g.ellipse(0, r*0.95, r*0.36, r*0.08, 0, 0, Math.PI*2); g.fill();
      g.strokeStyle = hexToRgba('#000', 0.18); g.lineWidth = 1.2; g.beginPath();
      g.moveTo(-r*0.2, -r*0.7); g.bezierCurveTo(-r*0.05, -r*0.2, -r*0.18, r*0.2, 0.02, r*0.7); g.stroke();
      break;
    }
    case 'bronze': {
      g.fillStyle = hexToRgba(d, 0.95); g.beginPath();
      g.moveTo(0,-h*0.32); g.bezierCurveTo(w*0.16,-h*0.2,w*0.1,h*0.15,0,h*0.32); g.bezierCurveTo(-w*0.1,h*0.15,-w*0.16,-h*0.2,0,-h*0.32); g.fill();
      break;
    }
    case 'toy': {
      g.fillStyle=a; g.beginPath(); g.arc(0,-h*0.05,w*0.22,0,Math.PI*2); g.fill();
      g.fillStyle=b; g.beginPath(); g.arc(0,h*0.22,w*0.16,0,Math.PI*2); g.fill();
      g.fillStyle=d; g.beginPath(); g.arc(-w*0.07,-h*0.07,w*0.018,0,Math.PI*2); g.fill();
      g.beginPath(); g.arc(w*0.07,-h*0.07,w*0.018,0,Math.PI*2); g.fill();
      break;
    }
    case 'mountain': {
      ([{ c: shade(b,0.4),y:0.18,lh:0.18 },{ c:b,y:0.05,lh:0.22 },{ c:shade(b,-0.3),y:-0.05,lh:0.22 },{ c:shade(b,-0.55),y:-0.16,lh:0.20 }]).forEach(L => {
        g.fillStyle=L.c; g.beginPath(); const yb=L.y*h; g.moveTo(-w*0.55,yb+L.lh*h);
        let x=-w*0.55; while(x<w*0.55){g.lineTo(x,(Math.sin(x*0.012+L.y*9)*0.5+0.5)*L.lh*h+yb); x+=14+Math.random()*22;}
        g.lineTo(w*0.55,yb+L.lh*h); g.closePath(); g.fill();
      });
      g.strokeStyle=hexToRgba(d,0.6); g.lineWidth=1.2; g.beginPath(); g.moveTo(-w*0.55,0); g.lineTo(w*0.55,0); g.stroke();
      break;
    }
    case 'stone': {
      g.fillStyle=hexToRgba(a,0.96); g.beginPath();
      const pts=18,r0=w*0.26; for(let i=0;i<pts;i++){const t=(i/pts)*Math.PI*2;const rr=r0+Math.sin(t*3+1.4)*18+Math.cos(t*5)*10;if(i===0)g.moveTo(Math.cos(t)*rr,Math.sin(t)*rr*0.9);else g.lineTo(Math.cos(t)*rr,Math.sin(t)*rr*0.9);}
      g.closePath(); g.fill();
      g.strokeStyle=hexToRgba('#d4b06a',0.7); g.lineWidth=1.4; g.beginPath(); g.moveTo(-w*0.18,-h*0.04); g.bezierCurveTo(-w*0.05,h*0.04,w*0.05,-h*0.02,w*0.16,h*0.06); g.stroke();
      break;
    }
    case 'dawn': {
      const rings=9; for(let i=rings;i>0;i--){const t=i/rings;g.fillStyle=hexToRgba(mix(a,b,1-t),0.18+t*0.07);g.beginPath();g.arc(0,h*0.08,w*0.5*t,0,Math.PI*2);g.fill();}
      g.fillStyle=hexToRgba(d,0.9); g.beginPath(); g.arc(0,h*0.08,w*0.05,0,Math.PI*2); g.fill();
      break;
    }
    case 'garden': {
      g.strokeStyle=hexToRgba(d,0.65); g.lineWidth=1;
      for(let i=0;i<40;i++){g.beginPath();const x1=-w*0.5+Math.random()*w,y1=-h*0.5+Math.random()*h*0.8;g.moveTo(x1,y1);g.lineTo(x1+(Math.random()-0.5)*w*0.6,y1+(Math.random()-0.5)*h*0.5);g.stroke();}
      g.fillStyle=hexToRgba('#fff',0.65); for(let i=0;i<5;i++){g.beginPath();g.arc((Math.random()-0.5)*w*0.7,(Math.random()-0.5)*h*0.5,6+Math.random()*12,0,Math.PI*2);g.fill();}
      break;
    }
    case 'hanji': {
      for(let i=0;i<220;i++){const x=(Math.random()-0.5)*w*0.9,y=(Math.random()-0.5)*h*0.7,len=8+Math.random()*30,ang=Math.random()*Math.PI;g.strokeStyle=hexToRgba(shade(a,0.2),0.5);g.lineWidth=0.6;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(ang)*len,y+Math.sin(ang)*len);g.stroke();}
      for(let i=0;i<60;i++){const ang=(i/60)*Math.PI*2,r=w*0.2+Math.sin(ang*3)*22;g.fillStyle=hexToRgba(d,0.85);g.beginPath();g.arc(Math.cos(ang)*r,Math.sin(ang)*r*0.7,2.2,0,Math.PI*2);g.fill();}
      break;
    }
  }
  g.restore();
}

function makeArtTexture(art: Artwork): THREE.CanvasTexture {
  const w = 768, h = 960;
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d')!;
  const [a, b] = art.palette;
  const grad = g.createLinearGradient(0,0,0,h); grad.addColorStop(0,a); grad.addColorStop(1,shade(a,-0.5)); g.fillStyle=grad; g.fillRect(0,0,w,h);
  const glow = g.createRadialGradient(w*0.5,h*0.42,20,w*0.5,h*0.42,w*0.7); glow.addColorStop(0,hexToRgba(b,0.55)); glow.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=glow; g.fillRect(0,0,w,h);
  drawMotif(g, art, w, h);
  g.strokeStyle='rgba(255,255,255,0.05)'; g.lineWidth=2; g.strokeRect(24,24,w-48,h-48);
  const noise=g.getImageData(0,0,w,h); const n=noise.data;
  for(let i=0;i<n.length;i+=4){const v=(Math.random()-0.5)*22;n[i]=clampByte(n[i]+v);n[i+1]=clampByte(n[i+1]+v);n[i+2]=clampByte(n[i+2]+v);}
  g.putImageData(noise,0,0);
  const pH=86; g.fillStyle='rgba(0,0,0,0.42)'; g.fillRect(0,h-pH,w,pH);
  g.fillStyle='rgba(255,255,255,0.78)'; g.font="500 22px 'Noto Serif KR',serif"; g.fillText(art.titleKo.slice(0,20),36,h-pH+36);
  g.fillStyle='rgba(255,255,255,0.45)'; g.font="300 14px 'Noto Sans KR',sans-serif"; g.fillText('작가 · '+art.artistKo,36,h-pH+62);
  g.textAlign='right'; g.fillStyle='rgba(255,255,255,0.5)'; g.font="italic 18px 'Cormorant Garamond',serif"; g.fillText('№ '+String(art.id).padStart(2,'0'),w-36,h-pH+36); g.textAlign='left';
  const tex = new THREE.CanvasTexture(c); tex.colorSpace=THREE.SRGBColorSpace; tex.anisotropy=8; return tex;
}


/* =========================================================
   Gallery Component
   ========================================================= */
export default function Gallery() {
  const navigate = useNavigate();
  const mountRef = useRef<HTMLDivElement>(null);
  const hoverChipRef = useRef<HTMLDivElement>(null);

  // Mutable scroll/detail state shared with rAF loop (no re-render needed)
  const scrollTargetRef = useRef(0);
  const detailOpenRef = useRef(false);

  // React UI state
  const [activeIdx, setActiveIdx] = useState(0);
  const [detailArt, setDetailArt] = useState<Artwork | null>(null);
  const [ready, setReady] = useState(false);

  // Keep detailOpenRef in sync with detailArt
  useEffect(() => { detailOpenRef.current = detailArt !== null; }, [detailArt]);

  // Body overflow lock
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // 인트로 타이머 — 상품 유무와 무관하게 항상 1.5초 후 전환
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Fetch skus
  const { data: skuPage } = useQuery({
    queryKey: ['gallery-skus'],
    queryFn: async () => {
      const res = await getSkus(0, 50); // 필터 후 충분히 남도록 넉넉히 요청
      return res.data.data as PageResponse<Sku>;
    },
    staleTime: 1000 * 60 * 5,
  });

  // 한정판만
  const artworks = useMemo(() =>
    (skuPage?.content ?? [])
      .filter(sku => sku.isLimitedEdition)
      .map(skuToArtwork),
  [skuPage]);

  // Three.js scene — re-init when artworks load
  useEffect(() => {
    if (!mountRef.current || artworks.length === 0) return;
    const mount = mountRef.current;
    const W = () => window.innerWidth;
    const H = () => window.innerHeight;

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W(), H());
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    mount.appendChild(renderer.domElement);

    // ── Scene / Camera / Lights ──
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf6f4ef);
    scene.fog = new THREE.Fog(0xf6f4ef, 6, 22);

    const camera = new THREE.PerspectiveCamera(40, W() / H(), 0.1, 100);
    camera.position.set(0, 0, 9);

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const key = new THREE.DirectionalLight(0xffffff, 0.55);
    key.position.set(2, 4, 5); scene.add(key);
    const rim = new THREE.DirectionalLight(0xfff1d6, 0.15);
    rim.position.set(-4, -2, -3); scene.add(rim);

    // Floor
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(60,60), new THREE.MeshBasicMaterial({ color:0xf6f4ef, transparent:true, opacity:0.7 }));
    floor.rotation.x = -Math.PI/2; floor.position.y = -3.2; scene.add(floor);

    // ── Cards ──
    const cardsGroup = new THREE.Group(); scene.add(cardsGroup);
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';

    type CardUserData = {
      artwork: Artwork; baseX: number; baseY: number; baseZ: number;
      phase: number; speed: number; drift: number;
      front: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
      frame: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
    };

    const cards: Array<THREE.Group & { userData: CardUserData }> = [];
    const SPACING = 4.4;

    artworks.forEach((art, i) => {
      const procTex = makeArtTexture(art);
      const wCard = 1.6, hCard = 2.0;

      // MeshBasicMaterial — 조명 영향 없이 원본 색상 그대로 표시
      const mat = new THREE.MeshBasicMaterial({ map: procTex, transparent: true, opacity: 1 });
      const front = new THREE.Mesh(new THREE.PlaneGeometry(wCard, hCard), mat);

      // Swap in real image when loaded
      if (art.imageUrl) {
        loader.load(
          art.imageUrl,
          (loaded) => {
            loaded.colorSpace = THREE.SRGBColorSpace;
            loaded.anisotropy = 8;
            mat.map = loaded;
            mat.needsUpdate = true;
          },
          undefined,
          (err) => console.error('[Gallery] texture load failed:', art.imageUrl, err)
        );
      }

      const frameMat = new THREE.MeshBasicMaterial({ color: 0x111111, transparent: true, opacity: 0.10 });
      const frame = new THREE.Mesh(new THREE.PlaneGeometry(wCard*1.03, hCard*1.03), frameMat);
      frame.position.z = -0.005;

      const group = new THREE.Group() as THREE.Group & { userData: CardUserData };
      group.add(frame, front);
      group.position.set(0, -i * SPACING, 0);
      group.userData = { artwork:art, baseX:0, baseY:-i*SPACING, baseZ:0, phase:Math.random()*Math.PI*2, speed:0.4+Math.random()*0.4, drift:0.18+Math.random()*0.12, front, frame };
      cards.push(group);
      cardsGroup.add(group);
    });

    // ── Particles ──
    const N = 700;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(N * 3);
    const pSpeed = new Float32Array(N);
    for (let i=0;i<N;i++){pPos[i*3]=(Math.random()-0.5)*40;pPos[i*3+1]=(Math.random()-0.5)*16;pPos[i*3+2]=(Math.random()-0.5)*30-4;pSpeed[i]=0.02+Math.random()*0.05;}
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pc=document.createElement('canvas'); pc.width=64; pc.height=64; const pg=pc.getContext('2d')!;
    const pgr=pg.createRadialGradient(32,32,0,32,32,32); pgr.addColorStop(0,'rgba(20,20,20,0.55)'); pgr.addColorStop(0.5,'rgba(20,20,20,0.18)'); pgr.addColorStop(1,'rgba(20,20,20,0)');
    pg.fillStyle=pgr; pg.fillRect(0,0,64,64);
    const pTex=new THREE.CanvasTexture(pc); pTex.colorSpace=THREE.SRGBColorSpace;
    const points = new THREE.Points(pGeo, new THREE.PointsMaterial({ size:0.07, map:pTex, transparent:true, opacity:0.45, depthWrite:false, sizeAttenuation:true }));
    scene.add(points);

    // ── Interaction state ──
    const pointer = { x:0, y:0, tx:0, ty:0 };
    let scrollT = 0;
    const ndc = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let activeIdxLocal = 0;
    let hoverIdx = -1;
    let isDragging = false;
    let dragLast = { x:0, y:0 };

    const updateUI = (i: number) => {
      setActiveIdx(i);
    };
    updateUI(0);

    // ── Event handlers ──
    const onPointerMove = (e: PointerEvent) => {
      const nx=(e.clientX/W())*2-1, ny=-((e.clientY/H())*2-1);
      pointer.tx=nx; pointer.ty=ny; ndc.set(nx, ny);
      if (isDragging) {
        const dy=e.clientY-dragLast.y;
        dragLast.x=e.clientX; dragLast.y=e.clientY;
        scrollTargetRef.current = Math.max(0, Math.min(artworks.length-1, scrollTargetRef.current - dy*0.008));
      }
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(cards.map(c=>c.userData.front));
      const chip = hoverChipRef.current;
      if (hits.length > 0) {
        const idx = cards.findIndex(c=>c.userData.front===hits[0].object);
        hoverIdx=idx; mount.style.cursor='zoom-in';
        if (chip) {
          chip.style.display='block'; chip.style.left=e.clientX+'px'; chip.style.top=e.clientY+'px';
          const t=chip.querySelector<HTMLElement>('.g-chip-title'); const a=chip.querySelector<HTMLElement>('.g-chip-artist');
          if(t) t.textContent=cards[idx].userData.artwork.titleKo;
          if(a) a.textContent=cards[idx].userData.artwork.artistKo;
        }
      } else {
        hoverIdx=-1; mount.style.cursor=isDragging?'grabbing':'grab';
        if(chip) chip.style.display='none';
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      isDragging=true; dragLast.x=e.clientX; dragLast.y=e.clientY; mount.style.cursor='grabbing';
    };
    const onPointerUp = (e: PointerEvent) => {
      const wasDragging=isDragging; isDragging=false; mount.style.cursor='grab';
      if (wasDragging) {
        const moved=Math.abs(e.clientX-dragLast.x)+Math.abs(e.clientY-dragLast.y);
        if (moved<4 && hoverIdx>=0 && !detailOpenRef.current) setDetailArt(artworks[hoverIdx]);
      }
    };
    const onClick = () => {
      if (hoverIdx>=0 && !detailOpenRef.current) setDetailArt(artworks[hoverIdx]);
    };

    let wheelLock=0;
    const onWheel = (e: WheelEvent) => {
      if (detailOpenRef.current) return;
      const now=performance.now(); if(now<wheelLock) return;
      const delta=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY; if(Math.abs(delta)<6) return;
      if(delta>0) scrollTargetRef.current=Math.min(artworks.length-1, Math.round(scrollTargetRef.current)+1);
      else scrollTargetRef.current=Math.max(0, Math.round(scrollTargetRef.current)-1);
      wheelLock=now+520;
    };

    let tStartX=0, tStartY=0, tTracking=false;
    const onTouchStart=(e:TouchEvent)=>{ if(detailOpenRef.current||e.touches.length!==1) return; tStartX=e.touches[0].clientX; tStartY=e.touches[0].clientY; tTracking=true; };
    const onTouchEnd=(e:TouchEvent)=>{ if(!tTracking) return; tTracking=false; const t=e.changedTouches[0]; if(!t) return; const dx=t.clientX-tStartX,dy=t.clientY-tStartY;
      if(Math.abs(dy)>50&&Math.abs(dy)>Math.abs(dx)){if(dy<0)scrollTargetRef.current=Math.min(artworks.length-1,Math.round(scrollTargetRef.current)+1);else scrollTargetRef.current=Math.max(0,Math.round(scrollTargetRef.current)-1);}
      else if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)){if(dx<0)scrollTargetRef.current=Math.min(artworks.length-1,Math.round(scrollTargetRef.current)+1);else scrollTargetRef.current=Math.max(0,Math.round(scrollTargetRef.current)-1);}
    };

    const onKeyDown=(e:KeyboardEvent)=>{
      if(e.key==='Escape'&&detailOpenRef.current){setDetailArt(null);}
      if(e.key==='ArrowRight'||e.key==='ArrowDown') scrollTargetRef.current=Math.min(artworks.length-1,Math.round(scrollTargetRef.current)+1);
      if(e.key==='ArrowLeft'||e.key==='ArrowUp') scrollTargetRef.current=Math.max(0,Math.round(scrollTargetRef.current)-1);
    };
    const onResize=()=>{ renderer.setSize(W(),H()); camera.aspect=W()/H(); camera.updateProjectionMatrix(); };
    const onGyro=(e:DeviceOrientationEvent)=>{ if(e.gamma==null||e.beta==null) return; pointer.tx=Math.max(-1,Math.min(1,e.gamma/30)); pointer.ty=Math.max(-1,Math.min(1,(e.beta-45)/45)); };

    mount.addEventListener('pointermove', onPointerMove);
    mount.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    mount.addEventListener('click', onClick);
    window.addEventListener('wheel', onWheel, { passive:true });
    mount.addEventListener('touchstart', onTouchStart, { passive:true });
    mount.addEventListener('touchend', onTouchEnd, { passive:true });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    window.addEventListener('deviceorientation', onGyro);

    // ── Animation Loop ──
    let rafId=0;
    const tick=(now:number)=>{
      const time=now/1000;
      pointer.x+=(pointer.tx-pointer.x)*0.06; pointer.y+=(pointer.ty-pointer.y)*0.06;
      scrollT+=(scrollTargetRef.current-scrollT)*0.08;
      camera.position.x=pointer.x*0.7; camera.position.y=pointer.y*0.35+0.1; camera.lookAt(0,0,-2);
      cardsGroup.position.y=scrollT*SPACING+pointer.y*0.1; cardsGroup.position.x=pointer.x*0.2;
      cardsGroup.rotation.y=pointer.x*0.04; cardsGroup.rotation.x=-pointer.y*0.025;

      cards.forEach((c,i)=>{
        const ud=c.userData; const d=i-scrollT; const ad=Math.abs(d);
        const fb=Math.max(0,1-ad);
        c.position.x=ud.baseX+Math.cos(time*ud.speed*0.7+ud.phase)*ud.drift*0.15*fb;
        c.position.y=ud.baseY+Math.sin(time*ud.speed+ud.phase)*ud.drift*0.25*fb;
        c.position.z=ud.baseZ-Math.pow(ad,1.2)*0.9+((i===hoverIdx&&!detailOpenRef.current)?0.45:0);
        c.rotation.x=-d*0.10+Math.sin(time*0.3+ud.phase)*0.015*fb;
        c.rotation.z=Math.sin(time*0.25+ud.phase)*0.012*fb;
        c.rotation.y=d*0.03;
        const s=1-Math.min(0.25,ad*0.07); c.scale.set(s,s,1);
        const fade=Math.max(0,1-ad*0.55);
        ud.front.material.opacity=fade;
        ud.frame.material.opacity=fade*((i===hoverIdx)?0.32:0.12);
      });

      const snap=Math.max(0,Math.min(artworks.length-1,Math.round(scrollT)));
      if(snap!==activeIdxLocal){activeIdxLocal=snap; updateUI(snap);}

      const pos=pGeo.attributes.position.array as Float32Array;
      for(let i=0;i<N;i++){pos[i*3+1]+=pSpeed[i]*0.01;pos[i*3]+=Math.sin(time*0.2+i)*0.0008;if(pos[i*3+1]>8)pos[i*3+1]=-8;}
      pGeo.attributes.position.needsUpdate=true;

      renderer.render(scene, camera);
      rafId=requestAnimationFrame(tick);
    };
    rafId=requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      mount.removeEventListener('pointermove', onPointerMove);
      mount.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      mount.removeEventListener('click', onClick);
      window.removeEventListener('wheel', onWheel);
      mount.removeEventListener('touchstart', onTouchStart);
      mount.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('deviceorientation', onGyro);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [artworks]); // eslint-disable-line react-hooks/exhaustive-deps

  const art = artworks[activeIdx];

  // 리미티드 상품이 없을 때 빈 상태 메시지
  const isEmpty = ready && artworks.length === 0;

  return (
    <div className="gallery-page" data-hero="light">

      {/* Intro Splash */}
      <div className={`gallery-intro${ready ? ' hidden' : ''}`}>
        <div className="g-wrap">
          <div className="g-word"><span>K</span><span>O</span><span>A</span><span>L</span><span>A</span></div>
          <div className="g-sub">작 품 갤 러 리</div>
          <div className="g-rule" />
        </div>
      </div>

      {/* Three.js Scene */}
      <div ref={mountRef} className={`gallery-scene${ready ? ' gallery-ready' : ''}`} style={{ opacity: 0 }} />

      {/* Grain + Vignette */}
      <div className="gallery-grain" />
      <div className="gallery-vignette" />

      {/* 리미티드 상품 없을 때 */}
      {isEmpty && (
        <div style={{ position:'fixed', inset:0, zIndex:90, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
          <p style={{ fontFamily:'var(--serif,serif)', fontSize:'clamp(18px,2vw,28px)', color:'rgba(10,10,10,0.4)', letterSpacing:'0.08em' }}>
            준비 중인 갤러리입니다
          </p>
          <p style={{ fontFamily:'var(--sans,sans-serif)', fontSize:'12px', color:'rgba(10,10,10,0.25)', letterSpacing:'0.3em', marginTop:'12px' }}>
            COMING SOON
          </p>
        </div>
      )}

      {/* ── Side Index ── */}
      <div className={`gallery-sideindex${ready ? ' gallery-ready' : ''}`}>
        {artworks.map((a, i) => (
          <div
            key={a.skuCode}
            className={`g-row${i === activeIdx ? ' on' : ''}`}
            onClick={() => { scrollTargetRef.current = i; }}
          >
            <span className="g-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="g-dot" />
            <span>{a.titleKo.split(',')[0].slice(0, 8)}</span>
          </div>
        ))}
      </div>

      {/* ── Right Meta ── */}
      <div className={`gallery-rightmeta${ready ? ' gallery-ready' : ''}`}>
        SEOUL · GANGNAM-GU · 35.7°N 127.0°E
      </div>

      {/* ── Now Viewing ── */}
      <div className={`gallery-nowviewing${ready ? ' gallery-ready' : ''}`}>
        {art && (
          <>
            <div className="g-meta">
              <span className="g-idx">{String(activeIdx + 1).padStart(2, '0')}</span>
              <span className="g-divider" />
              <span>작품 {String(activeIdx + 1).padStart(2, '0')} / {String(artworks.length).padStart(2, '0')}</span>
              <span>{art.medium}</span>
            </div>
            <h1 className="g-title">{art.titleKo}</h1>
            <div className="g-artist">
              <span className="g-artist-label">작가</span>
              <span className="g-artist-name">{art.artistKo}</span>
            </div>
          </>
        )}
      </div>

      {/* ── Controls ── */}
      <div className={`gallery-controls${ready ? ' gallery-ready' : ''}`}>
        <span className="g-hint"><span className="g-key">⌖</span> 마우스 · 시점 이동</span>
        <span className="g-sep" />
        <span className="g-hint"><span className="g-key">⌄</span> 스크롤 · 작품 이동</span>
        <span className="g-sep" />
        <button className="g-detailbtn" onClick={() => art && setDetailArt(art)}>
          자세히 보기
          <span className="g-arrow" />
        </button>
      </div>

      {/* ── Scroll Indicator ── */}
      <div className={`gallery-scrollind${ready ? ' gallery-ready' : ''}`}>
        <span>SCROLL</span>
        <div className="g-line" />
      </div>

      {/* ── Mobile hint ── */}
      <div className={`gallery-mobile-hint${ready ? ' gallery-ready' : ''}`}>
        화면을 드래그해 갤러리를 둘러보세요
      </div>

      {/* ── Hover Chip ── */}
      <div ref={hoverChipRef} className="gallery-hoverchip" style={{ display: 'none' }}>
        <span className="g-chip-title" />
        <span className="g-chip-artist" />
      </div>

      {/* ── Detail Overlay ── */}
      {detailArt && (
        <div className="gallery-detail on" onClick={(e) => { if (e.target === e.currentTarget) setDetailArt(null); }}>
          <button className="g-back" onClick={() => setDetailArt(null)}>← 갤러리로</button>
          <div className="g-esc"><span className="g-key">ESC</span> <span>닫기</span></div>

          <div className="g-panel">
            <div className="g-left">
              <div className="g-frame" />
              {detailArt.imageUrl
                ? <img src={detailArt.imageUrl} alt={detailArt.titleKo} />
                : <canvas width={800} height={1000} ref={(el) => {
                    if (!el) return;
                    const ctx = el.getContext('2d')!;
                    const w = el.width, h = el.height;
                    const [a] = detailArt.palette;
                    const gr = ctx.createLinearGradient(0,0,0,h);
                    gr.addColorStop(0,shade(a,-0.15)); gr.addColorStop(1,shade(a,-0.6));
                    ctx.fillStyle=gr; ctx.fillRect(0,0,w,h);
                    drawMotif(ctx, detailArt, w, h);
                  }}
                />
              }
            </div>

            <div className="g-right">
              <div className="g-eyebrow">
                <span className="g-num-lg">{String(detailArt.id).padStart(2, '0')}</span>
                <span className="g-bar" />
                <span>{detailArt.kind}</span>
              </div>
              <h2>{detailArt.titleKo}</h2>
              <div className="g-h-en">{detailArt.artistKo}</div>
              <dl className="g-specs">
                <dt>작가</dt><dd>{detailArt.artistKo}</dd>
                <dt>매체</dt><dd>{detailArt.medium}</dd>
                {detailArt.price > 0 && <><dt>가격</dt><dd>{detailArt.price.toLocaleString()}원</dd></>}
              </dl>
              <p className="g-desc">{detailArt.desc || '작품 설명이 준비 중입니다.'}</p>
              <div className="g-actions">
                <button className="g-detailbtn" onClick={() => navigate(`/product/${detailArt.skuCode}`)}>
                  상품 보기
                  <span className="g-arrow" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
