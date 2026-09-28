import {auth,db} from "./firebase-config.js";
import {onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {ref,set,remove} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

export const LANGS={
  en:{
    app:'KhataPro',tag:'Smart Credit & Customer Ledger',login:'Login',createShop:'Create Shop',googleLogin:'Continue with Google',googleCancelled:'Google sign-in was cancelled.',email:'Email address',password:'Password',loginBtn:'Sign in',createBtn:'Create account',forgot:'Forgot password?',customerPortal:'Customer Portal',owner:'Shop Owner',dashboard:'Dashboard',customers:'Customers',reports:'Reports',settings:'Shop Settings',logout:'Logout',home:'Home',newCustomer:'New Customer',search:'Search customers...',welcome:'Welcome back',overview:'Business overview',totalCustomers:'Total Customers',totalCredit:'Total Credit',totalPaid:'Total Paid',remaining:'Remaining Balance',transactions:'Transactions',quickActions:'Quick Actions',recentCustomers:'Recent Customers',viewAll:'View all',shop:'Shop',noCustomers:'No customers yet.',customerBooks:'Customer Ledger',addCustomer:'Add Customer',name:'Customer name',mobile:'Mobile number',address:'Address',notes:'Notes',save:'Save',cancel:'Cancel',onlineAccess:'Allow customer portal access',onlineHint:'Customer can view this shop after entering their mobile number and private 6-digit PIN.',createLedger:'Create Customer Ledger',privatePin:'Private PIN',pinHint:'Show this PIN to the customer privately. It is required to open their account.',copy:'Copy PIN',copied:'Copied!',account:'My Account',balance:'Balance',history:'Transaction History',continue:'Continue',pin:'6-digit PIN',selectShop:'Select Shop',viewAccount:'View account',accountNotFound:'Account not found',checkDetails:'Please check your mobile number and PIN.',noTransactions:'No transactions yet.',credit:'Credit',payment:'Payment',addCredit:'Add Credit',addPayment:'Add Payment',item:'Item / Note',quantity:'Quantity',unit:'Unit',kg:'kg',gm:'gm',pcs:'pcs',grams:'Grams',pieces:'Pieces',quickQty:'Quick quantity',amount:'Amount',date:'Date',saveEntry:'Save Entry',paymentNote:'Payment',customerLedger:'Customer Ledger',customerInfo:'Customer information',due:'Due',paid:'Paid',total:'Total',shopSettings:'Shop Settings',shopName:'Shop name',ownerName:'Owner name',shopMobile:'Shop mobile',taxNo:'GST / VAT number',allowPortal:'Enable customer portal',saveShop:'Save Shop Details',shopPhoto:'Shop photo',uploadShopPhoto:'Upload shop photo',removePhoto:'Remove photo',customerPhoto:'Customer photo',uploadCustomerPhoto:'Upload customer photo',showPin:'Show PIN',hidePin:'Hide PIN',pin:'6-digit PIN',pinSaved:'PIN saved securely for owner access.',reportsTitle:'Reports & Insights',customersWithDue:'Customers with Due',noDue:'No outstanding balance.',language:'Language',english:'English',nepali:'नेपाली',loading:'Loading...',checking:'Checking...',searching:'Searching...',error:'Something went wrong.',passwordResetSent:'Password reset email sent.',enterEmail:'Enter your email first.',saved:'Saved successfully.',created:'Customer created successfully.',dashboardTitle:'Business Dashboard',customerPortalTitle:'Secure Customer Portal',portalSubtitle:'Use your registered mobile number and private PIN to access your account.',secure:'Private & secure access',back:'Back',all:'All',today:'Today',month:'This Month',year:'This Year',transactionsTitle:'Transactions',dateTime:'Date & Time',mrp:'MRP',sendNotification:'Send Notification',notificationTitle:'Notification title',notificationMessage:'Message',notification:'Notification',notificationSent:'Notification sent',notifications:'Notifications',noNotifications:'No notifications yet.',newTransaction:'New transaction',paymentReceived:'Payment received',download:'Print / Save',print:'Print',empty:'No records found.'
  },
  ne:{
    app:'खाता प्रो',tag:'स्मार्ट उधार तथा ग्राहक लेजर',login:'लगइन',createShop:'पसल खोल्नुहोस्',googleLogin:'Google बाट जारी राख्नुहोस्',googleCancelled:'Google लगइन रद्द भयो।',email:'इमेल ठेगाना',password:'पासवर्ड',loginBtn:'लगइन गर्नुहोस्',createBtn:'खाता बनाउनुहोस्',forgot:'पासवर्ड बिर्सनुभयो?',customerPortal:'ग्राहक पोर्टल',owner:'पसल मालिक',dashboard:'ड्यासबोर्ड',customers:'ग्राहकहरू',reports:'रिपोर्ट',settings:'पसल सेटिङ',logout:'लगआउट',home:'होम',newCustomer:'नयाँ ग्राहक',search:'ग्राहक खोज्नुहोस्...',welcome:'फेरि स्वागत छ',overview:'व्यवसायको सारांश',totalCustomers:'कुल ग्राहक',totalCredit:'कुल उधारो',totalPaid:'कुल भुक्तानी',remaining:'बाँकी रकम',transactions:'लेनदेन',quickActions:'छिटो काम',recentCustomers:'हालका ग्राहक',viewAll:'सबै हेर्नुहोस्',shop:'पसल',noCustomers:'अहिलेसम्म ग्राहक छैनन्।',customerBooks:'ग्राहक खाता',addCustomer:'ग्राहक थप्नुहोस्',name:'ग्राहकको नाम',mobile:'मोबाइल नम्बर',address:'ठेगाना',notes:'टिप्पणी',save:'सेभ गर्नुहोस्',cancel:'रद्द गर्नुहोस्',onlineAccess:'ग्राहक पोर्टल पहुँच दिनुहोस्',onlineHint:'ग्राहकले मोबाइल नम्बर र निजी ६-अङ्कको PIN प्रयोग गरेर आफ्नो खाता हेर्न सक्छ।',createLedger:'ग्राहक खाता बनाउनुहोस्',privatePin:'निजी PIN',pinHint:'यो PIN ग्राहकलाई निजी रूपमा दिनुहोस्। खाता खोल्न PIN आवश्यक हुन्छ।',copy:'PIN कपी',copied:'कपी भयो!',account:'मेरो खाता',balance:'बाँकी',history:'लेनदेन इतिहास',continue:'अगाडि बढ्नुहोस्',pin:'६-अङ्कको PIN',selectShop:'पसल छान्नुहोस्',viewAccount:'खाता हेर्नुहोस्',accountNotFound:'खाता भेटिएन',checkDetails:'मोबाइल नम्बर र PIN जाँच गर्नुहोस्।',noTransactions:'अहिलेसम्म लेनदेन छैन।',credit:'उधारो',payment:'भुक्तानी',addCredit:'उधारो थप्नुहोस्',addPayment:'भुक्तानी थप्नुहोस्',item:'सामान / टिप्पणी',quantity:'परिमाण',unit:'एकाइ',kg:'कि.ग्रा.',gm:'ग्राम',pcs:'पिस',grams:'ग्राम',pieces:'पिस',quickQty:'छिटो परिमाण',amount:'रकम',date:'मिति',saveEntry:'लेनदेन सेभ गर्नुहोस्',paymentNote:'भुक्तानी',customerLedger:'ग्राहक खाता',customerInfo:'ग्राहक जानकारी',due:'बाँकी',paid:'भुक्तानी',total:'कुल',shopSettings:'पसल सेटिङ',shopName:'पसलको नाम',ownerName:'मालिकको नाम',shopMobile:'पसलको मोबाइल',taxNo:'GST / VAT नम्बर',allowPortal:'ग्राहक पोर्टल सक्रिय गर्नुहोस्',saveShop:'पसल विवरण सेभ गर्नुहोस्',shopPhoto:'पसलको फोटो',uploadShopPhoto:'पसलको फोटो राख्नुहोस्',removePhoto:'फोटो हटाउनुहोस्',customerPhoto:'ग्राहकको फोटो',uploadCustomerPhoto:'ग्राहकको फोटो राख्नुहोस्',showPin:'PIN देखाउनुहोस्',hidePin:'PIN लुकाउनुहोस्',pin:'६-अङ्कको PIN',pinSaved:'मालिकको पहुँचका लागि PIN सुरक्षित रूपमा राखिएको छ।',reportsTitle:'रिपोर्ट तथा जानकारी',customersWithDue:'बाँकी भएका ग्राहक',noDue:'बाँकी रकम छैन।',language:'भाषा',english:'English',nepali:'नेपाली',loading:'लोड हुँदैछ...',checking:'जाँच हुँदैछ...',searching:'खोज्दैछ...',error:'केही समस्या भयो।',passwordResetSent:'पासवर्ड रिसेट इमेल पठाइयो।',enterEmail:'पहिले इमेल लेख्नुहोस्।',saved:'सफलतापूर्वक सेभ भयो।',created:'ग्राहक सफलतापूर्वक बनाइयो।',dashboardTitle:'व्यवसाय ड्यासबोर्ड',customerPortalTitle:'सुरक्षित ग्राहक पोर्टल',portalSubtitle:'दर्ता गरिएको मोबाइल नम्बर र निजी PIN प्रयोग गर्नुहोस्।',secure:'निजी तथा सुरक्षित पहुँच',back:'पछाडि',all:'सबै',today:'आज',month:'यो महिना',year:'यो वर्ष',transactionsTitle:'लेनदेन',dateTime:'मिति तथा समय',mrp:'MRP',sendNotification:'सूचना पठाउनुहोस्',notificationTitle:'सूचनाको शीर्षक',notificationMessage:'सन्देश',notification:'सूचना',notificationSent:'सूचना पठाइयो',notifications:'सूचनाहरू',noNotifications:'अहिलेसम्म कुनै सूचना छैन।',newTransaction:'नयाँ लेनदेन',paymentReceived:'भुक्तानी प्राप्त भयो',download:'प्रिन्ट / सेभ',print:'प्रिन्ट',empty:'रेकर्ड भेटिएन।'
  }
};
export function getLang(){return localStorage.getItem('khata_lang')||'en';}
export function t(key){return (LANGS[getLang()]||LANGS.en)[key]??key;}
export function setLang(lang){localStorage.setItem('khata_lang',lang);applyLanguage();window.dispatchEvent(new CustomEvent('languageChanged',{detail:lang}));}
export function applyLanguage(root=document){const lang=getLang();root.documentElement?.setAttribute('lang',lang==='ne'?'ne':'en');root.querySelectorAll?.('[data-i18n]').forEach(el=>{el.textContent=t(el.dataset.i18n)});root.querySelectorAll?.('[data-i18n-placeholder]').forEach(el=>{el.placeholder=t(el.dataset.i18nPlaceholder)});root.querySelectorAll?.('[data-lang]').forEach(el=>{el.value=lang;});}
export function initLanguage(){const sel=document.querySelector('#languageSelect');if(sel){sel.value=getLang();sel.onchange=()=>{setLang(sel.value);};}applyLanguage();}
export function requireAuth(cb){onAuthStateChanged(auth,u=>u?cb(u):location.href='index.html');}
export function logout(){document.querySelector('#logout')?.addEventListener('click',async()=>{const ok=confirm(getLang()==='ne'?'के तपाईं लगआउट गर्न निश्चित हुनुहुन्छ?':'Are you sure you want to logout?');if(!ok)return;try{await signOut(auth);location.href='index.html';}catch(e){alert(e.message||'Logout failed.');}});}
export const today=()=>new Date().toISOString().slice(0,10);
export function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}


