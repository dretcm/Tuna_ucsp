var data = {
  "chaplins":{
    1:[
      "Pollo",
      "Meteoro",
      "Ouija",
      "Borrego",
      "Shin Shan"], 
    2:[
      "Ventrilocuo",
      "Chun Lee",
      "Cachorro",
      "Mohamed"],
    3:[
      "Mr. Popus",
      "Rocoto",
      "Lord Voldemort"],
    4:[
      "Sonic",
      "Buque",
      "Anakin",
      "Mohojojo",
      "Shaggy"],
    5:[
      "Espanta",
      "Capullo",
      "Sinapodo"],
    6:[
      "Doberman",
      "Insomnio",
      "Gusabio",
      "Ben 10",
      "Pipilin"],
    7:[
      "Joshi",
      "Manzana",
      "Pichón de Ouija"],
    8:[
      "Pompinchu",
      "Chacana",
      "Chiru Chiru",
      "Jimbo",
      "Chichico",
      "Serrucho",
      "Picoro"],
    9:[
      "Pepino",
      "Mumm Ra",
      "Viernes"],
    10:[
      "Choko",
      "Uub",
      "Winnie Pooh",
      "Jaimico",
      "CJ"],
    11:[
      "Psicópata",
      "Julien",
      "Funko",
      "Koopa",
      "Locomia",
      "Fonsi"],
    12:[
      "Tilín",
      "Geminis",
      "Caradura",
      "Mowgli",
      "Chupetín"],
    13:[
      "Chungus",
      "Novita",
      "Churicata",
      "Abelardo",
      "Lujurio"]
  }
};


const decalogo = {
  "EL PARDILLO ES EL ÚLTIMO MONO" : 1,
  "EL PARDILLO NO OPINA" : 2,
  "EL PARDILLO ES UN SER SONRIENTE Y SERVICIAL PARA CON LA VETERANÍA. EL PARDILLO DA TODO DE SÍ PARA LA TUNA, NUNCA ESPERA NADA DE ELLA." : 3,
  "ES MENESTER LA DEMOSTRACIÓN, POR EL PARDO, DE SUS BUENAS ARTES MUSICALES" : 4,
  "LOS ENSAYOS SON SAGRADOS PARA EL PARDILLO" : 5,
  "EL VINO ES INDISPENSABLE EN TODO BUEN ENSAYO" : 6,
  "ES COMPETENCIA DE LA TUNA CONOCER QUE EL PARDO ES UN BUEN BEBEDOR" : 7,
  "LAS DEMOSTRACIONES DEL PARDILLO EN EL ARTE DE LA CONQUISTA DE FÉMINAS DEBERÁN SER CONVINCENTES, ELEGANTES, CORTESES, VARONILES Y SOBRE TODO DE BUEN GUSTO" : 8,
  "EL PARDILLO LLAMADO A SER TUNO HA DE ALBERGAR DENTRO DE SÍ A UN SER DE MONSTRUOSA ALEGRÍA E INGENIO MENTAL" : 9,
  "LAS RONDAS SON EL PAN DE LA TUNA" : 10,
}


const colors = [
  "#FF0000", // Rojo
  "#00FF00", // Verde
  "#0000FF", // Azul
  "#FF00FF", // Magenta "#FFFF00", // Amarillo
  "#00FFFF", // Cian
  "#FFA500", // Naranja
  "#FFC0CB", // Rosa
  "#800080", // Púrpura
  "#008000", // Verde oscuro
  "#000080", // Azul oscuro
  "#800000", // Marrón
  "#FF4500", // Naranja oscuro
  "#FF69B4", // Rosa claro
  "#00FF7F", // Verde lima
  "#800000", // Marrón oscuro
  "#808000", // Oliva
  "#FF1493", // Rosa intenso
  "#00BFFF", // Azul cielo
  "#D2691E", // Chocolate
  "#00CED1" // Turquesa
];

let url = "", user='', password='';
var driver, session;
const request = new XMLHttpRequest();
var list = document.querySelector('#button-container');


function obtenerListaAleatoria(lista) {
  var listaAleatoria = lista.slice();

  listaAleatoria.sort(function() {
    return Math.random() - 0.5;
  });

  return listaAleatoria;
}


function get_time(end, start){
  let secs = Math.floor((end - start) / 1000);
  let mins = Math.floor(secs / 60);

  let time = "";
  if (mins > 0)
    time += mins + " min ";

  return time + (secs % 60) + " sec";
}


function get_time_2(end, start){
  return Math.floor((end - start) / 1000);
}


async function table_score() {
  const { collection, getDocs, query, orderBy, limit } = window.fs;

  let scoreEl = document.querySelector('#score');

  if (!scoreEl) {
    scoreEl = document.createElement("p");
    scoreEl.setAttribute("id", "score");
    list.appendChild(scoreEl);
  }

  scoreEl.innerHTML = "Cargando ranking...";

  const q = query(
    collection(db, "scores"),
    orderBy("time"),
    limit(20)
  );

  const snap = await getDocs(q);

  let html = "<u><b>Score</b></u><br>";
  let pos = 1;

  snap.forEach(doc => {
    const d = doc.data();
    const min = Math.floor(d.time / 60);
    const sec = Math.floor(d.time % 60);

    let medal = "";
    let cls = "";

    if (pos === 1) { medal = "🥇 "; cls = "gold"; }
    else if (pos === 2) { medal = "🥈 "; cls = "silver"; }
    else if (pos === 3) { medal = "🥉 "; cls = "bronze"; }

  let meClass = (window.lastPlayerName && window.lastPlayerName === d.nombre) ? "me":"";


    html += `
      <div class="${cls} ${meClass}">
        ${pos}. ${medal}${d.nombre} = ${min} min ${sec} sec
      </div>
    `;

    pos++;
  });

  scoreEl.innerHTML = html;
}


