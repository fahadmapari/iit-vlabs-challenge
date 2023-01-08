// selecting elements
const invoicesBody = document.getElementById("invoicesBody");
const beginInput = document.getElementById("beginInput");
const endInput = document.getElementById("endInput");
const statusInput = document.getElementById("statusInput");
const clientInput = document.getElementById("clientInput");
const tableHeaders = document.querySelectorAll("th");

// variable to store all invoices initially and to be used in further filtering
let invoices = [];
// variable to store filtered invoices
let filteredInvoices;

// variables used for filtering invoices
let startDate = new Date(0);
let endDate = new Date();
let status = "any";
let clientType = "any";

// variable to decide wether to sort invoices in ASC or DESC
let sortState = "";

// fetching all invoices initially, rendering all the rows, and storing it invoices variable for further use
fetch("./data.json")
  .then((res) => res.json())
  .then((data) => {
    invoices = data;
    renderRows(invoices);
  })
  .catch((err) => alert(err.message));

// helper function to render rows whenever neeeded
const renderRows = (rows) => {
  invoicesBody.innerHTML = ``;
  rows.forEach((invoice) => {
    invoicesBody.insertAdjacentHTML(
      "beforeend",
      `
    <tr>
      <td class="invoice-data invoice-number">${invoice.invoiceId}</td>
      <td class="invoice-data invoice-client-name">${invoice.clientName}</td>
      <td class="invoice-data invoice-client-type">${invoice.clientType}</td>
      <td class="invoice-data invoice-date">${invoice.date}</td>
      <td class="invoice-data invoice-due-date">${invoice.dueDate}</td>
      <td class="invoice-data invoice-total">$${invoice.total}</td>
      <td class="invoice-data invoice-balance">$${invoice.balance}</td>
      <td class="invoice-data invoice-status">
        <span class="status-type ${invoice.status}">${invoice.status}</span>
      </td>
    </tr>
    `
    );
  });
};

// helper function to convert date format from
// dd-mm-yyyy to yyyy-mm-dd as I have assumed that
// challenge example is having the
// date in dd-mm-yyyy and javascript date constructor
// expects the passed date to in yyyy-mm-dd
const formatDate = (date) => {
  const dateToFormat = date.split("-");
  const formatedDate = `${dateToFormat[2]}-${dateToFormat[1]}-${dateToFormat[0]}`;

  return formatedDate;
};

//helper function to remove spaces from a string
// Used it to remove status from status property while filtering
const formatString = (string) => {
  const formatedString = string.toLowerCase().replaceAll(" ", "");
  return formatedString;
};

// helper function to filter invoices based on changes made to filter variables
const filterInvoices = () => {
  filteredInvoices = invoices.filter((invoice) => {
    return (
      new Date(formatDate(invoice.date)) >= startDate &&
      new Date(formatDate(invoice.date)) <= endDate &&
      (status === "any" ? true : formatString(invoice.status) === status) &&
      (clientType === "any" ? true : invoice.clientType == clientType)
    );
  });

  renderRows(filteredInvoices);
};

// function to sort the invoices it takes the column on which the sort should be based on as a parameter
const sortInvoices = (sortColumn) => {
  const sortedInvoices = filteredInvoices ? filteredInvoices : invoices;

  // using the sortState variable to decide DESC or ASC sort
  if (sortColumn === "" || sortColumn !== sortState) {
    if (sortColumn === "date" || sortColumn === "dueDate") {
      sortedInvoices.sort((a, b) => {
        return (
          new Date(formatDate(b[sortColumn])) -
          new Date(formatDate(a[sortColumn]))
        );
      });
    } else {
      sortedInvoices.sort((a, b) => {
        return isNaN(parseInt(a[sortColumn]))
          ? b[sortColumn].localeCompare(a[sortColumn])
          : parseInt(b[sortColumn]) - parseInt(a[sortColumn]);
      });
    }

    //toggling sortState
    sortState = sortColumn;
  } else {
    if (sortColumn === "date" || sortColumn === "dueDate") {
      sortedInvoices.sort((a, b) => {
        return (
          new Date(formatDate(a[sortColumn])) -
          new Date(formatDate(b[sortColumn]))
        );
      });
    } else {
      sortedInvoices.sort((a, b) => {
        return isNaN(parseInt(a[sortColumn]))
          ? a[sortColumn].localeCompare(b[sortColumn])
          : parseInt(a[sortColumn]) - parseInt(b[sortColumn]);
      });
    }

    //toggling sortState
    sortState = "";
  }

  renderRows(sortedInvoices);
};

// setting event listener for filtering and sorting

beginInput.addEventListener("change", (e) => {
  startDate = new Date(e.target.value);
  filterInvoices();
});

endInput.addEventListener("change", (e) => {
  endDate = new Date(e.target.value);
  filterInvoices();
});

clientInput.addEventListener("change", (e) => {
  clientType = e.target.value;
  filterInvoices();
});

statusInput.addEventListener("change", (e) => {
  status = e.target.value;
  filterInvoices();
});

tableHeaders.forEach((tableHeader) => {
  tableHeader.addEventListener("click", (e) => {
    sortInvoices(e.target.dataset.id);
  });
});
