const rooms=[{id:1,game:"KOF 2002",ping:18,stake:10,opponent:"Brunão"},{id:2,game:"KOF 2002",ping:24,stake:5,opponent:"Thalia"},{id:3,game:"KOF 2002",ping:31,stake:20,opponent:"Juninho"}];
let selected=null;
let romObjectUrl=null;
let emulatorLoaded=false;

const $=id=>document.getElementById(id);
function show(id){document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));$(id).classList.add("active");window.scrollTo(0,0)}
function money(v){return v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}

function renderRooms(){
  const el=$("roomList");
  el.innerHTML=rooms.map(r=>`<div class="room"><div><b>${r.game}</b><small>${r.opponent}</small></div><div class="ping">${r.ping} ms</div><strong>${money(r.stake)}</strong><button class="primary join" data-id="${r.id}">JOGAR</button></div>`).join("");
  document.querySelectorAll(".join").forEach(b=>b.onclick=()=>openJoin(+b.dataset.id));
}
function openJoin(id){
  selected=rooms.find(r=>r.id===id);
  $("joinTitle").textContent=selected.game;
  $("joinOpponent").textContent="vs "+selected.opponent;
  $("joinStake").textContent=money(selected.stake);
  $("termsCheck").checked=false;
  $("payBtn").disabled=true;
  $("payStatus").textContent="";
  show("join");
}

$("findGames").onclick=()=>{renderRooms();show("rooms")};
$("backHome").onclick=()=>show("home");
$("backRooms").onclick=()=>show("rooms");

$("createRoom").onclick=()=>{
  const v=Number(prompt("Valor da entrada (R$):","10"));
  if(!Number.isFinite(v)||v<0)return;
  rooms.unshift({id:Date.now(),game:"KOF 2002",ping:0,stake:v,opponent:"Você"});
  renderRooms();
};

$("termsCheck").onchange=e=>$("payBtn").disabled=!e.target.checked;
$("termsLink").onclick=()=>$("termsDialog").showModal();
$("closeTerms").onclick=()=>$("termsDialog").close();
$("acceptTerms").onclick=()=>{$("termsCheck").checked=true;$("payBtn").disabled=false;$("termsDialog").close()};

$("payBtn").onclick=()=>{
  if(!selected)return;
  const nickname=$("nickname").value.trim()||"Jogador";
  $("payStatus").textContent="Pagamento simulado confirmado. Preparando partida...";
  $("gamePlayers").textContent=nickname+" vs "+selected.opponent;
  $("potValue").textContent=money(selected.stake*2);
  $("matchState").textContent="Sala liberada • carregue sua ROM";
  setTimeout(()=>show("game"),400);
};

$("controlsBtn").onclick=()=>{
  alert("Os controles são configurados pelo próprio EmulatorJS. Abra o menu do emulador e configure teclado/gamepad para o Player 1/2.");
};

function loadEmulator(romUrl){
  if(emulatorLoaded)return;
  window.EJS_player="#game";
  window.EJS_core="mame2003";
  window.EJS_gameUrl=romUrl;
  window.EJS_pathtodata="https://cdn.emulatorjs.org/stable/data/";
  window.EJS_gameName="KOF 2002";
  window.EJS_gameID=2002;
  window.EJS_controlScheme="arcade";
  window.EJS_language="pt-BR";
  window.EJS_startOnLoaded=true;
  window.EJS_netplayServer="https://netplay.emulatorjs.org/";
  window.EJS_netplayICEServers=[{urls:"stun:stun.l.google.com:19302"}];

  const script=document.createElement("script");
  script.src="https://cdn.emulatorjs.org/stable/data/loader.js";
  script.onload=()=>{
    emulatorLoaded=true;
    $("emulatorStatus").textContent="EmulatorJS carregado. Selecione/entre na sala de netplay pelo menu do emulador.";
  };
  script.onerror=()=>{
    $("emulatorStatus").textContent="Não foi possível carregar o EmulatorJS. Verifique sua conexão e tente novamente.";
  };
  document.body.appendChild(script);
}

$("romFile").addEventListener("change",e=>{
  const file=e.target.files[0];
  if(!file)return;
  if(romObjectUrl)URL.revokeObjectURL(romObjectUrl);
  romObjectUrl=URL.createObjectURL(file);
  $("romHint").textContent="ROM carregada localmente: "+file.name+" • não enviada ao GitHub.";
  $("emulatorStatus").textContent="Iniciando EmulatorJS...";
  loadEmulator(romObjectUrl);
});

function finishMatch(winner){
  if(!selected)return;
  const pot=selected.stake*2;
  const fee=pot*.10;
  const prize=pot-fee;
  $("matchState").textContent="Resultado registrado: "+winner;
  alert("Vitória simulada!\n\nVencedor: "+winner+"\nPote: "+money(pot)+"\nTaxa Arena (10%): "+money(fee)+"\nPrêmio líquido: "+money(prize)+"\n\nPIX ainda é simulado. Em produção, o backend confirmará o resultado e fará o payout idempotente.");
}
$("p1WinBtn").onclick=()=>finishMatch("PLAYER 1");
$("p2WinBtn").onclick=()=>finishMatch("PLAYER 2");

window.addEventListener("beforeunload",()=>{if(romObjectUrl)URL.revokeObjectURL(romObjectUrl)});
renderRooms();