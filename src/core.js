/* Chikno core: i18n, theme, cart, dish drawer, transitions, cursor, scroll motion */
(function(){
'use strict';
const C=window.Chikno={};
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>Array.from(c.querySelectorAll(s));
C.$=$;C.$$=$$;
const root=document.documentElement;
/* storage with a shared in-memory fallback (used when the browser blocks storage, e.g. inside previews) */
function mem(){try{if(parent&&parent!==window)return parent.__chkMem||(parent.__chkMem={l:{},s:{}});}catch(e){}return window.__chkMem||(window.__chkMem=window.__CHK_MEM||{l:{},s:{}});}
function memSync(){try{if(parent&&parent!==window)parent.postMessage({chkMem:mem()},'*');}catch(e){}}
const store={get(k,d){let v=null;try{v=localStorage.getItem(k);}catch(e){v=k in mem().l?mem().l[k]:null;}try{return v===null?d:JSON.parse(v);}catch(e){return d;}},
  set(k,v){const j=JSON.stringify(v);try{localStorage.setItem(k,j);}catch(e){}mem().l[k]=j;memSync();}};
const ss={get(k){try{const v=sessionStorage.getItem(k);if(v!==null)return v;}catch(e){}return k in mem().s?mem().s[k]:null;},set(k,v){try{sessionStorage.setItem(k,v);}catch(e){}mem().s[k]=String(v);memSync();},del(k){try{sessionStorage.removeItem(k);}catch(e){}delete mem().s[k];memSync();}};
C.store=store;C.ss=ss;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(hover: hover) and (pointer: fine)').matches;
const G=typeof window.gsap!=='undefined';
const ST=G&&typeof window.ScrollTrigger!=='undefined';
const A=G&&!reduce;
Object.assign(C,{G,ST,A,reduce,fine});
if(ST)gsap.registerPlugin(ScrollTrigger);
if(!A){root.classList.add('no-anim');root.classList.remove('first','wiping');ss.del('chk-wipe');}
if(!fine)root.classList.add('no-cursor');
const PAGE=document.body.dataset.page||'home';C.PAGE=PAGE;
const FILE=window.__CHK_FILE||(location.pathname.split('/').pop()||'index.html');
const BUNDLE=!!window.__CHK_FILE;
function navTo(href){if(BUNDLE){memSync();try{parent.__chkNav(href);return;}catch(e){}try{parent.postMessage({chkNav:href},'*');return;}catch(e){}}location.href=href;}

C.PHONE='01222440044';C.WA='201222440044';
C.TALABAT='https://www.talabat.com/egypt/chikno-haram--el-taawun';
C.MAPS='https://www.google.com/maps/search/?api=1&query=30.0007687,31.1662965';
/* photos: embedded in the page (assets/img.js) – illustrative food photos, CC BY-SA 3.0 (see README). No internet needed. */
C.ph=id=>(id&&window.CHIKNO_IMG&&window.CHIKNO_IMG[id])||'';
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
C.esc=esc;

/* ---------------- data ---------------- */
const D=window.CHIKNO_DATA||{cats:[],items:[]};
C.cats=D.cats.map(a=>({id:a[0],icon:a[1],en:a[2],ar:a[3]}));
C.items=D.items.map(a=>({id:a[0],cat:a[1],price:a[2],img:a[3]||'',flags:a[4]||'',en:a[5],ar:a[6],den:a[7]||'',dar:a[8]||''}));
const byId={};C.items.forEach(i=>byId[i.id]=i);
C.item=id=>byId[id];
C.cat=id=>C.cats.find(c=>c.id===id);
C.inCat=id=>C.items.filter(i=>i.cat===id);

/* ---------------- copy ---------------- */
const T={
ar:{skip:'تخطي للمحتوى',pre_txt:'بنولّع الفحم…',cur_order:'اطلب',ann:'عرض النهارده: بوكس الكينج دجاج بـ 145 جنيه',ann_cta:'شوف العروض',close:'قفل',
nav_home:'الرئيسية',nav_menu:'المنيو',nav_offers:'العروض',nav_catering:'العزومات',nav_about:'عن تشيكنو',nav_reviews:'آراء الناس',nav_gallery:'الصور',nav_contact:'تواصل',p404:'الصفحة مش موجودة',
lang:'English',theme:'غيّر الوضع',cart:'طلبك',cart_s:'الطلب',menu_open:'القائمة',menu_close:'قفل',hotline:'الخط الساخن',address_t:'العنوان',address:'279 شارع فيصل الرئيسي – محطة المطبعة، الجيزة',
hours_t:'المواعيد',hours:'كل يوم من ١٠ الصبح لـ ٢ بالليل',open:'مفتوح دلوقتي',closed:'مقفول – بنفتح ١٠ الصبح',closes_in:'بيقفل الساعة ٢ بالليل',
cta_order:'اطلب دلوقتي',cta_menu:'شوف المنيو',cta_call:'اتصل',egp:'ج.م',ask_price:'السعر بالتليفون',add:'أضف للطلب',added:'اتضاف لطلبك',view_order:'شوف الطلب',cbar_items:'في طلبك',
popular:'الأكثر طلبًا',best:'الأكثر مبيعًا',spicy:'حار',family:'للعيلة',
f_hungry:'جعان؟',f_words:['اطلب دلوقتي','الشواية مستنياك','البوكس جاهز'],f_slogan:'ملوك الفرخة الشواية في فيصل والهرم.',f_pages:'الصفحات',f_more:'أكتر',follow:'تابعنا',
demo:'تصميم مقترح للعرض – مش الموقع الرسمي لتشيكنو · الصور توضيحية (CC BY-SA 3.0)',dish_note:'ملاحظة للمطبخ',dish_note_ph:'مثلًا: من غير مخلل، ثومية زيادة…',dish_pair:'بيتاكل معاه',dish_share:'شارك الطبق',dish_add:'أضف',
less:'أقل',more:'أكتر',link_copied:'اتنسخ لينك الطبق',extra_cheese:'زيادة جبنة',price_note:'الأسعار تقريبية وممكن تتغير، والصور توضيحية.',directions:'الاتجاهات',contact_us:'تواصل معانا',
whatsapp:'واتساب',talabat:'اطلب من طلبات',items_word:'صنف',scroll:'انزل',home_crumb:'الرئيسية'},
en:{skip:'Skip to content',pre_txt:'Lighting the charcoal…',cur_order:'Order',ann:'Today’s deal: Chicken King Box for 145 EGP',ann_cta:'See offers',close:'Close',
nav_home:'Home',nav_menu:'Menu',nav_offers:'Offers',nav_catering:'Catering',nav_about:'About',nav_reviews:'Reviews',nav_gallery:'Gallery',nav_contact:'Contact',p404:'Page not found',
lang:'العربية',theme:'Switch theme',cart:'Your order',cart_s:'Order',menu_open:'Menu',menu_close:'Close',hotline:'Hotline',address_t:'Address',address:'279 Faisal St, El-Matbaa station, Giza',
hours_t:'Hours',hours:'Every day, 10 AM – 2 AM',open:'Open now',closed:'Closed – opens 10 AM',closes_in:'Closes at 2 AM',
cta_order:'Order now',cta_menu:'View menu',cta_call:'Call',egp:'EGP',ask_price:'Price by phone',add:'Add to order',added:'Added to your order',view_order:'View order',cbar_items:'in your order',
popular:'Popular',best:'Best seller',spicy:'Spicy',family:'Family',
f_hungry:'Hungry?',f_words:['Order now','The grill is on','Your box is ready'],f_slogan:'Kings of grilled chicken in Faisal and Haram.',f_pages:'Pages',f_more:'More',follow:'Follow',
demo:'Concept design for presentation – not Chikno’s official website · Illustrative photos (CC BY-SA 3.0)',dish_note:'Note for the kitchen',dish_note_ph:'e.g. no pickles, extra garlic dip…',dish_pair:'Goes well with',dish_share:'Share this dish',dish_add:'Add',
less:'Less',more:'More',link_copied:'Dish link copied',extra_cheese:'Extra cheese',price_note:'Prices are indicative and may change; photos are illustrative.',directions:'Directions',contact_us:'Contact us',
whatsapp:'WhatsApp',talabat:'Order on Talabat',items_word:'dishes',scroll:'Scroll',home_crumb:'Home'}
};
C.T=T;
let lang=store.get('chk-lang','ar');if(lang!=='ar'&&lang!=='en')lang='ar';
let theme=root.dataset.theme||'dark';
C.lang=()=>lang;
C.t=k=>{const P=C.P&&C.P[lang];if(P&&P[k]!==undefined)return P[k];const v=T[lang][k];return v===undefined?k:v;};
C.nm=o=>o?(lang==='ar'?o.ar:o.en):'';
C.ds=o=>o?(lang==='ar'?o.dar:o.den):'';
C.rtl=()=>lang==='ar';

/* ---------------- render helpers ---------------- */
C.money=n=>n?`<span class="price">${n}<small>${C.t('egp')}</small></span>`:`<span class="price ask">${C.t('ask_price')}</span>`;
C.badges=it=>{let h='';if(it.flags.includes('b'))h+=`<span class="bdg hot">${C.t('best')}</span>`;else if(it.flags.includes('p'))h+=`<span class="bdg">${C.t('popular')}</span>`;if(it.flags.includes('s'))h+=`<span class="bdg sp">${C.t('spicy')}</span>`;return h;};
C.art=(it,o={})=>{const c=C.cat(it.cat)||{icon:'f-chicken'};
  return `<div class="art${o.cls?' '+o.cls:''}" data-fly>${o.top||''}${it.img?'':`<svg aria-hidden="true"><use href="#${c.icon}"/></svg>`}${it.img?`<img class="ph" src="${C.ph(it.img,o.w||640)}" alt="${esc(C.nm(it))}" loading="${o.eager?'eager':'lazy'}" decoding="async" onerror="this.remove()">`:''}</div>`;};
C.addBtn=(id,sm)=>`<button class="add${sm?' sm':''}" data-add="${id}" aria-label="${esc(C.t('add'))}: ${esc(C.nm(byId[id]))}"><svg class="ico pl"><use href="#i-plus"/></svg><svg class="ico ck"><use href="#i-check"/></svg></button>`;
C.card=(id,o={})=>{const it=byId[id];if(!it)return'';
  return `<article class="dish${o.cls?' '+o.cls:''}" data-dish="${id}" data-cursor tabindex="0"><div class="dish-in">${C.art(it,{top:`<div class="art-top">${C.badges(it)}</div>`})}<div class="dish-body"><h3>${esc(C.nm(it))}</h3><p>${esc(C.ds(it))}</p><div class="dish-foot">${C.money(it.price)}${C.addBtn(id)}</div></div></div></article>`;};
C.row=id=>{const it=byId[id];if(!it)return'';
  return `<div class="lrow" data-dish="${id}" data-hover-img="${it.img}" tabindex="0">${C.art(it,{w:200})}<div><h3>${esc(C.nm(it))} ${C.badges(it)}</h3><p>${esc(C.ds(it))}</p></div>${C.money(it.price)}${C.addBtn(id,true)}</div>`;};
C.stars=(n=5)=>'<span class="stars">'+'<svg><use href="#i-star"/></svg>'.repeat(n)+'</span>';
function addImgs(scope){$$('[data-img]',scope).forEach(el=>{if(el.querySelector(':scope>img.ph'))return;const im=new Image();im.className='ph';im.alt='';im.decoding='async';im.loading='lazy';im.src=C.ph(el.dataset.img,el.dataset.w);im.onerror=()=>im.remove();el.prepend(im);});}
C.addImgs=addImgs;

/* ---------------- cart ---------------- */
const EXTRAS={cheese:{p:6,ar:'زيادة جبنة',en:'Extra cheese'}};C.EXTRAS=EXTRAS;
let lines=(store.get('chk-cart2',[])||[]).filter(l=>l&&byId[l.id]&&l.q>0);
function saveCart(){store.set('chk-cart2',lines);dispatchEvent(new CustomEvent('chk:cart'));}
C.cart={
  lines:()=>lines.slice(),
  add(id,q,x,note){q=q||1;x=(x||[]).slice().sort();note=(note||'').trim().slice(0,140);const k=id+'|'+x.join(',')+'|'+note;const l=lines.find(l=>l.k===k);if(l)l.q=Math.min(99,l.q+q);else lines.push({k,id,q,x,note});saveCart();},
  setQ(k,q){const l=lines.find(l=>l.k===k);if(!l)return;l.q=Math.max(0,Math.min(99,q));if(!l.q)lines=lines.filter(x=>x!==l);saveCart();},
  remove(k){lines=lines.filter(l=>l.k!==k);saveCart();},
  clear(){lines=[];saveCart();},
  count(){return lines.reduce((a,l)=>a+l.q,0);},
  unit(l){const it=byId[l.id];if(!it||!it.price)return 0;return it.price+l.x.reduce((a,e)=>a+(EXTRAS[e]?EXTRAS[e].p:0),0);},
  total(){return lines.reduce((a,l)=>a+C.cart.unit(l)*l.q,0);},
  hasAsk(){return lines.some(l=>!byId[l.id].price);}
};
addEventListener('storage',e=>{if(e.key==='chk-cart2'){lines=(store.get('chk-cart2',[])||[]).filter(l=>byId[l.id]);dispatchEvent(new CustomEvent('chk:cart'));}});
function renderCartUI(){const n=C.cart.count();$$('.cart-count').forEach(c=>{c.dataset.n=n;c.textContent=n||'';});
  const cb=$('#cbar');if(cb){const show=n>0&&document.body.hasAttribute('data-cbar');cb.classList.toggle('on',show);$('#cbarTotal').innerHTML=C.cart.total()+`<small style="font-size:.6em;opacity:.7;margin-inline-start:4px">${C.t('egp')}</small>`;}}
addEventListener('chk:cart',renderCartUI);

/* ---------------- theme ---------------- */
function setTheme(t){theme=t;root.dataset.theme=t;const u=$('#themeIco use');if(u)u.setAttribute('href',t==='dark'?'#i-sun':'#i-moon');store.set('chk-theme',t);dispatchEvent(new CustomEvent('chk:theme'));}
C.theme=()=>theme;
function toggleTheme(e){const next=theme==='dark'?'light':'dark';
  if(document.startViewTransition&&A){const x=e&&e.clientX||innerWidth-40,y=e&&e.clientY||40;
    const vt=document.startViewTransition(()=>setTheme(next));
    vt.ready.then(()=>{const r=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
      root.animate({clipPath:[`circle(0px at ${x}px ${y}px)`,`circle(${r}px at ${x}px ${y}px)`]},{duration:750,easing:'cubic-bezier(.7,0,.2,1)',pseudoElement:'::view-transition-new(root)'});}).catch(()=>{});
  }else setTheme(next);}

/* ---------------- language ---------------- */
function splitWords(el){const t=el.textContent.trim();el.innerHTML=t.split(/\s+/).map(w=>`<span class="w"><span class="wi">${esc(w)}</span></span>`).join(' ');}
C.split=splitWords;
function applyLang(){
  root.lang=lang;root.dir=lang==='ar'?'rtl':'ltr';
  document.title=C.t('title')+(PAGE==='home'?'':(lang==='ar'?' – تشيكنو':' – Chikno'));
  $$('[data-i18n]').forEach(el=>{const v=C.t(el.dataset.i18n);if(typeof v==='string')el.innerHTML=v;});
  $$('[data-i18n-ph]').forEach(el=>{el.placeholder=C.t(el.dataset.i18nPh);});
  $$('[data-i18n-aria]').forEach(el=>el.setAttribute('aria-label',C.t(el.dataset.i18nAria)));
  const lb=$('#langBtn .lbl');if(lb)lb.textContent=lang==='ar'?'EN':'ع';
  const fr=$('#ftrRoll');if(fr)fr.textContent=C.t('f_words')[0];
  const mt=$('#menuBtn .mb-t');if(mt)mt.textContent=C.t(mnuOpen?'menu_close':'menu_open');
  if(C.page&&C.page.render)C.page.render();
  $$('[data-split]').forEach(splitWords);
  addImgs();updateOpen();renderCartUI();
  if(dishOpen)fillDish(dishOpen,true);
}
C.applyLang=applyLang;
function switchLang(){
  const next=lang==='ar'?'en':'ar';
  wipeInPlace(()=>{lang=next;store.set('chk-lang',lang);if(ctx){ctx.revert();ctx=null;}applyLang();bind();initScroll();intro(.05);},next==='en'?'English':'العربية');
}

/* ---------------- open status ---------------- */
function cairoHour(){try{return parseInt(new Intl.DateTimeFormat('en-GB',{hour:'numeric',hourCycle:'h23',timeZone:'Africa/Cairo'}).format(new Date()),10);}catch(e){return new Date().getHours();}}
C.isOpen=()=>{const h=cairoHour();return h>=10||h<2;};
C.cairoHour=cairoHour;
function updateOpen(){const o=C.isOpen();$$('[data-status]').forEach(s=>{s.classList.toggle('closed',!o);const sp=s.querySelector('span');if(sp)sp.textContent=C.t(o?'open':'closed');});}
setInterval(updateOpen,60000);

/* ---------------- toast / fly ---------------- */
let tt;C.toast=(m,link)=>{const t=$('#toast');if(!t)return;t.innerHTML=`<span>${m}</span>${link?`<a href="order.html">${C.t('view_order')}</a>`:''}`;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),2600);};
function cartTarget(){const m=$('#mCart');if(m&&m.offsetParent)return m;const c=$('#cartBtn');if(c&&c.offsetParent)return c;return $('#menuBtn');}
C.fly=src=>{const tgt=cartTarget();
  const bump=()=>{if(A&&tgt)gsap.fromTo(tgt,{scale:1.35},{scale:1,duration:.8,ease:'elastic.out(1,.35)'});};
  if(!A||!src||!tgt){bump();return;}
  const a=src.getBoundingClientRect(),b=tgt.getBoundingClientRect();if(!a.width){bump();return;}
  const fly=src.cloneNode(true);fly.classList.add('fly');fly.removeAttribute('loading');
  Object.assign(fly.style,{left:a.left+'px',top:a.top+'px',width:a.width+'px',height:a.height+'px',margin:0,inset:'auto',position:'fixed'});
  fly.style.left=a.left+'px';fly.style.top=a.top+'px';
  document.body.appendChild(fly);
  const dx=b.left+b.width/2-(a.left+a.width/2),dy=b.top+b.height/2-(a.top+a.height/2);
  gsap.timeline({onComplete:()=>{fly.remove();bump();}})
    .to(fly,{x:dx,duration:.85,ease:'power1.inOut'},0)
    .to(fly,{y:dy,duration:.85,ease:'back.in(1.4)'},0)
    .to(fly,{scale:.1,rotate:lang==='ar'?-300:300,borderRadius:'50%',duration:.85,ease:'power2.in'},0);
};
function addFrom(btn,id,q,x,note){C.cart.add(id,q,x,note);btn.classList.add('done');setTimeout(()=>btn.classList.remove('done'),1500);
  const host=btn.closest('[data-dish],.prow,.dr-panel,[data-flyroot]');const src=host&&(host.querySelector('[data-fly] img.ph')||host.querySelector('[data-fly]>svg')||host.querySelector('img.ph'));
  C.fly(src);C.toast('✓ '+C.t('added'),PAGE!=='order');}

