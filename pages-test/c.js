import React, {
  useState,
  useEffect,
  useReducer,
  useLayoutEffect,
  useContext,
  useRef,
  memo,
  useMemo,
  useCallback
} from "react";
import MyContext from "../lib/my-context";

function countReducer(state, action) {
  switch (action.type) {
    case "add":
      return state + 1;
    case "minus":
      return state - 1;
    default:
      return state;
  }
}

const Child = memo(function Child({ config, onButtonClick }) {
  console.log("child render");
  return (
    <button onClick={onButtonClick} style={{ color: config.color }}>
      {config.text}
    </button>
  );
});

function MyCountFunc() {
  const [count, dispatchCount] = useReducer(countReducer, 1);
  const [name, setName] = useState("jack");
  // const context = useContext(MyContext);

  const config = useMemo(
    () => ({
      text: `count is ${count}`,
      color: count > 3 ? "red" : "blue"
    }),
    [count]
  );
  useEffect(() => {
    console.log("effect invoked");
    return () => console.log("effect deteched");
  }, [count]);

  // useLayoutEffect(() => {
  //   console.log("layout effect invoked");
  //   return () => console.log("layout effect deteched");
  // }, [count]);

  // const handleButtonClick = useCallback(
  //   () => dispatchCount({ type: "add" }),
  //   []
  // );

  const handleButtonClick = useMemo(
    () => () => dispatchCount({ type: "add" }),
    []
  );

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
      <Child config={config} onButtonClick={handleButtonClick} />
    </div>
  );
}

export default MyCountFunc;
