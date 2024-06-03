let genderRevenueChart;

const createGenderChart = async () => {
  const data = await fetchGenderJson();

  const genderRevenue = {
    MALE: {},
    FEMALE: {},
  };

  // Categorize data for each gender
  const accumulateRevenue = (categoryData) => {
    for (const subCategory in categoryData.Sub_Category) {
      const subCategoryData = categoryData.Sub_Category[subCategory];
      genderRevenue["FEMALE"][subCategory] =
        (genderRevenue["FEMALE"][subCategory] || 0) + subCategoryData.F;
      genderRevenue["MALE"][subCategory] =
        (genderRevenue["MALE"][subCategory] || 0) + subCategoryData.M;
    }
  };
  for (const category in data.Product_Category) {
    const categoryData = data.Product_Category[category];
    accumulateRevenue(categoryData);
  }

  const labels = Object.keys(genderRevenue["FEMALE"]);
  const femaleValues = labels.map((label) => genderRevenue["FEMALE"][label]);
  const maleValues = labels.map((label) => genderRevenue["MALE"][label]);

  // Combine labels and values for sorting
  const combinedData = labels.map((label, index) => ({
    label,
    femaleValue: femaleValues[index],
    maleValue: maleValues[index],
  }));

  // Sort data from the highest to lowest
  combinedData.sort((a, b) =>
    a.femaleValue + a.maleValue > b.femaleValue + b.maleValue ? -1 : 1
  );

  // creating the chart
  const sortedLabels = combinedData.map((item) => item.label);
  const sortedFemaleValues = combinedData.map((item) => item.femaleValue);
  const sortedMaleValues = combinedData.map((item) => item.maleValue);

  const ctx = document.getElementById("gender-revenue").getContext("2d");

  const updateChart = () => {
    const checkedCheckboxes = Array.from(
      document.querySelectorAll(
        "#genderCheckboxes input[type='checkbox']:checked"
      )
    ).map((checkbox) => checkbox.value);

    const chartData = {
      labels: checkedCheckboxes,
      datasets: sortedLabels.map((label, index) => ({
        label: label,
        data: [sortedFemaleValues[index], sortedMaleValues[index]],
        backgroundColor: getColor(label),
      })),
    };

    // Destroy chart if already created
    if (genderRevenueChart) {
      genderRevenueChart.destroy();
    }

    genderRevenueChart = new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: {
        indexAxis: "y",
        responsive: true,
        plugins: {
          legend: {
            position: "top",
            color: "rgb(30, 27, 31)",
          },
          title: {
            display: true,
          },
        },
        scales: {
          x: {
            stacked: true,
            grid: {
              borderDash: [5, 5],
            },
            ticks: {
              color: "rgb(30, 27, 31)",
            },
          },
          y: {
            stacked: true,
            ticks: {
              color: "rgb(30, 27, 31)",
            },
            grid: {
              borderDash: [5, 5],
            },
          },
        },
      },
    });
  };

  updateChart();

  document
    .querySelectorAll('#genderCheckboxes input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.addEventListener("change", updateChart);
    });
};

// Fetch dataset data
const fetchGenderJson = async () => {
  try {
    const res = await fetch(
      "./Dataset/StackedBarChart/TopSellingByGender.json"
    );
    const data = await res.json();
    return data;
  } catch (err) {
    throw new Error("Error fetching data: " + err);
  }
};