/* ---------------- dish drawer ---------------- */
let dishOpen=null,dq=1;
const PAIRS={sandwiches:['a1','a3','d2'],meals:['a3','a8','d2'],pizza:['a1','a5','d2'],grills:['a8','a13','a11'],charcoal:['a8','a12','a3'],grilled:['a12','a8','a3'],kids:['a1','d1','d2'],sides:['a1','a3','d2'],sweets:['d2','a16','d3']};
function fillDish(id,keep){const it=byId[id];if(!it)return;const dr=$('#dish');const cat=C.cat(it.cat);
  if(!keep){dq=1;$('#drNote').value='';}
  $('.dr-media',dr).innerHTML=C.art(it,{w:900,eager:true});
  const dc=$('.dr-cat',dr);dc.textContent=C.nm(cat);dc.setAttribute('href','menu.html#cat-'+it.cat);
  $('.dr-badges',dr).innerHTML=C.badges(it)+(it.flags.includes('f')?`<span class="bdg fam">${C.t('family')}</span>`:'');
  $('#drName').textContent=C.nm(it);
  const al=$('.dr-alt',dr);al.textContent=lang==='ar'?it.en:it.ar;al.dir=lang==='ar'?'ltr':'rtl';
  $('.dr-desc',dr).textContent=C.ds(it);
  $('.dr-price',dr).innerHTML=C.money(it.price);
  const ex=$('.dr-extras',dr);const prev=$$('input:checked',ex).map(i=>i.value);
  ex.innerHTML=it.flags.includes('x')&&it.price?Object.entries(EXTRAS).map(([k,e])=>`<label class="check"><input type="checkbox" value="${k}" ${keep&&prev.includes(k)?'checked':''}><span class="grow">${e[lang]}</span><span class="p">+${e.p} ${C.t('egp')}</span></label>`).join(''):'';
  const pids=(PAIRS[it.cat]||['a3','a1','a12']).filter(p=>p!==id&&byId[p]);
  $('#drPairs').innerHTML=pids.map(p=>{const pi=byId[p];return `<div class="prow" data-dish="${p}" tabindex="0">${C.art(pi,{w:160})}<b>${esc(C.nm(pi))}</b>${C.money(pi.price)}${C.addBtn(p,true)}</div>`;}).join('');
  $('#drQty').textContent=dq;updateDishTotal();}
