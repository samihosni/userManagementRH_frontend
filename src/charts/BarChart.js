import React, { useRef, useEffect, useState } from 'react';
import * as echarts from 'echarts';
import apiService from '../services/apiService';


const BarChart = () => {
    const chartRef = useRef(null);  
    const [chartData, setChartData] = useState({ names: [], scores: [] }); 
  
    const getColor = (score) => {
        // SI(C3>=19; "Excellent"; SI(C3>=17; "Good"; SI(C3>=14; "Average"; "Weak")))
        if (score>=19)  {
            return  '#5470c6';
        } else if (score>=17)  {
            return  '#91cc75';
        } else if (score>=14)  {
            return  '#fac858';
        }else{
            return '#ee6666';
        }
        
    };
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await apiService.get('evaluation/all'); 
            if (response.data && Array.isArray(response.data)) {
                const employeeNames = response.data.map(item => item.user.firstname); 
                const employeeScores = response.data.map(item => ({
                    value: item.score,
                    itemStyle: {
                    color: getColor(item.score)
                    }

                    // '#5470c6'
                    // '#91cc75'
                    // '#fac858'
                    // '#ee6666'
                }));
                                
                setChartData({
                    names: employeeNames,
                    scores: employeeScores
                });
            } else {
              console.error('Unexpected response format');
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
    }, []);

      
    useEffect(() => {
        // Initialize the chart
        const chartInstance = echarts.init(chartRef.current);

        // Chart options
        const option = {
            title: {
                text: '',
                left: 'center',
                top: '5%'
            },
            grid:{
                top: '8%',
                left: '5%',
                bottom: '15%'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c}', // Show name and score
            },
            xAxis: {
                type: 'category',
                data: chartData.names, // Names of employees
                axisLabel: {
                    rotate: 45, // Rotate labels for better visibility
                },
            },
            yAxis: {
                type: 'value',
                name: '',
                min: 0,
                max: 20,
            },
            series: [
            {
                name: 'Score',
                type: 'bar',
                data: chartData.scores, // Scores of the employees
                label: {
                    show: true
                },
                itemStyle: {
                    color: '#4caf50', // Customize the bar color
                },
            },
            ],
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
            style={{ width: '100%', height: '400px' }} // Set the size of the chart
        ></div>
    );

  

}


export default BarChart;