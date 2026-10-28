'use strict';
const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const SITE_URL='https://amulya-vedant-lotus-invitation.thehappyprintclub.chatgpt.site/';
const WEDDING_TIME=Date.parse('2026-11-26T19:30:00+05:30');
let toastTimer;
function notify(message){const el=$('.toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3500);}
function goTo(id){const el=document.getElementById(id);if(el){el.scrollIntoView({behavior:reduceMotion.matches?'instant':'smooth',block:'start'});history.replaceState(null,'','#'+id);}}

// Approved paintings provide the frames; words and interactions remain native layers.
if('IntersectionObserver' in window){
  document.body.classList.add('motion-enabled');
  const revealObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}}},{threshold:.12,rootMargin:'0px 0px -12px 0px'});
  $$('.reveal').forEach(el=>revealObserver.observe(el));
  const sceneObserver=new IntersectionObserver(entries=>{for(const entry of entries)entry.target.classList.toggle('is-active',entry.isIntersecting);},{threshold:.05});
  $$('.scene').forEach(el=>sceneObserver.observe(el));
}
// One viewport-fixed petal stream, independent of opening state and section scrolling.
function buildPetalStream(){const layer=$('#live-petals');layer.replaceChildren();if(reduceMotion.matches)return;const paths=[9,24,39,57,74,91,48];paths.forEach((left,i)=>{const flight=document.createElement('span');flight.className='petal-flight';flight.style.setProperty('--petal-left',left+'%');flight.style.setProperty('--petal-duration',(12+i%4*1.7)+'s');flight.style.setProperty('--petal-delay',(-i*2.1-.5)+'s');flight.style.setProperty('--petal-drift',((i%2?1:-1)*(16+i*2))+'px');flight.style.setProperty('--petal-size',(i%3+9)+'px');flight.innerHTML=`<svg class="live-petal-shape" width="24" height="36" viewBox="0 0 24 36" focusable="false"><defs><linearGradient id="petal-shade-${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4cfbe"/><stop offset=".55" stop-color="#d58a8b"/><stop offset="1" stop-color="#bd666f"/></linearGradient></defs><path d="M20 2C24 14 18 31 3 34C-3 20 2 7 20 2Z" fill="url(#petal-shade-${i})" stroke="#b36b66" stroke-width=".5"/><path d="M18 6C13 16 8 25 4 31" fill="none" stroke="#ffe6d5" stroke-width=".7" opacity=".55"/></svg>`;layer.appendChild(flight);});}
buildPetalStream();reduceMotion.addEventListener('change',buildPetalStream);

// Original, locally synthesised instrumental ambience. No external tracks or audio requests.
let audioContext, masterGain, musicGain, audioTimer, musicOn=false;
const musicButton=$('#music-toggle');
function initAudio(){if(!audioContext){const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return false;audioContext=new Audio();masterGain=audioContext.createGain();masterGain.gain.value=.24;masterGain.connect(audioContext.destination);musicGain=audioContext.createGain();musicGain.gain.value=0;musicGain.connect(masterGain);}if(audioContext.state==='suspended')audioContext.resume().catch(()=>{});return true;}
function note(frequency,at,duration,gainValue,type='sine',destination=musicGain){const osc=audioContext.createOscillator(),amp=audioContext.createGain();osc.type=type;osc.frequency.value=frequency;amp.gain.setValueAtTime(.0001,at);amp.gain.exponentialRampToValueAtTime(gainValue,at+.04);amp.gain.exponentialRampToValueAtTime(.0001,at+duration);osc.connect(amp).connect(destination);osc.start(at);osc.stop(at+duration+.05);osc.onended=()=>{osc.disconnect();amp.disconnect();};}
function softBell(){if(!initAudio())return;const at=audioContext.currentTime;[523.25,784.88,1046.5,1569.75].forEach((freq,i)=>note(freq,at+i*.018,2.2+i*.12,.23/(i+1),'sine',masterGain));}
let phraseIndex=0;
function instrumentalPhrase(){if(!musicOn||document.hidden)return;const at=audioContext.currentTime+.06;[130.81,196.0,261.63].forEach((freq,i)=>note(freq,at,8,.07/(i+1)));const melodies=[[392,440,523.25,587.33],[523.25,440,392,349.23],[392,523.25,587.33,523.25],[440,392,349.23,392]];melodies[phraseIndex++%4].forEach((freq,i)=>{note(freq,at+i*1.65+.6,2.6,.13);note(freq*2,at+i*1.65+.6,1.5,.025);});}
function setMusic(on,{announce=true}={}){if(on&&!initAudio()){notify('Audio is not supported by this browser.');return;}musicOn=on;musicButton.setAttribute('aria-pressed',String(on));musicButton.setAttribute('aria-label',on?'Pause instrumental music':'Play instrumental music');musicButton.classList.toggle('music-playing',on);clearInterval(audioTimer);if(audioContext){musicGain.gain.cancelScheduledValues(audioContext.currentTime);musicGain.gain.setTargetAtTime(on?.72:0,audioContext.currentTime,.3);}if(on){instrumentalPhrase();audioTimer=setInterval(instrumentalPhrase,8000);}if(announce)notify(on?'Music on':'Music paused');}
musicButton.addEventListener('click',()=>setMusic(!musicOn));
document.addEventListener('visibilitychange',()=>{if(!audioContext)return;if(document.hidden){musicGain.gain.setTargetAtTime(0,audioContext.currentTime,.15);}else if(musicOn){musicGain.gain.setTargetAtTime(.72,audioContext.currentTime,.4);instrumentalPhrase();}});

