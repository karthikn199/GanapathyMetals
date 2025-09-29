import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

// Sample data for company employees
const companyData = {
  ADMIN: {
    present: 58,
    absent: 12,
    missingPunch: 5,
    subDepartments: {
      "HR & Administration": { present: 10, absent: 2, missingPunch: 1 },
      "Finance & Accounts": { present: 8, absent: 1, missingPunch: 0 },
      Booking: { present: 5, absent: 1, missingPunch: 1 },
      Despatch: { present: 7, absent: 2, missingPunch: 1 },
      "TMT Yard": { present: 6, absent: 1, missingPunch: 0 },
      RMLab: { present: 4, absent: 1, missingPunch: 1 },
      Store: { present: 5, absent: 1, missingPunch: 0 },
      "TN Marketing": { present: 6, absent: 2, missingPunch: 1 },
      "KA Marketing": { present: 5, absent: 1, missingPunch: 0 },
      Purchase: { present: 2, absent: 0, missingPunch: 0 },
    },
    weeklyTrend: [
      { day: "Mon", present: 50, absent: 8, missingPunch: 2 },
      { day: "Tue", present: 52, absent: 6, missingPunch: 3 },
      { day: "Wed", present: 55, absent: 5, missingPunch: 1 },
      { day: "Thu", present: 53, absent: 7, missingPunch: 2 },
      { day: "Fri", present: 58, absent: 2, missingPunch: 0 },
    ],
  },
  "ROLLING MILL": {
    present: 85,
    absent: 15,
    missingPunch: 8,
    subDepartments: {
      Electrical: { present: 20, absent: 3, missingPunch: 2 },
      Mechanical: { present: 25, absent: 5, missingPunch: 3 },
      "Work Shop": { present: 15, absent: 2, missingPunch: 1 },
      "Billet Yard": { present: 10, absent: 3, missingPunch: 1 },
      Production: { present: 15, absent: 2, missingPunch: 1 },
    },
    weeklyTrend: [
      { day: "Mon", present: 80, absent: 10, missingPunch: 4 },
      { day: "Tue", present: 82, absent: 8, missingPunch: 3 },
      { day: "Wed", present: 85, absent: 5, missingPunch: 2 },
      { day: "Thu", present: 83, absent: 7, missingPunch: 3 },
      { day: "Fri", present: 85, absent: 5, missingPunch: 1 },
    ],
  },
  SMS: {
    present: 72,
    absent: 8,
    missingPunch: 4,
    subDepartments: {
      Electrical: { present: 15, absent: 1, missingPunch: 1 },
      Mechanical: { present: 20, absent: 2, missingPunch: 1 },
      "Pump House": { present: 10, absent: 1, missingPunch: 0 },
      "Steering Machine": { present: 8, absent: 1, missingPunch: 1 },
      "Scrap Yard": { present: 7, absent: 1, missingPunch: 0 },
      Pollution: { present: 6, absent: 1, missingPunch: 1 },
      "SMS Lab": { present: 6, absent: 1, missingPunch: 0 },
    },
    weeklyTrend: [
      { day: "Mon", present: 70, absent: 5, missingPunch: 2 },
      { day: "Tue", present: 68, absent: 7, missingPunch: 3 },
      { day: "Wed", present: 72, absent: 3, missingPunch: 1 },
      { day: "Thu", present: 71, absent: 4, missingPunch: 2 },
      { day: "Fri", present: 72, absent: 3, missingPunch: 0 },
    ],
  },
};

