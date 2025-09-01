import React, { useState } from "react";
import { Chart, registerables } from "chart.js";
import { Pie } from "react-chartjs-2";

Chart.register(...registerables);

const InstructorChart = ({ courses }) => {
  const [currChart, setCurrentChart] = useState("students");

  // function to generate random colors
  const getRandomColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      //rgb function 
      const color = `rgb(${Math.floor(Math.random() * 256)},${Math.floor(
        Math.random() * 256
      )},${Math.floor(Math.random() * 256)})`;
      colors.push(color);
    }
    return colors;
  };

  //create data for chart displaying student information
  const chartDataForStudents = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalStudentsEnrolled),
        backgroundColor: getRandomColors(courses?.length),
      },
    ],
  };
  //create data for chart displaying income information
  const chartDataForIncome = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalAmountGenerated),
        backgroundColor: getRandomColors(courses?.length),
      },
    ],
  };
  // create options
  const options = {
    maintainAspectRatio: false,
  };
  return (
    <div className="flex flex-col flex-1 p-6 rounded-md gap-y-4 bg-richblack-800">
      <p className="text-lg font-bold text-richblack-5">Visualise</p>
      
      {/* 2 buttons div  */}
      <div className="space-x-4 font-semibold">
        <button
          onClick={() => setCurrentChart("students")}
          className={`rounded-lg p-1 px-3 transition-all duration-200 ${
            currChart === "students"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}>Student</button>
          
        <button
          className={`rounded-lg p-1 px-3 transition-all duration-200 ${
            currChart === "income"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
          onClick={() => setCurrentChart("income")}
        >Income</button>
      </div>
      
      <div className="relative mx-auto min-w-[200px] w-[350px] aspect-square max-w-md md:w-full md:h-full">
          <Pie
            data={
              currChart === "students"
                ? chartDataForStudents
                : chartDataForIncome
            }
            options={options}
          />
        </div>
    </div>
  );
};

export default InstructorChart;
