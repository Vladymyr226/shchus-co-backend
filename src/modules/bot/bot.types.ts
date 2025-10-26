export type TCustomer = {
  id?: number
  user_tg_id: number
  salon_id?: number
  username: string
  chat_id?: number
  phone_number?: string
  first_name?: string
  last_name?: string
  replicate_enable?: boolean
  created_at?: Date
  updated_at?: Date
}

export type TAdmin = {
  id?: number
  user_tg_id: number
  salon_id: number
  chat_id: number
  username: string
  phone_number?: string
  first_name?: string
  last_name?: string
  enable?: boolean
  created_at?: Date
  updated_at?: Date
}

export type TSalon = {
  id?: number
  name: string
  description: string
  address: string
  website: string
  work_hour_from?: string
  work_hour_to?: string
  district_id?: number
  replicate_enable?: boolean
  created_at?: Date
  updated_at?: Date
}

export type TService = {
  id?: number
  salon_id: number
  name: string
  description: string
  price: number
  created_at?: Date
  updated_at?: Date
}

export type TDistrict = {
  id?: number
  name: string
  created_at?: Date
  updated_at?: Date
}

export type TEmployee = {
  id?: number
  salon_id: number
  phone?: string
  first_name?: string
  duration?: number
  work_hour_from?: string
  work_hour_to?: string
  created_at?: Date
  updated_at?: Date
}

export type TEmployeesServices = {
  id?: number
  employee_id: number
  service_id: number
  created_at?: Date
  updated_at?: Date
}

export type TDeal = {
  id?: number
  salon_id: number
  service_id: number
  customer_id: number
  employee_id: number
  notes?: string
  calendar_time: string
  created_at?: Date
  updated_at?: Date
}

export type TEmployeeWithServiceName = TEmployee & { services: Array<Pick<TService, 'name'>['name']> }

export type TAdditionalType = {
  step: string
  calendarTimeResponse?: string
  employee_id?: number
}
