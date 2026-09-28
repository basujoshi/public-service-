import {db,cleanMobile} from './firebase-config.js';
import {ref,push,set,get} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js';
import {requireAuth,initLanguage,t,compressImage,syncCustomerIndex} from './common.js';
initLanguage();
const makePin=()=>String(Math.floor(100000+Math.random()*900000));
const hashText=async text=>{const data=new TextEncoder().encode(text);const hash=await crypto.subtle.digest('SHA-256',data);return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,'0')).join('')};
requireAuth(u=>document.querySelector('#customerForm').onsubmit=async e=>{
 e.preventDefault(); const msg=document.querySelector('#msg'); const m=cleanMobile(document.querySelector('#mobile').value);
 if(!m||m.length<7){msg.textContent='Enter a valid mobile number.';msg.className='msg error';return}
 const pin=makePin(); const id=push(ref(db,`shops/${u.uid}/customers`)).key;
 const online=document.querySelector('#online').checked;
 const photoFile=document.querySelector('#customerPhoto')?.files?.[0];
 let photo='';
 if(photoFile) photo=await compressImage(photoFile);
 const accessKey=await hashText(m+'|'+pin);
 const c={name:document.querySelector('#name').value.trim(),mobile:m,address:document.querySelector('#address').value.trim(),email:document.querySelector('#email').value.trim(),notes:document.querySelector('#notes').value.trim(),online,customerPin:pin,customerPinHash:await hashText(pin),customerAccessKey:accessKey,photo,createdAt:Date.now(),id};
 try{
   await set(ref(db,`shops/${u.uid}/customers/${id}`),c);
   const shop=(await get(ref(db,`shops/${u.uid}/shop`))).val()||{};
   await syncCustomerIndex(u.uid,c,shop);
   if(online){
     const existing=(await get(ref(db,`customerAccess/${accessKey}`))).val()||{};
     const safe={name:c.name,mobile:c.mobile,address:c.address,photo:c.photo,transactions:{}};
     await set(ref(db,`customerAccess/${accessKey}`),{enabled:true,shops:{...(existing.shops||{}),[u.uid]:{shopName:shop.shopName||t('shop'),shopPhoto:shop.shopPhoto||'',customerId:id,account:safe}}});
   }
   document.querySelector('#pinCode').textContent=pin;document.querySelector('#pinBox').classList.remove('hidden');document.querySelector('#customerForm').classList.add('hidden');msg.textContent=t('created');
   document.querySelector('#copyPin').onclick=async()=>{await navigator.clipboard.writeText(pin);document.querySelector('#copyPin').textContent=t('copied')};
   document.querySelector('#openCustomer').href=`customer.html?id=${encodeURIComponent(id)}`;
 }catch(x){msg.textContent=x.message;msg.className='msg error'}
});
window.addEventListener('languageChanged',()=>location.reload());
