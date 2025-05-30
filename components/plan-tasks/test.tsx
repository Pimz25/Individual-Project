import { Input } from '@/components/ui/input'
import { Combobox } from '@/components/ui/combobox' // Replace with your actual combobox if different
import { useState } from 'react'

const columnOptions = [
  { label: 'Name', value: 'name' },
  { label: 'Description', value: 'description' },
  { label: 'Updated Date', value: 'updatedDate' },
  { label: 'Status', value: 'status' },
]

export default function FilterSection({ table }: { table: any }) {
  const [selectedColumn, setSelectedColumn] = useState('name')
  const [searchValue, setSearchValue] = useState('')

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchValue(value)
    table.getColumn(selectedColumn)?.setFilterValue(value)
  }

  const handleColumnChange = (value: string) => {
    setSelectedColumn(value)
    // Reapply the filter using current input for the new column
    table.getColumn(value)?.setFilterValue(searchValue)
  }

  return (
    <div className="flex gap-5 items-center py-4">
      <Input
        placeholder={`Find ${selectedColumn.replace(/([A-Z])/g, ' $1').toLowerCase()}...`}
        value={searchValue}
        onChange={handleInputChange}
        className="w-full"
      />

      <select
        value={selectedColumn}
        onChange={(e) => handleColumnChange(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm"
      >
        {columnOptions.map((col) => (
          <option key={col.value} value={col.value}>
            {col.label}
          </option>
        ))}
      </select>
    </div>
  )
}
