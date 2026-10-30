import React, {useEffect, useRef, useState} from 'react';

// The Studio's close / settle / reveal choreography, shared by Library navigation.
export function useIXITransition() {
  const [phase,setPhase]=useState('idle');
  const busy=useRef(false),alive=useRef(true),timers=useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(()=>{alive.current=true;return()=>{alive.current=false;timers.current.forEach(clearTimeout);};},[]);
  const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(()=>{if(alive.current)fn();},ms));};
  const travel=(change:()=>void)=>{
    if(busy.current)return;
    busy.current=true;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const desktop=matchMedia('(min-width: 900px)').matches;
    setPhase('closing');
    later(()=>{
      change();window.scrollTo({top:0,behavior:'instant'});setPhase('covered');
      later(()=>{
        setPhase('opening');
        later(()=>{setPhase('idle');busy.current=false;timers.current=[];requestAnimationFrame(()=>{if(alive.current)document.querySelector<HTMLElement>('.workspace-content')?.focus({preventScroll:true});});},reduced?0:desktop?2200:900);
      },reduced?0:desktop?400:80);
    },reduced?0:desktop?1400:520);
  };
  return {phase,travel,busy};
}
export function IXITransition({phase}:{phase:string}) {
  return <div className="ixi-curtain" data-phase={phase} hidden={phase==='idle'} aria-hidden="true">
    <div className="ixi-leaf ixi-left"/><div className="ixi-leaf ixi-right"/>
    <div className="ixi-seal"><i/><span/><i/></div>
  </div>;
}

