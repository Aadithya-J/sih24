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
    <>
        <div className="app">
        <h1>Industry Growth Overview</h1>

        <p>Our data according to the latest info (August 2024) indicates an 11% year-on-year growth, with a 1% increase over the past three months. However, it shows a 1% decline month-on-month, and an 11% increase over six months.</p>
        <div className="chart-section">
            <h2>Industry YoY vs MoM</h2>
            <Bar data={industryData} />
        </div>
            <p>The Consumer Electronics sector is on a robust growth trajectory fuelled by advancements in white goods and the Semiconductor industry, and driven by the adoption of Al, IoT and 5G. Strong hiring demand was registered in Bengaluru (11%), Hyderabad (11%) and Chennai (10%) over the past month across various roles, including Engineering, Research & Development and Product Design
            The Real Estate sector experienced strong hiring demand annually as well as over the last month. The surge can be attributed to the increasing need for flexible spaces, data centers and rising investor confidence. Global investors are showing renewed confidence in the Indian market, leading to more projects and job creation. Notably. Chennai and Jaipur have witnessed the double-digit growth in hiring demand over the past month</p>
        </div>

        <div className="app">
            <div className="chart-section">
                <h2>Industry Salary Data (Highest Range)</h2>
                <Pie data={salaryData} />
            </div>
            <p>The salary data highlights that industries like Banking, Financial Services, IT, and Automotive offer the highest salary ranges across experience levels, with significant growth for senior professionals. Sectors like BPO and Education offer lower salaries, especially for entry-level roles. Overall, salaries rise steadily with experience across all industries.</p>
        </div>

        <div className="app">
            <div className="chart-section">
                <h2>Functional hiring trends (YoY and MoM)</h2>
                <Bar data={functionData} />
            </div>
            <p>Medical roles (+22%) are seeing a surge, mainly due to the growing awareness about health and wellness, boosting the need for healthcare professionals across industries. Additionally, innovations in medical technology and telemedicine are expanding the scope of healthcare services, requiring skilled professionals to manage and operate new technologies.
            Engineering & Production (-7%) roles saw a decline. Advancements in technology are changing the nature of engineering and production roles. The rise of digital twins, advanced simulations, and smart manufacturing require different skill sets leading to the consolidation of roles. Additionally, there is a growing focus on sustainability and green technologies, leading to shifts in engineering and production roles towards more specialized fields.</p>
        </div>

        <div className="app">
            <div className="chart-section">
                <h2>City hiring (YoY vs MoM)</h2>
                <Line data={cityData} />
            </div>
            <p>E-recruitment soared in 8 of 13 cities annually, led by Bengaluru (+24%) & Coimbatore (+24%). Jaipur, Delhi-NCR, and Hyderabad also showed strong gains, highlighting expandong opportunities in tier-2 cities.</p>
        </div>
    </>
  );
};

export default JobMarketInsights;
