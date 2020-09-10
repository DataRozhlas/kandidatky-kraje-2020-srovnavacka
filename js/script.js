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

  if (pohled === 'kraj') {
    teloData = data.filter(d => d[0] == detail);
  } else if (pohled === 'strana') {
    teloData = data.filter(d => d[2].indexOf(detail) !== -1);
  } else if (pohled === 'kraje') {
    teloData = data.filter(d => d[1].indexOf('ø kraje') !== -1 || d[1].indexOf('ø kandidátka') !== -1);
  } else if (pohled === 'strany') {
    teloData = data.filter(d => d[0].indexOf('ø strany') !== -1 || d[0].indexOf('ø kandidátka') !== -1);
  }

  $("#detail").html(`<table id="tabulka" class="display" style="width:100%"></table>`);

  const hlavicka = $("<tr>");
  hlavickaData.forEach(column => {
    let suffix;
    if (column === 'kraj' || column === 'koal.' || column === 'strana') {
      suffix = '';
    } else if (column === 'věk') {
      suffix = ' (med.)';
    } else if (column === 'bydl.') {
      suffix = ' (med.) <br/> (× 1000 obyv.)';
    } else {
      suffix = ' (%)';
    }
    hlavicka.append($("<th>").html(column + '<div class="pozn">' + suffix + '</div>'))
  });
  $("<thead>").appendTo("#tabulka").append(hlavicka);

  let krajNr;
  if (pohled === 'kraj') {
    krajNr = teloData.filter(d => d[1].indexOf('ø kraje') !== -1);
    krajNr = krajNr.map(function(value, index) { return value[2]; });
  } else if (pohled === 'strana') {
    krajNr = [2, 10, 4, 7, 6, 13, "", 11, 8, 3, 1, 5, 9, 12];
  }

  const telo = $("<tbody>");
  teloData.forEach((strana, jndex) => {
    const radek = $("<tr>");
    strana.forEach((column, index) => {
      if (pohled === 'kraj') {
        if (index === 1 && column != 'ø kraje') {
          radek.append($("<td>").html(`${column} <div class="kandLink"><a href="https://volby.cz/pls/kz2020/kz111?xjazyk=CZ&xkraj=${krajNr}&xstrana=${strana[4]}&xv=1&xt=1" target="_blank">kandidátka ↗</a></div>`));
        } else {
          radek.append($("<td>").html(column));
        }
      } else if (pohled === 'strana') {
        if (index === 0 && column != 'ø strany') {
          radek.append($("<td>").html(`${column} <div class="kandLink"><a href="https://volby.cz/pls/kz2020/kz111?xjazyk=CZ&xkraj=${krajNr[jndex]}&xstrana=${strana[4]}&xv=1&xt=1" target="_blank">kandidátka ↗</a></div>`));
        } else {
          radek.append($("<td>").html(column));
        }
      } else {
        radek.append($("<td>").html(column));
      }
    });
    $(telo).append(radek);
  });
  $("#tabulka").append(telo);

  let param, order, avgCol;
  if (pohled === 'kraj') {
    order = 1;
    avgCol = 1;
    param = [
      {targets: 0, visible: false, searchable: false},
      {targets: 2, visible: false, searchable: false},
      {targets: 4, visible: false, searchable: false},
      {targets: 1, type: "diacritics-neutralise"}
    ];
  } else if (pohled === 'strana') {
    order = 0;
    avgCol = 0;
    param = [
      {targets: 1, visible: false, searchable: false},
      {targets: 2, visible: false, searchable: false},
      {targets: 4, visible: false, searchable: false},
      {targets: 0, type: "diacritics-neutralise"}
    ];
  } else if (pohled === 'kraje') {
    order = 0;
    avgCol = 0;
    param = [
      {targets: 1, visible: false, searchable: false},
      {targets: 2, visible: false, searchable: false},
      {targets: 3, visible: false, searchable: false},
      {targets: 4, visible: false, searchable: false},
      {targets: 0, type: "diacritics-neutralise"}
    ];
  } else if (pohled === 'strany') {
    order = 1;
    avgCol = 1;
    param = [
      {targets: 0, visible: false, searchable: false},
      {targets: 2, visible: false, searchable: false},
      {targets: 3, visible: false, searchable: false},
      {targets: 4, visible: false, searchable: false},
      {targets: 1, type: "diacritics-neutralise"}
    ];
  }

  $("#tabulka").DataTable({
    order: [[order, "asc"]],
    responsive: true,
    ordering: true,
    paging: false,
    bInfo: false,
    language: {
      url: "https://interaktivni.rozhlas.cz/tools/datatables/Czech.json",
    },
    columnDefs: param,
    fnRowCallback: function(nRow, aData, iDisplayIndex) {
      if (aData[avgCol].indexOf('ø') !== -1) {
        $('td', nRow).each(function() {
          $(this).addClass('bold');
        });
      }
      return nRow;
    }
  });
}

