
import { createContext, useState } from "react"

export const SiteContext = createContext();
export const SiteProvider = ({ children }) => {
  const [site, setSite] = useState({
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
      viewing: false,
      create: false,
      editing: false,
      viewGuid: '',
      viewPath: '',
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
  });

  return (
    <SiteContext.Provider value={{ site, setSite }}>
      {children}
    </SiteContext.Provider>
  );
  
};