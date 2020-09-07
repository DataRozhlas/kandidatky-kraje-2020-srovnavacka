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
    hlavickaData.shift();
    teloData = data.map(function(d) {return d.slice(1);});
  } else if(pohled === 'strana') {
    data = data.filter(d => d[1] == detail);
//    hlavickaData = hlavickaData.slice(0, 1).concat(hlavickaData.slice(2));
//    teloData = data.map(function(d) {return d.slice(0, 1).concat(d.slice(2))});
    teloData = data.map(function(d) {return d});
  }

  console.log(hlavickaData);
  console.log(teloData);

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
      { targets: 1, type: "diacritics-neutralise" }
    ],
  });

}

function drawSecondLevel(pohled) {
  if(pohled === 'kraj') {
    let htmlSecondLevel = '<select id="secondLevelSelect"><option value="Středočeský">Středočeský</option><option value="Plzeňský">Plzeňský</option></select>';
    $("#secondLevel").html(htmlSecondLevel);
  } else if (pohled === 'strana') {
    let htmlSecondLevel = '<select id="secondLevelSelect"><option value="ODS">ODS</option><option value="ČSSD">ČSSD</option></select>';
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