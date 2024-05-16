document.addEventListener("DOMContentLoaded", () => {
  generateSubCategoryChart();
  generateCountryChart();
  generateCategoryRevenue();
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

    generateYChart(
      labels,
      values,
      "Top Selling Products by Sub-Category",
      "sub-category"
    );
  } catch (error) {
    alert("Error: " + error);
  }
};

const generateCountryChart = async () => {
  try {
    const data = await fetchJson();

    const aggregatedData = data.reduce((acc, curr) => {
      const country = curr.Country;
      const orderQuantity = parseFloat(curr.Order_Quantity);

      if (!acc[country] || orderQuantity > acc[country]) {
        acc[country] = orderQuantity;
      }

      return acc;
    }, {});

    const dataArray = Object.entries(aggregatedData);
    dataArray.sort((a, b) => b[1] - a[1]);

    const labels = dataArray.map((item) => item[0]);
    const values = dataArray.map((item) => item[1]);

    generateYChart(
      labels,
      values,
      "Top Selling Products by Country",
      "country"
    );
  } catch (error) {
    alert("Error: " + error);
  }
};

const generateCategoryRevenue = async () => {
  try {
    const data = await fetchJson();

    const aggregatedData = data.reduce((acc, curr) => {
      const country = curr.Product_Category;
      const orderQuantity = parseFloat(curr.Revenue);

      if (!acc[country] || orderQuantity > acc[country]) {
        acc[country] = orderQuantity;
      }

      return acc;
    }, {});

    const dataArray = Object.entries(aggregatedData);
    dataArray.sort((a, b) => b[1] - a[1]);

    const labels = dataArray.map((item) => item[0]);
    const values = dataArray.map((item) => item[1]);
    console.log(labels);
    generatePieChart(
      labels,
      values,
      "Top Selling Products by Categories (Revenue)",
      "Category"
    );
  } catch (error) {
    alert("Error: " + error);
  }
}

const generateYChart = (labels, values, placeholder, chartId) => {
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

const generatePieChart = (labels, values, placeholder, chartId) => {
  new Chart(chartId, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [{
        backgroundColor: "rgb(217, 217, 217)",
        data: values
      }]
    },
    options: {
      title: {
        display: true,
        text: placeholder
      }
    }
  });
};