function updateDishTotal(){const it=byId[dishOpen];if(!it)return;const x=$$('#dish .dr-extras input:checked').map(i=>i.value);
  const unit=it.price?it.price+x.reduce((a,e)=>a+EXTRAS[e].p,0):0;
  $('#drAddTxt').innerHTML=unit?`${C.t('dish_add')} · ${unit*dq} ${C.t('egp')}`:C.t('add');$('#drQty').textContent=dq;}
C.openDish=id=>{if(!byId[id])return;const dr=$('#dish');const was=!!dishOpen;dishOpen=id;
  if(was&&A){gsap.to('#dish .dr-body,#dish .dr-media',{opacity:0,y:20,duration:.25,onComplete:()=>{fillDish(id);$('#dish .dr-panel').scrollTop=0;gsap.to('#dish .dr-body,#dish .dr-media',{opacity:1,y:0,duration:.5,ease:'expo.out'});}});}
  else fillDish(id);
  try{history.replaceState(null,'','#dish-'+id);}catch(e){}
  if(was)return;
  dr.classList.add('open');dr.setAttribute('aria-hidden','false');lockScroll(true);
  const mob=innerWidth<=700;
  if(A){gsap.timeline()
    .fromTo('#dish .dr-back',{opacity:0},{opacity:1,duration:.5})
    .fromTo('#dish .dr-panel',mob?{yPercent:100}:{xPercent:lang==='ar'?-100:100},mob?{yPercent:0,duration:.8,ease:'expo.out'}:{xPercent:0,duration:.8,ease:'expo.out'},0)
    .fromTo('#dish .dr-media .art',{clipPath:'inset(0 0 100% 0 round 20px)'},{clipPath:'inset(0 0 0% 0 round 20px)',duration:.9,ease:'expo.out'},.15)
    .fromTo('#dish .dr-body>*',{y:30,opacity:0},{y:0,opacity:1,stagger:.04,duration:.7,ease:'expo.out'},.25);}
  setTimeout(()=>{const x=$('#dish .dr-x');x&&x.focus({preventScroll:true});},50);};
