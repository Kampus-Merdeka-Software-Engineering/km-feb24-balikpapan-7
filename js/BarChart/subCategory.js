let selectedYearSubCategory = "";
let isSortSubCategory = false;
let chartSubCategory;

document.addEventListener("DOMContentLoaded", () => {
  const selectYearSubCategory = document.getElementById("sub-category-chart");
  const sortCheckboxSubCategory = document.getElementById("sort-sub-category");
  const selectYearCountry = document.getElementById("country-chart");
  const sortCheckboxCountry = document.getElementById("sort-country");

  createSubCategory();
  createCountry();

  selectYearSubCategory.addEventListener("change", (event) => {
    selectedYearSubCategory = event.target.value;
    createSubCategory();
  });

  sortCheckboxSubCategory.addEventListener("change", (event) => {
    isSortSubCategory = event.target.checked;
    createSubCategory();
  });

  selectYearCountry.addEventListener("change", (event) => {
    selectedYearCountry = event.target.value;
    createCountry();
  });

  sortCheckboxCountry.addEventListener("change", (event) => {
    isSortCountry = event.target.checked;
    createCountry();
  });
});

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

  // To show default value
  for (const productCategory in data) {
    for (const subCategory in data[productCategory]) {
      if (subCategory !== "Grand Total") {
        const subCategoryValue = data[productCategory][subCategory][yearToUse];
        if (subCategoryValue !== 0 && subCategoryValue !== undefined) {
          labels.push(subCategory);
          values.push(subCategoryValue);
        }
      }
    }
  }

  // To Check if Sorting is Needed
  if (isSortSubCategory) {
    labels.sort(
      (a, b) => values[labels.indexOf(b)] - values[labels.indexOf(a)]
    );
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
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y",
      scales: {
        x: {
          beginAtZero: true,
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
