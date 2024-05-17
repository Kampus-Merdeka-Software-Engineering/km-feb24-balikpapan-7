document.addEventListener("DOMContentLoaded", async () => {
  const years = await getYearsFromData();
  populateYearDropdown(years);
  const yearSelect = document.getElementById("year-select");

  yearSelect.addEventListener("change", () => {
    const selectedYear = yearSelect.value;
    barChartByCountry(selectedYear);
    barChartBySubCategory(selectedYear);
    generateCategoryRevenue(selectedYear);
    genderSubCategory(selectedYear);
    ageSubCategory(selectedYear);
  });

  barChartByCountry("all");
  barChartBySubCategory("all");
  generateCategoryRevenue("all");
  genderSubCategory("all");
  ageSubCategory("all");
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

const getYearsFromData = async () => {
  const data = await fetchJson();
  const years = data
    .reduce((acc, item) => {
      if (!acc.includes(item.Year)) {
        acc.push(item.Year);
      }
      return acc;
    }, [])
    .sort((a, b) => a - b);
  return years;
};

const populateYearDropdown = (years) => {
  const yearSelect = document.getElementById("year-select");
  years.forEach((year) => {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  });
};

const barChartBySubCategory = async (year) => {
  try {
    const data = await fetchJson();

    const canvas = document.getElementById("bar-chart-sub-category");

    if (canvas.chart) {
      canvas.chart.destroy();
    }

    const filteredData =
      year === "all"
        ? data
        : data.filter((item) => item.Year.toString() === year);

    const aggregatedData = filteredData.reduce((acc, curr) => {
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

    const ctx = canvas.getContext("2d");
    canvas.chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Top Selling Products by Sub-Category",
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
  } catch (error) {
    alert("Error: " + error);
  }
};

const barChartByCountry = async (year) => {
  try {
    const data = await fetchJson();

    const canvas = document.getElementById("bar-chart-country");

    if (canvas.chart) {
      canvas.chart.destroy();
    }

    const filteredData =
      year === "all"
        ? data
        : data.filter((item) => item.Year.toString() === year);

    const aggregatedData = filteredData.reduce((acc, curr) => {
      const country = curr.Country;
      const orderQuantity = parseFloat(curr.Order_Quantity);

      if (!acc[country]) {
        acc[country] = 0;
      }
      acc[country] += orderQuantity;

      return acc;
    }, {});

    const dataArray = Object.entries(aggregatedData);
    dataArray.sort((a, b) => b[1] - a[1]);

    const labels = dataArray.map((item) => item[0]);
    const values = dataArray.map((item) => item[1]);

    const ctx = canvas.getContext("2d");
    canvas.chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Top Selling Products by Country",
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
  } catch (error) {
    alert("Error: " + error);
  }
};

const generateCategoryRevenue = async (selectedYear) => {
  try {
    const data = await fetchJson();

    const filteredData =
      selectedYear === "all"
        ? data
        : data.filter((item) => item.Year.toString() === selectedYear);

    const aggregatedData = filteredData.reduce((acc, curr) => {
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

    const chartId = "category-pie-chart";
    const existingChart = Chart.getChart(chartId);

    if (existingChart) {
      existingChart.destroy();
    }

    generatePieChart(
      labels,
      values,
      "Top Selling Products by Categories (Revenue)",
      chartId
    );
  } catch (error) {
    alert("Error: " + error);
  }
};

const generatePieChart = (labels, values, placeholder, chartId) => {
  const colors = [
    "#660000",
    "#800080",
    "#E8C1A0",
    "#4C6EF5",
    "#DC143C",
    "#303030",
    "#FF4500",
    "#3F84E5",
    "#4B5320",
    "#FFC100",
    "#000080",
    "#FF00FF",
    "#00FF00",
    "#FFFF00",
    "#FFA500",
    "#800000",
    "#00ffe1",
  ];

  const backgroundColors = labels.map(
    (_, index) => colors[index % colors.length]
  );

  new Chart(chartId, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          backgroundColor: backgroundColors,
          data: values,
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: placeholder,
        },
      },
    },
  });
};

const genderSubCategory = async (selectedYear) => {
  try {
    const data = await fetchJson();

    const filteredData =
      selectedYear === "all"
        ? data
        : data.filter((item) => item.Year.toString() === selectedYear);

    const counts = {
      MALE: {},
      FEMALE: {},
    };

    filteredData.forEach((entry) => {
      const gender = entry.Customer_Gender === "M" ? "MALE" : "FEMALE";
      const subCategory = entry.Sub_Category;

      if (!counts[gender][subCategory]) {
        counts[gender][subCategory] = 0;
      }
      counts[gender][subCategory]++;
    });

    const subCategories = [
      ...new Set(filteredData.map((entry) => entry.Sub_Category)),
    ];

    const totalCounts = subCategories.map((subCategory) => ({
      subCategory: subCategory,
      totalCount:
        (counts["MALE"][subCategory] || 0) +
        (counts["FEMALE"][subCategory] || 0),
    }));
    totalCounts.sort((a, b) => b.totalCount - a.totalCount);

    const sortedSubCategories = totalCounts.map((item) => item.subCategory);

    const datasets = sortedSubCategories.map((subCategory) => ({
      label: subCategory,
      data: [
        counts["MALE"][subCategory] || 0,
        counts["FEMALE"][subCategory] || 0,
      ],
      backgroundColor: getColorForSubCategory(subCategory),
    }));

    const chartData = {
      labels: ["MALE", "FEMALE"],
      datasets: datasets,
    };

    const chartId = "sub-category-gender";
    const existingChart = Chart.getChart(chartId);

    if (existingChart) {
      existingChart.destroy();
    }

    const ctx = document.getElementById(chartId).getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: {
        plugins: {
          title: {
            display: true,
            text: "Top Selling Product By Gender",
          },
        },
        responsive: true,
        indexAxis: "y",
        scales: {
          x: {
            stacked: true,
            grid: {
              color: "white",
              lineWidth: 1,
              borderDash: [5, 5],
            },
          },
          y: {
            stacked: true,
            grid: {
              color: "white",
              lineWidth: 1,
              borderDash: [5, 5],
            },
          },
        },
      },
    });
  } catch (error) {
    alert("Error: " + error);
  }
};

