document.addEventListener("DOMContentLoaded", () => {
  const selectYearSubCategory = document.getElementById("sub-category-chart");
  const sortCheckboxSubCategory = document.getElementById("sort-sub-category");
  const selectYearCountry = document.getElementById("country-chart");
  const sortCheckboxCountry = document.getElementById("sort-country");

  createSubCategory();
  createCountry();
  createCategoryPieChart();
  createGenderChart();
  createAgeStackedChart();

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

// Function to get color based on for stackBar Chart
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
