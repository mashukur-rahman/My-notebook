async function logJSONData() {
  const response = await fetch("/fetch");
  const jsonData = await response.json();
  const myArray=JSON.parse(jsonData)
  const ctx = document.getElementById('barChart');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['First', 'Second', 'Third'],
      datasets: [{
        label: 'Views of top 3 posts',
        data: myArray,
        borderWidth: 0,
        backgroundColor:"#159895",
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

}
logJSONData()
  