let opened=false;
const invitation=$('#invitation');
// The entrance is removed at full light, never after the light has started fading.
async function openEnvelope({silent=false}={}){
  if(opened)return;
  opened=true;
  const opening=$('#opening'),light=$('.opening-radiance'),controls=$('.floating-controls');
  $('#open-envelope').disabled=true;$$('[data-open]').forEach(b=>b.disabled=true);
  if(!silent)softBell();
  const hero=$('#welcome .screen-art');hero.loading='eager';
  const artReady=hero.decode?hero.decode().catch(()=>{}):Promise.resolve();
  function handover(){
    opening.hidden=true;opening.inert=true;
    invitation.hidden=false;invitation.inert=false;invitation.scrollTop=0;
    document.body.classList.remove('invitation-closed');
    history.replaceState(null,'','#welcome');showEvent(0);
  }
  if(reduceMotion.matches||silent||!light.animate){handover();controls.classList.add('visible');invitation.focus({preventScroll:true});if(!silent)setMusic(true,{announce:false});return;}
  document.body.classList.add('opening-is-active');
  let animation;
  try{
    animation=light.animate([{opacity:0,transform:'scale(.4)'},{opacity:1,transform:'scale(1)'}],{duration:520,easing:'ease-in-out',fill:'forwards'});
    await animation.finished;
    light.style.opacity='1';light.style.transform='scale(1)';animation.cancel();
    await artReady;
    handover();
    // Paint the invitation beneath an opaque light before revealing any of it.
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    animation=light.animate([{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(1.06)'}],{duration:650,easing:'ease-out',fill:'forwards'});
    await animation.finished;
  }catch{
    // A cancelled/unsupported animation still opens the invitation safely.
  }finally{
    light.style.opacity='0';if(animation)animation.cancel();
    if(!opening.hidden)handover();
    document.body.classList.remove('opening-is-active');
    controls.classList.add('visible');invitation.focus({preventScroll:true});
    if(!silent)setMusic(true,{announce:false});
  }
}
$('#open-envelope').addEventListener('click',()=>openEnvelope());$$('[data-open]').forEach(b=>b.addEventListener('click',()=>openEnvelope()));
$('.skip-link').addEventListener('click',e=>{e.preventDefault();openEnvelope({silent:true});});
const nav=$('.navigation-dialog');$('#navigation-toggle').addEventListener('click',()=>nav.showModal());$('.close-nav').addEventListener('click',()=>nav.close());nav.addEventListener('click',e=>{if(e.target===nav&&e.clientX<nav.getBoundingClientRect().left)nav.close();});
$$('.navigation-dialog nav a').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();nav.close();goTo(a.hash.slice(1));}));
$$('a[href^="#"]').filter(a=>!a.closest('dialog')&&!a.classList.contains('skip-link')).forEach(a=>a.addEventListener('click',e=>{e.preventDefault();goTo(a.hash.slice(1));}));

// Countdown uses a fixed, timezone-qualified IST wedding moment for every visitor.
function updateCountdown(){let remaining=Math.max(0,WEDDING_TIME-Date.now());const values=[Math.floor(remaining/86400000),Math.floor(remaining/3600000)%24,Math.floor(remaining/60000)%60,Math.floor(remaining/1000)%60];['days','hours','minutes','seconds'].forEach((id,index)=>{const el=$('#'+id),value=String(values[index]).padStart(2,'0');if(el.textContent!==value){el.textContent=value;if(!reduceMotion.matches){el.classList.remove('tick');void el.offsetWidth;el.classList.add('tick');}}});if(remaining===0)$('.countdown-note').hidden=false;}
updateCountdown();setInterval(updateCountdown,1000);

