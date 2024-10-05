import React, { useEffect, useState } from "react";
import CourseCard from "components/cards/CourseCard";
import { getAllCourses } from "../../../services/common";
import ClassModal from "components/modal/ClassModal";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams } from "react-router-dom";

const Index = () => {
  const [subjects, setSubjects] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  // Use useState for managing form inputs
  const [formData, setFormData] = useState({
    name: "",
    code: "",
  });

  const { id } = useParams();

  useEffect(() => {
    const fetchedData = async () => {
      try {
        const response = await getAllCourses();
        setSubjects(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchedData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission

    const classData = {
      ...formData,
      classId: id, // Include classId from params
    };

    console.log(classData);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/subjects/create/subject`,
        classData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSubjects((preSubjects) => [...preSubjects, response.data]);

      // Clear form data after successful submission
      setFormData({
        name: "",
        code: "",
      });

      console.log(response);
      toast.success("Course added successfully 🙂");
      setIsOpen(false); // Close modal on success
    } catch (error) {
      toast.error(error.response?.data?.message || "Error occurred");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/subjects/remove/subject/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSubjects(subjects.filter((subject) => subject._id !== id));
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div
        className="hover:bg-transparent mt-12 inline-block cursor-pointer rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
        onClick={() => setIsOpen(true)}
      >
       Create More Courses / Subjects 
      </div>

      <ClassModal
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        handleSubmit={handleSubmit}
        setFormData={setFormData}
        formData={formData}
      />

      <div className="grid w-full grid-cols-3 gap-4">
        {subjects.length > 0 ? (
          subjects.map((subject) => (
            <CourseCard
              key={subject._id}
              subject={subject}
              handleDelete={handleDelete}
            />
          ))
        ) : (
          <p>No courses available</p>
        )}
      </div>
    </div>
  );
};

export default Index;
