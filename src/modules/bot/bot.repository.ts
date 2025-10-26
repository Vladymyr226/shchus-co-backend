// import { db } from '../../common/db/knexKonfig'
// import {
//   TAdmin,
//   TCustomer,
//   TDeal,
//   TDistrict,
//   TEmployee,
//   TEmployeesServices,
//   TEmployeeWithServiceName,
//   TSalon,
//   TService,
// } from './bot.types'
// import moment from 'moment-timezone'

// const postVerifyPhoneNumber = async (): Promise<any> => {
//   return db.select('*').from('tg-bot-ai').returning('*')
// }

// const getCustomerByID = async ({ id, user_tg_id }: { id?: number; user_tg_id?: number }): Promise<Array<TCustomer>> => {
//   return db
//     .select('*')
//     .from('customers')
//     .modify((q) => {
//       if (id) q.where({ id })
//       if (user_tg_id) q.where({ user_tg_id })
//     })
//     .returning('*')
// }

// const getAdminByID = async ({
//   salon_id,
//   user_tg_id,
// }: {
//   salon_id?: number
//   user_tg_id?: number
// }): Promise<Array<TAdmin>> => {
//   return db
//     .select('*')
//     .from('admins')
//     .modify((q) => {
//       if (salon_id) q.where({ salon_id })
//       if (user_tg_id) q.where({ user_tg_id })
//     })
//     .returning('*')
// }

// const getAdminByTgIDEnable = async (user_tg_id: number): Promise<Array<TAdmin>> => {
//   return db.select('*').from('admins').where({ user_tg_id, enable: true }).returning('*')
// }

// const getChangeRoleByID = async (user_tg_id: number): Promise<Array<{ user_tg_id: number }>> => {
//   return db.select('*').from('change_role').where({ user_tg_id }).returning('*')
// }

// const getSalonByID = async ({ id, district_id }: { id?: number; district_id?: number }): Promise<Array<TSalon>> => {
//   return db
//     .select('*')
//     .from('salon')
//     .modify((q) => {
//       if (id) q.where({ id })
//       if (district_id) q.where({ district_id })
//     })
//     .returning('*')
// }

// const getServiceByID = async ({ id, salon_id }: { id?: number; salon_id?: number }): Promise<Array<TService>> => {
//   return db
//     .select('*')
//     .from('services')
//     .modify((q) => {
//       if (id) q.where({ id })
//       if (salon_id) q.where({ salon_id })
//     })
//     .returning('*')
// }

// const getDistricts = async (): Promise<Array<TDistrict>> => {
//   return db.select('*').from('districts').returning('*')
// }

// const getEmployeesByID = async ({ id, salon_id }: { id?: number; salon_id?: number }): Promise<Array<TEmployee>> => {
//   return db
//     .select('*')
//     .from('employees')
//     .modify((q) => {
//       if (id) q.where({ id })
//       if (salon_id) q.where({ salon_id })
//     })
//     .returning('*')
// }

// const getServicesByEmployeeID = async (employee_id: number): Promise<Array<TService>> => {
//   return db('employees_services as es')
//     .select('*')
//     .innerJoin('services as s', 'es.service_id', 's.id')
//     .where('es.employee_id', employee_id)
//     .returning('*')
// }

// const getDealByID = async ({
//   id,
//   employee_id,
//   salon_id,
//   customer_id,
// }: {
//   id?: number
//   employee_id?: number
//   salon_id?: number
//   customer_id?: number
// }): Promise<Array<TDeal>> => {
//   return db
//     .select('*')
//     .from('deals')
//     .modify((q) => {
//       if (id) q.where({ id })
//       if (employee_id) q.where({ employee_id })
//       if (salon_id) q.where({ salon_id })
//       if (customer_id) q.where({ customer_id })
//     })
//     .returning('*')
// }

// const insertCustomer = async (data: TCustomer): Promise<Array<TCustomer>> => {
//   return db('customers').insert(data).returning('*')
// }

// const putCustomer = async (user_tg_id: number, data: Partial<TCustomer>): Promise<Array<TCustomer>> => {
//   return db('customers').update(data).where({ user_tg_id }).returning('*')
// }

// const putAdmin = async (user_tg_id: number, data: Partial<TAdmin>): Promise<Array<TAdmin>> => {
//   return db('admins').update(data).where({ user_tg_id }).returning('*')
// }

// const putEmployee = async (id: number, data: Partial<TEmployee>): Promise<Array<TEmployee>> => {
//   return db('employees').update(data).where({ id }).returning('*')
// }

