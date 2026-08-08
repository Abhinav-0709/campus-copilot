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
  color = 'bg-[#2563EB]',
  change,
  changeType = 'neutral',
}) => {
  return (
    <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(37,99,235,0.12)]">
      <div className="flex items-center">
        <div className={`rounded-xl ${color} p-3 text-white shadow-sm shrink-0`}>{icon}</div>
        <div className="ml-4 min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#475569] dark:text-[#A3ADB8] truncate">{title}</p>
          <div className="flex items-baseline mt-0.5">
            <p className="text-2xl font-extrabold text-[#111827] dark:text-[#F5F7FA] tracking-tight">{value}</p>
            {change && (
              <span
                className={`ml-2 text-xs font-bold ${
                  changeType === 'increase'
                    ? 'text-[#16A34A] dark:text-[#3DD68C]'
                    : changeType === 'decrease'
                    ? 'text-[#DC2626] dark:text-[#FF5C5C]'
                    : 'text-[#475569] dark:text-[#A3ADB8]'
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

