let categoryRevenueChart;

const createCategoryPieChart = async () => {
  const data = await fetchPieChartData();

  const ctx = document.getElementById("category-revenue").getContext("2d");
  const labels = [];
  const values = [];

  const productCategories = data.Product_Category;
  for (const category in productCategories) {
    for (const subCategory in productCategories[category].Sub_Category) {
      labels.push(subCategory);
      values.push(
        parseFloat(
          productCategories[category].Sub_Category[subCategory][
            "Sum of Revenue2"
          ]
        )
      );
    }
  }

  categoryRevenueChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Top Selling Product By Categories (Revenue)",
          data: values,
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: "black",
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

// Fetch dataset data
const fetchPieChartData = async () => {
  try {
    const res = await fetch(
      "./Dataset/PieChart/TopSellingByCategoryRevenue.json"
    );
    const data = await res.json();
    return data;
  } catch (err) {
    throw new Error("Error fetching data: " + err);
  }
};

createCategoryPieChart();
