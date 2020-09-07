/* eslint-disable no-undef */
import Papa from "papaparse";

// vyflusnuti tabulek
function drawTables(stranyData, kandData, kraj) {

  let stranyHlavickaData = stranyData[0];

  // výběr kraje u stran
  stranyData = stranyData.filter(d => d[0] == kraj);

  // po výběru kraje u stran odstranění prvního sloupce
  stranyData = stranyData.map(function(d) { return d.slice(1);} );
  stranyHlavickaData.shift();

  let kandHlavickaData = kandData[0];

  // výběr kraje u kandidátů
  kandData = kandData.filter(d => d[0] == kraj);

  // po výběru kraje u kandidátů odstranění prvního sloupce
  kandData = kandData.map(function(d) { return d.slice(1);} );
  kandHlavickaData.shift();

  $("#strany").html(`<table id="tabulkaStran" class="display" style="width:100%"></table>`);
  $("#kandidati").html();

  const stranyHlavicka = $("<tr>");
  stranyHlavickaData.forEach(column => stranyHlavicka.append($("<th>").html(column)));
  $("<thead>").appendTo("#tabulkaStran").append(stranyHlavicka);

  // strany - telo (zbytek radku)
  const telo = $("<tbody>");
  stranyData.forEach((strana) => {
    const radek = $("<tr>");
    strana.forEach((column, index) => {
      index === 1
        ? radek.append($("<td>").html(`${column} <div class="stranaKlik" data-strana=${strana[0]}><u>kandidáti</u></div>`))
        : radek.append($("<td>").html(column));
    });

    // skryty sloupecek se jmeny kandidatu kvuli searchi
    const kandidati = kandData
      .filter(kand => kand[0] === parseInt(strana[0], 10).toString())
      .map(kand => kand[2]);

    radek.append($("<td>").html(kandidati.join(" ")));

    $(telo).append(radek);
  });
  $("#tabulkaStran").append(telo);

  // strany - datatablizace
  $("#tabulkaStran").DataTable({
    order: [[0, "asc"]],
    responsive: true,
    ordering: true,
    paging: false,
    bInfo: false,
    language: {
      url: "https://interaktivni.rozhlas.cz/tools/datatables/Czech.json",
    },
    columnDefs: [
      { targets: 1, type: "diacritics-neutralise" },
      { targets: 2, type: "diacritics-neutralise" },
      { targets: 3, type: "natural" },
      { targets: 7, visible: false, searchable: false }
    ],
  });

  // onclick tabulka kandidatu
  $(".stranaKlik").click((e) => {
    const strana = e.currentTarget.getAttribute("data-strana");
    const nazevStrany = stranyData.filter(str => str[0] === strana)[0][1];

    $("#kandidati").html(`<button id="zpetStrany" type="button">Zpět na výběr strany</button>
      <h3>Kandidáti</h3>
      <h3 style="font-weight: normal">${nazevStrany}</h3>
      <table id="tabulkaKandidatu" class="display" style="width:100%"></table>`);

    // kandidati - hlavicka (prvni radek csv)
    const kandHlavicka = $("<tr>");
    kandHlavickaData.map(column => kandHlavicka.append($("<th>").html(column)));
    $("<thead>").appendTo("#tabulkaKandidatu").append(kandHlavicka);

    // kandidati - telo (filtr podle cisla strany)
    const kandidati = kandData
      .filter(kand => kand[0] == strana);

    const kandTelo = $("<tbody>");
    kandidati.forEach((kandidat) => {
      const radek = $("<tr>");
      kandidat.forEach(column => radek.append($("<td>").html(column)));
      $(kandTelo).append(radek);
    });
    $("#tabulkaKandidatu").append(kandTelo);

    // kandidati - datatablizace
    $("#tabulkaKandidatu").DataTable({
      columnDefs: [
        { targets: 0, visible: false },
        { targets: 2, type: "diacritics-neutralise" },
        { targets: 4, type: "diacritics-neutralise" },
        { targets: 5, type: "diacritics-neutralise" }
      ],
      order: [[0, "asc"]],
      responsive: true,
      ordering: true,
      paging: false,
      bInfo: false,
      language: {
        url: "https://interaktivni.rozhlas.cz/tools/datatables/Czech.json",
      },
    });

    // scrolling od tlačítka a k němu
    document.getElementById("kandidatiScroll").scrollIntoView();

    $("#zpetStrany").click(() => {
      document.getElementById("stranyScroll").scrollIntoView();
    });
  });
}

// nacteni tabulky kandidatu
function loadKand(stranyData, kraj) {
  Papa.parse("https://data.irozhlas.cz/kandidatky-kraje-2020/data/2020/app/kandidati.csv", {
    download: true,
    skipEmptyLines: true,
    complete(results) {
      drawTables(stranyData, results.data, kraj);
    }
  });
}

// nacteni tabulky stran
function loadStrany(kraj) {
  Papa.parse("https://data.irozhlas.cz/kandidatky-kraje-2020/data/2020/app/strany.csv", {
    download: true,
    skipEmptyLines: true,
    complete(results) {
      loadKand(results.data, kraj);
    }
  });
}

$('#krajSelect').change(function(event){
  var kraj = $("#krajSelect").val();
  loadStrany(kraj);
});

loadStrany(1);
