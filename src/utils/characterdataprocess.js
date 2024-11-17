export function characterDataProcess(abilitesFormsState, finalImage,  finalImage2, 
    formdata, tagState, itemsTableState, initForm, selectedSeries, gmNotes) {

    let skillData = [];

    for (let j = 0; j < abilitesFormsState.abilitiesFormList.length; j++) {
      if (abilitesFormsState.abilitiesFormList[j] != null) {
        if (abilitesFormsState.abilitiesFormList[j].visible) {
          skillData.push(abilitesFormsState.abilitiesFormList[j]);
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

    if (initForm !== null ) {
    for (const key in initForm.fields) {
      if (formdata === null  || formdata[key] === undefined) {
          formdata = {
          ...formdata,
          [key]: initForm.fields[key]
          }
     }
    }
  }

    const fields = {
      ...formdata,
      Special_Skills: skillData,
      Tags: tagState.listTags,
      Starting_Items: itemsTableState.startingItemFullItems,
      Sheet_Item: itemsTableState.sheetItemFullItem
    }


 
    const allData = {
      Seriesguid: selectedSeries.guid !== null? selectedSeries.guid :'',
      name: formdata !== null &&  formdata.Name !== undefined &&formdata.Name !== null ? formdata.Name :  
         initForm !== null && initForm.name !== null ? initForm.name : '',
      seriesTitle: selectedSeries !== null && selectedSeries.series !== null && selectedSeries.series.title !== null 
                   && selectedSeries.series.title !== ''  ? selectedSeries.series.title :  
                   initForm !== null && initForm.seriesTitle !== null ? initForm.seriesTitle : '',
      imagedata1: bstr,
      imagedata2: bstr2,
      fields,
      gmnotes: gmNotes,
      readyforapproval: fields.readyforapproval,
      sheet_Item: itemsTableState.sheetItemFullItem[0],
      sheet_ItemGuid: itemsTableState.sheetItemGuid,
      starting_Items: itemsTableState.startingItemFullItems[0]
    }
    return allData;
}