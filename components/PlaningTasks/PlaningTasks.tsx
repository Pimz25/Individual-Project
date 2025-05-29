'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { AlignJustify, ChevronDown } from 'lucide-react'
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from '../ui/sheet'

import type { Task } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'

export default function PlaningTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filterTasks, setFilterTasks] = useState<Task[]>([])
  const [input, setInput] = useState('')
  const [activeTab, setActiveTab] = useState<
    'All tasks' | 'In progress' | 'Done'
  >('All tasks')
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<null | (typeof tasks)[0]>(
    null,
  )
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const columns = ['Task title', 'Description', 'Last updated', 'Status', '']

  function addTask() {
    if (input.trim() === '') return
    const newTasks: typeof tasks = [
      ...tasks,
      {
        id: uuidv4(),
        name: input.trim(),
        updated: updateTime(),
        status: 'Planing',
      },
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
      task.id === id ? { ...task, updated: updateTime(), status } : task,
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

  function updateTime() {
    return {
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    }
  }

  return (
    <>
      <div className="w-[80vw] p-8 my-[10vh] max-h-[80vh] bg-white rounded-lg shadow-lg flex flex-col">
        <h2 className="text-4xl font-bold mb-6 text-center">Planing Tasks</h2>
        <div className="flex gap-5 items-center py-4">
          <Input
          // placeholder="Filter emails..."
          // value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          // onChange={(event) =>
          //   table.getColumn('email')?.setFilterValue(event.target.value)
          // }
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })} */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

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
              <TableRow>
                {columns.map((col, index) => (
                  <TableHead
                    key={col}
                    className={`text-xl ${index === 0 || index === 1 ? 'text-start' : 'w-fit text-center'} ${index === 0 ? 'w-40' : ''}`}
                  >
                    {col}
                  </TableHead>
                ))}
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
                  <TableRow
                    key={task.id}
                    className="hover:cursor-pointer"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (!draggedTaskId || draggedTaskId === task.id) return

                      const draggedIndex = tasks.findIndex(
                        (t) => t.id === draggedTaskId,
                      )
                      const droppedIndex = tasks.findIndex(
                        (t) => t.id === task.id,
                      )

                      const reordered = [...tasks]
                      const [removed] = reordered.splice(draggedIndex, 1)
                      reordered.splice(droppedIndex, 0, removed)

                      setTasks(reordered)
                      setFilterTasks(
                        activeTab === 'All tasks'
                          ? reordered
                          : reordered.filter((t) => t.status === activeTab),
                      )
                    }}
                    onClick={() => {
                      setSelectedTask(task)
                      setIsDialogOpen(true)
                    }}
                  >
                    <TableCell className="whitespace-normal break-words">
                      {task.name}
                    </TableCell>
                    <TableCell className="whitespace-normal break-words">
                      {/* {task.description} */}
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Illo neque saepe labore placeat. Sed possimus distinctio,
                      dolor minima aperiam ducimus exercitationem velit dolorem
                      mollitia aut iusto natus labore dolorum veritatis.
                    </TableCell>
                    <TableCell className="text-center">
                      {task.updated.date}
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
                                onClick={(e) => {
                                  e.stopPropagation() // Prevent row click event
                                  handleChangeStatus(
                                    task.id,
                                    statusOption as typeof task.status,
                                  )
                                }}
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
                        draggable
                        onMouseDown={() => setDraggedTaskId(task.id)}
                        onMouseUp={() => setDraggedTaskId(null)}
                        variant="link"
                        size="icon"
                        className="opacity-70 hover:cursor-pointer hover:opacity-100"
                        aria-label={`Drag ${task.name}`}
                      >
                        <AlignJustify className="h-5 w-5" />
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

      <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <SheetContent className="text-3xl">
          <SheetHeader>
            <SheetTitle>Task Details</SheetTitle>
            <SheetDescription>{selectedTask?.name}</SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
