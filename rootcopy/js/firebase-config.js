import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import {getAuth} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import {getDatabase} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js';
const firebaseConfig={apiKey:'AIzaSyCrkGEIgNlAsmOtWtrlCkelYrqDd7j-SoA',authDomain:'public-project-4d672.firebaseapp.com',databaseURL:'https://public-project-4d672-default-rtdb.firebaseio.com',projectId:'public-project-4d672',storageBucket:'public-project-4d672.firebasestorage.app',messagingSenderId:'265276656656',appId:'1:265276656656:web:c2bc539cab446e51b88e95',measurementId:'G-13XVC26YTQ'};
const app=initializeApp(firebaseConfig);export const auth=getAuth(app);export const db=getDatabase(app);
export const cleanMobile=m=>String(m||'').replace(/\D/g,'');
