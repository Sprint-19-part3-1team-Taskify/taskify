'use client';

import { createContext, useContext, useState } from 'react';

const HeaderContext = createContext(null);

export function HeaderProvider({ children }) {
  const [headerType, setHeaderType] = useState('default');
  const [dashboardName, setDashboardName] = useState('');
  const [mainClassName, setMainClassName] = useState('');
  const [sidemenuShow, setSidemenuShow] = useState(false);

  const [dashboardId, setDashboardId] = useState(null);

  // ⭐ 내가 만든 대시보드인지 여부
  const [isOwner, setIsOwner] = useState(false);

  /**
   * 페이지에서 한 번에 헤더 설정 가능
   */
  const setHeaderConfig = (config = {}) => {
    if ('headerType' in config) setHeaderType(config.headerType);
    if ('dashboardName' in config) setDashboardName(config.dashboardName);
    if ('mainClassName' in config) setMainClassName(config.mainClassName);
    if ('sidemenuShow' in config) setSidemenuShow(config.sidemenuShow);

    if ('dashboardId' in config) setDashboardId(config.dashboardId);

    // ⭐ owner 여부 등록
    if ('isOwner' in config) setIsOwner(config.isOwner);
  };

  return (
    <HeaderContext.Provider
      value={{
        headerType,
        dashboardName,
        mainClassName,
        sidemenuShow,
        dashboardId,
        isOwner,

        setHeaderType,
        setDashboardName,
        setMainClassName,
        setSidemenuShow,
        setDashboardId,
        setIsOwner,
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
