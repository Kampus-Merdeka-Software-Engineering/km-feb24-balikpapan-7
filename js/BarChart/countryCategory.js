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

  for (year in filteredData) {
    for (country in filteredData[year]) {
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
    for (year in filteredData) {
      if (
        filteredData[year][country] &&
        filteredData[year][country]["Grand Total"]
      ) {
        totalRevenue += filteredData[year][country]["Grand Total"]["Revenue"];
      }
    }
    values.push(totalRevenue);
  }

  // To Check if Sorting is Needed
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
