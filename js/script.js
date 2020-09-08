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
/*    let avg = teloData.filter(d => d[0] == 'ø kraje');
    teloData.forEach((row, index) => {
      if(index > 0) {
        let teloRadek = row;
        for(let i = 1; i < teloRadek.length; i++) {
          teloRadek[i] = String(parseInt(teloRadek[i]) - parseInt(avg[0][i]));
        };
      }
    });
*/
  } else if(pohled === 'strana') {
    data = data.filter(d => d[2].indexOf(detail) !== -1);
    hlavickaData = hlavickaData.slice(0, 2).concat(hlavickaData.slice(3));
    teloData = data.map(function(d) {return d.slice(0, 2).concat(d.slice(3))});
/*    let avg = teloData.filter(d => d[0] == 'ø strany');
    console.log(avg)
*/
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

  if(pohled === 'kraj') {
    var order = 1;
  } else if (pohled === 'strana') {
    var order = 2;
  }

  $("#tabulka").DataTable({
    order: [[order, "desc"]],
    responsive: true,
    ordering: true,
    paging: false,
    bInfo: false,
    language: {
      url: "https://interaktivni.rozhlas.cz/tools/datatables/Czech.json",
    },
    columnDefs: [
      { targets: 0, type: "diacritics-neutralise" },
      { targets: 1, type: "natural" }
    ],
    fnRowCallback: function(nRow, aData, iDisplayIndex) {
      if ( (aData[0].indexOf('ø') !== -1) || (aData[1].indexOf('ø') !== -1) ) {
        console.log('xxx')
        $('td', nRow).each(function() {
          $(this).addClass('bold');
        });
      }
      return nRow;
    }
  });
}

$('#tabulka').dataTable( {
  "rowCallback": function(row, data) {
    if ( displayNum == 1 ) {
      $('td:eq', row).html( '<b>ø kraje</b>' );
    }
  }
} );

function drawSecondLevel(pohled) {
  if(pohled === 'kraj') {
    let htmlSecondLevel = '<select id="secondLevelSelect">'
    htmlSecondLevel += '<option value="Středočeský" selected>Středočeský</option>'
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
    let htmlSecondLevel = '<select id="secondLevelSelect">'
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

$('#pohledSelect').change(function(event){
  var pohled = $("#pohledSelect").val();
  drawSecondLevel(pohled);
});

$('#secondLevel').change(function(event){
  var pohled = $("#pohledSelect").val();
  var detail = $("#secondLevelSelect").val();
  loadData(pohled, detail);
});
