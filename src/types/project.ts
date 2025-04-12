export type ProjectType = {
    id: string;
    name: string;
    client: string;
    status: string;
    environment: string;
    IPaddress: string;
    license_status: string;
    licence_expiry_date: string;
    initial_key: string;
    numberOfUsers: string;
    country: string;
    solution: string;
    customer: {name: string;
      country: string;
      address: string;
      status: string;};
    customerId: string;
    createdAt: string;
    updatedAt: string;
  }

  export type ServerProjectType = {
    id: string;
    name: string;
    client: string;
    status: string;
    environment: string;
    IPaddress: string;
    address: string;
    license_status: string;
    licence_expiry_date: string;
    initial_key: string;
    numberOfUsers: string;
    country: string;
    solution: string;
    customer: string;
    customerId: string;
    createdAt: string;
    updatedAt: string;
  }