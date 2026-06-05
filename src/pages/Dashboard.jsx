import React from "react";
import { SectionCards } from "@/components/section-cards";
import { DataTable } from "@/components/data-table";
import data from "@/app/dashboard/data.json";
import LineChartHome from "@/components/LineChartHome";
import ChartHorizontal from "@/components/ChartHorizontal";
import RecentSales from "@/components/RecentSales";

const Dashboard = () => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />

          <div className="px-4 lg:px-6">
            <div className="grid gap-4 md:grid-cols-2">
              <LineChartHome />
              <ChartHorizontal />
            </div>
          </div>

          <RecentSales />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
