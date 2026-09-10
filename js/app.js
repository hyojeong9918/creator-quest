"use strict";

/* ═══════════ 데이터 ═══════════ */
const STAGES=[
 {n:1,key:'trend',   name:'소재 발굴', short:'소재 발굴',      c1:'#d8efff',c2:'#5aa9e2'},
 {n:2,key:'idea',    name:'아이디어 생성 & 평가',    short:'아이디어 생성', c1:'#fff2cf',c2:'#f2b83c'},
 {n:3,key:'plan',    name:'콘텐츠 기획 & 포맷 결정', short:'기획 · 포맷',   c1:'#ece4ff',c2:'#8a6fd8'},
 {n:4,key:'script',  name:'대본 · 카피 · 컷리스트',  short:'대본 · 컷',     c1:'#ffe0ef',c2:'#ee5b9d'},
 {n:5,key:'carousel',name:'캐러셀 자동 제작',        short:'캐러셀 제작',   c1:'#d9f6e9',c2:'#3aa583'},
 {n:6,key:'caption', name:'캡션 · CTA · 자동 DM',    short:'캡션 · DM',     c1:'#ffe2e2',c2:'#e96f6f'}
];
const KEYS=STAGES.map(s=>s.key);
const LEVELS=['콘텐츠 견습생','기획 수습','업로드 러너','포맷 장인','알고리즘 조련사','스튜디오 마스터'];
const DESC={
 trend:'지금 다룰 만한 소재를 모으는 방이에요. 마음에 드는 카드를 채택하면 2번 방으로 넘어갑니다.',
 idea:'채택한 소재를 콘텐츠 아이디어로 바꾸고 저장·공감·차별성 점수를 매깁니다.',
 plan:'무엇을 어떤 포맷으로 만들지 정해요. 포맷은 추천을 받거나 직접 고를 수 있어요.',
 script:'슬라이드 카피 또는 릴스 대본과 컷리스트를 씁니다. 문장은 여기서 바로 고칠 수 있어요.',
 carousel:'템플릿을 고르면 4번 방의 카피가 그대로 이미지가 됩니다. PNG로 저장해서 올리세요.',
 caption:'캡션 3안, 첫 댓글, 해시태그 묶음, DM 자동응답 시나리오를 한 번에 만듭니다.'
};
const STAFF={
 trend:{name:'리나',role:'트렌드 리서처',style:'bob',acc:'cap',
   hair:'#8a5a3a',hair2:'#c08a5e',cloth:'#7fc2ef',cloth2:'#d6efff',a1:'#bfe0fa',a2:'#3f95d4',
   line:'유행보다, 사람들이 어디서 스크롤을 멈추는지를 봐요.',
   persona:'차분하고 데이터로 말한다. 근거 없는 유행은 경계하고 항상 검증 방법을 덧붙인다.'},
 idea:{name:'포포',role:'아이디어 뱅크',style:'spiky',acc:'star',
   hair:'#f0913a',hair2:'#ffc06a',cloth:'#ffd06a',cloth2:'#fff3d4',a1:'#fff0b8',a2:'#f0b52c',
   line:'일단 열 개 던져요. 아홉 개 버려도 하나 남으면 이득!',
   persona:'에너지가 넘치고 발상이 빠르다. 과감하게 제안하되 왜 통할지 한 줄로 설명한다.'},
 plan:{name:'단이',role:'콘텐츠 디렉터',style:'straight',acc:'glasses',
   hair:'#4a3b63',hair2:'#7a6796',cloth:'#b6a3f0',cloth2:'#ece4ff',a1:'#ffffff',a2:'#6f57bd',
   line:'만들기 전에 목적부터 한 문장으로 정합시다.',
   persona:'구조를 잡는 사람. 냉정하게 우선순위를 정하고 애매한 표현을 싫어한다.'},
 script:{name:'서니',role:'카피라이터',style:'pony',acc:'pencil',
   hair:'#b96a7e',hair2:'#e79bad',cloth:'#ff9ecb',cloth2:'#ffe0ef',a1:'#ffd873',a2:'#e0972a',
   line:'첫 줄에서 안 잡히면 나머지는 안 읽혀요.',
   persona:'문장에 예민하다. 군더더기를 덜어내고 구체적인 단어로 바꾼다.'},
 carousel:{name:'모카',role:'디자이너',style:'wave',acc:'beret',
   hair:'#5f4a7d',hair2:'#8f77b3',cloth:'#8ddcbb',cloth2:'#dcf8ec',a1:'#b9ecd9',a2:'#3aa583',
   line:'글자 수만 맞춰줘도 디자인은 반쯤 끝나요.',
   persona:'레이아웃과 글자 수에 민감하다. 가독성을 최우선으로 조언한다.'},
 caption:{name:'루루',role:'커뮤니티 매니저',style:'twin',acc:'headset',
   hair:'#c07f4e',hair2:'#e8a978',cloth:'#ff9d9d',cloth2:'#ffe2e2',a1:'#ffd0d0',a2:'#e05f5f',
   line:'올린 다음 30분이 진짜 시작이에요.',
   persona:'반응을 관리하는 사람. 댓글·DM 운영과 태그 전략에 밝고 실행 단위로 말한다.'}
};
const PLAYER_LOOK={style:'long',acc:'none',hair:'#6a4f9c',hair2:'#a186dd',cloth:'#ff9ecb',cloth2:'#ffe6f3',a1:'#fff',a2:'#ef5b9d'};

/* ═══════════ 캐릭터 ═══════════ */
function starPath(cx,cy,r){
  return 'M'+cx+' '+(cy-r)+' L'+(cx+r*.28)+' '+(cy-r*.28)+' L'+(cx+r)+' '+cy+' L'+(cx+r*.28)+' '+(cy+r*.28)
   +' L'+cx+' '+(cy+r)+' L'+(cx-r*.28)+' '+(cy+r*.28)+' L'+(cx-r)+' '+cy+' L'+(cx-r*.28)+' '+(cy-r*.28)+' Z';
}
function charBody(key){
  const L = key==='player' ? PLAYER_LOOK : STAFF[key];
  const u='g'+key;
  let s='<defs>'
   +'<radialGradient id="sk'+u+'" cx="38%" cy="30%" r="78%"><stop offset="0" stop-color="#fff5ec"/><stop offset="1" stop-color="#ffdcc4"/></radialGradient>'
   +'<linearGradient id="hr'+u+'" x1="0" y1="0" x2=".5" y2="1"><stop offset="0" stop-color="'+L.hair2+'"/><stop offset=".55" stop-color="'+L.hair+'"/><stop offset="1" stop-color="'+L.hair+'"/></linearGradient>'
   +'<linearGradient id="cl'+u+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+L.cloth2+'"/><stop offset=".6" stop-color="'+L.cloth+'"/><stop offset="1" stop-color="'+L.cloth+'"/></linearGradient>'
   +'<linearGradient id="ac'+u+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+L.a1+'"/><stop offset="1" stop-color="'+L.a2+'"/></linearGradient>'
   +'</defs>';
  s+='<ellipse cx="36" cy="82" rx="20" ry="3.6" fill="rgba(92,80,145,.16)"/>';
  // 뒷머리
  if(L.style==='long') s+='<ellipse cx="36" cy="38" rx="24" ry="30" fill="url(#hr'+u+')"/>';
  else s+='<ellipse cx="36" cy="34" rx="23" ry="24" fill="url(#hr'+u+')"/>';
  if(L.style==='twin'){ s+='<ellipse cx="12" cy="46" rx="7" ry="12" fill="url(#hr'+u+')"/><ellipse cx="60" cy="46" rx="7" ry="12" fill="url(#hr'+u+')"/>'; }
  if(L.style==='pony'){ s+='<ellipse cx="61" cy="32" rx="7.5" ry="13" fill="url(#hr'+u+')" transform="rotate(14 61 32)"/>'; }
  // 몸
  s+='<path d="M11 86 C11 68 22 60 36 60 C50 60 61 68 61 86 Z" fill="url(#cl'+u+')"/>'
   +'<path d="M11 86 C11 74 17 66 24 63 C22 72 21 79 21 86 Z" fill="#ffffff" opacity=".33"/>'
   +'<rect x="32" y="49" width="8" height="12" rx="4" fill="#f3c4a6"/>';
  // 얼굴
  s+='<ellipse cx="16" cy="37" rx="3" ry="4.4" fill="#ffdcc4"/><ellipse cx="56" cy="37" rx="3" ry="4.4" fill="#ffdcc4"/>'
   +'<ellipse cx="36" cy="35" rx="20" ry="21" fill="url(#sk'+u+')"/>';
  // 앞머리
  const fr={
   bob:'M15 33 C15 14 23 8 36 8 C49 8 57 14 57 33 C52 21 45 19 36 19 C27 19 20 21 15 33 Z',
   straight:'M16 32 C16 13 24 8 36 8 C48 8 56 13 56 32 L56 23 L16 23 Z',
   spiky:'M15 34 C16 15 24 7 36 7 C48 7 56 15 57 34 L51 22 L47 30 L42 19 L37 29 L32 18 L27 29 L22 20 Z',
   wave:'M15 33 C15 14 23 8 36 8 C49 8 57 14 57 33 C54 26 51 30 47 25 C43 30 40 24 36 28 C32 24 29 30 25 25 C21 30 18 26 15 33 Z',
   pony:'M15 33 C15 14 23 8 36 8 C49 8 57 14 57 33 C52 21 45 19 36 19 C27 19 20 21 15 33 Z',
   twin:'M15 33 C15 14 23 8 36 8 C49 8 57 14 57 33 C52 21 45 19 36 19 C27 19 20 21 15 33 Z',
   long:'M15 33 C15 13 23 7 36 7 C49 7 57 13 57 33 C51 20 44 18 36 18 C28 18 21 20 15 33 Z'
  }[L.style]||'M15 33 C15 14 23 8 36 8 C49 8 57 14 57 33 C52 21 45 19 36 19 C27 19 20 21 15 33 Z';
  s+='<path d="'+fr+'" fill="url(#hr'+u+')"/>';
  s+='<ellipse cx="27" cy="15" rx="8" ry="3.4" fill="#ffffff" opacity=".42" transform="rotate(-16 27 15)"/>';
  // 눈·볼·입
  s+='<ellipse cx="29" cy="38" rx="3.1" ry="4" fill="#3b2f52"/><circle cx="27.9" cy="36.4" r="1.25" fill="#fff"/>'
   +'<ellipse cx="43" cy="38" rx="3.1" ry="4" fill="#3b2f52"/><circle cx="41.9" cy="36.4" r="1.25" fill="#fff"/>'
   +'<ellipse cx="23.5" cy="43.5" rx="3.8" ry="2.2" fill="#ff9ec0" opacity=".55"/>'
   +'<ellipse cx="48.5" cy="43.5" rx="3.8" ry="2.2" fill="#ff9ec0" opacity=".55"/>'
   +'<path d="M33.4 45.2 q2.6 2.8 5.2 0" stroke="#d0708f" stroke-width="1.5" fill="none" stroke-linecap="round"/>';
  // 소품
  if(L.acc==='cap'){
    s+='<path d="M16 25 C16 11 24 5 36 5 C48 5 56 11 56 25 Z" fill="url(#ac'+u+')"/>'
     +'<path d="M13 25 C25 20 45 21 59 27 C48 31 26 31 13 25 Z" fill="'+L.a2+'"/>'
     +'<ellipse cx="27" cy="12" rx="7" ry="3" fill="#fff" opacity=".45" transform="rotate(-18 27 12)"/>';
  } else if(L.acc==='star'){
    s+='<path d="'+starPath(54,13,6.5)+'" fill="url(#ac'+u+')"/><path d="'+starPath(54,13,3)+'" fill="#fff" opacity=".75"/>';
  } else if(L.acc==='glasses'){
    s+='<g fill="rgba(255,255,255,.32)" stroke="'+L.a2+'" stroke-width="1.7">'
     +'<rect x="22.5" y="33.5" width="13" height="9.5" rx="4.5"/><rect x="36.5" y="33.5" width="13" height="9.5" rx="4.5"/></g>'
     +'<path d="M35.5 38 h1" stroke="'+L.a2+'" stroke-width="1.7"/>'
     +'<path d="M25 35.5 l3 -1" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".85"/>';
  } else if(L.acc==='pencil'){
    s+='<g transform="rotate(22 56 14)"><rect x="53.5" y="8" width="5" height="14" rx="1.5" fill="url(#ac'+u+')"/>'
     +'<path d="M53.5 22 h5 l-2.5 4 Z" fill="#f0d0a8"/><rect x="53.5" y="8" width="5" height="3" rx="1.5" fill="#ff9ec0"/></g>';
  } else if(L.acc==='beret'){
    s+='<g transform="rotate(-9 36 15)"><ellipse cx="36" cy="15" rx="21" ry="9.5" fill="url(#ac'+u+')"/>'
     +'<circle cx="48" cy="7" r="3.2" fill="'+L.a2+'"/>'
     +'<ellipse cx="28" cy="12" rx="7.5" ry="3" fill="#fff" opacity=".45"/></g>';
  } else if(L.acc==='headset'){
    s+='<path d="M13 36 C13 10 59 10 59 36" stroke="url(#ac'+u+')" stroke-width="4.5" fill="none" stroke-linecap="round"/>'
     +'<rect x="8" y="31" width="9" height="14" rx="4.5" fill="url(#ac'+u+')"/>'
     +'<rect x="55" y="31" width="9" height="14" rx="4.5" fill="url(#ac'+u+')"/>'
     +'<path d="M22 16 C30 11 42 11 50 16" stroke="#fff" stroke-width="2" fill="none" opacity=".5" stroke-linecap="round"/>';
  }
  // 반짝임
  s+='<path d="'+starPath(64,22,4.2)+'" fill="#fff" opacity=".9"/><path d="'+starPath(9,20,3)+'" fill="#fff" opacity=".7"/>';
  return s;
}
function charSVG(key,cls){
  const src=CHARS[key]||CHARS.trend;
  return '<img class="chr '+(cls||'')+'" src="'+src+'" alt="" draggable="false">';
}

/* ═══════════ 상태 ═══════════ */
const emptySlice=()=>({input:{},data:null,picked:[],reqs:[],chat:[],done:false,stale:false});
function freshState(){
  const st={}; KEYS.forEach(k=>st[k]=emptySlice());
  return {v:2, player:{name:'',niche:'',target:'20~30대 여성',tone:'친근하고 솔직한',platform:'인스타그램'},
    xp:0, cur:1, screen:'home', st, theme:null, tpl:'film', seenPlayer:false, avatar:0, chatWith:'trend', fontT:'배민 도현', fontB:'카페24 프로업', sizeT:100, sizeB:100, colT:'#ffffff', colB:'#ffffff', colA:'#eaff5a', cardEd:{}, edIdx:0, edSel:'h'};
}
let S=freshState(), sampleFn=null, dlFn=null, running=null;
const LS='creatorquest.v2';
let saveT=null;
let saveWarned=false;
function save(){ clearTimeout(saveT); saveT=setTimeout(()=>{
  try{ const c=Object.assign({},S); delete c.photo; localStorage.setItem(LS,JSON.stringify(c)); saveWarned=false; }
  catch(e){ if(!saveWarned){ saveWarned=true;
    toast('저장 공간이 가득 찼어요. 지시문은 이 창에서는 그대로 쓰이지만 새로고침하면 사라질 수 있어요'); } }
},250); }
function load(){ try{ const r=localStorage.getItem(LS); if(!r)return; const d=JSON.parse(r);
  if(d&&d.st){ KEYS.forEach(k=>{ if(!d.st[k]) d.st[k]=emptySlice(); }); S=Object.assign(freshState(),d);
    if(!['film','glow','talk','crop'].includes(S.tpl)) S.tpl='film';
  } }catch(e){} }

const $=id=>document.getElementById(id);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arr=x=>Array.isArray(x)?x:[];
const stg=()=>STAGES[S.cur-1];
const slice=()=>S.st[stg().key];
const onStage=()=>S.screen==='stage';
const chatKey=()=>S.chatWith||'trend';
const chatStage=()=>STAGES[KEYS.indexOf(chatKey())];
const chatSlice=()=>S.st[chatKey()];
function toast(m,win){ const d=document.createElement('div'); d.className='toast'+(win?' win':''); d.textContent=m;
  $('toasts').appendChild(d); setTimeout(()=>{d.style.opacity='0';d.style.transition='opacity .4s'},2300); setTimeout(()=>d.remove(),2800); }
function trunc(o,max){ const s=typeof o==='string'?o:JSON.stringify(o); return s.length>max?s.slice(0,max)+'…':s; }
function lvOf(x){ return Math.min(6,Math.floor(x/120)+1); }
function addXp(n,why){ S.xp+=n; drawTop(); save(); if(why) toast('+'+n+' XP · '+why,true); }
function drawTop(){
  const lv=lvOf(S.xp), inLv=S.xp%120;
  $('lvPlate').textContent='Lv.'+lv+' '+((S.player.name||'Creator').slice(0,10));
  $('xpName').textContent=LEVELS[lv-1];
  $('xpNum').textContent=inLv+' / 120 XP';
  $('xpFill').style.width=(inLv/120*100)+'%';
  $('stars').innerHTML=STAGES.map(s=>'<i class="'+(S.st[s.key].done?'on':'')+'">★</i>').join('');
  const av=AVATARS[S.avatar]||AVATARS[0];
  $('avatarSlot').innerHTML='<img class="ava" src="'+av.s+'" alt="내 캐릭터">';
}

/* ═══════════ 내비 ═══════════ */
const NAV=[
 {k:'home',ic:'🏠',t:'Dashboard'},
 {k:'tools',ic:'⚙',t:'AI Tools'},
 {k:'content',ic:'📁',t:'My Content'},
 {k:'templates',ic:'🎨',t:'Templates'},
 {k:'stats',ic:'📊',t:'Analytics'},
 {k:'settings',ic:'🔧',t:'Settings'}
];
const NAVPOS=[41.8,49.6,57.5,65.4,73.3,81.2];
function drawNav(){
  const act = S.screen==='stage' ? 'tools' : S.screen;
  $('nav').innerHTML=NAV.map((n,i)=>'<button class="nav-i'+((act===n.k)?' on':'')+'" data-nav="'+n.k+'" style="--t:'+NAVPOS[i]+'%"><span class="ic">'+n.ic+'</span>'+n.t+'</button>').join('');
}

