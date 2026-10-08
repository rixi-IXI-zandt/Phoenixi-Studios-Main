(() => {
  'use strict';
  // Resolve from the loaded script so custom domains and project Pages both work.
  const basePath=new URL('../',document.currentScript.src).pathname;
  const sceneURL=name=>basePath+(name==='home'?'':`${name}/`);
  const localizeHTML=html=>html.replace(/\b(href|src)="\/(?!\/)/g,`$1="${basePath}`);
  const scenes = {
    home: {title:'Phoenixi Studios',number:'I',accent:'110,240,255'},
    worlds: {title:'WORLDS',number:'II',accent:'110,240,255'},
    about: {title:'ABOUT',number:'III',accent:'226,179,255'},
    contact: {title:'CONTACT',number:'IV',accent:'184,255,217'}
  };
  const root=document.documentElement, scene=document.querySelector('.scene'), main=document.querySelector('main');
  const detail=document.querySelector('#scene-detail'), presentation=document.querySelector('#presentation');
  const status=document.querySelector('#scene-status'), motionButton=document.querySelector('.motion-control');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'), fine=matchMedia('(hover: hover) and (pointer: fine)');
  let paused=false, active='', revision=0, animations=[];
  let transitionController=null;
  const curtain=document.createElement('div');
  curtain.className='navigation-curtain';curtain.hidden=true;curtain.setAttribute('aria-hidden','true');
  curtain.innerHTML='<div class="curtain-leaf curtain-left"></div><div class="curtain-leaf curtain-right"></div><div class="curtain-seal"><i></i><span></span><i></i></div>';
  document.body.append(curtain);
  const leaves=[...curtain.querySelectorAll('.curtain-leaf')];
  const notice=document.createElement('div');notice.className='navigation-notice';notice.hidden=true;notice.setAttribute('role','alert');
  const noticeText=document.createElement('span');noticeText.textContent='That section could not finish loading.';
  const retry=document.createElement('button');retry.type='button';retry.textContent='Retry';
  const dismiss=document.createElement('button');dismiss.type='button';dismiss.textContent='Dismiss';
  notice.append(noticeText,retry,dismiss);document.body.append(notice);
  let retryDestination=null;
  retry.addEventListener('click',()=>{if(retryDestination)navigate(retryDestination.name,retryDestination.push)});
  dismiss.addEventListener('click',()=>{notice.hidden=true;main.focus({preventScroll:true})});
  try {paused=localStorage.getItem('ixi-motion')==='off'} catch {}
  const moving=()=>!paused&&!reduced.matches;
  const cancel=()=>{animations.forEach(a=>a.cancel());animations=[]};
  function updateMotion(){
    root.dataset.motion=moving()?'on':'off';
    motionButton.setAttribute('aria-pressed',String(!moving()));
    motionButton.setAttribute('aria-label',reduced.matches?'Reduced motion enabled by your device':paused?'Enable motion':'Pause motion');
    motionButton.querySelector('.motion-label').textContent=reduced.matches?'REDUCED MOTION':paused?'MOTION OFF':'MOTION ON';
    motionButton.disabled=reduced.matches;
    if(!moving())cancel();
  }
  motionButton.addEventListener('click',()=>{paused=!paused;try{localStorage.setItem('ixi-motion',paused?'off':'on')}catch{}updateMotion()});
  reduced.addEventListener('change',updateMotion);updateMotion();
  const route=()=>{const name=location.pathname.slice(basePath.length).replace(/\/index\.html$/,'').replace(/^\/+|\/+$/g,'').replace(/\.html$/,'');return Object.hasOwn(scenes,name)?name:'home'};
  const emptyMedia=(label='IMAGE / FILM')=>`<div class="media-frame" aria-label="Empty ${label.toLowerCase()} frame"><span class="frame-cross" aria-hidden="true">+</span><span class="slot-label">${label}</span><i aria-hidden="true"></i></div>`;
  const emptyText=()=>'<div class="copy-space" aria-label="Empty text frame"><span class="slot-label">TEXT</span><i></i><i></i><i></i></div>';
  const sections={
    home:()=>'',
    worlds:()=>`<div class="section-heading"><span class="folio">CATALOGUE</span><h2>Worlds</h2><span class="slot-label">UNFILLED</span></div><div class="world-grid">${['01','02','03'].map((n)=>`<details class="world-slot reveal"><summary>${emptyMedia('PROJECT IMAGE')}<span class="project-caption"><span>Project ${n}</span><span class="expand-label">VIEW FRAME <b aria-hidden="true">+</b></span></span></summary><div class="project-expanded"><h3>Project overview</h3>${emptyText()}<div class="project-specs"><div><span class="slot-label">FORMAT</span><span>—</span></div><div><span class="slot-label">STATUS</span><span>—</span></div></div></div></details>`).join('')}</div>`,
    about:()=>`<div class="section-heading"><span class="folio">STUDIO</span><h2>About</h2></div>
      <section class="studio-biography reveal" aria-labelledby="studio-title"><div class="statement-frame"><span class="folio">01 / STUDIO</span><h3 id="studio-title">Phoenixi Studios</h3><div class="biography-copy">
        <p>Phoenixi Studios began with a simple problem: Rixi has never been very good at keeping one kind of creativity separate from another.</p>
        <p>Art becomes writing. Writing becomes worldbuilding. Worldbuilding becomes architecture. Architecture becomes software. Research becomes a Grimoire. A drawing becomes a symbol, a garment, an object or the beginning of an entirely new system.</p>
        <p>So Phoenixi Studios became the place where all of it could belong.</p>
        <p>Created by Rixi IXI Phoenixi Zandt, Phoenixi Studios is the working studio through which IXI takes physical, visual and digital form. Its work moves between illustration, graphic design, storytelling, publishing, symbolic language, worldbuilding, architecture, software, education, objects, games and experimental systems without treating those disciplines as isolated territories.</p>
        <p>Some projects are practical. Some are strange. Some are deeply personal. Many become several things at once.</p>
        <p>Together they form a living body of work concerned with creation, knowledge, identity, transformation, relationship and the unexpected structures connecting seemingly unrelated things.</p>
        <p>Phoenixi Studios is the workshop where those structures are discovered by making them real.</p>
      </div></div></section>
      <section class="artist-section editorial-grid reveal" aria-labelledby="rixi-title"><figure class="artist-portrait"><img src="/assets/rixi-ixi.png" alt="Illustrated avatar of Rixi Zandt" width="1254" height="1254" decoding="async"></figure><div class="statement-frame"><span class="folio">02 / ARTIST</span><h3 id="rixi-title">Rixi Zandt</h3><div class="biography-copy">
        <p>Rixi has spent most of her life making things.</p>
        <p>Sometimes that has meant drawings, photographs, graphics and printed objects. Sometimes businesses, spaces and physical structures. Sometimes characters, worlds and stories. More recently it has meant digital systems, artificial intelligence, symbolic languages, software, architecture and an increasingly impossible-to-categorise thing called IXI.</p>
        <p>Her route here has never been particularly straight.</p>
        <p>She studied business, fine art and design, film photography and graphic design; worked in print production and vinyl, teaching and training; built and ran independent businesses; moved into crypto, digital art and NFTs; became involved professionally in community lore and worldbuilding; and eventually began bringing those disciplines together rather than continuing to treat them as separate lives.</p>
        <p>Rixi is now the founder of Phoenixi Studios and the creator and steward of IXI.</p>
        <p>She is an artist first, but one whose canvas has become unusually large. An illustration, a book, a piece of software, a garment, a fictional character, an architectural space or an entire system can all be part of the same creative act.</p>
        <p>Much of her current work explores identity, transformation, memory, knowledge, belonging and becoming—not as distant subjects, but as things lived from inside.</p>
        <p>IXI grew from that process.</p>
        <p>So did Rixi.</p>
      </div></div></section>`,
    contact:()=>`<div class="section-heading"><span class="folio">DIRECT</span><h2>Contact</h2></div><div class="contact-layout"><a class="contact-route reveal" href="mailto:rixizandt@gmail.com"><span class="folio">01 / EMAIL</span><h3>Get in touch</h3><span class="contact-address">rixizandt@gmail.com</span><span class="route-arrow" aria-hidden="true">↗</span></a><div class="community-routes"><a class="contact-route reveal" href="https://discord.gg/D6hDNAtXMY" target="_blank" rel="noopener noreferrer"><span class="folio">02 / COMMUNITY</span><h3>Discord</h3><span class="route-arrow" aria-hidden="true">↗</span></a><a class="contact-route reveal" href="https://www.instagram.com/rixiphoenixi/" target="_blank" rel="noopener noreferrer"><span class="folio">03 / SOCIAL</span><h3>Instagram</h3><span class="route-arrow" aria-hidden="true">↗</span></a></div></div>`
  };
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:0});
  function render(name,announce,preparedHTML){
    const data=scenes[name];active=name;root.dataset.view=name;scene.dataset.view=name;
    root.style.setProperty('--accent-rgb',data.accent);root.style.setProperty('--accent',`rgb(${data.accent})`);
    const title=document.querySelector('#scene-title');title.textContent=data.title;title.classList.toggle('sr-only',name==='home');
    document.querySelector('#scene-label').textContent=data.number;
    detail.hidden=name==='home';
    detail.innerHTML=name==='home'?'':'<a class="scroll-cue" href="#presentation">SCROLL TO '+(name==='worlds'?'CATALOGUE':name==='about'?'STUDIO':'CONNECT')+'<span aria-hidden="true">↓</span></a>';
    observer.disconnect();presentation.hidden=name==='home';
    presentation.innerHTML=name==='home'?'':(preparedHTML??localizeHTML(sections[name]()))+`<div class="section-end"><a href="#experience" class="back-top">BACK TO TOP ↑</a>${name!=='contact'?`<a href="/${name==='worlds'?'about':'contact'}" data-scene="${name==='worlds'?'about':'contact'}">${name==='worlds'?'ABOUT':'CONTACT'} →</a>`:'<a href="/" data-scene="home">RETURN HOME →</a>'}</div>`;
    presentation.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
    document.querySelectorAll('.scene-nav a').forEach(link=>{link.hidden=link.dataset.scene===name;link.removeAttribute('aria-current')});
    const mark=document.querySelector('.wordmark');if(name==='home'){mark.removeAttribute('href');mark.removeAttribute('data-scene');mark.setAttribute('aria-label','IXI — Phoenixi Studios')}else{mark.href='/';mark.dataset.scene='home';mark.setAttribute('aria-label','Return to IXI home')}
    document.title=name==='home'?'IXI — Phoenixi Studios':`${data.title} — IXI`;
    document.querySelectorAll('a[data-scene]').forEach(link=>link.href=sceneURL(link.dataset.scene));
    if(announce)status.textContent=`${data.title} section`;
  }
  const aborted=signal=>{if(signal.aborted)throw new DOMException('Navigation superseded','AbortError')};
  function bounded(work,signal,ms=12000){
    return new Promise((resolve,reject)=>{
      const stop=()=>finish(reject,new DOMException('Navigation superseded','AbortError'));
      const timer=setTimeout(()=>finish(reject,new Error('Content readiness timed out')),ms);
      function finish(fn,value){clearTimeout(timer);signal.removeEventListener('abort',stop);fn(value)}
      signal.addEventListener('abort',stop,{once:true});
      if(signal.aborted){stop();return}
      Promise.resolve(work).then(value=>finish(resolve,value),error=>finish(reject,error));
    });
  }
  async function readyAssets(container,signal){
    const imageJobs=[...container.querySelectorAll('img')].map(async image=>{
      // Decode detached copies so lazy images are ready before insertion.
      const preload=new Image();preload.decoding='async';preload.loading='eager';
      if(image.sizes)preload.sizes=image.sizes;if(image.srcset)preload.srcset=image.srcset;
      preload.src=image.currentSrc||image.src;
      await preload.decode();if(!preload.naturalWidth)throw new Error('Image unavailable');
    });
    const posterJobs=[...container.querySelectorAll('video[poster]')].map(async video=>{const image=new Image();image.src=video.poster;await image.decode()});
    const fonts=document.fonts?Promise.all([document.fonts.load('1em Ironick'),document.fonts.ready]):Promise.resolve();
    await bounded(Promise.all([...imageJobs,...posterJobs,fonts]),signal);aborted(signal);
  }
  async function prepareScene(name,signal){
    // Future route data must be awaited here, before producing the presentation HTML.
    const html=localizeHTML(await sections[name]());aborted(signal);
    const staging=document.createElement('div');staging.innerHTML=html;
    scene.querySelectorAll('img').forEach(image=>staging.append(image.cloneNode(true)));
    await readyAssets(staging,signal);return html;
  }
  async function shutter(open,signal){
    aborted(signal);curtain.dataset.phase=open?'opening':'closing';
    if(!moving()||!curtain.animate){curtain.dataset.phase=open?'open':'covered';return}
    const jobs=leaves.map((leaf,index)=>{
      const outside=`translateX(${index===0?'-':''}101%)`;
      return leaf.animate([{transform:open?'translateX(0)':outside},{transform:open?outside:'translateX(0)'}],{duration:open?900:520,easing:open?'cubic-bezier(.16,1,.3,1)':'cubic-bezier(.65,0,.35,1)',fill:'forwards'});
    });
    animations=jobs;await Promise.all(jobs.map(job=>job.finished.catch(()=>{})));aborted(signal);
    curtain.dataset.phase=open?'open':'covered';cancel();
  }
  async function navigate(name,push=true){
    if(!Object.hasOwn(scenes,name)||(active===name&&curtain.hidden))return;
    const token=++revision;transitionController?.abort();cancel();
    const controller=new AbortController(),signal=controller.signal;transitionController=controller;
    const previous=active,previousScroll=scrollY,previousHTML=sections[previous]();let swapped=false;
    notice.hidden=true;curtain.hidden=false;main.inert=true;main.setAttribute('aria-busy','true');
    document.querySelector('.scene-nav').inert=true;root.dataset.navigation='preparing';status.textContent='Preparing section';
    try{
      // Loading runs concurrently with closure. A slow request extends the covered phase.
      const preparation=bounded(prepareScene(name,signal),signal);
      const [prepared,closed]=await Promise.allSettled([preparation,shutter(false,signal)]);aborted(signal);
      if(prepared.status==='rejected')throw prepared.reason;
      if(closed.status==='rejected')throw closed.reason;
      const html=prepared.value;
      root.dataset.navigation='covered';
      render(name,false,html);swapped=true;window.scrollTo({top:0,behavior:'instant'});
      await readyAssets(main,signal);
      await bounded(new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))),signal);
      aborted(signal);
      // Commit the URL only after the destination is prepared successfully.
      if(push)history.pushState({},'',sceneURL(name));
      root.dataset.navigation='revealing';
      await shutter(true,signal);aborted(signal);
      status.textContent=`${scenes[name].title} section`;
    }catch(error){
      if(signal.aborted)return;
      if(swapped)render(previous,false,localizeHTML(previousHTML));
      if(!push)history.replaceState({},'',sceneURL(previous));
      window.scrollTo({top:previousScroll,behavior:'instant'});
      retryDestination={name,push};notice.hidden=false;
      status.textContent='Section could not load. Previous section retained.';
      await shutter(true,signal).catch(()=>{});
    }finally{
      if(token===revision){cancel();curtain.hidden=true;main.inert=false;main.removeAttribute('aria-busy');document.querySelector('.scene-nav').inert=false;root.dataset.navigation='idle';main.focus({preventScroll:true});transitionController=null}
    }
  }
  document.addEventListener('click',event=>{const link=event.target.closest('a[data-scene]');if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();navigate(link.dataset.scene)});
  window.addEventListener('popstate',()=>navigate(route(),false));render(route(),false);
  let frame=0;
  window.addEventListener('scroll',()=>{if(frame)return;frame=requestAnimationFrame(()=>{root.style.setProperty('--scroll',String(Math.min(scrollY/Math.max(innerHeight,1),1)));frame=0})},{passive:true});
  window.addEventListener('pointermove',event=>{if(!moving()||!fine.matches)return;root.style.setProperty('--light-x',`${44+event.clientX/innerWidth*12}%`);root.style.setProperty('--light-y',`${36+event.clientY/innerHeight*12}%`)},{passive:true});
})();
