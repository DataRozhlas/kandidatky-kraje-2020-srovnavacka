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
    } else if (column === 'věk' || column === 'obyv.') {
      suffix = ' (med.)';
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
    ordering: true,
    paging: false,
    bInfo: false,
    language: {
      url: "https://interaktivni.rozhlas.cz/tools/datatables/Czech.json",
    },
    responsive: true,
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

const colors = {
    'muzi': '#3E80B6',
    'zeny': '#E63946',
    'nic': '#DDD',
    'ing': '#3E80B6',
    'mgr': '#009FB8',
    'bc': '#7CB5EC',
    'mudr': '#E63946',
    'judr': '#FF6666',
    'vice': '#FF9c9c',
    'ostatni': '#666'
}

const vek = [18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88];

const muzi = [8,24,28,40,40,56,48,60,66,74,64,77,69,99,96,94,123,128,130,137,175,142,140,211,205,203,225,199,228,202,223,223,189,182,179,181,208,187,196,163,151,142,143,128,121,121,127,128,94,105,97,71,75,67,52,37,35,12,22,15,12,7,1,5,9,0,1,1,0,0,1],
      zeny = [10,9,15,22,19,23,26,20,25,22,21,26,25,32,31,40,50,51,49,49,48,44,65,56,60,66,88,78,94,74,91,68,74,77,92,82,74,79,82,71,59,57,63,38,50,49,38,28,44,24,30,13,18,10,20,12,7,7,5,4,2,2,2,1,2,0,1,1,0,0,1];

Highcharts.chart('tits', {

    chart: {
        type: 'treemap',
        layoutAlgorithm: 'squarified',
        style: {
           fontFamily: 'Asap'
        }
    },

    title: {
        text: 'Vysokoškolské vzdělání kandidátů'
    },

    tooltip: {
        valueSuffix: ' kandidátů'
    },

    exporting: {
        enabled: false
    },

    credits: {
        text: 'volby.cz',
        href: 'https://volby.cz/opendata/kz2020/kz2020_opendata.htm'
    },

    series: [{
        data: [{
            name: 'bez VŠ vzdělání',
            value: 5081,
            color: colors.nic
        }, {
            name: 'Ing.',
            value: 1857,
            color: colors.ing
        }, {
            name: 'Mgr.',
            value: 1245,
            color: colors.mgr
        }, {
            name: 'Bc.',
            value: 578,
            color: colors.bc
        }, {
            name: 'MUDr.',
            value: 254,
            color: colors.mudr
        }, {
            name: 'JUDr.',
            value: 103,
            color: colors.judr
        }, {
            name: 'více titulů',
            value: 325,
            color: colors.vice
        }, {
            name: 'ostatní',
            value: 283,
            color: colors.ostatni
        }]
    }]
});

Highcharts.chart('demo', {

    chart: {
        type: 'line',
        style: {
           fontFamily: 'Asap'
        }
    },

    title: {
        text: 'Věk a pohlaví kandidátů'
    },

    xAxis: {
        categories: vek,
        title: {
            text: 'věk'
        },
    },

    yAxis: {
        title: {
            text: 'počet kandidátů'
        },
        labels: {
            formatter: function () {
                return this.value + '';
            }
        }
    },

    annotations: [{
        labelOptions: {
            backgroundColor: 'rgba(255,255,255,0.5)',
            verticalAlign: 'top',
            y: 15,
            align: 'right',
            justify: false,
            crop: false,
            style: {
                fontSize: '0.8em',
                textOutline: '1px white'
            }
        },
        labels: [{
            point: {
                xAxis: 0,
                yAxis: 0,
                x: 19,
                y: 137
            },
            x: -20,
            y: -100,
            text: '<b>37 let, muž, Ing./Mgr.</b><br/>Typický zástupce Pirátů.<br/>Z parlamentních stran<br/>mají nejnižší věk<br/>a relativně málo žen.'
        }, {
            point: {
                xAxis: 0,
                yAxis: 0,
                x: 30,
                y: 223
            },
            x: 100,
            y: 60,
            text: '<b>48 let, muž, Ing.</b><br/>Průměrný kandidát.<br/>Pokud má VŠ vzdělání,<br/>pak nejčastěji inženýrské.<br/>Jen 27 % kandidátů jsou ženy.'
        }, {
            point: {
                xAxis: 0,
                yAxis: 0,
                x: 37,
                y: 187
            },
            x: 200,
            y: -50,
            text: '<b>55 let, muž, Ing.</b><br/>Průměrný zástupce KSČM,<br/>nejstarší strany v parlamentu.'
        }]
    }],

    tooltip: {
        headerFormat: '<span style="font-size: 10px">{point.key} let</span><br/>',
        valueSuffix: ' kandidátů',
        shared: true
    },

    exporting: {
        enabled: false
    },

    credits: {
        text: 'volby.cz',
        href: 'https://volby.cz/opendata/kz2020/kz2020_opendata.htm'
    },

    plotOptions: {
        line: {
            marker: {
                symbol: 'circle'
            }
        }
    },

    series: [{
        name: 'muži',
        data: muzi,
        color: colors.muzi
    }, {
        name: 'ženy',
        data: zeny,
        color: colors.zeny
    }]
});
