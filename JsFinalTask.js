/* ============================================================
   EMPLOYEE MANAGEMENT DASHBOARD

   Features:

   1. Fetch employees from API
   2. Date and time
   3. Search
   4. Department filter
   5. Sort dropdown
   6. Salary calculation
   7. Add employee
   8. Delete employee
   9. Form validation
   10. Fallback data
============================================================ */


/* ============================================================
   1. STATE
============================================================ */

const API_URL =
  "https://dummyjson.com/users";


const DEPARTMENTS = [
  "All",
  "IT",
  "HR",
  "Finance",
  "Marketing"
];


let employees = [];

let activeDept = "All";

let searchTerm = "";

let activeSort = "";

let nextId = 101;


/* ============================================================
   2. DEPARTMENT MAPPING
============================================================ */

const DEPT_MAP = {

  "Engineering": "IT",

  "Support": "IT",

  "Research and Development": "IT",

  "Product Management": "IT",

  "Services": "IT",

  "Training": "IT",

  "Human Resources": "HR",

  "Accounting": "Finance",

  "Legal": "Finance",

  "Marketing": "Marketing",

  "Sales": "Marketing",

  "Business Development": "Marketing"

};


function mapDepartment(raw) {

  return DEPT_MAP[raw] || "IT";

}


/* ============================================================
   3. SALARY
============================================================ */

function deriveSalary(id) {

  return 28000 +
    ((id * 7919) % 72) * 1000;

}


function rupees(number) {

  return "₹" +
    Number(number).toLocaleString("en-IN");

}


/* ============================================================
   4. INITIALS
============================================================ */

function initials(name) {

  return name

    .split(" ")

    .filter(Boolean)

    .slice(0, 2)

    .map(word =>
      word[0].toUpperCase()
    )

    .join("");

}


/* ============================================================
   5. STATUS
============================================================ */

function setStatus(
  text,
  type = ""
) {

  const status =
    document.getElementById(
      "status"
    );


  status.textContent =
    text;


  status.className =
    type;

}


/* ============================================================
   6. DATE & TIME
============================================================ */

function showDateTime() {

  const months = [

    "January",

    "February",

    "March",

    "April",

    "May",

    "June",

    "July",

    "August",

    "September",

    "October",

    "November",

    "December"

  ];


  const now =
    new Date();


  const date =
    now.getDate();


  const month =
    months[
      now.getMonth()
    ];


  const year =
    now.getFullYear();


  let hours =
    now.getHours();


  const minutes =
    now.getMinutes();


  const seconds =
    now.getSeconds();


  const period =
    hours >= 12
      ? "PM"
      : "AM";


  hours =
    hours % 12 === 0
      ? 12
      : hours % 12;


  function pad(number) {

    return number < 10
      ? "0" + number
      : number;

  }


  document.getElementById(
    "todayDate"
  ).textContent =

    date +
    " " +
    month +
    " " +
    year;


  document.getElementById(
    "todayTime"
  ).textContent =

    pad(hours) +
    ":" +
    pad(minutes) +
    ":" +
    pad(seconds) +
    " " +
    period;

}


/* ============================================================
   7. FETCH EMPLOYEES
============================================================ */

function fetchEmployees() {

  setStatus(
    "Loading employees..."
  );


  fetch(API_URL)

    .then(response => {

      if (!response.ok) {

        throw new Error(
          "HTTP Error: " +
          response.status
        );

      }


      return response.json();

    })


    .then(data => {

      employees =
        data.users.map(user => {

          const {

            id,

            firstName,

            lastName,

            age,

            email,

            phone,

            image,

            company

          } = user;


          return {

            id: id,

            name:
              firstName +
              " " +
              lastName,

            age: age,

            email: email,

            phone: phone,

            image: image,

            title:
              company
                ? company.title
                : "Employee",

            department:
              mapDepartment(
                company
                  ? company.department
                  : ""
              ),

            salary:
              deriveSalary(id),

            isNew: false

          };

        });


      nextId =
        employees.reduce(

          (max, employee) =>

            Math.max(
              max,
              employee.id
            ),

          100

        ) + 1;


      setStatus(

        "Employee data loaded successfully.",

        "ok"

      );


      setTimeout(() => {

        setStatus(

          "Showing " +
          employees.length +
          " employees from the API."

        );

      }, 2500);

    })


    .catch(error => {

      console.error(
        "Fetch error:",
        error
      );


      employees =
        buildFallbackEmployees();


      nextId = 101;


      setStatus(

        "Unable to load API data. Showing saved copy.",

        "error"

      );

    })


    .finally(() => {

      render();

    });

}


