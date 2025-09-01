import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getInstructorData } from "../../../../services/operations/profileApi";
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsApi";
import { NavLink } from "react-router-dom";
import InstructorChart from "../InstructorDashboard/InstructorChart";

const Instructor = () => {
  
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const [instructorData, setInstructorData] = useState(null);
  const [courses, setCourses] = useState([]);

  
  useEffect(() => {
    
    const getCourseDataWithStats = async () => {
      setLoading(true);
      const instructorApiData = await getInstructorData(token);
      const result = await fetchInstructorCourses(token);
      console.log("INTRUCTOR API DATA", instructorApiData);

      if (instructorApiData?.length) {
        setInstructorData(instructorApiData);
      }

      if (result) {
        setCourses(result);
      }
      setLoading(false);
    };
    getCourseDataWithStats();
    
  }, []);

  const totalAmount = instructorData?.reduce(
    (acc, curr) => acc + curr?.totalAmountGenerated,
    0
  );
  const totalStudents = instructorData?.reduce(
    (acc, curr) => acc + curr?.totalStudentsEnrolled,
    0
  );



  return (
    <div>
      {/* heading  */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-richblack-5">
          Hi {user?.firstName} 👋
        </h1>
        <p className="font-medium text-richblack-200">
          Let's start something new
        </p>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : courses?.length > 0 ? (
        <div>
          <div className="my-4 flex flex-col md:flex-row gap-3 justify-center   md:h-[450px]">
            {/* Render chart / graph */}
            {totalAmount > 0 || totalStudents > 0 ? (
              <InstructorChart courses={instructorData} />
            ) : (
              <div className="flex-1 p-6 rounded-md bg-richblack-800">
                <p className="text-lg font-bold text-richblack-5">Visualize</p>
                <p className="mt-4 text-xl font-medium text-richblack-50">
                  Not Enough Data To Visualize
                </p>
              </div>
            )}
            {/* Total Statistics */}
            <div className="flex min-w-[250px] relative flex-col rounded-md bg-richblack-800 p-6">
              <p className="text-lg font-bold text-richblack-5">Statistics</p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-lg text-richblack-200">Total Courses</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    {courses?.length}
                  </p>
                </div>
                <div>
                  <p className="text-lg text-richblack-200">Total Students</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    {totalStudents}
                  </p>
                </div>
                <div>
                  <p className="text-lg text-richblack-200">Total Income</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    Rs. {totalAmount}
                  </p>
                </div>
              </div>
            </div>

          </div>
          
          <div className="p-6 rounded-md bg-richblack-800">
            {/* render courses here 
             */}
             
             {/* top courses and view courses line  */}
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-richblack-5">Your Courses</p>
              <NavLink to="/dashboard/my-courses">
                <p className="text-xs font-semibold text-yellow-50">View All</p>
              </NavLink>
            </div>

              
            <div className="flex flex-col items-start my-4 space-y-6 md:flex-row md:space-y-0 md:space-x-6">
              {courses.slice(0, 3).map((course) => (
                <div key={course._id} className="w-full md:w-1/3">
                  <img
                    src={course?.thumbnail}
                    alt={course?.courseName}
                    className="h-[200px] w-full rounded-md object-cover"
                  />
                  <div className="w-full mt-3">
                    <p className="text-sm font-medium text-richblack-50">
                      {course?.courseName}
                    </p>
                    <div className="flex items-center mt-1 space-x-2">
                      <p className="text-xs font-medium text-richblack-300">
                        {course?.totalStudentsEnrolled?.length } students
                      </p>
                      <p className="text-xs font-medium text-richblack-300">
                        |
                      </p>
                      <p className="text-xs font-medium text-richblack-300">
                        Rs. {course?.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 py-20 mt-20 rounded-md bg-richblack-800">
          <p className="text-2xl font-bold text-center text-richblack-5">
            You have not created any courses yet
          </p>
          <NavLink to="/dashboard/add-course">
            <p className="mt-1 text-lg font-semibold text-center text-yellow-50">
              Create a course
            </p>
          </NavLink>
        </div>
      )}
    </div>
  )
};

export default Instructor;
