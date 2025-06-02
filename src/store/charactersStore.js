import { create } from 'zustand';

const useCharactersStore = create((set) => ({
  // Filter state
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
      CharacterFilter: '',
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
  
  viewCharacter: (guid, path) => set({
    viewingItem: true,
    viewItemGuid: guid,
    viewItemPath: path
  }),
  
  editCharacter: (guid, path) => set({
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

export default useCharactersStore;