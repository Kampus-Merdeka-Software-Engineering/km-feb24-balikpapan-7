document.addEventListener("DOMContentLoaded", () => {
  generateSubCategoryChart();
  generateCountryChart();
  generateCategoryRevenue();
  generateSubCategoryRevenue();
  generateGenderSubCategoryChart();
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

    generateYBarChart(
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

    generateYBarChart(
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
      const category = curr.Product_Category;
      const revenue = parseFloat(curr.Revenue);

      if (!acc[category] || revenue > acc[category]) {
        acc[category] = revenue;
      }

      return acc;
    }, {});

    const dataArray = Object.entries(aggregatedData);
    dataArray.sort((a, b) => b[1] - a[1]);

    const labels = dataArray.map((item) => item[0]);
    const values = dataArray.map((item) => item[1]);

    generatePieChart(
      labels,
      values,
      "Top Selling Products by Categories (Revenue)",
      "category"
    );
  } catch (error) {
    alert("Error: " + error);
  }
};

const generateSubCategoryRevenue = async () => {
  try {
    const data = await fetchJson();

    const aggregatedData = data.reduce((acc, curr) => {
      const category = curr.Sub_Category;
      const revenue = parseFloat(curr.Revenue);

      if (!acc[category] || revenue > acc[category]) {
        acc[category] = revenue;
      }

      return acc;
    }, {});

    const dataArray = Object.entries(aggregatedData);
    dataArray.sort((a, b) => b[1] - a[1]);

    const labels = dataArray.map((item) => item[0]);
    const values = dataArray.map((item) => item[1]);

    generatePieChart(
      labels,
      values,
      "Top Selling Products by Sub-Categories (Revenue)",
      "sub-category-revenue"
    );
  } catch (error) {
    alert("Error: " + error);
  }
};

const generateGenderSubCategoryChart = async () => {
  try {
    const data = await fetchJson();

    const aggregatedData = data.reduce((acc, curr) => {
      const gender = curr.Customer_Gender;
      const category = curr.Sub_Category;
      const revenue = parseFloat(curr.Revenue);

      if (!acc[category]) {
        acc[category] = { Male: 0, Female: 0 };
      }

      if (gender === "Male") {
        acc[category].Male += revenue;
      } else if (gender === "Female") {
        acc[category].Female += revenue;
      }

      return acc;
    }, {});

    const categories = Object.keys(aggregatedData);

    const datasets = categories.map((category) => ({
      label: category,
      data: [aggregatedData[category].Male, aggregatedData[category].Female],
      backgroundColor: getColorForCategory(category),
      borderColor: "white",
      borderWidth: 1,
    }));

    const labels = ["Male", "Female"];

    generateStackedBarChart(
      labels,
      datasets,
      "Top Selling Products by Gender and Sub-Category (Revenue)",
      "sub-category-gender"
    );
  } catch (error) {
    alert("Error: " + error);
  }
};

const generateYBarChart = (labels, values, placeholder, chartId) => {
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
  const ctx = document.getElementById(chartId).getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
          data: values,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: placeholder,
        },
      },
    },
  });
};

const generateStackedBarChart = (labels, values, placeholder, chartId) => {
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
      plugins: {
        title: {
          display: true,
          text: "Chart.js Bar Chart - Stacked",
        },
      },
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    },
  });
};

const getColorForCategory = (category) => {
  const colors = {
    "Road Bikes": "#8B0000",
    "Mountain Bikes": "#800080",
    "Touring Bikes": "#DDA0DD",
    Helmets: "#00FFFF",
    "Tires and Tubes": "#FF4500",
    Jerseys: "#006400",
    Shorts: "#808080",
    "Bottles and Cages": "#FF6347",
    Fenders: "#DDA0DD",
    "Hydration Packs": "#FFD700",
  };
  return colors[category] || "#000000";
};