function drawSecondLevel(pohled) {
  if (pohled === 'kraj') {
    let htmlSecondLevel = '<select id="secondLevelSelect" required>'
    htmlSecondLevel += '<option value="" disabled selected hidden>Vyberte kraj</option>'
    htmlSecondLevel += '<option value="Středočeský">Středočeský</option>'
    htmlSecondLevel += '<option value="Jihočeský">Jihočeský</option>'
    htmlSecondLevel += '<option value="Plzeňský">Plzeňský</option>'
    htmlSecondLevel += '<option value="Karlovarský">Karlovarský</option>'
    htmlSecondLevel += '<option value="Ústecký">Ústecký</option>'
    htmlSecondLevel += '<option value="Liberecký">Liberecký</option>'
    htmlSecondLevel += '<option value="Královéhradecký">Královéhradecký</option>'
    htmlSecondLevel += '<option value="Pardubický">Pardubický</option>'
    htmlSecondLevel += '<option value="Vysočina">Vysočina</option>'
    htmlSecondLevel += '<option value="Jihomoravský">Jihomoravský</option>'
    htmlSecondLevel += '<option value="Olomoucký">Olomoucký</option>'
    htmlSecondLevel += '<option value="Zlínský">Zlínský</option>'
    htmlSecondLevel += '<option value="Moravskoslezský">Moravskoslezský</option>'
    htmlSecondLevel += '</select>';
    $("#secondLevel").html(htmlSecondLevel);
  } else if (pohled === 'strana') {
    let htmlSecondLevel = '<select id="secondLevelSelect" required>'
    htmlSecondLevel += '<option value="" disabled selected hidden>Vyberte stranu</option>'
    htmlSecondLevel += '<option value="768">ANO</option>'
    htmlSecondLevel += '<option value="007">ČSSD</option>'
    htmlSecondLevel += '<option value="001">KDU-ČSL</option>'
    htmlSecondLevel += '<option value="047">KSČM</option>'
    htmlSecondLevel += '<option value="053">ODS</option>'
    htmlSecondLevel += '<option value="720">Piráti</option>'
    htmlSecondLevel += '<option value="166">STAN</option>'
    htmlSecondLevel += '<option value="1114">SPD</option>'
    htmlSecondLevel += '<option value="1227">Trikolóra</option>'
    htmlSecondLevel += '<option value="005">Zelení</option>'
    htmlSecondLevel += '</select>';
    $("#secondLevel").html(htmlSecondLevel);
  }
}

$('#pohledSelect').change(function(event) {
  var pohled = $("#pohledSelect").val();
  $("#secondLevelSelect").empty();
  $("#detail").empty();
  if(pohled === 'kraj' || pohled === 'strana') {
    drawSecondLevel(pohled);
  } else {
    $("#secondLevel").empty();
    loadData(pohled, '');
  }
});

$('#secondLevel').change(function(event) {
  var pohled = $("#pohledSelect").val();
  var detail = $("#secondLevelSelect").val();
  loadData(pohled, detail);
});

$('#tabulka').dataTable({
  "rowCallback": function(row, data) {
    if ( displayNum == 1 ) {
      $('td:eq', row).html( '<b>ø kraje</b>' );
    }
  }
});
