'use strict';
const $ = s => document.querySelector(s);
const frame = $('#tour');
const welcome = $('#welcome');
let scenes = [], selected = 6, lastFocus = null, idleAt = Date.now(), keepAgenda = false;
const idleMs = 15000;
const toast = message => { $('#toast').textContent = message; $('#toast').hidden = false; clearTimeout(toast.timer); toast.timer = setTimeout(() => $('#toast').hidden = true, 5000); };
const hideWelcome = () => { welcome.classList.add('hidden'); welcome.inert = true; };
const showWelcome = () => { welcome.inert = false; welcome.classList.remove('hidden'); };
$('#hide-welcome').onclick = hideWelcome;
$('#explore').onclick = () => { hideWelcome(); frame.focus(); };
$('#show-welcome').onclick = showWelcome;
$('.brand').onclick = event => { event.preventDefault(); showWelcome(); };
function closeDialog(dialog) { dialog.close(); if(lastFocus?.isConnected) lastFocus.focus(); }
function openDialog(id) {
 document.querySelectorAll('dialog[open]').forEach(d => d.close());
 lastFocus = document.activeElement;
 const d = document.getElementById(id);
 if(id === 'agenda') {
  if(!$('#calendar').src) $('#calendar').src = $('#calendar').dataset.src;
  idleAt = Date.now(); keepAgenda = false;
  $('#keep-agenda').setAttribute('aria-pressed','false');
  $('#keep-agenda').textContent = 'Manter aberta';
 }
 d.showModal();
 d.querySelector('[data-close]').focus();
}
document.querySelectorAll('[data-open]').forEach(b => b.onclick = () => openDialog(b.dataset.open));
document.querySelectorAll('[data-close]').forEach(b => b.onclick = () => closeDialog(b.closest('dialog')));
document.querySelectorAll('dialog').forEach(d => {
 d.addEventListener('click', e => { if(e.target === d) { const r=d.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(d); } });
 d.addEventListener('cancel', () => { if(lastFocus?.isConnected) lastFocus.focus(); });
});
for(const type of ['pointermove','pointerdown','keydown','wheel','touchstart']) document.addEventListener(type, () => idleAt=Date.now(), {passive:true});
// Google Calendar is cross-origin. Do not read its document or pretend to detect its internal events.
// Pause while its frame has keyboard focus or the pointer is inside it; resume upon returning to the skin.
let overCalendar = false;
$('#calendar').addEventListener('pointerenter', () => {overCalendar=true; idleAt=Date.now();});
$('#calendar').addEventListener('pointerleave', () => {overCalendar=false; idleAt=Date.now();});
$('#keep-agenda').onclick = () => {keepAgenda=!keepAgenda;idleAt=Date.now();$('#keep-agenda').setAttribute('aria-pressed',String(keepAgenda));$('#keep-agenda').textContent=keepAgenda?'Fechamento automático pausado':'Manter aberta';};
setInterval(() => {
 if(!$('#agenda').open) return;
 const engaged = document.activeElement === $('#calendar') || overCalendar || keepAgenda;
 if(engaged) {idleAt=Date.now();$('#idle-note').textContent='Fechamento pausado durante o uso da agenda.';return;}
 const left=Math.max(0,Math.ceil((idleMs-(Date.now()-idleAt))/1000));
 $('#idle-note').textContent=`Sem atividade: fechamento em ${left} s.`;
 if(!left) {closeDialog($('#agenda'));toast('Agenda recolhida. Você pode abri-la novamente quando quiser.');}
},250);
function updateScene(index) {
 selected=index;
 $('#scene-name').textContent=scenes[index]?.name || 'Conheça o estúdio';
 document.querySelectorAll('.scene-card').forEach((b,i)=>b.setAttribute('aria-current',String(i===index)));
}
fetch('scenes.json').then(r=>{if(!r.ok)throw Error('scenes');return r.json();}).then(data => {
 scenes=data;
 data.forEach((s,i) => {
  const b=document.createElement('button'); b.className='scene-card'; b.setAttribute('aria-current',String(i===selected));
  const img=document.createElement('img'); img.src=s.thumbnail; img.alt=''; img.loading='lazy';
  const label=document.createElement('span');label.textContent=String(i+1).padStart(2,'0')+' · '+s.name;
  b.append(img,label);b.onclick=()=>{
   try {const tour=frame.contentWindow.tour;if(!tour?.setMediaByIndex)throw Error('not-ready');const result=tour.setMediaByIndex(i);if(result===undefined)throw Error('not-ready');updateScene(i);closeDialog($('#scenes'));hideWelcome();}
   catch {toast('O passeio está carregando. Tente novamente em alguns instantes.');}
  };$('#scene-grid').append(b);
 });updateScene(selected);
}).catch(()=>toast('Não foi possível carregar a lista de cenários. Recarregue o passeio.'));
function connectTour() {
 try {
  const doc=frame.contentDocument;
  if(!doc?.body)return;
  let dragTimer;
  doc.addEventListener('pointerdown',()=>{document.body.classList.add('tour-dragging');});
  const restore=()=>{clearTimeout(dragTimer);dragTimer=setTimeout(()=>document.body.classList.remove('tour-dragging'),420);};
  doc.addEventListener('pointerup',restore);doc.addEventListener('pointercancel',restore);
  doc.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('dialog[open]').forEach(closeDialog);});
 } catch { /* The tour is expected to be deployed on the same origin. */ }
}
frame.addEventListener('load',connectTour);
// Synchronize the label after native hotspot navigation using the exported 3DVista playlist.
setInterval(()=>{try{const root=frame.contentWindow.tour?._getRootPlayer?.();const i=root?.mainPlayList?.get('selectedIndex');if(Number.isInteger(i)&&i!==selected&&scenes[i])updateScene(i);}catch{}},700);
$('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{toast('Use a opção de tela cheia do seu navegador.');}};
document.addEventListener('fullscreenchange',()=>$('#fullscreen').setAttribute('aria-label',document.fullscreenElement?'Sair da tela cheia':'Tela cheia'));
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
document.body.classList.toggle('effects-off',reduce.matches);
for(let i=0;i<34;i++){const p=document.createElement('i');p.className='snow';p.style.left=((i*29.41)%100)+'%';p.style.setProperty('--duration',(14+i%11)+'s');p.style.setProperty('--delay',(-i*.91)+'s');p.style.setProperty('--opacity',(.15+(i%4)*.13));$('#magic').append(p);}
const santa=document.createElement('img');santa.src='assets/papai-noel.apng';santa.alt='';santa.className='santa';$('#magic').append(santa);
// Audio is enabled only when a valid, supplied recording is configured in audio.json.
let audio;
fetch('audio.json').then(r=>r.json()).then(config=>{if(config.src){audio=new Audio(config.src);audio.loop=true;audio.volume=config.volume??.22;}}).catch(()=>{});
$('#sound').onclick=async()=>{if(!audio){toast('A trilha de Natal está sendo preparada.');return;}try{if(audio.paused){await audio.play();$('#sound').setAttribute('aria-label','Pausar trilha sonora');$('#sound').setAttribute('aria-pressed','true');}else{audio.pause();$('#sound').setAttribute('aria-label','Ativar trilha sonora');$('#sound').setAttribute('aria-pressed','false');}}catch{toast('Toque novamente para ativar a música.');}};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&audio&&!audio.paused){audio.pause();$('#sound').setAttribute('aria-pressed','false');$('#sound').setAttribute('aria-label','Ativar trilha sonora');}});
