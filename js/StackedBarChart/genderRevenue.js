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

// Function to get color based on subcategory label
const getColor = (label) => {
  const colors = {
    "Road Bikes": "rgb(101, 20, 20)",
    "Mountain Bikes": "rgb(142, 13, 121)",
    "Touring Bikes": "rgb(204, 138, 138)",
    Helmets: "rgb(43, 190, 237)",
    "Tires and Tubes": "rgb(183, 28, 28)",
    Jerseys: "rgb(35, 97, 59)",
    Shorts: "rgba(169,169,169, 0.8)",
    "Bottles and Cages": "rgb(244, 67, 54)",
    Fenders: "rgb(181, 148, 178)",
    "Hydration Packs": "rgb(233, 183, 7)",
    Caps: "rgb(201, 87, 6)",
    Gloves: "rgb(120, 89, 67)",
    Cleaners: "rgb(103, 194, 106)",
    Shorts: "rgb(96, 76, 199)",
    Socks: "rgb(182, 41, 207)",
    Vests: "rgb(217, 17, 164)",
    "Bike Racks": "rgb(157, 10, 255)",
    "Bike Stands": "rgb(119, 80, 145)",
  };
  return colors[label];
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

createGenderChart();