/* ═══════════ 맵 ═══════════ */

const BSPOTS=[[9.6,19.6,16.6,22.9],[28.9,32.2,16.0,25.0],[19.1,56.4,16.4,25.7],[48.0,55.5,17.1,26.0],[59.3,20.8,16.0,26.4],[79.5,44.8,12.5,22.2]];
const SPOTS=[{"x": 17.045, "y": 45.165, "w": 10.167, "h": 5.101, "bx": 23.983, "by": 43.252}, {"x": 36.184, "y": 59.724, "w": 9.809, "h": 5.101, "bx": 43.092, "by": 57.705}, {"x": 27.063, "y": 84.75, "w": 10.706, "h": 4.995, "bx": 34.031, "by": 82.891}, {"x": 55.921, "y": 84.166, "w": 10.048, "h": 5.101, "bx": 62.859, "by": 82.465}, {"x": 66.896, "y": 49.841, "w": 9.988, "h": 5.101, "bx": 73.624, "by": 48.087}, {"x": 86.244, "y": 69.607, "w": 9.809, "h": 5.101, "bx": 93.062, "by": 67.906}];
function mapSVG(){
  let o='<div class="mapimg"><img src="'+MAP_SRC+'" alt="6단계 콘텐츠 제작 맵" draggable="false">';
  STAGES.forEach((st,i)=>{
    const p=SPOTS[i], sl=S.st[st.key];
    o+='<button class="spot" data-stage="'+st.n+'" title="'+esc(st.name)+'" aria-label="'+st.n+'단계 '+esc(st.name)+'"'
     +' style="left:'+p.x+'%;top:'+p.y+'%;width:'+p.w+'%;height:'+p.h+'%">'
     +'<span class="spot-t">'+esc(st.short)+'</span></button>';
    o+='<span class="badge'+(sl.done?' done':(sl.data?' doing':''))+'" style="left:'+p.bx+'%;top:'+p.by+'%">'
     +(sl.done?'★':st.n)+'</span>';
  });
  STAGES.forEach((st,i)=>{ const p=BSPOTS[i];
    o+='<button class="spot-b" data-stage="'+st.n+'" tabindex="-1" aria-hidden="true"'
     +' style="left:'+p[0]+'%;top:'+p[1]+'%;width:'+p[2]+'%;height:'+p[3]+'%"></button>';
  });
  o+='<button class="startbtn" data-act="openSel" data-agent-action="open-stage-select" aria-label="게임 시작 — 1번부터 6번까지 방 고르는 창 열기">'
   +'<img src="'+START_SRC+'" alt="START GAME" draggable="false"></button>';
  return o+'</div>';
}
/* ═══════════ 화면 ═══════════ */
function todayList(){
  const p=S.st, rows=[
   {t:'PLAN',   ok:p.trend.done||p.plan.done,            y:54.9},
   {t:'CREATE', ok:p.script.done,                        y:64.7},
   {t:'POST',   ok:p.carousel.done&&p.caption.done,      y:74.9},
   {t:'GROW',   ok:p.caption.done,                       y:85.0}];
  return rows.map(r=>'<span class="cw-dot'+(r.ok?' on':'')+'" style="top:'+r.y+'%"></span>'
   +'<span class="cw-lab'+(r.ok?' on':'')+'" style="top:'+r.y+'%">'+r.t+'</span>').join('');
}
const DWCARD=[[4.43,39.32],[27.39,39.32],[50.36,39.32],[73.44,39.32],[4.43,64.19],[27.39,64.19]];
function stageSelect(){
  const nextStage=(STAGES.find(s=>!S.st[s.key].done)||STAGES[5]);
  return '<div class="dashwrap"><img src="'+BOT_SRC+'" alt="" draggable="false">'
   + '<span class="dw-title">DASHBOARD</span>'
   + '<span class="dw-head">'+(S.player.name?esc(S.player.name)+'님, ':'')+'오늘은 '+nextStage.n+'번 방부터예요</span>'
   + '<button class="dw-go" data-stage="'+nextStage.n+'" aria-label="'+nextStage.n+'번 방 '+nextStage.name+'으로 이동">'+nextStage.n+'번 방 들어가기</button>'
   + '<span class="dw-sub"><span>오늘도 뭐라도 만들어보려는 당신, 이미 멋짐 ✨<br>카드를 눌러 방에 들어가고, 1번부터 차례로 가면 앞 결과가 다음 방으로 알아서 넘어가요.</span></span>'
   + STAGES.map((s2,i)=>{ const sl=S.st[s2.key], c=DWCARD[i];
       return '<button class="dw-card" style="left:'+c[0]+'%;top:'+c[1]+'%" data-stage="'+s2.n+'" title="'+esc(s2.name)+'" aria-label="'+s2.n+'번 방 '+esc(s2.name)+'으로 이동">'
        +'<span class="dwc-thumb">'+charSVG(s2.key)+'</span>'
        +'<span class="dwc-name">'+esc(s2.short)+'</span>'
        +'<span class="dwc-l1">'+STAFF[s2.key].name+' · '+s2.n+'번 방</span>'
        +'<span class="dwc-l2">'+(sl.done?'확정됨 ⭐':(sl.data?'작업 중':'비어 있음'))+'</span></button>';
     }).join('')
   + '<button class="dw-close" data-act="closeSel" aria-label="닫기">✕</button>'
   + '</div>';
}
function openStageSelect(){
  const p=$('selBg'); p.innerHTML='<div class="selbox">'+stageSelect()+'</div>'; p.hidden=false;
}
function closeStageSelect(){ const p=$('selBg'); p.hidden=true; p.innerHTML=''; }
function openResults(){
  const st=stg(), sl=slice(); if(!sl.data) return;
  const head='<b>RESULT · STAGE 0'+st.n+'</b><span class="right">'
   +'<button class="pxbtn sm" data-act="clear">결과 비우기</button>'
   +'<button class="pxbtn sm '+(sl.done?'':'mint')+'" data-act="done">'+(sl.done?'✓ 확정됨':'이 단계 확정')+'</button>'
   +'<button class="pxbtn sm" data-act="closeRes">닫기</button></span>';
  const p=$('resBg'); p.innerHTML='<div class="selbox">'+pxwin(head,resultsFor(st.key,sl))+'</div>'; p.hidden=false;
  if(st.key==='carousel') afterCarousel();
}
function closeResults(){ const p=$('resBg'); p.hidden=true; p.innerHTML=''; }

function screenHome(){
  return '<div class="mapwrap">'
   + mapSVG()
   + '<div class="checkwin"><img src="'+TODO_SRC+'" alt="" draggable="false">'
   + '<span class="cw-title">TODO</span>'
   + '<span class="cw-head">Good Content<br>Brighter You ♡</span>'
   + todayList()
   + '</div></div>';
}

function screenTools(){
  return pxwin('<b>STAFF ROOM</b><span class="right"><button class="pxbtn sm" data-nav="home">맵 보기</button></span>',
   '<h2 class="sh">직원실</h2><p class="sub">방마다 담당 직원이 다릅니다. 방에 들어가지 않아도 여기서 바로 대화할 수 있어요.</p>'
   +'<div class="roster" style="margin-top:12px">'
   + STAGES.map(s2=>{ const c=STAFF[s2.key], sl=S.st[s2.key];
       return '<div class="rcard">'
        +'<span class="rc-face">'+charSVG(s2.key)+'</span>'
        +'<span class="rc-num">'+s2.n+'번 방</span>'
        +'<span class="nm">'+c.name+'</span>'
        +'<span class="rl">'+c.role+'</span>'
        +'<span class="ln">“'+esc(c.line)+'”</span>'
        +'<span class="qstate">'+(sl.done?'확정됨 ⭐':(sl.data?'작업 중':'비어 있음'))+'</span>'
        +'<button class="pxbtn sm go" data-talk="'+s2.key+'" aria-label="'+STAFF[s2.key].name+'과 대화창 열기">대화하기</button>'
        +'<button class="pxbtn sm blue" data-stage="'+s2.n+'" aria-label="'+s2.n+'번 방 '+esc(s2.name)+'으로 이동">방 들어가기</button>'
        +((S.st[s2.key].sys||'').trim()?'<span class="sys-on">지시문 적용 중</span>':'')
        +'</div>';
     }).join('')
   +'</div>');
}

function screenTemplates(){
  const keys=Object.keys(CTPL);
  return pxwin('<b>TEMPLATES</b>',
   '<h2 class="sh">카드 템플릿</h2><p class="sub">여기서 고른 템플릿이 5번 방의 기본값이 됩니다. 미리보기는 실제로 그려지는 결과예요.</p>'
   +'<div class="tplgrid" style="margin-top:12px">'+keys.map(k=>'<button class="tplbig'+(S.tpl===k?' sel':'')+'" data-act="tpl" data-k="'+k+'">'
     +'<span class="ccwrap" data-cc="'+k+'"></span><span class="tb-n">'+CTPL[k].name+'</span><span class="tb-d">'+CTPL[k].note+'</span></button>').join('')
   +'</div><div class="notice">사진이 들어가는 템플릿은 5번 방에서 사진을 올리면 배경으로 깔립니다. 사진이 없으면 기본 그라데이션이 들어가요.</div>');
}

function screenContent(){
  const rows=STAGES.map(s=>{
    const sl=S.st[s.key]; let sum='비어 있음';
    const d=sl.data;
    if(d){
      if(s.key==='trend') sum=arr(d.cards).length+'개 소재 · 채택 '+sl.picked.length+'개';
      else if(s.key==='idea') sum=arr(d.ideas).length+'개 아이디어 · 채택 '+sl.picked.length+'개';
      else if(s.key==='plan') sum=(d.format||'-')+' · '+trunc(d.core_message||'',34);
      else if(s.key==='script') sum=arr(d.slides).length+'칸 원고';
      else if(s.key==='carousel') sum='템플릿 '+(CTPL[d.tpl||S.tpl]?CTPL[d.tpl||S.tpl].name:'-');
      else sum=arr(d.captions).length+'개 캡션 · 태그 준비됨';
    }
    return '<div class="flow-step"><span class="flow-n">'+s.n+'</span><span><span class="flow-b">'+esc(s.short)+(sl.done?' ⭐':'')+'</span><br><span class="flow-d">'+esc(sum)+'</span></span></div>';
  }).join('');
  return pxwin('<b>MY CONTENT</b><span class="right"><button class="pxbtn sm blue" data-act="export">전체 내보내기</button></span>',
   '<h2 class="sh">내 콘텐츠</h2><p class="sub">지금 프로젝트의 6단계 상태입니다. 내보내기를 누르면 마크다운 문서로 저장돼요.</p>'
   +'<div class="panel" style="margin-top:12px">'+rows+'</div>');
}
function screenStats(){
  const done=STAGES.filter(s=>S.st[s.key].done).length;
  const made=STAGES.filter(s=>S.st[s.key].data).length;
  const chats=KEYS.reduce((a,k)=>a+S.st[k].chat.filter(m=>m.role==='user').length,0);
  const reqs=KEYS.reduce((a,k)=>a+S.st[k].reqs.length,0);
  const box=(t,v)=>'<div class="panel" style="text-align:center;margin:0"><div style="font-family:var(--px);font-size:20px;color:var(--pink-4)">'+v+'</div><div style="font-family:var(--game);font-size:13px;color:var(--ink-2)">'+t+'</div></div>';
  return pxwin('<b>RECORD</b>',
   '<h2 class="sh">기록</h2><p class="sub">이번 프로젝트에서 지금까지 한 일이에요.</p>'
   +'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin-top:12px">'
   + box('총 XP',S.xp)+box('레벨',lvOf(S.xp))+box('확정한 단계',done+' / 6')+box('생성한 단계',made+' / 6')+box('직원과 대화',chats)+box('고정 규칙',reqs)
   +'</div>'
   +'<div class="panel" style="margin-top:12px"><div class="panel-h"><h3>직원별 대화</h3></div>'
   + STAGES.map(s=>{ const c=STAFF[s.key], n=S.st[s.key].chat.filter(m=>m.role==='user').length;
       return '<div class="cw-li'+(n?' done':'')+'" style="font-size:13.5px"><span class="cw-box"></span>'+c.name+' ('+c.role+') · '+n+'회</div>'; }).join('')
   +'</div>');
}
function screenSettings(){
  const p=S.player;
  const bar=(y,h,t)=>'<div class="set-bar" style="--y:'+y+'%;--h:'+h+'%">'+t+'</div>';
  const box=(y,h,c)=>'<div class="set-box" style="--y:'+y+'%;--h:'+h+'%">'+c+'</div>';
  let o='<div class="setwrap"><span class="set-title">SETTINGS</span>';
  o+=bar(11.79,3.4,'내 캐릭터')
   + box(15.19,16.85,'<div class="field-grid tight">'
     +'<div><label class="f" for="s_name">계정 · 브랜드</label><input type="text" id="s_name" data-p="name" value="'+esc(p.name)+'" placeholder="@내계정"></div>'
     +'<div><label class="f" for="s_niche">분야 · 주제</label><input type="text" id="s_niche" data-p="niche" value="'+esc(p.niche)+'" placeholder="예: 20대 뷰티"></div>'
     +'<div><label class="f" for="s_target">주 타깃</label><input type="text" id="s_target" data-p="target" value="'+esc(p.target)+'"></div>'
     +'<div><label class="f" for="s_tone">톤앤매너</label><input type="text" id="s_tone" data-p="tone" value="'+esc(p.tone)+'"></div>'
     +'<div><label class="f">주 플랫폼</label>'+dd('p','platform',['인스타그램','릴스 중심','네이버 블로그','유튜브 쇼츠','틱톡','스레드'],p.platform)+'</div>'
     +'</div>');
  o+=bar(33.70,3.5,'캐릭터 고르기')
   + box(37.20,20.07,'<div class="avagrid">'
     + AVATARS.map((a,i)=>'<button class="avapick'+(S.avatar===i?' sel':'')+'" data-act="ava" data-i="'+i+'" title="'+a.n+'"><img src="'+a.s+'" alt="'+a.n+'"><span>'+a.n+'</span></button>').join('')
     +'</div>');
  o+=bar(58.93,3.5,'화면')
   + box(62.43,11.05,'<div class="set-row"><button class="pxbtn sm" data-act="theme">밝게 / 어둡게 바꾸기</button>'
     +'<span class="chip-note">기기 설정을 따라가다가, 누르면 고정됩니다.</span></div>');
  o+=bar(75.14,3.5,'프로젝트')
   + box(78.64,14.64,'<div class="set-row"><button class="pxbtn sm blue" data-act="exportjson" aria-label="프로젝트 전체를 JSON 파일로 내보내기 — 불러오기로 되돌릴 수 있는 형식">JSON 내보내기</button>'
     +'<button class="pxbtn sm" data-act="export" aria-label="읽기용 마크다운 문서로 내보내기">문서로 보기</button>'
     +'<label class="pxbtn sm blue" style="cursor:pointer" aria-label="JSON 파일에서 프로젝트 불러오기">불러오기<input type="file" accept="application/json,.json" id="projIn" style="display:none" aria-label="프로젝트 JSON 파일 선택"></label>'
     +'<button class="pxbtn sm" data-act="help">사용법 보기</button>'
     +'<button class="pxbtn sm" data-act="reset">새 프로젝트</button></div>'
     +'<div class="chip-note" style="margin-top:8px">새 프로젝트를 시작하면 6단계 결과와 설정이 모두 지워집니다. 먼저 내보내기를 해두세요.</div>');
  return o+'</div>';
}