// const putService = async (id: number, data: Partial<TService>): Promise<Array<TService>> => {
//   return db('services').update(data).where({ id }).returning('*')
// }

// const insertAdmin = async (data: TAdmin): Promise<Array<TAdmin>> => {
//   return db('admins').insert(data).returning('*')
// }

// const insertEmployee = async (data: TEmployee): Promise<Array<TEmployee>> => {
//   return db('employees').insert(data).onConflict('id').merge().returning('*')
// }

// const insertService = async (data: TService): Promise<Array<TService>> => {
//   return db('services').insert(data).returning('*')
// }

// const insertEmployeesServices = async (data: TEmployeesServices): Promise<Array<TEmployeesServices>> => {
//   return db('employees_services').insert(data).returning('*')
// }

// const insertDeal = async (data: TDeal): Promise<Array<TDeal>> => {
//   return db('deals').insert(data).returning('*')
// }

// const deleteDeal = async (id: number): Promise<Array<TDeal>> => {
//   return db('deals').where({ id }).delete()
// }

// const deleteEmployee = async (id: number): Promise<Array<TEmployee>> => {
//   return db('employees').where({ id }).delete()
// }

// const deleteService = async (id: number): Promise<Array<TService>> => {
//   return db('services').where({ id }).delete()
// }

// const getEmployeeWithServices = async (): Promise<Array<TEmployeeWithServiceName>> => {
//   const employees = await db.select('*').from('employees')

//   const employeesWithServices = await Promise.all(
//     employees.map(async (employee) => {
//       const services = await db
//         .select('services.name')
//         .from('employees_services')
//         .innerJoin('services', 'employees_services.service_id', 'services.id')
//         .where('employees_services.employee_id', employee.id)

//       return {
//         ...employee,
//         services: services.map((service) => service.name),
//       }
//     }),
//   )

//   return employeesWithServices
// }

// const getDealsWithSalon = async ({
//   customer_id,
//   salon_id,
// }: {
//   customer_id?: number
//   salon_id?: number
// }): Promise<Array<any>> => {
//   const currentDateUTC = moment().utc().format('YYYY-MM-DD HH:mm:ss')

//   return db('deals')
//     .select(
//       'deals.id',
//       'deals.customer_id',
//       'deals.salon_id',
//       'deals.calendar_time',
//       'deals.notes',
//       'salon.name as salon_name',
//       'services.name as service_name',
//       'employees.first_name as employee_name',
//     )
//     .join('salon', 'deals.salon_id', 'salon.id')
//     .join('services', 'deals.service_id', 'services.id')
//     .join('employees', 'deals.employee_id', 'employees.id')
//     .modify((q) => {
//       if (salon_id) q.where('deals.salon_id', salon_id)
//       if (customer_id) q.where('deals.customer_id', customer_id)
//     })
//     .andWhere('deals.calendar_time', '>', currentDateUTC)
//     .orderBy('deals.calendar_time', 'asc')
//     .returning('*')
// }

// const getDealsRemember = async (): Promise<Array<TDeal>> => {
//   const utcTime = moment().utc().format('YYYY-MM-DD HH:mm:ss')

//   return db
//     .select('*')
//     .from('deals')
//     .whereRaw('EXTRACT(HOUR FROM age(?, calendar_time)) BETWEEN 1 AND 2', [utcTime])
//     .returning('*')
// }

// const getMonthlyCustomerCount = async (
//   salon_id: number,
// ): Promise<Array<{ start_date: string; end_date: string; total_customers: string }>> => {
//   const currentDate = moment().tz('Europe/Kiev')

//   const startDate = currentDate.clone().subtract(1, 'months').startOf('month').format('YYYY-MM-DD HH:mm:ss')
//   const endDate = currentDate.clone().subtract(1, 'months').endOf('month').format('YYYY-MM-DD HH:mm:ss')

//   return db
//     .select(
//       db.raw(`? as start_date`, [moment(startDate).format('DD-MM-YYYY')]),
//       db.raw(`? as end_date`, [moment(endDate).format('DD-MM-YYYY')]),
//     )
//     .from('deals')
//     .count('customer_id as total_customers')
//     .where({ salon_id })
//     .andWhere('calendar_time', '>=', startDate)
//     .andWhere('calendar_time', '<=', endDate)
// }

// const getMonthlyRevenue = async (
//   salon_id: number,
// ): Promise<Array<{ start_date: string; end_date: string; total_revenue: string }>> => {
//   const currentDate = moment().tz('Europe/Kiev')

