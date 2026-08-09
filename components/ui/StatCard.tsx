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
    <div className="overflow-hidden rounded-xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] p-3 sm:p-3.5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] dark:shadow-none transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-center">
        <div className={`rounded-lg ${color} p-2 text-white shadow-xs shrink-0 flex items-center justify-center`}>
          {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: 'h-4 w-4' }) : icon}
        </div>
        <div className="ml-2.5 min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#475569] dark:text-[#A3ADB8] truncate">{title}</p>
          <div className="flex items-baseline mt-0.5">
            <p className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-[#F5F7FA] tracking-tight truncate">{value}</p>
            {change && (
              <span
                className={`ml-1.5 text-[10px] font-bold ${
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

