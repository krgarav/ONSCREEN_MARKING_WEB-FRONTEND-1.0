import React, { useEffect, useState } from "react";
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

  const hardcodedPermissions = {
    evaluator: ["Evaluator Dashboard", "Assigned Tasks", "Profile"],
    moderator: ["Evaluator Dashboard", "Assigned Tasks", "Profile"],
  };

  useEffect(() => {
    if (userDetails.role) {
      if (userDetails.role === "admin") {
        setUserDetails({
          ...userDetails,
          permissions: routes.map((route) => route.name),
        });
      } else {
        const permissionsForRole = hardcodedPermissions[userDetails.role] || [];
        setUserDetails({
          ...userDetails,
          permissions: permissionsForRole,
        });
      }
    }
  }, [userDetails.role]);

  console.log(routes) // only show major block

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
    if (
      !userDetails?.name ||
      !userDetails?.email ||
      !userDetails?.mobile ||
      !userDetails?.role ||
      !userDetails?.password ||
      userDetails?.permissions?.length === 0
    ) {
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
      toast.error(
        error?.response?.data?.message ||
          "Failed to create user. Please try again later."
      );
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
    <section>
      <div className="h-full w-full">
        <main className="flex items-center justify-center dark:bg-navy-900">
          <div className="mt-8 w-full max-w-xl lg:max-w-3xl">
            <form
              className="grid max-h-[80vh] grid-cols-6 gap-6 overflow-y-auto rounded-md border border-gray-700 bg-white p-6 shadow-lg dark:bg-navy-700"
              onSubmit={handleFormSubmit}
            >
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="FullName"
                  className="sm:text-md block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="FullName"
                  name="full_name"
                  placeholder="Enter the Name"
                  className="mt-1 w-full rounded-md border-gray-300 bg-gray-50 p-1 text-gray-700 focus:border-indigo-500 focus:ring focus:ring-indigo-500 dark:bg-navy-900 dark:text-white sm:p-2"
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
                  className="sm:text-md block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Mobile Number
                </label>
                <input
                  type="text"
                  id="mobile"
                  name="mobile"
                  placeholder="Enter Mobile Number"
                  className="mt-1 w-full rounded-md border-gray-300 bg-gray-50 p-1 text-gray-700 focus:border-indigo-500 focus:ring focus:ring-indigo-500 dark:bg-navy-900 dark:text-white sm:p-2"
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
                  className="sm:text-md block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="Email"
                  name="email"
                  placeholder="Enter Email"
                  className="mt-1 w-full rounded-md border-gray-300 bg-gray-50 p-1 text-gray-700 focus:border-indigo-500 focus:ring focus:ring-indigo-500 dark:bg-navy-900 dark:text-white sm:p-2"
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
                  className="sm:text-md block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  className="mt-1 w-full rounded-md border-gray-300 bg-gray-50 p-1 text-gray-700 focus:border-indigo-500 focus:ring focus:ring-indigo-500 dark:bg-navy-900 dark:text-white sm:p-2"
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, role: e.target.value })
                  }
                  value={userDetails.role}
                >
                  <option value="">Select a role</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                  <option value="evaluator">Evaluator</option>
                </select>
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="permissions"
                  className="sm:text-md block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Permissions
                </label>
                <div className="grid grid-cols-2 p-1 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                  {routes.map((route, index) => (
                    <div className="flex items-center" key={index}>
                      <input
                        type="checkbox"
                        id={route.name}
                        name="permissions"
                        value={route.name}
                        className="rounded border-2 border-gray-300 bg-gray-50 text-blue-600 focus:ring-blue-500 sm:h-5 sm:w-5"
                        checked={
                          userDetails?.role === "admin"
                            ? userDetails.permissions
                            : hardcodedPermissions[userDetails.role]?.includes(
                                route.name
                              )
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
                        className="ml-2 text-sm text-gray-700 dark:text-white"
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
                  className="sm:text-md block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Password
                </label>
                <div className="relative flex items-center justify-center">
                  <input
                    type={visibility ? "text" : "password"}
                    id="Password"
                    name="password"
                    placeholder="Enter Password"
                    className="mt-1 w-full rounded-md border-gray-300 bg-gray-50 p-1 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500 dark:bg-navy-900 dark:text-white sm:p-2"
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
                  className="sm:text-md block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Password Confirmation
                </label>
                <div className="relative flex items-center justify-center">
                  <input
                    type={visibility ? "text" : "password"}
                    id="PasswordConfirmation"
                    name="password_confirmation"
                    placeholder="Confirm Password"
                    className="mt-1 w-full rounded-md border-gray-300 bg-gray-50 p-1 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500 dark:bg-navy-900 dark:text-white sm:p-2"
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

              <div className="col-span-6 flex items-center justify-center gap-2 sm:flex-row sm:gap-5">
                <button
                  className={`rounded-md bg-indigo-600 px-2 py-1 text-lg text-white transition hover:bg-indigo-700 sm:px-2 sm:py-1 lg:px-4 lg:py-2 ${
                    loading ? "cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg
                        className="mr-2 h-5 w-5 animate-spin text-white"
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
                <h2 className="rounded-md bg-indigo-600 px-2 py-1 text-lg text-white transition-all duration-300 hover:bg-indigo-700 sm:px-2 sm:py-1 lg:px-4 lg:py-2">
                  <Link to={"/admin/uploadcsv"}>Create user by CSV</Link>
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