function closeDish(instant){if(!dishOpen)return;dishOpen=null;const dr=$('#dish');
  try{if(/^#dish-/.test(location.hash))history.replaceState(null,'',location.pathname+location.search);}catch(e){}
  const done=()=>{dr.classList.remove('open');dr.setAttribute('aria-hidden','true');lockScroll(false);};
  if(!A||instant){done();return;}
  const mob=innerWidth<=700;
  gsap.timeline({onComplete:done}).to('#dish .dr-panel',mob?{yPercent:100,duration:.55,ease:'expo.in'}:{xPercent:lang==='ar'?-100:100,duration:.55,ease:'expo.in'}).to('#dish .dr-back',{opacity:0,duration:.3},'-=.25');}
C.closeDish=closeDish;
let locks=0;function lockScroll(on){locks=Math.max(0,locks+(on?1:-1));const l=locks>0;document.body.style.overflow=l?'hidden':'';if(lenis)l?lenis.stop():lenis.start();}

/* ---------------- menu overlay ---------------- */
let mnuOpen=false;
function openMenu(){const mnu=$('#mnu'),mb=$('#menuBtn');if(!mnu)return;mnuOpen=true;mb.setAttribute('aria-expanded','true');$('#menuBtn .mb-t').textContent=C.t('menu_close');$('#menuBtn .pm').textContent='−';
  $('#hdr').classList.remove('hide');lockScroll(true);
  const r=mb.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;
  if(!A){mnu.style.display='block';return;}
  gsap.timeline().set(mnu,{display:'block'})
    .fromTo(mnu,{clipPath:`circle(0px at ${x}px ${y}px)`},{clipPath:`circle(${Math.hypot(innerWidth,innerHeight)}px at ${x}px ${y}px)`,duration:.9,ease:'expo.inOut'})
    .fromTo('.mnu-links a',{yPercent:110},{yPercent:0,stagger:.05,duration:.8,ease:'expo.out'},'-=.45')
    .fromTo('.mnu-side>*',{y:20,opacity:0},{y:0,opacity:1,stagger:.06,duration:.6},'-=.6');}
function closeMenu(){if(!mnuOpen)return;const mnu=$('#mnu'),mb=$('#menuBtn');mnuOpen=false;mb.setAttribute('aria-expanded','false');$('#menuBtn .mb-t').textContent=C.t('menu_open');$('#menuBtn .pm').textContent='+';
  lockScroll(false);if(A)gsap.to('#mnuPrev',{opacity:0,scale:.6,duration:.3});
  const r=mb.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;
  if(!A){mnu.style.display='none';return;}
  gsap.timeline().to('.mnu-links a',{yPercent:-110,stagger:.03,duration:.4,ease:'power3.in'})
    .to(mnu,{clipPath:`circle(0px at ${x}px ${y}px)`,duration:.7,ease:'expo.inOut'},'-=.15').set(mnu,{display:'none'});}
C.closeMenu=closeMenu;

/* ---------------- transitions ---------------- */
const LABEL={'index.html':'nav_home','menu.html':'nav_menu','offers.html':'nav_offers','order.html':'cart','catering.html':'nav_catering','about.html':'nav_about','reviews.html':'nav_reviews','gallery.html':'nav_gallery','contact.html':'nav_contact'};
function go(href){const file=href.split('#')[0];const label=LABEL[file]?C.t(LABEL[file]):'';
  closeMenu();closeDish(true);
  if(!A){navTo(href);return;}
  ss.set('chk-wipe',label);
  const w=$('#wipe');$('#wipeTxt').textContent=label;
  gsap.timeline({onComplete:()=>{navTo(href);}})
    .set(w,{display:'flex'})
    .fromTo(w,{clipPath:'inset(100% 0% 0% 0%)'},{clipPath:'inset(0% 0% 0% 0%)',duration:.65,ease:'expo.inOut'})
    .fromTo('#wipeTxt',{yPercent:70,opacity:0},{yPercent:0,opacity:1,duration:.45,ease:'expo.out'},'-=.3');}
C.go=go;
function wipeInPlace(fn,label){const w=$('#wipe');$('#wipeTxt').textContent=label||'';
  if(!A){fn();return;}
  gsap.timeline().set(w,{display:'flex'})
    .fromTo(w,{clipPath:'inset(100% 0% 0% 0%)'},{clipPath:'inset(0% 0% 0% 0%)',duration:.6,ease:'expo.inOut'})
    .fromTo('#wipeTxt',{yPercent:60,opacity:0},{yPercent:0,opacity:1,duration:.5,ease:'expo.out'},'-=.25')
    .add(fn)
    .to(w,{clipPath:'inset(0% 0% 100% 0%)',duration:.65,ease:'expo.inOut',delay:.2})
    .set(w,{display:'none'});}
function wipeOut(cb){const w=$('#wipe');$('#wipeTxt').textContent=ss.get('chk-wipe')||'';ss.del('chk-wipe');
  gsap.timeline()
    .set(w,{display:'flex',clipPath:'inset(0% 0% 0% 0%)'})
    .add(()=>root.classList.remove('wiping'))
    .to('#wipeTxt',{yPercent:-60,opacity:0,duration:.4,ease:'power3.in',delay:.15})
    .to(w,{clipPath:'inset(0% 0% 100% 0%)',duration:.8,ease:'expo.inOut'},'-=.1')
    .add(cb,'-=.5')
    .set(w,{display:'none'});}
addEventListener('pageshow',e=>{if(e.persisted){root.classList.remove('wiping');const w=$('#wipe');if(w)w.style.display='none';if(G)gsap.set(w,{display:'none'});}});

function scrollToEl(t,off){if(lenis)lenis.scrollTo(t,{offset:off==null?-90:off,duration:1.4});else if(t===0)scrollTo({top:0,behavior:reduce?'auto':'smooth'});else{const y=t.getBoundingClientRect().top+scrollY+(off==null?-90:off);scrollTo({top:y,behavior:reduce?'auto':'smooth'});}}
C.scrollTo=scrollToEl;
function handleHash(h){h=h||location.hash||window.__CHK_HASH||'';if(!h||h==='#')return false;
  if(h.startsWith('#dish-')){C.openDish(h.slice(6));return true;}
  if(C.page&&C.page.hash&&C.page.hash(h))return true;
  const el=document.getElementById(decodeURIComponent(h.slice(1)));if(el){scrollToEl(el);return true;}return false;}

/* ---------------- delegation ---------------- */
document.addEventListener('click',e=>{
  const addB=e.target.closest('[data-add]');
  if(addB){e.preventDefault();e.stopPropagation();addFrom(addB,addB.dataset.add,1);return;}
  if(e.target.closest('[data-close]')){closeDish();return;}
  const dq_=e.target.closest('[data-dq]');if(dq_){dq=Math.max(1,Math.min(99,dq+(+dq_.dataset.dq)));updateDishTotal();return;}
  const dish=e.target.closest('[data-dish]');
  if(dish&&!e.target.closest('a[href]:not([data-dish])')){e.preventDefault();C.openDish(dish.dataset.dish);return;}
  const a=e.target.closest('a[href]');
  if(a&&!a.target&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey&&e.button===0){
    const href=a.getAttribute('href');
    if(href.startsWith('#')){e.preventDefault();closeMenu();if(href==='#top'||href==='#')scrollToEl(0);else handleHash(href);return;}
    const m=href.match(/^([\w-]+\.html)(#.*)?$/);
    if(m){e.preventDefault();if(m[1]===FILE){closeMenu();if(m[2])handleHash(m[2]);else scrollToEl(0);}else go(href);}
  }
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){if(dishOpen)closeDish();else closeMenu();}
  if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('[data-dish]')){e.preventDefault();C.openDish(e.target.dataset.dish);}
});
document.addEventListener('change',e=>{if(e.target.closest('#dish .dr-extras'))updateDishTotal();});

/* ---------------- cursor / magnetic / tilt / hover image ---------------- */
let ring,cur;
function cursorInit(){ring=$('#ring');cur=$('#cur');if(!fine||!G||!ring)return;
  const rx=gsap.quickTo(ring,'x',{duration:.45,ease:'power3'}),ry=gsap.quickTo(ring,'y',{duration:.45,ease:'power3'});
  addEventListener('mousemove',e=>{gsap.set(cur,{x:e.clientX,y:e.clientY});rx(e.clientX);ry(e.clientY);},{passive:true});
  addEventListener('mousedown',()=>gsap.to(ring,{scale:.8,duration:.2}));addEventListener('mouseup',()=>gsap.to(ring,{scale:1,duration:.3}));
  document.addEventListener('mouseover',e=>{const t=e.target.closest('[data-cursor],a,button,input,select,textarea,label,[data-dish]');
    ring.classList.toggle('label',!!(t&&t.matches('[data-cursor]')));ring.classList.toggle('big',!!(t&&!t.matches('[data-cursor]')));
    ring.classList.toggle('hide',!!e.target.closest('input,textarea,select'));});
  document.addEventListener('mouseleave',()=>gsap.to([ring,cur],{opacity:0,duration:.2}));
  document.addEventListener('mouseenter',()=>gsap.to([ring,cur],{opacity:1,duration:.2}));}
function bind(scope){if(!fine||!A)return;
  $$('.magnetic',scope).forEach(el=>{if(el._mg)return;el._mg=1;
    el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();gsap.to(el,{x:(e.clientX-r.left-r.width/2)*.3,y:(e.clientY-r.top-r.height/2)*.4,duration:.4,ease:'power3'});});
    el.addEventListener('mouseleave',()=>gsap.to(el,{x:0,y:0,duration:.9,ease:'elastic.out(1,.35)'}));});
  $$('.dish',scope).forEach(d=>{if(d._tl)return;d._tl=1;const inn=$('.dish-in',d);if(!inn)return;
    d.addEventListener('mousemove',e=>{const r=d.getBoundingClientRect();gsap.to(inn,{rotateY:((e.clientX-r.left)/r.width-.5)*14,rotateX:-((e.clientY-r.top)/r.height-.5)*14,duration:.5,ease:'power3'});});
    d.addEventListener('mouseleave',()=>gsap.to(inn,{rotateY:0,rotateX:0,duration:1,ease:'elastic.out(1,.4)'}));});}
