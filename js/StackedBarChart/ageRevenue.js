let ageRevenueChart;

const createAgeStackedChart = async () => {
  const data = await ageFetch();

  const ctx = document.getElementById("age-revenue").getContext("2d");
  const chartData = {
    labels: [
      "Adults (35-64)",
      "Seniors (64+)",
      "Young Adults (25-34)",
      "Youth (<25)",
    ],
    datasets: [],
  };

  // Loop through each label and add data to datasets array
  Object.keys(data.Product_Category).forEach((category) => {
    Object.keys(data.Product_Category[category]).forEach((product) => {
      const productData = data.Product_Category[category][product];
      const dataset = {
        label: product,
        data: [
          productData["Adults (35-64)"],
          productData["Seniors (64+)"],
          productData["Young Adults (25-34)"],
          productData["Youth (<25)"],
        ],
        backgroundColor: getColor(product),
      };
      chartData.datasets.push(dataset);
    });
  });

  // Sort datasets based on total revenue
  chartData.datasets.sort((a, b) => {
    const totalA = a.data.reduce((acc, val) => acc + val, 0);
    const totalB = b.data.reduce((acc, val) => acc + val, 0);
    return totalB - totalA; // Sort in descending order
  });

  ageRevenueChart = new Chart(ctx, {
    type: "bar",
    data: chartData,
    options: {
      indexAxis: "y",
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Top Selling Products by Age Group (Revenue)",
        },
      },
      scales: {
        x: {
          stacked: true,
          grid: {
            borderDash: [5, 5],
          },
        },
        y: {
          stacked: true,
          ticks: {
            color: "black",
          },
          grid: {
            borderDash: [5, 5],
          },
        },
      },
    },
  });
};

// Fetch dataset data
const ageFetch = async () => {
  try {
    const res = await fetch("./Dataset/StackedBarChart/TopSellingByAge.json");
    const data = await res.json();
    return data;
  } catch (err) {
    throw new Error("Error fetching data: " + err);
  }
};

createAgeStackedChart();
