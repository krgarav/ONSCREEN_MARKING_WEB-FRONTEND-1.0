import React, { useState } from "react";
import { toast } from "react-toastify";
import routes from "routes.js";
import { createUser } from "services/common";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { Link } from "react-router-dom";

const CreateUser = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    role: "",
    permissions: [],
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [visibility, setVisibility] = useState(false);


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if password is empty or less than 8 characters
    if (!userDetails?.password?.trim()) {
      toast.error("Please enter a new password.");
      setLoading(false);
      return;
    }

    if (userDetails?.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    // Check if password confirmation matches
    if (userDetails?.password !== userDetails?.password_confirmation) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    // Check if required fields are filled
    if (!userDetails?.name || !userDetails?.email || !userDetails?.mobile || !userDetails?.role || !userDetails?.password) {
      toast.error("All fields are required!");
      setLoading(false);
      return;
    }

    // Mobile number validation
    if (userDetails.mobile.length !== 10 || isNaN(userDetails.mobile)) {
      toast.error("Mobile number must be 10 digits.");
      setLoading(false);
      return;
    }

    try {
      const response = await createUser(userDetails);

      if (response) {
        const { status, data } = response;
        if (status === 201) {
          toast.success(data?.message || "User created successfully!");
        } else {
          toast.error(data?.message || "An error occurred. Please try again.");
        }
      } else {
        toast.error("No response from the server.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(error?.response?.data?.message || "Failed to create user. Please try again later.");
    } finally {
      // Reset form fields
      setUserDetails({
        name: "",
        email: "",
        password: "",
        mobile: "",
        role: "",
        permissions: [],
        password_confirmation: "",
      });
      setLoading(false);
    }
  };


  return (
    <section className="bg-gray-50 min-h-screen">
      <div className="w-full h-full">
        <main className="flex items-center justify-center px-4 py-6 sm:px-8 lg:py-12 lg:px-16">
          <div className="max-w-xl lg:max-w-3xl w-full">
            <form
              className="mt-8 grid grid-cols-6 gap-6 rounded-md border border-gray-300 p-6 bg-white shadow-lg overflow-y-auto max-h-[80vh]"
              onSubmit={handleFormSubmit}
            >
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="FullName"
                  className="text-md block font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="FullName"
                  name="full_name"
                  className="mt-1 w-full rounded-md border-gray-300 p-2 bg-gray-50 text-gray-700 focus:ring focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) =>
                    setUserDetails({
                      ...userDetails,
                      name: e.target.value,
                    })
                  }
                  value={userDetails.name}
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="mobile"
                  className="text-md block font-medium text-gray-700"
                >
                  Mobile Number
                </label>
                <input
                  type="text"
                  id="mobile"
                  name="mobile"
                  className="mt-1 w-full rounded-md border-gray-300 p-2 bg-gray-50 text-gray-700 focus:ring focus:ring-blue-500 focus:border-blue-500"
                  maxLength="10"
                  pattern="\d*"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) {
                      setUserDetails({ ...userDetails, mobile: value });
                    }
                  }}
                  value={userDetails.mobile}
                />
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="Email"
                  className="text-md block font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="Email"
                  name="email"
                  className="mt-1 w-full rounded-md border-gray-300 p-2 bg-gray-50 text-gray-700 focus:ring focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) =>
                    setUserDetails({
                      ...userDetails,
                      email: e.target.value,
                    })
                  }
                  value={userDetails.email}
                />
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="Role"
                  className="text-md block font-medium text-gray-700"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  className="mt-1 w-full rounded-md border-gray-300 p-2 bg-gray-50 text-gray-700 focus:ring focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, role: e.target.value })
                  }
                  value={userDetails.role}
                >
                  <option value="">Select a role</option>
                  <option value="admin">Admin</option>
                  <option value="reviewer">Reviewer</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="permissions"
                  className="text-md block font-medium text-gray-700"
                >
                  Permissions
                </label>
                <div className="grid grid-cols-2 gap-4 p-2 sm:grid-cols-3 lg:grid-cols-4">
                  {routes.map((route, index) => (
                    <div className="flex items-center" key={index}>
                      <input
                        type="checkbox"
                        id={route.name}
                        name="permissions"
                        value={route.name}
                        className="h-5 w-5 rounded border-2 border-gray-300 bg-gray-50 text-blue-600 focus:ring-blue-500"
                        checked={
                          userDetails?.role === "admin"
                            ? userDetails.permissions
                            : userDetails.permissions.includes(route.name)
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setUserDetails({
                              ...userDetails,
                              permissions: [
                                ...userDetails.permissions,
                                e.target.value,
                              ],
                            });
                          } else {
                            setUserDetails({
                              ...userDetails,
                              permissions: userDetails.permissions.filter(
                                (permission) => permission !== e.target.value
                              ),
                            });
                          }
                        }}
                      />
                      <label
                        htmlFor={route.name}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {route.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="Password"
                  className="text-md block font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative flex items-center justify-center">
                  <input
                    type={visibility ? "text" : "password"}
                    id="Password"
                    name="password"
                    className="mt-1 w-full rounded-md border-gray-300 p-2 bg-gray-50 text-gray-700 focus:ring focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) =>
                      setUserDetails({
                        ...userDetails,
                        password: e.target.value,
                      })
                    }
                    value={userDetails.password}
                  />
                  {visibility ? (
                    <MdOutlineVisibility
                      className="absolute right-2 cursor-pointer text-gray-600"
                      onClick={() => setVisibility(!visibility)}
                    />
                  ) : (
                    <MdOutlineVisibilityOff
                      className="absolute right-2 cursor-pointer text-gray-600"
                      onClick={() => setVisibility(!visibility)}
                    />
                  )}
                </div>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="PasswordConfirmation"
                  className="text-md block font-medium text-gray-700"
                >
                  Password Confirmation
                </label>
                <div className="relative flex items-center justify-center">
                  <input
                    type={visibility ? "text" : "password"}
                    id="PasswordConfirmation"
                    name="password_confirmation"
                    className="mt-1 w-full rounded-md border-gray-300 p-2 bg-gray-50 text-gray-700 focus:ring focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) =>
                      setUserDetails({
                        ...userDetails,
                        password_confirmation: e.target.value,
                      })
                    }
                    value={userDetails.password_confirmation}
                  />
                  {visibility ? (
                    <MdOutlineVisibility
                      className="absolute right-2 cursor-pointer text-gray-600"
                      onClick={() => setVisibility(!visibility)}
                    />
                  ) : (
                    <MdOutlineVisibilityOff
                      className="absolute right-2 cursor-pointer text-gray-600"
                      onClick={() => setVisibility(!visibility)}
                    />
                  )}
                </div>
              </div>

              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <button
                  className={`hover:bg-transparent inline-block rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 hover:text-white sm:px-5 sm:py-3 ${loading ? 'cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Creating...
                    </div>
                  ) : (
                    "Create User"
                  )}
                </button>
                <h2 className="text-xl font-semibold text-blue-600 hover:text-blue-800 underline decoration-blue-500 decoration-2 hover:underline-offset-4 transition-all duration-300">
                  <Link to={'/admin/uploadcsv'}>
                    Create user by CSV
                  </Link>
                </h2>

              </div>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
};

export default CreateUser;
