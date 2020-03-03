import { useState, useCallback, useRef } from "react";
import debounce from "lodash/debounce";
import { request } from "../lib/api";
import { Select, Spin } from "antd";

const { Option } = Select;

function SearchUser({onChange, value}) {
  let lastFetchIdRef = useRef(0); // {current: 0}
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);

  const handleChange = (value) => {
    setOptions([]);
    setFetching(false);
    onChange(value);
  }

  const fetchUser = useCallback(
    debounce(async value => {
      console.log("fetching user", value);
      lastFetchIdRef += 1;
      const fetchId = lastFetchIdRef.current;
      setFetching(true);
      setOptions([]);
      const result = await request({
        url: `/search/users?q=${value}`
      });
      console.log("user: ", result);
      if (fetchId !== lastFetchIdRef.current) return;
      const data = result.data.items.map(user => ({
        text: user.login,
        value: user.login
      }));
      setFetching(false);
      setOptions(data);
    }, 500),
    []
  );
  return (
    <Select
      style={{ width: 200 }}
      showSearch={true}
      notFoundContent={
        fetching ? <Spin size="small" /> : <span>nothing...</span>
      }
      filterOption={false}
      placeholder="创建者"
      value={value}
      onChange={handleChange}
      onSearch={fetchUser}  
      allowClear={true}
    >
      {options.map(op => (
        <Option key={op.value} value={op.value}>
          {op.text}
        </Option>
      ))}
    </Select>
  );
}

export default SearchUser;
