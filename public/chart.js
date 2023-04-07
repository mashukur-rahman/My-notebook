const ctx = document.getElementById('barChart');
var arr1=[]
async function logJSONData() {
  const response = await fetch("http://localhost:3000/fetch");
  const jsonData = await response.json();
  const myArray=JSON.parse(jsonData)
  for(var i=0; i<myArray.length; i++){
    arr1.push(myArray[i])
  }
  console.log(arr1)
}
logJSONData()
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow'],
      datasets: [{
        label: '# of Votes',
        data: arr1,
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