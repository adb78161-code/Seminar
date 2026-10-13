const slides = Array.from(document.querySelectorAll('.slide'));
const count = document.getElementById('pageCount');
function showSlide(id) {
  // Exactly one slide is visible at a time; the cover is only the first slide.
  const target = document.getElementById(id);
  if (!target || !target.classList.contains('slide')) return;
  slides.forEach(slide => {
    const active = slide === target;
    slide.classList.toggle('active', active);
    slide.setAttribute('aria-hidden', String(!active));
  });
  const index = slides.indexOf(target) + 1;
  if (count) count.innerHTML = String(index).padStart(2, '0') + ' <small>/ ' + String(slides.length).padStart(2, '0') + '</small>';
  document.title = (target.dataset.title || 'Computer Networks') + ' | Seminar';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function openTopic(type) {
  showSlide(type === 'intro' ? 'intro' : 'lesson-' + type);
}
function reveal(id) {
  const panel = document.getElementById(id);
  if (!panel) return;
  panel.classList.toggle('open');
  const button = panel.previousElementSibling;
  if (button && button.tagName === 'BUTTON') {
    button.textContent = panel.classList.contains('open') ? 'Hide explanation −' : 'Show example +';
  }
}
function nextSlide() {
  const index = slides.findIndex(s => s.classList.contains('active'));
  if (index >= 0 && index < slides.length - 1) showSlide(slides[index + 1].id);
}
function prevSlide() {
  const index = slides.findIndex(s => s.classList.contains('active'));
  if (index > 0) showSlide(slides[index - 1].id);
}
document.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') nextSlide();
  if (event.key === 'ArrowLeft') prevSlide();
});
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion && 'animate' in Element.prototype) {
  document.querySelectorAll('.device-stage').forEach((el, i) => {
    el.animate([{ opacity: .65, transform: 'translateY(7px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 650, delay: i * 80, easing: 'ease-out' });
  });
}
showSlide('home');


/* Animated topology lab: red = connection, green = sender, blue = receiver. */
const lessonSpecs={
 pan:{title:'PAN — Personal Area Network',subtitle:'How your personal devices connect',desc:'A PAN connects devices close to one person. Bluetooth commonly links phones, earbuds, smartwatches and laptops.',nodes:['Phone','Earbuds','Smartwatch','Laptop'],color:'#e65e9c',kind:'wireless',steps:['Enable Bluetooth on the phone.','Pair the earbuds, watch or laptop.','Data and audio packets travel over the short-range wireless link.'],example:'Play music on your phone and listen through Bluetooth earbuds.'},
 lan:{title:'LAN — Local Area Network',subtitle:'How a computer lab connects',desc:'A LAN connects devices in a home, classroom, lab or office. Ethernet cables connect computers to network equipment; Wi-Fi devices connect through an access point.',nodes:['PC 01','PC 02','PC 03','Router','Internet'],color:'#26a9c7',kind:'wired',steps:['PCs send frames through network links.','A switch forwards local traffic to the intended device.','A router connects the LAN to other networks or the internet.'],example:'Several lab PCs share a printer and internet connection.'},
 man:{title:'MAN — Metropolitan Area Network',subtitle:'How networks connect across a city',desc:'A MAN connects separate local networks across a metropolitan area, often using provider fibre and metro routers.',nodes:['Campus A','Metro Router','Campus C','Office B'],color:'#e7a13e',kind:'metro',steps:['Each campus or office has its own LAN.','The LANs connect to a metro router or provider network.','Fibre links carry data between sites around the city.'],example:'Different college campuses in the same city connect to shared services.'},
 wan:{title:'WAN — Wide Area Network',subtitle:'How distant networks communicate',desc:'A WAN connects networks across regions, countries or continents. Routers forward packets over long-distance carrier links.',nodes:['Local LAN','Regional Router','Remote Server','Global Network'],color:'#8b75dc',kind:'global',steps:['The local LAN sends traffic to its router.','Routers forward packets over provider and long-distance links.','The remote server responds along network routes.'],example:'Opening a website hosted in another country.'}
};
function deviceSvg(label){
 const common='viewBox="0 0 64 52" aria-hidden="true"';
 if(/phone/i.test(label))return `<svg ${common}><rect x="21" y="3" width="22" height="44" rx="5" fill="#e7edf4" stroke="currentColor" stroke-width="2"/><rect x="25" y="9" width="14" height="30" rx="2" fill="#b9d9ef"/><circle cx="32" cy="43" r="1.5" fill="currentColor"/></svg>`;
 if(/earbud/i.test(label))return `<svg ${common}><path d="M19 10a10 10 0 0 1 20 0v12a6 6 0 0 1-12 0v-7" fill="#e9e4f7" stroke="currentColor" stroke-width="2.5"/><path d="M45 10a9 9 0 0 1 0 18h-2v-9h2" fill="#e9e4f7" stroke="currentColor" stroke-width="2.5"/></svg>`;
 if(/watch/i.test(label))return `<svg ${common}><path d="M24 2h16l3 11H21zM21 39h22l-3 11H24z" fill="#d9e6ee" stroke="currentColor" stroke-width="2"/><rect x="17" y="11" width="30" height="30" rx="8" fill="#fff" stroke="currentColor" stroke-width="2"/><circle cx="32" cy="26" r="8" fill="#d9eee8" stroke="currentColor" stroke-width="1.5"/></svg>`;
 if(/laptop/i.test(label))return `<svg ${common}><rect x="12" y="5" width="40" height="31" rx="3" fill="#d7e7f2" stroke="currentColor" stroke-width="2"/><rect x="16" y="9" width="32" height="23" fill="#8ec8db"/><path d="M6 39h52l-5 7H11z" fill="#aab9c8" stroke="currentColor" stroke-width="2"/></svg>`;
 if(/pc|computer/i.test(label))return `<svg ${common}><rect x="8" y="4" width="39" height="29" rx="3" fill="#d9e8f2" stroke="currentColor" stroke-width="2"/><rect x="12" y="8" width="31" height="21" fill="#91c9de"/><path d="M27 33v7m-8 2h17" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><rect x="49" y="14" width="9" height="29" rx="2" fill="#c2cfda" stroke="currentColor" stroke-width="1.5"/></svg>`;
 if(/switch/i.test(label))return `<svg ${common}><rect x="5" y="13" width="54" height="26" rx="5" fill="#dbe7ee" stroke="currentColor" stroke-width="2"/><g fill="#36b99c">${[14,23,32,41,50].map(x=>`<circle cx="${x}" cy="26" r="2"/>`).join('')}</g><path d="M13 34h38" stroke="#9aaabd" stroke-width="2"/></svg>`;
 if(/router/i.test(label))return `<svg ${common}><rect x="7" y="22" width="50" height="22" rx="5" fill="#dce8f0" stroke="currentColor" stroke-width="2"/><path d="M19 22V8m26 14V8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><g fill="#36b99c"><circle cx="16" cy="33" r="2"/><circle cx="23" cy="33" r="2"/><circle cx="30" cy="33" r="2"/></g></svg>`;
 if(/printer/i.test(label))return `<svg ${common}><path d="M20 7h24v12H20z" fill="#dce7ee" stroke="currentColor" stroke-width="2"/><rect x="10" y="18" width="44" height="22" rx="4" fill="#c6d5e0" stroke="currentColor" stroke-width="2"/><path d="M19 32h26v15H19z" fill="#fff" stroke="currentColor" stroke-width="2"/></svg>`;
 if(/campus|office/i.test(label))return `<svg ${common}><path d="M8 46V17L32 5l24 12v29z" fill="#dbe8f0" stroke="currentColor" stroke-width="2"/><path d="M17 23h7v7h-7zm16 0h7v7h-7zm-16 12h7v7h-7zm16 0h7v7h-7z" fill="#80c5d7"/><path d="M28 35h8v11h-8z" fill="#fff" stroke="currentColor"/></svg>`;
 if(/internet|global|server|network/i.test(label))return `<svg ${common}><circle cx="32" cy="26" r="21" fill="#e0e8f3" stroke="currentColor" stroke-width="2"/><ellipse cx="32" cy="26" rx="9" ry="21" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 20h40M12 32h40" stroke="currentColor" stroke-width="1.5"/></svg>`;
 return `<svg ${common}><rect x="9" y="8" width="46" height="36" rx="7" fill="#dbe8f0" stroke="currentColor" stroke-width="2"/><circle cx="20" cy="20" r="3" fill="#36b99c"/><circle cx="32" cy="20" r="3" fill="#36b99c"/><circle cx="44" cy="20" r="3" fill="#36b99c"/><path d="M17 32h30" stroke="currentColor" stroke-width="2"/></svg>`;
}
function routesFor(kind){
 return {
  wireless:['M130 160 C200 160 220 65 330 65','M130 160 C200 160 220 265 330 265','M330 65 C440 70 460 265 565 265'],
  wired:['M120 65 L400 160','M680 65 L400 160','M120 265 L400 160','M680 265 L400 160','M400 160 L400 305'],
  metro:['M100 160 L400 160','M400 160 L700 160','M400 160 L400 290','M100 160 Q230 25 400 160','M400 160 Q570 25 700 160'],
  global:['M95 160 C210 160 225 65 330 65','M330 65 C430 65 470 265 570 265','M570 265 C640 265 655 160 705 160','M95 160 C230 320 570 320 705 160']
 }[kind]||[];
}
function renderConnectionSvg(kind){
 const paths=routesFor(kind);
 return `<svg class="connection-wires" viewBox="0 0 800 330" preserveAspectRatio="none" aria-label="Red connection paths with green sender and blue receiver packets">${paths.map((d,i)=>`<path class="wire-path" d="${d}"/>`).join('')}${paths.map((d,i)=>`<circle class="sender-dot" r="5"><animateMotion dur="${2.8+i*.3}s" repeatCount="indefinite" begin="${-i*.4}s" path="${d}"/></circle><circle class="receiver-dot" r="5"><animateMotion dur="${2.8+i*.3}s" repeatCount="indefinite" begin="${-(i*.4+1.4)}s" path="${d}"/></circle>`).join('')}</svg>`;
}
function openNetworkLab(type){
 const d=lessonSpecs[type]; if(!d)return;
 let view=document.getElementById('networkLessonView');
 if(!view){view=document.createElement('section');view.id='networkLessonView';view.className='network-lesson-view';document.querySelector('main').appendChild(view);}
 const positions={
 wireless:[['4%','calc(50% - 44px)'],['72%','7%'],['72%','68%'],['38%','74%']],
 wired:[['2%','4%'],['74%','4%'],['2%','70%'],['74%','70%'],['38%','38%']],
 metro:[['1%','38%'],['38%','38%'],['76%','38%'],['38%','72%']],
 global:[['1%','38%'],['30%','3%'],['68%','70%'],['76%','38%']]
 }[d.kind];
 view.innerHTML=`<div class="lesson-toolbar"><button class="lesson-back" id="lessonBack">← Back to network types</button><span>INTERACTIVE NETWORK LAB</span></div><div class="lesson-hero"><p class="kicker">ANIMATED CONNECTION EXPLORER</p><h2>${d.title}</h2><h3>${d.subtitle}</h3><p>${d.desc}</p></div><div class="live-diagram" style="--lesson-accent:${d.color}"><div class="diagram-heading"><span>CONNECTION SIMULATION</span><span class="live-indicator">● DATA FLOW ACTIVE</span></div><div class="diagram-stage ${d.kind}">${renderConnectionSvg(d.kind)}${d.nodes.map((n,i)=>`<div class="lesson-node" style="left:${positions[i][0]};top:${positions[i][1]}"><div class="device-image">${deviceSvg(n)}</div><b>${n}</b><small>${/router/i.test(n)?'Forwards packets':/switch/i.test(n)?'Forwards frames':/campus|office/i.test(n)?'Local network':/phone|earbud|watch/i.test(n)?'Personal device':'Network device'}</small></div>`).join('')}</div><div class="diagram-legend"><span><i class="legend-wire"></i> Red line: connection</span><span><i class="legend-sender"></i> Green dot: sender</span><span><i class="legend-receiver"></i> Blue dot: receiver</span></div></div><div class="lesson-bottom-grid"><article class="lesson-info"><p class="kicker">HOW THE CONNECTION WORKS</p><ol>${d.steps.map(s=>`<li>${s}</li>`).join('')}</ol></article><article class="lesson-info example-info"><p class="kicker">REAL-WORLD EXAMPLE</p><p>${d.example}</p><button class="lesson-replay" id="replayAnimation">Replay connection ↻</button></article></div>`;
 document.querySelectorAll('.slide').forEach(p=>{p.classList.remove('active');p.setAttribute('aria-hidden','true')});
 view.classList.add('active');document.getElementById('pageCount').textContent='LAB';
 const back=document.getElementById('lessonBack');back.addEventListener('click',()=>{view.classList.remove('active');showSlide('lesson-types')});
 document.getElementById('replayAnimation').addEventListener('click',()=>{const svg=view.querySelector('svg.connection-wires');svg.classList.remove('replay');void svg.offsetWidth;svg.classList.add('replay')});
 window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('.type-card').forEach(card=>{
 const type=['pan','lan','man','wan'].find(t=>card.classList.contains(t));
 if(!type)return;
 card.querySelectorAll('.detail-btn').forEach(btn=>{btn.textContent='Open animated lesson ↗';btn.onclick=e=>{e.stopPropagation();openNetworkLab(type)}});
 card.style.cursor='pointer';
 card.addEventListener('click',e=>{if(!e.target.closest('button'))openNetworkLab(type)});
});
