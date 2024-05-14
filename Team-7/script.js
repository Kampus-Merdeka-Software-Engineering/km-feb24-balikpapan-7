document.addEventListener("DOMContentLoaded", () => {
  generateSubCategoryChart();
});

const fetchJson = async () => {
  try {
    const res = await fetch("./Dataset/bike_sales.json");
    const data = await res.json();

    return data;
  } catch (err) {
    throw new Error("Error fetching data: " + err);
  }
};

const generateSubCategoryChart = async () => {
  try {
    const data = await fetchJson();

    const aggregatedData = data.reduce((acc, curr) => {
      const subCategory = curr.Sub_Category;
      const orderQuantity = parseFloat(curr.Order_Quantity);

      if (!acc[subCategory] || orderQuantity > acc[subCategory]) {
        acc[subCategory] = orderQuantity;
      }

      return acc;
    }, {});

    const labels = Object.keys(aggregatedData);
    console.log(labels);
    const values = Object.values(aggregatedData);
    console.log(values);

    generateChart(labels, values, "Top Selling Products by Sub-Category");
  } catch (error) {
    alert("Error: " + error.message);
    console.error("Error generating chart: ", error);
  }
};

const generateChart = (labels, values, placeholder) => {
  const ctx = document.getElementById("myChart").getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: placeholder,
          data: values,
          borderWidth: 1,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};
