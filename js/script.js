/* eslint-disable no-undef */
import Papa from "papaparse";

// vyflusnuti tabulek
function loadData(pohled, detail) {
  Papa.parse("https://data.irozhlas.cz/kandidatky-kraje-2020-srovnavacka/data/srovnavacka.csv", {
    download: true,
    skipEmptyLines: true,
    complete(results) {
      drawDetail(results.data, pohled, detail);
    }
  });
}

function drawDetail(data, pohled, detail) {
  let hlavickaData = data[0];
  let teloData;
  if(pohled === 'kraj') {
    data = data.filter(d => d[0] == detail);
    hlavickaData = hlavickaData.slice(1,2).concat(hlavickaData.slice(3));
    teloData = data.map(function(d) {return d.slice(1,2).concat(d.slice(3));})
    let avg = data.filter(d => d[1] == 'ø kraje');
    console.log(data)
  } else if(pohled === 'strana') {
    data = data.filter(d => d[2].indexOf(detail) !== -1);
    hlavickaData = hlavickaData.slice(0, 2).concat(hlavickaData.slice(3));
    teloData = data.map(function(d) {return d.slice(0, 2).concat(d.slice(3))});
    let avg = data.filter(d => d[0] == 'ø strany');
    console.log(avg)
  }

  $("#detail").html(`<table id="tabulka" class="display" style="width:100%"></table>`);

  const hlavicka = $("<tr>");
  hlavickaData.forEach(column => hlavicka.append($("<th>").html(column)));
  $("<thead>").appendTo("#tabulka").append(hlavicka);

  const telo = $("<tbody>");
  teloData.forEach((strana) => {
    const radek = $("<tr>");
    strana.forEach((column, index) => {
      radek.append($("<td>").html(column));
    });
    $(telo).append(radek);
  });
  $("#tabulka").append(telo);

  $("#tabulka").DataTable({
    order: [[1, "asc"]],
    responsive: true,
    ordering: true,
    paging: false,
    bInfo: false,
    language: {
      url: "https://interaktivni.rozhlas.cz/tools/datatables/Czech.json",
    },
    columnDefs: [
      { targets: 0, type: "diacritics-neutralise" }
    ],
  });

}

function drawSecondLevel(pohled) {
  if(pohled === 'kraj') {
    let htmlSecondLevel = '<select id="secondLevelSelect"><option value="Středočeský">Středočeský</option><option value="Plzeňský">Plzeňský</option></select>';
    $("#secondLevel").html(htmlSecondLevel);
  } else if (pohled === 'strana') {
    let htmlSecondLevel = '<select id="secondLevelSelect"><option value="001">KDU-ČSL</option><option value="053">ODS</option><option value="007">ČSSD</option></select>';
    $("#secondLevel").html(htmlSecondLevel);
  }
}

$('#pohledSelect').change(function(event){
  var pohled = $("#pohledSelect").val();
  drawSecondLevel(pohled);
});

$('#secondLevel').change(function(event){
  var pohled = $("#pohledSelect").val();
  var detail = $("#secondLevelSelect").val();
  loadData(pohled, detail);
});

// loadData(1);