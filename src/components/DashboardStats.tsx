import React from 'react';
import { Book, Clock, AlertCircle, Check } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className={`rounded-full p-3 ${color}`}>
          {icon}
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
};

interface DashboardStatsProps {
  stats: {
    borrowed: number;
    overdue: number;
    available: number;
    wishlist?: number;
  };
  isAdmin?: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, isAdmin = false }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {isAdmin ? (
        <>
          <StatsCard
            title="Total Books"
            value={stats.borrowed + stats.available}
            icon={<Book className="h-6 w-6 text-white" />}
            color="bg-blue-500 text-white"
          />
          <StatsCard
            title="Available Books"
            value={stats.available}
            icon={<Check className="h-6 w-6 text-white" />}
            color="bg-green-500 text-white"
          />
          <StatsCard
            title="Borrowed Books"
            value={stats.borrowed}
            icon={<Clock className="h-6 w-6 text-white" />}
            color="bg-indigo-500 text-white"
          />
          <StatsCard
            title="Overdue Books"
            value={stats.overdue}
            icon={<AlertCircle className="h-6 w-6 text-white" />}
            color="bg-red-500 text-white"
          />
        </>
      ) : (
        <>
          <StatsCard
            title="Books Borrowed"
            value={stats.borrowed}
            icon={<Book className="h-6 w-6 text-white" />}
            color="bg-indigo-500 text-white"
          />
          <StatsCard
            title="Overdue"
            value={stats.overdue}
            icon={<Clock className="h-6 w-6 text-white" />}
            color="bg-amber-500 text-white"
          />
          <StatsCard
            title="Available Books"
            value={stats.available}
            icon={<Check className="h-6 w-6 text-white" />}
            color="bg-green-500 text-white"
          />
          <StatsCard
            title="Wishlist"
            value={stats.wishlist || 0}
            icon={<Book className="h-6 w-6 text-white" />}
            color="bg-purple-500 text-white"
          />
        </>
      )}
    </div>
  );
};

export default DashboardStats;