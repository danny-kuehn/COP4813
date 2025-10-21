$(document).ready(function () {
  $.getJSON("data.json", function (data) {
    let rows = "";
    $.each(data.distros, function (_, distro) {
      rows += `
        <tr>
          <td><img src="${distro.logo}" alt="${distro.name} logo" class="distro-logo"></td>
          <td>${distro.name}</td>
          <td><a href="${distro.url}" target="_blank" rel="noopener">${distro.url}</a></td>
          <td><code>${distro.packageManager}</code></td>
        </tr>`;
    });
    $("#distroTable tbody").html(rows);
  }).fail(function () {
    $("#distroTable tbody").html(
      "<tr><td colspan='4'>Error loading data.</td></tr>",
    );
  });
});
