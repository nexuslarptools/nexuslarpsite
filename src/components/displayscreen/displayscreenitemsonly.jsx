import PropTypes from 'prop-types';
import DisplayScreen from './displayscreen';
import useGetData from '../../utils/getdata';
import Loading from '../loading/loading';

const DisplayScreenItemsOnly = props => {

    let unappstring= '';
    let appstring= '';
    let pathstring = '';

    props.itemList.forEach(item => {
        if (item.path === 'ItemSheetApproveds') {
            for (let i=0; i<item.count; i++) {
              appstring=appstring+'A='+item.guid+'&';
            }
        } 
        else {
            for (let i=0; i<item.count; i++) {
              unappstring=unappstring+'U='+item.guid+'&';
            }
        }
    });

    pathstring=appstring+unappstring;
    pathstring = pathstring.substring(0, pathstring.length - 1);

    const itemsPrintListQuery = useGetData(props.guid, '/api/v1/ItemSheets/MultiPick?'+pathstring);  


    
    if (itemsPrintListQuery.isLoading) 
        return (<div>
            <Loading />
        </div>)
        if (itemsPrintListQuery.isError ) return (<div>
            Error!
            </div>)

    return (
        <>
        <DisplayScreen id={"itemlist"} character={null} itemList={itemsPrintListQuery.data}/>
        </>
    )
}

export default DisplayScreenItemsOnly;

DisplayScreenItemsOnly.propTypes = {
    props: PropTypes.object,
    character: PropTypes.object,
    formJSON: PropTypes.object,
    path: PropTypes.string,
    guid: PropTypes.string,
    id: PropTypes.string,
    itemList: PropTypes.array
  }