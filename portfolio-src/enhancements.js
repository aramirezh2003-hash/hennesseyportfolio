/* Progressive interaction layer for the static routed portfolio. */
(function(){
  const app=document.getElementById('app');
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function addSkipLink(){
    if(document.querySelector('.skip-link')) return;
    const link=document.createElement('a');
    link.className='skip-link';link.href='#app';link.textContent='Skip to content';
    document.body.prepend(link);
    if(app) app.setAttribute('tabindex','-1');
  }

  function addHomeDetails(){
    const hero=document.querySelector('.hero');
    if(!hero||hero.dataset.experienceReady) return;
    hero.dataset.experienceReady='true';
    const metrics=document.createElement('div');
    metrics.className='hero-metrics reveal in';
    metrics.innerHTML='<div class="hero-metric"><span>Selected work</span><strong>03</strong><i>↗</i></div><div class="hero-metric"><span>Practice areas</span><strong>04</strong><i>✦</i></div><div class="hero-metric"><span>Based in Toronto</span><strong>ON</strong><i>•</i></div>';
    const grid=hero.querySelector('.hero-grid');
    if(grid) grid.after(metrics);
    const scroll=document.createElement('a');
    scroll.className='hero-scroll';scroll.href='#work';scroll.innerHTML='<i aria-hidden="true"></i><span>Scroll to explore</span>';
    hero.querySelector('.hero-bar')?.before(scroll);
    const system=document.querySelector('.system-list');
    if(system&&!document.querySelector('.motion-strip')){
      const strip=document.createElement('div');
      strip.className='motion-strip';
      strip.innerHTML='<div class="motion-strip-track"><span><b>Product design</b> <i>✦</i> E-commerce <i>✦</i> Brand systems <i>✦</i> Motion studies <i>✦</i> Product design <i>✦</i> E-commerce <i>✦</i> Brand systems <i>✦</i> Motion studies <i>✦</i></span><span aria-hidden="true"><b>Product design</b> <i>✦</i> E-commerce <i>✦</i> Brand systems <i>✦</i> Motion studies <i>✦</i></span></div>';
      system.closest('.section')?.after(strip);
    }
  }

  function replaceHomePrinciples(){
    const grid=document.querySelector('.system-grid');
    if(!grid||grid.dataset.replaced) return;
    grid.dataset.replaced='true';
    const section=grid.closest('.section');
    if(!section) return;
    grid.innerHTML='<h2>Useful from the first conversation.</h2><div class="system-copy"><p>I help teams turn uncertainty into a clear next move.</p><p>Strategy, structure, and a point of view—working together.</p></div>';
    const list=section.querySelector('.system-list');
    if(list) list.innerHTML='<div class="system-row reveal"><strong>01</strong><h3>Make the problem legible</h3><p>Align the people, constraints, and decision before adding more surface.</p></div><div class="system-row reveal"><strong>02</strong><h3>Turn complexity into direction</h3><p>Use flows, language, and visual hierarchy to make the next step obvious.</p></div><div class="system-row reveal"><strong>03</strong><h3>Leave the team with a system</h3><p>Build a flexible foundation that keeps working after the first launch.</p></div>';
  }

  function prepareMedia(){
    document.querySelectorAll('video').forEach(video=>{
      video.muted=true;video.setAttribute('muted','');video.setAttribute('playsinline','');
      video.preload='metadata';
      if(reduce){video.pause();video.removeAttribute('autoplay');}
    });
    document.querySelectorAll('img').forEach((img,index)=>{if(!img.hasAttribute('loading')&&index>0)img.loading='lazy';img.decoding='async';});
    if(reduce) return;
    if(!window.__mediaObserver){
      window.__mediaObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
        const video=entry.target;
        if(entry.isIntersecting){video.play().catch(()=>{});}else{video.pause();}
      }),{threshold:.15});
    }
    document.querySelectorAll('video:not([data-media-observed])').forEach(video=>{
      video.dataset.mediaObserved='true';
      window.__mediaObserver.observe(video);
    });
  }

  function prepareReveal(){
    if(!window.__revealObserver){
      window.__revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
        if(entry.isIntersecting){entry.target.classList.add('in');window.__revealObserver.unobserve(entry.target);}
      }),{threshold:.12});
    }
    document.querySelectorAll('.reveal:not(.in)').forEach(el=>window.__revealObserver.observe(el));
  }

  function prepareNavigation(){
    const menu=document.getElementById('menu');
    if(menu&&!menu.dataset.a11y){
      menu.dataset.a11y='true';menu.setAttribute('aria-label','Open navigation');menu.setAttribute('aria-expanded','false');
      menu.addEventListener('click',()=>{const open=document.querySelector('.topbar')?.classList.contains('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
      document.querySelectorAll('.nav a').forEach(link=>link.addEventListener('click',()=>{document.querySelector('.topbar')?.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');}));
    }
    document.querySelectorAll('a[data-route],.work-card,.filter,.cta a,.next').forEach(el=>{
      if(!el.dataset.cursorLabel){el.dataset.cursorLabel=el.matches('.filter')?'Filter':el.matches('.work-card,.next')?'Open':'Go';}
    });
  }

  function addRecruiterCTA(){
    const nav=document.querySelector('.nav');
    if(!nav||nav.querySelector('.nav-cta')) return;
    if(!nav.querySelector('[data-route="faq"]')){
      const faq=document.createElement('a');faq.href='/faq';faq.dataset.route='faq';faq.textContent='FAQ';faq.dataset.cursorLabel='Read';
      faq.addEventListener('click',event=>{event.preventDefault();history.pushState({},'','/faq');renderFAQ();});
      nav.insertBefore(faq,nav.firstChild);
    }
    const cta=document.createElement('a');
    cta.className='nav-cta';cta.href='/contact';cta.dataset.route='contact';cta.dataset.cursorLabel='Start';cta.textContent='Start a project ↗';
    cta.addEventListener('click',event=>{
      if(location.pathname==='/contact') return;
      event.preventDefault();
      history.pushState({},'', '/contact');
      window.dispatchEvent(new Event('popstate'));
    });
    nav.append(cta);
  }

  function renderFAQ(){
    if(location.pathname!=='/faq'||!app) return;
    document.title='FAQ — Alejandro Hennessey';
    app.innerHTML='<section class="intro faq-page"><span class="eyebrow">04 / FAQ</span><h1>A few useful answers before we begin.</h1><p>How I work, what I can help with, and what a good first conversation looks like.</p></section><section class="section faq-section"><div class="faq-list"><details open><summary>What kind of projects do you take on?</summary><p>Product design, e-commerce experiences, brand and visual systems, motion, and editorial work. I’m especially interested in projects where clarity, structure, and character all matter.</p></details><details><summary>What can you help with?</summary><p>I can help shape the problem, map the experience, design the interface, build a visual language, and prepare a system that a team can carry forward.</p></details><details><summary>Do you work with teams or independently?</summary><p>Both. I can join an existing product or brand team, partner with founders directly, or work alongside developers and other creative specialists.</p></details><details><summary>What does the process usually look like?</summary><p>We start with a focused conversation, clarify the decision that matters, explore the right direction, then refine the system into work that is ready to share, build, or ship.</p></details><details><summary>How long does a project take?</summary><p>It depends on the scope and the team. Smaller focused engagements can move quickly; broader product or identity work benefits from a few structured phases. I’ll outline a realistic path after the first conversation.</p></details><details><summary>How do I get started?</summary><p>Send a short note with what you’re working on, where things feel stuck, and your ideal timing. I’ll reply at <a href="mailto:arhennesseyco@gmail.com">arhennesseyco@gmail.com</a>.</p></details></div></section><section class="cta"><span class="eyebrow" style="justify-content:center">Ready when you are</span><h2>Have a good problem?<br><em>Deal me in.</em></h2><a href="/contact" data-route="contact">Start a conversation ↗</a></section><footer><span>© 2026 Alejandro Hennessey / Toronto</span></footer>';
    document.querySelectorAll('.nav a').forEach(a=>a.classList.toggle('active',a.dataset.route==='faq'));
    prepareNavigation();
    app.querySelectorAll('a[data-route]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();history.pushState({},'',link.getAttribute('href'));window.dispatchEvent(new Event('popstate'));}));
  }

  function cleanTaxonomy(){
    document.querySelectorAll('.filter[data-filter="print"]').forEach(button=>button.remove());
    document.querySelectorAll('.section-head p').forEach(text=>{
      if(text.textContent.includes('Four areas of practice')) text.textContent='Three active disciplines. One clear next move.';
    });
    const practice=document.querySelector('.hero-metric:nth-child(2)');
    if(practice){const label=practice.querySelector('span');const value=practice.querySelector('strong');if(label)label.textContent='Active disciplines';if(value)value.textContent='03';}
  }

  function addAboutDetails(){
    const grid=document.querySelector('.about-grid');
    if(!grid||grid.dataset.detailsReady) return;
    grid.dataset.detailsReady='true';
    const section=document.createElement('div');
    section.className='about-capabilities';
    section.innerHTML='<div class="about-capabilities-head"><span class="eyebrow">Capabilities</span><a class="resume-cta" href="/assets/AlejandroHennessey_Resume.pdf" download>Download résumé ↗</a></div><div class="capability-grid"><div class="capability-item"><strong>01</strong><h3>Product & UI/UX</h3><p>Flows, interfaces, prototypes, and systems that make complex products easier to use.</p></div><div class="capability-item"><strong>02</strong><h3>E-commerce</h3><p>Storefronts, catalogues, and purchase journeys designed for clarity and confidence.</p></div><div class="capability-item"><strong>03</strong><h3>Brand & visual systems</h3><p>Identity, typography, visual language, and presentation that hold together.</p></div><div class="capability-item"><strong>04</strong><h3>Print & editorial</h3><p>Structured layouts and visual narratives for work that needs to exist beyond the screen.</p></div><div class="capability-item"><strong>05</strong><h3>Motion & interaction</h3><p>Transitions and responsive details that give a useful interface a point of view.</p></div></div>';
    grid.parentElement?.insertBefore(section,grid.parentElement.querySelector('.timeline'));
  }

  function improveContact(){
    const links=document.querySelector('.contact-links');
    if(links&&!links.dataset.contactReady){
      links.dataset.contactReady='true';
      links.innerHTML='<a href="mailto:arhennesseyco@gmail.com">Email <span>↗</span></a><a href="tel:+12265824622">Call <span>↗</span></a><div class="contact-location">Toronto, Ontario, Canada</div>';
    }
    const form=document.getElementById('form');
    if(!form||form.dataset.formReady) return;
    form.dataset.formReady='true';
    const messageLabel=form.querySelector('label[for="message"]');
    const fields=document.createElement('div');fields.className='form-grid';
    fields.innerHTML='<div><label for="projectType">Project type</label><select id="projectType"><option value="">Select one</option><option>Product / UI/UX</option><option>E-commerce</option><option>Brand / visual system</option><option>Motion / interaction</option><option>Print / editorial</option></select></div><div><label for="timeframe">Timeframe</label><input id="timeframe" placeholder="e.g. This quarter"></div>';
    messageLabel?.before(fields);
    form.addEventListener('submit',event=>{
      event.preventDefault();event.stopImmediatePropagation();
      const name=document.getElementById('name')?.value||'';const email=document.getElementById('email')?.value||'';const message=document.getElementById('message')?.value||'';const type=document.getElementById('projectType')?.value||'Not specified';const timeframe=document.getElementById('timeframe')?.value||'Not specified';
      const subject=encodeURIComponent('Project inquiry from '+name);const body=encodeURIComponent('Project type: '+type+'\nTimeframe: '+timeframe+'\n\n'+message+'\n\nReply to: '+email);
      const status=document.getElementById('status');if(status){status.textContent='Your email client is ready with the project details.';status.style.display='block';}
      location.href='mailto:arhennesseyco@gmail.com?subject='+subject+'&body='+body;
    },true);
  }

  function prepareMotion(){
    document.querySelectorAll('video').forEach(video=>{
      video.controls=true;video.setAttribute('aria-label','Motion study video');
    });
  }

  function addWorkTools(){
    const archive=document.querySelector('.archive');
    if(!archive||archive.dataset.toolsReady) return;
    archive.dataset.toolsReady='true';
    const tools=document.createElement('div');
    tools.className='work-tools';
    tools.innerHTML='<label for="workSearch">Search projects</label><div class="work-search-wrap"><input id="workSearch" type="search" placeholder="Search by project, discipline, or focus" autocomplete="off" aria-describedby="workResults"><span aria-hidden="true">⌕</span></div><output id="workResults" aria-live="polite">03 projects</output>';
    const filters=archive.parentElement.querySelector('.filters');
    filters?.before(tools);
    const input=tools.querySelector('#workSearch');const output=tools.querySelector('#workResults');const note=archive.parentElement.querySelector('#tableNote');
    let active='all';
    const apply=()=>{
      const query=(input?.value||'').trim().toLowerCase();let visible=0;
      archive.querySelectorAll('[data-group]').forEach(row=>{
        const matchesFilter=active==='all'||row.dataset.group.split(' ').includes(active);
        const matchesQuery=!query||(row.textContent+' '+(row.dataset.search||'')).toLowerCase().includes(query);
        const show=matchesFilter&&matchesQuery;row.style.display=show?'':'none';if(show)visible++;
      });
      if(output)output.textContent=String(visible).padStart(2,'0')+' '+(visible===1?'project':'projects');
      if(note){note.textContent=visible?'':'No matching project. Try another search or discipline.';note.classList.toggle('show',visible===0);}
    };
    input?.addEventListener('input',apply);
    input?.addEventListener('keydown',event=>{if(event.key==='Escape'&&input.value){input.value='';apply();input.focus();}});
    archive.parentElement.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{active=button.dataset.filter||'all';apply();}));
    apply();
  }

  function addStructuredData(){
    if(document.getElementById('portfolio-schema')) return;
    const script=document.createElement('script');script.id='portfolio-schema';script.type='application/ld+json';
    script.textContent=JSON.stringify({'@context':'https://schema.org','@type':'Person','name':'Alejandro Hennessey','jobTitle':'Product and visual designer','address':{'@type':'PostalAddress','addressLocality':'Toronto','addressRegion':'ON','addressCountry':'CA'},'email':'arhennesseyco@gmail.com','url':'https://alejandrohennessey.com/'});
    document.head.append(script);
  }

  function removeLegacyLoader(){
    document.querySelectorAll('body *').forEach(node=>{
      if(node===app||node.closest('#app,.shell,header,main,footer')) return;
      const text=(node.textContent||'').trim().toLowerCase();
      const style=window.getComputedStyle(node);
      const fullScreen=style.position==='fixed'&&(parseFloat(style.zIndex||0)>=50||style.inset==='0px');
      if(fullScreen&&text.includes('alejandro')) node.remove();
    });
  }

  function handleUnknownRoute(){
    if(!location.pathname.startsWith('/work/')||document.querySelector('.not-found')) return;
    const valid=['kitlab-fs','matchup','commerceflow'];
    if(valid.includes(location.pathname.split('/')[2])) return;
    if(app) app.innerHTML='<section class="intro not-found"><span class="eyebrow">404 / Not found</span><h1>This table is empty.</h1><p>The project you requested does not exist or may have moved.</p><div style="margin-top:32px"><a class="primary" href="/work" data-route="work">Return to work ↗</a></div></section><footer><span>© 2026 Alejandro Hennessey / Toronto</span></footer>';
  }

  function addCaseUtility(){
    const intro=document.querySelector('.case-intro');
    if(!intro||intro.dataset.utilityReady) return;
    intro.dataset.utilityReady='true';
    const number=intro.querySelector('.eyebrow')?.textContent.match(/\d+/)?.[0]||'01';
    const utility=document.createElement('div');utility.className='case-utility';
    utility.innerHTML='<span>Case '+number+' of 03</span><a href="/work">Back to all work ↗</a>';
    intro.after(utility);
  }

  function prepareCursor(){
    const cursor=document.getElementById('cursor');
    if(cursor&&!cursor.dataset.readyHook){
      cursor.dataset.readyHook='true';
      window.addEventListener('pointermove',()=>cursor.classList.add('ready'),{once:true,passive:true});
    }
  }

  function enhance(){addSkipLink();addHomeDetails();replaceHomePrinciples();addRecruiterCTA();cleanTaxonomy();addAboutDetails();improveContact();addWorkTools();addCaseUtility();prepareMedia();prepareMotion();prepareReveal();prepareNavigation();prepareCursor();addStructuredData();handleUnknownRoute();removeLegacyLoader();renderFAQ();}
  enhance();
  if(app)new MutationObserver(enhance).observe(app,{childList:true,subtree:true});

  if(!reduce){
    let frame=0;
    window.addEventListener('pointermove',event=>{
      if(frame)return;
      frame=requestAnimationFrame(()=>{
        document.documentElement.style.setProperty('--ambient-x',((event.clientX/window.innerWidth)*100).toFixed(2)+'%');
        document.documentElement.style.setProperty('--ambient-y',((event.clientY/window.innerHeight)*100).toFixed(2)+'%');
        frame=0;
      });
    },{passive:true});
    document.addEventListener('pointerover',event=>{
      const target=event.target.closest('[data-cursor-label]');
      const label=document.getElementById('cursorLabel');
      if(target&&label) label.textContent=target.dataset.cursorLabel;
    });
  }
})();
