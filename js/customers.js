import {db} from './firebase-config.js';
import {ref,get} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js';
import {requireAuth,money,esc,initLanguage,t,syncCustomerIndex} from './common.js';
initLanguage();
let all=[];
const render=()=>{
 const q=document.querySelector('#search').value.trim().toLowerCase();
 const list=all.filter(c=>(c.name||'').toLowerCase().includes(q)||(c.mobile||'').includes(q));
 document.querySelector('#customers').innerHTML=list.map(c=>`<a class="customer-card" href="customer.html?id=${encodeURIComponent(c.id)}">
   <div class="avatar customer-photo">${c.photo?`<img src="${c.photo}" alt="">`:esc((c.name||'?')[0].toUpperCase())}</div>
   <div class="customer-main"><h3>${esc(c.name)}</h3><small>📱 ${esc(c.mobile)}</small><p>${esc(c.address||'')}</p><div class="pin-row"><span class="pin-label">🔐 ${t('pin')}:</span><span class="pin-value" data-pin="${esc(c.customerPin||'')}" data-visible="false">••••••</span><button type="button" class="ghost small-action show-pin" data-pin="${esc(c.customerPin||'')}" data-visible="false">${t('showPin')}</button></div></div>
   <strong class="${c.due>0?'red':''}">${money(c.due)}</strong></a>`).join('')||`<div class="panel empty">${t('empty')}</div>`;
 document.querySelectorAll('.show-pin').forEach(btn=>btn.onclick=e=>{e.preventDefault();e.stopPropagation();const visible=btn.dataset.visible==='true';btn.dataset.visible=String(!visible);btn.textContent=visible?t('showPin'):t('hidePin');const val=btn.parentElement.querySelector('.pin-value');val.dataset.visible=String(!visible);val.textContent=visible?'••••••':(btn.dataset.pin||'—')});
};
requireAuth(async u=>{try{const shop=(await get(ref(db,`shops/${u.uid}/shop`))).val()||{};const cs=(await get(ref(db,`shops/${u.uid}/customers`))).val()||{};all=Object.entries(cs).map(([id,c])=>{c={id,...c};syncCustomerIndex(u.uid,c,shop).catch(()=>{});let cr=0,pa=0;Object.values(c.transactions||{}).forEach(x=>x.type==='credit'?cr+=Number(x.amount)||0:pa+=Number(x.amount)||0);return{...c,due:cr-pa}}).sort((a,b)=>a.name.localeCompare(b.name));render();}catch(e){document.querySelector('#customers').innerHTML=`<div class="panel error">${esc(e.message)}</div>`}});
document.querySelector('#search').oninput=render;
window.addEventListener('languageChanged',()=>location.reload());
