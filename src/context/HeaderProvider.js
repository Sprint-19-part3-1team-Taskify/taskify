'use client';

import { createContext, useContext, useState } from 'react';

const HeaderContext = createContext(null);

export function HeaderProvider({ children }) {
  const [headerType, setHeaderType] = useState('default');
  const [dashboardName, setDashboardName] = useState('');
  const [mainClassName, setMainClassName] = useState('');
  const [sidemenuShow, setSidemenuShow] = useState(false);

  // ⭐ 추가된 부분
  const [dashboardId, setDashboardId] = useState(null);

  /**
   * 페이지에서 한 번에 헤더 설정할 수 있는 유틸
   */
  const setHeaderConfig = (config = {}) => {
    if ('headerType' in config) setHeaderType(config.headerType);
    if ('dashboardName' in config) setDashboardName(config.dashboardName);
    if ('mainClassName' in config) setMainClassName(config.mainClassName);
    if ('sidemenuShow' in config) setSidemenuShow(config.sidemenuShow);

    // ⭐ 대시보드 ID 추가
    if ('dashboardId' in config) setDashboardId(config.dashboardId);
  };

  return (
    <HeaderContext.Provider
      value={{
        headerType,
        dashboardName,
        mainClassName,
        sidemenuShow,
        dashboardId,

        setHeaderType,
        setDashboardName,
        setMainClassName,
        setSidemenuShow,
        setDashboardId,
        setHeaderConfig,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const ctx = useContext(HeaderContext);
  if (!ctx) {
    throw new Error('useHeader must be used within HeaderProvider');
  }
  return ctx;
}