/* ============================================================
   8. SEARCH
============================================================ */

function searchEmployees(
  list,
  term
) {

  if (term === "") {

    return list;

  }


  const text =
    term
      .toLowerCase()
      .trim();


  return list.filter(
    employee =>

      employee.name
        .toLowerCase()
        .includes(text)

      ||

      employee.email
        .toLowerCase()
        .includes(text)

      ||

      employee.department
        .toLowerCase()
        .includes(text)

  );

}


/* ============================================================
   9. DEPARTMENT FILTER
============================================================ */

function filterDepartment(
  list,
  department
) {

  if (department === "All") {

    return list;

  }


  return list.filter(
    employee =>
      employee.department ===
      department
  );

}


/* ============================================================
   10. SORT
============================================================ */

function sortEmployees(
  list,
  mode
) {

  const copy =
    [...list];


  /* DEFAULT */

  if (mode === "") {

    return copy;

  }


  /* NAME ASCENDING */

  if (
    mode === "name-asc"
  ) {

    copy.sort(
      (a, b) =>
        a.name.localeCompare(
          b.name
        )
    );

  }


  /* NAME DESCENDING */

  if (
    mode === "name-desc"
  ) {

    copy.sort(
      (a, b) =>
        b.name.localeCompare(
          a.name
        )
    );

  }


  /* AGE ASCENDING */

  if (
    mode === "age-asc"
  ) {

    copy.sort(
      (a, b) =>
        a.age - b.age
    );

  }


  /* AGE DESCENDING */

  if (
    mode === "age-desc"
  ) {

    copy.sort(
      (a, b) =>
        b.age - a.age
    );

  }


  /* SALARY ASCENDING */

  if (
    mode === "salary-asc"
  ) {

    copy.sort(
      (a, b) =>
        a.salary - b.salary
    );

  }


  /* SALARY DESCENDING */

  if (
    mode === "salary-desc"
  ) {

    copy.sort(
      (a, b) =>
        b.salary - a.salary
    );

  }


  return copy;

}


/* ============================================================
   11. SALARY CALCULATION
============================================================ */

function calculateSalary(
  list
) {

  const total =
    list.reduce(

      (sum, employee) =>

        sum + employee.salary,

      0

    );


  const average =

    list.length === 0

      ? 0

      : Math.round(
          total / list.length
        );


  const highest =

    list.length === 0

      ? null

      : list.reduce(

          (best, employee) =>

            employee.salary >
            best.salary

              ? employee

              : best,

          list[0]

        );


  return {

    total,

    average,

    highest

  };

}


/* ============================================================
   12. EMPLOYEE COUNT
============================================================ */

function updateEmployeeCount(
  visible
) {

  const label =

    activeDept === "All"

      ? "Total employees: "

      : activeDept +
        " employees: ";


  document.getElementById(
    "countLabel"
  ).innerHTML =

    label +
    "<b>" +
    visible.length +
    "</b>";


  document.getElementById(
    "statCount"
  ).textContent =

    visible.length;


  const parts =

    DEPARTMENTS

      .filter(
        department =>
          department !== "All"
      )

      .map(department =>

        department +
        " " +

        employees.filter(
          employee =>
            employee.department ===
            department
        ).length

      );


  document.getElementById(
    "deptBreakdown"
  ).textContent =

    parts.join(" · ");

}


/* ============================================================
   13. DASHBOARD FIGURES
============================================================ */

function updateDashboard(
  visible
) {

  const {

    total,

    average,

    highest

  } = calculateSalary(
    visible
  );


  document.getElementById(
    "statTotal"
  ).textContent =

    rupees(total);


  document.getElementById(
    "statAvg"
  ).textContent =

    rupees(average);


  document.getElementById(
    "statTop"
  ).textContent =

    highest

      ? highest.name +
        " — " +
        rupees(
          highest.salary
        )

      : "—";

}


/* ============================================================
   14. DISPLAY EMPLOYEES
============================================================ */

