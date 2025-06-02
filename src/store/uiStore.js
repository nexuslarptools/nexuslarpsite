import { create } from 'zustand';

const useUIStore = create((set) => ({
  // Drawer state
  isDrawerOpen: false,
  
  // Navigation state
  isMainScreen: true,
  currentFunction: '',
  currentGuid: '',
  currentPath: '',
  currentURL: window.location.href,
  
  // Actions
  toggleDrawer: (isOpen) => set({ isDrawerOpen: isOpen }),
  
  setNavigation: (isMain, func = '', guid = '', path = '') => set({
    isMainScreen: isMain,
    currentFunction: func,
    currentGuid: guid,
    currentPath: path
  }),
}));

export default useUIStore;