import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const js=fs.readFileSync('app.js','utf8');
const source=js.slice(js.indexOf('let opened=false;'),js.indexOf("$('#open-envelope').addEventListener"));
const flush=async()=>{for(let i=0;i<8;i++)await Promise.resolve();};
function setup({reduced=false}={}){
  const classes=()=>{const set=new Set();return {add:x=>set.add(x),remove:x=>set.delete(x),contains:x=>set.has(x)};};
  const entrance={hidden:false,inert:false},main={hidden:true,inert:true,scrollTop:22,focus(){this.focused=true;}},controls={classList:classes()},seal={},tap={};
  const animations=[];let decodeReady;
  const hero={loading:'lazy',decode:()=>new Promise(resolve=>decodeReady=resolve)};
  const light={style:{},animate(frames,options){let resolve,reject;const finished=new Promise((yes,no)=>{resolve=yes;reject=no;});const a={frames,options,finished,resolve,reject,cancel(){this.cancelled=true;}};animations.push(a);return a;}};
  const els={'#opening':entrance,'#invitation':main,'.opening-radiance':light,'.floating-controls':controls,'#open-envelope':seal,'#welcome .screen-art':hero};
  const body={classList:classes()};body.classList.add('invitation-closed');
  let music=0,bells=0;
  const sandbox={$:s=>els[s],$$:()=>[tap],reduceMotion:{matches:reduced},document:{body},history:{replaceState(){}},showEvent(){},softBell(){bells++;},setMusic(){music++;},requestAnimationFrame:cb=>cb()};
  vm.createContext(sandbox);vm.runInContext(source,sandbox);
  return {open:sandbox.openEnvelope,entrance,main,controls,light,animations,hero,seal,tap,decode:()=>decodeReady(),music:()=>music,bells:()=>bells};
}

const s=setup();const opening=s.open();
assert(s.seal.disabled&&s.tap.disabled,'Disable duplicate taps');
await s.open();assert.equal(s.animations.length,1,'Only one opening sequence');
assert(s.main.hidden&&!s.entrance.hidden,'Envelope remains until full coverage');
s.animations[0].resolve();await flush();
assert.equal(s.light.style.opacity,'1','Hold full light while hero decodes');
assert(!s.entrance.hidden&&s.main.hidden,'No premature reveal while hero loads');
s.decode();await flush();
assert(s.entrance.hidden&&s.entrance.inert,'Envelope removed before fade-out');
assert(!s.main.hidden&&!s.main.inert,'Invitation ready underneath full light');
assert(!s.controls.classList.contains('visible'),'Controls do not appear over envelope');
assert.equal(s.animations.length,2);assert.equal(s.animations[1].frames[0].opacity,1);
s.animations[1].resolve();await opening;
assert(s.entrance.hidden,'Envelope never returns');assert.equal(s.light.style.opacity,'0');
assert(s.controls.classList.contains('visible')&&s.main.focused);assert.equal(s.music(),1);
for(const mode of [{silent:true},{reduced:true}]){
  const t=setup(mode);await t.open(mode);
  assert(t.entrance.hidden&&!t.main.hidden&&t.controls.classList.contains('visible'));
  assert.equal(t.animations.length,0,'Skip and reduced motion must not flash');
  assert.equal(t.music(),mode.silent?0:1);
}
const failed=setup();const recovery=failed.open();failed.animations[0].reject(new Error('cancelled'));await recovery;
assert(failed.entrance.hidden&&!failed.main.hidden,'Animation failure cannot trap guest');
console.log('PASS: opaque-light handover, no envelope return, delayed controls, duplicate-tap guard, hero readiness, skip/reduced motion and cancellation fallback.');
