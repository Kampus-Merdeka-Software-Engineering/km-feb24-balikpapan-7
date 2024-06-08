document.addEventListener("DOMContentLoaded", async () => {
  const selectYearSubCategory = document.getElementById("sub-category-chart");
  const sortCheckboxSubCategory = document.getElementById("sort-sub-category");
  const selectYearCountry = document.getElementById("country-chart");
  const sortCheckboxCountry = document.getElementById("sort-country");

  createSubCategory();
  createCountry();
  createCategoryPieChart();
  createGenderChart();
  createAgeStackedChart();

  // Category Bar chart
  selectYearSubCategory.addEventListener("change", (event) => {
    selectedYearSubCategory = event.target.value;
    createSubCategory();
  });

  sortCheckboxSubCategory.addEventListener("change", (event) => {
    isSortSubCategory = event.target.checked;
    createSubCategory();
  });

  document
    .querySelectorAll("#categoryCheckboxes input[type='checkbox']")
    .forEach((checkbox) => {
      checkbox.addEventListener("change", createSubCategory);
    });

  const selectBoxCategory = document.querySelector(".selectBoxCategory");
  let categoryCheckboxes = document.getElementById("categoryCheckboxes");
  selectBoxCategory.addEventListener("click", () => {
    categoryCheckboxes.classList.toggle("displayerDropdownCheckbox");
  });

  // Country Bar chart
  selectYearCountry.addEventListener("change", (event) => {
    selectedYearCountry = event.target.value;
    createCountry();
  });

  sortCheckboxCountry.addEventListener("change", (event) => {
    isSortCountry = event.target.checked;
    createCountry();
  });

  document
    .getElementById("countriesCheckboxes")
    .addEventListener("change", () => {
      createCountry();
    });

  const selectBoxCountries = document.querySelector(".selectBoxCountries");
  let countriesCheckboxes = document.getElementById("countriesCheckboxes");
  selectBoxCountries.addEventListener("click", () => {
    countriesCheckboxes.classList.toggle("displayerDropdownCheckbox");
  });

  // Age Stacked Bar Chart
  const selectBoxAge = document.querySelector(".selectBoxAge");
  let ageCheckboxes = document.getElementById("ageCheckboxes");
  selectBoxAge.addEventListener("click", () => {
    ageCheckboxes.classList.toggle("displayerDropdownCheckbox");
  });

  // Gender Stacked Bar Chart
  const selectBoxGender = document.querySelector(".selectBoxGender");
  let genderCheckboxes = document.getElementById("genderCheckboxes");
  selectBoxGender.addEventListener("click", () => {
    genderCheckboxes.classList.toggle("displayerDropdownCheckbox");
  });

  // Insert dataTable
  try {
    const res = await fetch("./Dataset/Origin.json");
    const data = await res.json();

    // Destroy table if already inited
    if ($.fn.DataTable.isDataTable("#dataTable")) {
      $("#dataTable").DataTable().destroy();
    }

    $("#dataTable").DataTable({
      scrollX: true,
      data: data,
      searching: true,
      columns: [
        { data: "Date" },
        { data: "Customer_Age" },
        { data: "Customer_Gender" },
        { data: "Country" },
        { data: "Product_Category" },
        { data: "Sub_Category" },
        { data: "Product" },
        { data: "Order_Quantity" },
        { data: "Profit" },
        { data: "Cost" },
        { data: "Revenue" },
      ],
    });
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
});

$("#dataTable").DataTable();

// Function to set stackBar Chart color
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
