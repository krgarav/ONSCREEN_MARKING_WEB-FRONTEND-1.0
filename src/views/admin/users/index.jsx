import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { getAllUsers } from "services/common";
import Modal from "../../../components/modal/Modal";
import axios from "axios";
import { toast } from "react-toastify";
import ConfirmationModal from "components/modal/ConfirmationModal";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { MdCreateNewFolder } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { MdAutoDelete } from "react-icons/md";

const Index = () => {
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [userId, setUserId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        if (Array.isArray(response)) {
          setUsers(response);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, [isOpen, navigate]);

  const visibleFields = ["name", "email", "mobile", "role", "date"];

  const handleClick = (user) => {
    setSelectedUser(user);
    setIsOpen(true);
  };

  const onUserRemoveHandler = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/auth/removeUser/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(users?.filter((user) => user._id !== userId));
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    } finally {
      setConfirmationModal(false);
      setUserId("");
    }
  };

  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchSubjectNames = async () => {
      try {
        // Create an array of promises for fetching subjects for each user
        const userSubjectMapping = await Promise.all(
          users.map(async (user) => {
            const subjectNames = await Promise.all(
              user.subjectCode.map(async (subjectCode) => {
                const response = await axios.get(
                  `${process.env.REACT_APP_API_URL}/api/subjects/getbyid/subject/${subjectCode}`,
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                );
                // console.log(response)
                return response.data.name; // Subject name for this code
              })
            );
            return {
              ...user,
              subjectNames, // Add fetched subject names to the user object
            };
          })
        );
        // console.log(userSubjectMapping)
        setUserData(userSubjectMapping);
      } catch (error) {
        console.error("Error fetching subject names:", error);
      }
    };

    fetchSubjectNames();
  }, [users]);

  const rows = users?.map((user) => {
    // Find the matching user in userData by ID
    const matchedUser = userData.find((data) => data._id === user._id);

    return {
      id: user?._id,
      name: user?.name,
      email: user?.email,
      mobile: user?.mobile,
      role: user?.role,
      date: new Date(user?.date).toLocaleDateString(), // Format date
      permissions: user?.permissions,
      subjectCode: user?.subjectCode || [],
      maxBooklets: user?.maxBooklets || 0,
      subjectName: matchedUser?.subjectNames || [], // Use the subjectNames from userData
    };
  });

  // console.log(users);

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "mobile", headerName: "Mobile", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "permissions", headerName: "Permissions", flex: 1 },
    { field: "subjectName", headerName: "Subjects", flex: 1 },
    { field: "maxBooklets", headerName: "Max Booklets", flex: 1 },
    {
      field: "edit",
      headerName: "Edit",

      renderCell: (params) => (
        <div
          className="mt-1 flex cursor-pointer justify-center rounded px-3 py-2 text-center font-medium text-indigo-400"
          onClick={() => {
            handleClick(params.row);
          }}
        >
          <FiEdit className="size-6" />
        </div>
      ),
    },
    {
      field: "delete",
      headerName: "Remove",
      renderCell: (params) => (
        <div
          className="mt-1 flex cursor-pointer justify-center rounded px-3 py-2 text-center font-medium text-red-600"
          onClick={() => {
            setConfirmationModal(true);
            setUserId(params.row.id);
          }}
        >
          <MdAutoDelete className="size-6" />
        </div>
      ),
    },
  ];

  return (
    <div className="mt-12 overflow-x-auto rounded-md">
      {/* <table className="min-w-full table-auto divide-y divide-gray-300 bg-white text-sm dark:bg-navy-700">
        <thead className="bg-gray-100 dark:bg-navy-800">
          <tr>
            {visibleFields?.map((key) => (
              <th
                key={key}
                className="text-md whitespace-nowrap px-6 py-3 text-left font-bold uppercase tracking-wider text-gray-700 dark:text-white"
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </th>
            ))}
            <th className="text-md whitespace-nowrap px-6 py-3 text-left font-bold  uppercase tracking-wider text-gray-700 dark:text-white">
              Edit
            </th>
            <th className="text-md whitespace-nowrap px-6 py-3 text-left font-bold uppercase tracking-wider text-gray-700 dark:text-white">
              Remove
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white">
          {users &&
            users?.map((user) => (
              <tr key={user._id} className="bg-white hover:bg-gray-50">
                {visibleFields?.map((field) => (
                  <td
                    key={field}
                    className="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:bg-navy-700 dark:text-white"
                  >
                    {field === "date"
                      ? new Date(user[field]).toLocaleDateString()
                      : user[field]}
                  </td>
                ))}

                <td className="whitespace-nowrap px-6 py-4 dark:bg-navy-700">
                  <button
                    className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                    onClick={() => handleClick(user)}
                  >
                    Edit
                  </button>
                </td>

                {user._id !== localStorage.getItem("userId") && (
                  <td className="whitespace-nowrap px-6 py-4 dark:bg-navy-700">
                    <button
                      className="inline-block rounded bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700"
                      onClick={() => {
                        setConfirmationModal(true);
                        setUserId(user._id);
                      }}
                    >
                      Remove
                    </button>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table> */}

      <div style={{ maxHeight: "600px", width: "100%" }} className="dark:text-white dark:bg-navy-700">
        <DataGrid
        className="dark:text-white  "
          rows={rows}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              fontWeight: 900, // Extra bold (900 is the maximum for fontWeight)
              fontSize: "1rem", // Adjust header size if needed
              backgroundColor: "transparent",
            },
            "& .MuiDataGrid-cell": {
              fontSize: "0.80rem", // Smaller row text
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.1)", // Optional hover effect
            },
          }}
        />
      </div>

      {/* Render the modal when isOpen is true */}
      {isOpen && (
        <Modal user={selectedUser} isOpen={isOpen} setIsOpen={setIsOpen} />
      )}

      <ConfirmationModal
        confirmationModal={confirmationModal}
        onSubmitHandler={onUserRemoveHandler}
        setConfirmationModal={setConfirmationModal}
        setId={setUserId}
        heading="Confirm User Removal"
        message="Are you sure you want to remove this user? This action cannot be undone."
        type="error" // Options: 'success', 'warning', 'error'
      />
    </div>
  );
};

export default Index;
