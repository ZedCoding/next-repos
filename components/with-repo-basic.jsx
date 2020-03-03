import { useEffect } from "react";
import Link from "next/link";
import { withRouter } from "next/router";
import { request } from "../lib/api";
import Repo from "./Repo";
import { getCache, setCache } from "../lib/repo-basic-cache";

/**
 * to be fixed
 */
// function makeQuery(queryObject) {
//   const query = Object.entries(queryObject)
//     .reduce((result, entry) => {
//       result.push(entry.join('='));
//     }, []).join('&')
//   return `?${query}`;
// }

/**
 * HOC
 */
const isServer = typeof window === "undefined";
export default function(Comp, type = "index") {
  function WithDetail({ repoBasic, router, ...rest }) {
    const { owner, name } = router.query;
    const query = `?owner=${owner}&name=${name}`;

    useEffect(() => {
      if (!isServer) setCache(repoBasic);
    });

    return (
      <div className="root">
        <div className="repo-basic">
          <Repo repo={repoBasic} />
          <div className="tabs">
            {type === "index" ? (
              <span className="tab">Readme</span>
            ) : (
              <Link href={`/detail${query}`}>
                <a className="tab index">Readme</a>
              </Link>
            )}

            {type === "issues" ? (
              <span className="tab">Issues</span>
            ) : (
              <Link href={`/detail/issues${query}`}>
                <a className="tab issues">Issues</a>
              </Link>
            )}
          </div>
        </div>
        <div>
          <Comp {...rest} />
        </div>
        <style jsx>{`
          .root {
            padding-top: 20px;
          }
          .repo-basic {
            padding: 20px;
          }
          .tabs {
            margin-top: 20px;
          }
          .tab + .tab {
            margin-left: 15px;
          }
        `}</style>
      </div>
    );
  }
  WithDetail.getInitialProps = async context => {
    const { ctx } = context;
    const { owner, name } = ctx.query;
    const full_name = `${owner}/${name}`;

    let pageData = {};
    if (Comp.getInitialProps) {
      pageData = await Comp.getInitialProps(context);
    }
    if (getCache(full_name)) {
      return {
        repoBasic: getCache(full_name),
        ...pageData
      };
    }

    const result = await request(
      {
        url: `/repos/${owner}/${name}`
      },
      ctx.req,
      ctx.res
    );
    if (result.status === 200) {
      return {
        repoBasic: result.data,
        ...pageData
      };
    }
  };
  return withRouter(WithDetail);
}
