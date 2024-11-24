import { useDispatch } from "react-redux";
import { filterBy } from "../reducers/filterReducer";

const Filter = () => {
  const dispatch = useDispatch();
  const handleChange = (e) => {
    dispatch(filterBy(e.target.value));
  };

  const style = {
    marginBottom: 10,
  };

  return (
    <div style={style}>
      filter <input type="text" name="filter" onChange={handleChange} />
    </div>
  );
};

export default Filter;
