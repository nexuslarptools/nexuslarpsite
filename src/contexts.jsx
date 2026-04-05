import { createContext, useState } from "react";

export const CharacterContext = createContext();

export const CharacterProvider = ({ children }) => {
  const [character, setCharacter] = useState({
    ismain: true,
    filter: {
      SeriesFilter: "",
      CharacterFilter: "",
      CreatorFilter: "",
      EditorFilter: "",
      SelectedApproval: "",
      LarpAutoCompValue: "",
      SelectedLarpTag: "",
      TagSelectValues: [],
    },
    selectedApproved: true,
    commentFilter: false,
    showApprovableOnly: false,
    readyApproved: false,
    viewing: false,
    create: false,
    editing: false,
    viewGuid: "",
    viewPath: "",
  });

  return (
    <CharacterContext.Provider value={{ character, setCharacter }}>
      {children}
    </CharacterContext.Provider>
  );
};

export const SiteContext = createContext();

export const SiteProvider = ({ children }) => {
  const [site, setsite] = useState({
    open: false,
  });

  const [itemView, setItemView] = useState({
    ismain: true,
    filter: {
      SeriesFilter: "",
      CharacterFilter: "",
      CreatorFilter: "",
      EditorFilter: "",
      SelectedApproval: "",
      LarpAutoCompValue: "",
      SelectedLarpTag: "",
      TagSelectValues: [],
    },
    selectedApproved: true,
    commentFilter: false,
    showApprovableOnly: false,
    readyApproved: false,
    viewingItem: false,
    editingItem: false,
    viewItemGuid: "",
    viewItemPath: "",
    listItems: [],
  });

  const [character, setCharacter] = useState({
    ismain: true,
    filter: {
      SeriesFilter: "",
      CharacterFilter: "",
      CreatorFilter: "",
      EditorFilter: "",
      SelectedApproval: "",
      LarpAutoCompValue: "",
      SelectedLarpTag: "",
      TagSelectValues: [],
    },
    selectedApproved: true,
    commentFilter: false,
    showApprovableOnly: false,
    readyApproved: false,
    viewing: false,
    create: false,
    editing: false,
    viewGuid: "",
    viewPath: "",
  });

  return (
    <SiteContext.Provider
      value={{ site, setsite, itemView, setItemView, character, setCharacter }}
    >
      {children}
    </SiteContext.Provider>
  );
};