const AGENTTASK={
 trend:'채택할 소재를 찾는다. 재료가 있으면 그 안에 숨은 관심 이유·긴장·콘텐츠가 될 지점을 찾아내고, 없으면 분야 기준으로 캐낸다.',
 idea:'채택된 소재로 콘텐츠 아이디어 6개를 만든다. 각각 핵심 관점·핵심 갈등·약속을 정하고 저장/공감/실행/차별/확장을 점수로 평가한다.',
 plan:'채택된 아이디어로 기획안 한 장을 만든다. 포맷, 최종 제목, 최종 훅, 콘텐츠의 약속, 구성 흐름, 판단 기준을 정한다.',
 script:'확정된 기획으로 카드별 카피 또는 릴스 대본과 촬영 컷리스트를 쓴다.',
 carousel:'4번 방 원고를 카드 디자인에 맞게 다듬는다. headline 16자, body 52자 이내.',
 caption:'캡션 3안, 첫 댓글, CTA 3개, 규모별 해시태그, DM 자동응답 시나리오를 만든다.'
};
const AGENTSCHEMA={
 trend:'{"cards":[{"type":"material","source":"내 재료|추론","title":"","story":"","why":"","tension":"","seed":"","keywords":["","",""],"heat":70,"verify":""}]}',
 idea:'{"ideas":[{"title":"","angle":"","view":"","tension":"","promise":"","why":"","format_hint":"","stats":{"save":80,"empathy":70,"feasible":85,"unique":60,"scale":75},"total":74,"risk":""}]}',
 plan:'{"format":"","format_reason":"","working_title":"","title":"","hook":"","promise":"","goal":"","target":"","flow":[{"step":"","desc":""}],"volume":"","kpi":[],"cautions":[],"alts":[{"format":"","note":""}]}',
 script:'{"kind":"carousel|reels","slides":[{"n":1,"headline":"","body":"","visual":""}],"cuts":[{"cut":"1","screen":"","subtitle":"","audio":"","sec":""}],"tips":[]}',
 carousel:'{"slides":[{"n":1,"headline":"","body":""}]}',
 caption:'{"captions":[{"style":"","text":""}],"first_comment":"","ctas":[],"hashtags":{"big":[],"mid":[],"small":[],"community":[]},"dm":{"trigger_keyword":"","auto_reply":"","flow":[{"step":"","message":""}],"note":""},"posting_tip":""}'
};
function wbPrompt(key){
  const s2=STAGES.find(x=>x.key===key), sl=S.st[key];
  return [RULES,CRAFT,profileBlock(),sysBlock(key),
   '[지금 단계] '+s2.n+'단계 — '+s2.name,
   '[과제] '+AGENTTASK[key],
   upstream(key)?'[앞 단계 결과]\n'+upstream(key):'',
   reqBlock(key),
   '[출력] 아래 JSON만. 설명·마크다운·코드블록 금지.',
   '키 이름을 바꾸거나 새로 만들지 마라. 아래 키를 글자 그대로 쓴다. 값이 없으면 빈 문자열로 둔다.',
   AGENTSCHEMA[key]].filter(Boolean).join('\n');
}
function pick1(o,keys,d){ for(const k of keys){ if(o&&o[k]!=null&&o[k]!=='') return o[k]; } return d===undefined?'':d; }
function normCard(x){
  return {
    type: x.type||'material',
    source: pick1(x,['source'],'추론'),
    title: pick1(x,['title','headline','name']),
    story: pick1(x,['story','description','desc','summary','detail']),
    why:   pick1(x,['why','why_now','reason','appeal','interest','desire']),
    tension: pick1(x,['tension','conflict','angle','contrast','gap']),
    seed:  pick1(x,['seed','point','hook_point','value','type_of']),
    keywords: arr(x.keywords||x.tags||x.hashtags),
    heat: +pick1(x,['heat','score','potential'],70)||70,
    verify: pick1(x,['verify','check','note'])
  };
}
function normIdea(x){
  const sc=x.stats||x.scores||{};
  const g=(o,ks)=>{ for(const k of ks){ if(o[k]!=null) return +o[k]; } return 70; };
  const st={ save:g(sc,['save','저장','saving']), empathy:g(sc,['empathy','공감']),
    feasible:g(sc,['feasible','action','실행','feasibility']), unique:g(sc,['unique','differentiation','차별']),
    scale:g(sc,['scale','expansion','확장']) };
  const anyOver10=Object.values(st).some(v=>v>10);
  if(!anyOver10) Object.keys(st).forEach(k=>st[k]=Math.round(st[k]*10));
  const tot=+pick1(x,['total','score'], Math.round((st.save+st.empathy+st.feasible+st.unique+st.scale)/5));
  return { title: pick1(x,['title','headline']),
    angle: pick1(x,['angle','type','format_type']),
    view: pick1(x,['view','coreAngle','core_angle','perspective','point_of_view']),
    tension: pick1(x,['tension','conflict']),
    promise: pick1(x,['promise','benefit','takeaway']),
    why: pick1(x,['why','reason','appeal']),
    format_hint: pick1(x,['format_hint','format']),
    stats: st, total: tot, risk: pick1(x,['risk','caution','weakness']) };
}
function wbApply(key){
  const ta=$('wbIn_'+key), err=$('wbErr_'+key); if(!ta) return;
  let t=(ta.value||'').trim();
  t=t.replace(/^```(?:json)?/i,'').replace(/```$/,'').trim();
  const a=t.indexOf('{'), b=t.lastIndexOf('}');
  if(a>=0&&b>a) t=t.slice(a,b+1);
  let d; try{ d=JSON.parse(t); }catch(e){ if(err) err.textContent='JSON을 읽지 못했어요 — 중괄호로 시작하고 끝나는지 확인해주세요'; return; }
  const sl=S.st[key];
  if(key==='trend'){ const c=arr(d.cards||d.materials||d.items);
    if(!c.length){ err.textContent='cards 배열이 없어요'; return; }
    sl.data={cards:c.slice(0,9).map(normCard)}; sl.picked=[]; }
  else if(key==='idea'){ const c=arr(d.ideas||d.items);
    if(!c.length){ err.textContent='ideas 배열이 없어요'; return; }
    sl.data={ideas:c.slice(0,8).map(normIdea)}; sl.picked=[]; }
  else if(key==='carousel'){ const sc=S.st.script.data;
    if(sc&&arr(d.slides).length){ const m={}; arr(d.slides).forEach(x=>m[+x.n]=x);
      sc.slides=arr(sc.slides).map((x,ix)=>{const y=m[ix+1]||m[x.n];return y?Object.assign({},x,{headline:y.headline||x.headline,body:y.body||x.body}):x;}); }
    sl.data={built:true,tpl:S.tpl}; }
  else if(key==='script'){ d.slides=arr(d.slides).map((x,i)=>Object.assign({n:i+1},x)); sl.data=d; }
  else sl.data=d;
  sl.stale=false; markDownstream(key); addXp(20,'AI 결과 적용'); save(); render(); openResults();
  toast('결과를 적용했어요',true);
}

/* ═══════════ 프롬프트 ═══════════ */
function profileBlock(){
  const p=S.player;
  return ['[크리에이터 프로필]','- 계정/브랜드: '+(p.name||'미입력'),'- 분야·주제: '+(p.niche||'미입력'),
   '- 주 타깃: '+(p.target||'20~30대 여성'),'- 톤앤매너: '+(p.tone||'친근하고 솔직한'),'- 주 플랫폼: '+(p.platform||'인스타그램')].join('\n');
}
function sysBlock(key){
  const t=((S.st[key]&&S.st[key].sys)||'').trim();
  return t?'[이 직원에게 내가 직접 준 지시문 — 다른 규칙과 충돌하지 않는 선에서 최우선으로 지킨다]\n'+t:'';
}
function reqBlock(k){ const r=S.st[k].reqs; return r.length?'\n\n[이 단계 고정 규칙 — 반드시 지킬 것]\n'+r.map(x=>'- '+x).join('\n'):''; }
const CRAFT=['[너의 정체]',
 '너는 경력 15년 이상의 크리에이터 육성자이자 콘텐츠 전략가다. 시의성·욕망·감정·공감·호기심·갈등·의외성을 활용해',
 '사람들이 스크롤을 멈추고 끝까지 보게 만드는 콘텐츠를 기획해왔고 수많은 채널의 성장을 도왔다.',
 '[공통 원칙]',
 '- 좋은 정보와 좋은 콘텐츠를 같은 것으로 보지 않는다. 갈등이 없거나, 새로운 관점이 없거나, 감정을 건드리지 못하거나,',
 '  다음 내용을 궁금하게 만들지 못하면 한 단계 더 발전시킨다.',
 '- 개수를 채우려고 비슷한 것을 반복하지 않는다.',
 '- 약한 것을 좋다고 평가하지 않는다. 왜 약한지 밝히고 더 강한 방향으로 고쳐서 낸다.',
 '- 스스로 검증한다: "주제 단어만 바꾸면 아무 채널에서나 쓸 수 있는가?" 그렇다면 너무 일반적이므로 다시 발전시킨다.',
 '- 요청받은 단계까지만 한다. 다음 단계로 미리 넘어가지 않는다.'].join('\n');
const RULES=['[작성 원칙]','- 한국어. 20~30대 여성 독자에게 바로 쓸 수 있는 실무 수준으로 쓴다.',
 '- 뻔한 미사여구와 근거 없는 단정 금지.','- 실시간 웹 검색은 불가하다. 확인되지 않은 최신 수치·날짜·실존 인물의 근황은 만들어내지 않는다.'].join('\n');
function upstream(key){
  const t=S.st.trend,i=S.st.idea,p=S.st.plan,sc=S.st.script;
  if(key==='idea'){ const k=arr(t.data&&t.data.cards).filter((c,ix)=>t.picked.includes(ix));
    return k.length? k.map(c=>[
      c.title&&'- '+c.title,
      c.story&&'이야기: '+c.story,
      c.why&&'관심 이유: '+c.why,
      c.tension&&'긴장·갈등: '+c.tension,
      c.seed&&'콘텐츠 지점: '+c.seed
    ].filter(Boolean).join('\n')).filter(Boolean).join('\n\n') : null; }
  if(key==='plan'){ const k=arr(i.data&&i.data.ideas).filter((c,ix)=>i.picked.includes(ix));
    return k.length? k.map(c=>[
      c.title&&'- '+c.title,
      c.view&&'핵심 관점: '+c.view,
      c.tension&&'핵심 갈등: '+c.tension,
      c.promise&&'약속: '+c.promise,
      c.why&&'볼 이유: '+c.why,
      c.format_hint&&'추천 포맷: '+c.format_hint
    ].filter(Boolean).join('\n')).filter(Boolean).join('\n\n') : null; }
  if(key==='script') return p.data?trunc(p.data,2600):null;
  if(key==='carousel') return sc.data?trunc({slides:arr(sc.data.slides)},2600):null;
  if(key==='caption'){ const b=[];
    if(p.data){ const plan=[
      p.data.title&&'제목: '+p.data.title,
      p.data.hook&&'훅: '+p.data.hook,
      p.data.promise&&'약속: '+p.data.promise
    ].filter(Boolean).join('\n'); if(plan) b.push('[기획]\n'+trunc(plan,700)); }
    if(sc.data) b.push('[본문] '+trunc({slides:arr(sc.data.slides).map(s=>({n:s.n,headline:s.headline,body:s.body}))},2000));
    return b.length?b.join('\n'):null; }
  return null;
}
function markDownstream(k){ const ix=KEYS.indexOf(k); KEYS.slice(ix+1).forEach(x=>{ if(S.st[x].data) S.st[x].stale=true; }); }
function errCopy(c){ return ({
  invalid_request:'요청 형식이 잘못됐어요. 입력을 조금 줄이고 다시 눌러주세요.',
  transform_error:'요청을 준비하지 못했어요. 다시 눌러주세요.',
  queue_overflow:'요청이 한꺼번에 몰렸어요. 잠시 뒤 다시 눌러주세요.',
  capability_disabled:'이 화면에서는 AI를 쓸 수 없어요.',
  capability_removed:'이 앱 버전에서 지원하지 않는 기능이에요.',
  images_unavailable:'이 화면에서는 이미지를 보낼 수 없어요.',
  tools_unavailable:'이 화면에서는 도구를 쓸 수 없어요.',
  not_granted:'이 페이지가 Claude를 쓰도록 아직 허용되지 않았어요. 페이지를 새로 열고 허용을 눌러주세요.',
  sampling_disabled:'이 계정에서는 AI 호출을 쓸 수 없어요. 칸을 직접 채워도 다음 단계는 돌아갑니다.',
  not_declared:'AI 기능이 연결되지 않았어요.',
  api_not_configured:'Gemini API 키가 아직 연결되지 않았어요.',
  rate_limited:'요청이 몰렸어요. 30초쯤 뒤에 다시 눌러주세요.',
  session_expired:'로그인이 만료됐어요. 새로고침 후 다시 시도해주세요.',
  refused:'이 요청은 답변이 거절됐어요. 표현을 바꿔 다시 시도해주세요.',
  empty_completion:'답이 비어서 왔어요. 입력을 줄여 다시 시도해주세요.',
  invalid_json:'형식이 깨진 답이 왔어요. 한 번 더 눌러주세요.',
  prompt_too_large:'입력이 너무 길어요. 재료를 줄여주세요.',
  cancelled:'중단했어요.',
  upstream_error:'연결이 잠깐 끊겼어요. 다시 시도해주세요.'})[c]||'문제가 생겼어요. 다시 시도해주세요.'; }
function geminiSample(){
  return {json:async function(p,opt){
    const r=await fetch('/api/generate',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({prompt:p}),
      signal:opt&&opt.signal
    });
    const d=await r.json().catch(()=>({}));
    if(!r.ok) throw {code:d.code||'upstream_error',message:d.message||('HTTP '+r.status)};
    return d.data;
  }};
}
async function askJson(p,tier){
  if(!sampleFn) throw {code:'not_declared',message:'no sample'};
  running=new AbortController();
  try{ return await sampleFn.json(p,{modelTier:tier||'default',cache:false,signal:running.signal}); }
  finally{ running=null; }
}
function loadingHtml(id,msg){ return '<div class="loading" id="'+id+'"><div class="load-txt"><span>'+esc(msg)+'</span></div><div class="load-bar"><div class="load-blocks"></div></div></div>'; }
function setLoading(id,on,msg){ const e=$(id); if(!e)return; e.classList.toggle('on',on); if(msg)e.querySelector('.load-txt span').textContent=msg; }
function showErr(id,e){
  const h=$(id); if(!h) return;
  const code=(e&&e.code)||e||'unknown';
  h.innerHTML='<div class="err">'+esc(errCopy(code))
   +' <button class="pxbtn sm" data-act="gen" style="margin-left:6px">다시 시도</button>'
   +'<div style="font-size:11px;color:var(--ink-3);font-family:var(--sans);margin-top:6px">오류 코드: '+esc(code)
   +(e&&e.message?' — '+esc(String(e.message).slice(0,160)):'')+'</div></div>';
  console.warn('[CreatorQuest]', e);
}
function upstreamBox(key,label,go){
  const u=upstream(key);
  if(u) return '<div class="upstream"><span>↩</span><span><b>'+esc(label)+'</b><br>'+esc(trunc(u,200))+'</span></div>';
  return '<div class="upstream"><span>↩</span><span><b>'+esc(label)+'가 아직 없어요.</b> '+go+'번 방에서 채택하거나, 아래에 직접 적어도 이 방은 그대로 돌아갑니다.</span><button class="pxbtn sm" data-stage="'+go+'">'+go+'번 방으로</button></div>';
}
function reqsBox(k){
  const r=S.st[k].reqs; if(!r.length) return '';
  return '<div class="panel"><div class="panel-h"><h3>고정 규칙</h3><span class="chip-note">다시 뽑을 때마다 반영돼요</span></div><div class="taglist">'
   + r.map((x,i)=>'<span class="tag pinkt">'+esc(x)+' <button class="pick-flag" style="position:static;filter:none;font-size:12px" data-act="rmreq" data-i="'+i+'" aria-label="삭제">✕</button></span>').join('')+'</div></div>';
}
const DDCUSTOM='✎ 직접 입력';
function ddStore(scope){ return scope==='p'?S.player:(scope==='g'?S:slice().input); }
function dd(scope,key,opts,cur){
  const st=ddStore(scope), custom=!!st[key+'__c'];
  if(custom){
    return '<div class="dd cust" data-sc="'+scope+'" data-k="'+key+'">'
     +'<input type="text" class="dd-cin" data-cin="'+key+'" data-sc="'+scope+'" value="'+esc(cur||'')+'" placeholder="직접 적어주세요">'
     +'<button type="button" class="dd-back" data-ddback data-k="'+key+'" data-sc="'+scope+'" title="목록에서 고르기">목록</button></div>';
  }
  const list=opts.concat([DDCUSTOM]);
  const v=(cur&&opts.indexOf(cur)>=0)?cur:opts[0];
  const fp=(key==='fontT'||key==='fontB');
  const fs2=o=>fp&&FONTNAME[o]?' style="font-family:\''+FONTNAME[o]+'\',sans-serif;font-size:16px"':'';
  return '<div class="dd" data-sc="'+scope+'" data-k="'+key+'">'
   +'<button type="button" class="dd-btn" data-ddt><span'+fs2(v)+'>'+esc(v)+'</span><i>▼</i></button>'
   +'<div class="dd-list">'+list.map(o=>'<button type="button" class="dd-opt'+(o===v?' on':'')+(o===DDCUSTOM?' cust':'')+'" data-dv="'+esc(o)+'"'+fs2(o)+'>'+esc(o)+'</button>').join('')+'</div></div>';
}
function pxwin(head,body){
  return '<div class="pxwin"><img class="pxw-img" src="'+WIN_SRC+'" alt="" draggable="false">'
   +'<div class="pxw-head">'+(head||'')+'</div>'
   +'<div class="pxw-body">'+body+'</div></div>';
}
function emptyBox(key,title,line){
  return '<div class="emptybox"><img src="'+EB_SRC+'" alt="" draggable="false">'
   +'<span class="eb-ava">'+charSVG(key)+'</span>'
   +'<span class="eb-t">'+esc(title)+'</span>'
   +'<span class="eb-d">'+esc(line)+'</span></div>';
}

/* ═══════════ STAGE 1 ═══════════ */
const VIEWS={};
VIEWS.trend=sl=>{
  const i=sl.input, inv=arr(i.inv), off=arr(i.invOff);
  let o='<div class="rm-fields"><div class="field-grid">'
   +'<div><label class="f">이건 빼줘</label><input type="text" data-in="skip" value="'+esc(i.skip||'')+'" placeholder="이미 다룬 주제 (선택)"></div>'
   +'<div><label class="f">어떤 걸로 캘까</label>'+dd('in','goal',SRC1,i.goal)+'</div>'
   +'<div><label class="f">몇 개 뽑을까</label>'+dd('in','cnt',CNT1,i.cnt)+'</div>'
   +'</div>'
   +'<label class="f" style="margin-top:10px">재료 — 겪은 일·받은 질문·관찰한 것 뭐든</label>'
   +'<div class="rm-add"><input type="text" id="invBox" placeholder="예: 첫 협찬 거절당함"><button class="pxbtn sm" data-act="inv" data-agent-action="add-material" aria-label="적은 재료를 목록에 추가">+ 추가</button></div>';
  if(inv.length) o+='<div class="taglist" style="margin-top:8px">'
   + inv.map((x,ix)=>'<span class="tag'+(off.includes(ix)?' offtag':' pinkt')+'"><button class="matbtn" data-act="toginv" data-i="'+ix+'">'+esc(x)+'</button>'
     +'<button class="pick-flag" style="position:static;filter:none;font-size:12px" data-act="rminv" data-i="'+ix+'" aria-label="삭제">✕</button></span>').join('')
   +'</div><div class="chip-note" style="margin-top:4px">태그를 눌러 이번에 쓸 것만 켜세요 · 켜짐 '+inv.filter((x,ix)=>!off.includes(ix)).length+'개</div>';
  else o+='<div class="chip-note" style="margin-top:6px">비워두면 분야 기준으로 캐냅니다. 한 줄이라도 적으면 그 안에 뭐가 숨어 있는지 찾아줘요.</div>';
  return o+'</div>'+loadingHtml('ld_trend','리나가 소재를 훑는 중…')+reqsBox('trend');
};

VIEWS.idea=sl=>{
  const i=sl.input;
  return '<div class="rm-fields"><div class="field-grid">'
   +'<div><label class="f">고민 — 타깃이 뭘 답답해하나</label><input type="text" data-in="seed" value="'+esc(i.seed||'')+'" placeholder="예: 퇴근하고 뭐부터 해야 할지 모르겠다"></div>'
   +'<div><label class="f">목표 — 뭘 얻고 싶나</label>'+dd('in','bias',['골고루','저장하고 싶게','공감되게','바로 따라하게','논쟁적으로','브랜디드에 맞게'],i.bias)+'</div>'
   +'</div><div class="chip-note" style="margin-top:6px">1번 방에서 채택한 소재가 있으면 그걸 재료로 씁니다.</div></div>'
   +loadingHtml('ld_idea','포포가 아이디어 굴리는 중…')+reqsBox('idea');
};

