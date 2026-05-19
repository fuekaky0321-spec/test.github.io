const CAST_DICT = {
  Maaya: "https://www.canva.com/design/DAHKEvpK2hk/pFVKh--tI0O1TqFShAN6tA/view",
  Nako: "https://www.canva.com/design/DAHKEj4Qwf0/BpbRYJCz2i66K8OdyhcLcA/view?embed",
  Hono: "https://www.canva.com/design/DAHKEhBRJws/HTyusJhLG7ZV0EdGPkORGg/view?embed",
  Yu: "https://www.canva.com/design/DAHKEqQ7D1U/q9OnBGdS0_5P-hdb5xSJKw/view?embed"
};

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1wJrWj4cK01nAZmx9hFQJsml3Za77jlADrGAmyOfqfBM/gviz/tq?tqx=out:json";

// 今日の日付
const today = new Date().toISOString().split("T")[0];

const normalize = (v) => {
  if (!v) return "";
  return new Date(v).toISOString().split("T")[0];
};

window.addEventListener("DOMContentLoaded", () => {

  const area = document.getElementById("schedule-area");

  fetch(SHEET_URL)
    .then(res => res.text())
    .then(text => {

      const json = JSON.parse(text.substring(47).slice(0, -2));
      const rows = json.table.rows;

      const data = rows.map(r => ({
        date: r.c[0]?.f,
        location: r.c[1]?.v,
        casts: [r.c[2]?.v, r.c[3]?.v, r.c[4]?.v].filter(Boolean)
      }));

      console.log("DATA:", data);

      const todayData = data.filter(d =>
        normalize(d.date) === today
      );

      console.log("TODAY:", today);
      console.log("TODAY DATA:", todayData);

      if (!todayData.length) {
        area.innerHTML = "<p>No cast today</p>";
        return;
      }

      todayData.forEach(loc => {

        const block = document.createElement("div");
        block.style.border = "1px solid #ddd";
        block.style.margin = "10px";
        block.style.padding = "10px";

        let html = `<h3>${loc.location}</h3>`;

        loc.casts.forEach(name => {
          const url = CAST_DICT[name];

          html += `
            <div>
              <h4>${name}</h4>
              <iframe
                src="${url}"
                style="width:100%; height:300px;"
              ></iframe>
            </div>
          `;
        });

        block.innerHTML = html;
        area.appendChild(block);
      });

    })
    .catch(err => {
      console.error(err);
      area.innerHTML = "<p>Error loading data</p>";
    });

});
