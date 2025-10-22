(async () => {
  const section = document.getElementById("cms-section");

  try {
    const res = await fetch("data.json");
    const cmsData = await res.json();

    const wrapper = document.createElement("div");
    wrapper.className = "table-wrapper";

    const table = document.createElement("table");
    table.className = "cms-table";

    const headers = [
      "System",
      "Produced by",
      "Technology",
      "Capabilities",
      "Limitations",
      "Example",
    ];

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    headers.forEach((h) => {
      const th = document.createElement("th");
      th.textContent = h;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    cmsData.forEach((cms) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${cms.name}</td>
        <td>${cms.support}</td>
        <td>${cms.technology}</td>
        <td>${cms.capabilities}</td>
        <td>${cms.limitations}</td>
        <td><a href="${cms.example}" target="_blank">Link</a></td>
      `;
      tbody.appendChild(row);
    });
    table.appendChild(tbody);

    wrapper.appendChild(table);
    section.appendChild(wrapper);
  } catch (err) {
    section.innerHTML += `<p style="color:red;">Error loading data.</p>`;
  }
})();
