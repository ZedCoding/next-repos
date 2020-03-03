import { withRouter } from "next/router";
// import Comp from "../components/Comp";
import dynamic from "next/dynamic";
import getConfig from "next/config";

const Comp = dynamic(import("../components/Comp"));
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

const B = ({ router, name, time }) => {
  console.log(serverRuntimeConfig, publicRuntimeConfig);
  return (
    <>
      <Comp>
        B {router.query.id} {name} {process.env.customKey}
      </Comp>
      {time}
    </>
  );
};

B.getInitialProps = async () => {
  const moment = await import("moment");
  const promise = new Promise(resolve => {
    setTimeout(() => {
      resolve({
        name: "jack",
        time: moment.default(Date.now() - 60 * 1000).fromNow()
      });
    }, 1000);
  });
  return await promise;
};

export default withRouter(B);
