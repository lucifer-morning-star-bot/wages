let employees = [];

// Load from localStorage
if(localStorage.getItem('employees')){
    employees = JSON.parse(localStorage.getItem('employees'));
    renderTable();
}

document.getElementById('employeeForm').addEventListener('submit', function(e){
    e.preventDefault();

    const name = document.getElementById('employeeName').value.trim();
    const hoursWorked = parseFloat(document.getElementById('hoursWorked').value);
    const rate = parseFloat(document.getElementById('hourlyRate').value);
    const taxPercent = parseFloat(document.getElementById('taxPercent').value);
    const overtimeRate = parseFloat(document.getElementById('overtimeRate').value);

    if(name === "" || isNaN(hoursWorked) || isNaN(rate)) return alert("Please enter valid values.");

    const standardHours = 40;
    let normalPay = hoursWorked > standardHours ? standardHours*rate : hoursWorked*rate;
    let overtimePay = hoursWorked > standardHours ? (hoursWorked-standardHours)*rate*overtimeRate : 0;
    const grossPay = normalPay + overtimePay;
    const tax = grossPay * (taxPercent/100);
    const netPay = grossPay - tax;

    const employee = {name, hoursWorked, rate, normalPay, overtimePay, grossPay, tax, netPay};
    employees.push(employee);
    localStorage.setItem('employees', JSON.stringify(employees));
    renderTable();
    this.reset();
});

function renderTable(){
    const tbody = document.querySelector('#payrollTable tbody');
    tbody.innerHTML = '';

    employees.forEach((emp, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td data-label="Name">${emp.name}</td>
            <td data-label="Hours">${emp.hoursWorked}</td>
            <td data-label="Rate">${emp.rate.toFixed(2)}</td>
            <td data-label="Normal Pay">${emp.normalPay.toFixed(2)}</td>
            <td data-label="Overtime">${emp.overtimePay.toFixed(2)}</td>
            <td data-label="Gross">${emp.grossPay.toFixed(2)}</td>
            <td data-label="Tax">${emp.tax.toFixed(2)}</td>
            <td data-label="Net">${emp.netPay.toFixed(2)}</td>
            <td>
                <button class="delete-btn" onclick="deleteEmployee(${index})">Delete</button>
                <button class="pdf-btn" onclick="generatePDF(${index})">PDF</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function deleteEmployee(index){
    employees.splice(index, 1);
    localStorage.setItem('employees', JSON.stringify(employees));
    renderTable();
}

// Print Payroll
document.getElementById('printPayroll').addEventListener('click', () => window.print());

// Generate PDF
function generatePDF(index){
    const emp = employees[index];
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Payslip", 105, 20, null, null, "center");
    doc.setFontSize(12);
    doc.text(`Employee: ${emp.name}`, 20, 40);
    doc.text(`Hours Worked: ${emp.hoursWorked}`, 20, 50);
    doc.text(`Hourly Rate: $${emp.rate.toFixed(2)}`, 20, 60);
    doc.text(`Normal Pay: $${emp.normalPay.toFixed(2)}`, 20, 70);
    doc.text(`Overtime Pay: $${emp.overtimePay.toFixed(2)}`, 20, 80);
    doc.text(`Gross Pay: $${emp.grossPay.toFixed(2)}`, 20, 90);
    doc.text(`Tax: $${emp.tax.toFixed(2)}`, 20, 100);
    doc.text(`Net Pay: $${emp.netPay.toFixed(2)}`, 20, 110);

    doc.save(`${emp.name}_Payslip.pdf`);
}