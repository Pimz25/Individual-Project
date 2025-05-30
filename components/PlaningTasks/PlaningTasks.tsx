'use client'

import { useEffect, useState } from 'react'
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
  // DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import type { Task } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'

export default function PlaningTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filterTasks, setFilterTasks] = useState<Task[]>([])
  const [input, setInput] = useState('')
  const [activeTab, setActiveTab] = useState<
    'All Tasks' | 'In Progress' | 'Done'
  >('All Tasks')
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<null | (typeof tasks)[0]>(
    null,
  )
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const columns = ['Task name', 'Description', 'Last updated', 'Status', '']
  const [sheetSide, setSheetSide] = useState<'right' | 'bottom'>('bottom')

  useEffect(() => {
    const handleResize = () => {
      setSheetSide(window.innerWidth >= 1240 ? 'right' : 'bottom')
    }

    handleResize() // initial
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  function addTask() {
    if (input.trim() === '') return
    const newTasks: typeof tasks = [
      ...tasks,
      {
        id: uuidv4(),
        name: input.trim(),
        description:
          'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eum aspernatur nobis nam et eveniet sed quis, praesentium mollitia magni distinctio provident minima totam tempore. Doloribus fugit quae voluptatem temporibus nemo.', // ← Add this
        updated: updateTime(),
        status: 'Planing',
      },
    ]
    setTasks(newTasks)

    // Update filtered tasks based on activeTab
    if (activeTab === 'All Tasks') {
      setFilterTasks(newTasks)
    } else {
      setFilterTasks(newTasks.filter((task) => task.status === activeTab))
    }
    setInput('')
  }

  function removeTask(id: string) {
    const newTasks = tasks.filter((task) => task.id !== id)
    setTasks(newTasks)
    if (activeTab === 'All Tasks') {
      setFilterTasks(newTasks)
    } else {
      setFilterTasks(newTasks.filter((task) => task.status === activeTab))
    }
  }

  function handleChangeStatus(
    id: string,
    status: 'Planing' | 'In Progress' | 'Done',
  ) {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, updated: updateTime(), status } : task,
    )
    setTasks(updatedTasks)
    if (activeTab === 'All Tasks') {
      setFilterTasks(updatedTasks)
    } else {
      setFilterTasks(updatedTasks.filter((task) => task.status === activeTab))
    }
  }

  function handleChangeTab(tab: 'All Tasks' | 'In Progress' | 'Done') {
    setActiveTab(tab)
    if (tab === 'All Tasks') {
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
      <div className="w-[80vw] p-8 my-[10vh] max-h-[80vh] max-w-[1536px] bg-white rounded-lg shadow-lg flex flex-col">
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
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <span className="text-3xl font-medium italic">No tasks yet</span>
            <span className="text-md mt-2">Start by adding a task above</span>
          </div>
        ) : (
          <Tabs
            defaultValue="all-tasks"
            value={activeTab.replace(' ', '-').toLowerCase()}
            onValueChange={(val) => {
              console.log(val)
              const tab = val
                .split('-')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
              console.log(tab)
              handleChangeTab(tab as 'All Tasks' | 'In Progress' | 'Done')
            }}
            className="overflow-hidden relative"
          >
            <TabsContent
              value={activeTab.replace(' ', '-').toLowerCase()}
              className="overflow-auto"
            >
              <Table className="w-full">
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow>
                    {columns.map((col, index) => (
                      <TableHead
                        key={col}
                        className={`text-2xl ${
                          index === 0 || index === 1
                            ? 'text-start'
                            : 'w-fit text-center'
                        }`}
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
                        colSpan={columns.length}
                        className="text-center text-gray-500 italic"
                      >
                        No
                        <span className="font-semibold">
                          {activeTab === 'In Progress'
                            ? ' tasks in progress '
                            : activeTab === 'Done'
                              ? ' completed tasks '
                              : ' tasks '}
                        </span>
                        yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    filterTasks.map((task) => (
                      <TableRow
                        key={task.id}
                        className="hover:cursor-pointer text-center"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          if (!draggedTaskId || draggedTaskId === task.id)
                            return

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
                            activeTab === 'All Tasks'
                              ? reordered
                              : reordered.filter((t) => t.status === activeTab),
                          )
                        }}
                        onClick={() => {
                          setSelectedTask(task)
                          setIsDialogOpen(true)
                        }}
                      >
                        <TableCell className="w-3/12 whitespace-normal break-words text-justify font-bold">
                          {task.name}
                        </TableCell>
                        <TableCell className="whitespace-normal break-words text-justify opacity-70">
                          {/* {task.description} */}
                          Lorem ipsum dolor sit amet consectetur, adipisicing
                          elit. Illo neque saepe labore placeat. Sed possimus
                          distinctio, dolor minima aperiam ducimus
                          exercitationem velit dolorem mollitia aut iusto natus
                          labore dolorum veritatis.
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div>{task.updated.date}</div>
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                {task.updated.time}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="italic">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <Badge
                                className="hover:cursor-pointer"
                                variant={
                                  task.status === 'Planing'
                                    ? 'secondary'
                                    : task.status === 'In Progress'
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
                              {['Planing', 'In Progress', 'Done']
                                .filter((status) => status !== task.status)
                                .map((statusOption, i) => (
                                  <DropdownMenuItem
                                    key={i}
                                    onClick={(e) => {
                                      e.stopPropagation()
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
                        <TableCell>
                          <Button
                            draggable
                            onDragStart={() => setDraggedTaskId(task.id)}
                            onDragEnd={() => setDraggedTaskId(null)}
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
            </TabsContent>

            <TabsList className="grid w-full grid-cols-3">
              {['All Tasks', 'In Progress', 'Done'].map((tab) => {
                const val = tab.replace(' ', '-').toLowerCase()
                return (
                  <TabsTrigger key={val} value={val}>
                    {tab}
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>
        )}
      </div>

      <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <SheetContent
          side={sheetSide}
          className="text-base w-full md:w-[500px]"
        >
          <SheetHeader>
            <SheetTitle>Edit Task</SheetTitle>
            <SheetDescription className="text-sm text-muted-foreground">
              Modify task details and save your changes.
            </SheetDescription>
          </SheetHeader>

          {selectedTask && (
            <div className="mt-6 flex flex-col gap-4">
              {/* Name Input */}
              <div>
                <label className="text-sm font-medium">Task Name</label>
                <Input
                  value={selectedTask.name}
                  onChange={(e) =>
                    setSelectedTask({ ...selectedTask, name: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={selectedTask.description ?? ''}
                  onChange={(e) =>
                    setSelectedTask({
                      ...selectedTask,
                      description: e.target.value,
                    })
                  }
                  className="mt-1"
                  placeholder="Enter a description..."
                />
              </div>

              {/* Updated Timestamp (read-only) */}
              <div>
                <label className="text-sm font-medium">Last Updated</label>
                <p className="mt-1 text-muted-foreground text-sm">
                  {selectedTask.updated.date} – {selectedTask.updated.time}
                </p>
              </div>

              {/* Status Dropdown */}
              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  value={selectedTask.status}
                  onChange={(e) =>
                    setSelectedTask({
                      ...selectedTask,
                      status: e.target.value as typeof selectedTask.status,
                    })
                  }
                  className="mt-1 w-full border px-3 py-2 rounded-md bg-background"
                >
                  {['Planing', 'In progress', 'Done'].map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <SheetFooter className="mt-6 flex justify-between">
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedTask) {
                  removeTask(selectedTask.id)
                  setIsDialogOpen(false)
                }
              }}
            >
              Delete
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (!selectedTask) return
                  const updated = tasks.map((t) =>
                    t.id === selectedTask.id
                      ? {
                          ...selectedTask,
                          updated: updateTime(),
                        }
                      : t,
                  )
                  setTasks(updated)
                  setFilterTasks(
                    activeTab === 'All tasks'
                      ? updated
                      : updated.filter((t) => t.status === activeTab),
                  )
                  setIsDialogOpen(false)
                }}
              >
                Save
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
