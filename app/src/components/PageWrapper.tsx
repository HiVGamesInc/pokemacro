import React, { PropsWithChildren } from "react";

interface PageWrapperProps extends PropsWithChildren {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const PageWrapper = ({
  children,
  title,
  subtitle,
  actions,
}: PageWrapperProps) => {
  return (
    <div className="flex flex-col h-full">
      {(title || actions) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gray-850">
          <div>
            {title && (
              <h2 className="text-lg font-semibold text-gray-100">{title}</h2>
            )}
            {subtitle && (
              <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="flex-1 p-6 overflow-auto">{children}</div>
    </div>
  );
};

export default PageWrapper;
