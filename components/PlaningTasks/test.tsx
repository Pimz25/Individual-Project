{tasks.length === 0 ? (
          <p className="text-gray-500 italic text-center">No tasks yet</p>
        ) : (
          <div className="flex-grow overflow-y-auto relative">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  {columns.map((col, index) => (
                    <TableHead
                      key={col}
                      className={`text-2xl ${index === 0 || index === 1 ? 'text-start' : 'w-fit text-center'}`}
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
                      className="hover:cursor-pointer text-center"
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
                      <TableCell className="w-3/12 whitespace-normal break-words text-justify font-bold">
                        {task.name}
                      </TableCell>
                      <TableCell className="whitespace-normal break-words text-justify opacity-70">
                        {/* {task.description} */}
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Illo neque saepe labore placeat. Sed possimus
                        distinctio, dolor minima aperiam ducimus exercitationem
                        velit dolorem mollitia aut iusto natus labore dolorum
                        veritatis.
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
                      <TableCell className="">
                        <Button
                          draggable
                          onMouseDown={() => setDraggedTaskId(task.id)}
                          onMouseUp={() => setDraggedTaskId(null)}
                          variant="link"
                          size="icon"
                          className="opacity-70 hover:cursor-pointer hover:opacity-100"
                          aria-Label={`Drag ${task.name}`}
                        >
                          <AlignJustify className="h-5 w-5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}








      <Popover open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <PopoverContent className="p-7 px-10 overflow-auto w-3/4 max-w-[calc(100%-2rem)]">
          {/* <DialogTitle className="text-5xl">Edit Task</DialogTitle> */}
          {/* <DialogDescription className="text-sm text-muted-foreground"> */}
          Modify task details and save your changes.
          {/* </DialogDescription> */}
          {selectedTask && (
            <div className="mt-6 flex flex-col gap-4">
              {/* Name Input */}
              <div>
                <Label className="text-sm font-medium">Task Name</Label>
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
                <Label className="text-sm font-medium">Description</Label>
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
                <Label className="text-sm font-medium">Last Updated</Label>
                <p className="mt-1 text-muted-foreground text-sm">
                  {selectedTask.updated.date} – {selectedTask.updated.time}
                </p>
              </div>

              {/* Status Dropdown */}
              <div>
                <Label className="text-sm font-medium">Status</Label>
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
          {/* <DialogFooter className="mt-6 flex justify-between"> */}
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
          {/* </DialogFooter> */}
        </PopoverContent>
      </Popover>