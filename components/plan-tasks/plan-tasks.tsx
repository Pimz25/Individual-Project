'use client'

import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { AlignJustify, PencilLine, Trash2 } from 'lucide-react'
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import type { Task } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Separator } from '../ui/separator'

export default function PlaningTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filterTasks, setFilterTasks] = useState<Task[]>([])
  const [nameInput, setNameInput] = useState('')
  const [desInput, setDesInput] = useState('')
  const [activeTab, setActiveTab] = useState<
    'All Tasks' | 'In Progress' | 'Done'
  >('All Tasks')
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<null | (typeof tasks)[0]>(
    null,
  )
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const columns = [
    'Task Name',
    'Task Description',
    'Last Updated',
    'Status',
    '',
  ]
  const [sheetSide, setSheetSide] = useState<'right' | 'bottom'>('bottom')
  const [isEditing, setIsEditing] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [searchColumns, setSearchColumns] = useState<string[]>(['Task Name'])

  useEffect(() => {
    const handleResize = () => {
      setSheetSide(window.innerWidth >= 1024 ? 'right' : 'bottom')
    }

    if (searchColumns.length === 0) {
      setSearchValue('')
      filterContext(searchValue)
    }

    handleResize() // initial
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [filterContext, searchColumns, searchValue])

  function addTask() {
    if (nameInput.trim() === '' || desInput.trim() === '') return
    const newTasks: typeof tasks = [
      ...tasks,
      {
        id: uuidv4(),
        name: nameInput.trim(),
        description: desInput,
        updated: updateTime(),
        created: updateTime(),
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
    setNameInput('')
  }

  function deleteTask(id: string) {
    const newTasks = tasks.filter((task) => task.id !== id)
    setTasks(newTasks)
    if (activeTab === 'All Tasks') {
      setFilterTasks(newTasks)
    } else {
      setFilterTasks(newTasks.filter((task) => task.status === activeTab))
    }
  }

  function changeStatus(
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function filterContext(filter: string) {
    if (filter.trim() === '') {
      setFilterTasks(tasks)
      return
    }

    const columns = searchColumns.map((col) =>
      col.split(' ').slice(-1).toString().toLowerCase(),
    )
    const lowerFilter = filter.toLowerCase()

    const updatedTasks = tasks.filter((task) =>
      columns.some((col) => {
        switch (col) {
          case 'name':
            return task.name.toLowerCase().includes(lowerFilter)
          case 'description':
            return task.description.toLowerCase().includes(lowerFilter)
          case 'status':
            return task.status.toLowerCase().includes(lowerFilter)
          case 'updated':
            return task.updated.date.toLowerCase().includes(lowerFilter)
          default:
            return false
        }
      }),
    )

    setFilterTasks(updatedTasks)
  }

  function changeTab(tab: 'All Tasks' | 'In Progress' | 'Done') {
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

  function clearInputs() {
    setNameInput('')
    setDesInput('')
  }

  return (
    <>
      <div className="w-[80vw] p-8 my-[10vh] max-h-[80vh] max-w-[1536px] bg-white rounded-lg shadow-lg flex flex-col">
        <h2 className="text-4xl font-bold mb-4 text-center">Planing Tasks</h2>
        <div className="text-center">
          <Button onClick={() => setIsAddTaskOpen(true)} variant="primary">
            Add New Task
          </Button>
        </div>

        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <span className="text-3xl font-medium italic">No tasks yet</span>
            <span className="text-md mt-2">Start by adding a task above</span>
          </div>
        ) : (
          <>
            <div className="flex gap-5 items-center py-4">
              <Input
                placeholder={`Find context${searchColumns.length === 0 ? '...' : searchColumns.length === 1 ? ' with column:' : ' with columns:'} ${searchColumns
                  .map((col) => col.toLowerCase())
                  .join(', ')}`}
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value)
                  filterContext(e.target.value)
                }}
                className={`w-full ${searchColumns.length === 0 ? 'hover:cursor-move opacity-50' : ''}`}
                disabled={searchColumns.length === 0}
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Columns</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  {columns.slice(0, -1).map((col) => (
                    <DropdownMenuCheckboxItem
                      key={col}
                      checked={searchColumns.includes(col)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSearchColumns((prev) => [...prev, col])
                        } else {
                          setSearchColumns((prev) =>
                            prev.filter((item) => item !== col),
                          )
                        }
                      }}
                    >
                      {col}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Tabs
              defaultValue="all-tasks"
              value={activeTab.replace(' ', '-').toLowerCase()}
              onValueChange={(val) => {
                const tab = val
                  .split('-')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')
                changeTab(tab as 'All Tasks' | 'In Progress' | 'Done')
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
                                : reordered.filter(
                                    (t) => t.status === activeTab,
                                  ),
                            )
                          }}
                          onClick={() => {
                            setSelectedTask(task)
                            setIsSheetOpen(true)
                          }}
                        >
                          <TableCell className="w-3/12 whitespace-normal break-words text-justify font-bold">
                            {task.name}
                          </TableCell>
                          <TableCell className="whitespace-normal break-words text-justify opacity-70">
                            {task.description.split('\n').map((line, i) => (
                              <p key={i}>{line}</p>
                            ))}
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
                                        changeStatus(
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
                              className="opacity-70 hover:opacity-100"
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
          </>
        )}
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side={sheetSide}
          className={`overflow-auto h-3/4 px-8 py-5 sm:h-auto ${sheetSide === 'right' ? 'lg:w-2/5' : 'w-full'}`}
        >
          <SheetHeader className="p-0">
            <SheetTitle className="text-3xl">Edit Task</SheetTitle>
            <SheetDescription className="text-sm text-muted-foreground">
              Modify task details and save your changes.
            </SheetDescription>
          </SheetHeader>
          <Separator />
          {selectedTask && (
            <div className="flex flex-col gap-4">
              {/* Name Input */}
              <div>
                <Label className="text-xl">Task Name</Label>
                {isEditing ? (
                  <Input
                    value={selectedTask.name}
                    onChange={(e) =>
                      setSelectedTask({ ...selectedTask, name: e.target.value })
                    }
                    className="mt-1"
                  />
                ) : (
                  <p className="text-muted-foreground mt-1">
                    {selectedTask.name}
                  </p>
                )}
              </div>

              {/* Description Input */}
              <div>
                <Label className="text-xl">Task Description</Label>
                {isEditing ? (
                  <Textarea
                    value={selectedTask.description ?? ''}
                    onChange={(e) =>
                      setSelectedTask({
                        ...selectedTask,
                        description: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-muted-foreground">
                    {selectedTask.description.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </p>
                )}
              </div>

              {/* Time (read-only) */}
              <div className="flex justify-between">
                {/* Created Timestamp */}
                <div>
                  <Label className="text-xl">Created</Label>
                  <p className="mt-1 text-muted-foreground">
                    {selectedTask.created.date} – {selectedTask.created.time}
                  </p>
                </div>

                {/* Updated Timestamp */}
                <div>
                  <Label className="text-xl">Last Updated</Label>
                  <p className="mt-1 text-muted-foreground">
                    {selectedTask.updated.date} – {selectedTask.updated.time}
                  </p>
                </div>
              </div>

              {/* Status Field */}
              <div className="flex items-center gap-5">
                <Label className="text-xl">Status</Label>
                {isEditing ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Badge
                        variant={
                          selectedTask.status === 'Planing'
                            ? 'secondary'
                            : selectedTask.status === 'In Progress'
                              ? 'default'
                              : selectedTask.status === 'Done'
                                ? 'success'
                                : 'outline'
                        }
                        className="mt-1 italic hover:cursor-pointer"
                      >
                        {selectedTask.status}
                      </Badge>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="italic">
                      {['Planing', 'In Progress', 'Done']
                        .filter((status) => status !== selectedTask.status)
                        .map((statusOption, i) => (
                          <DropdownMenuItem
                            key={i}
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedTask({
                                ...selectedTask,
                                status:
                                  statusOption as typeof selectedTask.status,
                              })
                            }}
                            className="hover:cursor-pointer"
                          >
                            {statusOption}
                          </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <p className="text-muted-foreground italic font-bold bg-secondary px-2 py-1 rounded-md">
                    {selectedTask.status}
                  </p>
                )}
              </div>
            </div>
          )}
          <Separator />
          <SheetFooter className="mt-0 p-0 flex flex-row justify-around lg:justify-between">
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedTask) {
                  deleteTask(selectedTask.id)
                  setIsSheetOpen(false)
                }
              }}
            >
              <Trash2 />
              Delete
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsSheetOpen(false)
                  setIsEditing(false) // Reset editing state on cancel
                }}
              >
                Cancel
              </Button>
              {isEditing ? (
                <Button
                  onClick={() => {
                    if (!selectedTask) return
                    const updated = tasks.map((t) =>
                      t.id === selectedTask.id
                        ? { ...selectedTask, updated: updateTime() }
                        : t,
                    )
                    setTasks(updated)
                    setFilterTasks(
                      activeTab === 'All Tasks'
                        ? updated
                        : updated.filter((t) => t.status === activeTab),
                    )
                    setIsEditing(false)
                  }}
                  variant="primary"
                >
                  Save
                </Button>
              ) : (
                <Button variant="warn" onClick={() => setIsEditing(true)}>
                  <PencilLine />
                  Edit
                </Button>
              )}
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <SheetContent
          side={sheetSide}
          className={`overflow-auto h-3/4 px-8 py-5 sm:h-auto ${sheetSide === 'right' ? 'lg:w-2/5' : 'w-full'}`}
        >
          <SheetHeader className="p-0">
            <SheetTitle className="text-3xl">Create Task</SheetTitle>
            <SheetDescription className="text-sm text-muted-foreground">
              Modify task details and save your changes.
            </SheetDescription>
          </SheetHeader>
          <Separator />

          <div className="flex flex-col gap-4">
            {/* Name Input */}
            <div>
              <Label className="text-xl">Task Name</Label>
              <Input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Add new task"
                className="flex-grow"
              />
            </div>
            {/* Description Input */}
            <div>
              <Label className="text-xl">Description</Label>
              <Textarea
                value={desInput}
                onChange={(e) => setDesInput(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <Separator />
          <SheetFooter className="mt-0 p-0 flex flex-row justify-around lg:justify-between">
            <Button
              variant="outline"
              onClick={() => {
                clearInputs()
                setIsAddTaskOpen(false)
              }}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              onClick={() => {
                addTask()
                clearInputs()
                setIsAddTaskOpen(false)
              }}
            >
              Add
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
