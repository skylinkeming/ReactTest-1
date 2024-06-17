import { useState } from 'react'
import EmployeeTable from './EmployeeTable'
import TaskTable from './TaskTable'

function App() {
  const [selectedEmployees, setSelectedEmpolyees] = useState([])
  const [selectedTasks, setSelectedTasks] = useState([])


  const factories = [
    { name: 'BR1', employees: ['John', 'Alice', 'Bob', 'Jessie', 'Karen'] },
    { name: 'BR2', employees: ['Jessie', 'Karen', 'John'] },
    { name: 'BR3', employees: ['Miles', 'Eric', 'Henry', 'Bob'] },
    { name: 'BR4', employees: [] },
  ]
  
  const employeeType = [
    { id: 1, name: 'FullTime', work_begin: '09:00:00', work_end: '17:00:00' },
    { id: 2, name: 'MidTime', work_begin: '12:00:00', work_end: '21:00:00' },
    { id: 3, name: 'HalfTime', work_begin: '20:00:00', work_end: '00:00:00' },
  ]
  


  const employees = [
    { id: 1, name: 'Alice', type: 2 },
    { id: 2, name: 'Bob', type: 3 },
    { id: 3, name: 'John', type: 2 },
    { id: 4, name: 'Karen', type: 1 },
    { id: 5, name: 'Miles', type: 3 },
    { id: 6, name: 'Henry', type: 1 },
  ]
  
  const tasks = [
    { id: 1, title: 'task01', duration: 60 }, // min
    { id: 2, title: 'task02', duration: 120 },
    { id: 3, title: 'task03', duration: 180 },
    { id: 4, title: 'task04', duration: 360 },
    { id: 5, title: 'task05', duration: 30 },
    { id: 6, title: 'task06', duration: 220 },
    { id: 7, title: 'task07', duration: 640 },
    { id: 8, title: 'task08', duration: 250 },
    { id: 9, title: 'task09', duration: 119 },
    { id: 10, title: 'task10', duration: 560 },
    { id: 11, title: 'task11', duration: 340 },
    { id: 12, title: 'task12', duration: 45 },
    { id: 13, title: 'task13', duration: 86 },
    { id: 14, title: 'task14', duration: 480 },
    { id: 15, title: 'task15', duration: 900 },
  ]



  const typeDurationMap = {}
  
  employeeType.forEach(typeData=>{
    typeDurationMap[typeData.id] = getTimeDifference(typeData.work_begin, typeData.work_end)
  })   


  const employeeDurationMap = {}
  employees.forEach(emp=>{
    employeeDurationMap[emp.id] = typeDurationMap[emp.type]
  })


  /**
   * 第一題答案
   * @returns 
   */
  function getAlphabeticalOrder(){
    const sorted = factories.map(factory => ({
      name:factory.name,
      employees: factory.employees.sort()
    }));
    return JSON.stringify(sorted)
  }


  /**
   * 第二題答案
   * @param {*} daytime 
   * @returns 
   */
  function getWorkingEmployees(daytime){//
    const workingTypes = employeeType.filter((typeData)=>{
      return checkTimeIsInBetween(daytime, typeData.work_begin, typeData.work_end)
    }).map(typeData=> typeData.id)

    const workingEmployees = employees.filter(e=> workingTypes.includes(e.type))
    return workingEmployees;
  } 

  // getWorkingEmployees("13:00:00")




  //helper

  function checkTimeIsInBetween(targetTime, startTime, endTime){
    const start = new Date().setHours(startTime.split(":")[0], startTime.split(":")[1], 0)
    const end = new Date().setHours(endTime.split(":")[0], startTime.split(":")[1], 0)
    const target = new Date().setHours(targetTime.split(":")[0], startTime.split(":")[1], 0)

    return (target > start) &&  (end>target);
  }

  function getTimeDifference(startTime, endTime){
    if(endTime === "00:00:00"){
      endTime="24:00:00";
    }

    const start = new Date(`1970-01-01T${startTime}Z`);
    const end = new Date(`1970-01-01T${endTime}Z`);
    const diffInMilliseconds = end - start;

    const diffInMinutes = diffInMilliseconds / (1000 * 60);

    return diffInMinutes;
  }


  return <div className="App">
    <div>Order employees list (in factories) by alphabetical order</div>
    <div>
      {getAlphabeticalOrder()}
    </div>
    <br/>
  
    <div>Make a function that take as parameters dayTime and return number of employee working</div>
    <div>{"答案： getWorkingEmployee 那隻function"}</div>
    <br/>

    <div>
      Use Material UI to build a page with a table Employee,
      all columns can be sorted
      below the color palette</div>
      <div>
        <EmployeeTable 
          rows={employees}
          selected={selectedEmployees}
          onSelectAllClick={(isSelectAll)=>{
            if(isSelectAll) setSelectedEmpolyees(employees.map(e=>e.id))
            else setSelectedEmpolyees([])
          }}
          onSetSelected={(ids)=>{
            setSelectedEmpolyees(ids);
          }}
        />
        <TaskTable
          rows={tasks}
          selected={selectedTasks}
          onSelectAllClick={(isSelectAll)=>{
            // if(isSelectAll) setSelectedTasks(employees.map(e=>e.id))
            // else setSelectedEmpolyees([])
          }}
          onSetSelected={(taskIds)=>{
            let leftTaskIs = [];

            taskIds.forEach(taskId=>{
              //取出工作時間
              const taskDuration = tasks[taskId].duration;
              //檢查選取的人有沒有大於這個工作時間的 有才能選這個工作
              let satisfiedEmployees = selectedEmployees
                .filter(seEmpId => {
                  return employeeDurationMap[seEmpId] >= taskDuration
                })
              if(satisfiedEmployees.length>0 ){
                leftTaskIs.push(taskId);
              } else {
                alert("無符合工作時數的員工. There are no selected employees match this duration.")
              }
            })


            setSelectedTasks(leftTaskIs);
          }}
        />
      </div>


  </div>
}

export default App
