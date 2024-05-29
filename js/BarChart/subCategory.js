let selectedYearSubCategory = "";
let isSortSubCategory = false;
let chartSubCategory;

const createSubCategory = async () => {
  const data = await fetchSubCategoryJson();
  // Check if chart exists and destroy it
  if (chartSubCategory) chartSubCategory.destroy();

  const ctx = document.getElementById("sub-category").getContext("2d");
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const labels = [];
  const values = [];

  let yearToUse = selectedYearSubCategory;
  if (!yearToUse) {
    yearToUse = "2016";
  }

  // Get all checked from multiSelect
  const checkedCheckboxes = Array.from(
    document.querySelectorAll(
      "#categoryCheckboxes input[type='checkbox']:checked"
    )
  ).map((checkbox) => checkbox.value);

  for (const productCategory in data) {
    for (const subCategory in data[productCategory]) {
      if (
        subCategory !== "Grand Total" &&
        checkedCheckboxes.includes(subCategory)
      ) {
        const subCategoryValue = data[productCategory][subCategory][yearToUse];
        if (subCategoryValue !== 0 && subCategoryValue !== undefined) {
          labels.push(subCategory);
          values.push(subCategoryValue);
        }
      }
    }
  }

  // sort data if isSort is true
  if (isSortSubCategory) {
    labels.sort((a, b) => {
      const valueA = values[labels.indexOf(a)];
      const valueB = values[labels.indexOf(b)];
      return valueB - valueA;
    });
    values.sort((a, b) => b - a);
  }

  chartSubCategory = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Top Selling Product By Categories",
          data: values,
          backgroundColor: "rgb(41, 183, 228)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            color: "rgb(30, 27, 31)",
          },
        },
        y: {
          ticks: {
            color: "rgb(30, 27, 31)",
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "rgb(30, 27, 31)",
          },
        },
      },
    },
  });
};

// Fetch dataset data
const fetchSubCategoryJson = async () => {
  try {
    const res = await fetch("./Dataset/BarChart/TopSellingByCategory.json");
    const data = await res.json();
    return data;
  } catch (err) {
    throw new Error("Error fetching sub-category data: " + err);
  }
};
