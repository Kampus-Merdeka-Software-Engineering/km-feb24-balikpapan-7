document.addEventListener("DOMContentLoaded", () => {
  // generateSubCategoryChart();
  // generateCountryChart();
  // generateCategoryRevenue();
  genderSubCategory();
  ageSubCategory();
});

const fetchJson = async () => {
  try {
    const res = await fetch("./Dataset/bike_sales.json");
    const data = await res.json();

    return data;
  } catch (err) {
    throw new Error("Error fetching data: " + err);
  }
};

const generateSubCategoryChart = async () => {
  try {
    const data = await fetchJson();

    const aggregatedData = data.reduce((acc, curr) => {
      const subCategory = curr.Sub_Category;
      const orderQuantity = parseFloat(curr.Order_Quantity);

      if (!acc[subCategory] || orderQuantity > acc[subCategory]) {
        acc[subCategory] = orderQuantity;
      }

      return acc;
    }, {});

    const dataArray = Object.entries(aggregatedData);
    dataArray.sort((a, b) => b[1] - a[1]);

    const labels = dataArray.map((item) => item[0]);
    const values = dataArray.map((item) => item[1]);

    generateYChart(
      labels,
      values,
      "Top Selling Products by Sub-Category",
      "sub-category"
    );
  } catch (error) {
    alert("Error: " + error);
  }
};

const generateCountryChart = async () => {
  try {
    const data = await fetchJson();

    const aggregatedData = data.reduce((acc, curr) => {
      const country = curr.Country;
      const orderQuantity = parseFloat(curr.Order_Quantity);

      if (!acc[country] || orderQuantity > acc[country]) {
        acc[country] = orderQuantity;
      }

      return acc;
    }, {});

    const dataArray = Object.entries(aggregatedData);
    dataArray.sort((a, b) => b[1] - a[1]);

    const labels = dataArray.map((item) => item[0]);
    const values = dataArray.map((item) => item[1]);

    generateYChart(
      labels,
      values,
      "Top Selling Products by Country",
      "country"
    );
  } catch (error) {
    alert("Error: " + error);
  }
};


const generateYChart = (labels, values, placeholder, chartId) => {
  const ctx = document.getElementById(chartId).getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: placeholder,
          data: values,
          borderWidth: 1,
          backgroundColor: "rgb(217, 217, 217)",
          borderColor: "white",
        },
      ],
    },
    options: {
      indexAxis: "y",
    },
  });
};

const genderSubCategory = async () => {
  const data = await fetchJson(); 

  const counts = {
    'MALE': {},
    'FEMALE': {}
  };

  data.forEach(entry => {
    const gender = entry.Customer_Gender === 'M' ? 'MALE' : 'FEMALE';
    const subCategory = entry.Sub_Category;

    if (!counts[gender][subCategory]) {
      counts[gender][subCategory] = 0;
    }
    counts[gender][subCategory]++;
  });

  const subCategories = [...new Set(data.map(entry => entry.Sub_Category))];

  const totalCounts = subCategories.map(subCategory => ({
    subCategory: subCategory,
    totalCount: (counts['MALE'][subCategory] || 0) + (counts['FEMALE'][subCategory] || 0)
  }));
  totalCounts.sort((a, b) => b.totalCount - a.totalCount);


  const sortedSubCategories = totalCounts.map(item => item.subCategory);

  const datasets = sortedSubCategories.map(subCategory => ({
    label: subCategory,
    data: [
      counts['MALE'][subCategory] || 0,
      counts['FEMALE'][subCategory] || 0
    ],
    backgroundColor: getColorForSubCategory(subCategory)
  }));

  const chartData = {
    labels: ['MALE', 'FEMALE'],
    datasets: datasets
  };

  const ctx = document.getElementById('sub-category-gender').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Top Selling Product By Gender'
        }
      },
      responsive: true,
      indexAxis: 'y',
      scales: {
        x: {
          stacked: true,
          grid: {
            color: 'white', 
            lineWidth: 1,
            borderDash: [5, 5] 
          }
        },
        y: {
          stacked: true,
          grid: {
            color: 'white', 
            lineWidth: 1,
            borderDash: [5, 5] 
          }
        }
      }
    }
  });
};

const getColorForSubCategory = (subCategory) => {
  const colors = {
    'Road Bikes': '#660000', 
    'Mountain Bikes': '#800080', 
    'Touring Bikes': '#E8C1A0',
    'Helmets': '#4C6EF5',
    'Tires and Tubes': '#DC143C',
    'Jerseys': '#303030',
    'Shorts': '#FF4500', 
    'Bottles and Cages': '#3F84E5',
    'Fenders': '#4B5320',
    'Hydration Packs': '#FFC100',
    'Caps': '#000080',
    'Gloves':'#FF00FF',
    'Cleaners': '#00FF00',
    'Socks': '#FFFF00',
    'Vests': '#FFA500',
    'Bike Racks':'#800000',
    'Bike Stands': '#00ffe1'
  };

  return colors[subCategory];
};

//Top selling product by group age
const ageSubCategory = async () => {
  const data = await fetchJson(); 

  const counts = {
    'Adults (35-64)': {},
    'Young Adults (25-34)': {},
    'Youth (<25)': {},
    'Seniors (64+)': {},
  };

  data.forEach(entry => {
    const ageGroup = entry.Age_Group;
    const subCategory = entry.Sub_Category;

    if (!counts[ageGroup][subCategory]) {
      counts[ageGroup][subCategory] = 0;
    }
    counts[ageGroup][subCategory]++;
  });

  const subCategories = [...new Set(data.map(entry => entry.Sub_Category))];

  const totalCounts = subCategories.map(subCategory => {
    let total = 0;
    for (const ageGroup in counts) {
      total += (counts[ageGroup][subCategory] || 0);
    }
    return {
      subCategory: subCategory,
      totalCount: total
    };
  });

  totalCounts.sort((a, b) => b.totalCount - a.totalCount);

  const sortedSubCategories = totalCounts.map(item => item.subCategory);

  const datasets = sortedSubCategories.map(subCategory => ({
    label: subCategory,
    data: [
      counts['Adults (35-64)'][subCategory] || 0,
      counts['Young Adults (25-34)'][subCategory] || 0,
      counts['Youth (<25)'][subCategory] || 0,
      counts['Seniors (64+)'][subCategory] || 0
    ],
    backgroundColor: getColorForSubCategory(subCategory)
  }));

  const chartData = {
    labels: ['Adults (35-64)', 'Young Adults (25-34)', 'Youth (<25)', 'Seniors (64+)'],
    datasets: datasets
  };

  const ctx = document.getElementById('sub-category-age').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Top Selling Product By Age Group'
        }
      },
      responsive: true,
      indexAxis: 'y',
      scales: {
        x: {
          stacked: true,
          grid: {
            color: 'white', 
            lineWidth: 1,
            borderDash: [5, 5] 
          }
        },
        y: {
          stacked: true,
          grid: {
            color: 'white', 
            lineWidth: 1,
            borderDash: [5, 5] 
          }
        }
      }
    }
  });
};