const getColorForSubCategory = (subCategory) => {
  const colors = {
    "Road Bikes": "#660000",
    "Mountain Bikes": "#800080",
    "Touring Bikes": "#E8C1A0",
    Helmets: "#4C6EF5",
    "Tires and Tubes": "#DC143C",
    Jerseys: "#303030",
    Shorts: "#FF4500",
    "Bottles and Cages": "#3F84E5",
    Fenders: "#4B5320",
    "Hydration Packs": "#FFC100",
    Caps: "#000080",
    Gloves: "#FF00FF",
    Cleaners: "#00FF00",
    Socks: "#FFFF00",
    Vests: "#FFA500",
    "Bike Racks": "#800000",
    "Bike Stands": "#00ffe1",
  };

  return colors[subCategory];
};

const ageSubCategory = async (year) => {
  try {
    const data = await fetchJson();

    const filteredData =
      year === "all"
        ? data
        : data.filter((item) => item.Year.toString() === year);

    const counts = {
      "Adults (35-64)": {},
      "Young Adults (25-34)": {},
      "Youth (<25)": {},
      "Seniors (64+)": {},
    };

    filteredData.forEach((entry) => {
      const ageGroup = entry.Age_Group;
      const subCategory = entry.Sub_Category;

      if (!counts[ageGroup][subCategory]) {
        counts[ageGroup][subCategory] = 0;
      }
      counts[ageGroup][subCategory]++;
    });

    const subCategories = [
      ...new Set(filteredData.map((entry) => entry.Sub_Category)),
    ];

    const totalCounts = subCategories.map((subCategory) => {
      let total = 0;
      for (const ageGroup in counts) {
        total += counts[ageGroup][subCategory] || 0;
      }
      return {
        subCategory: subCategory,
        totalCount: total,
      };
    });

    totalCounts.sort((a, b) => b.totalCount - a.totalCount);

    const sortedSubCategories = totalCounts.map((item) => item.subCategory);

    const datasets = sortedSubCategories.map((subCategory) => ({
      label: subCategory,
      data: [
        counts["Adults (35-64)"][subCategory] || 0,
        counts["Young Adults (25-34)"][subCategory] || 0,
        counts["Youth (<25)"][subCategory] || 0,
        counts["Seniors (64+)"][subCategory] || 0,
      ],
      backgroundColor: getColorForSubCategory(subCategory),
    }));

    const chartData = {
      labels: [
        "Adults (35-64)",
        "Young Adults (25-34)",
        "Youth (<25)",
        "Seniors (64+)",
      ],
      datasets: datasets,
    };

    const chartId = "sub-category-age";
    const existingChart = Chart.getChart(chartId);

    if (existingChart) {
      existingChart.destroy();
    }

    const ctx = document.getElementById(chartId).getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: {
        plugins: {
          title: {
            display: true,
            text: `Top Selling Product By Age Group (${
              year === "all" ? "Overall" : year
            })`,
          },
        },
        responsive: true,
        indexAxis: "y",
        scales: {
          x: {
            stacked: true,
            grid: {
              color: "white",
              lineWidth: 1,
              borderDash: [5, 5],
            },
          },
          y: {
            stacked: true,
            grid: {
              color: "white",
              lineWidth: 1,
              borderDash: [5, 5],
            },
          },
        },
      },
    });
  } catch (error) {
    alert("Error: " + error);
  }
};