async function genTrend(){
  const sl=S.st.trend, i=sl.input;
  setLoading('ld_trend',true,'리나가 소재를 훑는 중…');
  const off=arr(i.invOff);
  const mats=arr(i.inv).filter((x,ix)=>!off.includes(ix));
  const mode = mats.length ? 'EXPAND' : 'DIG';
  const want = parseInt((i.cnt||'6개'),10)||6;
  const p=[RULES,CRAFT,profileBlock(),sysBlock('trend'),
   '[지금 단계] 1단계 — 소재 발굴',
   '이 방에서 하는 일은 딱 하나다. 재료 하나를 놓고 "이 이야기 안에 무엇이 들어 있는가"를 찾아내는 것.',
   '아직 콘텐츠 아이디어도, 각도도, 제목도 만들지 않는다. 그건 다음 방이 할 일이다.',
   '재료가 밋밋해 보여도 버리거나 점수 매기지 않는다. 반드시 살려낸다. 안에 숨어 있는 것을 건져 올린다.',
   '[무엇을 찾는가]',
   '① 사람들이 관심 가질 이유 — 돈·성공·인정·외모·사랑·자유·편안함·성장·경쟁심·불안·후회·질투·설렘·공감·',
   '  통쾌함·손해 보기 싫은 마음·뒤처지고 싶지 않은 마음 중 무엇을 건드리는지.',
   '② 숨어 있는 긴장 — 원하는 것vs현실, 기대vs실제, 상식vs경험, 과거의 나vs현재의 나,',
   '  사람들이 믿는 것vs내가 겪은 것, 성공한 결과vs그 과정의 어려움.',
   '③ 콘텐츠가 될 수 있는 지점 — 경험·갈등·의외성·정보 중 무엇이 이 안에 있는지.',
   mode==='EXPAND'
    ? ['[모드] 살려내기 — 사용자가 재료를 줬다.','[재료]', mats.map((m,n)=>(n+1)+'. '+m).join('\n'),
       '[규칙]',
       '- 재료 하나당 카드 하나가 원칙이다. 재료가 적으면 카드도 적게 낸다. 억지로 개수를 채우지 않는다.',
       '- 한 재료 안에서 서로 다른 "숨은 지점"이 정말로 둘 이상 보일 때만 카드를 나눈다.',
       '- 사용자가 말하지 않은 사실을 지어내지 않는다. 모르는 것은 verify에 "본인만 아는 부분"이라고 적는다.',
       '- source는 "내 재료"로 적는다.'].join('\n')
    : ['[모드] 캐내기 — 재료가 없다. 분야 기준으로 찾아야 한다.',
       '[규칙]',
       '- 사용자의 개인 경험을 지어내지 않는다. "당신이 겪은 그 일"처럼 쓰지 말고 "이 분야에서 흔히 겪는 일"로 쓴다.',
       '- source는 "추론"으로 적는다.',
       '- 억지로 채우지 않는다. 확신 있는 것만 내고, 모자라면 type을 "question"으로 해서 되묻는 카드로 만든다.',
       '[캐는 방향] '+((!i.goal||i.goal==='골고루')?'한 갈래에 치우치지 말고 골고루.':'"'+i.goal+'"에 해당하는 것을 중심으로.')].join('\n'),
   i.skip?'[제외] 다음은 피한다: '+i.skip:'',
   reqBlock('trend'),
   '[출력] 아래 JSON만. 설명·마크다운 금지.',
   '{"cards":[{"type":"material","source":"내 재료|추론","title":"이 소재를 한 줄로","story":"무슨 이야기인지 2문장","why":"사람들이 관심 가질 이유","tension":"숨어 있는 긴장·대비","seed":"콘텐츠가 될 수 있는 지점","keywords":["키워드3개"],"heat":70,"verify":"확인이 필요한 부분"}]}',
   '되묻는 카드는 {"type":"question","title":"질문 한 줄","story":"왜 이걸 묻는지 한 줄","why":"","tension":"","seed":"","keywords":[],"heat":0,"verify":""} 형태.',
   'cards는 최대 '+want+'개. heat는 이 소재에 숨은 힘(0~100). 낮다고 버리는 뜻이 아니다.'
  ].filter(Boolean).join('\n');
  try{ const d=await askJson(p);
    sl.data={cards:arr(d.cards).slice(0,9)}; sl.picked=[]; sl.stale=false; markDownstream('trend');
    addXp(20,'소재 스캔'); save(); render(); openResults();
  }catch(e){ setLoading('ld_trend',false); showErr('trendOut', e); }
}

async function genIdea(scoreMode){
  const sl=S.st.idea,i=sl.input,up=upstream('idea');
  setLoading('ld_idea',true,scoreMode?'포포가 점수 매기는 중…':'포포가 아이디어 굴리는 중…');
  const body=scoreMode
   ? '[요청] 아래 아이디어를 냉정하게 평가하고 그대로 쓸 수 있게 개선안을 제시한다.\n[평가할 아이디어] '+(i.seed||up||'(내용 없음)')
   : ['[재료]',up||('직접 입력 소재: '+(i.seed||'프로필 분야 전반')),'[요청] 위 재료로 제작 가능한 콘텐츠 아이디어 6개를 만들고 각각 평가한다.',
      '- 원하는 결: '+(i.bias||'골고루'),'- 6개는 접근 방식이 서로 달라야 한다.'].join('\n');
  const p=[RULES,CRAFT,profileBlock(),sysBlock('idea'),
   '[지금 단계] 2단계 — 아이디어 기획',
   '소재를 사람들이 실제로 보고 싶어 하는 콘텐츠 아이디어로 발전시킨다.',
   '가장 중요한 것은 주제 자체가 아니라 어떤 관점으로 보여줄 것인가다.',
   '아이디어마다 네 가지를 반드시 정한다.',
   '① 핵심 갈등 — 가장 흥미로운 충돌이나 긴장. 결과가 궁금한 긴장, 예상과 실제가 다른 긴장, 실패할 수 있는 긴장,',
   '  가치가 부딪히는 긴장, 나도 해당될 수 있다는 불안, 다음을 확인하고 싶은 정보의 공백 중 하나 이상.',
   '② 핵심 관점 — "OO 하는 방법"으로 끝내지 않는다.',
   '  (X: 돈 모으는 방법 / O: 수입이 늘었는데도 돈이 안 모였던 이유)',
   '③ 콘텐츠의 약속 — 끝까지 본 사람이 무엇을 얻는지 한 문장.',
   '④ 각도 — 경험형·실패형·변화형·공감형·반박형·비교형·실험형·관찰형·논쟁형·고백형·비포애프터형·결과공개형·',
   '  초보자관점·고수관점 중 소재에 가장 맞는 것만 고른다. 모든 유형을 억지로 쓰지 않는다.',
   '유행하는 인물·밈·이슈는 주제와 실제로 연결될 때만 쓴다. 억지스러우면 쓰지 않는다.',
   body, reqBlock('idea'),
   '[점수 기준] save=저장 욕구, empathy=공감·댓글, feasible=혼자 제작 가능성, unique=차별성, scale=시리즈 확장 여지. 각 0~100 정수, total은 평균에 가깝게.',
   '[출력] 아래 JSON만.',
   '{"ideas":[{"title":"","angle":"각도 유형","view":"핵심 관점 — 어떤 시선으로 보여주는지","tension":"핵심 갈등","promise":"끝까지 보면 무엇을 얻는지 한 문장","why":"사람들이 볼 이유(욕망·감정·갈등·호기심)","format_hint":"릴스|카드뉴스|단일이미지|스토리|블로그","stats":{"save":80,"empathy":70,"feasible":85,"unique":60,"scale":75},"total":74,"risk":"실패 위험 한 줄"'+(scoreMode?',"improve":["개선안 3개"]':'')+'}]}',
   scoreMode?'ideas는 1~2개(원본 평가 + 더 나은 변형 1개).':'ideas는 6개. 서로 각도가 달라야 한다.'
  ].join('\n');
  try{ const d=await askJson(p);
    sl.data={ideas:arr(d.ideas).slice(0,8)}; sl.picked=[]; sl.stale=false; markDownstream('idea');
    addXp(20,scoreMode?'아이디어 평가':'아이디어 6개'); save(); render(); openResults();
  }catch(e){ setLoading('ld_idea',false); showErr('ideaOut', e); }
}

/* ═══════════ STAGE 3 ═══════════ */
const SRC1=['골고루','자주 묻는 것','잘못 알고 있는 것','처음에 막히는 것','아무도 안 하는 이야기'];
const CNT1=['6개','3개','9개'];
const FORMATS=['직접 추천받기','릴스','카드뉴스','단일 이미지','스토리','블로그 글'];
VIEWS.plan=sl=>{
  const i=sl.input;
  return '<div class="rm-fields"><div class="field-grid">'
   +'<div><label class="f">주제 직접 입력 (선택)</label><input type="text" data-in="topic" value="'+esc(i.topic||'')+'" placeholder="2번 방을 건너뛸 때만"></div>'
   +'<div><label class="f">포맷</label>'+dd('in','fmt',FORMATS,i.fmt)+'</div>'
   +'<div><label class="f">분량 감각</label>'+dd('in','len',['보통','짧고 굵게','자세하게'],i.len)+'</div>'
   +'</div>'
   +'<label class="f" style="margin-top:10px">이 방에서 항상 지킬 규칙 (선택)</label>'
   +'<div class="rm-add"><input type="text" id="reqBox" placeholder="예: 존댓말 쓰지 마"><button class="pxbtn sm" data-act="addreq" data-agent-action="add-rule" aria-label="이 방의 고정 규칙으로 추가">+ 추가</button></div>'
   +'</div>'+loadingHtml('ld_plan','단이가 기획 짜는 중…')+reqsBox('plan');
};

async function genPlan(){
  const sl=S.st.plan,i=sl.input,up=upstream('plan');
  setLoading('ld_plan',true,'단이가 기획 짜는 중…');
  const p=[RULES,CRAFT,profileBlock(),sysBlock('plan'),
   '[지금 단계] 3단계 — 기획 포맷',
   '내용 전체를 쓰지 않는다. 콘텐츠의 전달 구조를 설계하는 단계다.',
   '① 포맷 판단 — 아이디어에 가장 적합한 형식을 고른다. 사용자가 이미 지정했다면 다시 고르지 않는다.',
   '② 가제 제목 — 방향을 잡기 위한 임시 제목. 아직 확정이 아니다.',
   '③ 훅 — 첫 화면이나 초반에서 계속 봐야 할 이유. 단순히 자극적인 문장이 아니라 궁금증 만들기, 결과를 알고 싶게 하기,',
   '  공감시키기, 예상 깨기, 문제 제기, 갈등 제시, 정보의 공백 만들기 중 하나 이상의 역할을 해야 한다.',
   '④ 콘텐츠 구조 — 아이디어에 가장 맞는 흐름을 설계한다. 항상 같은 템플릿을 반복하지 않는다.',
   '⑤ 구조가 완성된 뒤 가제 제목과 훅을 다시 검토해 최종 확정한다.',
   '  과장하거나 본문에 없는 내용을 약속하지 않는다.',
   '[재료]', up||('직접 입력 주제: '+(i.topic||'프로필 분야 전반')),
   (i.topic&&up)?'- 추가 지정 주제: '+i.topic:'',
   '- 포맷: '+((!i.fmt||i.fmt===FORMATS[0])?'가장 적합한 포맷을 직접 고르고 이유를 밝힌다':'반드시 "'+i.fmt+'"로 한다'),
   '- 분량 감각: '+(i.len||'보통'),
   reqBlock('plan'),'[출력] 아래 JSON만.',
   '{"format":"","format_reason":"","working_title":"가제","title":"최종 제목","hook":"최종 훅 — 실제로 첫 화면에 들어갈 문장","promise":"콘텐츠의 약속 — 끝까지 보면 무엇을 얻는지 한 문장","goal":"이 콘텐츠로 얻을 것","target":"구체적인 시청자상","flow":[{"step":"장면·페이지 이름","desc":"무엇을 보여줄지"}],"volume":"예: 카드 8장 / 릴스 22초","kpi":["판단 기준 3개"],"cautions":["주의 2개"],"alts":[{"format":"","note":""}]}',
   'flow는 4~7개. 훅으로 시작해 마무리로 끝난다.'].filter(Boolean).join('\n');
  try{ const d=await askJson(p); sl.data=d; sl.stale=false; markDownstream('plan');
    addXp(20,'기획안 완성'); save(); render(); openResults();
  }catch(e){ setLoading('ld_plan',false); showErr('planOut', e); }
}

/* ═══════════ STAGE 4 ═══════════ */
VIEWS.script=sl=>{
  const i=sl.input;
  return '<div class="rm-fields"><div class="field-grid">'
   +'<div><label class="f">주제 직접 입력 (선택)</label><input type="text" data-in="topic" value="'+esc(i.topic||'')+'" placeholder="3번 방을 건너뛸 때만"></div>'
   +'<div><label class="f">만들 것</label>'+dd('in','kind',['기획안 따라가기','카드뉴스 카피','릴스 대본'],i.kind)+'</div>'
   +'<div><label class="f">장수 / 씬 수</label>'+dd('in','cnt',['자동','6','7','8','9','10'],i.cnt)+'</div>'
   +'</div><div class="chip-note" style="margin-top:6px">여기서 만든 문장은 결과 창에서 바로 고칠 수 있고, 고친 게 5번 방 이미지에 들어갑니다.</div></div>'
   +loadingHtml('ld_script','서니가 문장 다듬는 중…')+reqsBox('script');
};

async function genScript(){
  const sl=S.st.script,i=sl.input,up=upstream('script');
  const pf=(S.st.plan.data&&S.st.plan.data.format)||'';
  let kind=i.kind||'기획안 따라가기';
  if(kind==='기획안 따라가기') kind=/릴스|영상|숏폼/.test(pf)?'릴스 대본':'카드뉴스 카피';
  const isR=kind==='릴스 대본';
  const cnt=(i.cnt&&i.cnt!=='자동')?i.cnt:(isR?'5~7':'8~9');
  setLoading('ld_script',true,'서니가 문장 다듬는 중…');
  const p=[RULES,CRAFT,profileBlock(),sysBlock('script'),
   '[지금 단계] 4단계 — 콘텐츠 제작',
   '3단계에서 확정한 제목·훅·관점·구조를 그대로 유지한다. 새로운 주제를 갑자기 추가하거나 방향을 바꾸지 않는다.',
   isR
     ? '릴스: 실제로 말할 수 있는 자연스러운 대본을 쓴다. 초반 몇 초 안에 핵심 훅이 나와야 한다. 설명만 길게 이어지지 않게 상황→갈등→전개→결과 흐름을 유지한다. headline은 화면 자막 키워드(12자 이내), body는 실제로 읽을 나레이션.'
     : '카드뉴스: 페이지별로 쓴다. 각 페이지는 한눈에 읽히도록 핵심 메시지 하나만 담는다. 페이지 수와 흐름은 내용에 따라 조절한다. headline은 카드 제목(18자 이내, 줄바꿈 없이), body는 카드 본문(60자 이내).',
   '- 1번 칸은 3단계에서 정한 훅을 그대로 살린다. 마지막 칸은 저장·댓글을 부르는 마무리.',
   '- 구체적인 숫자·상황·행동을 쓴다. "다양한", "여러 가지" 같은 뭉뚱그린 표현 금지.',
   '[확정 기획]', up||('직접 입력 주제: '+(i.topic||'프로필 분야 전반')),
   (i.topic&&up)?'- 추가 지정: '+i.topic:'',
   '- 칸 수는 '+cnt+'개.',
   reqBlock('script'),'[출력] 아래 JSON만.',
   '{"kind":"'+(isR?'reels':'carousel')+'","slides":[{"n":1,"headline":"","body":"","visual":"필요한 그림/영상"}],"cuts":[{"cut":"1","screen":"","subtitle":"","audio":"","sec":"3초"}],"tips":["제작 메모 3개"]}',
   isR?'cuts는 slides와 짝을 맞춘다.':'cuts는 촬영이 필요한 카드만 3~5줄.'].filter(Boolean).join('\n');
  try{ const d=await askJson(p);
    d.slides=arr(d.slides).map((s,ix)=>({n:ix+1,headline:String(s.headline||''),body:String(s.body||''),visual:s.visual||''}));
    sl.data=d; sl.stale=false; markDownstream('script'); addXp(25,'원고 완성'); save(); render(); openResults();
  }catch(e){ setLoading('ld_script',false); showErr('scriptOut', e); }
}

const FONTS=[{"k": "bmdohyeon", "f": "BMDohyeon", "n": "배민 도현"}, {"k": "dangdang", "f": "Dangdang", "n": "카페24 당당해"}, {"k": "danjung", "f": "Danjung", "n": "카페24 단정해"}, {"k": "meongi", "f": "Meongi", "n": "카페24 멍기"}, {"k": "moyamoya", "f": "Moyamoya", "n": "카페24 모야모야"}, {"k": "nyangi", "f": "Nyangi", "n": "카페24 냥이"}, {"k": "prettynight", "f": "PrettyNight", "n": "카페24 예쁜밤"}, {"k": "proslim", "f": "ProSlim", "n": "카페24 프로슬림"}, {"k": "proup", "f": "ProUp", "n": "카페24 프로업"}, {"k": "shining", "f": "Shining", "n": "카페24 샤이닝스타"}, {"k": "ssurround", "f": "Ssurround", "n": "카페24 써라운드"}, {"k": "distortb", "f": "DistortB", "n": "디스토트 볼드"}, {"k": "distortm", "f": "DistortM", "n": "디스토트 미디엄"}, {"k": "graceb", "f": "GraceB", "n": "그레이스세리프 볼드"}, {"k": "gracer", "f": "GraceR", "n": "그레이스세리프"}, {"k": "mulbit", "f": "Mulbit", "n": "HS 여름물빛"}, {"k": "yuji", "f": "Yuji", "n": "HS 유지"}, {"k": "maruburi", "f": "MaruBuri", "n": "마루부리"}, {"k": "pado", "f": "Pado", "n": "웨이브 파도"}];
const FONTNAME=Object.fromEntries(FONTS.map(f=>[f.n,f.f]));

