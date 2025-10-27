import cron from 'node-cron'
import { checkAndNotifyOverdueTasks } from './kpi-notifications.service'

// Настройка cron jobs
export const setupCronJobs = (): void => {
  console.log('Setting up cron jobs...')

  // Проверка задач с истекающим дедлайном каждую минуту
  cron.schedule('* * * * *', async () => {
    console.log('Running tasks with expiring deadlines check...')
    await checkAndNotifyOverdueTasks()
  }, {
    timezone: 'Europe/Kiev'
  })

  console.log('Cron jobs setup completed')
}

// Функция для ручного запуска проверки (для тестирования)
export const runManualCheck = async (): Promise<void> => {
  console.log('Running manual check...')
  await checkAndNotifyOverdueTasks()
  console.log('Manual check completed')
}

// Функция для остановки всех cron jobs
export const stopCronJobs = (): void => {
  console.log('Stopping all cron jobs...')
  cron.getTasks().forEach(task => {
    task.stop()
  })
  console.log('All cron jobs stopped')
}
