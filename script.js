
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries)=>{
  entries.forEach((entry)=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});
reveals.forEach(el=>observer.observe(el));

const glow=document.querySelector('.cursor-glow');
if(glow && matchMedia('(pointer:fine)').matches){
  addEventListener('mousemove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';});
}

document.querySelectorAll('a[href^="#"]').forEach(link=>{
  link.addEventListener('click',e=>{
    const target=document.querySelector(link.getAttribute('href'));
    if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'});}
  });
});

// Lightweight animated network background
const canvas=document.getElementById('network-bg');
const ctx=canvas?.getContext('2d');
let points=[];
function resize(){
  if(!canvas||!ctx) return;
  const dpr=Math.min(devicePixelRatio||1,2);
  canvas.width=innerWidth*dpr; canvas.height=innerHeight*dpr;
  canvas.style.width=innerWidth+'px'; canvas.style.height=innerHeight+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const count=Math.min(70,Math.max(28,Math.floor(innerWidth/24)));
  points=Array.from({length:count},()=>({
    x:Math.random()*innerWidth,y:Math.random()*innerHeight,
    vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18
  }));
}
function draw(){
  if(!ctx) return;
  ctx.clearRect(0,0,innerWidth,innerHeight);
  ctx.fillStyle='rgba(112,240,189,.32)';
  ctx.strokeStyle='rgba(112,240,189,.08)';
  for(let i=0;i<points.length;i++){
    const a=points[i]; a.x+=a.vx; a.y+=a.vy;
    if(a.x<0||a.x>innerWidth)a.vx*=-1;
    if(a.y<0||a.y>innerHeight)a.vy*=-1;
    ctx.beginPath();ctx.arc(a.x,a.y,1.3,0,Math.PI*2);ctx.fill();
    for(let j=i+1;j<points.length;j++){
      const b=points[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);
      if(d<115){ctx.globalAlpha=1-d/115;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.globalAlpha=1;}
    }
  }
  requestAnimationFrame(draw);
}
if(canvas && !matchMedia('(prefers-reduced-motion: reduce)').matches){resize();draw();addEventListener('resize',resize);}
