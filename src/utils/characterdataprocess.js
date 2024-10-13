export function characterDataProcess(abilitesFormsState, finalImage,  finalImage2, 
    formdata, tagState, itemsTableState, initForm, selectedSeries, gmNotes) {

    let skillData = [];

    for (let j = 0; j < abilitesFormsState.abilitiesFormList.length; j++) {
      if (abilitesFormsState.abilitiesFormList[j].Special != null) {
        if (abilitesFormsState.abilitiesFormList[j].visible) {
          skillData.push(abilitesFormsState.abilitiesFormList[j].Special);
        }
      }
    }

    if (!skillData.length || !skillData) {
      skillData = null;
    }

    let bstr = '';
    if (finalImage != null) {
      const arr = finalImage.Blob.split(',');
      bstr = arr[1];
    }

    let bstr2 = '';
    if (finalImage2 != null) {
      const arr2 = finalImage2.Blob.split(',');
      bstr2 = arr2[1];
    }

    const fields = {
      ...formdata,
      Special_Skills: skillData,
      Tags: tagState.listTags,
      Starting_Items: itemsTableState.startingItemGuids,
      Sheet_Item: itemsTableState.sheetItemGuid
    }
 
    const allData = {
      Seriesguid: selectedSeries.guid !== null? selectedSeries.guid :'',
      name: formdata !== null ? formdata.Name : '',
      imagedata1: bstr,
      imagedata2: bstr2,
      fields,
      gmnotes: gmNotes,
      readyforapproval: fields.readyforapproval
    }
    return allData;
}