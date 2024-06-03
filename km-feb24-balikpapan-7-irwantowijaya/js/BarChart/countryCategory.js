let countryChart;
let isSortCountry = false;
let selectedYearCountry = "";

const createCountry = async () => {
  const fetch = await fetchCountryJson();

  // Check if chart exists and destroy it
  if (countryChart) countryChart.destroy();

  const ctx = document.getElementById("country").getContext("2d");
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const set = new Set();
  const labels = [];
  const values = [];
  const data = fetch;

  // Filter data based on selected year or range of years
  const filteredData = selectedYearCountry
    ? filterDataByYear(data, selectedYearCountry)
    : data;

  // Filter data based on Multiselect checkbox
  const selectedCountries = Array.from(
    document.querySelectorAll("#countriesCheckboxes input:checked")
  ).map((input) => input.value);
  const filteredDataByCountries = {};
  for (const year in filteredData) {
    filteredDataByCountries[year] = {};
    for (const country of selectedCountries) {
      if (filteredData[year][country]) {
        filteredDataByCountries[year][country] = filteredData[year][country];
      }
    }
  }

  for (year in filteredDataByCountries) {
    for (country in filteredDataByCountries[year]) {
      if (country !== "Total") {
        if (!set.has(country)) {
          set.add(country);
        }
      }
    }
  }

  const array = [...set];
  const slicedArray = array.slice(0, 6);
  labels.push(...slicedArray);

  for (let i = 0; i < slicedArray.length; i++) {
    let country = slicedArray[i];
    let totalRevenue = 0;
    for (year in filteredDataByCountries) {
      if (
        filteredDataByCountries[year][country] &&
        filteredDataByCountries[year][country]["Grand Total"]
      ) {
        totalRevenue +=
          filteredDataByCountries[year][country]["Grand Total"]["Revenue"];
      }
    }
    values.push(totalRevenue);
  }

  // Sort if the isSort  is true
  if (isSortCountry) {
    labels.sort(
      (a, b) => values[labels.indexOf(b)] - values[labels.indexOf(a)]
    );
    values.sort((a, b) => b - a);
  }

  countryChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Top Selling Product By Countries",
          backgroundColor: "rgb(41, 183, 228)",
          data: values,
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

// Filter the value based on inputted year
const filterDataByYear = (data, year) => {
  const filteredData = {};
  const selectedYearCountry = parseInt(year);
  for (const key in data) {
    const currentYear = parseInt(key);
    if (currentYear <= selectedYearCountry) {
      filteredData[key] = data[key];
    }
  }
  return filteredData;
};

// Fetch dataset data
const fetchCountryJson = async () => {
  try {
    const res = await fetch("./Dataset/BarChart/TopSellingByCountry.json");
    const data = await res.json();

    return data;
  } catch (err) {
    throw new Error("Error fetching data: " + err);
  }
};
