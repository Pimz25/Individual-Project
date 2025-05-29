'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { Trash2 } from 'lucide-react'
import { Input } from '../ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { Badge } from '../ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { v4 as uuidv4 } from 'uuid'

export default function PlaningTasks() {
  const [tasks, setTasks] = useState<
    {
      id: string
      context: string
      status: 'Planing' | 'In progress' | 'Done'
    }[]
  >([])
  const [filterTasks, setFilterTasks] = useState<
    {
      id: string
      context: string
      status: 'Planing' | 'In progress' | 'Done'
    }[]
  >([])

  const [input, setInput] = useState('')
  const [activeTab, setActiveTab] = useState<
    'All tasks' | 'In progress' | 'Done'
  >('All tasks')

  function addTask() {
    if (input.trim() === '') return
    const newTasks: typeof tasks = [
      ...tasks,
      { id: uuidv4(), context: input.trim(), status: 'Planing' },
    ]
    setTasks(newTasks)

    // Update filtered tasks based on activeTab
    if (activeTab === 'All tasks') {
      setFilterTasks(newTasks)
    } else {
      setFilterTasks(newTasks.filter((task) => task.status === activeTab))
    }
    setInput('')
  }

  function removeTask(id: string) {
    const newTasks = tasks.filter((task) => task.id !== id)
    setTasks(newTasks)
    if (activeTab === 'All tasks') {
      setFilterTasks(newTasks)
    } else {
      setFilterTasks(newTasks.filter((task) => task.status === activeTab))
    }
  }

  function handleChangeStatus(
    id: string,
    status: 'Planing' | 'In progress' | 'Done',
  ) {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, status } : task,
    )
    setTasks(updatedTasks)
    if (activeTab === 'All tasks') {
      setFilterTasks(updatedTasks)
    } else {
      setFilterTasks(updatedTasks.filter((task) => task.status === activeTab))
    }
  }

  function handleChangeTab(tab: 'All tasks' | 'In progress' | 'Done') {
    setActiveTab(tab)
    if (tab === 'All tasks') {
      setFilterTasks(tasks)
    } else {
      setFilterTasks(tasks.filter((task) => task.status === tab))
    }
  }

  return (
    <div className="w-[50vw] p-8 my-[10vh] max-h-[80vh] max-w-[800px] bg-white rounded-lg shadow-lg flex flex-col">
      <h2 className="text-4xl font-bold mb-6 text-center">Planing Tasks</h2>

      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add new task"
          className="flex-grow"
          onKeyDown={(e) => {
            if (e.key === 'Enter') addTask()
          }}
        />
        <Button onClick={addTask} className="bg-blue-600 hover:bg-blue-700">
          Add
        </Button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-gray-500 italic text-center">No tasks yet</p>
      ) : (
        <Table className="flex-grow overflow-auto">
          <TableHeader>
            <TableRow className="text-lg">
              <TableHead className="w-full">Task</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filterTasks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-gray-500 italic"
                >
                  No
                  <span className="font-semibold">
                    {activeTab === 'In progress'
                      ? ' tasks in progress '
                      : ' completed tasks '}
                  </span>
                  yet
                </TableCell>
              </TableRow>
            ) : (
              filterTasks.map((task) => (
                <TableRow key={task.id} className="hover:cursor-pointer">
                  <TableCell className="whitespace-normal break-words">
                    {task.context}
                  </TableCell>
                  <TableCell className="italic max-w-[121px] text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Badge
                          className="hover:cursor-pointer"
                          variant={
                            task.status === 'Planing'
                              ? 'secondary'
                              : task.status === 'In progress'
                                ? 'default'
                                : task.status === 'Done'
                                  ? 'success'
                                  : 'outline'
                          }
                        >
                          {task.status}
                        </Badge>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="italic">
                        {['Planing', 'In progress', 'Done']
                          .filter((status) => status !== task.status)
                          .map((statusOption, i) => (
                            <DropdownMenuItem
                              key={i}
                              onClick={() =>
                                handleChangeStatus(
                                  task.id,
                                  statusOption as typeof task.status,
                                )
                              }
                              className="hover:cursor-pointer"
                            >
                              {statusOption}
                            </DropdownMenuItem>
                          ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      onClick={() => removeTask(task.id)}
                      variant="destructive"
                      size="icon"
                      className="opacity-70 hover:cursor-pointer hover:opacity-100"
                      aria-label={`Remove ${task.context}`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      {tasks.length !== 0 && (
        <div className="flex justify-between text-sm italic mt-4">
          {['All tasks', 'In progress', 'Done'].map((tab) => (
            <p
              key={tab}
              onClick={() =>
                handleChangeTab(tab as 'All tasks' | 'In progress' | 'Done')
              }
              className={`px-4 cursor-pointer underline transition-opacity ${
                activeTab === tab
                  ? 'opacity-100 font-semibold'
                  : 'opacity-50 hover:opacity-100'
              }`}
            >
              {tab}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