export async function hashText(text){
  const data=new TextEncoder().encode(String(text));
  const hash=await crypto.subtle.digest('SHA-256',data);
  return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,'0')).join('');
}
export async function syncCustomerIndex(uid,customer,shop={}){
  if(!uid || !customer?.mobile) return;
  const mobile=cleanMobile(customer.mobile);
  if(!mobile) return;
  const mobileHash=await hashText(mobile);
  const node=ref(db,`customerIndex/${mobileHash}/${uid}`);
  if(!customer.online){ await remove(node); return; }
  await set(node,{
    enabled:true,
    shopName:shop.shopName||t('shop'),
    shopPhoto:shop.shopPhoto||'',
    updatedAt:Date.now()
  });
}
export function cleanMobile(m){return String(m||'').replace(/\D/g,'');}

export async function compressImage(file,maxBytes=220000,maxSide=900){
  if(!file || !file.type.startsWith('image/')) throw new Error('Please select an image file.');
  const img=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=URL.createObjectURL(file)});
  const scale=Math.min(1,maxSide/Math.max(img.width,img.height));
  const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));
  const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,canvas.width,canvas.height);URL.revokeObjectURL(img.src);
  let q=.82, data=canvas.toDataURL('image/jpeg',q);
  while(data.length*0.75>maxBytes && q>.35){q-=.07;data=canvas.toDataURL('image/jpeg',q)}
  if(data.length*0.75>maxBytes) throw new Error('Image is too large. Please choose a smaller photo.');
  return data;
}
export function previewImage(input,img){if(input?.files?.[0] && img){img.src=URL.createObjectURL(input.files[0]);img.classList.remove('hidden')}}
export function money(n){return new Intl.NumberFormat(getLang()==='ne'?'ne-NP':'en-IN',{style:'currency',currency:'NPR',maximumFractionDigits:2}).format(Number(n)||0);}
