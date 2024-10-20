const generateInvoiceNumber = () => {
    const date = new Date();

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;

    const counter = String(Math.floor(Math.random() * 1000)).padStart(3, '0');

    return `INV${timestamp}-${counter}`;
};

export { generateInvoiceNumber };