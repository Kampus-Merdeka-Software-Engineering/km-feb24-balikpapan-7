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

    const dataArray = Object.entries(aggregatedData);
    dataArray.sort((a, b) => b[1] - a[1]);

    const labels = dataArray.map((item) => item[0]);
    const values = dataArray.map((item) => item[1]);

    generateChart(
      labels,
      values,
      "Top Selling Products by Sub-Category",
      "sub-category"
    );
  } catch (error) {
    alert("Error: " + error);
  }
};

const generateChart = (labels, values, placeholder, chartId) => {
  const ctx = document.getElementById(chartId).getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: placeholder,
          data: values,
          borderWidth: 1,
          backgroundColor: "rgb(217, 217, 217)",
          borderColor: "white",
        },
      ],
    },
    options: {
      indexAxis: "y",
    },
  });
};