C.bind=bind;
function hoverImg(){if(!fine||!A)return;const box=document.createElement('div');box.className='hover-img';box.innerHTML='<img alt="">';document.body.appendChild(box);const im=box.firstChild;
  const qx=gsap.quickTo(box,'x',{duration:.7,ease:'power3'}),qy=gsap.quickTo(box,'y',{duration:.7,ease:'power3'});let last=0,lx=0,on=null;
  addEventListener('mousemove',e=>{qx(e.clientX+(lang==='ar'?-190:190));qy(e.clientY);const v=e.clientX-lx;lx=e.clientX;if(on)gsap.to(box,{rotate:Math.max(-12,Math.min(12,v*.6)),duration:.6});},{passive:true});
  document.addEventListener('mouseover',e=>{const r=e.target.closest('[data-hover-img]');if(r===on)return;on=r;
    if(r&&r.dataset.hoverImg){const src=C.ph(r.dataset.hoverImg,640);if(im.getAttribute('src')!==src)im.src=src;gsap.to(box,{opacity:1,scale:1,duration:.5,ease:'back.out(1.6)'});}
    else gsap.to(box,{opacity:0,scale:.7,duration:.3});});}

/* ---------------- sparks ---------------- */
C.sparks=cv=>{if(!cv||reduce)return;const c=cv.getContext('2d');let W,H,run=true;const dpr=Math.min(devicePixelRatio||1,2);
  const N=innerWidth<700?40:100,ps=[];
  function rs(){W=cv.width=Math.max(1,cv.offsetWidth*dpr);H=cv.height=Math.max(1,cv.offsetHeight*dpr);}
  function sp(p,init){p.x=Math.random()*W;p.y=init?Math.random()*H:H+Math.random()*60*dpr;p.vy=(.5+Math.random()*1.6)*dpr;p.vx=(Math.random()-.5)*.5*dpr;p.r=(.6+Math.random()*2)*dpr;p.l=0;p.m=160+Math.random()*260;p.s=Math.random()*100;p.h=14+Math.random()*30;}
  rs();for(let i=0;i<N;i++){const p={};sp(p,true);ps.push(p);}
  addEventListener('resize',rs);
  let mx=-1,my=-1;cv.parentElement.addEventListener('mousemove',e=>{const r=cv.getBoundingClientRect();mx=(e.clientX-r.left)*dpr;my=(e.clientY-r.top)*dpr;});
  if('IntersectionObserver' in window)new IntersectionObserver(es=>{const was=run;run=es[0].isIntersecting;if(run&&!was)requestAnimationFrame(f);}).observe(cv);
  function f(){if(!run)return;c.clearRect(0,0,W,H);const light=theme==='light';c.globalCompositeOperation=light?'source-over':'lighter';
    for(const p of ps){p.l++;p.y-=p.vy;p.x+=p.vx+Math.sin((p.l+p.s)*.04)*.6*dpr;
      if(mx>0){const dx=p.x-mx,dy=p.y-my,dd=Math.hypot(dx,dy)||1;if(dd<120*dpr){p.x+=dx/dd*2;p.y+=dy/dd*1.5;}}
      const a=Math.sin(Math.PI*Math.min(p.l/p.m,1));
      c.beginPath();c.arc(p.x,p.y,p.r*3,0,6.283);c.fillStyle=`hsla(${p.h},100%,${light?45:55}%,${a*.12})`;c.fill();
      c.beginPath();c.arc(p.x,p.y,p.r,0,6.283);c.fillStyle=`hsla(${p.h+10},100%,${light?50:70}%,${a*.9})`;c.fill();
      if(p.l>p.m||p.y<-20)sp(p,false);}
    requestAnimationFrame(f);}
  requestAnimationFrame(f);};

