const invoicesBody = document.getElementById("invoicesBody");
const beginInput = document.getElementById("beginInput");
const endInput = document.getElementById("endInput");
const statusInput = document.getElementById("statusInput");
const clientInput = document.getElementById("clientInput");
const tableHeaders = document.querySelectorAll("th");

let invoices = [];
let filteredInvoices;

let startDate = new Date(0);
let endDate = new Date();
let status = "any";
let clientType = "any";

let sortState = "";

fetch("./data.json")
  .then((res) => res.json())
  .then((data) => {
    invoices = data;
    renderRows(invoices);
  })
  .catch((err) => alert(err.message));

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

const formatDate = (date) => {
  const dateToFormat = date.split("-");
  const formatedDate = `${dateToFormat[2]}-${dateToFormat[1]}-${dateToFormat[0]}`;

  return formatedDate;
};

const formatString = (string) => {
  const formatedString = string.toLowerCase().replaceAll(" ", "");
  return formatedString;
};

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

const sortInvoices = (sortColumn) => {
  const sortedInvoices = filteredInvoices ? filteredInvoices : invoices;

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
        return parseInt(a[sortColumn]) === NaN
          ? b[sortColumn].localeCompare(a[sortColumn])
          : parseInt(b[sortColumn]) - parseInt(a[sortColumn]);
      });
    }

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
        return parseInt(a[sortColumn]) === NaN
          ? a[sortColumn].localeCompare(b[sortColumn])
          : parseInt(a[sortColumn]) - parseInt(b[sortColumn]);
      });
    }

    sortState = "";
  }
  renderRows(sortedInvoices);
};

tableHeaders.forEach((tableHeader) => {
  tableHeader.addEventListener("click", (e) => {
    sortInvoices(e.target.dataset.id);
  });
});

// switch (key) {
//   case "invoice":
//     break;

//   case "client-name":
//     break;

//   case "client-type":
//     break;

//   case "date":
//     break;

//   case "due-date":
//     break;

//   case "due-date":
//     break;

//   case "total":
//     break;

//   case "balance":
//     break;

//   case "balance":
//     break;

//   case "status":
//     break;

//   default:
//     break;
// }