async function saveScore(nombre, time_played) {
  const { collection, addDoc, getDocs, query, where, updateDoc } = window.fs;

  const scoresRef = collection(db, "scores");

  // Buscar si el nombre ya existe
  const q = query(scoresRef, where("nombre", "==", nombre));
  const snap = await getDocs(q);

  if (!snap.empty) {
    // Si existe, actualizar SOLO si mejora el tiempo
    const docRef = snap.docs[0].ref;
    const oldTime = snap.docs[0].data().time;

    if (time_played < oldTime) {
      await updateDoc(docRef, { time: time_played });
    }
  } else {
    // Nuevo jugador
    await addDoc(scoresRef, {
      nombre: nombre,
      time: time_played,
      createdAt: Date.now()
    });
  }
}


document.addEventListener('DOMContentLoaded', ()=> {

  table_score();

  //console.log(decalogo);
  //console.log(shuffleDictionary(decalogo));
  document.querySelector("#play").muted = false;

  let camada = 1, current=0,size=13, n_tunos=59;
  var start, end;
  btn = document.querySelector('#btn_title');

  btn.addEventListener('click', function() {
    btn.classList.add('shot');
    setTimeout(function() {
      btn.classList.remove('shot');
    }, 500);
  });

  async function finish(win=false){
    list.innerHTML = "";
    var info = document.createElement("p");
    info.setAttribute("id", "info");
    var end = Date.now();
    var time_played = get_time_2(end,start);
    info.innerHTML = " <b>Pardo Power:</b> "+ Math.ceil(current/n_tunos * 100) + 
                    "% <br><br><b>Time: </b>" + get_time(end,start) + " <br>";
    list.appendChild(info);
    list.innerHTML += "<br>"

    if(win){
      document.querySelector("#play").play();
      var data_name = document.createElement("input");
      data_name.setAttribute("id", "player_name");
      data_name.setAttribute("type", "text");
      data_name.setAttribute("maxlength", "20");
      data_name.setAttribute("placeholder", "Nombre (máx 20)");
      var send_btn = document.createElement("input");
      send_btn.setAttribute("id", "btn_title");
      send_btn.setAttribute("type", "button");
      send_btn.setAttribute("value", "Enviar");

      send_btn.onclick = async () => {
        const nombre = data_name.value.trim();
        if (!nombre) return;
        if (nombre.length > 20) {
          alert("El nombre debe tener máximo 20 caracteres");
          return;
        }

        // ⛔ Evitar múltiples envíos
        send_btn.disabled = true;
        window.lastPlayerName = nombre;


        await saveScore(nombre, time_played);

        // 🧹 Eliminar input y botón
        list.removeChild(data_name);
        list.removeChild(send_btn);

        // 🧾 Mostrar ranking normal
        await table_score();
      };

      
      list.appendChild(data_name);
      list.appendChild(send_btn);
    }
    else{
      document.querySelector("#fail").play();

      //var score = document.createElement("p");
      //score.setAttribute("id", "score");
      await table_score();
      //list.appendChild(score);
    }

    camada = 1;
    current=0;
    btn.value = " Start Again "
    btn.style.pointerEvents = 'auto';
  }

  function tower(){
    if(camada>size){
      finish(true);
    }
    else{
      list.innerHTML = "";
      btn.value = "Camada " + camada;

      let con = 1, con_size = data['chaplins'][camada].length;
      var data_random = obtenerListaAleatoria(data['chaplins'][camada]);

      for(let i in data_random){
        var input = document.createElement("input");
        input.setAttribute("type","button");
        input.setAttribute("id", "btn");
        input.setAttribute("class", "btn"+i);
        input.setAttribute("value", data_random[i]);
        var color_selected = colors[Math.floor(Math.random()*(colors.length))];
        input.setAttribute("style", "background:"+color_selected+";");

        list.appendChild(input);
        document.querySelector(".btn"+i).addEventListener('click', function() {

          document.querySelector("#key_game").play();

          document.querySelector(".btn"+i).classList.add('shot');
          document.querySelector(".btn"+i).style.visibility = "hidden";
          if(document.querySelector(".btn"+i).value != data['chaplins'][camada][con-1]){
            //console.log(document.querySelector(".btn"+i).value + " = "+data['chaplins'][camada][con-1]);
            finish();
          }
          current++;
          con++;
          if (con>con_size){
            camada++;
            tower();
          }
        });
      }
    }
  }


  btn.onclick = () => {
    document.querySelector("#key_game").play();
    btn.style.pointerEvents = 'none';
    start = Date.now();
    tower();
  }

})
