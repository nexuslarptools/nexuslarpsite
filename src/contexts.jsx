import { createContext } from "react"

export const SiteContext = createContext([theme, setTheme] = useState({
    open: false,
    ismain: true,
    funct: '',
    guid: '',
    path: '',
    characters: {
      filter:       {
        SeriesFilter: '',
        CharacterFilter: '',
        CreatorFilter: '',
        EditorFilter: '',
        SelectedApproval : '',
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
      viewItemPath: '',
    },
    items: {
      filter:       {
        SeriesFilter: '',
        ItemsFilter: '',
        CreatorFilter: '',
        EditorFilter: '',
        SelectedApproval : '',
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
      viewItemPath: '',
      listItems:[]
    },
    currentURL: window.location.href 
  }));