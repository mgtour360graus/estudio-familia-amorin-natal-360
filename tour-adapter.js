/* Keep the exported tour intact. The host skin owns the background soundtrack.
   Applied only inside our same-origin tour iframe; direct native access is unchanged. */
(() => {
 'use strict';
 let hosted=false;
 try { hosted=window.parent!==window && window.parent.document.getElementById('tour')?.contentWindow===window; } catch {}
 if(!hosted || !window.TDV?.PlayerAPI?.defineScript)return;
 const define=TDV.PlayerAPI.defineScript;
 TDV.PlayerAPI.defineScript=function(script,...args){
  if(script?.id==='rootPlayer' && typeof script.start==='string'){
   script.start=script.start.replace(/this\.playAudioList\(\[this\.audio_[A-Za-z0-9_]+\],\s*true\);?\s*/g,'');
   for(const item of script.definitions||[])if(item.class==='MediaAudio')item.autoplay=false;
  }
  return define.call(this,script,...args);
 };
})();
