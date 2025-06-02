import { vi } from 'vitest';

// Mock UI store state
export const mockUIState = {
  isDrawerOpen: false,
  isMainScreen: true,
  currentFunction: '',
  currentGuid: '',
  currentPath: '',
  currentURL: 'http://localhost:3000/'
};

// Mock UI store actions
export const mockUIActions = {
  toggleDrawer: vi.fn((isOpen) => {
    mockUIState.isDrawerOpen = isOpen;
  }),
  setNavigation: vi.fn((isMain, func = '', guid = '', path = '') => {
    mockUIState.isMainScreen = isMain;
    mockUIState.currentFunction = func;
    mockUIState.currentGuid = guid;
    mockUIState.currentPath = path;
  })
};

// Mock Characters store state
export const mockCharactersState = {
  filter: {
    SeriesFilter: '',
    CharacterFilter: '',
    CreatorFilter: '',
    EditorFilter: '',
    SelectedApproval: '',
    LarpAutoCompValue: '',
    SelectedLarpTag: '',
    TagSelectValues: []
  },
  selectedApproved: true,
  commentFilter: false,
  showApprovableOnly: false,
  readyApproved: false,
  viewingItem: false,
  editingItem: false,
  viewItemGuid: '',
  viewItemPath: ''
};

// Mock Characters store actions
export const mockCharactersActions = {
  setFilter: vi.fn((filterData) => {
    mockCharactersState.filter = { ...mockCharactersState.filter, ...filterData };
  }),
  resetFilter: vi.fn(() => {
    mockCharactersState.filter = {
      SeriesFilter: '',
      CharacterFilter: '',
      CreatorFilter: '',
      EditorFilter: '',
      SelectedApproval: '',
      LarpAutoCompValue: '',
      SelectedLarpTag: '',
      TagSelectValues: []
    };
  }),
  toggleViewOption: vi.fn((option) => {
    mockCharactersState[option] = !mockCharactersState[option];
  }),
  setViewOptions: vi.fn((options) => {
    Object.assign(mockCharactersState, options);
  }),
  viewCharacter: vi.fn((guid, path) => {
    mockCharactersState.viewingItem = true;
    mockCharactersState.viewItemGuid = guid;
    mockCharactersState.viewItemPath = path;
  }),
  editCharacter: vi.fn((guid, path) => {
    mockCharactersState.editingItem = true;
    mockCharactersState.viewItemGuid = guid;
    mockCharactersState.viewItemPath = path;
  }),
  resetView: vi.fn(() => {
    mockCharactersState.viewingItem = false;
    mockCharactersState.editingItem = false;
    mockCharactersState.viewItemGuid = '';
    mockCharactersState.viewItemPath = '';
  })
};

// Mock Items store state
export const mockItemsState = {
  filter: {
    SeriesFilter: '',
    ItemsFilter: '',
    CreatorFilter: '',
    EditorFilter: '',
    SelectedApproval: '',
    LarpAutoCompValue: '',
    SelectedLarpTag: '',
    TagSelectValues: []
  },
  selectedApproved: true,
  commentFilter: false,
  showApprovableOnly: false,
  readyApproved: false,
  viewingItem: false,
  editingItem: false,
  viewItemGuid: '',
  viewItemPath: ''
};

// Mock Items store actions
export const mockItemsActions = {
  setFilter: vi.fn((filterData) => {
    mockItemsState.filter = { ...mockItemsState.filter, ...filterData };
  }),
  resetFilter: vi.fn(() => {
    mockItemsState.filter = {
      SeriesFilter: '',
      ItemsFilter: '',
      CreatorFilter: '',
      EditorFilter: '',
      SelectedApproval: '',
      LarpAutoCompValue: '',
      SelectedLarpTag: '',
      TagSelectValues: []
    };
  }),
  toggleViewOption: vi.fn((option) => {
    mockItemsState[option] = !mockItemsState[option];
  }),
  setViewOptions: vi.fn((options) => {
    Object.assign(mockItemsState, options);
  }),
  viewItem: vi.fn((guid, path) => {
    mockItemsState.viewingItem = true;
    mockItemsState.viewItemGuid = guid;
    mockItemsState.viewItemPath = path;
  }),
  editItem: vi.fn((guid, path) => {
    mockItemsState.editingItem = true;
    mockItemsState.viewItemGuid = guid;
    mockItemsState.viewItemPath = path;
  }),
  resetView: vi.fn(() => {
    mockItemsState.viewingItem = false;
    mockItemsState.editingItem = false;
    mockItemsState.viewItemGuid = '';
    mockItemsState.viewItemPath = '';
  })
};

// Mock Zustand hooks
export const mockUseUIStore = vi.fn((selector) => {
  if (typeof selector === 'function') {
    return selector({ ...mockUIState, ...mockUIActions });
  }
  return { ...mockUIState, ...mockUIActions };
});

export const mockUseCharactersStore = vi.fn((selector) => {
  if (typeof selector === 'function') {
    return selector({ ...mockCharactersState, ...mockCharactersActions });
  }
  return { ...mockCharactersState, ...mockCharactersActions };
});

export const mockUseItemsStore = vi.fn((selector) => {
  if (typeof selector === 'function') {
    return selector({ ...mockItemsState, ...mockItemsActions });
  }
  return { ...mockItemsState, ...mockItemsActions };
});

// Reset all store mocks
export const resetStoreMocks = () => {
  // Reset UI store
  Object.assign(mockUIState, {
    isDrawerOpen: false,
    isMainScreen: true,
    currentFunction: '',
    currentGuid: '',
    currentPath: '',
    currentURL: 'http://localhost:3000/'
  });
  
  // Reset Characters store
  Object.assign(mockCharactersState, {
    filter: {
      SeriesFilter: '',
      CharacterFilter: '',
      CreatorFilter: '',
      EditorFilter: '',
      SelectedApproval: '',
      LarpAutoCompValue: '',
      SelectedLarpTag: '',
      TagSelectValues: []
    },
    selectedApproved: true,
    commentFilter: false,
    showApprovableOnly: false,
    readyApproved: false,
    viewingItem: false,
    editingItem: false,
    viewItemGuid: '',
    viewItemPath: ''
  });
  
  // Reset Items store
  Object.assign(mockItemsState, {
    filter: {
      SeriesFilter: '',
      ItemsFilter: '',
      CreatorFilter: '',
      EditorFilter: '',
      SelectedApproval: '',
      LarpAutoCompValue: '',
      SelectedLarpTag: '',
      TagSelectValues: []
    },
    selectedApproved: true,
    commentFilter: false,
    showApprovableOnly: false,
    readyApproved: false,
    viewingItem: false,
    editingItem: false,
    viewItemGuid: '',
    viewItemPath: ''
  });
  
  // Clear all mock function calls
  vi.clearAllMocks();
};