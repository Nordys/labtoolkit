'use strict';
const HISTORY_KEY='labcalc-history-v2',THEME_KEY='labcalc-theme',INPUT_KEY='labcalc-last-inputs',DIFF_KEY='labcalc-diff',FIELD_KEY='labcalc-field',MORPH_KEY='labcalc-morph',KEYMAP_KEY='labcalc-keymap';
const $=id=>document.getElementById(id); const qsa=s=>[...document.querySelectorAll(s)];
const todayString=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
const numberValue=id=>{const v=Number($(id).value);return Number.isFinite(v)?v:NaN};
const formatNumber=(v,d=2)=>Number(v.toFixed(d)).toLocaleString('ko-KR',{maximumFractionDigits:d});
function showToast(m){$('toast').textContent=m;$('toast').classList.add('show');clearTimeout(showToast.t);showToast.t=setTimeout(()=>$('toast').classList.remove('show'),1400)}
function requireNumbers(v){if(v.some(x=>!Number.isFinite(x))){showToast('모든 값을 입력하세요.');return false}return true}
function setResult(id,v){$(id).textContent=v}
function safeParse(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
function copyText(text){if(!text)return; navigator.clipboard.writeText(text).then(()=>showToast('복사했습니다.')).catch(()=>showToast('복사할 수 없습니다.'))}
function getHistory(){const s=safeParse(HISTORY_KEY,null);if(!s||s.date!==todayString()){const n={date:todayString(),items:[]};localStorage.setItem(HISTORY_KEY,JSON.stringify(n));return n}return s}
function saveHistoryItem(type,result,detail){const s=getHistory();s.items.unshift({type,result,detail,time:new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'})});s.items=s.items.slice(0,100);localStorage.setItem(HISTORY_KEY,JSON.stringify(s));renderHistory()}
function renderHistory(){const s=getHistory();$('historyCount').textContent=s.items.length;const html=s.items.length?s.items.map(i=>`<article class="history-item"><div class="history-item-top"><span>${i.type}</span><time>${i.time}</time></div><strong>${i.result}</strong><p>${i.detail}</p></article>`).join(''):'<div class="empty-history">오늘 저장된 기록이 없습니다.</div>';qsa('[data-history-list]').forEach(list=>list.innerHTML=html)}
function loadInputs(){return safeParse(INPUT_KEY,{})} function saveInput(id){const s=loadInputs();s[id]=$(id).value;localStorage.setItem(INPUT_KEY,JSON.stringify(s))}
function restoreInputs(){const s=loadInputs();qsa('input:not([readonly]),select,textarea').forEach(el=>{if(s[el.id]!==undefined)el.value=s[el.id];el.addEventListener('input',()=>saveInput(el.id));el.addEventListener('change',()=>saveInput(el.id))})}
const pageTitles={rpi:'RPI 계산기',chem:'CHEM POC',neubauer:'Neubauer Chamber',diff:'Diff & Morphology',field:'Field Counter',history:'오늘 기록',about:'정보'};
function openPage(p){qsa('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.page===p));qsa('.page').forEach(x=>x.classList.toggle('active',x.dataset.pagePanel===p));$('pageTitle').textContent=pageTitles[p];$('sidebar').classList.remove('open');$('sidebarBackdrop').classList.remove('open')}
qsa('.nav-item').forEach(b=>b.onclick=()=>openPage(b.dataset.page));$('mobileMenu').onclick=()=>{$('sidebar').classList.add('open');$('sidebarBackdrop').classList.add('open')};$('sidebarBackdrop').onclick=()=>{$('sidebar').classList.remove('open');$('sidebarBackdrop').classList.remove('open')};
function maturation(h){if(h<=15)return 2.5;if(h<=25)return 2;if(h<=35)return 1.5;return 1}
$('rpiHct').oninput=()=>{const h=numberValue('rpiHct');$('rpiMaturation').value=Number.isFinite(h)?maturation(h).toFixed(1):'자동'};
$('rpiCalculate').onclick=()=>{const r=numberValue('rpiRetic'),h=numberValue('rpiHct'),n=numberValue('rpiNormalHct');if(!requireNumbers([r,h,n])||n<=0)return;const f=maturation(h),c=r*h/n,v=c/f;setResult('rpiCorrected',formatNumber(c));setResult('rpiResult',formatNumber(v));$('rpiMaturation').value=f.toFixed(1);saveHistoryItem('RPI',formatNumber(v),`Retic ${r}% · Hct ${h}% · 정상 Hct ${n}% · 보정 ${f}`)};
$('beCalculate').onclick=()=>{const p=numberValue('bePh'),b=numberValue('beHco3'),h=numberValue('beHct');if(!requireNumbers([p,b,h]))return;const t=.34*h,v=(1-.014*t)*(b-24.8+(1.43*t+7.7)*(p-7.4));setResult('beResult',formatNumber(v,1));saveHistoryItem('BE(B)',`${formatNumber(v,1)} mmol/L`,`pH ${p} · HCO₃ ${b} · Hct ${h}%`)};
$('agCalculate').onclick=()=>{const a=numberValue('agNa'),k=numberValue('agK'),c=numberValue('agCl'),h=numberValue('agHco3');if(!requireNumbers([a,k,c,h]))return;const v=a+k-c-h;setResult('agResult',formatNumber(v,1));saveHistoryItem('Anion Gap',`${formatNumber(v,1)} mmol/L`,`Na ${a} · K ${k} · Cl ${c} · HCO₃ ${h}`)};
$('osmoCalculate').onclick=()=>{const n=numberValue('osmoNa'),b=numberValue('osmoBun'),g=numberValue('osmoGlucose');if(!requireNumbers([n,b,g]))return;const v=1.86*n+b/2.8+g/18+9;setResult('osmoResult',formatNumber(v,1));saveHistoryItem('Osmolality',`${formatNumber(v,1)} mOsm/kg`,`Na ${n} · BUN ${b} · Glucose ${g}`)};
$('caCalculate').onclick=()=>{const c=numberValue('caValue'),p=numberValue('caPh');if(!requireNumbers([c,p]))return;const v=c*Math.pow(10,-.178*(7.4-p));setResult('caResult',formatNumber(v,3));saveHistoryItem('Ca(7.4)',`${formatNumber(v,3)} mmol/L`,`iCa ${c} · pH ${p}`)};
$('egfrCalculate').onclick=()=>{const a=numberValue('egfrAge'),c=numberValue('egfrCr'),f=$('egfrSex').value==='female';if(!requireNumbers([a,c])||c<=0)return;const k=f?.7:.9,al=f?-.241:-.302,r=c/k;let v=142*Math.pow(Math.min(r,1),al)*Math.pow(Math.max(r,1),-1.2)*Math.pow(.9938,a);if(f)v*=1.012;setResult('egfrResult',formatNumber(v,0));saveHistoryItem('eGFR',`${formatNumber(v,0)} mL/min/1.73m²`,`${f?'여성':'남성'} · ${a}세 · Cr ${c}`)};
let neubauerMode='wbc';const modes={wbc:{vol:.1,note:'WBC 분획 1개 = 큰 정사각형 1개 = 0.1 μL',label:'WBC cells/μL',sq:4,dil:20},rbc:{vol:.004,note:'RBC 분획 1개 = 중앙 큰 칸의 1/25 중간 정사각형 = 0.004 μL',label:'RBC cells/μL',sq:5,dil:200}};
function updateNeu(mode,defaults=false){neubauerMode=mode;qsa('[data-neubauer-mode]').forEach(b=>b.classList.toggle('active',b.dataset.neubauerMode===mode));const c=modes[mode];if(defaults){$('neubauerSquares').value=c.sq;$('neubauerDilution').value=c.dil} $('neubauerNote').textContent=c.note;$('neubauerResultLabel').textContent=c.label;updateVol()}
function updateVol(){const s=numberValue('neubauerSquares'),v=Number.isFinite(s)&&s>0?s*modes[neubauerMode].vol:0;$('neubauerVolume').value=v?formatNumber(v,4):''}
qsa('[data-neubauer-mode]').forEach(b=>b.onclick=()=>updateNeu(b.dataset.neubauerMode,true));$('neubauerSquares').oninput=updateVol;$('neubauerCalculate').onclick=()=>{const s=numberValue('neubauerSquares'),d=numberValue('neubauerDilution'),c=numberValue('neubauerCells');if(!requireNumbers([s,d,c])||s<=0||d<=0)return;const vol=s*modes[neubauerMode].vol,v=c*d/vol;setResult('neubauerResult',formatNumber(v,0));setResult('neubauerExpression',`${c} × ${d} ÷ ${formatNumber(vol,4)}`);saveHistoryItem(`Neubauer ${neubauerMode.toUpperCase()}`,`${formatNumber(v,0)} cells/μL`,`분획 ${s} · 희석 ${d}배 · 셀 ${c}`)};
qsa('.tab').forEach(t=>t.onclick=()=>{qsa('.tab').forEach(x=>x.classList.toggle('active',x===t));qsa('.tab-panel').forEach(p=>p.classList.toggle('active',p.dataset.panel===t.dataset.tab))});
qsa('[data-copy-target]').forEach(b=>b.onclick=()=>{const t=$(b.dataset.copyTarget).textContent.trim();if(t==='—')return showToast('복사할 결과가 없습니다.');copyText(t.replace(/,/g,''))});
qsa('[data-reset]').forEach(b=>b.onclick=()=>{if(b.dataset.reset==='rpi'){['rpiRetic','rpiHct'].forEach(id=>$(id).value='');$('rpiNormalHct').value=45;$('rpiMaturation').value='자동';setResult('rpiCorrected','—');setResult('rpiResult','—')}else{$('neubauerCells').value='';updateNeu(neubauerMode,true);setResult('neubauerResult','—');setResult('neubauerExpression','—')}});

const diffTypes=[
  {name:'Neutrophil',included:true},
  {name:'Lymphocyte',included:true},
  {name:'Monocyte',included:true},
  {name:'Eosinophil',included:true},
  {name:'Basophil',included:true},
  {name:'IG',included:true},
  {name:'Band',included:true},
  {name:'Metamyelocyte',included:true},
  {name:'Myelocyte',included:true},
  {name:'Promyelocyte',included:true},
  {name:'Blast',included:true},
  {name:'Atypical lymphocyte',included:true},
  {name:'nRBC',included:false}
];
const defaultKeyMap={
  Neutrophil:'A',Lymphocyte:'S',Monocyte:'D',Eosinophil:'F',Basophil:'G',IG:'H',
  Band:'',Metamyelocyte:'',Myelocyte:'',Promyelocyte:'',Blast:'','Atypical lymphocyte':'',nRBC:'R',Undo:'Z'
};
let keyMap={...defaultKeyMap,...safeParse(KEYMAP_KEY,{})};
let diff=safeParse(DIFF_KEY,{counts:{},stack:[],target:100,completed:false});
diffTypes.forEach(({name})=>diff.counts[name]??=0);
$('diffTarget').value=diff.target;
function diffTotal(){return diffTypes.filter(t=>t.included).reduce((sum,t)=>sum+(diff.counts[t.name]||0),0)}

function isDiffComplete(){return diffTotal()>=Math.max(1,Number($('diffTarget').value)||100)}
function saveDiff(){
  diff.target=Math.max(1,Number($('diffTarget').value)||100);
  diff.completed=isDiffComplete();
  localStorage.setItem(DIFF_KEY,JSON.stringify(diff));
  renderDiff();
}
function completeDiff(){
  diff.completed=true;
  localStorage.setItem(DIFF_KEY,JSON.stringify(diff));
  renderDiff();
  showToast(`목표 ${diff.target} WBC에 도달했습니다.`);
  if('vibrate' in navigator)navigator.vibrate?.([80,50,120]);
}
function changeDiff(name,delta){
  const type=diffTypes.find(t=>t.name===name);
  if(!type)return;
  if(delta>0){
    if(isDiffComplete())return showToast('목표에 도달했습니다. 새 카운트 또는 실행 취소 후 입력하세요.');
    diff.counts[name]=(diff.counts[name]||0)+1;
    diff.stack.push(name);
    const reached=type.included&&isDiffComplete();
    if(reached)return completeDiff();
  }else if((diff.counts[name]||0)>0){
    diff.counts[name]--;
    const i=diff.stack.lastIndexOf(name);
    if(i>=0)diff.stack.splice(i,1);
    diff.completed=false;
  }
  saveDiff();
}
function renderDiff(){
  const total=diffTotal(),target=Math.max(1,Number($('diffTarget').value)||100),complete=total>=target;
  diff.completed=complete;
  $('diffGrid').innerHTML=diffTypes.map(({name,included})=>{
    const count=diff.counts[name]||0,key=keyMap[name]||'';
    return `<div class="diff-cell ${included?'':'excluded'} ${complete?'locked':''}"><div class="diff-cell-top"><h3>${name}</h3>${key?`<span class="diff-key">${key}</span>`:''}</div><div class="diff-count">${count}</div><div class="diff-percent">${included?(total?formatNumber(count/total*100,1):'0')+'%':'목표 제외'}</div><div class="diff-controls"><button data-diff-minus="${name}" ${count<=0?'disabled':''}>−</button><button class="add" data-diff-plus="${name}" ${complete?'disabled':''}>+1</button></div></div>`
  }).join('');
  qsa('[data-diff-plus]').forEach(b=>b.onclick=()=>changeDiff(b.dataset.diffPlus,1));
  qsa('[data-diff-minus]').forEach(b=>b.onclick=()=>changeDiff(b.dataset.diffMinus,-1));
  $('diffProgressText').textContent=`${total} / ${target}`;
  $('diffProgressBar').style.width=`${Math.min(100,total/target*100)}%`;
  $('diffStatus').textContent=complete?'목표 완료':total?'진행 중':'진행 전';
  $('nrbcCountSummary').textContent=diff.counts.nRBC||0;
  $('diffCompleteBanner').classList.toggle('hidden',!complete);
  $('diffCompleteText').textContent=`${target} WBC 카운트를 완료했습니다. 추가 입력은 잠금 상태입니다.`;
  $('diffUndo').disabled=!diff.stack.length;
}
$('diffTarget').onchange=()=>{
  diff.completed=false;
  saveDiff();
};
$('diffUndo').onclick=()=>{
  const n=diff.stack.pop();
  if(n){diff.counts[n]--;diff.completed=false;saveDiff()}
};
$('diffReset').onclick=()=>{if(confirm('현재 Diff count를 초기화할까요?')){diff={counts:Object.fromEntries(diffTypes.map(({name})=>[name,0])),stack:[],target:Number($('diffTarget').value)||100,completed:false};saveDiff()}};
function diffReport(){const total=diffTotal();const rows=diffTypes.filter(t=>t.included&&(diff.counts[t.name]||0)>0).map(t=>`${t.name}: ${diff.counts[t.name]} (${total?formatNumber(diff.counts[t.name]/total*100,1):0}%)`);if(diff.counts.nRBC>0)rows.push(`nRBC: ${diff.counts.nRBC} / ${total||$('diffTarget').value} WBC`);return [`Differential count (${total} WBC)`,...rows].join('\n')}
$('diffCopy').onclick=()=>copyText(diffReport());

let field=safeParse(FIELD_KEY,{count:0,mainCount:0,zone:'',target:20});
field.mainCount=Number(field.mainCount)||0;
$('fieldZone').value=field.zone;$('fieldTarget').value=field.target;
function saveField(){field.zone=$('fieldZone').value;field.target=Number($('fieldTarget').value)||20;localStorage.setItem(FIELD_KEY,JSON.stringify(field));$('fieldCount').textContent=field.count;$('mainCount').textContent=field.mainCount}
function changeField(d){field.count=Math.max(0,field.count+d);saveField()}
function changeMain(d){field.mainCount=Math.max(0,field.mainCount+d);saveField()}
$('fieldPlus').onclick=()=>changeField(1);$('fieldMinus').onclick=()=>changeField(-1);
$('mainPlus').onclick=()=>changeMain(1);$('mainMinus').onclick=()=>changeMain(-1);
$('fieldZone').oninput=saveField;$('fieldTarget').onchange=saveField;
$('mainReset').onclick=()=>{field.mainCount=0;saveField()};
$('fieldOnlyReset').onclick=()=>{field.count=0;saveField()};
$('fieldReset').onclick=()=>{field.count=0;field.mainCount=0;saveField()};
$('fieldCopy').onclick=()=>copyText(`Main count: ${field.mainCount}\nField count: ${field.count}${field.zone?`\nZone: ${field.zone}`:''}\nTarget fields: ${field.target}`);

const morphGroups={rbcMorph:['Anisocytosis','Microcytosis','Macrocytosis','Hypochromia','Poikilocytosis','Target cell','Ovalocyte','Schistocyte','Spherocyte','Polychromasia'],wbcMorph:['Toxic granulation','Vacuolation','Döhle body','Hypersegmentation','Reactive lymphocyte','Atypical cell'],pltMorph:['Adequacy','Clumping','Giant platelet','Platelet satellitism']};
const grades=['','Rare','Few','+','++','+++','Present','Adequate','Decreased','Increased'];let morph=safeParse(MORPH_KEY,{values:{},memo:''});
function renderMorph(){Object.entries(morphGroups).forEach(([id,items])=>{$(id).innerHTML=items.map(n=>`<label class="morph-row"><span>${n}</span><select data-morph="${n}">${grades.map(g=>`<option value="${g}" ${morph.values[n]===g?'selected':''}>${g||'—'}</option>`).join('')}</select></label>`).join('')});qsa('[data-morph]').forEach(s=>s.onchange=()=>{morph.values[s.dataset.morph]=s.value;saveMorph()});$('morphMemo').value=morph.memo||'';updateMorphPreview()}
function morphReport(){const sections=[];Object.entries(morphGroups).forEach(([id,items])=>{const rows=items.filter(n=>morph.values[n]).map(n=>`${n}: ${morph.values[n]}`);if(rows.length)sections.push(`${id==='rbcMorph'?'RBC':id==='wbcMorph'?'WBC':'Platelet'}\n${rows.join('\n')}`)});if(morph.memo?.trim())sections.push(`Note\n${morph.memo.trim()}`);return sections.join('\n\n')}
function updateMorphPreview(){$('morphPreview').textContent=morphReport()||'선택한 항목이 여기에 표시됩니다.'}
function saveMorph(){morph.memo=$('morphMemo').value;localStorage.setItem(MORPH_KEY,JSON.stringify(morph));updateMorphPreview()}
$('morphMemo').oninput=saveMorph;$('morphCopy').onclick=()=>copyText(morphReport());$('microscopySave').onclick=()=>{const total=diffTotal(),note=morphReport();if(!total&&!diff.counts.nRBC&&!note)return showToast('저장할 내용이 없습니다.');const detail=[diffReport(),note].filter(Boolean).join(' · ').replace(/\n/g,' · ');saveHistoryItem('Diff + Morphology',`${total} WBC${diff.counts.nRBC?` · nRBC ${diff.counts.nRBC}`:''}`,detail);showToast('오늘 기록에 저장했습니다.')};$('morphReset').onclick=()=>{morph={values:{},memo:''};localStorage.setItem(MORPH_KEY,JSON.stringify(morph));renderMorph()};

function normalizedKey(value){
  const v=String(value||'').trim();
  if(!v)return '';
  return v.length===1?v.toUpperCase():'';
}
function saveKeyMap(){localStorage.setItem(KEYMAP_KEY,JSON.stringify(keyMap));renderKeyMapping();renderDiff()}
function renderKeyHelper(){
  const labels=diffTypes.filter(t=>keyMap[t.name]).map(t=>`${keyMap[t.name]} ${t.name}`);
  if(keyMap.Undo)labels.push(`${keyMap.Undo} 실행 취소`);
  $('diffKeyHelper').textContent=`키보드: ${labels.join(' · ')}`;
}
function renderKeyMapping(){
  const rows=[...diffTypes.map(t=>t.name),'Undo'];
  $('keyMappingGrid').innerHTML=rows.map(name=>`<label class="key-map-row"><span>${name==='Undo'?'실행 취소':name}</span><input data-key-map="${name}" value="${keyMap[name]||''}" maxlength="1" inputmode="text" autocomplete="off" aria-label="${name} 단축키" /><button type="button" class="ghost-button small-button" data-key-clear="${name}">해제</button></label>`).join('');
  qsa('[data-key-map]').forEach(input=>{
    input.onkeydown=e=>{
      if(e.key==='Escape'){input.blur();return}
      if(e.key==='Backspace'||e.key==='Delete'){e.preventDefault();keyMap[input.dataset.keyMap]='';$('keyMappingMessage').textContent='단축키를 해제했습니다.';saveKeyMap();return}
      if(e.ctrlKey||e.altKey||e.metaKey||e.key.length!==1)return;
      e.preventDefault();
      const key=normalizedKey(e.key),name=input.dataset.keyMap;
      const duplicate=Object.entries(keyMap).find(([n,k])=>n!==name&&normalizedKey(k)===key);
      if(duplicate){$('keyMappingMessage').textContent=`${key} 키는 이미 ${duplicate[0]==='Undo'?'실행 취소':duplicate[0]}에 지정되어 있습니다.`;return}
      keyMap[name]=key;$('keyMappingMessage').textContent=`${name==='Undo'?'실행 취소':name}: ${key}로 변경했습니다.`;saveKeyMap();
    };
  });
  qsa('[data-key-clear]').forEach(button=>button.onclick=()=>{keyMap[button.dataset.keyClear]='';$('keyMappingMessage').textContent='단축키를 해제했습니다.';saveKeyMap()});
  renderKeyHelper();
}
$('keyMappingToggle').onclick=()=>{const panel=$('keyMappingPanel'),open=panel.classList.toggle('hidden')===false;$('keyMappingToggle').setAttribute('aria-expanded',String(open));$('keyMappingToggle').textContent=open?'키 맵핑 닫기':'키 맵핑'};
$('keyMappingReset').onclick=()=>{keyMap={...defaultKeyMap};$('keyMappingMessage').textContent='기본 키 배열로 복원했습니다.';saveKeyMap()};

document.addEventListener('keydown',e=>{const active=document.querySelector('.page.active')?.dataset.pagePanel;const tag=document.activeElement?.tagName;if(['INPUT','TEXTAREA','SELECT'].includes(tag))return;if(active==='diff'){const pressed=normalizedKey(e.key);const target=Object.entries(keyMap).find(([,key])=>normalizedKey(key)===pressed)?.[0];if(target==='Undo'){$('diffUndo').click();return}if(target&&diffTypes.some(t=>t.name===target)){changeDiff(target,1);return}}if(active==='field'){if(e.code==='Space'){e.preventDefault();changeMain(1)}if(e.key==='Backspace'){e.preventDefault();changeMain(-1)}if(e.key==='ArrowRight'){e.preventDefault();changeField(1)}if(e.key==='ArrowLeft'){e.preventDefault();changeField(-1)}}});
qsa('input').forEach(i=>i.addEventListener('keydown',e=>{if(e.key==='Enter'){const p=i.closest('.page'),a=p?.querySelector('.tab-panel.active')||p;a?.querySelector('.primary-button')?.click()}}));
function clearHistory(){localStorage.setItem(HISTORY_KEY,JSON.stringify({date:todayString(),items:[]}));renderHistory()}qsa('[data-history-clear]').forEach(button=>button.onclick=clearHistory);
function applyTheme(t){document.body.classList.toggle('dark',t==='dark');$('themeToggle').textContent=t==='dark'?'라이트':'다크';localStorage.setItem(THEME_KEY,t)}$('themeToggle').onclick=()=>applyTheme(document.body.classList.contains('dark')?'light':'dark');
let deferredPrompt=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('installButton').classList.remove('hidden')});$('installButton').onclick=async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$('installButton').classList.add('hidden')};
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));
restoreInputs();applyTheme(localStorage.getItem(THEME_KEY)||'light');updateNeu('wbc');renderHistory();renderKeyMapping();renderDiff();saveField();renderMorph();
