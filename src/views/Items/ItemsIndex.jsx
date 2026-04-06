import { useEffect, useState, useContext } from "react";
import useGetData from "../../utils/getdata";
import Loading from "../../components/loading/loading";
import ItemsListPage from "./ItemsListPage";
import ItemDisplay from "./ItemDisplay";
import AuthRedirect from "../../utils/authRedirect";
import AuthLevelInfo from "../../utils/authLevelInfo";
import PropTypes from "prop-types";
import ItemCreate from "./ItemCreate";
import formJSON from "../../jsonfiles/iteminput.json";
import ItemEdit from "./ItemEdit";
import ItemSelector from "../../components/itemselector/itemselector";
import {
  createTheme,
  IconButton,
  lighten,
  Slide,
  Snackbar,
  ThemeProvider,
} from "@mui/material";
import "./_ItemsIndex.scss";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import { SiteContext } from "../../contexts";

export default function ItemsIndex(props) {
  AuthRedirect(1);

  const handleSnackClose = () => {
    setSnackOpen({ isOpen: false, text: "" });
  };

  const { itemView, setItemView } = useContext(SiteContext);

  const approvQuery = useGetData(
    "listApprovedItems",
    "/api/v1/ItemSheetApproveds/FullListWithTagsNoImages",
  );
  const unapprovQuery = useGetData(
    "listUnapprovedItems",
    "/api/v1/ItemSheets/FullListWithTagsNoImages",
  );
  const allTagsQuery = useGetData("listTags", "/api/v1/Tags/groupbytyperead");
  const userGuidQuery = useGetData("userguid", "/api/v1/Users/CurrentGuid");
  const authLevel = AuthLevelInfo();
  const [itemsState, setItemsState] = useState({
    selectedApproved: true,
    commentFilter: false,
    showApprovableOnly: false,
    viewingItem: false,
    viewItemGuid: "",
    viewItemPath: "",
    filter: {
      SeriesFilter: "",
      ItemsFilter: "",
      CreatorFilter: "",
      EditorFilter: "",
      SelectedApproval: "",
      LarpAutoCompValue: "",
      SelectedLarpTag: "",
      TagSelectValues: [],
    },
  });
  const [filterState, setFilterState] = useState({
    SeriesFilter: "",
    ItemsFilter: "",
    CreatorFilter: "",
    EditorFilter: "",
    SelectedApproval: "",
    LarpAutoCompValue: "",
    SelectedLarpTag: "",
    TagSelectValues: [],
  });
  const [isCreate, setIsCreate] = useState(false);
  const [isSelect, setIsSelect] = useState(false);
  const [isEdit, setIsEdit] = useState({ isEditing: false, guid: null });
  const [snackOpen, setSnackOpen] = useState({ isOpen: false, text: "" });

  useEffect(() => {
    if (itemView.ismain === true) {
      setIsCreate(false);
      setIsEdit({ isEditing: false, guid: null });
      setFilterState(itemView.filter);

      if (itemView !== undefined && itemView !== null) {
        for (const key in itemView) {
          if (
            itemView.filter[key] !== undefined &&
            itemView.filter[key] !== null &&
            key !== "filters"
          ) {
            setItemsState({
              ...itemsState,
              [key]: itemView.filter[key],
            });
          }
        }
      }
    } else {
      if (itemView.funct === "Create") setIsCreate(true);
    }
    if (itemView.funct === "Select") {
      setIsSelect(true);
    }
    if (itemView.funct === "View") {
      setItemsState({
        ...itemsState,
        viewingItem: true,
        viewItemGuid: itemView.guid,
        viewItemPath: itemView.path,
      });
    }
    if (itemView.funct === "Edit") {
      setIsEdit({
        isEditing: true,
        guid: itemView.viewItemGuid,
        path: itemView.viewItemPath,
      });
    }
  }, []);

  const OpenSnack = async (e) => {
    await setSnackOpen({ isOpen: true, text: e });
  };

  const DirectToItem = async (path, guid) => {
    //props.toggleSubScreen(false, "View", guid, path, filterState);
    var isapprove = false;
    if (path === "ItemSheetApproveds") {
      isapprove = true;
    }
    await setItemsState({
      ...itemsState,
      selectedApproved: isapprove,
      viewingItem: true,
      viewItemGuid: guid,
      viewItemPath: path,
    });

    await setItemView({
      ...itemView,
      selectedApproved: isapprove,
      viewingItem: true,
      viewItemGuid: guid,
      viewItemPath: path,
    });
  };

  const GoToEditItem = async (path, guid) => {
    // props.toggleSubScreen(false, "Edit", guid, path, filterState);
    await setIsEdit({ isEditing: true, guid: guid, path: path });

    await setItemView({
      ...itemView,
      editingItem: true,
      viewItemGuid: guid,
      viewItemPath: path,
    });
  };

  const NewItemLink = async () => {
    await setIsCreate(true);
  };

  const GoBackFromCreateEdit = async () => {
    //props.toggleSubScreen(true, "", "", "", "goback");
    await setIsEdit({ isEditing: false, guid: null });
    await setIsCreate(false);
    await setItemsState({
      ...itemsState,
      viewingItem: false,
      viewItemGuid: null,
      viewItemPath: null,
    });

    await setItemView({
      ...itemView,
      editingItem: false,
      viewingItem: false,
      viewItemGuid: null,
      viewItemPath: null,
    });
  };

  const pushFilter = async (filter) => {
    if (isSelect) {
      //props.toggleSubScreen(true, "Select", "", "", filter);
      await setFilterState(filter);

      await setItemView({
        ...itemView,
        filter: filter,
      });
      return;
    }
    //props.toggleSubScreen(true, "", "", "", filter);

    await setFilterState(filter);
    await setItemView({
      ...itemView,
      filter: filter,
    });
  };

  const GoToSelect = () => {
    props.toggleSubScreen(true, "Select", "", "", filterState);
    setIsSelect(true);
  };

  const GoBackFromSelect = async () => {
    setIsSelect(false);
    //props.toggleSubScreen(true, "", "", "", "goback");
    await setItemsState({
      ...itemsState,
      viewingItem: false,
      viewItemGuid: null,
      viewItemPath: null,
    });

    await setItemView({
      ...itemView,
      editingItem: false,
      viewingItem: false,
      viewItemGuid: null,
      viewItemPath: null,
    });
  };

  const ToggleSwitch = async (e) => {
    for (const key of Object.keys(e)) {
      await setItemView({
        ...itemView,
        [key]: e[key],
      });
      props.ToggleSwitches(e);
    }
  };

  const theme = createTheme({
    palette: {
      success: {
        main: "#1e9f32",
        light: lighten("#1e9f32", 0.1),
        lighter: lighten("#1e9f32", 0.2),
        lightest: lighten("#1e9f32", 0.3),
      },
      fail: {
        main: "#bb202e",
        light: lighten("#bb202e", 0.1),
        lighter: lighten("#bb202e", 0.2),
      },
      gradient: {
        primary: "linear-gradient(to top,  #187f28, #1e9f32)",
        fail: "linear-gradient(to top,  #961a25, #bb202e)",
      },
    },
  });

  if (
    approvQuery.isLoading ||
    unapprovQuery.isLoading ||
    allTagsQuery.isLoading ||
    userGuidQuery.isLoading
  )
    return (
      <div>
        <Loading />
      </div>
    );
  if (
    approvQuery.isError ||
    unapprovQuery.isError ||
    allTagsQuery.isError ||
    userGuidQuery.isError
  )
    return <div>Error!</div>;

  return (
    <>
      {itemView.viewingItem === false ? (
        !isCreate ? (
          !isEdit.isEditing ? (
            !isSelect ? (
              <>
                <ItemsListPage
                  isSearch={false}
                  appdata={approvQuery.data}
                  undata={unapprovQuery.data}
                  Filters={
                    itemView !== undefined &&
                    itemView !== null &&
                    itemView.filter !== undefined &&
                    itemView.filter !== null
                      ? itemView.filter
                      : null
                  }
                  larpTags={
                    allTagsQuery.data.find((tags) => tags.tagType === "LARPRun")
                      ?.tagsList
                  }
                  tagslist={
                    allTagsQuery.data.find((tags) => tags.tagType === "Item")
                      ?.tagsList
                  }
                  authLevel={authLevel}
                  userGuid={userGuidQuery.data}
                  selectedApproved={itemView.selectedApproved}
                  commentFilterOn={itemView.commentFilter}
                  showApprovableOnly={itemView.showApprovableOnly}
                  readyApproved={itemView.readyApproved}
                  ToggleSwitches={(e) => ToggleSwitch(e)}
                  DirectToItem={(path, guid) => DirectToItem(path, guid)}
                  NewItemLink={(e) => NewItemLink(e)}
                  NavToSelectItems={() => GoToSelect()}
                  Edit={(path, guid) => GoToEditItem(path, guid)}
                  UpdateFilter={(filter) => pushFilter(filter)}
                />
              </>
            ) : (
              <>
                <ItemSelector
                  appdata={approvQuery.data}
                  isSearch={false}
                  isCharSheet={false}
                  undata={unapprovQuery.data}
                  Filters={
                    itemView !== undefined &&
                    itemView !== null &&
                    itemView.filter !== undefined &&
                    itemView.filter !== null
                      ? itemView.filter
                      : null
                  }
                  initialItems={{
                    show: false,
                    label: "Selection for Printing",
                    startingItems: itemView.listItems,
                  }}
                  larpTags={
                    allTagsQuery.data.find((tags) => tags.tagType === "LARPRun")
                      ?.tagsList
                  }
                  tagslist={
                    allTagsQuery.data.find((tags) => tags.tagType === "Item")
                      ?.tagsList
                  }
                  authLevel={authLevel}
                  userGuid={userGuidQuery.data}
                  selectedApproved={itemView.selectedApproved}
                  commentFilterOn={itemView.commentFilter}
                  showApprovableOnly={itemView.showApprovableOnly}
                  GoBack={() => GoBackFromSelect()}
                  UpdateItemList={(itemList) => props.UpdateItemsList(itemList)}
                  UpdateFilter={(filter) => pushFilter(filter)}
                  ToggleSwitches={(e) => ToggleSwitch(e)}
                />
              </>
            )
          ) : (
            <>
              <ItemEdit
                formJSON={formJSON}
                tagslist={allTagsQuery.data}
                guid={isEdit.guid}
                path={isEdit.path}
                OpenSnack={(e) => OpenSnack(e)}
                GoBack={() => GoBackFromCreateEdit()}
              />
            </>
          )
        ) : (
          <>
            <ItemCreate
              formJSON={formJSON}
              tagslist={allTagsQuery.data}
              GoBack={() => GoBackFromCreateEdit()}
            />
          </>
        )
      ) : (
        <>
          <ItemDisplay
            path={itemView.viewItemPath}
            guid={itemView.viewItemGuid}
            GoBackToList={() => GoBackFromCreateEdit()}
          />
        </>
      )}
      <ThemeProvider theme={theme}>
        <Slide in={snackOpen.isOpen} direction="up">
          <Snackbar
            ContentProps={
              snackOpen.text.includes("Success")
                ? {
                    sx: {
                      background: (theme) => theme.palette.gradient.primary,
                    },
                  }
                : { sx: { background: (theme) => theme.palette.gradient.fail } }
            }
            open={snackOpen.isOpen}
            autoHideDuration={5000}
            onClose={handleSnackClose}
            message={snackOpen.text}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            action={
              <>
                <IconButton
                  sx={{ p: 0.5, position: "left" }}
                  onClick={handleSnackClose}
                >
                  <CloseSharpIcon />
                </IconButton>
              </>
            }
          />
        </Slide>
      </ThemeProvider>
    </>
  );
}

ItemsIndex.propTypes = {
  NewItemLink: PropTypes.func,
  NavToSelectItems: PropTypes.func,
  subState: PropTypes.object,
  ToggleSwitches: PropTypes.func,
  toggleSubScreen: PropTypes.func,
  ismain: PropTypes.bool,
  UpdateItemsList: PropTypes.func,
};
