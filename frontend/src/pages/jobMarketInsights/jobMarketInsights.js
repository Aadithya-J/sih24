import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import './JobMarketInsights.css';  // Import the CSS for styling

const JobMarketInsights = () => {
  // Data for different sections

  // Industry YoY and MoM data (Bar Chart)
  const industryData = {
    labels: ["Healthcare & Pharmaceuticals", "Automotive", "Government & Defence", "Telecommunications", "BFSI", "Education", "Media & Entertainment", "Consumer Electronics", "Manufacturing", "Real Estate", "Construction & Engineering", "Energy", "Retail", "IT - Software & Services"],
    datasets: [
      {
        label: "Year over Year (YoY)",
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        data: [19, 18, 15, 14, 8, 10, 8, 45, 43, 32, 29, 23, 22, 21],
      },
      {
        label: "Month over Month (MoM)",
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        data: [2, 5, 0, -3, 0, 1, -7, 7, 1, 4, -1, -5, 0, -3],
      },
    ],
  };

  // Salary data for industries (Pie Chart)
  const salaryData = {
    labels: ["Banking", "BPO", "IT - Software & Services", "Construction & Engineering", "Education", "Automotive", "Telecommunications", "Advertising", "Travel & Tourism", "FMCG", "Retail", "Logistics & Transportation"],
    datasets: [
      {
        label: 'Salary (₹)',
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
          "#FF9F40", "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"
        ],
        data: [1894869, 2465000, 3572246, 1791559, 2188013, 3058528, 2310909, 3328125, 1649948, 2975452, 2956364, 2678646]
      }
    ]
  };

  // Function YoY and MoM data (Bar Chart)
  const functionData = {
    labels: ["Hospitality", "Marketing & Communications", "Medical Roles", "Legal", "IT", "Senior Management", "Procurement & Supply Chain", "HR & Admin", "Creative", "Finance & Accounting", "Engineering & Production", "Sales & BD"],
    datasets: [
      {
        label: "Year over Year (YoY)",
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        data: [28, 24, 22, 9, 7, 3, 3, -1, -4, -6, -7, -8],
      },
      {
        label: "Month over Month (MoM)",
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        data: [3, -1, 5, 2, -2, -4, -2, -3, -4, 3, -2, 0],
      },
    ],
  };

  // City YoY and MoM data (Line Chart)
  const cityData = {
    labels: ["Bengaluru", "Coimbatore", "Jaipur", "Hyderabad", "Delhi-NCR", "Chennai", "Pune", "Kochi", "Kolkata", "Ahmedabad", "Baroda", "Chandigarh", "Mumbai"],
    datasets: [
      {
        label: "Year over Year (YoY)",
        borderColor: "rgba(255, 99, 132, 1)",
        data: [24, 24, 23, 20, 18, 14, 12, 0, -1, -2, -3, -4, -4],
        fill: false,
      },
      {
        label: "Month over Month (MoM)",
        borderColor: "rgba(54, 162, 235, 1)",
        data: [-2, 5, 3, 2, 1, 5, -1, 5, -4, 0, 3, 3, -1],
        fill: false,
      },
    ],
  };

  return (
    <div className="app">
      <h1>Industry Growth Overview</h1>
      <div className="chart-section">
        <h2>Industry YoY vs MoM</h2>
        <Bar data={industryData} />
      </div>

      <div className="chart-section">
        <h2>Industry Salary Data (Highest Range)</h2>
        <Pie data={salaryData} />
      </div>

      <div className="chart-section">
        <h2>Function YoY vs MoM</h2>
        <Bar data={functionData} />
      </div>

      <div className="chart-section">
        <h2>City YoY vs MoM</h2>
        <Line data={cityData} />
      </div>
    </div>
  );
};

export default JobMarketInsights;
