const pages = ["cover","gallery","lesson","feedback"];
function showPage(id){pages.forEach(p=>document.getElementById(p).classList.toggle("active",p===id));window.scrollTo({top:0,behavior:"smooth"});}
const coverForm=document.getElementById("coverForm");
coverForm.addEventListener("submit",e=>{e.preventDefault();const name=document.getElementById("studentName").value.trim();if(!name)return;localStorage.setItem("seminarPresenter",JSON.stringify({name,cls:document.getElementById("studentClass").value,roll:document.getElementById("rollNumber").value,to:document.getElementById("presentedTo").value}));showPage("gallery");});
const types=["PAN","LAN","MAN","WAN"];
const lessons={
PAN:{subtitle:"Personal Area Network",description:"A Personal Area Network connects devices around one individual over a very short distance. It is commonly used to connect a phone, laptop, smartwatch, earbuds, or wireless keyboard. Connections may use Bluetooth, USB, or other short-range technologies.",range:"A few centimetres to around 10 metres (technology-dependent)",examples:"Phone + smartwatch · Bluetooth earbuds · Laptop + wireless mouse",note:"PAN makes it easy for one person to exchange information between personal devices without needing a large network infrastructure.",nodes:[["PHONE",50,24,"▣"],["WATCH",22,72,"◷"],["LAPTOP",78,72,"▱"]]},
LAN:{subtitle:"Local Area Network",description:"A Local Area Network connects computers and other devices within a limited area such as a home, office, computer laboratory, or school building. Devices can share files, printers, applications, and an internet connection. Ethernet and Wi-Fi are common LAN technologies.",range:"Room, home, office, laboratory, or building",examples:"College computer lab · Office Wi-Fi · Home network",note:"LANs are usually privately managed and provide high-speed communication over a relatively small geographic area.",nodes:[["PC 01",18,28,"▣"],["SWITCH",50,50,"⌘"],["PC 02",82,28,"▣"],["PRINTER",50,83,"▤"]]},
MAN:{subtitle:"Metropolitan Area Network",description:"A Metropolitan Area Network connects multiple LANs across a city or a large campus. It enables communication between buildings, institutions, or offices that are spread across a metropolitan region. Fibre-optic links and high-capacity wireless connections may be used.",range:"A city or large metropolitan region",examples:"City-wide campus network · Municipal network · Connecting branches across a city",note:"MAN is larger than a LAN but generally smaller than a WAN. It can be operated by a large organisation, service provider, or public authority.",nodes:[["CAMPUS A",18,28,"▥"],["CITY LINK",50,50,"⌁"],["CAMPUS B",82,28,"▥"],["OFFICE",50,83,"▤"]]},
WAN:{subtitle:"Wide Area Network",description:"A Wide Area Network connects networks over very large geographic distances, such as across countries or continents. It links LANs and MANs using carrier networks, fibre-optic cables, leased lines, satellites, and other long-distance technologies. The internet is the best-known example of a WAN.",range:"Country, continent, or worldwide",examples:"The internet · International company network · Bank branches across countries",note:"WAN enables distant users and organisations to communicate and share resources across large geographic areas.",nodes:[["CITY A",15,30,"⌂"],["NETWORK",50,50,"◎"],["CITY B",85,30,"⌂"],["CLOUD",50,83,"☁"]]}
};
let current="PAN";
const cards=[...document.querySelectorAll(".helix-card")];
let rotation=0, dragging=false, startX=0, lastX=0, lastFrame=0;
const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let autoMotion=true, pointerInside=false;
function arrangeHelix(){
  const n=cards.length;
  cards.forEach((card,i)=>{
    const angle=(i*Math.PI*2/n)+rotation;
    const mobile=window.innerWidth<600;
    const radius=mobile?155:245;
    const x=Math.sin(angle)*radius;
    const y=Math.sin(angle*2)*58;
    const z=Math.cos(angle)*170;
    const depth=(Math.cos(angle)+1)/2;
    const scale=.76+depth*.27;
    card.style.transform=`translate3d(${x}px,${y}px,${z}px) rotateY(${-Math.sin(angle)*24}deg) rotateZ(${Math.sin(angle)*-2}deg) scale(${scale})`;
    card.style.zIndex=String(Math.round(z+250));
    card.style.opacity=String(.48+depth*.52);
    card.style.filter=`brightness(${.68+depth*.42})`;
    card.setAttribute("aria-pressed", depth>.92 ? "true":"false");
  });
}
function rotate(step){rotation+=step;arrangeHelix();}
function animateHelix(timestamp){
  if(!lastFrame) lastFrame=timestamp;
  const delta=Math.min((timestamp-lastFrame)/1000,.05);
  lastFrame=timestamp;
  if(autoMotion && !dragging && !pointerInside && !document.hidden && !reducedMotion){
    rotation+=delta*.34;
    arrangeHelix();
  }
  requestAnimationFrame(animateHelix);
}
document.getElementById("rotateLeft").addEventListener("click",()=>rotate(-Math.PI/8));
document.getElementById("rotateRight").addEventListener("click",()=>rotate(Math.PI/8));
cards.forEach(card=>card.addEventListener("click",()=>openLesson(card.dataset.type)));
const stage=document.getElementById("helixStage");
stage.addEventListener("pointerenter",()=>{pointerInside=true;});
stage.addEventListener("pointerleave",()=>{pointerInside=false;});
stage.addEventListener("pointerdown",e=>{dragging=true;startX=e.clientX;lastX=e.clientX;stage.setPointerCapture(e.pointerId);});
stage.addEventListener("pointermove",e=>{
  if(!dragging)return;
  const dx=e.clientX-lastX; lastX=e.clientX;
  rotation+=dx*.006;
  arrangeHelix();
});
stage.addEventListener("pointerup",()=>{dragging=false;});
stage.addEventListener("pointercancel",()=>{dragging=false;});
document.addEventListener("visibilitychange",()=>{lastFrame=0;});
requestAnimationFrame(animateHelix);
function openLesson(type){current=type;const data=lessons[type],idx=types.indexOf(type)+1;document.getElementById("lessonOverline").textContent=`NETWORK TYPE / 0${idx}`;document.getElementById("lessonTitle").innerHTML=`${type}<span>.</span>`;document.getElementById("lessonSubtitle").textContent=data.subtitle;document.getElementById("lessonDescription").textContent=data.description;document.getElementById("lessonRange").textContent=data.range;document.getElementById("lessonExamples").textContent=data.examples;document.getElementById("lessonNote").textContent=data.note;document.getElementById("diagramCaption").textContent=`${type} — illustrative device connections`;drawDiagram(data.nodes);document.getElementById("previousLesson").disabled=idx===1;document.getElementById("nextLesson").textContent=idx===4?"BACK TO HELIX →":"NEXT NETWORK →";showPage("lesson");}
function drawDiagram(nodes){const area=document.getElementById("networkDiagram");area.innerHTML="";const coords=nodes.map(n=>({x:n[1],y:n[2]}));const hub=coords.findIndex((_,i)=>nodes[i][0].includes("SWITCH")||nodes[i][0].includes("LINK")||nodes[i][0].includes("NETWORK")) ;const center=hub>=0?coords[hub]:{x:50,y:50};coords.forEach((p,i)=>{if(i===(hub>=0?hub:-1))return;const dx=(p.x-center.x)*2.6,dy=(p.y-center.y)*2.25,len=Math.sqrt(dx*dx+dy*dy),ang=Math.atan2(dy,dx)*180/Math.PI;const line=document.createElement("div");line.className="connection";line.style.left=`${center.x}%`;line.style.top=`${center.y}%`;line.style.width=`${len}px`;line.style.transform=`rotate(${ang}deg)`;area.appendChild(line);const packet=document.createElement("div");packet.className="packet";packet.style.left=`${center.x}%`;packet.style.top=`${center.y}%`;packet.style.setProperty("--dx",`${dx}px`);packet.style.setProperty("--dy",`${dy}px`);packet.style.animationDelay=`${i*.35}s`;area.appendChild(packet);});nodes.forEach((n,i)=>{const node=document.createElement("div");node.className="node"+(n[0].includes("SWITCH")||n[0].includes("LINK")?" router":"")+(n[0].includes("NETWORK")?" server":"");node.style.left=n[1]+"%";node.style.top=n[2]+"%";node.innerHTML=`<span class="node-icon">${n[3]}</span><span>${n[0]}</span>`;area.appendChild(node);});}
document.getElementById("previousLesson").addEventListener("click",()=>openLesson(types[Math.max(0,types.indexOf(current)-1)]));
document.getElementById("nextLesson").addEventListener("click",()=>{const i=types.indexOf(current);if(i===3)showPage("gallery");else openLesson(types[i+1]);});
document.getElementById("feedbackForm").addEventListener("submit",e=>{e.preventDefault();const name=document.getElementById("feedbackName").value.trim()||"Anonymous";const rating=document.querySelector('input[name="rating"]:checked').value;const message=document.getElementById("feedbackMessage").value.trim();const subject=encodeURIComponent("Computer Networks Seminar Feedback");const body=encodeURIComponent(`Name: ${name}\nRating: ${rating}/5\n\nFeedback:\n${message}\n\nSent from the Computer Networks Seminar website.`);window.location.href=`mailto:aditya586120@gmail.com?subject=${subject}&body=${body}`;});
arrangeHelix();window.addEventListener("resize",arrangeHelix);