/* ═══════════ 카드 편집 ═══════════ */
function edOf(idx){
  if(!S.cardEd) S.cardEd={};
  if(!S.cardEd[idx]) S.cardEd[idx]={sty:{},labs:{}};
  const e=S.cardEd[idx]; if(!e.sty)e.sty={}; if(!e.labs)e.labs={};
  return e;
}
function edStyle(ed,key){
  const t=(ed&&ed.sty&&ed.sty[key])||null; if(!t) return '';
  let o='';
  if(t.f&&FONTNAME[t.f]) o+="font-family:'"+FONTNAME[t.f]+"',sans-serif;";
  if(t.s) o+='font-size:'+t.s+'%;';
  if(t.c) o+='color:'+t.c+';';
  if(t.b) o+='font-weight:900;';
  if(t.i) o+='font-style:italic;';
  if(t.u) o+='text-decoration:underline;text-underline-offset:.12em;';
  if(t.hi) o+='background:linear-gradient(transparent 52%,'+t.hi+' 52%);padding:0 .08em;';
  return o?' style="'+o+'"':'';
}
function edPos(o,dx,dy,dw,dh){
  if(!o) return '';
  let st='';
  if(o.x!=null) st+='left:'+o.x+'%;right:auto;';
  if(o.y!=null) st+='top:'+o.y+'%;bottom:auto;';
  if(o.w!=null) st+='width:'+o.w+'%;';
  if(o.h!=null) st+='height:'+o.h+'%;';
  return st?' style="'+st+'"':'';
}
/* ═══════════ 카드 템플릿 (HTML) ═══════════ */
const CTPL={
 film:{name:'필름 하단',note:'사진 · 좌측 정렬 · 큰 제목',photo:true,
   sample:{h:'여름에도\n블랙 선글라스만 써요',b:'밝은색은 금방 질리더라고요'}},
 glow:{name:'네온 하이라이트',note:'사진 · 형광 강조',photo:true,
   sample:{h:'퇴근 후 1시간\n"부수입" 만들기',b:'하루 한 시간이면 충분해요'}},
 talk:{name:'토크 배지',note:'사진 · 큰 형광 단어 · 화살표',photo:true,
   sample:{w:'편집',br:'쟁이',sub:'5분만에 끝내는 법',h:'편집쟁이 5분만에 끝내는 법',b:'5분만에 끝내는 법'}},
 crop:{name:'포커스 프레임',note:'사진 · 초점 박스 · 라벨',photo:true,
   sample:{h:'오늘 뭐 마시지?\n툴디 카페 음료 추천',b:'사장Pick!',l2:'호로록'}}
};

function esc2(t){ return esc(String(t==null?'':t)); }
function splitQuote(t){
  const s2=String(t||'');
  const m=s2.match(/^(.*?)(["“'][^"”']{2,}["”'])(.*)$/);
  if(m) return [m[1],m[2],m[3]];
  const w=s2.split(' ');
  if(w.length>3){ const cut=Math.ceil(w.length/2); return [w.slice(0,cut).join(' '),w.slice(cut).join(' '),'']; }
  return ['',s2,''];
}
function restyleCards(rangeEl){
  if(rangeEl&&rangeEl.nextElementSibling) rangeEl.nextElementSibling.textContent=rangeEl.value+'%';
  const f=cardFont();
  document.querySelectorAll('.cc').forEach(el=>el.setAttribute('style',f));
}
function cardFont(){
  const t=FONTNAME[S.fontT]||'BMDohyeon', b=FONTNAME[S.fontB]||'ProUp';
  return "--ft:'"+t+"';--fb:'"+b+"'"
   +";--st:"+((+S.sizeT||100)/100)+";--sb:"+((+S.sizeB||100)/100)
   +";--ct:"+(S.colT||'#ffffff')+";--cb:"+(S.colB||'#ffffff')+";--ca:"+(S.colA||'#eaff5a');
}
function firstWord(t){
  const w=String(t||'').trim().split(/\s+/);
  if(!w.length) return ['',''];
  const head=w[0].length<=6?w[0]:w[0].slice(0,4);
  return [head, String(t).trim().slice(head.length).trim()];
}
function nl(t){ return esc2(t).replace(/\n/g,'<br>'); }
function glowLines(t){
  const parts=String(t||'').split('\n');
  return parts.map(line=>{
    const m=line.match(/^(.*?)(["“'][^"”']{2,}["”'])(.*)$/);
    return m? esc2(m[1])+'<em>'+esc2(m[2])+'</em>'+esc2(m[3]) : esc2(line);
  }).join('<br>');
}
function cardHTML(tpl,slide,idx,total,live){
  const t=CTPL[tpl]||CTPL.film, sm=t.sample||{h:'첫 장은 손을 멈추게',b:'본문은 한 카드에 한 가지만.'};
  const ed=live?edOf(idx):null;
  const SH=edStyle(ed,'h'), SB=edStyle(ed,'b'), SL1=edStyle(ed,'l1'), SL2=edStyle(ed,'l2');
  const EK=live?' data-ek="':'';
  const head=(slide&&slide.headline)||sm.h;
  const body=(slide&&slide.body)||sm.b;
  const handle=S.player.name||'@my_account';
  const num=String(idx+1).padStart(2,'0');
  const bg=S.photo? 'style="background-image:url('+S.photo+')"':'';
  const F=cardFont();
  if(tpl==='film') return '<div class="cc cc-film" style="'+F+'"><div class="cc-photo" '+bg+'></div><div class="cc-scrim"></div>'
   +'<div class="cc-in"><span class="cc-sub" data-ek="b"'+SB+'>'+nl(body)+'</span><h1 data-ek="h"'+SH+'>'+nl(head)+'</h1></div>'
   +'<div class="cc-handle">'+esc2(handle)+'</div></div>';
  if(tpl==='glow') return '<div class="cc cc-glow" style="'+F+'"><div class="cc-photo" '+bg+'></div><div class="cc-scrim pink"></div>'
   +'<div class="cc-in"><span class="cc-pill">'+num+' / '+String(total).padStart(2,'0')+'</span>'
   +'<h1 data-ek="h"'+SH+'>'+glowLines(head)+'</h1><p data-ek="b"'+SB+'>'+nl(body)+'</p></div>'
   +'<div class="cc-handle">'+esc2(handle)+'</div></div>';
  if(tpl==='crop'){
    const ln=String(head).split('\n');
    const last=ln[ln.length-1]||'', pre=ln.slice(0,-1).join('<br>');
    const w2=last.trim().split(/\s+/);
    let mid='';
    if(w2.length>=2){ const k=w2.length-2; w2[k]='<em>'+esc2(w2[k])+'</em>'; mid=w2.map((x,i)=>i===k?x:esc2(x)).join(' '); }
    else mid=esc2(last);
    const l1=(slide? trunc(body,8) : (sm.b||''));
    const l2=(slide? (num+' PICK') : (sm.l2||''));
    const fo=ed&&ed.focus, la=ed&&ed.labs.l1, lb=ed&&ed.labs.l2;
    const t1=(la&&la.t!=null)?la.t:l1, t2=(lb&&lb.t!=null)?lb.t:l2;
    return '<div class="cc cc-crop" style="'+F+'"><div class="cc-photo" '+bg+'></div>'
     +'<div class="cc-focus" data-ek="focus"'+edPos(fo)+'><i class="fc tl"></i><i class="fc tr"></i><i class="fc bl"></i><i class="fc br"></i></div>'
     +'<div class="cc-brand">'+esc2(handle.replace(/^@/,''))+'</div>'
     +(t1?'<div class="cc-lab a" data-ek="l1"'+(la&&la.x!=null?' style="left:'+la.x+'%;top:'+la.y+'%;right:auto;'+edStyle(ed,"l1").replace(/^ style="|"$/g,"")+'"':SL1)+'>'+esc2(t1)+'</div>':'')
     +(t2?'<div class="cc-lab b" data-ek="l2"'+(lb&&lb.x!=null?' style="left:'+lb.x+'%;top:'+lb.y+'%;'+edStyle(ed,"l2").replace(/^ style="|"$/g,"")+'"':SL2)+'>'+esc2(t2)+'</div>':'')
     +'<div class="cc-in"><h1 data-ek="h"'+SH+'>'+(pre?esc2(ln[0])+'<br>':'')+mid+'</h1></div></div>';
  }
  const fw=firstWord(head);
  const word = slide? fw[0] : (sm.w||fw[0]);
  const brk  = slide? num   : (sm.br||num);
  const line = slide? (fw[1]||body) : (sm.sub||body);
  return '<div class="cc cc-talk" style="'+F+'"><div class="cc-photo" '+bg+'></div><div class="cc-scrim talk"></div>'
   +'<div class="cc-badge">'+esc2(trunc(handle.replace(/^@/,''),6))+'</div>'
   +'<span class="cc-star s1">✦</span><span class="cc-star s2">✳</span><span class="cc-star s3">✧</span>'
   +'<div class="cc-in"><h1 data-ek="h"'+SH+'><em>'+esc2(word)+'</em><span class="br">[ '+esc2(brk)+' ]</span></h1>'
   +'<div class="cc-line"><span data-ek="b"'+SB+'>'+esc2(line)+'</span><i class="cc-arrow"></i></div></div>'
   +'<div class="cc-handle">'+esc2(handle)+'</div></div>';
}

function edSlides(){ return arr(S.st.script.data&&S.st.script.data.slides); }
function openEditor(idx){
  const sl=edSlides(); if(!sl.length) return toast('4번 방 원고가 먼저 필요해요');
  S.edIdx=Math.max(0,Math.min(sl.length-1,idx|0)); S.edSel='h';
  const p=$('edBg'); p.hidden=false; drawEditor();
}
function closeEditor(){ const p=$('edBg'); p.hidden=true; p.innerHTML=''; save(); render(); if(!$('resBg').hidden) openResults(); }
function drawEditor(){
  const sl=edSlides(), i=S.edIdx, ed=edOf(i);
  const p=$('edBg');
  p.innerHTML='<div class="edbox">'
   +'<div class="edtop"><b>카드 편집</b>'
   +'<span class="edpage">'+(i+1)+' / '+sl.length+'</span>'
   +'<button class="pxbtn sm" data-act="edprev">‹ 이전</button>'
   +'<button class="pxbtn sm" data-act="ednext">다음 ›</button>'
   +'<button class="pxbtn sm" data-act="edreset">이 카드 초기화</button>'
   +'<button class="pxbtn sm go" data-act="edclose">완료</button></div>'
   +'<div class="edmain"><div class="edstage"><div class="ccwrap edit" id="edCard"></div></div>'
   +'<div class="edside" id="edSide"></div></div></div>';
  const box=$('edCard');
  box.innerHTML=cardHTML(S.tpl, sl[i], i, sl.length, true);
  fitEdCard();
  box.querySelectorAll('[data-ek]').forEach(el=>{
    el.classList.add('ed-hit');
    if(el.dataset.ek===S.edSel) el.classList.add('ed-on');
    el.addEventListener('pointerdown', e=>startEd(e, el));
  });
  drawEdSide();
}
function fitEdCard(){
  const box=$('edCard'); if(!box) return;
  const w=box.clientWidth||430, sc=w/1080;
  box.style.height=(1350*sc)+'px';
  const c=box.firstElementChild; if(c) c.style.transform='scale('+sc+')';
}
function startEd(e, el){
  const key=el.dataset.ek;
  S.edSel=key; drawEdSide();
  $('edCard').querySelectorAll('[data-ek]').forEach(x=>x.classList.toggle('ed-on',x.dataset.ek===key));
  if(key!=='focus' && key!=='l1' && key!=='l2') return;   // 글자 블록은 이동 없음
  e.preventDefault();
  const card=$('edCard').firstElementChild, r=card.getBoundingClientRect();
  const ed=edOf(S.edIdx);
  const cur = key==='focus' ? (ed.focus||{x:36,y:15,w:46,h:39}) : (ed.labs[key]||{});
  const er=el.getBoundingClientRect();
  const sx=e.clientX, sy=e.clientY;
  const x0 = cur.x!=null?cur.x : ((er.left-r.left)/r.width*100);
  const y0 = cur.y!=null?cur.y : ((er.top-r.top)/r.height*100);
  const move=ev=>{
    const nx=x0+(ev.clientX-sx)/r.width*100, ny=y0+(ev.clientY-sy)/r.height*100;
    if(key==='focus'){ ed.focus=Object.assign({w:46,h:39},ed.focus,{x:Math.max(0,Math.min(92,nx)),y:Math.max(0,Math.min(92,ny))}); }
    else { ed.labs[key]=Object.assign({},ed.labs[key],{x:Math.max(0,Math.min(92,nx)),y:Math.max(0,Math.min(94,ny))}); }
    el.style.left=(key==='focus'?ed.focus.x:ed.labs[key].x)+'%';
    el.style.top=(key==='focus'?ed.focus.y:ed.labs[key].y)+'%';
    el.style.right='auto'; el.style.bottom='auto';
  };
  const up=()=>{ document.removeEventListener('pointermove',move); document.removeEventListener('pointerup',up); save(); };
  document.addEventListener('pointermove',move); document.addEventListener('pointerup',up);
}
const EDNAME={h:'제목',b:'본문',l1:'라벨 1',l2:'라벨 2',focus:'포커스 프레임'};
function drawEdSide(){
  const ed=edOf(S.edIdx), k=S.edSel, st=ed.sty[k]||{}, side=$('edSide'); if(!side) return;
  let o='<div class="edsec"><b>'+(EDNAME[k]||k)+'</b><span class="chip-note">카드에서 요소를 눌러 바꿔요</span></div>';
  if(k==='focus'){
    const f=Object.assign({x:36,y:15,w:46,h:39},ed.focus);
    o+='<div class="edrow"><label class="f">가로 폭</label><input type="range" min="15" max="95" value="'+f.w+'" data-ed="fw"><b>'+Math.round(f.w)+'%</b></div>'
     +'<div class="edrow"><label class="f">세로 높이</label><input type="range" min="10" max="90" value="'+f.h+'" data-ed="fh"><b>'+Math.round(f.h)+'%</b></div>'
     +'<div class="chip-note">프레임을 끌어서 옮길 수 있어요.</div>';
  } else {
    if(k==='l1'||k==='l2'){
      const lab=ed.labs[k]||{};
      o+='<div class="edrow wide"><label class="f">라벨 글자</label><input type="text" data-ed="lt" value="'+esc(lab.t!=null?lab.t:'')+'" placeholder="예: 사장Pick!"></div>';
    }
    o+='<div class="edrow wide"><label class="f">폰트</label><select data-ed="f"><option value="">템플릿 기본</option>'
     + FONTS.map(f=>'<option value="'+esc(f.n)+'"'+(st.f===f.n?' selected':'')+' style="font-family:\''+f.f+'\'">'+esc(f.n)+'</option>').join('')
     +'</select></div>'
     +'<div class="edrow"><label class="f">크기</label><input type="range" min="50" max="220" step="5" value="'+(st.s||100)+'" data-ed="s"><b>'+(st.s||100)+'%</b></div>'
     +'<div class="edrow"><label class="f">글자색</label><input type="color" data-ed="c" value="'+(st.c||'#ffffff')+'">'
     +'<label class="f">형광펜</label><input type="color" data-ed="hi" value="'+(st.hi||'#eaff5a')+'">'
     +'<button class="pxbtn sm" data-act="edhioff">형광 끄기</button></div>'
     +'<div class="edrow"><button class="pxbtn sm'+(st.b?' on':'')+'" data-act="edb"><b>B</b></button>'
     +'<button class="pxbtn sm'+(st.i?' on':'')+'" data-act="edi"><i>I</i></button>'
     +'<button class="pxbtn sm'+(st.u?' on':'')+'" data-act="edu"><u>U</u></button></div>';
  }
  side.innerHTML=o;
}
function edApply(){ const box=$('edCard'); if(!box) return;
  const sl=edSlides(); box.innerHTML=cardHTML(S.tpl, sl[S.edIdx], S.edIdx, sl.length, true); fitEdCard();
  box.querySelectorAll('[data-ek]').forEach(el=>{ el.classList.add('ed-hit');
    if(el.dataset.ek===S.edSel) el.classList.add('ed-on');
    el.addEventListener('pointerdown', e=>startEd(e, el)); });
  save();
}

/* ═══════════ STAGE 5 · 캐러셀 ═══════════ */

VIEWS.carousel=sl=>{
  const slides=arr(S.st.script.data&&S.st.script.data.slides);
  const keys=Object.keys(CTPL);
  if(!CTPL[S.tpl]) S.tpl=keys[0];
  return '<div class="rm-fields"><label class="f">템플릿 고르기 · 1080 × 1350</label>'
   +'<div class="tplrow">'+keys.map(k=>'<button class="tplmini'+(S.tpl===k?' sel':'')+'" data-act="tpl" data-k="'+k+'" title="'+CTPL[k].note+'">'
     +'<span class="ccwrap mini" data-cc="'+k+'"></span><span class="tm-n">'+CTPL[k].name+'</span></button>').join('')+'</div>'
   +'<div class="field-grid" style="margin-top:10px">'
   +'<div><label class="f">제목 폰트</label>'+dd('g','fontT',FONTS.map(f=>f.n),S.fontT)+'</div>'
   +'<div><label class="f">본문 폰트</label>'+dd('g','fontB',FONTS.map(f=>f.n),S.fontB)+'</div>'
   +'</div>'
   +'<div class="opt-row">'
   +'<span class="opt"><label class="f">제목 크기</label><input type="range" min="60" max="150" step="5" data-num="sizeT" value="'+(+S.sizeT||100)+'"><b>'+(+S.sizeT||100)+'%</b></span>'
   +'<span class="opt"><label class="f">본문 크기</label><input type="range" min="60" max="150" step="5" data-num="sizeB" value="'+(+S.sizeB||100)+'"><b>'+(+S.sizeB||100)+'%</b></span>'
   +'</div>'
   +'<div class="opt-row">'
   +'<span class="opt"><label class="f">제목 색</label><input type="color" data-col="colT" value="'+(S.colT||'#ffffff')+'"></span>'
   +'<span class="opt"><label class="f">본문 색</label><input type="color" data-col="colB" value="'+(S.colB||'#ffffff')+'"></span>'
   +'<span class="opt"><label class="f">강조 색</label><input type="color" data-col="colA" value="'+(S.colA||'#eaff5a')+'"></span>'
   +'<button class="pxbtn sm" data-act="resetstyle">기본값</button>'
   +'</div>'
   +'<div class="rm-add" style="margin-top:10px">'
   +'<label class="pxbtn sm blue" style="cursor:pointer">사진 넣기<input type="file" accept="image/*" id="photoIn" style="display:none"></label>'
   +(S.photo?'<button class="pxbtn sm" data-act="rmphoto">사진 빼기</button>':'')
   +'<span class="chip-note">'+(S.photo?'사진이 들어가 있어요':'사진 없이도 만들 수 있어요. 아래 두 템플릿은 사진을 안 씁니다.')+'</span></div>'
   +'<div class="chip-note" style="margin-top:6px">'+(slides.length?('4번 방 원고 '+slides.length+'칸을 그대로 씁니다.'):'4번 방 원고가 없어요. 먼저 대본을 만들어주세요.')+'</div>'
   +'</div>'+loadingHtml('ld_car','모카가 카피 줄이는 중…')+reqsBox('carousel');
};

