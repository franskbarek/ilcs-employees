const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

app.use(express.json());

const filePath = "./employees.json";

// baca file JSON
const readData = () => {
  checkAndCreateFile();
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
};

// coversi ke file JSON
const writeData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};

// cek existing filJSON
const checkAndCreateFile = () => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]), "utf8");
  }
};

// get all data
app.get("/employees", (req, res) => {
  const employees = readData();
//   if (employees) {
    res.json(employees);
//   } else {
//     res.status(404).json({ message: "Employees not found" });
//   }
});

// get data by nip
app.get("/employees/:nip", (req, res) => {
  const employees = readData();
  const { nip } = req.params;
  const employee = employees.find((emp) => emp.nip === nip);

  if (employee) {
    res.json(employee);
  } else {
    res.status(404).json({ message: "Employee not found" });
  }
});

// add data employ
app.post("/employees", (req, res) => {
  const { nip, nama, alamat, status } = req.body;
  const employees = readData();

  if (status !== "tetap" && status !== "kontrak") {
    return res.status(400).json({ message: "Status must be tetap or kontrak" });
  }

  const newEmployee = { nip, nama, alamat, status };
  employees.push(newEmployee);
  writeData(employees);

  res.status(201).json(newEmployee);
});

// edit  employee
app.put("/employees/:nip", (req, res) => {
  const { nip } = req.params;
  const { nama, alamat, status } = req.body;
  const employees = readData();

  const employeeIndex = employees.findIndex((emp) => emp.nip === nip);

  if (employeeIndex !== -1) {
    if (status !== "tetap" && status !== "kontrak") {
      return res.status(400).json({ message: "Status must be tetap or kontrak" });
    }

    employees[employeeIndex] = { nip, nama, alamat, status };
    writeData(employees);

    res.json(employees[employeeIndex]);
  } else {
    res.status(404).json({ message: "Employee not found" });
  }
});

// hapus employ
app.delete("/employees/:nip", (req, res) => {
  const { nip } = req.params;
  const employees = readData();

  const employeeIndex = employees.findIndex((emp) => emp.nip === nip);

  if (employeeIndex !== -1) {
    const deletedEmployee = employees.splice(employeeIndex, 1);
    writeData(employees);

    res.json(deletedEmployee[0]);
  } else {
    res.status(404).json({ message: "Employee not found" });
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