//   const startDate = currentDate.clone().subtract(1, 'months').startOf('month').format('YYYY-MM-DD HH:mm:ss')
//   const endDate = currentDate.clone().subtract(1, 'months').endOf('month').format('YYYY-MM-DD HH:mm:ss')

//   return db
//     .select(
//       db.raw(`? as start_date`, [moment(startDate).format('DD-MM-YYYY')]),
//       db.raw(`? as end_date`, [moment(endDate).format('DD-MM-YYYY')]),
//     )
//     .sum('services.price as total_revenue')
//     .from('deals')
//     .join('services', 'deals.service_id', '=', 'services.id')
//     .where('deals.salon_id', salon_id)
//     .andWhere('deals.calendar_time', '>=', startDate)
//     .andWhere('deals.calendar_time', '<=', endDate)
// }

// const getMonthlyEmployeeCustomerCount = async (
//   salon_id: number,
// ): Promise<{
//   startDate: string
//   endDate: string
//   customerCount: Array<{ employee_name: string; total_customers: string }>
// }> => {
//   const currentDate = moment().tz('Europe/Kiev')

//   const startDate = currentDate.clone().subtract(1, 'months').startOf('month').format('YYYY-MM-DD HH:mm:ss')
//   const endDate = currentDate.clone().subtract(1, 'months').endOf('month').format('YYYY-MM-DD HH:mm:ss')

//   const customerCount: Array<{ employee_name: string; total_customers: string }> = await db()
//     .select('employees.first_name as employee_name')
//     .from('deals')
//     .count('customer_id as total_customers')
//     .join('employees', 'deals.employee_id', 'employees.id')
//     .where('deals.salon_id', salon_id)
//     .andWhere('calendar_time', '>=', startDate)
//     .andWhere('calendar_time', '<=', endDate)
//     .groupBy('employees.id', 'employees.first_name')

//   return {
//     startDate: moment(startDate).format('DD-MM-YYYY'),
//     endDate: moment(endDate).format('DD-MM-YYYY'),
//     customerCount,
//   }
// }

// const getPopularServices = async (
//   salon_id: number,
// ): Promise<{
//   startDate: string
//   endDate: string
//   serviceCount: Array<{ service_name: string; total_usages: string }>
// }> => {
//   const currentDate = moment().tz('Europe/Kiev')

//   const startDate = currentDate.clone().subtract(1, 'months').startOf('month').format('YYYY-MM-DD HH:mm:ss')
//   const endDate = currentDate.clone().subtract(1, 'months').endOf('month').format('YYYY-MM-DD HH:mm:ss')

//   const serviceCount = await db('deals')
//     .select('services.name as service_name')
//     .count('deals.service_id as total_usages')
//     .join('services', 'deals.service_id', 'services.id')
//     .where('deals.salon_id', salon_id)
//     .andWhere('calendar_time', '>=', startDate)
//     .andWhere('calendar_time', '<=', endDate)
//     .groupBy('services.name')
//     .orderBy('total_usages', 'desc')
//     .limit(10)

//   return {
//     startDate: moment(startDate).format('DD-MM-YYYY'),
//     endDate: moment(endDate).format('DD-MM-YYYY'),
//     serviceCount,
//   }
// }

// const getReplicateEnable = async (id: number): Promise<Array<{ id: number }>> => {
//   return db('salon')
//     .select('salon.id', 'customers.id')
//     .join('customers', 'salon.id', '=', 'customers.salon_id') // Замените на соответствующие поля для связи
//     .where('salon.replicate_enable', true)
//     .andWhere('customers.replicate_enable', true)
//     .andWhere('customers.id', id)
// }

// export const botRepository = {
//   getCustomerByID,
//   getAdminByID,
//   getAdminByTgIDEnable,
//   getEmployeeWithServices,
//   getDistricts,
//   getEmployeesByID,
//   getSalonByID,
//   getServiceByID,
//   getServicesByEmployeeID,
//   getDealByID,
//   getDealsWithSalon,
//   getDealsRemember,
//   getChangeRoleByID,
//   insertCustomer,
//   insertAdmin,
//   insertEmployee,
//   insertService,
//   insertEmployeesServices,
//   insertDeal,
//   putCustomer,
//   putAdmin,
//   putEmployee,
//   putService,
//   deleteDeal,
//   deleteEmployee,
//   deleteService,
//   getMonthlyCustomerCount,
//   getMonthlyRevenue,
//   getMonthlyEmployeeCustomerCount,
//   getPopularServices,
//   getReplicateEnable,
//   postVerifyPhoneNumber,
// }