function paintPreviews(){
  document.querySelectorAll('[data-cc]').forEach(el=>{
    const k=el.dataset.cc, w=el.clientWidth||120, sc=w/1080;
    el.style.height=(1350*sc)+'px';
    el.innerHTML=cardHTML(k,null,0,6);
    const c=el.firstElementChild; if(c) c.style.transform='scale('+sc+')';
  });
}
function afterCarousel(){
  paintPreviews();
  const host=$('slideOut'); if(!host) return;
  const slides=arr(S.st.script.data&&S.st.script.data.slides);
  host.innerHTML='';
  slides.forEach((sd,ix)=>{
    const fig=document.createElement('figure');
    const box=document.createElement('div'); box.className='ccwrap out';
    box.innerHTML=cardHTML(S.tpl,sd,ix,slides.length);
    fig.appendChild(box);
    const cap=document.createElement('figcaption');
    cap.innerHTML='<span>'+String(ix+1).padStart(2,'0')+'</span>';
    const eb=document.createElement('button'); eb.className='pxbtn sm blue'; eb.textContent='✎ 편집하기';
    eb.onclick=()=>openEditor(ix); cap.appendChild(eb);
    const b=document.createElement('button'); b.className='pxbtn sm'; b.textContent='PNG'; b.disabled=!dlFn;
    b.onclick=()=>savePng(box.firstElementChild,'card_'+String(ix+1).padStart(2,'0')+'.png');
    cap.appendChild(b); fig.appendChild(cap); host.appendChild(fig);
  });
  requestAnimationFrame(()=>{
    document.querySelectorAll('.ccwrap.out').forEach(el=>{
      const w=el.clientWidth||240, sc=w/1080;
      el.style.height=(1350*sc)+'px';
      const c=el.firstElementChild; if(c) c.style.transform='scale('+sc+')';
    });
  });
  const n=$('dlNote'); if(n) n.textContent=dlFn?'':'이 화면에서는 파일 저장이 안 돼요';
}
async function nodeToBlob(node){
  const cv=await html2canvas(node,{width:1080,height:1350,scale:1,backgroundColor:null,useCORS:true,
    windowWidth:1080,windowHeight:1350});
  return new Promise(r=>cv.toBlob(r,'image/png'));
}
async function savePng(node,name){
  if(!dlFn) return toast('이 화면에서는 저장을 쓸 수 없어요');
  if(typeof html2canvas==='undefined') return toast('이미지 변환 도구를 못 불러왔어요');
  try{ const prev=node.style.transform; node.style.transform='none';
    const b=await nodeToBlob(node); node.style.transform=prev;
    await dlFn.save({filename:name,data:b}); toast('저장했어요 · '+name,true);
  }catch(e){ if(e.code!=='declined') toast('저장하지 못했어요'); }
}
async function saveZip(){
  if(!dlFn) return toast('이 화면에서는 저장을 쓸 수 없어요');
  if(typeof JSZip==='undefined'||typeof html2canvas==='undefined') return toast('도구를 못 불러왔어요. PNG로 하나씩 저장해주세요');
  const nodes=[...document.querySelectorAll('.ccwrap.out')].map(el=>el.firstElementChild).filter(Boolean);
  if(!nodes.length) return;
  const zip=new JSZip();
  for(let i=0;i<nodes.length;i++){
    const prev=nodes[i].style.transform; nodes[i].style.transform='none';
    const b=await nodeToBlob(nodes[i]); nodes[i].style.transform=prev;
    zip.file('card_'+String(i+1).padStart(2,'0')+'.png', b);
  }
  const out=await zip.generateAsync({type:'blob'});
  try{ await dlFn.save({filename:'carousel_'+S.tpl+'.zip',data:out}); toast('ZIP 저장 완료',true); addXp(15,'캐러셀 내보내기'); }
  catch(e){ if(e.code!=='declined') toast('저장하지 못했어요'); }
}
async function fitCopy(){
  const slides=arr(S.st.script.data&&S.st.script.data.slides); if(!slides.length) return;
  setLoading('ld_car',true,'모카가 카피 줄이는 중…');
  const p=[RULES,profileBlock(),sysBlock('carousel'),'[요청] 아래 카드 문장을 "'+(CTPL[S.tpl]||CTPL.film).name+'" 디자인에 얹을 수 있게 다듬는다.',
   '- headline은 16자 이내, 조사 없이 끊어 읽히게.','- body는 52자 이내, 한 문장 또는 두 짧은 문장.',
   '- 의미는 바꾸지 말고 군더더기만 덜어낸다.',reqBlock('carousel'),
   '[원문] '+JSON.stringify(slides.map(x=>({n:x.n,headline:x.headline,body:x.body}))),
   '[출력] {"slides":[{"n":1,"headline":"","body":""}]} 이 JSON만.'].join('\n');
  try{
    const d=await askJson(p,'quick'); const m={}; arr(d.slides).forEach(x=>m[+x.n]=x);
    S.st.script.data.slides=slides.map((x,ix)=>{const y=m[ix+1]||m[x.n];return y?Object.assign({},x,{headline:y.headline||x.headline,body:y.body||x.body}):x;});
    addXp(10,'카피 정리'); save(); render(); if(!$('resBg').hidden) openResults();
  }catch(e){ setLoading('ld_car',false); showErr('carOut', e); }
}
function buildCarousel(){ S.st.carousel.data={built:true,tpl:S.tpl}; S.st.carousel.stale=false; addXp(20,'캐러셀 제작'); save(); render(); openResults(); }

/* ═══════════ STAGE 6 ═══════════ */
VIEWS.caption=sl=>{
  const i=sl.input;
  return '<div class="rm-fields"><div class="field-grid">'
   +'<div><label class="f">주제 직접 입력 (선택)</label><input type="text" data-in="topic" value="'+esc(i.topic||'')+'" placeholder="4번 방을 건너뛸 때만"></div>'
   +'<div><label class="f">유도할 행동</label>'+dd('in','cta',['저장','댓글','DM 문의','프로필 링크 클릭','팔로우'],i.cta)+'</div>'
   +'<div><label class="f">DM 트리거 키워드</label><input type="text" data-in="dm" value="'+esc(i.dm||'')+'" placeholder="예: 정리표"></div>'
   +'</div><div class="chip-note" style="margin-top:6px">이 단어를 댓글이나 DM으로 받으면 자동 응답이 나가는 트리거예요.</div></div>'
   +loadingHtml('ld_cap','루루가 문구 뽑는 중…')+reqsBox('caption');
};

async function genCaption(){
  const sl=S.st.caption,i=sl.input,up=upstream('caption');
  setLoading('ld_cap',true,'루루가 문구 뽑는 중…');
  const p=[RULES,profileBlock(),sysBlock('caption'),'[콘텐츠 내용]',up||('직접 입력 주제: '+(i.topic||'프로필 분야 전반')),
   '[요청] 이 콘텐츠를 올릴 때 쓸 캡션·해시태그·DM 자동응답을 만든다.',
   '- 유도할 행동: '+(i.cta||'저장'),'- DM 트리거 키워드: '+(i.dm||'적절한 단어를 직접 정한다'),
   '- 캡션 3안은 길이와 접근이 확실히 달라야 한다(짧고 강한 / 경험담 / 정보 정리형).',
   '- 해시태그는 실제로 쓰이는 한국어 태그로 규모별로 나눈다. 억지 영문 태그 금지.',reqBlock('caption'),'[출력] 아래 JSON만.',
   '{"captions":[{"style":"짧고 강한","text":""},{"style":"경험담","text":""},{"style":"정보 정리형","text":""}],"first_comment":"","ctas":["3개"],"hashtags":{"big":["5개"],"mid":["7개"],"small":["7개"],"community":["3개"]},"dm":{"trigger_keyword":"","auto_reply":"","flow":[{"step":"","message":""}],"note":""},"posting_tip":""}',
   'dm.flow는 3~4단계(첫 응답 → 관심 확인 → 자료 전달 → 마무리).'].join('\n');
  try{ const d=await askJson(p); sl.data=d; sl.stale=false; addXp(25,'배포 준비 완료'); save(); render(); openResults(); }
  catch(e){ setLoading('ld_cap',false); showErr('capOut', e); }
}
const GEN={trend:genTrend,idea:()=>genIdea(false),plan:genPlan,script:genScript,carousel:buildCarousel,caption:genCaption};

