const CAST_DICT = {
  MAAYA: "https://www.canva.com/design/DAHKEvpK2hk/pFVKh--tI0O1TqFShAN6tA/view?embed",
  NAKO: "https://www.canva.com/design/DAHKEj4Qwf0/BpbRYJCz2i66K8OdyhcLcA/view?embed",
  HONO: "https://www.canva.com/design/DAHKEhBRJws/HTyusJhLG7ZV0EdGPkORGg/view?embed",
  YU: "https://www.canva.com/design/DAHKEqQ7D1U/q9OnBGdS0_5P-hdb5xSJKw/view?embed"
};

// 今日（固定フォーマット）
const today = new Date().toISOString().split("T")[0];

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1wJrWj4cK01nAZmx9hFQJsml3Za77jlADrGAmyOfqfBM/gviz/tq?tqx=out:json";

fetch(SHEET_URL)
  .then(r => r.text())
  .then(text => {

    let json;
    try {
      json = JSON.parse(text.substring(47).slice(0, -2));
    } catch (e) {
      document.getElementById("schedule-area").innerHTML =
        "<p>データ取得エラー</p>";
      return;
    }

    const rows = json.table.rows || [];

    const data = rows.map(r => ({
      date: r.c[0]?.v,
      location: r.c[1]?.v,
      casts: [r.c[2]?.v, r.c[3]?.v, r.c[4]?.v].filter(Boolean)
    }));

    const todayData = data.filter(d => d.date === today);

    const area = document.getElementById("schedule-area");

    // ■ データなしでも画面は壊さない
    if (todayData.length === 0) {
      area.innerHTML = "<p>No cast today</p>";
      return;
    }

    todayData.forEach(loc => {

      const block = document.createElement("div");
      block.className = "block";

      let html = `<h2>${loc.location}</h2>`;

      loc.casts.forEach(name => {

        const url = CAST_DICT[name?.toUpperCase()?.trim()];

        html += `
          <div style="margin-top:15px;">
            <h3>${name}</h3>
            ${url ? `<iframe class="cast" src="${url}"></iframe>` : "<p>未登録</p>"}
          </div>
        `;
      });

      block.innerHTML = html;
      area.appendChild(block);
    });

  })
  .catch(() => {
    document.getElementById("schedule-area").innerHTML =
      "<p>通信エラー</p>";
  });