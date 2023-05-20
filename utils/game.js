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
      "Pichon de Ouija"],
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
      "Oreo/Viernes"],
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
      "Fonsi"]
  }
};

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


function obtenerListaAleatoria(lista) {
  var listaAleatoria = lista.slice();

  listaAleatoria.sort(function() {
    return Math.random() - 0.5;
  });

  return listaAleatoria;
}

function get_time(end, start){
  var time = "";
  let secs = (end - start)/1000;
  let mins = Math.floor(secs/60);
  if(mins>0)
    time += mins + " min ";
  return time + Math.round(secs%60) + " sec";
}

document.addEventListener('DOMContentLoaded', ()=> {
  document.querySelector("#play").muted = false;

  list = document.querySelector('#button-container');
  let camada = 1, current=0,size=11, n_tunos=49;
  var start, end;
  btn = document.querySelector('#btn_title');

  btn.addEventListener('click', function() {
    btn.classList.add('shot');
    setTimeout(function() {
      btn.classList.remove('shot');
    }, 500);
  });

  function finish(win=false){
    if(win)
      document.querySelector("#play").play();
    else
      document.querySelector("#fail").play();

    list.innerHTML = "";
    var info = document.createElement("p");
    info.setAttribute("id", "info");
    var end = Date.now();
    info.innerHTML = " <b>Pardo power:</b> "+ Math.ceil(current/n_tunos * 100) + 
                    "% <br><br><b>Time: </b>" + get_time(end,start) + " <br>";
    list.appendChild(info);

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
    btn.style.pointerEvents = 'none';
    start = Date.now();
    tower();
  }

})