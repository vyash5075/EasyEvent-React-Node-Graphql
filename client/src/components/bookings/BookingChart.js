import React from 'react';
import { Bar as BarChart } from 'react-chartjs';

const BOOKINGS_BUCKETS = {
  Cheap: {
    min: 0,
    max: 100
  },
  Normal: {
    min: 100,
    max: 200
  },
  Expensive: {
    min: 200,
    max: 10000000
  }
};

const bookingsChart = props => {
  const chartData = { labels: [], datasets: [] };
  let values = [];
  for (const bucket in BOOKINGS_BUCKETS) {
    const filteredBookingsCount = props.bookings.reduce((prev, current) => {
      if (
        current.event.price > BOOKINGS_BUCKETS[bucket].min &&
        current.event.price < BOOKINGS_BUCKETS[bucket].max
      ) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);
    values.push(filteredBookingsCount);
    chartData.labels.push(bucket);
    chartData.datasets.push({
      // label: "My First dataset",
      fillColor: 'red',
      strokeColor: 'black',
      highlightFill: 'green',
      highlightStroke: 'blue',
      data: values
    });
    values = [...values];
    values[values.length - 1] = 0;
  }
var options={
    options: {
        legend: {
             labels: {
                  fontColor: 'orange'
                 }
              },
        title: {
            display: true,
            fontColor: 'blue',
            text: 'Custom Chart Title'
        }     ,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true,
                    fontColor: 'red'
                },
            }],
          xAxes: [{
                ticks: {
                    fontColor: 'green'
                },
            }]
        } 

    }
 };

  return (
    <div style={{ textAlign: 'center',height:'200px'}}>
      <BarChart options={options}
     color={'green'}
      width={900}
      height={550}
      options={{ maintainAspectRatio: false }}
      
      data={chartData} />
    </div>
  );
};

export default bookingsChart;