/* ---------------- marquee ---------------- */
const mqs=[];
C.marquee=(box,html,o={})=>{if(!box)return;const tr=$('.mq-track',box);const reps=o.reps||3;let g='';for(let i=0;i<reps;i++)g+=`<div class="mq-group"${i?' aria-hidden="true"':''}>${html}</div>`;tr.innerHTML=g;addImgs(box);
  if(box._tw){box._tw.kill();const i=mqs.indexOf(box._tw);if(i>-1)mqs.splice(i,1);box._tw=null;}
  if(!A)return;const rev=!!o.reverse!==(lang==='ar');const pct=-100/reps;
  const tw=rev?gsap.fromTo(tr,{xPercent:pct},{xPercent:0,duration:o.dur||40,ease:'none',repeat:-1}):gsap.fromTo(tr,{xPercent:0},{xPercent:pct,duration:o.dur||40,ease:'none',repeat:-1});
  box._tw=tw;mqs.push(tw);
  box.onmouseenter=()=>gsap.to(tw,{timeScale:.15,duration:.6});box.onmouseleave=()=>gsap.to(tw,{timeScale:1,duration:.6});};

/* ---------------- segmented control ---------------- */
C.seg=(el,onChange)=>{if(!el)return;let ind=$('.seg-ind',el);if(!ind){ind=document.createElement('i');ind.className='seg-ind';el.prepend(ind);}
  const place=()=>{const b=$('[aria-pressed="true"]',el);if(!b)return;ind.style.left=b.offsetLeft+'px';ind.style.width=b.offsetWidth+'px';};
  el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!el.contains(b))return;$$('button',el).forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));place();onChange&&onChange(b.dataset.v);});
  place();addEventListener('resize',place);setTimeout(place,300);el._place=place;};

