import React, { useRef, useEffect, useState } from 'react';
import * as echarts from 'echarts';
import apiService from '../services/apiService';

const PieChart = () => {
  const chartRef = useRef(null); 
  const [chartData, setChartData] = useState([]); 

  const getPerformanceClass = (performance) => {
    switch (performance) {
      case "Excellent":
        return '#5470c6';
      case "Good":
        return '#91cc75';
      case "Average":
        return '#fac858';
      case "Weak":
        return '#ee6666';
      default:
        return {};
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = [];
        const response = await apiService.get('evaluation/all'); 
        console.log(response);
        if (response.data && Array.isArray(response.data)) {
          const feedbackCounts = response.data.reduce((totals, item) => {
            
            const feedback  = item.feedback;
            if (feedback) {
              totals[feedback] = (totals[feedback] || 0) + 1; // Increment the count for the feedback type
            }
            return totals;
          }, {});

          // Transform to the desired format: [{ name: 'Good', value: number }, ...]
          const formattedData = Object.entries(feedbackCounts).map(([name, value]) => ({
            name,
            value,
            itemStyle:{color:getPerformanceClass(name) }
          }));
          console.log(formattedData);
          
          setChartData(formattedData);
        } else {
          console.error('Unexpected response format');
        }

      } catch (error) {
        console.error('Error fetching pie chart data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Initialize the chart
    const chartInstance = echarts.init(chartRef.current);

    // Option object for configuring the chart
    const option = {
      title: {
        text: '',
        subtext: '',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        show: false,
        orient: 'vertical',
        left: 'left',
        data: []
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: '50%',
          center: ['50%', '40%'],
          data: chartData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    // Set the options on the chart instance
    chartInstance.setOption(option);

    // Resize chart when window is resized
    window.addEventListener('resize', () => {
      chartInstance.resize();
    });

    // Clean up on component unmount
    return () => {
      chartInstance.dispose();
    };
  }, [chartData]);

  return (
    <div
      ref={chartRef}
      style={{ width: '100%', height: '100%' }}
    ></div>
  );
};

export default PieChart;