function displayEmployees(
  list
) {

  const grid =
    document.getElementById(
      "employeeGrid"
    );


  grid.innerHTML = "";


  if (
    list.length === 0
  ) {

    const empty =
      document.createElement(
        "div"
      );


    empty.className =
      "empty";


    empty.textContent =

      "No employees match this search or filter. Try another department or clear the search.";


    grid.appendChild(
      empty
    );


    return;

  }


  list.forEach(
    employee => {

      const card =
        document.createElement(
          "div"
        );


      card.className =
        "emp";


      card.setAttribute(
        "data-id",
        employee.id
      );


      let avatar;


      if (
        employee.image
      ) {

        avatar = `

          <img
            class="avatar"
            src="${employee.image}"
            alt="${employee.name}"
          >

        `;

      }

      else {

        avatar = `

          <div class="avatar">

            ${initials(
              employee.name
            )}

          </div>

        `;

      }


      card.innerHTML = `

        <div class="emp-head">

          ${avatar}


          <div>

            <div class="emp-name">

              ${employee.name}

            </div>


            <div class="emp-role">

              ${employee.title}

            </div>

          </div>

        </div>


        <span class="tag">

          ${employee.department}

        </span>


        <dl>

          <dt>
            Age
          </dt>

          <dd>
            ${employee.age}
          </dd>


          <dt>
            Email
          </dt>

          <dd>
            ${employee.email}
          </dd>


          <dt>
            Phone
          </dt>

          <dd>
            ${employee.phone}
          </dd>


          <dt>
            Salary
          </dt>

          <dd class="salary">

            ${rupees(
              employee.salary
            )}

          </dd>

        </dl>


        <div class="emp-foot">

          <span class="new-badge">

            ${
              employee.isNew
                ? "Added by you"
                : ""
            }

          </span>


          <button class="del">

            Delete

          </button>

        </div>

      `;


      card
        .querySelector(
          ".del"
        )
        .addEventListener(
          "click",
          () =>
            deleteEmployee(
              employee.id
            )
        );


      grid.appendChild(
        card
      );

    }
  );

}


/* ============================================================
   15. RENDER
============================================================ */

function render() {

  let visible =

    filterDepartment(
      employees,
      activeDept
    );


  visible =

    searchEmployees(
      visible,
      searchTerm
    );


  visible =

    sortEmployees(
      visible,
      activeSort
    );


  displayEmployees(
    visible
  );


  updateEmployeeCount(
    visible
  );


  updateDashboard(
    visible
  );

}


/* ============================================================
   16. VALIDATION
============================================================ */

function validateEmployee(
  employee
) {

  const errors = {

    name: "",

    age: "",

    email: "",

    phone: "",

    department: "",

    salary: ""

  };


  /* NAME */

  if (
    employee.name === ""
  ) {

    errors.name =
      "❌ Please enter employee name";

  }

  else if (
    employee.name.length < 3
  ) {

    errors.name =
      "❌ Name must be at least 3 characters";

  }


  /* AGE */

  if (

    employee.age === "" ||

    isNaN(employee.age)

  ) {

    errors.age =
      "❌ Please enter age";

  }

  else if (
    employee.age <= 18
  ) {

    errors.age =
      "❌ Age must be greater than 18";

  }


  /* EMAIL */

  if (
    employee.email === ""
  ) {

    errors.email =
      "❌ Please enter email";

  }

  else if (

    !employee.email.includes("@")

    ||

    !employee.email.includes(".")

  ) {

    errors.email =
      "❌ Please enter a valid email";

  }

  else if (

    employees.some(
      existingEmployee =>

        existingEmployee.email
          .toLowerCase() ===
        employee.email
          .toLowerCase()
    )

  ) {

    errors.email =
      "❌ This email is already registered";

  }


  /* PHONE */

  if (
    employee.phone === ""
  ) {

    errors.phone =
      "❌ Please enter phone number";

  }

  else if (

    !/^[0-9+\-\s]{10,15}$/.test(
      employee.phone
    )

  ) {

    errors.phone =
      "❌ Please enter a valid phone number";

  }


  /* DEPARTMENT */

  if (
    employee.department === ""
  ) {

    errors.department =
      "❌ Please select a department";

  }


  /* SALARY */

  if (

    employee.salary === ""

    ||

    isNaN(employee.salary)

    ||

    employee.salary <= 0

  ) {

    errors.salary =
      "❌ Please enter a salary greater than 0";

  }


  /* SHOW ERRORS */

  document.getElementById(
    "errName"
  ).textContent =
    errors.name;


  document.getElementById(
    "errAge"
  ).textContent =
    errors.age;


  document.getElementById(
    "errEmail"
  ).textContent =
    errors.email;


  document.getElementById(
    "errPhone"
  ).textContent =
    errors.phone;


  document.getElementById(
    "errDept"
  ).textContent =
    errors.department;


  document.getElementById(
    "errSalary"
  ).textContent =
    errors.salary;


  /* EVERY */

  return Object
    .values(errors)
    .every(
      message =>
        message === ""
    );

}