/* ---------------- accordion ---------------- */
document.addEventListener('click',e=>{const b=e.target.closest('.acc-btn');if(!b)return;const acc=b.closest('.acc');const open=!acc.classList.contains('open');
  const grp=acc.parentElement;if(grp&&grp.hasAttribute('data-single'))$$('.acc.open',grp).forEach(x=>{if(x!==acc){x.classList.remove('open');$('.acc-btn',x).setAttribute('aria-expanded','false');}});
  acc.classList.toggle('open',open);b.setAttribute('aria-expanded',open);setTimeout(()=>ST&&ScrollTrigger.refresh(),600);});

/* ---------------- scroll motion ---------------- */
let lenis=null,ctx=null;
function reveals(){
  const rtl=lang==='ar';
  $$('[data-split]:not([data-split="intro"])').forEach(h=>gsap.from($$('.wi',h),{yPercent:115,rotate:rtl?-5:5,stagger:.06,duration:1,ease:'expo.out',scrollTrigger:{trigger:h,start:'top 88%'}}));
  $$('[data-fade]').forEach(el=>gsap.from(el,{y:40,opacity:0,duration:1,ease:'expo.out',scrollTrigger:{trigger:el,start:'top 92%'}}));
  $$('[data-stagger]').forEach(el=>{const kids=Array.from(el.children);if(!kids.length)return;gsap.from(kids,{y:60,opacity:0,stagger:.07,duration:1,ease:'expo.out',scrollTrigger:{trigger:el,start:'top 88%'}});});
  $$('[data-reveal]').forEach(el=>gsap.fromTo(el,{clipPath:'inset(14% 6% 14% 6% round 40px)'},{clipPath:'inset(0% 0% 0% 0% round 0px)',duration:1.4,ease:'expo.out',scrollTrigger:{trigger:el,start:'top 85%'}}));
  $$('[data-parallax]').forEach(el=>{const v=parseFloat(el.dataset.parallax)||.2;gsap.fromTo(el,{yPercent:-v*50},{yPercent:v*50,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:true}});});
  $$('[data-count]').forEach(el=>{const end=parseFloat(el.dataset.count),dec=+el.dataset.dec||0,suf=el.dataset.suffix||'';const o={v:0};el.textContent=(0).toFixed(dec)+suf;
    ScrollTrigger.create({trigger:el,start:'top 92%',once:true,onEnter:()=>gsap.to(o,{v:end,duration:2,ease:'expo.out',onUpdate:()=>{el.textContent=o.v.toFixed(dec)+suf;}})});});
  $$('[data-draw]').forEach(p=>{let len=300;try{len=p.getTotalLength();}catch(e){}p.style.strokeDasharray=len;gsap.fromTo(p,{strokeDashoffset:len},{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:p.closest('[data-draw-root]')||p,start:'top 75%',end:'bottom 55%',scrub:true}});});
  gsap.from('.ftr-big',{yPercent:60,opacity:0,stagger:.12,duration:1.2,ease:'expo.out',scrollTrigger:{trigger:'.ftr',start:'top 85%'}});
}
function initScroll(){if(!ST||!A)return;if(ctx)ctx.revert();
  ctx=gsap.context(()=>{reveals();if(C.page&&C.page.scroll)C.page.scroll();});
  requestAnimationFrame(()=>ScrollTrigger.refresh());}
