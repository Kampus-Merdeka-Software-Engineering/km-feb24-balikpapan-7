let ageRevenueChart;

// Function to create and update the chart
const createAgeStackedChart = async () => {
  const data = await ageFetch();

  const ctx = document.getElementById("age-revenue").getContext("2d");

  // Get the checked checkboxes
  const checkedCheckboxes = Array.from(
    document.querySelectorAll("#ageCheckboxes input[type='checkbox']:checked")
  ).map((checkbox) => checkbox.value);

  // Initialize the chartData by checkedCheckbox
  const chartData = {
    labels: checkedCheckboxes,
    datasets: [],
  };

  // Loop through each label and add data to array
  Object.keys(data.Product_Category).forEach((category) => {
    Object.keys(data.Product_Category[category]).forEach((product) => {
      const productData = data.Product_Category[category][product];
      const temp = [];

      checkedCheckboxes.forEach((ageGroup) => {
        temp.push(productData[ageGroup]);
      });

      const dataset = {
        label: product,
        data: temp,
        backgroundColor: getColor(product),
      };
      chartData.datasets.push(dataset);
    });
  });

  // Sort dataset in descending order
  chartData.datasets.sort((a, b) => {
    const totalA = a.data.reduce((acc, val) => acc + val, 0);
    const totalB = b.data.reduce((acc, val) => acc + val, 0);
    return totalB - totalA;
  });

  // Destroy the previous chart if it exists
  if (ageRevenueChart) ageRevenueChart.destroy();

  // Create a new chart
  ageRevenueChart = new Chart(ctx, {
    type: "bar",
    data: chartData,
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            font: {
              size: 10,
            },
            padding: 10,
          },
        },
        tooltip: {
          bodyFont: {
            size: 12,
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          grid: {
            borderDash: [5, 5],
          },
          ticks: {
            font: {
              size: 10,
            },
          },
        },
        y: {
          stacked: true,
          ticks: {
            color: "black",
            font: {
              size: 10,
            },
          },
          grid: {
            borderDash: [5, 5],
          },
        },
      },
      layout: {
        padding: {
          top: 10,
          bottom: 10,
          left: 10,
          right: 10,
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

// Add event listeners to each checkbox
document
  .querySelectorAll("#ageCheckboxes input[type='checkbox']")
  .forEach((checkbox) => {
    checkbox.addEventListener("change", createAgeStackedChart);
  });
createAgeStackedChart();
