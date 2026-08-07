import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = 'bg-primary-500',
  change,
  changeType = 'neutral',
}) => {
  return (
    <div className="overflow-hidden rounded-lg bg-white p-5 shadow transition-all hover:shadow-md">
      <div className="flex items-center">
        <div className={`rounded-md ${color} p-3 text-white`}>{icon}</div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {change && (
              <span
                className={`ml-2 text-xs font-semibold ${
                  changeType === 'increase'
                    ? 'text-green-600'
                    : changeType === 'decrease'
                    ? 'text-red-600'
                    : 'text-gray-500'
                }`}
              >
                {change}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