C.refresh=()=>{if(ST)ScrollTrigger.refresh();};
function intro(delay){if(!A)return;const tl=gsap.timeline({delay:delay||0});
  const sp=$$('[data-split="intro"] .wi');if(sp.length)tl.from(sp,{yPercent:120,rotate:lang==='ar'?-8:8,stagger:.07,duration:1.2,ease:'expo.out'});
  const it=$$('[data-intro]');if(it.length)tl.from(it,{y:30,opacity:0,stagger:.08,duration:.9,ease:'expo.out'},sp.length?'-=.85':0);
  if(C.page&&C.page.intro)C.page.intro(tl);}

/* header behaviour */
let lastY=0;
function onScroll(){const y=scrollY,h=$('#hdr');if(!h)return;h.classList.toggle('solid',y>40);
  if(!mnuOpen&&!dishOpen)h.classList.toggle('hide',y>lastY&&y>400);if(y<lastY)h.classList.remove('hide');lastY=y;}
addEventListener('scroll',onScroll,{passive:true});

/* footer words */
let fi=0;setInterval(()=>{const el=$('#ftrRoll');if(!el)return;const w=C.t('f_words');fi=(fi+1)%w.length;
  if(!A){el.textContent=w[fi];return;}
  gsap.to(el,{yPercent:-100,opacity:0,duration:.45,ease:'power3.in',onComplete:()=>{el.textContent=w[fi];gsap.fromTo(el,{yPercent:100,opacity:0},{yPercent:0,opacity:1,duration:.7,ease:'expo.out'});}});},2600);

/* ---------------- static bindings ---------------- */
function bindStatic(){
  const tb=$('#themeBtn');tb&&tb.addEventListener('click',toggleTheme);
  const lb=$('#langBtn');lb&&lb.addEventListener('click',switchLang);
  const mb=$('#menuBtn');mb&&mb.addEventListener('click',()=>mnuOpen?closeMenu():openMenu());
  const ax=$('#annX');if(ax){if(ss.get('chk-ann')){const a=$('#ann');a&&a.remove();}
    else ax.addEventListener('click',()=>{ss.set('chk-ann','1');const a=$('#ann');if(A)gsap.to(a,{height:0,duration:.5,ease:'expo.inOut',onComplete:()=>{a.remove();C.refresh();}});else a.remove();});}
  const da=$('#drAdd');da&&da.addEventListener('click',()=>{if(!dishOpen)return;const x=$$('#dish .dr-extras input:checked').map(i=>i.value);const id=dishOpen;
    addFrom(da,id,dq,x,$('#drNote').value);setTimeout(()=>closeDish(),650);});
  const sh=$('#drShare');sh&&sh.addEventListener('click',async()=>{if(!dishOpen)return;let url='menu.html#dish-'+dishOpen;try{url=BUNDLE?(parent.location.href.split('#')[0]+'#/menu.html#dish-'+dishOpen):new URL(url,location.href).href;}catch(e){}const it=byId[dishOpen];
    try{if(navigator.share){await navigator.share({title:C.nm(it)+' – Chikno',url});return;}}catch(e){return;}
    try{await navigator.clipboard.writeText(url);C.toast('✓ '+C.t('link_copied'));}catch(e){prompt('',url);}});
  // menu photo preview
  if(fine&&G){const pv=$('#mnuPrev');if(pv){const px=gsap.quickTo(pv,'x',{duration:.6,ease:'power3'}),py=gsap.quickTo(pv,'y',{duration:.6,ease:'power3'});
    $$('.mnu-links a').forEach(a=>{a.addEventListener('mouseenter',()=>{$('#mnuPrevImg').src=C.ph(a.dataset.photo,480);gsap.to(pv,{opacity:1,scale:1,rotate:gsap.utils.random(-10,10),duration:.5,ease:'back.out(1.7)'});});
      a.addEventListener('mouseleave',()=>gsap.to(pv,{opacity:0,scale:.6,duration:.3}));});
    $('#mnu').addEventListener('mousemove',e=>{px(e.clientX);py(e.clientY);});}}
  // swipe down to close drawer on mobile
  const pan=$('#dish .dr-panel');if(pan){let sy=null;pan.addEventListener('touchstart',e=>{sy=pan.scrollTop<=0?e.touches[0].clientY:null;},{passive:true});
    pan.addEventListener('touchend',e=>{if(sy!==null&&e.changedTouches[0].clientY-sy>110)closeDish();sy=null;},{passive:true});}
}

/* ---------------- boot ---------------- */
C.init=(page)=>{C.page=page||{};C.P=C.page.dict||null;
  setTheme(theme);applyLang();bindStatic();cursorInit();hoverImg();bind();renderCartUI();onScroll();
  if(ST&&A&&window.Lenis){lenis=new Lenis({lerp:.09,smoothWheel:true});
    lenis.on('scroll',e=>{ScrollTrigger.update();const v=Math.min(Math.abs(e.velocity||0)/20,5);if(v>.4)mqs.forEach(t=>gsap.to(t,{timeScale:1+v,duration:.2,overwrite:true,onComplete:()=>gsap.to(t,{timeScale:1,duration:1.2,overwrite:true})}));});
    gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);C.lenis=lenis;}
  const start=()=>{initScroll();intro(0);setTimeout(()=>handleHash(),A?700:0);};
  if(A&&root.classList.contains('first')){
    lockScroll(true);const o={v:0},pre=$('#pre');
    gsap.timeline()
      .to(o,{v:100,duration:1.6,ease:'power2.inOut',onUpdate:()=>{$('#preNum').textContent=Math.round(o.v);$('#preBar').style.width=o.v+'%';}})
      .to(pre,{yPercent:-100,duration:1,ease:'expo.inOut'})
      .add(()=>{root.classList.remove('first');pre.remove();lockScroll(false);start();},'-=.45');
  }else if(A&&root.classList.contains('wiping')){
    lockScroll(true);wipeOut(()=>{lockScroll(false);start();});
  }else{root.classList.remove('first','wiping');const pre=$('#pre');pre&&pre.remove();start();}
  ss.set('chk-seen','1');
  addEventListener('load',()=>C.refresh());
};
})();