// Sample data for contract employees (different structure and values)
const contractData = {
  ADMIN: {
    present: 22,
    absent: 3,
    missingPunch: 4,
    subDepartments: {
      "HR & Administration": { present: 4, absent: 1, missingPunch: 1 },
      "Finance & Accounts": { present: 3, absent: 0, missingPunch: 1 },
      Booking: { present: 2, absent: 0, missingPunch: 1 },
      Despatch: { present: 3, absent: 1, missingPunch: 0 },
      "TMT Yard": { present: 2, absent: 0, missingPunch: 1 },
      RMLab: { present: 2, absent: 0, missingPunch: 0 },
      Store: { present: 2, absent: 1, missingPunch: 0 },
      "TN Marketing": { present: 2, absent: 0, missingPunch: 0 },
      "KA Marketing": { present: 1, absent: 0, missingPunch: 0 },
      Purchase: { present: 1, absent: 0, missingPunch: 0 },
    },
    weeklyTrend: [
      { day: "Mon", present: 20, absent: 2, missingPunch: 3 },
      { day: "Tue", present: 21, absent: 1, missingPunch: 3 },
      { day: "Wed", present: 22, absent: 1, missingPunch: 2 },
      { day: "Thu", present: 20, absent: 2, missingPunch: 3 },
      { day: "Fri", present: 22, absent: 0, missingPunch: 1 },
    ],
  },
  "ROLLING MILL": {
    present: 45,
    absent: 5,
    missingPunch: 7,
    subDepartments: {
      Electrical: { present: 12, absent: 1, missingPunch: 2 },
      Mechanical: { present: 15, absent: 2, missingPunch: 3 },
      "Work Shop": { present: 8, absent: 1, missingPunch: 1 },
      "Billet Yard": { present: 5, absent: 1, missingPunch: 1 },
      Production: { present: 5, absent: 0, missingPunch: 0 },
    },
    weeklyTrend: [
      { day: "Mon", present: 40, absent: 4, missingPunch: 6 },
      { day: "Tue", present: 42, absent: 3, missingPunch: 5 },
      { day: "Wed", present: 45, absent: 2, missingPunch: 4 },
      { day: "Thu", present: 43, absent: 3, missingPunch: 5 },
      { day: "Fri", present: 45, absent: 1, missingPunch: 3 },
    ],
  },
  SMS: {
    present: 30,
    absent: 4,
    missingPunch: 5,
    subDepartments: {
      Electrical: { present: 8, absent: 1, missingPunch: 2 },
      Mechanical: { present: 10, absent: 1, missingPunch: 1 },
      "Pump House": { present: 4, absent: 1, missingPunch: 1 },
      "Steering Machine": { present: 3, absent: 0, missingPunch: 1 },
      "Scrap Yard": { present: 2, absent: 1, missingPunch: 0 },
      Pollution: { present: 2, absent: 0, missingPunch: 0 },
      "SMS Lab": { present: 1, absent: 0, missingPunch: 0 },
    },
    weeklyTrend: [
      { day: "Mon", present: 28, absent: 3, missingPunch: 4 },
      { day: "Tue", present: 27, absent: 4, missingPunch: 5 },
      { day: "Wed", present: 30, absent: 2, missingPunch: 3 },
      { day: "Thu", present: 29, absent: 3, missingPunch: 4 },
      { day: "Fri", present: 30, absent: 1, missingPunch: 2 },
    ],
  },
};

// Mock employee data
const mockEmployees = {
  "HR & Administration": {
    present: [
      {
        code: "HR001",
        name: "John Doe",
        designation: "HR Manager",
        status: "Present",
      },
      {
        code: "HR002",
        name: "Jane Smith",
        designation: "HR Executive",
        status: "Present",
      },
      {
        code: "HR003",
        name: "Robert Johnson",
        designation: "Admin Assistant",
        status: "Present",
      },
      {
        code: "HR004",
        name: "Sarah Williams",
        designation: "Recruiter",
        status: "Present",
      },
      {
        code: "HR005",
        name: "Michael Brown",
        designation: "Payroll Specialist",
        status: "Present",
      },
      {
        code: "HR006",
        name: "Emily Davis",
        designation: "Training Coordinator",
        status: "Present",
      },
      {
        code: "HR007",
        name: "David Wilson",
        designation: "Benefits Administrator",
        status: "Present",
      },
      {
        code: "HR008",
        name: "Jennifer Taylor",
        designation: "HR Assistant",
        status: "Present",
      },
      {
        code: "HR009",
        name: "Christopher Martinez",
        designation: "Compliance Officer",
        status: "Present",
      },
      {
        code: "HR010",
        name: "Amanda Anderson",
        designation: "HR Generalist",
        status: "Present",
      },
    ],
    absent: [
      {
        code: "HR011",
        name: "Thomas Clark",
        designation: "HR Analyst",
        status: "Absent",
      },
      {
        code: "HR012",
        name: "Jessica Lewis",
        designation: "Admin Clerk",
        status: "Absent",
      },
    ],
    missingPunch: [
      {
        code: "PGH0220",
        name: "Jubin",
        designation: "HR",
        status: "Missing Punch",
      },
    ],
  },
  "Finance & Accounts": {
    present: [
      {
        code: "FA001",
        name: "Richard White",
        designation: "Finance Manager",
        status: "Present",
      },
      {
        code: "FA002",
        name: "Susan Hall",
        designation: "Accountant",
        status: "Present",
      },
      {
        code: "FA003",
        name: "Joseph King",
        designation: "Accounts Executive",
        status: "Present",
      },
      {
        code: "FA004",
        name: "Margaret Scott",
        designation: "Financial Analyst",
        status: "Present",
      },
      {
        code: "FA005",
        name: "Charles Green",
        designation: "Tax Specialist",
        status: "Present",
      },
      {
        code: "FA006",
        name: "Elizabeth Adams",
        designation: "Accounts Payable",
        status: "Present",
      },
      {
        code: "FA007",
        name: "Matthew Baker",
        designation: "Accounts Receivable",
        status: "Present",
      },
      {
        code: "FA008",
        name: "Karen Nelson",
        designation: "Bookkeeper",
        status: "Present",
      },
    ],
    absent: [
      {
        code: "FA009",
        name: "Andrew Carter",
        designation: "Audit Assistant",
        status: "Absent",
      },
    ],
    missingPunch: [],
  },
  // Add more mock data for other departments as needed
};

