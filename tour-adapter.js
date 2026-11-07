/* Keep the exported tour intact. The host skin owns the background soundtrack.
   Applied only inside our same-origin tour iframe; direct native access is unchanged. */
(() => {
 'use strict';
 let hosted=false;
 try { hosted=window.parent!==window && window.parent.document.getElementById('tour')?.contentWindow===window; } catch {}
 if(!hosted)return;
 // Wait until the native engine has installed its script functions, then intercept
 // only the imported background track. Keep signed player definitions unchanged.
 document.addEventListener('DOMContentLoaded',()=>{
  const original=window.TDV?.Tour?.Script?.playAudioList;
  if(!original)return;
  TDV.Tour.Script.playAudioList=function(items,loop,...args){
   const background=loop && items?.length===1 && items[0]?.get?.('id')==='audio_AC637F3C_B211_2216_41DA_20F7FE2B21CA';
   if(background)return;
   return original.call(this,items,loop,...args);
  };
 },{once:true});
})();
