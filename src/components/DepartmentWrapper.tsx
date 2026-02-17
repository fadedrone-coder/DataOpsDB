import React from 'react';

interface DepartmentWrapperProps {
  departmentSlug: string;
  departmentName: string;
  children: React.ReactNode;
}

export const DepartmentWrapper: React.FC<DepartmentWrapperProps> = ({
  departmentSlug,
  departmentName,
  children,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          <span className="font-semibold">{departmentName}</span> • Displaying department-specific data
        </p>
      </div>
      {children}
    </div>
  );
};