/* ============================================================
   17. ADD EMPLOYEE
============================================================ */

function addEmployee() {

  const draft = {

    name:
      document
        .getElementById(
          "inName"
        )
        .value
        .trim(),


    age:
      Number(
        document
          .getElementById(
            "inAge"
          )
          .value
      ),


    email:
      document
        .getElementById(
          "inEmail"
        )
        .value
        .trim(),


    phone:
      document
        .getElementById(
          "inPhone"
        )
        .value
        .trim(),


    department:
      document
        .getElementById(
          "inDept"
        )
        .value,


    salary:
      Number(
        document
          .getElementById(
            "inSalary"
          )
          .value
      )

  };


  /* EMPTY AGE */

  if (

    document
      .getElementById(
        "inAge"
      )
      .value === ""

  ) {

    draft.age = "";

  }


  /* EMPTY SALARY */

  if (

    document
      .getElementById(
        "inSalary"
      )
      .value === ""

  ) {

    draft.salary = "";

  }


  const message =
    document.getElementById(
      "formMessage"
    );


  /* VALIDATE */

  if (
    !validateEmployee(
      draft
    )
  ) {

    message.textContent =
      "Fix the highlighted fields and try again.";


    message.className =
      "bad";


    return;

  }


  /* CREATE EMPLOYEE */

  const newEmployee = {

    id: nextId,

    name: draft.name,

    age: draft.age,

    email: draft.email,

    phone: draft.phone,

    image: "",

    title:
      draft.department +
      " team member",

    department:
      draft.department,

    salary:
      draft.salary,

    isNew: true

  };


  nextId++;


  /* ADD TO ARRAY */

  employees = [

    newEmployee,

    ...employees

  ];


  /* SUCCESS MESSAGE */

  message.textContent =

    newEmployee.name +
    " added to " +
    newEmployee.department +
    ".";


  message.className =
    "ok";


  setTimeout(() => {

    message.textContent = "";

  }, 4000);


  clearForm();


  render();

}


/* ============================================================
   18. DELETE EMPLOYEE
============================================================ */

function deleteEmployee(
  id
) {

  const employee =

    employees.find(
      employee =>
        employee.id === id
    );


  if (!employee) {

    return;

  }


  employees =

    employees.filter(
      employee =>
        employee.id !== id
    );


  setStatus(

    employee.name +
    " removed. " +
    employees.length +
    " employees remaining."

  );


  render();

}


/* ============================================================
   19. CLEAR FORM
============================================================ */

function clearForm() {

  [

    "inName",

    "inAge",

    "inEmail",

    "inPhone",

    "inSalary"

  ].forEach(id => {

    document.getElementById(
      id
    ).value = "";

  });


  document.getElementById(
    "inDept"
  ).value = "";


  [

    "errName",

    "errAge",

    "errEmail",

    "errPhone",

    "errDept",

    "errSalary"

  ].forEach(id => {

    document.getElementById(
      id
    ).textContent = "";

  });


  document.getElementById(
    "formMessage"
  ).textContent = "";


  document.getElementById(
    "formMessage"
  ).className = "";

}


/* ============================================================
   20. DEPARTMENT BUTTONS
============================================================ */

