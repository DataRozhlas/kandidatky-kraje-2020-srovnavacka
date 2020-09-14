title: "Málo žen, hodně inženýrů. Kdo se uchází o hlasy ve vašem kraji? Proklikejte si kandidátky"
perex: "Typický kandidát v nadcházejících krajských volbách? Muž, čtyřicátník či padesátník, inženýr. Žen je na kandidátkách sotva čtvrtina, mediánový věk kandidátů je 48 let a mezi vysokoškolsky vzdělanými je s převahou nejčastější titul <i>Ing.</i>, nosí ho přes čtyřicet procent z nich."
coverimg:
coverimg_note: ""
styles: ["https://fonts.googleapis.com/css2?family=Asap", "https://cdn.datatables.net/1.10.21/css/jquery.dataTables.min.css", "https://cdn.datatables.net/responsive/2.2.3/css/responsive.dataTables.min.css"]
libraries: [jquery, datatables, highcharts, "https://cdn.datatables.net/plug-ins/1.10.19/sorting/diacritics-sort.js", "https://cdn.datatables.net/plug-ins/1.10.21/sorting/natural.js", "https://code.highcharts.com/modules/annotations.js", "https://code.highcharts.com/modules/treemap.js"]
options: [noheader, nopic]
---
Zavedené politické strany demografické oživení do krajské politiky nepřinesou: kandidátní listiny parlamentních stran mají zpravidla ještě méně žen, vyšší věkový průměr a více inženýrů než zmíněná typická kandidátka. Jsou jen dvě výjimky: Piráti jsou podstatně mladší a SPD má výrazně méně inženýrů; to je ovšem důsledek toho, že má nedostatek vysokoškolsky vzdělaných kandidátů ve všech oborech.

<div id="demo" style="width:100%; height:400px"></div>

Kritickým nedostatkem ženského elementu a mladé krve trpí KSČM i ODS – obě strany mají ve třinácti krajích jedinou lídryni a ani jeden z jejich lídrů nemá méně než 40 let. Jen o něco lépe jsou na tom ostatní parlamentní strany. Mezi slepými jsou výjimkou jen Piráti se třemi lídryněmi a devíti kandidáty pod čtyřicítkou.

Kandidátní listiny prozrazují také bydliště politiků. Snadno tak lze dopočítat typickou velikost obce, odkud se kandidáti každé strany rekrutují. Mezi parlamentními stranami jsou na „městském“ konci spektra Piráti, na „vesnickém“ Starostové a nezávislí.

## Naklikejte si vlastní srovnání

Následující tabulka ukazuje stejné parametry pro všechny strany a koalice, které v krajských volbách kandidují. Pokud si chcete prohlédnout kandidátky v konkrétním regionu, volte _Kraj_. Pokud vás zajímá, jak vypadají kandidátky parlamentních stran napříč republikou a kde kandidují v koalici, klikněte na _Parlamentní strany_. _Srovnání krajů_ prozrazuje, které kraje se ve složení kandidátek nejvíce liší, _Srovnání všech stran_ podobně ukazuje, jak vypadá typický kandidát každé ze stran. Kliknutím na odkaz u konkrétní listiny si můžete prostudovat kandidátky na webu _volby.cz_.

<wide><div id="kandidatky">

<h3 id="pohled">Kdo kandiduje?</h3>

<select id="pohledSelect" required>
  <option value="" disabled selected hidden>Vyberte srovnání</option>
  <option value="kraj">Kraj</option>
  <option value="strana">Parlamentní strany</option>
  <option value="kraje">Srovnání krajů</option>
  <option value="strany">Srovnání všech stran</option>
</select>

<div id="secondLevel"></div>

<div id="detail"></div>

<div style="text-align: right;"><small>Zdroj dat: <a href="https://volby.cz/opendata/kz2020/kz2020_opendata.htm">volby.cz</a></small></div>

</div></wide>

Poslední graf se vrací ke vzdělání. Přestože mezi vysokoškolsky vzdělanými dominují inženýři, největší plochu kandidátek obsazují kandidáti bez vzdělání – z bezmála 10 tisíc kandidátů jich je víc než polovina. Naopak lékaři, kteří tradičně získávají značnou mediální pozornost, jsou mezi kandidáty v naprosté menšině.

<div id="tits" style="width:100%; height:400px"></div>