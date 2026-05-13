import React from 'react'
import LineChartComponent from '@/components/LineChart'
import BarChartComponent from '@/components/BarChart'


const Reports = () => {
  return (
    <>
    <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sales Report </h1>
            <p className="text-muted-foreground">
              View and analyze your sales data with our comprehensive reports.
            </p>
          </div>

         
        </div>

        <br>
        </br>
        <div className="grid grid-cols-2 gap-4 ">
            <div className="col-span-2 md:col-span-1">
                <LineChartComponent />
            </div>
            <div className="col-span-2 md:col-span-1">
                <BarChartComponent />
            </div>
        </div>
    </>
    
  )
}

export default Reports