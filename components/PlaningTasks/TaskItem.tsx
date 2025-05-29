import React from 'react'
import { TableCell, TableRow } from '../ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { AlignJustify } from 'lucide-react'
import type { Task } from '@/lib/types'

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

export const TaskItem = (task: Task) => {
  return (
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
          // onClick={() => removeTask(task.id)}
          variant="link"
          size="icon"
          className="opacity-70 hover:cursor-pointer hover:opacity-100"
          aria-label={`Remove ${task.context}`}
        >
          <AlignJustify className="h-5 w-5" />
        </Button>
      </TableCell>
    </TableRow>
  )
}
