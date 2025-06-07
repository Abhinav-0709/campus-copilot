import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: string | number;
    positive: boolean;
  };
  bgColor?: string;
  iconColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  bgColor = 'bg-primary-100',
  iconColor = 'text-primary-700'
}) => {
  return (
    <div className="card">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center ${iconColor}`}>
            {icon}
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-neutral-500">{title}</h3>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold">{value}</p>
              {change && (
                <span className={`ml-2 text-xs ${change.positive ? 'text-success-600' : 'text-error-600'}`}>
                  {change.positive ? '+' : '-'}{change.value}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;