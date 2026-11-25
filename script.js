'use strict';
const s=window.SITE;
const $=id=>document.getElementById(id);
function node(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
function photo(el, item={}, label='Nuotrauka', eager=false){el.classList.remove('has-image');el.replaceChildren(node('span','photo-label',label));if(!item.src)return;const img=new Image();img.alt=item.alt||label;img.decoding='async';if(!eager)img.loading='lazy';img.addEventListener('load',()=>el.classList.add('has-image'));img.addEventListener('error',()=>{img.remove();el.classList.remove('has-image');});el.append(img);img.src=item.src;}
function setLink(id,value,prefix,placeholder){const el=$(id);el.textContent=value||placeholder;if(value)el.href=prefix+value.replace(prefix==='tel:'?/[^+\d]/g:/$^/g,'');}
if(s){
 $('draft').hidden=!s.draft;
 document.querySelectorAll('[data-field]').forEach(el=>{const key=el.dataset.field;if(s[key])el.textContent=s[key];});
 document.querySelectorAll('[data-image]').forEach(el=>photo(el,s.images[el.dataset.image],el.dataset.label,el.dataset.image==='hero'));
 (s.horseFacts||[]).forEach(f=>{const el=node('div');el.append(node('span','',f.label),node('strong','',f.value));$('horse-facts').append(el);});
 const icons={horse:'<path d="M9 52c5-12 6-26 19-33l-2-12 10 8 7-4 1 11 10 13-5 6-14-7c-5 5-6 11-6 18M6 57h48M40 26h.1"/>',riding:'<path d="M8 21h14l8 10h19l4-10h5v15l-8 4H20L8 33zM24 40v16h12V40M12 15l8 6M47 16l5 5"/>',camera:'<rect x="6" y="19" width="52" height="33" rx="4"/><path d="M20 19l5-8h14l5 8"/><circle cx="32" cy="35" r="11"/>',default:'<path d="M32 54 9 31C-2 14 21 7 32 23 43 7 66 14 55 31Z"/>'};
 (s.services||[]).filter(item=>s.draft||!item.example).forEach(item=>{const article=node('article','service'),visual=node('div','service-icon');visual.innerHTML='<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(icons[item.icon]||icons.default)+'</svg>';article.append(visual,node('h3','',item.title),node('p','',item.text));if(s.draft&&item.example)article.append(node('div','service-meta','Pavyzdys · derinama'));if(item.price)article.append(node('p','price',item.price));$('services').append(article);});
 const gallery=s.gallery||[];let active=0;const dialog=$('lightbox');const dots=$('slide-dots');
 function show(i){if(!gallery.length)return;active=(i+gallery.length)%gallery.length;const item=gallery[active];photo($('slide-photo'),item,`Galerija ${active+1} · ${item.src.split('/').pop()}`,true);$('slide-count').textContent=`${active+1} / ${gallery.length}`;Array.from(dots.children).forEach((b,j)=>b.setAttribute('aria-current',String(j===active)));if(dialog.open){photo($('lightbox-photo'),item,item.alt,true);$('photo-count').textContent=`${active+1} / ${gallery.length}`;$('photo-caption').textContent=item.alt;}}
 gallery.forEach((item,i)=>{const b=node('button');b.type='button';b.setAttribute('aria-label',`Nuotrauka ${i+1}`);b.addEventListener('click',()=>show(i));dots.append(b);});
 if(gallery.length){show(0);$('open-photo').onclick=()=>{dialog.showModal();show(active);document.body.classList.add('no-scroll');};}else{$('slider').hidden=true;}
 $('prev-slide').onclick=$('prev-photo').onclick=()=>show(active-1);$('next-slide').onclick=$('next-photo').onclick=()=>show(active+1);$('close-gallery').onclick=()=>dialog.close();dialog.addEventListener('close',()=>document.body.classList.remove('no-scroll'));
 function arrows(e){if(e.key==='ArrowLeft'){e.preventDefault();show(active-1);}if(e.key==='ArrowRight'){e.preventDefault();show(active+1);}}dialog.addEventListener('keydown',arrows);$('slider').addEventListener('keydown',arrows);
 let touchX=0; $('slider').addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX;},{passive:true});$('slider').addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>50)show(active+(dx<0?1:-1));},{passive:true});
 if(s.logo){const img=new Image();img.alt='';img.onload=()=>document.querySelector('.brand-mark').replaceChildren(img);img.src=s.logo;}
 setLink('phone',s.phone,'tel:','[Telefono numeris]');setLink('email',s.email,'mailto:','[El. pašto adresas]');
 [['Facebook',s.facebook],['Instagram',s.instagram]].forEach(([label,url])=>{const el=node('a','',label+' ↗');if(url&&/^https:\/\//i.test(url)){el.href=url;el.target='_blank';el.rel='noopener noreferrer';}else if(!s.draft)return;$('socials').append(el);});
 if(s.address){$('directions').href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(s.address);$('directions').hidden=false;}
 let embed;try{const url=new URL(s.mapEmbedUrl);if(url.protocol==='https:'&&['www.google.com','maps.google.com'].includes(url.hostname)&&url.pathname.startsWith('/maps/embed'))embed=url.href;}catch{}
 if(embed){$('map-message').textContent='Paspaudus bus įkeltas „Google Maps“ žemėlapis. Duomenys gali būti perduodami „Google“.';$('load-map').hidden=false;$('load-map').onclick=()=>{const frame=node('iframe');frame.title='Žirgyno vieta – Google Maps';frame.src=embed;frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';$('map').replaceChildren(frame);};}
 else if(!s.draft){$('map-message').textContent='Žemėlapis šiuo metu nepasiekiamas.';}
}
const menu=$('menu-toggle'),nav=$('nav');function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});$('year').textContent=new Date().getFullYear();
