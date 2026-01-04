export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "admin" | "customer";
  created_at: string;
  updated_at: string;
}
export interface UserSignUp {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: "admin" | "customer";
}
export interface UserLogin {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "customer";
}

export interface Vehicle {
  id: number;
  vehicle_name: string;
  type: "car" | "bike" | "van" | "SUV";
  registration_number: string;
  daily_rent_price: number;
  availability_status: "available" | "booked";
  created_at?: string;
  updated_at?: string;
}
export interface CreateVehicle {
  vehicle_name: string;
  type: "car" | "bike" | "van" | "SUV";
  registration_number: string;
  daily_rent_price: number;
  availability_status: "available" | "booked";
}

export interface UpdateVehicle {
  vehicle_name?: string;
  type?: "car" | "bike" | "van" | "SUV";
  registration_number?: string;
  daily_rent_price?: number;
  availability_status?: "available" | "booked";
}

export interface Booking {
  id: number;
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
  total_price: number;
  status: "active" | "cancelled" | "returned";
  created_at?: string;
  updated_at?: string;
}

export interface CreateBooking {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
}

export interface UpdateBooking {
  status: "active" | "cancelled" | "returned";
}