// Three-tab ceremony carousel with touch, pointer, keyboard and button navigation.
const eventTabs=$$('.event-tabs button'),eventCards=$$('.event-card'),eventDots=$$('.event-dots button'),track=$('.events-track');let eventIndex=0;
function showEvent(index,{focus=false}={}){eventIndex=(index+3)%3;eventTabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===eventIndex));tab.tabIndex=i===eventIndex?0:-1;});eventCards.forEach((card,i)=>card.inert=i!==eventIndex);eventDots.forEach((dot,i)=>{dot.classList.toggle('active',i===eventIndex);dot.setAttribute('aria-pressed',String(i===eventIndex));});const step=eventCards[0].getBoundingClientRect().width+20;track.style.transform=`translateX(${-eventIndex*step}px)`;$('.event-count').textContent=`${eventIndex+1} of 3`;if(focus)eventTabs[eventIndex].focus({preventScroll:true});}
eventTabs.forEach((tab,i)=>{tab.addEventListener('click',()=>showEvent(i));tab.addEventListener('keydown',e=>{const keys=['ArrowRight','ArrowLeft','Home','End'];if(!keys.includes(e.key))return;e.preventDefault();showEvent(e.key==='Home'?0:e.key==='End'?2:eventIndex+(e.key==='ArrowRight'?1:-1),{focus:true});});});eventDots.forEach((dot,i)=>dot.addEventListener('click',()=>showEvent(i)));$('.event-prev').addEventListener('click',()=>showEvent(eventIndex-1));$('.event-next').addEventListener('click',()=>showEvent(eventIndex+1));
function swipe(el,previous,next){let start=null;function move(x,y){if(!start)return;const dx=x-start.x,dy=y-start.y;if(Math.abs(dy)>22&&Math.abs(dy)>Math.abs(dx)){start=null;return;}if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.3){start=null;dx<0?next():previous();}}el.addEventListener('dragstart',e=>e.preventDefault());el.addEventListener('pointerdown',e=>{if((e.pointerType==='mouse'&&e.button!==0)||e.target.closest('button,a'))return;start={x:e.clientX,y:e.clientY,id:e.pointerId};try{el.setPointerCapture(e.pointerId);}catch{}});window.addEventListener('pointermove',e=>{if(start&&e.pointerId===start.id)move(e.clientX,e.clientY);},{passive:true});window.addEventListener('pointerup',e=>{if(start&&e.pointerId===start.id){move(e.clientX,e.clientY);start=null;}});el.addEventListener('pointercancel',()=>start=null);if(!window.PointerEvent){el.addEventListener('touchstart',e=>{if(e.touches.length===1)start={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});el.addEventListener('touchmove',e=>{if(e.touches.length===1)move(e.touches[0].clientX,e.touches[0].clientY);},{passive:true});el.addEventListener('touchend',()=>start=null);}}
swipe($('.events-track'),()=>showEvent(eventIndex-1),()=>showEvent(eventIndex+1));addEventListener('resize',()=>showEvent(eventIndex));

const photos=[{src:'assets/couple-ghats.webp',alt:'Amulya and Vedant at the Varanasi ghats'},{src:'assets/couple-dinner.webp',alt:'Amulya and Vedant sharing a meal together'},{src:'assets/couple-engagement.webp',alt:'Amulya and Vedant at their engagement celebration'},{src:'assets/couple-selfie.webp',alt:'Amulya and Vedant taking a mirror photograph together'}];let photoIndex=0,photoTimer;const galleryImg=$('#gallery-image'),photoFrame=$('.gallery-photo'),photoDots=$$('.gallery-dots button');
function thumbnails(){const wrap=$('.gallery-thumbnails');wrap.replaceChildren();photos.forEach((photo,i)=>{if(i===photoIndex)return;const button=document.createElement('button'),image=document.createElement('img');button.type='button';button.setAttribute('aria-label',`Show photograph ${i+1}`);image.src=photo.src;image.alt=photo.alt;image.loading='lazy';button.append(image);button.addEventListener('click',()=>showPhoto(i));wrap.append(button);});}
function showPhoto(index){photoIndex=(index+photos.length)%photos.length;clearTimeout(photoTimer);photoFrame.classList.add('is-changing');photoTimer=setTimeout(()=>{const photo=photos[photoIndex];galleryImg.src=photo.src;galleryImg.alt=photo.alt;galleryImg.style.objectPosition=photoIndex===2?'50% 70%':'50% 45%';photoFrame.classList.remove('is-changing');photoDots.forEach((dot,i)=>{dot.classList.toggle('active',i===photoIndex);dot.setAttribute('aria-pressed',String(i===photoIndex));});$('.gallery-count').textContent=`${photoIndex+1} of 4`;thumbnails();},reduceMotion.matches?0:180);}
thumbnails();galleryImg.draggable=false;$('.gallery-prev').addEventListener('click',()=>showPhoto(photoIndex-1));$('.gallery-next').addEventListener('click',()=>showPhoto(photoIndex+1));photoDots.forEach((dot,i)=>dot.addEventListener('click',()=>showPhoto(i)));swipe($('.gallery-photo'),()=>showPhoto(photoIndex-1),()=>showPhoto(photoIndex+1));$('.gallery-photo').style.touchAction='pan-y';$('.gallery-photo').tabIndex=0;$('.gallery-photo').setAttribute('aria-label','Photograph gallery. Use left and right arrow keys to browse.');$('.gallery-photo').addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();showPhoto(photoIndex+(e.key==='ArrowRight'?1:-1));}});

