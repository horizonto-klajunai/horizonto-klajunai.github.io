'use strict';
const $=id=>document.getElementById(id);
function node(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
// Try common image extensions if a configured local image is missing.
function candidates(src){
 if(!src)return [];
 if(!/^\.?\/?images\//i.test(src))return [src];
 const match=src.match(/^(.*)\.(jpe?g|png|webp|avif)$/i);
 if(!match)return [src];
 const exts=['jpg','jpeg','webp','png','avif','JPG','JPEG','WEBP','PNG','AVIF'];
 return [...new Set([src,...exts.map(ext=>match[1]+'.'+ext)])];
}
const resolvedPhotos=new Map();
function loadImage(img,src,onload,onerror){
 const paths=resolvedPhotos.has(src)?[resolvedPhotos.get(src),...candidates(src).filter(x=>x!==resolvedPhotos.get(src))]:candidates(src);
 let i=0;
 img.onload=()=>{resolvedPhotos.set(src,paths[i-1]);onload();};
 const next=()=>{if(i<paths.length){img.src=paths[i++];}else onerror();};
 img.onerror=next;next();
}
function photo(el,src,alt,eager=false){
 if(!src){el.classList.remove('has-image');el.replaceChildren(node('span','photo-label',alt));return;}
 const old=el.querySelector('img');
 if(old&&el.dataset.source===src){old.alt=alt;const label=el.querySelector('.photo-label');if(label)label.textContent=alt+' · '+src.split('/').pop();return;}
 el.dataset.source=src;el.classList.remove('has-image');el.replaceChildren(node('span','photo-label',alt+' · '+src.split('/').pop()));
 const img=new Image();img.alt=alt;img.decoding='async';if(!eager)img.loading='lazy';el.append(img);
 loadImage(img,src,()=>{if(img.parentNode===el)el.classList.add('has-image');},()=>{if(img.parentNode===el){img.remove();el.classList.remove('has-image');}});
}
const icons={horse:'<path d="M9 52c5-12 6-26 19-33l-2-12 10 8 7-4 1 11 10 13-5 6-14-7c-5 5-6 11-6 18M6 57h48M40 26h.1"/>',riding:'<path d="M8 21h14l8 10h19l4-10h5v15l-8 4H20L8 33zM24 40v16h12V40M12 15l8 6M47 16l5 5"/>',camera:'<rect x="6" y="19" width="52" height="33" rx="4"/><path d="M20 19l5-8h14l5 8"/><circle cx="32" cy="35" r="11"/>',heart:'<path d="M32 54 9 31C-2 14 21 7 32 23 43 7 66 14 55 31Z"/>'};
async function init(){
 const s=window.SITE; if(!s || !s.translations) throw Error('config.js missing or invalid');
 const allowed=['lt','en','ru'];let lang='lt',active=0,mapLoaded=false;
 const queryLang=new URLSearchParams(location.search).get('lang');let saved;try{saved=localStorage.getItem('horizonto-language');}catch{};if(allowed.includes(queryLang))lang=queryLang;else if(allowed.includes(saved))lang=saved;
 const t=k=>s.translations[lang]?.[k]??s.translations.lt[k]??k;
 const localized=v=>typeof v==='string'?v:(v?.[lang]??v?.lt??'');
 const dialog=$('lightbox'),dots=$('slide-dots'),gallery=s.gallery||[];
 const mapQuery=s.mapQuery||s.address||'';let embed='';
 if(s.mapEmbedUrl){try{const u=new URL(s.mapEmbedUrl);if(u.protocol==='https:'&&['www.google.com','maps.google.com'].includes(u.hostname)&&((u.pathname==='/maps/embed'&&u.searchParams.has('pb'))||(u.pathname==='/maps'&&u.searchParams.get('output')==='embed')||u.pathname.startsWith('/maps/embed/v1/')))embed=u.href;}catch{}}
 if(!embed&&mapQuery)embed='https://www.google.com/maps?q='+encodeURIComponent(mapQuery)+'&z=15&output=embed';
 function mapUrl(){if(!embed)return '';const u=new URL(embed);u.searchParams.set('hl',lang);return u.href;}
 function loadMap(){if(!embed)return;const frame=node('iframe');frame.title=t('mapTitle');frame.src=mapUrl();frame.allowFullscreen=true;frame.loading='lazy';frame.referrerPolicy='strict-origin-when-cross-origin';$('map').replaceChildren(frame);mapLoaded=true;}
 function show(i){if(!gallery.length)return;active=(i+gallery.length)%gallery.length;const item=gallery[active],alt=localized(item.alt)||`${t('photo')} ${active+1}`;photo($('slide-photo'),item.src,alt,true);$('slide-count').textContent=`${active+1} / ${gallery.length}`;Array.from(dots.children).forEach((b,j)=>{b.setAttribute('aria-current',String(j===active));b.setAttribute('aria-label',`${t('photo')} ${j+1}`);});if(dialog.open){photo($('lightbox-photo'),item.src,alt,true);$('photo-count').textContent=`${active+1} / ${gallery.length}`;$('photo-caption').textContent=alt;}}
 function render(){
  document.documentElement.lang=lang;document.querySelector('meta[name="description"]').content=t('heroText')+' '+t('heroSub');
  document.querySelectorAll('[data-i]').forEach(e=>e.textContent=t(e.dataset.i));document.querySelectorAll('[data-aria]').forEach(e=>e.setAttribute('aria-label',t(e.dataset.aria)));document.querySelectorAll('[data-lang]').forEach(e=>e.setAttribute('aria-pressed',String(e.dataset.lang===lang)));
  $('draft').hidden=!s.draft;$('demo-contact').hidden=!s.demoContacts;
  photo($('hero-photo'),s.images?.hero,t('heroAlt'),true);photo($('owner-photo'),s.images?.owner,t('ownerAlt'));
  $('horse-facts').replaceChildren();[['breed',s.breed],['age',s.age]].forEach(([key,val])=>{if(!val&&!s.draft)return;const e=node('div');e.append(node('span','',t(key)+':'),node('strong','',localized(val)||t('unknown')));$('horse-facts').append(e);});
  $('services-intro').textContent=t(s.draft?'servicesIntro':'servicesLive');$('services').replaceChildren();
  (s.services||[]).filter(x=>s.draft||!x.example).forEach(x=>{const a=node('article','service'),visual=node('div','service-icon');visual.innerHTML='<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(icons[x.icon]||icons.heart)+'</svg>';a.append(visual,node('h3','',localized(x.title)),node('p','',localized(x.text)));if(s.draft&&x.example)a.append(node('div','service-meta',t('example')));if(x.duration||s.draft)a.append(node('p','service-meta',t('duration')+': '+(localized(x.duration)||t('unknown'))));if(x.price||s.draft)a.append(node('p','price',t('price')+': '+(localized(x.price)||t('unknown'))));$('services').append(a);});
  const openFAQ=Array.from($('faq-list').children).map(x=>x.open);$('faq-list').replaceChildren();(s.faq||[]).forEach((x,i)=>{const d=node('details');d.open=!!openFAQ[i];d.append(node('summary','',localized(x.question)),node('p','',localized(x.answer)));$('faq-list').append(d);});
  $('address').textContent=s.address||t('addressMissing');$('directions').hidden=!mapQuery;if(mapQuery)$('directions').href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(mapQuery);
  if(mapLoaded){const frame=$('map').querySelector('iframe');frame.title=t('mapTitle');/* Keep loaded map on language change to preserve viewport. */}else{$('map-message').textContent=t(embed?'mapMessage':'mapMissing');$('load-map').hidden=!embed;}
  show(active);
 }
 gallery.forEach((x,i)=>{const b=node('button');b.type='button';b.onclick=()=>show(i);dots.append(b);});$('slider').hidden=!gallery.length;
 $('open-photo').onclick=()=>{if(gallery.length){dialog.showModal();show(active);document.body.classList.add('no-scroll');}};$('prev-slide').onclick=$('prev-photo').onclick=()=>show(active-1);$('next-slide').onclick=$('next-photo').onclick=()=>show(active+1);$('close-gallery').onclick=()=>dialog.close();dialog.addEventListener('close',()=>document.body.classList.remove('no-scroll'));
 function arrows(e){if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();show(active+(e.key==='ArrowLeft'?-1:1));}}dialog.addEventListener('keydown',arrows);$('slider').addEventListener('keydown',arrows);let touchX=0;$('slider').addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX;},{passive:true});$('slider').addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>50)show(active+(dx<0?1:-1));},{passive:true});
 if(s.logo){const img=new Image();img.alt='';loadImage(img,s.logo,()=>document.querySelector('.brand-mark').replaceChildren(img),()=>{});}
 $('phone-row').hidden=!s.phone;$('phone').textContent=s.phone||'';if(s.phone)$('phone').href='tel:'+s.phone.replace(/[^+\d]/g,'');$('email-row').hidden=!s.email;$('email').textContent=s.email||'';if(s.email)$('email').href='mailto:'+s.email;
 [['Facebook',s.facebook],['Messenger',s.messenger],['Instagram',s.instagram],['WhatsApp',s.whatsapp]].forEach(([label,url])=>{if(!url||!/^https:\/\//i.test(url))return;const a=node('a','',label+' ↗');a.href=url;a.target='_blank';a.rel='noopener noreferrer';$('socials').append(a);});
 $('load-map').onclick=loadMap;document.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>{lang=b.dataset.lang;try{localStorage.setItem('horizonto-language',lang);}catch{};try{const u=new URL(location.href);u.searchParams.set('lang',lang);history.replaceState(null,'',u);}catch{};render();});
 const menu=$('menu-toggle'),nav=$('nav');function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}menu.onclick=()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));};nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});$('year').textContent=new Date().getFullYear();render();if(s.mapAutoLoad&&embed)loadMap();
}
init().catch(e=>{console.error(e);const message=node('p','','Nepavyko įkelti config.js / Could not load config.js / Не удалось загрузить config.js. Проверьте, что он находится рядом с index.html.');message.style.cssText='padding:20px;text-align:center;background:#fff1d8';document.body.prepend(message);});
