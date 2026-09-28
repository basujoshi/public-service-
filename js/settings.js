import {db} from './firebase-config.js';
import {ref,get,set,update} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js';
import {requireAuth,initLanguage,t,compressImage,syncCustomerIndex} from './common.js';
initLanguage();
requireAuth(async u=>{
 const s=(await get(ref(db,`shops/${u.uid}/shop`))).val()||{};
 ['shopName','ownerName','shopMobile','taxNo','address'].forEach(k=>document.querySelector('#'+k).value=s[k]||'');
 document.querySelector('#allowView').checked=!!s.allowView;
 const img=document.querySelector('#shopPhotoPreview');
 if(s.shopPhoto){img.src=s.shopPhoto;img.classList.remove('hidden')}
 document.querySelector('#removeShopPhoto').onclick=()=>{img.src='';img.classList.add('hidden');document.querySelector('#shopPhoto').value='';img.dataset.remove='true'};
 document.querySelector('#shopForm').onsubmit=async e=>{
  e.preventDefault();
  try{
   let shopPhoto=s.shopPhoto||'';
   const file=document.querySelector('#shopPhoto').files?.[0];
   if(file) shopPhoto=await compressImage(file);
   if(img.dataset.remove==='true' && !file) shopPhoto='';
   const x={...s,shopName:document.querySelector('#shopName').value.trim(),ownerName:document.querySelector('#ownerName').value.trim(),shopMobile:document.querySelector('#shopMobile').value.trim(),taxNo:document.querySelector('#taxNo').value.trim(),address:document.querySelector('#address').value.trim(),allowView:document.querySelector('#allowView').checked,shopPhoto};
   await set(ref(db,`shops/${u.uid}/shop`),x);
   // Keep the customer portal's shop card synchronized for every online customer.
   const customers=(await get(ref(db,`shops/${u.uid}/customers`))).val()||{};Object.entries(customers).forEach(([id,c])=>syncCustomerIndex(u.uid,{id,...c},x).catch(()=>{}));
   const portalUpdates={};
   Object.values(customers).forEach(c=>{if(c?.online&&c.customerAccessKey){portalUpdates[`customerAccess/${c.customerAccessKey}/shops/${u.uid}/shopName`]=x.shopName||t('shop');portalUpdates[`customerAccess/${c.customerAccessKey}/shops/${u.uid}/shopPhoto`]=x.shopPhoto||'';}});
   if(Object.keys(portalUpdates).length) await update(ref(db),portalUpdates);
   Object.assign(s,x);img.dataset.remove='false';if(shopPhoto){img.src=shopPhoto;img.classList.remove('hidden')}document.querySelector('#msg').textContent=t('saved');
  }catch(err){document.querySelector('#msg').textContent=err.message;document.querySelector('#msg').className='msg error'}
 };
});
window.addEventListener('languageChanged',()=>location.reload());
