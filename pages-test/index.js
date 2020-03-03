// import Router from "next/router";
import { connect } from "react-redux";
import { add } from "../store";
// const events = [
//   "routeChangeStart",
//   "routeChangeComplete",
//   "routeChangeError",
//   "beforeHistoryChange",
//   "hashChangeStart",
//   "hashChangeComplete"
// ];

// function makeEvents(type) {
//   return (...args) => {
//     console.log(type, ...args);
//   };
// }

// events.forEach(event => {
//   Router.events.on(event, makeEvents(event));
// });
const Index = ({ count, username, add, rename }) => {
  return (
    <>
      <p>Count: {count}</p>
      <p>UserName: {username}</p>
      <input value={username} onChange={e => rename(e.target.value)} />
      <button onClick={() => add(count)}>do add</button>
    </>
  );
};

Index.getInitialProps = async ({ reduxStore }) => {
  reduxStore.dispatch(add(6));
  return {}
};

export default connect(
  function mapStateToProps(state) {
    return {
      count: state.counter.count,
      username: state.user.username
    };
  },
  function mapDispatchToProps(dispatch) {
    return {
      add: num => dispatch({ type: "ADD", num }),
      rename: name => dispatch({ type: "UPDATE_USERNAME", name })
    };
  }
)(Index);
