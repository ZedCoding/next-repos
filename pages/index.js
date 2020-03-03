import { useEffect } from "react";
import { Button, Icon, Tabs } from "antd";
import { request } from "../lib/api";
import getConfig from "next/config";
import { connect } from "react-redux";
import Repo from "../components/Repo";
import Router, { withRouter } from "next/router";
import { setCacheArray } from "../lib/repo-basic-cache";

const { publicRuntimeConfig } = getConfig();
const { TabPane } = Tabs;

const isServer = typeof window === "undefined";
let cachedUserRepos, cachedUserStarredRepos;

function Index({ userRepos, userStarredRepos, user, router }) {
  const tabKey = router.query.key || "1";
  const handleTabChange = activeKey => {
    Router.push(`/?key=${activeKey}`);
  };
  useEffect(() => {
    if (!isServer) {
      cachedUserRepos = userRepos;
      cachedUserStarredRepos = userStarredRepos;
      const timeout = setTimeout(() => {
        cachedUserRepos = null;
        cachedUserStarredRepos = null;
      }, 1000 * 60 * 10);
      // clearTimeout(timeout);
    }
  }, [userRepos, userStarredRepos]);
  
  useEffect(() => {
    if (!isServer) {
      setCacheArray(userRepos);
      setCacheArray(userStarredRepos);
    }
  });

  if (!user || !user.id) {
    return (
      <div className="root">
        <p>亲，您还没有登录哦~</p>
        <Button type="primary" href={publicRuntimeConfig.OAUTH_URL}>
          立即登录
        </Button>
        <style jsx>{`
          .root {
            height: 500px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
        `}</style>
      </div>
    );
  }
  return (
    <div className="root">
      <div className="user-info">
        <img src={user.avatar_url} alt="user avatar" className="avatar" />
        <span className="login">{user.login}</span>
        <span className="name">{user.name}</span>
        <span className="bio">{user.bio}</span>
        <span className="location">
          <Icon type="environment" style={{ marginRight: 5 }} />
          <span>{user.location}</span>
        </span>
      </div>
      <div className="user-repos">
        <Tabs activeKey={tabKey} onChange={handleTabChange} animated={false}>
          <TabPane tab="你的仓库" key="1">
            {userRepos.map(repo => (
              <Repo repo={repo} key={repo.id} />
            ))}
          </TabPane>
          <TabPane tab="你关注的仓库" key="2">
            {userStarredRepos.map(repo => (
              <Repo repo={repo} key={repo.id} />
            ))}
          </TabPane>
        </Tabs>
      </div>
      <style jsx>{`
        .root {
          display: flex;
          padding: 20px 0;
        }
        .user-info {
          width: 200px;
          margin-right: 40px;
          display: flex;
          flex-direction: column;
        }
        .avatar {
          width: 100%;
          border-radius: 5px;
        }
        .login {
          font-weight: 800;
          font-size: 20px;
          margin-top: 20px;
        }
        .name {
          font-size: 16px;
          color: #777;
        }
        .bio {
          margin: 10px 0;
          color: #333;
        }
        .user-repos {
          flex-grow: 1;
        }
      `}</style>
    </div>
  );
}

Index.getInitialProps = async ({ ctx, reduxStore }) => {
  const { user } = reduxStore.getState();
  if (!user || !user.id) return;

  if (!isServer) {
    // if (cache.get('userRepos') && cache.get('userStarredRepos')) {
    //   return {
    //     userRepos: cache.get('userRepos'),
    //     userStarredRepos: cache.get('userStarredRepos')
    //   };
    // }
    if (cachedUserRepos && cachedUserStarredRepos) {
      return {
        userRepos: cachedUserRepos,
        userStarredRepos: cachedUserStarredRepos
      };
    }
  }
  const userRepos = await request(
    {
      url: "/user/repos"
    },
    ctx.req,
    ctx.res
  );
  const userStarredRepos = await request(
    {
      url: "/user/starred"
    },
    ctx.req,
    ctx.res
  );
  return {
    userRepos: userRepos.data,
    userStarredRepos: userStarredRepos.data
  };
};

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default withRouter(connect(mapStateToProps)(Index));