function buildDepartmentButtons() {

  const holder =
    document.getElementById(
      "deptChips"
    );


  holder.innerHTML = "";


  DEPARTMENTS.forEach(
    department => {

      const button =
        document.createElement(
          "button"
        );


      button.className =

        department === activeDept

          ? "chip active"

          : "chip";


      button.textContent =

        department === "All"

          ? "All employees"

          : department;


      button.setAttribute(
        "data-dept",
        department
      );


      button.addEventListener(
        "click",
        () => {

          activeDept =
            department;


          document
            .querySelectorAll(
              ".chip"
            )
            .forEach(chip => {

              chip.className =

                chip.getAttribute(
                  "data-dept"
                ) === department

                  ? "chip active"

                  : "chip";

            });


          render();

        }
      );


      holder.appendChild(
        button
      );

    }
  );


  /* RELOAD API */

  const reload =
    document.createElement(
      "button"
    );


  reload.textContent =
    "Reload from API";


  reload.addEventListener(
    "click",
    fetchEmployees
  );


  holder.appendChild(
    reload
  );

}


/* ============================================================
   21. EVENT WIRING
============================================================ */

function attachEvents() {

  const searchBox =
    document.getElementById(
      "searchBox"
    );


  /* SEARCH BUTTON */

  document
    .getElementById(
      "searchBtn"
    )
    .addEventListener(
      "click",
      () => {

        searchTerm =
          searchBox.value;


        render();

      }
    );


  /* LIVE SEARCH */

  searchBox.addEventListener(
    "input",
    () => {

      searchTerm =
        searchBox.value;


      render();

    }
  );


  /* CLEAR SEARCH */

  document
    .getElementById(
      "clearSearchBtn"
    )
    .addEventListener(
      "click",
      () => {

        searchBox.value = "";

        searchTerm = "";

        render();

      }
    );


  /* ==================================================
     SORT DROPDOWN
  ================================================== */

  const sortSelect =
    document.getElementById(
      "sortSelect"
    );


  sortSelect.addEventListener(
    "change",
    () => {

      activeSort =
        sortSelect.value;


      render();

    }
  );


  /* ADD EMPLOYEE */

  document
    .getElementById(
      "addBtn"
    )
    .addEventListener(
      "click",
      addEmployee
    );


  /* CLEAR FORM */

  document
    .getElementById(
      "resetBtn"
    )
    .addEventListener(
      "click",
      clearForm
    );

}


/* ============================================================
   22. FALLBACK DATA
============================================================ */

