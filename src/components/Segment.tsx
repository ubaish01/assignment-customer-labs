import  { useState, useMemo } from 'react'
import { Button } from "./ui/button"
import { PlusCircle, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const schemaOptions = [
  { label: "First Name", value: "first_name" },
  { label: "Last Name", value: "last_name" },
  { label: "Gender", value: "gender" },
  { label: "Age", value: "age" },
  { label: "Account Name", value: "account_name" },
  { label: "City", value: "city" },
  { label: "State", value: "state" },
]

export default function SegmentCreator() {
  const [isOpen, setIsOpen] = useState(false)
  const [segmentName, setSegmentName] = useState('')
  const [selectedSchemas, setSelectedSchemas] = useState<string[]>([])
  const [newSchemaValue, setNewSchemaValue] = useState('')

  const availableSchemas = useMemo(() => 
    schemaOptions.filter(option => !selectedSchemas.includes(option.value)),
    [selectedSchemas]
  )

  const handleAddNewSchema = () => {
    if (newSchemaValue && !selectedSchemas.includes(newSchemaValue)) {
      setSelectedSchemas([...selectedSchemas, newSchemaValue])
      setNewSchemaValue('')
    }
  }

  const handleRemoveSchema = (schemaToRemove: string) => {
    setSelectedSchemas(selectedSchemas.filter(schema => schema !== schemaToRemove))
  }

  const handleSaveSegment = () => {
    const data = {
      segment_name: segmentName,
      schema: selectedSchemas.map(value => {
        const option = schemaOptions.find(opt => opt.value === value)
        return { [value]: option?.label }
      })
    }
    // Here will be the logic to send data to server since the provided website : https://webhook.site/ - NOT working its not implemented
    console.log(JSON.stringify(data, null, 2))
    setIsOpen(false)
  }

  return (
    <div className="p-4 w-full flex items-center justify-center h-screen">
      <Button variant="default" className='self-center' onClick={() => setIsOpen(true)}>Save segment</Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white p-6 rounded-lg max-w-[425px] w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <h2 className="text-lg font-semibold mb-4">Save Segment</h2>
              <div className="max-h-[80vh] overflow-y-auto pr-4">
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="segment-name" className="text-sm font-medium">Enter the name of the segment</label>
                    <input
                      id="segment-name"
                      value={segmentName}
                      onChange={(e) => setSegmentName(e.target.value)}
                      placeholder="Name of the segment"
                      className="border rounded px-3 py-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">
                      To save your segment, you need to add the schemas to build the query
                    </p>
                    <AnimatePresence>
                      {selectedSchemas.map((schema, index) => (
                        <motion.div 
                          key={schema}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center gap-2"
                        >
                          <select 
                            value={schema} 
                            onChange={(e) => {
                              const newSchemas = [...selectedSchemas]
                              newSchemas[index] = e.target.value
                              setSelectedSchemas(newSchemas)
                            }}
                            className="border rounded px-3 py-2 w-full"
                          >
                            <option value="">Select schema</option>
                            {[...availableSchemas, schemaOptions.find(opt => opt.value === schema)].map(option => (
                              <option key={option?.value} value={option?.value}>
                                {option?.label}
                              </option>
                            ))}
                          </select>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveSchema(schema)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  <div className="flex items-center gap-2">
                    <select 
                      value={newSchemaValue} 
                      onChange={(e) => setNewSchemaValue(e.target.value)}
                      className="border rounded px-3 py-2 w-full"
                    >
                      <option value="">Add schema to segment</option>
                      {availableSchemas.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleAddNewSchema}
                      disabled={!newSchemaValue}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="link"
                    className="justify-start p-0 h-auto font-normal"
                    onClick={handleAddNewSchema}
                    disabled={!newSchemaValue}
                  >
                    + Add new schema
                  </Button>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveSegment}>Save the segment</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}