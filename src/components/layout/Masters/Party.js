import MasterData from "./MasterData";

const PartyMaster = () => {
  const initialCustomers = [
    {
      id: 1,
      name: "ABC TRADING COMPANY",
      code: "CUST001",
      address: "123 MAIN STREET, KUALA LUMPUR",
      contactPerson: "Mr. Tan",
      phone: "+60 3 1234 5678",
      email: "tan@abctrading.com",
      creditLimit: 10000,
      status: "Active",
    },
  ];

  const customerFields = [
    { name: 'name', label: 'Customer Name', required: true, placeholder: 'Enter customer name', colSpan: 3 },
    { name: 'code', label: 'Customer Code', placeholder: 'Enter customer code', colSpan: 2 },
    { name: 'contactPerson', label: 'Contact Person', placeholder: 'Enter contact person', colSpan: 3, subField: 'phone' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'Active', label: 'Active' },
      { value: 'Inactive', label: 'Inactive' }
    ], colSpan: 1 },
    { name: 'address', label: 'Address', placeholder: 'Enter full address', fullWidth: true },
    { name: 'phone', label: 'Phone', type: 'tel', placeholder: 'Enter phone number' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter email address' },
    { name: 'creditLimit', label: 'Credit Limit', type: 'number', placeholder: 'Enter credit limit' },
  ];

  return (
    <MasterData
      title="Customers"
      initialData={initialCustomers}
      fields={customerFields}
      searchableFields={['name', 'code', 'contactPerson', 'email']}
    />
  );
};

export default PartyMaster;