const COLORS = {
  present: "#10B981",
  absent: "#EF4444",
  missingPunch: "#F59E0B",
  background: "#F9FAFB",
  primary: "#2563EB",
  text: "#374151",
};

const DepartmentDashboard = () => {
  const [currentView, setCurrentView] = useState("main");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedSubDepartment, setSelectedSubDepartment] = useState(null);
  const [employeeType, setEmployeeType] = useState("company"); // 'company' or 'contract'
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const handleDepartmentClick = (dept) => {
    setSelectedDepartment(dept);
    setCurrentView("sub");
  };

  const handleSubDepartmentClick = (subDept) => {
    setSelectedSubDepartment(subDept);
    setCurrentView("detail");
  };

  const handleBackClick = () => {
    if (currentView === "detail") {
      setCurrentView("sub");
    } else {
      setCurrentView("main");
      setSelectedDepartment(null);
    }
  };

  const handleEmployeeTypeChange = (type) => {
    setEmployeeType(type);
    // Reset view when changing employee type
    setCurrentView("main");
    setSelectedDepartment(null);
    setSelectedSubDepartment(null);
  };

  // Handle status click to show employees
  const handleStatusClick = (subDept, status, count) => {
    if (count > 0) {
      // Get employees from mock data or generate if not available
      let employees = [];

      if (mockEmployees[subDept] && mockEmployees[subDept][status]) {
        employees = mockEmployees[subDept][status];
      } else {
        // Generate mock employees if not in our predefined data
        employees = Array.from({ length: count }, (_, i) => ({
          code: `${subDept.substring(0, 2).toUpperCase()}${status
            .substring(0, 1)
            .toUpperCase()}${i + 1}`,
          name: `Employee ${i + 1}`,
          designation: "Staff",
          status: status.charAt(0).toUpperCase() + status.slice(1),
        }));
      }

      setSelectedEmployees(employees);
      setSelectedStatus(status);
      setShowEmployeeModal(true);
    }
  };

  // Get the current data based on employee type
  const getCurrentData = () => {
    return employeeType === "company" ? companyData : contractData;
  };

  // Render main departments view
  const renderMainDepartments = () => {
    const data = getCurrentData();

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.keys(data).map((dept) => {
          const deptData = data[dept];
          const totalEmployees =
            deptData.present + deptData.absent + deptData.missingPunch;
          const presentPercent = Math.round(
            (deptData.present / totalEmployees) * 100
          );

          const colorMap = {
            ADMIN: {
              bg: "bg-purple-600",
              text: "text-purple-600",
              lightBg: "bg-purple-50",
            },
            "ROLLING MILL": {
              bg: "bg-blue-600",
              text: "text-blue-600",
              lightBg: "bg-blue-50",
            },
            SMS: {
              bg: "bg-teal-600",
              text: "text-teal-600",
              lightBg: "bg-teal-50",
            },
          };

          return (
            <div
              key={dept}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer
              transition-transform hover:scale-[1.02] group border border-gray-100"
              onClick={() => handleDepartmentClick(dept)}
            >
              <div className={`${colorMap[dept].bg} h-2 w-full`}></div>

              <div className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium text-gray-800">{dept}</h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${colorMap[dept].bg} text-white`}
                    >
                      {presentPercent}%
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${colorMap[dept].lightBg} ${colorMap[dept].text}`}
                    >
                      {totalEmployees} total
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Present", value: deptData.present },
                            { name: "Absent", value: deptData.absent },
                            {
                              name: "Missing Punch",
                              value: deptData.missingPunch,
                            },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={15}
                          outerRadius={30}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          <Cell fill="#10B981" />
                          <Cell fill="#EF4444" />
                          <Cell fill="#F59E0B" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {presentPercent}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        <span className="text-sm">Present</span>
                      </div>
                      <span className="text-sm font-medium">
                        {deptData.present}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                        <span className="text-sm">Absent</span>
                      </div>
                      <span className="text-sm font-medium">
                        {deptData.absent}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                        <span className="text-sm">Missing Punch</span>
                      </div>
                      <span className="text-sm font-medium">
                        {deptData.missingPunch}
                      </span>
                    </div>

                    <div className="pt-2">
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className="bg-green-500 h-1.5 rounded-full"
                          style={{ width: `${presentPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 mt-1">
                      {Object.keys(deptData.subDepartments).length}{" "}
                      sub-departments
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render sub-departments view
  const renderSubDepartments = () => {
    if (!selectedDepartment) return null;
    const data = getCurrentData();
    const deptData = data[selectedDepartment];

    return (
      <div className="space-y-6">
        <button
          onClick={handleBackClick}
          className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          All Departments
        </button>

        <h2 className="text-2xl font-bold text-gray-900">
          {selectedDepartment}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.keys(deptData.subDepartments).map((subDept) => {
            const subData = deptData.subDepartments[subDept];
            const total =
              subData.present + subData.absent + subData.missingPunch;
            const presentPercent = Math.round((subData.present / total) * 100);

            return (
              <div
                key={subDept}
                className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer 
              hover:border-blue-300 transition-all duration-200"
                onClick={() => handleSubDepartmentClick(subDept)}
              >
                <h3 className="font-medium text-gray-900 mb-3">{subDept}</h3>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Attendance</span>
                    <span className="font-medium">{presentPercent}%</span>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                      style={{ width: `${presentPercent}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <div
                      className="flex items-center cursor-pointer hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusClick(subDept, "present", subData.present);
                      }}
                    >
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                      <span className="text-xs">{subData.present} present</span>
                    </div>
                    <div
                      className="flex items-center cursor-pointer hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusClick(subDept, "absent", subData.absent);
                      }}
                    >
                      <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                      <span className="text-xs">{subData.absent} absent</span>
                    </div>
                    <div
                      className="flex items-center cursor-pointer hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusClick(
                          subDept,
                          "missingPunch",
                          subData.missingPunch
                        );
                      }}
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                      <span className="text-xs">
                        {subData.missingPunch} missing
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render employee modal
  const renderEmployeeModal = () => {
    if (!showEmployeeModal) return null;

    const statusColors = {
      present: "bg-green-100 text-green-800",
      absent: "bg-red-100 text-red-800",
      missingPunch: "bg-amber-100 text-amber-800",
    };

    const statusText = {
      present: "Present",
      absent: "Absent",
      missingPunch: "Missing Punch",
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Employees - {statusText[selectedStatus]} - 25-08-2025
            </h3> 
            <button
              onClick={() => setShowEmployeeModal(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="overflow-y-auto flex-1">
            <table className="min-w-full border border-gray-200 shadow-sm rounded-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-blue-500 to-indigo-500">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider"
                  >
                    Code
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider"
                  >
                    Department
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {selectedEmployees.map((employee, index) => (
                  <tr
                    key={index}
                    className="hover:bg-blue-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                      {employee.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {employee.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {employee.designation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full shadow-sm ${
                          employee.status === "Active"
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : employee.status === "Inactive"
                            ? "bg-red-100 text-red-700 border border-red-300"
                            : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                        }`}
                      >
                        {employee.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-500">
              Total: {selectedEmployees.length} employees
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {/* Employee Type Filter */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard
            </h1>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  employeeType === "company"
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-blue-600 hover:bg-blue-50"
                }`}
                onClick={() => handleEmployeeTypeChange("company")}
              >
                Company
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  employeeType === "contract"
                    ? "bg-green-500 text-white shadow-md"
                    : "text-green-600 hover:bg-green-50"
                }`}
                onClick={() => handleEmployeeTypeChange("contract")}
              >
                Contract
              </button>
            </div>
          </div>

          {currentView === "main" && renderMainDepartments()}
          {currentView === "sub" && renderSubDepartments()}
        </div>
      </div>

      {renderEmployeeModal()}
    </div>
  );
};

export default DepartmentDashboard;
