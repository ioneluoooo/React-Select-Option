import { useState } from "react"
import Select, { SelectOptions } from "./Select"

const options = [
  { label : 'First' , value : 1},
  { label : 'Second' , value : 2},
  { label : 'Third' , value : 3},
  { label : 'Fourth' , value : 4},

]

function App() {

const [value1,setValue1] = useState<SelectOptions[]>([options[0]])
const [value2,setValue2] = useState<SelectOptions | undefined>(options[0])
//our state value can either be an options or undefined
  return (
    <>
    <Select multiple options={options} value={value1} onChange={e => setValue1(e)}/>    
  <br/>
    <Select options={options} value={value2} onChange={e => setValue2(e)}/>    
</>
  )
}

export default App
