
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
}

export interface Association {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  createdAt: string;
  blocksCount?: number;
  apartmentsCount?: number;
}

export interface Block {
  id: string;
  name: string;
  address: string;
  associationId: string;
  associationName: string;
  apartmentsCount?: number;
  createdAt: string;
}

export interface Apartment {
  id: string;
  number: string;
  floor: number;
  area: number;
  blockId: string;
  blockName: string;
  ownerId?: string;
  ownerName?: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  blockId: string;
  blockName: string;
  dueDate: string;
  createdAt: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
}

export interface ApartmentExpense {
  id: string;
  apartmentId: string;
  expenseId: string;
  amount: number;
  dueDate: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  expense: Expense;
}

export interface Payment {
  id: string;
  apartmentId: string;
  expenseId: string;
  amount: number;
  paymentDate: string;
  method: 'CASH' | 'CARD' | 'TRANSFER';
  reference?: string;
}

export interface MeterReading {
  id: string;
  apartmentId: string;
  meterType: 'WATER' | 'GAS' | 'ELECTRICITY';
  currentReading: number;
  previousReading?: number;
  readingDate: string;
  consumption?: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  blockId: string;
  blockName: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  authorName: string;
}

export interface RepairRequest {
  id: string;
  description: string;
  location: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
  apartmentId: string;
  blockId: string;
  createdAt: string;
  tenantName: string;
}

export interface DashboardStats {
  totalAssociations?: number;
  totalBlocks?: number;
  totalApartments?: number;
  totalExpenses?: number;
  pendingPayments?: number;
  pendingRepairs?: number;
  totalRevenue?: number;
  occupancyRate?: number;
}

export enum UserRole {
  ADMIN_ASSOCIATION = 'ADMIN_ASSOCIATION',
  BLOCK_ADMIN = 'BLOCK_ADMIN',
  LOCATAR = 'LOCATAR',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  TRANSFER = 'TRANSFER',
}