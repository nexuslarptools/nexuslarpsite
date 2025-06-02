import { create } from 'zustand';

const useItemsStore = create((set) => ({
  // Filter state
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
  
  // View state
  selectedApproved: true,
  commentFilter: false,
  showApprovableOnly: false,
  readyApproved: false,
  viewingItem: false,
  editingItem: false,
  viewItemGuid: '',
  viewItemPath: '',
  
  // Actions
  setFilter: (filterData) => set((state) => ({
    filter: { ...state.filter, ...filterData }
  })),
  
  resetFilter: () => set({
    filter: {
      SeriesFilter: '',
      ItemsFilter: '',
      CreatorFilter: '',
      EditorFilter: '',
      SelectedApproval: '',
      LarpAutoCompValue: '',
      SelectedLarpTag: '',
      TagSelectValues: []
    }
  }),
  
  toggleViewOption: (option) => set((state) => ({
    [option]: !state[option]
  })),
  
  setViewOptions: (options) => set((state) => ({
    ...state,
    ...options
  })),
  
  viewItem: (guid, path) => set({
    viewingItem: true,
    viewItemGuid: guid,
    viewItemPath: path
  }),
  
  editItem: (guid, path) => set({
    editingItem: true,
    viewItemGuid: guid,
    viewItemPath: path
  }),
  
  resetView: () => set({
    viewingItem: false,
    editingItem: false,
    viewItemGuid: '',
    viewItemPath: ''
  })
}));

export default useItemsStore;