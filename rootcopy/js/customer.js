import {db} from './firebase-config.js';
import {ref,get,push,set} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js';
import {requireAuth,today,money,esc,initLanguage,t,syncCustomerIndex} from './common.js';
initLanguage();let uid,cid,customer,mode='credit';
requireAuth(async u=>{uid=u.uid;cid=new URLSearchParams(location.search).get('id');if(!cid)return location.href='customers.html';customer=(await get(ref(db,`shops/${uid}/customers/${cid}`))).val();if(!customer)return location.href='customers.html';render();});
function calc(){let cr=0,pa=0;Object.values(customer.transactions||{}).forEach(x=>x.type==='credit'?cr+=Number(x.amount)||0:pa+=Number(x.amount)||0);return{cr,pa,due:cr-pa}}
async function syncPortal(){
 if(!customer.online||!customer.customerAccessKey){
   const shop=(await get(ref(db,`shops/${uid}/shop`))).val()||{};
   await syncCustomerIndex(uid,{...customer,id:cid,online:false},shop);
   return;
 }
 const shop=(await get(ref(db,`shops/${uid}/shop`))).val()||{};
 const existing=(await get(ref(db,`customerAccess/${customer.customerAccessKey}`))).val()||{};
 await set(ref(db,`customerAccess/${customer.customerAccessKey}`),{
   enabled:true,
   shops:{
     ...(existing.shops||{}),
     [uid]:{
       shopName:shop.shopName||t('shop'),
       shopPhoto:shop.shopPhoto||'',
       customerId:cid,
       account:{
         name:customer.name||'',
         mobile:customer.mobile||'',
         address:customer.address||'',
         photo:customer.photo||'',
         transactions:customer.transactions||{}
       },
       notifications:customer.notifications||{}
     }
   }
 });
 await syncCustomerIndex(uid,{...customer,id:cid},shop);
}
function dt(ts,date){const d=ts?new Date(ts):new Date((date||today())+'T00:00:00');return d.toLocaleString(getLang()==='ne'?'ne-NP':'en-IN',{dateStyle:'short',timeStyle:'short',hour12:true})}
function getLang(){return localStorage.getItem('khata_lang')||'en'}
function qtyMeta(value,unit){const n=Number(value)||0;if(unit==='gm'){if(n>=1000){const kg=n/1000;return {baseKg:kg,display:(Number.isInteger(kg)?kg:kg.toFixed(3).replace(/0+$/,'').replace(/\.$/,'') )+' kg'};}return {baseKg:n/1000,display:n+' gm'};}if(unit==='kg')return {baseKg:n,display:(Number.isInteger(n)?n:n.toFixed(3).replace(/0+$/,'').replace(/\.$/,''))+' kg'};return {baseKg:null,display:(Number.isInteger(n)?n:n.toFixed(2))+' pcs'};}
function totalFromQty(mrp,value,unit){const n=Number(value)||0;return unit==='gm'?mrp*n/1000:mrp*n}
function render(){const x=calc();document.querySelector('#credit').textContent=money(x.cr);document.querySelector('#paid').textContent=money(x.pa);document.querySelector('#due').textContent=money(x.due);document.querySelector('#customerHead').innerHTML=`<div><p class="eyebrow">${t('customerLedger')}</p><div class="customer-headline"><div class="avatar customer-photo large">${customer.photo?`<img src="${esc(customer.photo)}" alt="">`:esc((customer.name||'?')[0].toUpperCase())}</div><div><h1>${esc(customer.name)}</h1><p>📱 ${esc(customer.mobile)} ${customer.address?` • 📍 ${esc(customer.address)}`:''}</p></div></div><div class="top-right customer-pin-owner"><span class="portal-badge">${x.due>0?t('due'):t('paid')}</span><span class="pin-owner">🔐 ${t('pin')}: <b id="ownerPin">••••••</b> <button class="ghost small-action" id="toggleOwnerPin" type="button">${t('showPin')}</button></span></div></div>`;const toggle=document.querySelector('#toggleOwnerPin');if(toggle)toggle.onclick=()=>{const el=document.querySelector('#ownerPin');const shown=el.textContent!=='••••••';el.textContent=shown?'••••••':(customer.customerPin||'—');toggle.textContent=shown?t('showPin'):t('hidePin')};const rows=Object.entries(customer.transactions||{}).sort((a,b)=>(b[1].createdAt||0)-(a[1].createdAt||0)).map(([id,x])=>{const qty=Number(x.qty)||1;const unit=x.unit||'pcs';const q=qtyMeta(qty,unit);const mrp=x.type==='credit'?(Number(x.mrp)||((Number(x.amount)||0)/(unit==='gm'?qty/1000:qty))):0;return `<tr><td>${esc(dt(x.createdAt,x.date))}</td><td>${esc(x.item||t('payment'))}</td><td>${x.type==='credit'?money(mrp):'—'}</td><td>${x.type==='credit'?esc(q.display):'—'}</td><td class="${x.type==='credit'?'credit':'paid'}">${x.type==='credit'?money(x.amount):'-'+money(x.amount)}</td></tr>`}).join('');document.querySelector('#entries').innerHTML=`<table><thead><tr><th>${t('dateTime')}</th><th>${t('item')}</th><th>${t('mrp')}</th><th>${t('quantity')}</th><th>${t('total')}</th></tr></thead><tbody>${rows||`<tr><td colspan="5" class="empty">${t('noTransactions')}</td></tr>`}</tbody></table>`}
function openModal(m){mode=m;document.querySelector('#modalTitle').textContent=m==='credit'?t('addCredit'):t('addPayment');document.querySelector('#item').value=m==='credit'?'':t('paymentNote');document.querySelector('#qtyWrap').classList.toggle('hidden',m!=='credit');document.querySelector('#mrpWrap').classList.toggle('hidden',m!=='credit');document.querySelector('#totalLabel').textContent=m==='credit'?t('total'):t('amount');document.querySelector('#modal').classList.remove('hidden');document.querySelector('#date').value=today();document.querySelector('#mrp').value='';document.querySelector('#amount').value='';document.querySelector('#qty').value='1';document.querySelector('#qtyUnit').value='pcs';updateTotal()}
function updateTotal(){const mrp=Number(document.querySelector('#mrp').value)||0,qty=Number(document.querySelector('#qty').value)||0,unit=document.querySelector('#qtyUnit').value;const total=document.querySelector('#amount');if(mode==='credit')total.value=mrp>0&&qty>0?totalFromQty(mrp,qty,unit).toFixed(2):''}
document.querySelector('#qtyUnit').onchange=updateTotal;document.querySelectorAll('#quickQty [data-q]').forEach(b=>b.onclick=()=>{document.querySelector('#qty').value=b.dataset.q;document.querySelector('#qtyUnit').value=b.dataset.u;updateTotal()});
document.querySelector('#entryBtn').onclick=()=>openModal('credit');document.querySelector('#paymentBtn').onclick=()=>openModal('payment');document.querySelector('#close').onclick=()=>document.querySelector('#modal').classList.add('hidden');document.querySelector('#mrp').oninput=updateTotal;document.querySelector('#qty').oninput=updateTotal;
document.querySelector('#entryForm').onsubmit=async e=>{e.preventDefault();const item=document.querySelector('#item').value.trim()||t('paymentNote'),qty=Number(document.querySelector('#qty').value)||1,unit=document.querySelector('#qtyUnit').value||'pcs',mrp=Number(document.querySelector('#mrp').value)||0;const amount=mode==='credit'?totalFromQty(mrp,qty,unit):Number(document.querySelector('#amount').value);if(!(amount>0)|| (mode==='credit' && !(mrp>0&&qty>0)))return;const id=push(ref(db,`shops/${uid}/customers/${cid}/transactions`)).key,createdAt=Date.now();await set(ref(db,`shops/${uid}/customers/${cid}/transactions/${id}`),{type:mode,item,qty:mode==='credit'?qty:0,unit:mode==='credit'?unit:'',qtyDisplay:mode==='credit'?qtyMeta(qty,unit).display:'',mrp:mode==='credit'?mrp:0,amount,total:amount,date:document.querySelector('#date').value,createdAt});const notificationId=push(ref(db,`shops/${uid}/customers/${cid}/notifications`)).key;await set(ref(db,`shops/${uid}/customers/${cid}/notifications/${notificationId}`),{title:mode==='credit'?'NEW PURCHASE':'PAYMENT COMPLETE',message:mode==='credit'?`${item} • ${t('mrp')}: ${money(mrp)} • ${t('quantity')}: ${qtyMeta(qty,unit).display} • ${money(amount)}`:`${money(amount)} ${t('paymentReceived')}`,createdAt,read:false,type:mode==='credit'?'transaction':'payment'});customer=(await get(ref(db,`shops/${uid}/customers/${cid}`))).val();await syncPortal();document.querySelector('#modal').classList.add('hidden');render()};
const notifyBtn=document.querySelector('#notifyBtn');if(notifyBtn)notifyBtn.onclick=()=>{document.querySelector('#notifyModal').classList.remove('hidden')};const notifyClose=document.querySelector('#notifyClose');if(notifyClose)notifyClose.onclick=()=>document.querySelector('#notifyModal').classList.add('hidden');const notifyForm=document.querySelector('#notifyForm');if(notifyForm)notifyForm.onsubmit=async e=>{e.preventDefault();const title=document.querySelector('#notifyTitle').value.trim()||t('notification');const message=document.querySelector('#notifyMessage').value.trim();if(!message)return;const id=push(ref(db,`shops/${uid}/customers/${cid}/notifications`)).key;await set(ref(db,`shops/${uid}/customers/${cid}/notifications/${id}`),{title,message,createdAt:Date.now(),read:false,type:'custom'});customer=(await get(ref(db,`shops/${uid}/customers/${cid}`))).val();await syncPortal();notifyForm.reset();document.querySelector('#notifyModal').classList.add('hidden');alert(t('notificationSent'))};window.addEventListener('languageChanged',()=>location.reload());