/* ═══════════ 스테이지 화면 ═══════════ */
function resultsFor(key,sl){
  let o='';
  if(key==='trend'){
  const cards=arr(sl.data&&sl.data.cards);
  o+='<div id="trendOut">';
  if(cards.length){
    o+='<div class="cards">'+cards.map((x,ix)=>{
      const on=sl.picked.includes(ix);
      if(x.type==='question') return '<article class="card qcard-ask">'
       +'<span class="tag pinkt">리나의 질문</span>'
       +'<h4>'+esc(x.title)+'</h4>'
       +(x.story?'<p>'+esc(x.story)+'</p>':'')
       +'<p style="font-size:12.5px;color:var(--ink-3)">위 칸에 답을 적고 다시 뽑으면 훨씬 구체적인 소재가 나와요.</p></article>';
      return '<article class="card'+(on?' picked':'')+'"><button class="pick-flag" data-act="pick" data-i="'+ix+'" aria-label="채택">★</button>'
       +'<h4>'+esc(x.title)+'</h4>'
       +'<div class="heat"><span>'+(x.source==='준 재료'?'내 재료':'추론')+'</span><span class="heat-bar"><span class="heat-fill" style="width:'+Math.max(0,Math.min(100,+x.heat||0))+'%"></span></span><span>'+(+x.heat||0)+'</span></div>'
       +(x.story?'<p>'+esc(x.story)+'</p>':'')
       +'<p><span class="k">관심 가질 이유</span> '+esc(x.why||x.why_now||'')+'</p>'
       +(x.tension?'<p><span class="k">긴장·갈등</span> '+esc(x.tension)+'</p>':'')
       +(x.seed?'<p><span class="k">콘텐츠가 될 지점</span> '+esc(x.seed)+'</p>':'')
       +'<div class="taglist">'+arr(x.keywords).map(k=>'<span class="tag">#'+esc(k)+'</span>').join('')+'</div>'
       +(x.verify?'<p style="font-size:12.5px;color:var(--ink-3)"><span class="k">확인할 것</span> '+esc(x.verify)+'</p>':'')+'</article>';
    }).join('')+'</div><p style="font-size:13px;color:var(--ink-3);margin-top:9px">★로 채택한 카드가 2번 방 재료가 됩니다. 현재 '+sl.picked.length+'장.</p>';
  }
  return o+'</div>';
  }
  if(key==='idea'){
  const ideas=arr(sl.data&&sl.data.ideas);
  o+='<div id="ideaOut">';
  if(ideas.length){
    const sorted=ideas.map((x,ix)=>({x,ix})).sort((a,b)=>(+b.x.total||0)-(+a.x.total||0));
    o+='<div class="cards">'+sorted.map(({x:c,ix})=>{
      const on=sl.picked.includes(ix), st=c.stats||{};
      const bar=(l,v)=>'<div class="stat'+((+v||0)>=75?' hi':'')+'"><span>'+l+'</span><span class="stat-bar"><span class="stat-fill" style="width:'+Math.max(0,Math.min(100,+v||0))+'%"></span></span><span>'+(+v||0)+'</span></div>';
      return '<article class="card'+(on?' picked':'')+'"><button class="pick-flag" data-act="pick" data-i="'+ix+'" aria-label="채택">★</button>'
       +'<h4>'+esc(c.title)+'</h4>'
       +(c.view?'<p><span class="k">핵심 관점</span> '+esc(c.view)+'</p>':(c.one_line?'<p>'+esc(c.one_line)+'</p>':''))
       +(c.tension?'<p><span class="k">핵심 갈등</span> '+esc(c.tension)+'</p>':'')
       +(c.promise?'<p><span class="k">약속</span> '+esc(c.promise)+'</p>':'')
       +'<div style="display:flex;align-items:center;gap:8px"><span class="score-badge">'+(+c.total||0)+'점</span>'+(c.format_hint?'<span class="tag pinkt">'+esc(c.format_hint)+'</span>':'')
       +(c.angle?'<span class="tag">'+esc(c.angle)+'</span>':'')+'</div>'
       +'<div class="stats">'+bar('저장',st.save)+bar('공감',st.empathy)+bar('실행',st.feasible)+bar('차별',st.unique)+bar('확장',st.scale)+'</div>'
       +(c.why?'<p style="font-size:13px"><span class="k">볼 이유</span> '+esc(c.why)+'</p>':'')
       +(c.risk?'<p style="font-size:12.5px;color:var(--bad)"><span class="k">주의</span> '+esc(c.risk)+'</p>':'')
       +(arr(c.improve).length?'<p style="font-size:12.5px"><span class="k">개선안</span><br>'+arr(c.improve).map(esc).join('<br>')+'</p>':'')+'</article>';
    }).join('')+'</div><p style="font-size:13px;color:var(--ink-3);margin-top:9px">점수 순으로 정렬했어요. 1개를 채택하면 3번 방 기획이 그 아이디어로 잡힙니다.</p>';
  }
  return o+'</div>';
  }
  if(key==='plan'){
  const d=sl.data;
  o+='<div id="planOut">';
  if(d) o+='<div class="panel doc">'
    +'<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:9px"><span class="tag pinkt">'+esc(d.format||'포맷')+'</span><span style="font-size:12.5px;color:var(--ink-3)">'+esc(d.volume||'')+'</span></div>'
    +(d.format_reason?'<h4>이 포맷인 이유</h4><p>'+esc(d.format_reason)+'</p>':'')
    +'<h4>최종 제목</h4><p style="font-family:var(--game);font-size:18px">'+esc(d.title||d.core_message||'')+'</p>'
    +(d.working_title&&d.working_title!==d.title?'<p style="font-size:12.5px;color:var(--ink-3)">가제: '+esc(d.working_title)+'</p>':'')
    +(d.hook?'<h4>최종 훅</h4><p style="font-family:var(--game);font-size:16px">“'+esc(d.hook)+'”</p>':'')
    +(d.promise?'<h4>콘텐츠의 약속</h4><p>'+esc(d.promise)+'</p>':'')
    +'<h4>목표</h4><p>'+esc(d.goal||'')+'</p><h4>보는 사람</h4><p>'+esc(d.target||'')+'</p>'
    +'<h4>구성 흐름</h4><div>'+arr(d.flow).map((f,ix)=>'<div class="flow-step"><span class="flow-n">'+(ix+1)+'</span><span><span class="flow-b">'+esc(f.step)+'</span><br><span class="flow-d">'+esc(f.desc)+'</span></span></div>').join('')+'</div>'
    +(arr(d.kpi).length?'<h4>이걸로 판단해요</h4><ul>'+arr(d.kpi).map(k=>'<li>'+esc(k)+'</li>').join('')+'</ul>':'')
    +(arr(d.cautions).length?'<h4>주의할 점</h4><ul>'+arr(d.cautions).map(k=>'<li>'+esc(k)+'</li>').join('')+'</ul>':'')
    +(arr(d.alts).length?'<h4>다른 포맷으로 간다면</h4><ul>'+arr(d.alts).map(a=>'<li><b>'+esc(a.format)+'</b> — '+esc(a.note)+'</li>').join('')+'</ul>':'')+'</div>';
  return o+'</div>';
  }
  if(key==='script'){
  const d=sl.data;
  o+='<div id="scriptOut">';
  if(d){
    o+='<div class="panel"><div class="panel-h"><h3>'+(d.kind==='reels'?'릴스':'카드뉴스')+' 원고</h3><span class="chip-note">칸을 고치면 바로 저장돼요</span></div>'
     + arr(d.slides).map((s,ix)=>'<div class="slide-edit"><span class="slide-n">'+String(ix+1).padStart(2,'0')+'</span><div class="slide-fields">'
        +'<input type="text" data-sl="'+ix+'" data-f="headline" value="'+esc(s.headline)+'" aria-label="'+(ix+1)+'번 제목">'
        +'<textarea data-sl="'+ix+'" data-f="body" aria-label="'+(ix+1)+'번 본문" style="min-height:58px">'+esc(s.body)+'</textarea>'
        +(s.visual?'<span class="slide-hint">화면: '+esc(s.visual)+'</span>':'')+'</div></div>').join('')
     +'<div style="display:flex;gap:8px;margin-top:9px;flex-wrap:wrap"><button class="pxbtn sm" data-act="addslide">칸 추가</button>'
     +'<button class="pxbtn sm" data-act="rmslide">마지막 칸 삭제</button>'
     +'<button class="pxbtn sm mint" data-stage="5">5번 방으로 보내기</button></div></div>';
    if(arr(d.cuts).length) o+='<div class="panel"><div class="panel-h"><h3>촬영 컷리스트</h3></div><div class="tbl-scroll"><table class="cuts"><thead><tr><th style="width:40px">컷</th><th>화면</th><th>자막</th><th>소리</th><th style="width:56px">길이</th></tr></thead><tbody>'
      + arr(d.cuts).map(c=>'<tr><td>'+esc(c.cut)+'</td><td>'+esc(c.screen)+'</td><td>'+esc(c.subtitle)+'</td><td>'+esc(c.audio)+'</td><td>'+esc(c.sec)+'</td></tr>').join('')+'</tbody></table></div></div>';
    if(arr(d.tips).length) o+='<div class="panel"><div class="panel-h"><h3>제작 메모</h3></div><ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.8">'+arr(d.tips).map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul></div>';
  }
  return o+'</div>';
  }
  if(key==='carousel'){
  const slides=arr(S.st.script.data&&S.st.script.data.slides);
  o+='<div id="carOut">';
  if(slides.length) o+='<div class="panel"><div class="panel-h"><h3>완성 카드 '+slides.length+'장</h3><span class="chip-note" id="dlNote"></span>'
    +'<span style="margin-left:auto"><button class="pxbtn sm" data-act="zip">전체 ZIP 저장</button></span></div><div class="slide-out" id="slideOut"></div></div>';
  return o+'</div>';
  }
  if(key==='caption'){
  const d=sl.data, i=sl.input;
  o+='<div id="capOut">';
  if(d){
    const cb=(l,t)=>'<div class="copyblock"><div class="cb-head"><span class="cb-label">'+esc(l)+'</span><button class="pxbtn sm" data-act="copy">복사</button></div><pre>'+esc(t)+'</pre></div>';
    o+='<div class="panel"><div class="panel-h"><h3>캡션 3안</h3></div>'+arr(d.captions).map(c=>cb(c.style||'캡션',c.text||'')).join('')+'</div>';
    if(d.first_comment) o+='<div class="panel"><div class="panel-h"><h3>첫 댓글</h3></div>'+cb('첫 댓글',d.first_comment)+'</div>';
    if(arr(d.ctas).length) o+='<div class="panel"><div class="panel-h"><h3>CTA 문장</h3></div><ul style="margin:0;padding-left:18px;font-size:14.5px;line-height:1.85">'+arr(d.ctas).map(c=>'<li>'+esc(c)+'</li>').join('')+'</ul></div>';
    const h=d.hashtags||{};
    const grp=(t,a)=>arr(a).length?'<p style="margin:0 0 7px"><span class="k">'+t+'</span><br>'+arr(a).map(x=>'<span class="tag">#'+esc(String(x).replace(/^#/,''))+'</span>').join(' ')+'</p>':'';
    const all=[].concat(arr(h.big),arr(h.mid),arr(h.small),arr(h.community)).map(x=>'#'+String(x).replace(/^#/,'')).join(' ');
    o+='<div class="panel"><div class="panel-h"><h3>해시태그</h3><span class="chip-note">큰 태그만 쓰면 묻혀요</span></div>'
     + grp('규모 큰 태그',h.big)+grp('중간 태그',h.mid)+grp('작은·롱테일 태그',h.small)+grp('커뮤니티 태그',h.community)+(all?cb('한 번에 복사',all):'')+'</div>';
    if(d.dm){ const trigger=pick1(d.dm,['trigger_keyword','trigger','keyword'],i.dm||'-');
      const reply=pick1(d.dm,['auto_reply','reply','first_reply','response']);
      o+='<div class="panel"><div class="panel-h"><h3>DM 자동응답 시나리오</h3></div>'
     +'<p style="font-size:13.5px;color:var(--ink-2);margin:0 0 7px">트리거 키워드: <b>'+esc(trigger)+'</b></p>'
     +(reply?cb('첫 자동 응답',reply):'')
     + arr(d.dm.flow).map((f,ix)=>{ const obj=f&&typeof f==='object', title=obj?pick1(f,['step','title']):'', body=obj?pick1(f,['message','text','desc']):f; return '<div class="flow-step"><span class="flow-n">'+(ix+1)+'</span><span>'+(title?'<span class="flow-b">'+esc(title)+'</span><br>':'')+'<span class="flow-d">'+esc(body)+'</span></span></div>'; }).join('')
     +(d.dm.note?'<div class="notice">'+esc(d.dm.note)+'</div>':'')+'</div>';
    }
    if(d.posting_tip) o+='<div class="notice">'+esc(d.posting_tip)+'</div>';
  }
  return o+'</div>';
  }
  return o;
}

const GOLABEL={"trend": ["소재 스캔", "다시 뽑기"], "idea": ["아이디어 6개", "다시 뽑기"], "plan": ["기획안 만들기", "다시 기획하기"], "script": ["대본·카피 쓰기", "다시 쓰기"], "carousel": ["이 템플릿으로 만들기", "다시 만들기"], "caption": ["캡션 · 해시태그 · DM", "다시 뽑기"]};
function screenStage(){
  const s=stg(), sl=slice(), c=STAFF[s.key], up=upstream(s.key);
  const upFrom={trend:0,idea:1,plan:2,script:3,carousel:4,caption:4}[s.key];
  const head='<b>STAGE 0'+s.n+'</b>'
   +'<span style="font-family:var(--game);font-size:14px;color:var(--pink-4)">'+esc(s.short)+'</span>'
   +'<span class="right">'
   +'<button class="pxbtn sm" data-nav="home" aria-label="맵 화면으로 이동">맵으로</button>'
   +'<button class="pxbtn sm" data-nav="tools" aria-label="직원실로 이동">직원실</button>'
   +(s.n>1?'<button class="pxbtn sm" data-stage="'+(s.n-1)+'" aria-label="'+(s.n-1)+'번 방 '+STAGES[s.n-2].name+'으로 이동">‹ '+(s.n-1)+'번</button>':'')
   +(s.n<6?'<button class="pxbtn sm" data-stage="'+(s.n+1)+'" aria-label="'+(s.n+1)+'번 방 '+STAGES[s.n].name+'으로 이동">'+(s.n+1)+'번 ›</button>':'')
   +'</span>';
  let body='<div class="rmstaff" data-agent-staff="'+c.name+'">'+charSVG(s.key)
   +'<div class="rms-t"><div class="rms-n">'+c.name+'</div>'
   +'<div class="rms-r">'+c.role+'</div>'
   +'<div class="rms-l">“'+esc(c.line)+'”</div></div>'
   +'<button class="pxbtn sm blue" data-act="opendock" aria-label="'+c.name+'과 대화창 열기">대화하기</button></div>'
   +'<details class="sysbox"'+((sl.sys||'').trim()?' open':'')+'>'
   +'<summary aria-label="'+c.name+'에게 항상 지킬 지시문 열기"><span class="sy-ic">✎</span>'
   +'<span class="sy-t">'+c.name+'에게 항상 지킬 지시문</span>'
   +'<span class="sy-b">'+((sl.sys||'').trim()?'적용 중':'비어 있음')+'</span>'
   +'<span class="sy-x">▾</span></summary>'
   +'<textarea data-sys class="systa" spellcheck="false" placeholder="길이 제한 없어요. 몇 천 자든 그대로 들어갑니다.\n예: 존댓말 쓰지 마 / 숫자는 꼭 넣어줘 / 담백한 톤 유지">'+esc(sl.sys||'')+'</textarea>'
   +'<span class="chip-note"><b id="sysCnt">'+((sl.sys||'').length.toLocaleString())+'자</b> · 이 직원의 모든 작업과 대화에 계속 반영됩니다.</span></details>';
  if(upFrom) body+='<div class="upstream"><span>↩</span><span>'+(up?esc(trunc(String(up).replace(/\n/g,' / '),120)):'앞 방 결과가 없어요 — 아래에 직접 적어도 됩니다')+'</span>'
   +'<button class="pxbtn sm" data-stage="'+upFrom+'">'+upFrom+'번 방</button></div>';
  if(sl.stale) body+='<div class="upstream warn"><span>⚠</span><span><b>위 단계가 바뀌었어요.</b> 지금 결과는 예전 입력으로 만든 거예요.</span><button class="pxbtn sm" data-act="unstale">그대로 쓸게요</button></div>';
  body+=VIEWS[s.key](sl);
  const gl=GOLABEL[s.key];
  body+='<details class="wbridge" data-agent-bridge="'+s.key+'">'
   +'<summary aria-label="ChatGPT 등 외부 AI가 만든 JSON 결과를 이 방에 적용하기">🔌 AI 연결 · JSON으로 결과 넣기</summary>'
   +'<div class="wb-in">'
   +'<div class="chip-note">외부 AI에게 아래 과제를 시키고, 받은 JSON을 그대로 붙여넣으세요.</div>'
   +'<div class="wb-task" data-agent-task="'+esc(AGENTTASK[s.key])+'">'+esc(AGENTTASK[s.key])+'</div>'
   +'<button class="pxbtn sm blue" data-act="wbcopy" aria-label="이 방의 프롬프트를 클립보드에 복사">프롬프트 복사</button>'
   +'<textarea id="wbIn_'+s.key+'" class="wb-ta" data-agent-json="'+s.key+'" spellcheck="false" rows="4" '
   +'placeholder=\'{"cards":[ ... ]}\' aria-label="AI JSON 결과 입력"></textarea>'
   +'<div class="wb-row"><button class="pxbtn sm go" data-act="wbapply" aria-label="입력한 JSON 결과를 이 방에 적용">결과 적용</button>'
   +'<span class="wb-err" id="wbErr_'+s.key+'" role="status"></span></div>'
   +'</div></details>'
   +'<div class="rmact">'
   +'<button class="pxbtn go" data-act="gen">'+(sl.data?gl[1]:gl[0])+'</button>'
   +(s.key==='idea'?'<button class="pxbtn blue sm" data-act="score">내 아이디어 평가</button>':'')
   +(s.key==='carousel'?'<button class="pxbtn blue sm" data-act="fit">카피 다듬기</button>':'')

   +(sl.data?'<button class="pxbtn sm mint" data-act="openRes">결과 보기</button>':'')
   +(sl.data?'<button class="pxbtn sm" data-act="done">'+(sl.done?'✓ 확정됨':'이 단계 확정')+'</button>':'')
   +(sl.data?'<button class="pxbtn sm" data-act="clear">결과 비우기</button>':'')
   +'<span class="rmst">'+(sl.data?(sl.done?'확정됨 ⭐':'결과가 있어요'):'아직 결과가 없어요')+'</span>'
   +'</div>';
  return '<main data-agent-stage="'+s.n+'" data-agent-key="'+s.key+'" data-agent-task="'+esc(AGENTTASK[s.key])
   +'" data-agent-state="'+(sl.done?'confirmed':(sl.data?'has-result':'empty'))+'">'
   + pxwin(head, body) + '</main>';
}

/* ═══════════ 렌더 ═══════════ */
function render(){
  const _sc=(function(){ const e=document.querySelector('.pxw-body'); return e?e.scrollTop:0; })();
  drawNav(); drawTop();
  const m={home:screenHome,tools:screenTools,content:screenContent,templates:screenTemplates,stats:screenStats,settings:screenSettings,stage:screenStage};
  $('screen').innerHTML=(m[S.screen]||screenHome)();
  if(S.screen==='stage') S.chatWith=stg().key;
  const cs=chatStage(),c=STAFF[cs.key];
  $('dockFace').innerHTML=charSVG(cs.key);
  $('dockName').textContent=c.name;
  $('dockRole').textContent=c.role+' · '+cs.n+'번 방';
  drawChat();
  if(S.screen==='templates') paintPreviews();
  if(S.screen==='stage'&&stg().key==='carousel') afterCarousel();
  const _b=document.querySelector('.pxw-body'); if(_b&&_sc) _b.scrollTop=_sc;
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(()=>{
    if(S.screen==='templates') paintPreviews();
    if(S.screen==='stage'&&stg().key==='carousel') afterCarousel();
  });
  save();
}
function go(screen,n){
  if(n){S.cur=n;S.screen='stage';} else S.screen=screen;
  render(); window.scrollTo({top:0,behavior:'smooth'});
}

/* ═══════════ 채팅 ═══════════ */
function drawStaffStrip(){
  const SL=[3.29,15.96,28.63,41.39,54.06,66.73];
  $('dockStaff').innerHTML=STAGES.map((s2,i)=>'<button class="staffpick'+(chatKey()===s2.key?' on':'')+'" style="left:'+SL[i]+'%" data-talk="'+s2.key+'" title="'+STAFF[s2.key].name+' · '+s2.n+'번 방">'+charSVG(s2.key)+'</button>').join('');
}
function drawChat(){
  const s=chatStage(),sl=chatSlice(),c=STAFF[s.key],log=$('chatLog');
  drawStaffStrip();
  if(!sl.chat.length){
    log.innerHTML='<div class="msg ai">안녕하세요, '+c.name+'이에요. '+esc(c.line)+'\n결과를 고치고 싶으면 말만 해주세요. 예를 들어 “카드를 8장으로”, “20대 후반 직장인으로 좁혀줘” 처럼요.</div>';
    return;
  }
  log.innerHTML=sl.chat.map((m,ix)=>{
    if(m.role==='user') return '<div class="msg me">'+esc(m.content)+'</div>';
    let h='<div class="msg ai">'+esc(m.content);
    if(m.instruction) h+='<span class="apply"><button class="pxbtn go sm" data-act="applyNow" data-i="'+ix+'">지금 다시 만들기</button><button class="pxbtn sm" data-act="applyKeep" data-i="'+ix+'">고정 규칙으로 저장</button></span>';
    return h+'</div>';
  }).join('');
  log.scrollTop=log.scrollHeight;
}
async function sendChat(){
  const box=$('chatBox'),msg=box.value.trim(); if(!msg) return;
  const s=chatStage(),sl=chatSlice(),c=STAFF[s.key];
  if(!sampleFn){ toast('이 화면에서는 대화를 쓸 수 없어요'); return; }
  sl.chat.push({role:'user',content:msg}); box.value=''; drawChat(); save();
  const th=document.createElement('div'); th.className='msg ai'; th.textContent=c.name+'이(가) 생각하는 중…';
  $('chatLog').appendChild(th); $('chatLog').scrollTop=1e6;
  const rules=[
    '너는 콘텐츠 제작 스튜디오의 직원 "'+c.name+'"이다. 직책은 '+c.role+'이고 '+s.n+'번 방('+s.name+')을 맡고 있다.',
    '[성격] '+c.persona,
    '[말투] 1인칭으로 캐릭터를 유지한다. 존댓말, 짧고 담백하게. 과한 이모지·인사 반복 금지. 조언 내용은 정확해야 한다.',
    profileBlock(), sysBlock(s.key),
    '[이 방이 하는 일] '+DESC[s.key],
    '[현재 이 방의 데이터] '+(sl.data?trunc(sl.data,4200):'아직 없음'),
    sl.reqs.length?'[이미 저장된 고정 규칙] '+sl.reqs.join(' / '):'',
    '[답변 규칙]','- 한국어 3~6문장.',
    '- 사용자가 결과물을 바꾸길 원하면 action을 "revise"로 하고, instruction에 생성 프롬프트에 그대로 덧붙일 지시문을 한두 문장으로 쓴다.',
    '- 단순 질문이면 action은 "none", instruction은 빈 문자열.',
    '[출력] {"reply":"","action":"none|revise","instruction":""} 이 JSON만.'
  ].filter(Boolean).join('\n');
  const turns=[{role:'user',content:rules}].concat(sl.chat.slice(-8).map(m=>({role:m.role,content:m.content})));
  try{
    const d=await sampleFn.json(turns,{modelTier:'quick',cache:false});
    th.remove();
    sl.chat.push({role:'assistant',content:String(d.reply||''),instruction:d.action==='revise'?String(d.instruction||''):''});
    save(); drawChat();
  }catch(e){ th.remove(); sl.chat.push({role:'assistant',content:errCopy(e.code)}); drawChat(); }
}
function openDock(){ $('dock').classList.remove('min'); $('chatBox').focus(); }

/* ═══════════ 모달 ═══════════ */
function openModal(t,b,f){ $('modalTitle').textContent=t; $('modalBody').innerHTML=b; $('modalFoot').innerHTML=f||''; $('modalBg').hidden=false; }
function closeModal(){ $('modalBg').hidden=true; }
function helpModal(){
  openModal('HOW TO PLAY',
   '<div class="doc"><h4>기본 흐름</h4><p>맵에서 1번 방부터 순서대로 들어가면 각 방의 결과가 다음 방 재료로 넘어갑니다.</p>'
   +'<h4>방마다 따로 쓰기</h4><p>어느 방이든 혼자 돌아가요. 위 단계 결과가 없으면 “직접 입력” 칸이 나옵니다. 마음에 안 들면 결과 비우기나 다시 뽑기로 새로 받으세요.</p>'
   +'<h4>위 단계를 고쳤을 때</h4><p>아래 방에 “재확인” 표시가 붙어요. 다시 뽑으면 바뀐 내용이 반영되고, 그대로 쓰려면 배너의 버튼을 누르면 됩니다.</p>'
   +'<h4>직원과 대화</h4><p>각 방에는 담당 직원이 있어요. 오른쪽 아래 창에서 요청하면 그 자리에서 다시 만들거나 고정 규칙으로 저장해 이후 생성에 계속 반영합니다.</p>'
   +'<h4>알아둘 점</h4><p>AI는 실시간 검색을 하지 않아요. 1번 방 카드는 검증이 필요한 후보이고, 각 카드의 “확인법”대로 실제 데이터를 한 번 더 보고 결정하세요.</p></div>',
   '<button class="pxbtn go" data-m="cancel">알겠어요</button>');
}
let pendingImport=null;
function applyImport(){
  const d=pendingImport; if(!d) return;
  try{
    const fresh=freshState();
    if(d.st){ KEYS.forEach(k=>{ if(!d.st[k]) d.st[k]=emptySlice(); }); }
    S=Object.assign(fresh, d, {st:Object.assign(fresh.st, d.st||{})});
    if(S.st.trend&&S.st.trend.data&&arr(S.st.trend.data.cards).length)
      S.st.trend.data.cards=S.st.trend.data.cards.map(normCard);
    if(S.st.idea&&S.st.idea.data&&arr(S.st.idea.data.ideas).length)
      S.st.idea.data.ideas=S.st.idea.data.ideas.map(normIdea);
    S.photo=null; pendingImport=null;
    if(S.theme) document.documentElement.setAttribute('data-theme',S.theme);
    save(); render(); toast('프로젝트를 불러왔어요',true);
  }catch(e){ toast('불러오지 못했어요'); }
}
async function exportJSON(){
  const c=Object.assign({},S); delete c.photo; delete c.cardEd;
  const txt=JSON.stringify(c,null,2);
  const name='creator-quest-'+new Date().toISOString().slice(0,16).replace(/[-:T]/g,'')+'.json';
  if(!dlFn){ openModal('JSON 내보내기','<div class="doc"><p>이 화면에서는 파일 저장이 안 돼요. 아래 내용을 복사해서 .json 파일로 저장하세요.</p>'
    +'<textarea class="systa" readonly style="min-height:240px;font-family:ui-monospace,monospace;font-size:12px">'+esc(txt)+'</textarea></div>',
    '<button class="pxbtn" data-m="close">닫기</button>'); return; }
  try{ await dlFn.save({filename:name,data:new Blob([txt],{type:'application/json'})}); toast('JSON으로 저장했어요',true); }
  catch(e){ if(e.code!=='declined') toast('저장하지 못했어요'); }
}
function exportAll(){
  const p=S.player,L=[];
  L.push('# '+(p.name||'콘텐츠 프로젝트')+' — Creator Quest');
  L.push('분야: '+(p.niche||'-')+' / 타깃: '+(p.target||'-')+' / 플랫폼: '+(p.platform||'-'));
  STAGES.forEach(s=>{
    const sl=S.st[s.key]; L.push('\n## '+s.n+'. '+s.name+(sl.done?' ✓':'')+'  (담당 '+STAFF[s.key].name+')');
    if(sl.reqs.length) L.push('고정 규칙: '+sl.reqs.join(' / '));
    const d=sl.data; if(!d){ L.push('(비어 있음)'); return; }
    if(s.key==='trend') arr(d.cards).forEach((c,i)=>L.push('- '+(sl.picked.includes(i)?'★ ':'')+c.title+' — '+c.angle+' ('+c.why_now+')'));
    else if(s.key==='idea') arr(d.ideas).forEach((c,i)=>L.push('- '+(sl.picked.includes(i)?'★ ':'')+c.title+' ['+(c.total||0)+'점] '+c.one_line));
    else if(s.key==='plan'){ L.push('- 포맷: '+d.format); L.push('- 목표: '+d.goal); L.push('- 핵심 메시지: '+d.core_message);
      arr(d.flow).forEach((f,i)=>L.push('  '+(i+1)+') '+f.step+' — '+f.desc)); }
    else if(s.key==='script') arr(d.slides).forEach(x=>L.push('- ['+x.n+'] '+x.headline+'\n  '+x.body));
    else if(s.key==='carousel') L.push('- 템플릿: '+(CTPL[d.tpl||S.tpl]?CTPL[d.tpl||S.tpl].name:'-'));
    else{ arr(d.captions).forEach(c=>L.push('### '+c.style+'\n'+c.text));
      const h=d.hashtags||{}; L.push('태그: '+[].concat(arr(h.big),arr(h.mid),arr(h.small),arr(h.community)).map(x=>'#'+String(x).replace(/^#/,'')).join(' '));
      if(d.dm) L.push('DM 트리거: '+(d.dm.trigger_keyword||'-')+'\n'+(d.dm.auto_reply||'')); }
  });
  const md=L.join('\n');
  if(dlFn) dlFn.save({filename:'creator-quest-'+Date.now()+'.md',data:md}).then(()=>toast('내보냈어요',true)).catch(e=>{if(e.code!=='declined')toast('저장하지 못했어요')});
  else openModal('EXPORT','<div class="copyblock"><div class="cb-head"><span class="cb-label">전체 내용</span><button class="pxbtn sm" data-act="copy">복사</button></div><pre>'+esc(md)+'</pre></div>','<button class="pxbtn" data-m="cancel">닫기</button>');
}

/* ═══════════ 이벤트 ═══════════ */
document.addEventListener('click', async e=>{
  const inDd=e.target.closest('.dd');
  document.querySelectorAll('.dd.open').forEach(d=>{ if(d!==inDd) d.classList.remove('open'); });
  const ddt=e.target.closest('[data-ddt]');
  if(ddt){ ddt.closest('.dd').classList.toggle('open'); return; }
  const ddb=e.target.closest('[data-ddback]');
  if(ddb){ const st=ddStore(ddb.dataset.sc); delete st[ddb.dataset.k+'__c']; st[ddb.dataset.k]=''; save(); render(); return; }
  const dv=e.target.closest('[data-dv]');
  if(dv){
    const d=dv.closest('.dd'), k=d.dataset.k, v=dv.dataset.dv, st=ddStore(d.dataset.sc);
    if(v===DDCUSTOM){ st[k+'__c']=1; st[k]=''; }
    else { delete st[k+'__c']; st[k]=v; }
    save(); render(); return;
  }
  const nav=e.target.closest('[data-nav]');
  if(nav){ go(nav.dataset.nav); return; }
  const st=e.target.closest('[data-stage]');
  if(st){ closeStageSelect(); go('stage',+st.dataset.stage); return; }
  const tk=e.target.closest('[data-talk]');
  if(tk){ S.chatWith=tk.dataset.talk; save(); drawChat(); openDock();
    const cs=chatStage(),c=STAFF[cs.key];
    $('dockFace').innerHTML=charSVG(cs.key); $('dockName').textContent=c.name;
    $('dockRole').textContent=c.role+' · '+cs.n+'번 방'; return; }
  const md=e.target.closest('[data-m]');
  if(md){ const a=md.dataset.m;
    if(a==='cancel'||a==='close') closeModal();
    if(a==='doReset'){ try{localStorage.removeItem(LS)}catch(err){} S=freshState(); closeModal(); render(); toast('새 프로젝트를 시작했어요'); }
    if(!md.dataset.act) return; }
  const b=e.target.closest('[data-act]'); if(!b) return;
  const act=b.dataset.act, s=stg(), sl=slice();

  if(act==='gen'){ if(!sampleFn&&s.key!=='carousel'){toast('AI를 쓸 수 없는 화면이에요');return} GEN[s.key](); }
  else if(act==='clear'){ sl.data=null; sl.picked=[]; sl.stale=false; sl.done=false; closeResults(); render(); toast('결과를 비웠어요'); }
  else if(act==='done'){
    sl.done=!sl.done; if(sl.done) addXp(30,'STAGE 0'+s.n+' 확정'); render(); if(!$('resBg').hidden) openResults();
    if(sl.done&&STAGES.every(x=>S.st[x.key].done)) setTimeout(()=>toast('🏆 6개 방 전부 확정! 스튜디오 마스터',true),600);
  }
  else if(act==='unstale'){ sl.stale=false; render(); }
  else if(act==='pick'){ const i=+b.dataset.i; const wasRes=!$('resBg').hidden;
    if(s.key==='idea') sl.picked=sl.picked.includes(i)?[]:[i];
    else { const ix=sl.picked.indexOf(i); if(ix>=0) sl.picked.splice(ix,1); else sl.picked.push(i); }
    markDownstream(s.key); render(); if(wasRes) openResults(); }
  else if(act==='rmphoto'){ S.photo=null; render(); }
  else if(act==='resetstyle'){ S.sizeT=100;S.sizeB=100;S.colT='#ffffff';S.colB='#ffffff';S.colA='#eaff5a';
    save(); render(); if(!$('resBg').hidden) openResults(); toast('기본값으로 되돌렸어요'); }
  else if(act==='rmreq'){ sl.reqs.splice(+b.dataset.i,1); render(); }
  else if(act==='rminv'){ const k=+b.dataset.i; sl.input.inv.splice(k,1);
    sl.input.invOff=arr(sl.input.invOff).filter(v=>v!==k).map(v=>v>k?v-1:v); render(); }
  else if(act==='toginv'){ const k=+b.dataset.i, off=arr(sl.input.invOff);
    sl.input.invOff = off.includes(k)? off.filter(v=>v!==k) : off.concat(k); render(); }
  else if(act==='inv'){ const box=$('invBox'), v=box?box.value.trim():'';
    if(!v){ if(box)box.focus(); return; }
    sl.input.inv=arr(sl.input.inv).concat(v); render(); toast('인벤토리에 넣었어요'); }
  else if(act==='score'){ genIdea(true); }
  else if(act==='addreq'){ const box=$('reqBox'), v=box?box.value.trim():'';
    if(!v){ if(box)box.focus(); return; }
    sl.reqs.push(v); render(); toast('고정 규칙에 넣었어요',true); }
  else if(act==='addslide'){ sl.data.slides.push({n:sl.data.slides.length+1,headline:'',body:'',visual:''}); render(); }
  else if(act==='rmslide'){ sl.data.slides.pop(); markDownstream('script'); render(); }
  else if(act==='tpl'){ S.tpl=b.dataset.k; render(); }
  else if(act==='build'){ buildCarousel(); }
  else if(act==='fit'){ fitCopy(); }
  else if(act==='zip'){ saveZip(); }
  else if(act==='opendock'){ openDock(); }
  else if(act==='openSel'){ openStageSelect(); }
  else if(act==='openRes'){ openResults(); }
  else if(act==='closeRes'){ closeResults(); }
  else if(act==='edopen'){ openEditor(+(b.dataset.i||0)); }
  else if(act==='edclose'){ closeEditor(); }
  else if(act==='edprev'){ S.edIdx=Math.max(0,S.edIdx-1); S.edSel='h'; drawEditor(); }
  else if(act==='ednext'){ S.edIdx=Math.min(edSlides().length-1,S.edIdx+1); S.edSel='h'; drawEditor(); }
  else if(act==='edreset'){ delete S.cardEd[S.edIdx]; save(); drawEditor(); toast('이 카드를 초기화했어요'); }
  else if(act==='edb'||act==='edi'||act==='edu'){ const ed=edOf(S.edIdx), k=S.edSel;
    ed.sty[k]=ed.sty[k]||{}; const f={edb:'b',edi:'i',edu:'u'}[act]; ed.sty[k][f]=!ed.sty[k][f]; edApply(); drawEdSide(); }
  else if(act==='edhioff'){ const ed=edOf(S.edIdx); if(ed.sty[S.edSel]) delete ed.sty[S.edSel].hi; edApply(); drawEdSide(); }
  else if(act==='closeSel'){ closeStageSelect(); }
  else if(act==='export'){ exportAll(); }
  else if(act==='exportjson'){ exportJSON(); }
  else if(act==='doimport'){ applyImport(); }
  else if(act==='wbcopy'){ const k=stg().key;
    navigator.clipboard.writeText(wbPrompt(k)).then(()=>toast('프롬프트를 복사했어요',true),()=>toast('복사하지 못했어요')); }
  else if(act==='wbapply'){ wbApply(stg().key); }
  else if(act==='help'){ helpModal(); }
  else if(act==='ava'){ S.avatar=+b.dataset.i; render(); toast('캐릭터를 바꿨어요',true); }
  else if(act==='theme'){
    const now=document.documentElement.getAttribute('data-theme');
    const next=now==='dark'?'light':(now==='light'?null:'dark');
    if(next) document.documentElement.setAttribute('data-theme',next); else document.documentElement.removeAttribute('data-theme');
    S.theme=next; save(); render();
  }
  else if(act==='reset'){ openModal('NEW PROJECT','<div class="doc"><p>6단계 결과와 캐릭터 설정이 모두 지워집니다. 필요하면 먼저 전체 내보내기를 해두세요.</p></div>',
    '<button class="pxbtn" data-m="cancel">취소</button><button class="pxbtn go" data-m="doReset">전부 지우고 시작</button>'); }
  else if(act==='copy'){
    const pre=b.closest('.copyblock').querySelector('pre');
    try{ await navigator.clipboard.writeText(pre.textContent); toast('복사했어요',true); }
    catch(err){ const r=document.createRange(); r.selectNodeContents(pre); const sel=getSelection(); sel.removeAllRanges(); sel.addRange(r); toast('길게 눌러 복사해주세요'); }
  }
  else if(act==='applyNow'||act==='applyKeep'){
    const ck=chatKey(), cs=S.st[ck], m=cs.chat[+b.dataset.i];
    if(!m||!m.instruction) return;
    if(act==='applyKeep'){ cs.reqs.push(m.instruction); save(); drawChat(); toast('고정 규칙에 넣었어요',true); return; }
    cs.reqs.push(m.instruction);
    if(S.cur!==STAGES[KEYS.indexOf(ck)].n || S.screen!=='stage'){ S.cur=STAGES[KEYS.indexOf(ck)].n; S.screen='stage'; }
    render(); await GEN[ck](); cs.reqs.pop(); render();
  }
});
document.addEventListener('input', e=>{
  const el=e.target;
  if(el.dataset&&el.dataset.cin){ ddStore(el.dataset.sc)[el.dataset.cin]=el.value; save(); return; }
  if(el.hasAttribute&&el.hasAttribute('data-sys')){
    slice().sys=el.value; const c=$('sysCnt'); if(c) c.textContent=el.value.length.toLocaleString()+'자';
    save(); return; }
  if(el.dataset&&el.dataset.ed){
    const ed=edOf(S.edIdx), k=S.edSel, f=el.dataset.ed;
    if(f==='fw'||f==='fh'){ ed.focus=Object.assign({x:36,y:15,w:46,h:39},ed.focus); ed.focus[f==='fw'?'w':'h']=+el.value; }
    else if(f==='lt'){ ed.labs[k]=Object.assign({},ed.labs[k],{t:el.value}); }
    else { ed.sty[k]=ed.sty[k]||{}; if(el.value==='') delete ed.sty[k][f]; else ed.sty[k][f]=(f==='s')?+el.value:el.value; }
    if(el.nextElementSibling&&el.nextElementSibling.tagName==='B') el.nextElementSibling.textContent=Math.round(el.value)+'%';
    edApply(); return;
  }
  if(el.dataset&&el.dataset.num){ S[el.dataset.num]=+el.value; save(); restyleCards(el); return; }
  if(el.dataset&&el.dataset.col){ S[el.dataset.col]=el.value; save(); restyleCards(); return; }
  if(el.dataset&&el.dataset.in){ slice().input[el.dataset.in]=el.value; save(); return; }
  if(el.dataset&&el.dataset.p){ S.player[el.dataset.p]=el.value; save(); drawTop(); return; }
  if(el.dataset&&el.dataset.sl!==undefined&&el.dataset.f){
    const d=S.st.script.data; if(!d)return;
    d.slides[+el.dataset.sl][el.dataset.f]=el.value; markDownstream('script'); save();
  }
});
document.addEventListener('change', e=>{
  const el=e.target;
  if(el.id==='projIn' && el.files && el.files[0]){
    const r=new FileReader();
    r.onload=()=>{ try{ pendingImport=JSON.parse(r.result); }catch(err){ toast('JSON을 읽지 못했어요'); return; }
      const n=KEYS.filter(k=>pendingImport.st&&pendingImport.st[k]&&pendingImport.st[k].data).length;
      openModal('불러오기','<div class="doc"><p>이 파일에는 결과가 있는 방이 '+n+'개 있어요.</p>'
        +'<p><b>지금 작업 중인 내용은 모두 덮어써집니다.</b> 필요하면 먼저 전체 내보내기를 해두세요.</p></div>',
        '<button class="pxbtn" data-m="cancel">취소</button><button class="pxbtn go" data-act="doimport" data-m="close">덮어쓰고 불러오기</button>');
    };
    r.readAsText(el.files[0]); el.value=''; return;
  }
  if(el.dataset&&el.dataset.ed==='f'){ const ed=edOf(S.edIdx), k=S.edSel;
    ed.sty[k]=ed.sty[k]||{}; if(!el.value) delete ed.sty[k].f; else ed.sty[k].f=el.value; edApply(); return; }
  if(el.id==='photoIn' && el.files && el.files[0]){
    const f=el.files[0], r=new FileReader();
    r.onload=()=>{ S.photo=r.result; render(); if(!$('resBg').hidden) openResults(); toast('사진을 넣었어요',true); };
    r.readAsDataURL(f); return;
  }
  if(el.dataset&&el.dataset.in){ slice().input[el.dataset.in]=el.value; save(); }
  if(el.dataset&&el.dataset.p){ S.player[el.dataset.p]=el.value; save(); drawTop(); }
});
document.addEventListener('keydown', e=>{
  if(e.key==='Escape'){ if(!$('edBg').hidden){ closeEditor(); return; } closeModal(); closeStageSelect(); closeResults(); if(running) running.abort(); }
  if((e.key==='Enter'||e.key===' ')&&e.target.classList&&e.target.classList.contains('node')){ e.preventDefault(); go('stage',+e.target.dataset.stage); }
});
function toggleDock(){ $('dock').classList.toggle('min'); }
$('dockFab').addEventListener('click', ()=>{ $('dock').classList.remove('min'); $('chatBox').focus(); });
$('dockBar').addEventListener('click', toggleDock);
$('dockToggle').addEventListener('click', e=>{ e.stopPropagation(); toggleDock(); });
$('chatSend').addEventListener('click', e=>{ e.stopPropagation(); sendChat(); });
$('chatBox').addEventListener('keydown', e=>{ if(e.key==='Enter'&&(e.metaKey||e.ctrlKey)) sendChat(); });
$('modalBg').addEventListener('click', e=>{ if(e.target===$('modalBg')) closeModal(); });
$('selBg').addEventListener('click', e=>{ if(e.target===$('selBg')) closeStageSelect(); });
$('resBg').addEventListener('click', e=>{ if(e.target===$('resBg')) closeResults(); });
$('edBg').addEventListener('click', e=>{ if(e.target===$('edBg')) closeEditor(); });
window.addEventListener('resize', ()=>{ if(!$('edBg').hidden) fitEdCard(); });

/* ═══════════ 시작 ═══════════ */
load();
if(S.theme) document.documentElement.setAttribute('data-theme',S.theme);
render();
(async function boot(){
  try{
    if(window.claude&&typeof window.claude.use==='function'){
      const r=await Promise.all([claude.use('sample'),claude.use('downloads')]);
      sampleFn=r[0]||null; dlFn=r[1]||null;
    }else{
      const r=await fetch('/api/generate');
      const d=await r.json();
      if(r.ok&&d.configured) sampleFn=geminiSample();
    }
  }catch(e){}
  $('aiChip').textContent=sampleFn?'AI 연결됨 ✦':'AI 없음 · 직접 입력';
  $('aiChip').style.color=sampleFn?'var(--ok)':'var(--warn)';
  if(S.screen==='stage'&&stg().key==='carousel') afterCarousel();
})();
