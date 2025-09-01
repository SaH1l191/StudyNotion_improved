import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { buyCourse } from "../services/operations/paymentApi";
import { fetchCourseDetails } from "../services/operations/courseDetailsApi";
import GetAvgRating from "../data/avgRating";
import Error from "./Error";
import ConfirmationModal from "../components/common/ConfirmationModal";
import RatingStars from "../components/common/RatingStars";
import { formatDate } from "../services/formatDate";
import CourseDetailCard from "../components/core/Course/CourseDetailCard";
import { BiInfoCircle } from "react-icons/bi"
import { HiOutlineGlobeAlt } from "react-icons/hi"
import Footer from '../components/common/Footer'
import CourseAccordionBar from "../components/core/Course/CourseAccordionBar"



const CourseDetails = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { paymentLoading } = useSelector((state) => state.course);
  const [courseData, setCourseData] = useState(null);
  const [totalLectures, setTotalLectures] = useState(0);
  const [avgReviewCount, setAvgReviewCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);

  useEffect(() => {
    const getCourseFullDetails = async () => {
      try {
        const res = await fetchCourseDetails(courseId);
        console.log("Printing res Data", res);
        setCourseData(res);
      } catch (err) {
        console.log("Could not fetch Course Details");
      }
    };
    getCourseFullDetails();
    console.log("Printing Course Data", courseData);
  }, [courseId]);

  useEffect(() => {
    const getAvgfunc = () => {
      const res = GetAvgRating(
        courseData?.data?.courseDetails?.ratingAndReviews
      );
      setAvgReviewCount(res);
    };
    getAvgfunc();
  }, [courseData]);

  useEffect(() => {
    let lectures = 0;
    // calculate number of sublectures of each section
    courseData?.data?.courseDetails?.courseContent?.forEach((section) => {
      lectures += section.subSection.length || 0;
    });

    setTotalLectures(lectures);
  }, [courseData]);

  const [isActive,setIsActive] = useState([]);

  const handleIsActive = (id) =>{
    setIsActive(
      !isActive.includes(id) ? isActive.concat(id) : 
      isActive.filter((e)=> e !== id)
    )
  }

  if (loading || !courseData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center ">
        <div className="spinner"></div>
      </div>
    );
  }

  if (paymentLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!courseData.success) {
    return (
      <div>
        <Error />
      </div>
    );
  }
  const handleBuyCourse = async () => {
    if (token) {
      buyCourse(token, [courseId], user, navigate, dispatch);
      return;
    }
    //case when logged out user is trying to purchase
    setConfirmationModal({
      text1: "You are not Logged in",
      text2: "Please Login to Purchase the Course",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  const {
    _id: course_id,
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentEnrolled,
    createdAt,
  } = courseData?.data?.courseDetails;
  return (
    <div>
     <div className={`relative w-full bg-richblack-800`}>
        {/* Hero Section */}
        <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative ">
          <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
            <div className="relative block max-h-[30rem] lg:hidden">
              <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
              <img
                src={thumbnail}
                alt="course thumbnail"
                className="w-full aspect-auto"
              />
            </div>
            <div
              className={`z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5`}
            >
                      <p>Home {" "}/ Learning {" "}/<span className="text-yellow-50">{` ${courseData?.data?.courseDetails?.category?.name}`}</span></p>
              <div>
                <p className="text-4xl font-bold text-richblack-5 sm:text-[42px]">
                  {courseName}
                </p>
              </div>
              <p className={`text-richblack-200`}>{courseDescription}</p>
              <div className="flex flex-wrap items-center gap-2 text-md">
                <span className="text-yellow-25">{avgReviewCount}</span>
                <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                <span>{`(${ratingAndReviews?.length} reviews)`}</span>
                <span>{`${studentEnrolled?.length} students enrolled`}</span>
              </div>
              <div>
                <p className="">
                  Created By {`${instructor?.firstName} ${instructor?.lastName}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-5 text-lg">
                <p className="flex items-center gap-2">
                  {" "}
                  <BiInfoCircle /> Created at {formatDate(createdAt)}
                </p>
                <p className="flex items-center gap-2">
                  {" "}
                  <HiOutlineGlobeAlt /> English
                </p>
              </div>
            </div>
            <div className="flex flex-col w-full gap-4 py-4 border-y border-y-richblack-500 lg:hidden">
              <p className="pb-4 space-x-3 text-3xl font-semibold text-richblack-5">
                Rs. {price}
              </p>
              <button className="yellowButton" onClick={handleBuyCourse}>
                Buy Now
              </button>
              <button className="blackButton">Add to Cart</button>
            </div>
          </div>
          {/* Courses Card */}
          <div className="right-[1rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute  lg:block">
            <CourseDetailCard
              course={courseData?.data?.courseDetails}
              setConfirmationModal={setConfirmationModal}
              handleBuyCourse={handleBuyCourse}
            />
          </div>
        </div>
      </div>
      <div className="mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]">
        <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">
          {/* What will you learn section */}
          <div className="p-8 my-8 border border-richblack-600">
            <p className="text-3xl font-semibold">What you'll learn</p>
            <div className="mt-5">
              <div>{whatYouWillLearn}</div>
            </div>
          </div>

          {/* Course Content Section */}
          <div className="max-w-[830px] ">

            {/* below course content divs */}
            <div className="flex flex-col gap-3">
              <p className="text-[28px] font-semibold">Course Content</p>
              <div className="flex flex-wrap justify-between gap-2">
                {/* length duration and all  */}
                <div className="flex gap-2">
                  <span>
                    {courseContent?.length} {`section(s)`}
                  </span>
                  <span>
                    {totalLectures} {`lecture(s)`}
                  </span>
                  <span>{courseData?.data?.totalDuration} total length</span>
                </div>
                {/* collapse all sections  */}
                <div>
                  <button
                    className="text-yellow-25"
                    onClick={() => setIsActive([])}
                  >
                    Collapse all sections
                  </button>
                </div>
                
              </div>
            </div>

            {/* Course Details Accordion */}
            <div className="py-4">
              {courseContent?.map((course, index) => (
                <CourseAccordionBar
                  course={course}
                  key={index}
                  isActive={isActive}
                  handleActive={handleIsActive}
                />
              ))}
            </div>

            {/* Author Details */}
            <div className="py-4 mb-12">
              <p className="text-[28px] font-semibold">Author</p>
              <div className="flex items-center gap-4 py-4">
                <img
                  src={
                    instructor.image
                      ? instructor.image
                      : `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`
                  }
                  alt="Author"
                  className="object-cover rounded-full h-14 w-14"
                />
                <p className="text-lg">{`${instructor.firstName} ${instructor.lastName}`}</p>
              </div>
              <p className="text-richblack-50">
                {instructor?.additionalDetails?.about}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

export default CourseDetails;