function buildFallbackEmployees() {

  const raw = [

    [
      "Emily Johnson",
      28,
      "emily.johnson@x.dummyjson.com",
      "+81 965-431-3024",
      "Engineering",
      "Sales Manager"
    ],

    [
      "Michael Williams",
      35,
      "michael.williams@x.dummyjson.com",
      "+49 258-627-6644",
      "Support",
      "Support Specialist"
    ],

    [
      "Sophia Brown",
      42,
      "sophia.brown@x.dummyjson.com",
      "+81 210-652-2785",
      "Human Resources",
      "Recruiter"
    ],

    [
      "James Davis",
      45,
      "james.davis@x.dummyjson.com",
      "+49 614-958-9364",
      "Accounting",
      "Accountant"
    ],

    [
      "Emma Miller",
      30,
      "emma.miller@x.dummyjson.com",
      "+91 759-776-1614",
      "Marketing",
      "Brand Manager"
    ],

    [
      "Olivia Wilson",
      22,
      "olivia.wilson@x.dummyjson.com",
      "+91 607-295-6448",
      "Engineering",
      "QA Engineer"
    ],

    [
      "Alexander Jones",
      38,
      "alexander.jones@x.dummyjson.com",
      "+61 546-283-7947",
      "Sales",
      "Sales Executive"
    ],

    [
      "Ava Taylor",
      27,
      "ava.taylor@x.dummyjson.com",
      "+92 933-608-5081",
      "Legal",
      "Legal Advisor"
    ],

    [
      "Ethan Martinez",
      33,
      "ethan.martinez@x.dummyjson.com",
      "+61 455-925-5727",
      "Product Management",
      "Product Owner"
    ],

    [
      "Isabella Anderson",
      31,
      "isabella.anderson@x.dummyjson.com",
      "+44 251-802-1243",
      "Human Resources",
      "HR Generalist"
    ],

    [
      "Liam Garcia",
      29,
      "liam.garcia@x.dummyjson.com",
      "+81 158-461-2382",
      "Engineering",
      "Backend Developer"
    ],

    [
      "Mia Rodriguez",
      26,
      "mia.rodriguez@x.dummyjson.com",
      "+91 471-286-1092",
      "Marketing",
      "Content Lead"
    ],

    [
      "Noah Hernandez",
      41,
      "noah.hernandez@x.dummyjson.com",
      "+49 851-472-3320",
      "Accounting",
      "Finance Analyst"
    ],

    [
      "Charlotte Lopez",
      24,
      "charlotte.lopez@x.dummyjson.com",
      "+61 336-221-9051",
      "Support",
      "Helpdesk Engineer"
    ],

    [
      "William Gonzalez",
      37,
      "william.gonzalez@x.dummyjson.com",
      "+92 715-339-4471",
      "Services",
      "Systems Engineer"
    ],

    [
      "Amelia Perez",
      34,
      "amelia.perez@x.dummyjson.com",
      "+44 902-556-8123",
      "Business Development",
      "Partnerships Lead"
    ],

    [
      "Benjamin Clark",
      48,
      "benjamin.clark@x.dummyjson.com",
      "+81 664-118-7726",
      "Legal",
      "Compliance Officer"
    ],

    [
      "Harper Lewis",
      23,
      "harper.lewis@x.dummyjson.com",
      "+91 228-905-5512",
      "Training",
      "Trainer"
    ],

    [
      "Lucas Walker",
      39,
      "lucas.walker@x.dummyjson.com",
      "+49 445-772-1038",
      "Engineering",
      "DevOps Engineer"
    ],

    [
      "Evelyn Hall",
      32,
      "evelyn.hall@x.dummyjson.com",
      "+61 553-441-7788",
      "Human Resources",
      "HR Manager"
    ],

    [
      "Henry Allen",
      44,
      "henry.allen@x.dummyjson.com",
      "+92 190-334-2276",
      "Accounting",
      "Payroll Lead"
    ],

    [
      "Abigail Young",
      25,
      "abigail.young@x.dummyjson.com",
      "+44 771-229-6640",
      "Marketing",
      "Social Media Executive"
    ],

    [
      "Sebastian King",
      36,
      "sebastian.king@x.dummyjson.com",
      "+81 300-618-4491",
      "Sales",
      "Account Manager"
    ],

    [
      "Ella Wright",
      21,
      "ella.wright@x.dummyjson.com",
      "+91 852-114-7329",
      "Support",
      "Support Associate"
    ],

    [
      "Jack Scott",
      43,
      "jack.scott@x.dummyjson.com",
      "+49 116-885-3390",
      "Product Management",
      "Program Manager"
    ],

    [
      "Scarlett Green",
      28,
      "scarlett.green@x.dummyjson.com",
      "+61 447-903-2215",
      "Engineering",
      "Frontend Developer"
    ],

    [
      "Daniel Baker",
      50,
      "daniel.baker@x.dummyjson.com",
      "+92 664-772-9917",
      "Services",
      "Delivery Manager"
    ],

    [
      "Grace Adams",
      27,
      "grace.adams@x.dummyjson.com",
      "+44 359-882-4416",
      "Business Development",
      "Growth Associate"
    ],

    [
      "Matthew Nelson",
      40,
      "matthew.nelson@x.dummyjson.com",
      "+81 774-216-3358",
      "Legal",
      "Contracts Manager"
    ],

    [
      "Chloe Carter",
      29,
      "chloe.carter@x.dummyjson.com",
      "+91 663-119-4485",
      "Training",
      "Learning Specialist"
    ]

  ];


  return raw.map(
    (row, index) => {

      const [

        name,

        age,

        email,

        phone,

        department,

        title

      ] = row;


      const id =
        index + 1;


      return {

        id: id,

        name: name,

        age: age,

        email: email,

        phone: phone,

        image: "",

        title: title,

        department:
          mapDepartment(
            department
          ),

        salary:
          deriveSalary(id),

        isNew: false

      };

    }
  );

}


/* ============================================================
   23. START APPLICATION
============================================================ */

function init() {

  showDateTime();


  setInterval(
    showDateTime,
    1000
  );


  buildDepartmentButtons();


  attachEvents();


  fetchEmployees();

}


/* ============================================================
   START
============================================================ */

init();