import loading from '../../assets/loading.svg'
import '../../index.scss';

export const Loading = () => (
  <div className="loading-container">
    <img src={loading} alt="Loading" className="loaderpic" />
  </div>
)

export default Loading
