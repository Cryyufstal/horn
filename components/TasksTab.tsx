// components/TasksTab.tsx

/**
 * This project was developed by Nikandr Surkov.
 * 
 * YouTube: https://www.youtube.com/@NikandrSurkov
 * GitHub: https://github.com/nikandr-surkov
 */

'use client'

import Image, { StaticImageData } from 'next/image'
import { useState } from 'react'

// Import your task icons
import TaskWallet from '@/icons/TaskWallet'
import TaskPaws from '@/icons/TaskPaws'
import TaskTwitter from '@/icons/TaskTwitter'
import { taskBlum, taskBoost, taskWhitePaws } from '@/images'
import TaskTelegram from '@/icons/TaskTelegram'
import TaskInvite from '@/icons/TaskInvite'

const TasksTab = () => {
  const [activeTab, setActiveTab] = useState('in-game')
  const [taskStatus, setTaskStatus] = useState({}) // تخزين حالة كل مهمة (Start أو Check)
  const [hiddenTasks, setHiddenTasks] = useState([]) // تخزين قائمة المهام المخفية

  const tasks = [
    { id: 1, title: 'Complete Level 1', reward: '10 Points', icon: '/path/to/icon1.png', url: 'https://example.com/task1' },
    { id: 2, title: 'Win a Match', reward: '15 Points', icon: '/path/to/icon2.png', url: 'https://example.com/task2' },
  ]

  const partnerTasks = [
    { id: 3, title: 'Share with Friends', reward: '20 Points', icon: '/path/to/icon3.png', url: 'https://example.com/task3' },
  ]

  const handleTaskAction = (taskId) => {
    if (!taskStatus[taskId]) {
      // إذا كانت المهمة في حالة "Start"، افتح الرابط وقم بتحديث الحالة إلى "Check"
      const task = tasks.concat(partnerTasks).find((t) => t.id === taskId)
      if (task?.url) window.open(task.url, '_blank')
      setTaskStatus((prev) => ({ ...prev, [taskId]: 'Check' }))
    } else if (taskStatus[taskId] === 'Check') {
      // إذا كانت المهمة في حالة "Check"، قم بإخفاء المهمة
      setHiddenTasks((prev) => [...prev, taskId]) // إضافة المهمة إلى قائمة المخفية
    }
  }

  const filteredTasks = (activeTab === 'in-game' ? tasks : partnerTasks).filter(
    (task) => !hiddenTasks.includes(task.id) // استبعاد المهام المخفية
  )

  return (
    <div className={`quests-tab-con px-4 transition-all duration-300`}>
      {/* Header */}
      <div className="pt-8">
        <h1 className="text-3xl font-bold mb-2">TASKS</h1>
        <div>
          <span className="text-xl font-semibold">GET REWARDS </span>
          <span className="text-xl text-gray-500">FOR</span>
        </div>
        <div className="text-xl text-gray-500">COMPLETING QUESTS</div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-0 mt-6">
        <button
          onClick={() => setActiveTab('in-game')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition duration-300 
            ${activeTab === 'in-game' ? 'bg-white text-black' : 'bg-[#151515] text-white'}`}
        >
          In-game
        </button>
        <button
          onClick={() => setActiveTab('partners')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition duration-300 
            ${activeTab === 'partners' ? 'bg-white text-black' : 'bg-[#151515] text-white'}`}
        >
          Partners
          <div className="bg-[#5a5a5a] text-[#fefefe] size-4 rounded-full flex items-center justify-center text-[11px]">
            1
          </div>
        </button>
      </div>

      {/* Tasks List */}
      <div className="mt-4 mb-20 bg-[#151516] rounded-xl">
        {filteredTasks.map((task, index) => (
          <div key={task.id} className="flex items-center">
            <div className="w-[72px] flex justify-center">
              <div className="w-10 h-10">
                <Image
                  src={task.icon}
                  alt={task.title}
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className={`flex items-center justify-between w-full py-4 pr-4 ${index !== 0 && "border-t border-[#222622]"}`}>
              <div>
                <div className="text-[17px]">{task.title}</div>
                <div className="text-gray-400 text-[14px]">{task.reward}</div>
              </div>
              <button
                className={`h-8 px-4 rounded-full text-sm font-medium flex items-center 
                  ${taskStatus[task.id] === 'Check' ? 'bg-gray-400 text-white' : 'bg-white text-black'}`}
                onClick={() => handleTaskAction(task.id)}
              >
                {taskStatus[task.id] || 'Start'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TasksTab
