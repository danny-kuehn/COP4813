document.getElementById("plotBtn").addEventListener("click", () => {
  const A = parseFloat(document.getElementById("amplitude").value);
  const beta = parseFloat(document.getElementById("damping").value);
  const omega = parseFloat(document.getElementById("frequency").value);
  const xMin = parseFloat(document.getElementById("xMin").value);
  const xMax = parseFloat(document.getElementById("xMax").value);
  const xStep = parseFloat(document.getElementById("xStep").value);

  let xValues = [];
  let yValues = [];

  for (let x = xMin; x <= xMax; x += xStep) {
    let y = A * Math.exp(-beta * x) * Math.cos(omega * x);
    xValues.push(x);
    yValues.push(y);
  }

  const trace = {
    x: xValues,
    y: yValues,
    mode: "lines",
    type: "scatter",
    line: { color: "#0a66c2", width: 2 },
  };

  const layout = {
    title: "Damped Harmonic Oscillator",
    xaxis: { title: "x (time)" },
    yaxis: { title: "y (displacement)" },
    plot_bgcolor: "#fff",
    paper_bgcolor: "#fff",
  };

  // Show the hidden card
  const plotCard = document.getElementById("plotCard");
  plotCard.style.display = "block";

  // Scroll smoothly to the plot
  plotCard.scrollIntoView({ behavior: "smooth", block: "start" });

  // Render the plot
  Plotly.newPlot("plot", [trace], layout, { responsive: true });
});
