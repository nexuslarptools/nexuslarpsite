export const processItemFormData = (formJSON, fields) => 
      {
      const formData = []

      for (const key of Object.keys(formJSON)) {
      let sectionData = ''
      for (const subkey of Object.keys(formJSON[key].Values)) {
        const formValue = fields[subkey]
        if (formJSON[key].Values[subkey].Display) {
          const jsonItem = {
            [subkey]: {
              Type: formJSON[key].Values[subkey].Type,
              Name: formJSON[key].Values[subkey].Label,
              Value: formValue
            }
          }
          sectionData = Object.assign(sectionData, jsonItem)
        }
      }
      const section = {
        Heading: formJSON[key].Heading,
        Values: sectionData
      }
      formData.push(section)
    }

    return {
      formData,
      show: true
    }
  }