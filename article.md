title: ""
perex: ""
coverimg:
coverimg_note: ""
styles: []
libraries: [jquery, datatables, "https://cdn.datatables.net/plug-ins/1.10.19/sorting/diacritics-sort.js", "https://cdn.datatables.net/plug-ins/1.10.21/sorting/natural.js"]
options: [noheader, nopic]
---

<wide><div id="kandidatky">

<h3 id="pohled">Vyberte pohled</h3>

<select id="pohledSelect">
  <option value="kraj">Srovnání kandidátek v kraji</option>
  <option value="strana">Srovnání kandidátek strany</option>
</select>

<div id="secondLevel"></div>

<div id="detail"></div>

<div style="text-align: right;"><small>Zdroj dat: <a href="https://volby.cz/opendata/kz2020/kz2020_opendata.htm">volby.cz</a></small></div>

</div></wide>
