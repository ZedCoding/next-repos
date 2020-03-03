import React from "react";
import App from "next/app";
import Layout from "../components/Layout";
import Head from "next/head";
import MyContext from "../lib/my-context";
import "antd/dist/antd.css";
import { Provider } from "react-redux";
import WithReduxApp from "../lib/with-redux";

class MyApp extends App {
  state = {
    context: "test"
  };
  static async getInitialProps(ctx) {
    const { Component } = ctx;
    console.log("app init");
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    return {
      pageProps
    };
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props;
    return (
      <Layout>
        <Head>
          <title>My Cool App</title>
        </Head>
        <Provider store={reduxStore}>
          <MyContext.Provider value={this.state.context}>
            <Component {...pageProps} />
          </MyContext.Provider>
        </Provider>
      </Layout>
    );
  }
}

export default WithReduxApp(MyApp);
