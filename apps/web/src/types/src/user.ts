export interface User {
    id: string;
    email: string;
    username: string;
    createdAt: string;
    updatedAt: string;
  }
  
  
  export interface UserWithPassword extends User {
    password: string;
  }