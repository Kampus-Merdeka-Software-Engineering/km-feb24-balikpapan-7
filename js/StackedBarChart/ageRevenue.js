let chart;

const create = async () => {
  const data = await fetchJson();

  const ctx = document.getElementById("age-revenue").getContext("2d");
  const chartData = {
    labels: [
      "Adults (35-64)",
      "Seniors (64+)",
      "Young Adults (25-34)",
      "Youth (<25)",
    ],
    datasets: [],
  };

  // Loop through each label and add data to datasets array
  Object.keys(data.Product_Category).forEach((category) => {
    Object.keys(data.Product_Category[category]).forEach((product) => {
      const productData = data.Product_Category[category][product];
      const dataset = {
        label: product,
        data: [
          productData["Adults (35-64)"],
          productData["Seniors (64+)"],
          productData["Young Adults (25-34)"],
          productData["Youth (<25)"],
        ],
        backgroundColor: getColor(product),
      };
      chartData.datasets.push(dataset);
    });
  });

  // Sort datasets based on total revenue
  chartData.datasets.sort((a, b) => {
    const totalA = a.data.reduce((acc, val) => acc + val, 0);
    const totalB = b.data.reduce((acc, val) => acc + val, 0);
    return totalB - totalA; // Sort in descending order
  });

  chart = new Chart(ctx, {
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
          text: "Top Selling Products by Age Group (Revenue)",
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

// Function to get color based on age group label
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
const fetchJson = async () => {
  try {
    const res = await fetch("./Dataset/StackedBarChart/TopSellingByAge.json");
    const data = await res.json();
    return data;
  } catch (err) {
    throw new Error("Error fetching data: " + err);
  }
};

create();
