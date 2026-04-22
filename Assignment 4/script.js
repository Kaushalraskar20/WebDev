let domainChart, paidChart, typeChart;

document.getElementById("csvFile").addEventListener("change", function (event) {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        const data = d3.csvParse(e.target.result);

        analyzeData(data);
    };

    reader.readAsText(file);
});


function analyzeData(data) {

    // TOTAL
    document.getElementById("totalInternships").innerText = data.length;

    // PAID COUNT
    const paidCount = data.filter(d => d.Paid.toLowerCase() === "yes").length;
    const unpaidCount = data.length - paidCount;

    document.getElementById("paidInternships").innerText = paidCount;
    document.getElementById("unpaidInternships").innerText = unpaidCount;

    // DOMAIN COUNT
    const domainCount = d3.rollup(
        data,
        v => v.length,
        d => d.Domain
    );

    const domainLabels = Array.from(domainCount.keys());
    const domainValues = Array.from(domainCount.values());

    // MODE COUNT
    const modeCount = d3.rollup(
        data,
        v => v.length,
        d => d.Mode
    );

    const modeLabels = Array.from(modeCount.keys());
    const modeValues = Array.from(modeCount.values());

    renderCharts(domainLabels, domainValues, paidCount, unpaidCount, modeLabels, modeValues);
}


function renderCharts(domainLabels, domainValues, paidCount, unpaidCount, modeLabels, modeValues) {

    if (domainChart) domainChart.destroy();
    if (paidChart) paidChart.destroy();
    if (typeChart) typeChart.destroy();

    // DOMAIN BAR CHART
    domainChart = new Chart(document.getElementById("domainChart"), {
        type: "bar",
        data: {
            labels: domainLabels,
            datasets: [{
                label: "Number of Internships",
                data: domainValues,
                backgroundColor: "#4e73df"
            }]
        }
    });

    // PAID PIE CHART
    paidChart = new Chart(document.getElementById("paidChart"), {
        type: "pie",
        data: {
            labels: ["Paid", "Unpaid"],
            datasets: [{
                data: [paidCount, unpaidCount],
                backgroundColor: ["#1cc88a", "#e74a3b"]
            }]
        }
    });

    // MODE DOUGHNUT CHART
    typeChart = new Chart(document.getElementById("typeChart"), {
        type: "doughnut",
        data: {
            labels: modeLabels,
            datasets: [{
                data: modeValues,
                backgroundColor: ["#36b9cc", "#f6c23e"]
            }]
        }
    });
}
