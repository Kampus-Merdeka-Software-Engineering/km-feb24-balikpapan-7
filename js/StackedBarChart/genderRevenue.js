let genderRevenueChart;

const createGenderChart = async () => {
  const data = await fetchAgeJson();

  // Initialize objects to accumulate revenue by gender and subcategory
  const genderRevenue = {
    MALE: {},
    FEMALE: {},
  };

  // Function to traverse and accumulate revenue data
  const accumulateRevenue = (categoryData) => {
    for (const subCategory in categoryData.Sub_Category) {
      const subCategoryData = categoryData.Sub_Category[subCategory];
      genderRevenue["FEMALE"][subCategory] =
        (genderRevenue["FEMALE"][subCategory] || 0) + subCategoryData.F;
      genderRevenue["MALE"][subCategory] =
        (genderRevenue["MALE"][subCategory] || 0) + subCategoryData.M;
    }
  };

  // Traverse each category
  for (const category in data.Product_Category) {
    const categoryData = data.Product_Category[category];
    accumulateRevenue(categoryData);
  }

  // Prepare data for the chart
  const labels = Object.keys(genderRevenue["FEMALE"]);
  const femaleValues = labels.map((label) => genderRevenue["FEMALE"][label]);
  const maleValues = labels.map((label) => genderRevenue["MALE"][label]);

  // Combine labels and values for sorting
  const combinedData = labels.map((label, index) => ({
    label,
    femaleValue: femaleValues[index],
    maleValue: maleValues[index],
  }));

  // Sort the combined data based on the total value (femaleValue + maleValue)
  combinedData.sort((a, b) =>
    a.femaleValue + a.maleValue > b.femaleValue + b.maleValue ? -1 : 1
  );

  // Reassign sorted labels and values
  const sortedLabels = combinedData.map((item) => item.label);
  const sortedFemaleValues = combinedData.map((item) => item.femaleValue);
  const sortedMaleValues = combinedData.map((item) => item.maleValue);

  const ctx = document.getElementById("gender-revenue").getContext("2d");
  const chartData = {
    labels: ["FEMALE", "MALE"],
    datasets: sortedLabels.map((label, index) => ({
      label: label,
      data: [sortedFemaleValues[index], sortedMaleValues[index]],
      backgroundColor: getColor(label),
    })),
  };

  genderRevenueChart = new Chart(ctx, {
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
          text: "Top Selling Products by Gender (Revenue)",
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
const fetchAgeJson = async () => {
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


