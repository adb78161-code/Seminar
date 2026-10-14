const pages=[...document.querySelectorAll('.page')];let current=0;
function showPage(index){current=Math.max(0,Math.min(pages.length-1,index));pages.forEach((p,i)=>{p.classList.toggle('active',i===current);p.setAttribute('aria-hidden',i===current?'false':'true')});document.getElementById('pageCount').textContent=String(current+1).padStart(2,'0')+' / '+String(pages.length).padStart(2,'0');document.getElementById('prevBtn').disabled=current===0;document.getElementById('nextBtn').textContent=current===pages.length-1?'Top ↑':'Next →';history.replaceState(null,'','#'+pages[current].id);window.scrollTo({top:0,behavior:'smooth'});}
document.getElementById('startBtn').addEventListener('click',()=>showPage(1));document.getElementById('prevBtn').addEventListener('click',()=>showPage(current-1));document.getElementById('nextBtn').addEventListener('click',()=>current===pages.length-1?showPage(0):showPage(current+1));
document.querySelectorAll('.reveal-btn').forEach(btn=>btn.addEventListener('click',()=>{const el=document.getElementById(btn.dataset.reveal);el.classList.toggle('hidden');btn.textContent=el.classList.contains('hidden')?'Show example +':'Hide example −'}));
document.querySelectorAll('.detail-btn').forEach(btn=>btn.addEventListener('click',()=>{const el=document.getElementById(btn.dataset.target);el.classList.toggle('hidden');btn.textContent=el.classList.contains('hidden')?'Explore '+btn.dataset.target.replace('Detail','').toUpperCase()+' ↗':'Hide details −'}));
document.getElementById('personalForm').addEventListener('submit',e=>{e.preventDefault();const d={name:studentName.value,reg:regNo.value,cls:classSem.value,subject:subject.value};document.getElementById('saveStatus').textContent='Details saved for this session. They are not sent to a server.';const summary=[['Name',d.name],['Registration No.',d.reg],['Class / Semester',d.cls],['Subject',d.subject]];let old=document.getElementById('detailPreview');if(!old){old=document.createElement('div');old.id='detailPreview';old.className='form-note';e.currentTarget.appendChild(old)}old.innerHTML=summary.filter(x=>x[1]).map(x=>`<div><b>${x[0]}:</b> ${escapeText(x[1])}</div>`).join('')});
function escapeText(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
addEventListener('keydown',e=>{if(e.key==='ArrowRight')showPage(current+1);if(e.key==='ArrowLeft')showPage(current-1)});
if(location.hash){const i=pages.findIndex(p=>'#'+p.id===location.hash);if(i>=0)showPage(i)}

// Feedback works in Android browser previews too: prefer Gmail's web composer,
// and provide a copy-to-clipboard fallback instead of navigating to mailto:.
function feedbackPayload(){
  const val=id=>(document.getElementById(id)?.value||'').trim();
  return `Computer Networks Seminar Feedback\n\nName: ${val('feedbackName')}\nRegistration No.: ${val('feedbackReg')||'Not provided'}\nClass / Semester: ${val('feedbackClass')||'Not provided'}\nReply email: ${val('feedbackEmail')}\n\nFeedback:\n${val('feedbackMessage')}`;
}
const feedbackForm=document.getElementById('feedbackForm');
if(feedbackForm){
  // Carry any presenter details entered on the cover into the feedback form.
  const pairs=[['studentName','feedbackName'],['regNo','feedbackReg'],['classSem','feedbackClass']];
  pairs.forEach(([from,to])=>{const a=document.getElementById(from),b=document.getElementById(to);if(a&&b)a.addEventListener('input',()=>{if(!b.dataset.edited)b.value=a.value})});
  ['feedbackName','feedbackReg','feedbackClass'].forEach(id=>document.getElementById(id)?.addEventListener('input',e=>e.target.dataset.edited='1'));
  feedbackForm.addEventListener('submit',e=>{
    e.preventDefault();
    if(!feedbackForm.reportValidity())return;
    const subject='Computer Networks Seminar Feedback';
    const body=feedbackPayload();
    const url='https://mail.google.com/mail/?view=cm&fs=1&to=adb78161%40gmail.com&su='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
    const status=document.getElementById('feedbackStatus');
    status.textContent='Opening Gmail compose. Check the recipient and tap Send in Gmail to deliver your feedback.';
    const win=window.open(url,'_blank','noopener');
    if(!win){status.textContent='Your browser blocked the new tab. Tap “Copy feedback text”, then open Gmail and email adb78161@gmail.com.';}
  });
  document.getElementById('copyFeedback')?.addEventListener('click',async()=>{
    const text=feedbackPayload();const status=document.getElementById('feedbackStatus');
    try{await navigator.clipboard.writeText(text);status.textContent='Feedback copied. Open Gmail, address it to adb78161@gmail.com, paste the text, and send.'}
    catch(err){window.prompt('Copy this feedback text, then paste it into an email to adb78161@gmail.com:',text);status.textContent='Copy the text from the dialog and paste it into an email to adb78161@gmail.com.'}
  });
}

// Dedicated animated lesson view: selecting PAN/LAN/MAN/WAN opens a focused page.
const networkLessons = {
 pan:{title:'PAN — Personal Area Network',subtitle:'How your personal devices connect',desc:'A PAN connects devices close to one person. Bluetooth is commonly used for phones, earbuds and watches.',nodes:['Phone','Earbuds','Smartwatch','Laptop'],steps:['Turn on Bluetooth on the phone.','Pair the earbuds or watch.','Audio or small data packets travel wirelessly.'],example:'Example: play music on your phone and hear it through Bluetooth earbuds.',color:'#e65e9c',kind:'wireless'},
 lan:{title:'LAN — Local Area Network',subtitle:'How a computer lab connects',desc:'A LAN connects devices in a home, classroom, lab or office. Ethernet cables commonly link PCs to a switch; Wi-Fi devices connect through an access point.',nodes:['PC 01','PC 02','Switch','Printer','Router'],steps:['PCs send frames through Ethernet cables.','The switch forwards traffic to the correct device.','The router connects the LAN to other networks.'],example:'Example: a college lab shares a printer and internet connection.',color:'#26a9c7',kind:'wired'},
 man:{title:'MAN — Metropolitan Area Network',subtitle:'How networks connect across a city',desc:'A MAN links multiple LANs across a metropolitan area using provider infrastructure such as fibre-optic links and routers.',nodes:['Campus A','Metro Router','Office B','Campus C'],steps:['Each site has its own local network.','Routers send traffic into the provider network.','Fibre links carry data between sites across the city.'],example:'Example: several college campuses in one city share central services.',color:'#e7a13e',kind:'metro'},
 wan:{title:'WAN — Wide Area Network',subtitle:'How distant networks communicate',desc:'A WAN connects networks across regions, countries or continents. Routers forward packets over carrier links; the internet is the best-known example.',nodes:['Local LAN','Regional Router','Global Network','Remote Server'],steps:['Your device sends data to its local router.','Routers forward packets across provider networks.','The remote server replies through network routes.'],example:'Example: opening a website hosted in another country.',color:'#8b75dc',kind:'global'}
};
function connectionSvg(kind){
 const paths={
  wireless:['M105 165 C180 165 205 78 310 78','M105 165 C185 165 210 270 310 270','M310 78 C385 105 390 215 400 285'],
  wired:['M115 70 L400 165','M685 70 L400 165','M115 260 L400 165','M685 260 L400 165','M400 165 L400 300'],
  metro:['M100 165 L400 165','M400 165 L700 165','M400 165 L400 285','M100 165 Q230 30 400 165','M400 165 Q570 30 700 165'],
  global:['M95 165 C210 165 225 70 330 70','M330 70 C430 70 470 260 570 260','M570 260 C640 260 655 165 705 165','M95 165 C230 320 570 320 705 165']
 };
 const ds=paths[kind]||paths.wired;
 const lines=ds.map((d,i)=>`<path class="wire-path path-${i}" d="${d}"/>`).join('');
 // Both markers follow the very same red route, in opposite directions.
 const packets=ds.map((d,i)=>`<g class="packet-pair"><circle class="sender-dot" r="6"><animateMotion dur="${3.1+i*.35}s" repeatCount="indefinite" begin="${-i*.55}s" path="${d}"/></circle><circle class="receiver-dot" r="6"><animateMotion dur="${3.1+i*.35}s" repeatCount="indefinite" begin="${-i*.55}s" path="${d}" keyPoints="1;0" keyTimes="0;1" calcMode="linear"/></circle></g>`).join('');
 return `<svg class="connection-wires" viewBox="0 0 800 330" preserveAspectRatio="none" role="img" aria-label="Red connection paths with green sender and blue receiver dots moving in opposite directions">${lines}${packets}</svg>`;
}
function openNetworkLesson(type){
 const d=networkLessons[type]; if(!d)return;
 let view=document.getElementById('networkLessonView');
 if(!view){view=document.createElement('section');view.id='networkLessonView';view.className='network-lesson-view';view.setAttribute('aria-live','polite');document.querySelector('main').appendChild(view);}
 view.innerHTML=`<div class="lesson-toolbar"><button class="lesson-back" id="lessonBack">← Back to network types</button><span>INTERACTIVE NETWORK LAB</span></div><div class="lesson-hero"><p class="kicker">ANIMATED CONNECTION EXPLORER</p><h2>${d.title}</h2><h3>${d.subtitle}</h3><p>${d.desc}</p></div><div class="live-diagram" style="--lesson-accent:${d.color}"><div class="diagram-heading"><span>CONNECTION SIMULATION</span><span class="live-indicator">● DATA FLOW ACTIVE</span></div><div class="diagram-stage ${d.kind}">${connectionSvg(d.kind)}${d.nodes.map((n,i)=>`<div class="lesson-node node-${i+1}" style="--node-index:${i}"><div class="device-icon">${nodeIcon(n)}</div><b>${n}</b><small>${nodeCaption(n)}</small></div>`).join('')}<div class="packet packet-one"></div><div class="packet packet-two"></div><div class="packet packet-three"></div></div><div class="diagram-legend"><span><i class="legend-wire"></i> Red connection</span><span><i class="legend-sender"></i> Green sender</span><span><i class="legend-receiver"></i> Blue receiver</span><span>Illustrative data flow</span></div></div><div class="lesson-bottom-grid"><article class="lesson-info"><p class="kicker">HOW THE CONNECTION WORKS</p><ol>${d.steps.map(s=>`<li>${s}</li>`).join('')}</ol></article><article class="lesson-info example-info"><p class="kicker">REAL-WORLD EXAMPLE</p><p>${d.example}</p><button class="lesson-replay" id="replayAnimation">Replay connection ↻</button></article></div>`;
 document.querySelectorAll('.page').forEach(p=>{p.classList.remove('active');p.setAttribute('aria-hidden','true')});view.classList.add('active');document.getElementById('pageCount').textContent='LAB';document.getElementById('prevBtn').disabled=true;document.getElementById('nextBtn').textContent='Back to types';history.replaceState(null,'','#'+type+'-lab');window.scrollTo({top:0,behavior:'smooth'});
 document.getElementById('lessonBack').addEventListener('click',closeNetworkLesson);document.getElementById('replayAnimation').addEventListener('click',()=>{const stage=view.querySelector('.diagram-stage');const svg=stage.querySelector('.connection-wires');if(svg){const clone=svg.cloneNode(true);svg.replaceWith(clone);clone.querySelectorAll('animateMotion').forEach(a=>{try{a.beginElement()}catch(_){}})}stage.classList.remove('replay');void stage.offsetWidth;stage.classList.add('replay');});
}
function nodeIcon(n){
 const common='viewBox="0 0 64 64" aria-hidden="true" focusable="false"';
 if(/phone/i.test(n))return `<svg ${common}><rect x="19" y="4" width="26" height="56" rx="6"/><path d="M27 10h10M29 52h6"/><rect x="23" y="15" width="18" height="32" rx="2"/></svg>`;
 if(/earbud/i.test(n))return `<svg ${common}><path d="M20 12c-7 0-11 5-11 12v8c0 5 3 8 8 8s8-3 8-8V20c0-5-2-8-5-8zM44 12c7 0 11 5 11 12v8c0 5-3 8-8 8s-8-3-8-8V20c0-5 2-8 5-8z"/><path d="M17 40v9M47 40v9"/></svg>`;
 if(/watch/i.test(n))return `<svg ${common}><path d="M24 5h16l3 12H21zM24 47h16l3 12H21z"/><rect x="16" y="16" width="32" height="32" rx="8"/><circle cx="32" cy="32" r="9"/><path d="M32 25v8l5 3"/></svg>`;
 if(/pc|laptop/i.test(n))return `<svg ${common}><rect x="8" y="8" width="48" height="34" rx="4"/><path d="M4 49h56l-5 6H9zM18 15h28v20H18z"/><circle cx="32" cy="38" r="1"/></svg>`;
 if(/switch/i.test(n))return `<svg ${common}><rect x="5" y="17" width="54" height="30" rx="5"/><path d="M13 26h7v5h-7zM25 26h7v5h-7zM37 26h7v5h-7zM49 26h3v5h-3zM14 38h36M23 13l-4-4m4 4 4-4M41 51l4 4m-4-4-4 4"/></svg>`;
 if(/router/i.test(n))return `<svg ${common}><rect x="6" y="25" width="52" height="25" rx="6"/><path d="M17 25V12m30 13V12M13 37h7m6 0h7m6 0h7M21 18l-4-6-4 6M43 18l4-6 4 6"/></svg>`;
 if(/printer/i.test(n))return `<svg ${common}><path d="M18 23V8h28v15M18 44H9V25h46v19h-9M18 37h28v19H18z"/><circle cx="47" cy="31" r="2"/></svg>`;
 if(/server/i.test(n))return `<svg ${common}><rect x="12" y="5" width="40" height="54" rx="5"/><path d="M18 14h28v10H18zM18 30h28v10H18zM18 46h28v7H18z"/><circle cx="23" cy="19" r="1.5"/><circle cx="23" cy="35" r="1.5"/></svg>`;
 if(/campus|office|global network|local lan|region/i.test(n))return `<svg ${common}><path d="M8 57V20l24-13 24 13v37zM18 28h7v7h-7zM39 28h7v7h-7zM18 42h7v7h-7zM39 42h7v7h-7zM28 43h8v14h-8z"/></svg>`;
 return `<svg ${common}><circle cx="32" cy="32" r="23"/><circle cx="32" cy="32" r="13"/><circle cx="32" cy="32" r="4"/></svg>`;
}
function nodeCaption(n){if(/phone|earbud|watch/i.test(n))return 'Personal device';if(/pc|laptop/i.test(n))return 'End device';if(/switch/i.test(n))return 'Forwards frames';if(/router/i.test(n))return 'Forwards packets';if(/campus|office/i.test(n))return 'Local network';return 'Network endpoint'}
function closeNetworkLesson(){const v=document.getElementById('networkLessonView');if(v)v.classList.remove('active');showPage(2);document.getElementById('pageCount').textContent=String(current+1).padStart(2,'0')+' / '+String(pages.length).padStart(2,'0');document.getElementById('prevBtn').disabled=current===0;document.getElementById('nextBtn').textContent=current===pages.length-1?'Top ↑':'Next →';history.replaceState(null,'','#types')}
document.querySelectorAll('.detail-btn').forEach(btn=>{btn.textContent='Open animated lesson ↗';btn.addEventListener('click',()=>openNetworkLesson(btn.closest('.type-card').classList.contains('pan')?'pan':btn.closest('.type-card').classList.contains('lan')?'lan':btn.closest('.type-card').classList.contains('man')?'man':'wan'))});
const oldNext=document.getElementById('nextBtn');oldNext.addEventListener('click',()=>{const v=document.getElementById('networkLessonView');if(v?.classList.contains('active'))closeNetworkLesson()});
// Make the whole network card open its dedicated lesson, not only the button.
document.querySelectorAll('.type-card').forEach(card=>card.addEventListener('click',e=>{if(e.target.closest('button,.detail'))return;const type=['pan','lan','man','wan'].find(t=>card.classList.contains(t));if(type)openNetworkLesson(type)}));
