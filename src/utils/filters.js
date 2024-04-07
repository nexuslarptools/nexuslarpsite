export function filterSeries(rows, titlefilter, jpntitlefilter, listtags, rowsPerPage, page) {

    let filteredRows = rows.filter(character => character.title.toLocaleLowerCase().includes(titlefilter));
    filteredRows = filterSeriesJpn(filteredRows, jpntitlefilter)
    filteredRows = filterSeriesTags(filteredRows, listtags.listTags)

    const filteredrowstotal = filteredRows.length;
    const filteredPageRows = filteredRows.filter((series, index) => index >= (rowsPerPage * (page)) && index < (rowsPerPage * (page + 1)));
      
    return {
      rows:filteredPageRows,
      total:filteredrowstotal};
}

export function filterSeriesJpn(rows, jpntitlefilter) {

    return rows.filter(character => character.titlejpn.toLocaleLowerCase().includes(jpntitlefilter));
}

export function filterSeriesTags(rows, listTags) {

    if (listTags.length > 0) {
        const newfilter = [];
        rows.forEach((row) => {
          if (row.tags !== null) {
            if (row.tags.length > 0) {
              const listguids = [];
              row.tags.forEach((tag) => {
                listguids.push(tag.guid);
              })
              if (listTags.every(elem => listguids.includes(elem))) {
                newfilter.push(row);
              }
            }
          }
        })
        return newfilter;
    }
    return rows;
}


export default filterSeries