// RFC 5545 calendar. UTC DTSTARTs represent the supplied IST times, no invented end times.
const calendarEvents=[{uid:'mehendi',start:'20261124T050000Z',name:'Mehendi Ceremony',venue:'Shakuntala Niwas, Sunderpur, Varanasi'},{uid:'haldi',start:'20261126T033000Z',name:'Haldi Ceremony',venue:'Hotel De Paris, The Mall Road, Varanasi Cantonment'},{uid:'wedding',start:'20261126T140000Z',name:'Wedding Ceremony',venue:'Hotel De Paris, The Mall Road, Varanasi Cantonment'}];
function icsEscape(value){return value.replaceAll('\\','\\\\').replaceAll('\n','\\n').replaceAll(',','\\,').replaceAll(';','\\;');}
function foldLine(line){const encoder=new TextEncoder();let result='',part='';for(const character of line){if(encoder.encode(part+character).length>72){result+=part+'\r\n ';part='';}part+=character;}return result+part;}
function calendarText(){const stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Amulya and Vedant//Wedding Invitation//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:Amulya & Vedant — Wedding Celebrations','X-WR-TIMEZONE:Asia/Kolkata'];for(const event of calendarEvents)lines.push('BEGIN:VEVENT',`UID:${event.uid}-2026@amulya-vedant-lotus-invitation`,`DTSTAMP:${stamp}`,`DTSTART:${event.start}`,`SUMMARY:${icsEscape('Amulya & Vedant — '+event.name)}`,`LOCATION:${icsEscape(event.venue)}`,`DESCRIPTION:${icsEscape('With love and blessings, Agrawal Family. All wedding times are in Indian Standard Time.')}`,`URL:${SITE_URL}`,'END:VEVENT');lines.push('END:VCALENDAR');return lines.map(foldLine).join('\r\n')+'\r\n';}
$('#add-calendar').addEventListener('click',()=>notify('Open the calendar file to save all three celebrations.'));

const shareDialog=$('.share-dialog');$('#share-url').value=SITE_URL;
async function copyInvitation(){let copied=false;try{await navigator.clipboard.writeText(SITE_URL);copied=true;}catch{$('#share-url').focus();$('#share-url').select();try{copied=document.execCommand('copy');}catch{copied=false;}}if(copied){notify('Invitation link copied');if(shareDialog.open)shareDialog.close();}else{if(!shareDialog.open)shareDialog.showModal();$('#share-url').focus();$('#share-url').select();notify('Select and copy the invitation link.');}}
$('#share-invitation').addEventListener('click',async()=>{const data={title:'Amulya & Vedant · You’re invited',text:'Join us for our wedding celebrations in Varanasi, 24–26 November 2026. With love and blessings, Agrawal Family.',url:SITE_URL};if(navigator.share){try{await navigator.share(data);return;}catch(error){if(error.name==='AbortError')return;}}shareDialog.showModal();});$('#copy-link').addEventListener('click',copyInvitation);$('.close-share').addEventListener('click',()=>shareDialog.close());shareDialog.addEventListener('click',e=>{if(e.target===shareDialog){const r=shareDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)shareDialog.close();}});

function ready(){document.body.classList.add('ready');}
if(document.readyState==='complete')ready();else addEventListener('load',ready,{once:true});setTimeout(ready,1800);
// A shared hash must never bypass the seal-led entrance on a fresh visit.
history.scrollRestoration='manual';
