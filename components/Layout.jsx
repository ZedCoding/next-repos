import React, { useState, useCallback } from "react";
import getConfig from "next/config";
import { withRouter } from "next/router";
import Link from "next/link";
import { connect } from "react-redux";
import { logout } from "../store";
import { Layout, Icon, Input, Avatar, Tooltip, Dropdown, Menu } from "antd";

const { Header, Content, Footer } = Layout;
import Container from "./Container";

const { publicRuntimeConfig } = getConfig();

const githubIconStyle = {
  color: "#fff",
  fontSize: 40,
  paddingTop: 10,
  marginRight: 20,
  cursor: "pointer"
};
const footerStyle = {
  textAlign: "center"
};
function MyLayout({ children, user, logout, router }) {
  const urlQuery = router.query && router.query.query;
  const [search, setSearch] = useState(urlQuery || "");
  const handleSearchChange = useCallback(event => {
    setSearch(event.target.value);
  }, []);
  const handleOnSearch = useCallback(search => {
    router.push(`/search?query=${search}`);
  }, []);
  const handleLogout = useCallback(() => {
    logout();
  }, []);

  const userDropdown = (
    <Menu>
      <Menu.Item>
        <span onClick={handleLogout}>登 出</span>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout>
      <Header>
        <Container renderer={<div className="header-inner" />}>
          <div className="header-left">
            <Link href="/">
              <a>
                <Icon type="github" style={githubIconStyle} />
              </a>
            </Link>
            <div>
              <Input.Search
                value={search}
                placeholder="搜索仓库"
                onChange={handleSearchChange}
                onSearch={handleOnSearch}
              />
            </div>
          </div>
          <div className="header-right">
            {user && user.id ? (
              <Dropdown overlay={userDropdown} placement="bottomCenter">
                <Avatar src={user.avatar_url} size={40} />
              </Dropdown>
            ) : (
              <Tooltip title="点击登录" overlayStyle={{ paddingTop: 5 }}>
                <a href={publicRuntimeConfig.OAUTH_URL}>
                  <Avatar icon="user" size={40} />
                </a>
              </Tooltip>
            )}
          </div>
        </Container>
      </Header>
      <Content>
        <Container>{children}</Container>
      </Content>
      <Footer style={footerStyle}>
        <span>Develop by ZedCoding&nbsp;&nbsp;</span>
        <a href="https://github.com/ZedCoding">https://github.com/ZedCoding</a>
      </Footer>
      <style jsx>{`
        .header-inner {
          display: flex;
          justify-content: space-between;
          color: #fff;
        }
        .header-left {
          display: flex;
          justify-content: flex-start;
        }
        .header-right {
          cursor: pointer;
        }
      `}</style>
      <style jsx global>{`
        #__next {
          height: 100%;
        }
        .ant-layout {
          min-height: 100%;
        }
        .ant-layout-header {
          padding: 0;
        }
        .ant-layout-content {
          background-color: #fff;
        }
      `}</style>
    </Layout>
  );
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logout())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MyLayout));
