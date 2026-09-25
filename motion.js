(() => {
  'use strict';
  const canvas = document.getElementById('signal-field');
  const context = canvas?.getContext('2d');
  const button = document.getElementById('motion-toggle');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(pointer: fine)');
  const art = document.querySelector('.system-art');
  let enabled = !reduce.matches, width = 0, height = 0, frame = 0;
  let pointer = {x: -1000, y: -1000}, position = {x: -1000, y: -1000};
  const cards = document.querySelectorAll('.project, .featured');
  function size() {
    width = innerWidth; height = innerHeight;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw();
  }
  function draw() {
    context.clearRect(0, 0, width, height);
    if (!enabled || !fine.matches || reduce.matches) return;
    const spacing = 48, radius = 190;
    context.lineWidth = .65;
    for (let y = 24; y < height; y += spacing) {
      context.beginPath();
      for (let x = 24; x < width; x += spacing) {
        const dx = x-position.x, dy = y-position.y;
        const distance = Math.hypot(dx,dy), weight = Math.max(0,1-distance/radius);
        const shift = Math.sin(weight*Math.PI)*15;
        const px = x+(dx/(distance||1))*shift, py = y+(dy/(distance||1))*shift;
        if (x === 24) context.moveTo(px,py); else context.lineTo(px,py);
      }
      context.strokeStyle = 'rgba(49,105,86,0.075)'; context.stroke();
    }
    for (let x=24;x<width;x+=spacing) for(let y=24;y<height;y+=spacing){
      const dx=x-position.x,dy=y-position.y,d=Math.hypot(dx,dy),w=Math.max(0,1-d/radius),s=Math.sin(w*Math.PI)*15;
      context.beginPath();context.arc(x+dx/(d||1)*s,y+dy/(d||1)*s,1+w*1.6,0,Math.PI*2);
      context.fillStyle=`rgba(43,113,86,${.09+w*.34})`;context.fill();
    }
  }
  function tick(){
    frame=0;
    if(!enabled||reduce.matches||!fine.matches||document.hidden)return;
    position.x+=(pointer.x-position.x)*.14;position.y+=(pointer.y-position.y)*.14;
    draw();
    if(Math.abs(pointer.x-position.x)+Math.abs(pointer.y-position.y)>.3) frame=requestAnimationFrame(tick);
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(tick)}
  function update(){
    cancelAnimationFrame(frame);frame=0;
    const active=enabled&&!reduce.matches;
    document.body.classList.toggle('motion-off',!active);
    button.hidden=false;button.textContent=active?'Motion on':'Motion off';button.setAttribute('aria-pressed',String(!active));
    art.style.removeProperty('--art-x');art.style.removeProperty('--art-y');draw();
  }
  if(!context||!button)return;
  button.addEventListener('click',()=>{enabled=!enabled;update()});
  reduce.addEventListener('change',()=>{enabled=!reduce.matches;update()});
  fine.addEventListener('change',update);
  document.addEventListener('pointermove',event=>{
    if(!enabled||reduce.matches||!fine.matches)return;
    pointer={x:event.clientX,y:event.clientY};
    if(position.x < -500) position={...pointer};
    document.body.style.setProperty('--mouse-x',`${pointer.x}px`);document.body.style.setProperty('--mouse-y',`${pointer.y}px`);
    art.style.setProperty('--art-x',`${(pointer.x/width-.5)*13}px`);art.style.setProperty('--art-y',`${(pointer.y/height-.5)*9}px`);
    schedule();
  },{passive:true});
  cards.forEach(card=>card.addEventListener('pointermove',event=>{
    if(!enabled||reduce.matches||!fine.matches)return;
    const rect=card.getBoundingClientRect();card.style.setProperty('--light-x',`${event.clientX-rect.left}px`);card.style.setProperty('--light-y',`${event.clientY-rect.top}px`);
  },{passive:true}));
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else schedule()});
  document.documentElement.addEventListener('pointerleave',()=>{pointer={x:-1000,y:-1000};position={...pointer};draw()});
  window.addEventListener('resize',size,{passive:true});
  size();update();
})();
