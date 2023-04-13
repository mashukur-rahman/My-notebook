async function logJSONData() {
  const response = await fetch("/fetch");
  const jsonData = await response.json();
  const myArray=JSON.parse(jsonData)
  const ctx = document.getElementById('barChart');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow'],
      datasets: [{
        label: '# of Votes',
        data: myArray,
        borderWidth: 1
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
  