import AuthRedirect from "../../utils/authRedirect";
import Loading from "../../components/loading/loading";
import useGetData from "../../utils/getdata";
import AuthLevelInfo from "../../utils/authLevelInfo";
import { useEffect, useState, useContext } from "react";
import CharactersListPage from "./CharactersListPage";
import CharacterDisplayPage from "./CharacterDisplay";
import CharacterCreate from "./CharacterCreate";
import formJSON from "../../jsonfiles/characterinput.json";
import CharacterEdit from "./CharacterEdit";
import {
  createTheme,
  IconButton,
  lighten,
  Slide,
  Snackbar,
  ThemeProvider,
} from "@mui/material";
import PropTypes from "prop-types";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import { SiteContext } from "../../contexts";

export default function CharactersIndex(props) {
  AuthRedirect(1);

  const handleSnackClose = () => {
    setSnackOpen({ isOpen: false, text: "" });
  };

  const { character, setCharacter } = useContext(SiteContext);

  const approvQuery = useGetData(
    "listApprovedCharacters",
    "/api/v1/CharacterSheetApproveds",
  );
  const unapprovQuery = useGetData(
    "listUnapprovedCharacters",
    "/api/v1/CharacterSheets",
  );
  const allTagsQuery = useGetData("listTags", "/api/v1/Tags/groupbytyperead");
  const userGuidQuery = useGetData("userguid", "/api/v1/Users/CurrentGuid");
  const authLevel = AuthLevelInfo();

  /*const [charactersState, setCharactersState] = useState({
  /  selectedApproved: true,
    commentFilter: false,
    showApprovableOnly: false,
    readyApproved: false,
    viewingItem: false,
    viewItemGuid: "",
    viewItemPath: "",
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
  });
  */

  const [filterState, setFilterState] = useState(null);
  const [isCreate, setIsCreate] = useState(false);
  const [snackOpen, setSnackOpen] = useState({ isOpen: false, text: "" });

  const OpenSnack = async (e) => {
    await setSnackOpen({ isOpen: true, text: e });
  };

  const [isEdit, setIsEdit] = useState({ isEditing: false, guid: null });
  const [filterInit, setfilterInit] = useState(false);

  useEffect(() => {
    if (
      character.ismain === undefined ||
      character.ismain === null ||
      character.ismain === true
    ) {
      setIsCreate(false);
      setIsEdit({ isEditing: false, guid: null });
      setfilterInit(true);
      setFilterState(character.filter);

      if (character.filter !== undefined && character.filter !== null) {
        for (const key in character.filter) {
          if (
            character.filter[key] !== undefined &&
            character.filter[key] !== null &&
            key !== "filters"
          ) {
            setCharacter({
              ...character,
              [key]: character.filter[key],
            });
          }
        }
      }
    } else {
      if (character.create) setIsCreate(true);
    }
    if (character.viewing) {
      setCharacter({
        ...character,
        viewingItem: true,
        viewItemGuid: character.viewGuid,
        viewItemPath: character.viewPath,
      });
    }
    if (character.editing) {
      setIsEdit({
        isEditing: true,
        guid: character.viewGuid,
        path: character.viewPath,
      });
    }
  }, []);

  const DirectToCharacter = async (path, guid) => {
    // props.toggleSubScreen(false, "View", guid, path, filterState);
    await setCharacter({
      ...character,
      viewing: true,
      viewGuid: guid,
      viewPath: path,
    });
  };

  const GoBackToList = async () => {
    //props.toggleSubScreen(true, "", "", "", "goback");
    await setCharacter({
      ...character,
      viewing: false,
      create: false,
      editing: false,
      viewGuid: "",
      viewPath: "",
    });
    await setIsEdit({ isEditing: false, guid: "", path: "" });
    await setIsCreate(false);
    await setfilterInit(true);
  };

  const GoToEditCharacter = async (path, guid) => {
    // props.toggleSubScreen(false, "Edit", guid, path, filterState);
    await setIsEdit({ isEditing: true, guid: guid, path: path });

    await setCharacter({
      ...character,
      editing: true,
      viewGuid: guid,
      viewPath: path,
    });
  };

  const ToggleSwitch = async (e) => {
    for (const key of Object.keys(e)) {
      await setCharacter({
        ...character,
        [key]: e[key],
      });
    }

    //props.ToggleSwitches(e);
  };

  const UnInitFiler = () => {
    setfilterInit(false);
  };

  const NewCharacterLink = async () => {
    //props.toggleSubScreen(false, 'Create', '', '', filterState);
    await setCharacter({
      ...character,
      create: true,
      viewGuid: "",
      viewPath: "",
    });
    await setIsCreate(true);
  };

  const GoBackFromCreateEdit = async () => {
    await setCharacter({
      ...character,
      viewing: false,
      create: false,
      editing: false,
      viewGuid: "",
      viewPath: "",
    });
    await setIsEdit({
      isEditing: false,
      guid: "",
      path: "",
    });
    await setIsCreate(false);
    // props.toggleSubScreen(true, '', '','', 'goback');
  };

  const pushFilter = async (filter) => {
    await setFilterState({ ...filterState, filter });
    await setCharacter({
      ...character,
      filter: filter,
    });
    // props.toggleSubScreen(true, '', '','', filter);
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
    return (
      <div>
        Error! - CharactersIndex
        {approvQuery}
        {unapprovQuery}
        {allTagsQuery}
        {userGuidQuery}
      </div>
    );

  return (
    <>
      {character.viewing === false ? (
        !character.create ? (
          !character.editing ? (
            <>
              <CharactersListPage
                isSearch={false}
                FilterInit={filterInit}
                UnInitFiler={() => UnInitFiler()}
                Filters={
                  character.filter !== undefined && character.filter !== null
                    ? character.filter
                    : null
                }
                appdata={approvQuery.data}
                undata={unapprovQuery.data}
                larpTags={
                  allTagsQuery.data.find((tags) => tags.tagType === "LARPRun")
                    ?.tagsList
                }
                tagslist={
                  allTagsQuery.data.find((tags) => tags.tagType === "Character")
                    ?.tagsList
                }
                authLevel={authLevel}
                userGuid={userGuidQuery.data}
                currentState={character}
                selectedApproved={
                  character !== undefined &&
                  character !== null &&
                  character.selectedApproved !== undefined &&
                  character.selectedApproved !== null
                    ? character.selectedApproved
                    : null
                  //charactersState.selectedApproved
                }
                commentFilterOn={
                  character.commentFilter !== undefined &&
                  character.commentFilter !== null
                    ? character.commentFilter
                    : false
                  //charactersState.commentFilter
                }
                showApprovableOnly={
                  character !== undefined &&
                  character !== null &&
                  character.showApprovableOnly !== undefined &&
                  character.showApprovableOnly !== null
                    ? character.showApprovableOnly
                    : false
                  //charactersState.showApprovableOnly
                }
                readyApproved={
                  character !== undefined &&
                  character !== null &&
                  character.readyApproved !== undefined &&
                  character.readyApproved !== null
                    ? character.readyApproved
                    : false
                  //charactersState.readyApproved
                }
                ToggleSwitches={(e) => ToggleSwitch(e)}
                DirectToCharacter={(path, guid) =>
                  DirectToCharacter(path, guid)
                }
                NewCharacterLink={(e) => NewCharacterLink(e)}
                Edit={(path, guid) => GoToEditCharacter(path, guid)}
                UpdateFilter={(filter) => pushFilter(filter)}
              />
            </>
          ) : (
            <>
              <CharacterEdit
                authLevel={authLevel}
                formJSON={formJSON}
                tagslist={allTagsQuery.data}
                guid={isEdit.guid}
                path={isEdit.path}
                GoBack={() => GoBackFromCreateEdit()}
                OpenSnack={(e) => OpenSnack(e)}
              />
            </>
          )
        ) : (
          <>
            <CharacterCreate
              formJSON={formJSON}
              tagslist={allTagsQuery.data}
              userGuid={userGuidQuery.data}
              GoBack={() => GoBackFromCreateEdit()}
            />
          </>
        )
      ) : (
        <>
          <CharacterDisplayPage
            path={character.viewPath}
            guid={character.viewGuid}
            userGuid={userGuidQuery.data}
            GoBackToList={() => GoBackToList()}
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

CharactersIndex.propTypes = {
  toggleSubScreen: PropTypes.func,
  subState: PropTypes.object,
  ismain: PropTypes.bool,
  ToggleSwitches: PropTypes.func,
};
