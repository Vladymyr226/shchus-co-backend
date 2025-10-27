import db from '../../../db/knexKonfig'
import getBotInstance from '../../common/bot'

const bot = getBotInstance()

// Интерфейс для задачи с информацией о пользователе
interface KpiTaskWithUser {
  id: number
  text: string
  deadline: Date
  user_id: number
  user_tg_id: number
  chat_id: number
  phone: string
  first_name: string
  last_name: string
}

// Получение просроченных задач с информацией о пользователях
const getOverdueTasks = async (): Promise<KpiTaskWithUser[]> => {
  try {
    const now = new Date()
    
    // Форматируем текущее время до минуты (убираем секунды и миллисекунды)
    const currentMinute = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes())
    
    const overdueTasks = await db('kpi-tasks as kt')
      .select(
        'kt.id',
        'kt.text',
        'kt.deadline',
        'kt.user_id',
        'bu.user_tg_id',
        'bu.chat_id',
        'bu.phone',
        'bu.first_name',
        'bu.last_name'
      )
      .join('bot_users as bu', 'kt.user_id', 'bu.user_id')
      .where('kt.is_completed', false)
      .whereRaw('DATE_TRUNC(\'minute\', kt.deadline) = ?', [currentMinute])
      .whereNotNull('bu.chat_id')
      .whereNotNull('bu.phone')
      .orderBy('kt.deadline', 'asc')

    return overdueTasks
  } catch (error) {
    console.error('Error getting overdue tasks:', error)
    return []
  }
}

// Функция для определения приветствия по времени суток
const getGreeting = (): string => {
  const hour = new Date().getHours()
  
  if (hour >= 5 && hour < 12) {
    return 'Доброе утро'
  } else if (hour >= 12 && hour < 18) {
    return 'Добрый день'
  } else {
    return 'Добрый вечер'
  }
}

// Форматирование сообщения о просроченной задаче
const formatOverdueTaskMessage = (task: KpiTaskWithUser): string => {
  const deadline = new Date(task.deadline)
  const deadlineStr = deadline.toLocaleString('uk-UA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })

  const greeting = getGreeting()

  return `${greeting}! 🚨 *Истекает дедлайн задачи KPI*

📝 *Задача:* ${task.text}
⏰ *Дедлайн:* ${deadlineStr}

Время выполнения задачи истекает прямо сейчас!`
}

// Отправка уведомления пользователю
const sendNotificationToUser = async (task: KpiTaskWithUser): Promise<boolean> => {
  try {
    const message = formatOverdueTaskMessage(task)
    
    await bot.sendMessage(task.chat_id, message, {
      parse_mode: 'Markdown'
    })

    console.log(`Notification sent to user ${task.user_id} (phone: ${task.phone}) for task ${task.id}`)
    return true
  } catch (error) {
    console.error(`Error sending notification to user ${task.user_id} for task ${task.id}:`, error)
    return false
  }
}

// Основная функция для проверки и отправки уведомлений о задачах с истекающим дедлайном
export const checkAndNotifyOverdueTasks = async (): Promise<void> => {
  try {
    console.log('Starting tasks with expiring deadlines check...')
    
    const overdueTasks = await getOverdueTasks()
    
    if (overdueTasks.length === 0) {
      console.log('No tasks with deadlines expiring this minute')
      return
    }

    console.log(`Found ${overdueTasks.length} tasks with deadlines expiring this minute`)

    // Группируем задачи по пользователям
    const tasksByUser = new Map<number, KpiTaskWithUser[]>()
    
    for (const task of overdueTasks) {
      if (!tasksByUser.has(task.user_id)) {
        tasksByUser.set(task.user_id, [])
      }
      tasksByUser.get(task.user_id)!.push(task)
    }

    // Отправляем уведомления каждому пользователю
    let successCount = 0
    let errorCount = 0

    for (const [userId, userTasks] of tasksByUser) {
      try {
        // Если у пользователя несколько просроченных задач, отправляем сводное сообщение
        if (userTasks.length > 1) {
          const user = userTasks[0]
          const greeting = getGreeting()
          const message = `${greeting}! 🚨 *У вас ${userTasks.length} задач KPI с истекающим дедлайном*

${userTasks.map((task, index) => {
  const deadline = new Date(task.deadline)
  const deadlineStr = deadline.toLocaleString('uk-UA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
  return `${index + 1}. ${task.text}\n   ⏰ ${deadlineStr}`
}).join('\n\n')}

Время выполнения этих задач истекает прямо сейчас!`

          await bot.sendMessage(user.chat_id, message, {
            parse_mode: 'Markdown'
          })
          
          console.log(`Bulk notification sent to user ${userId} (phone: ${user.phone}) for ${userTasks.length} tasks`)
          successCount++
        } else {
          // Отправляем индивидуальное сообщение для одной задачи
          const success = await sendNotificationToUser(userTasks[0])
          if (success) {
            successCount++
          } else {
            errorCount++
          }
        }
      } catch (error) {
        console.error(`Error processing tasks for user ${userId}:`, error)
        errorCount++
      }
    }

    console.log(`Overdue tasks check completed. Success: ${successCount}, Errors: ${errorCount}`)
  } catch (error) {
    console.error('Error in checkAndNotifyOverdueTasks:', error)
  }
}

