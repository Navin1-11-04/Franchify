import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Menu, Lock } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function CombinedPage() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Sales",
        data: [30, 40, 60, 60, 70],
        backgroundColor: "#60A5FA", // Tailwind blue-400
      },
    ],
  };

  return (
    <div className="w-[360px] bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <Menu className="w-5 h-5" />
        <h1 className="font-bold text-lg">ENGINEERS</h1>
        <Lock className="w-5 h-5" />
      </div>

      {/* Profile Section */}
      <div className="text-center p-4">
        <p className="text-sm font-medium text-gray-600">Welcome</p>
        <span className="inline-block bg-gray-200 text-xs px-2 py-0.5 rounded-full mt-1">Affiliate</span>
        <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mt-3"></div>
        <h2 className="font-semibold mt-2">Gowtham</h2>
        <p className="text-gray-500 text-sm">410312</p>
        <button className="mt-2 w-full bg-yellow-400 text-sm py-1 rounded">KYC - Pending</button>
        <button className="mt-2 w-full bg-gray-200 text-sm py-1 rounded">Copy referral link</button>
      </div>

      {/* Wallet & PV Section */}
      <div className="px-4 pb-4 space-y-4">
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <p className="text-lg font-bold">₹0</p>
          <p className="text-gray-500 text-sm">Total payout</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <p>0</p>
            <p className="text-gray-500 text-sm">Income wallet</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <p>0</p>
            <p className="text-gray-500 text-sm">E wallet</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <p>0 PV</p>
            <p className="text-gray-500 text-sm">Franchise A</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <p>0 PV</p>
            <p className="text-gray-500 text-sm">Franchise B</p>
          </div>
        </div>
      </div>

      {/* Income Summary */}
      <div className="px-4 pb-4 space-y-3">
        <div className="bg-gray-50 p-3 rounded-lg flex justify-between">
          <span>0 PV</span>
          <span className="text-gray-500 text-sm">Self PV</span>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg flex justify-between">
          <span>₹0</span>
          <span className="text-gray-500 text-sm">Affiliate Income</span>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg flex justify-between">
          <span>₹0</span>
          <span className="text-gray-500 text-sm">Revenue Income</span>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="px-4 pb-6">
        <Bar data={data} />
      </div>
    </div>
  );
}
