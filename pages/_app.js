import React from "react";
import App from "next/app";
import Head from "next/head";
import Router from "next/router";
import "antd/dist/antd.css";
import { Provider } from "react-redux";
import WithReduxApp from "../lib/with-redux";
import Layout from "../components/Layout";
import PageLoading from "../components/PageLoading";

class MyApp extends App {
  state = {
    loading: false
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

  startLoading = () => {
    this.setState({
      loading: true
    });
  };

  stopLoading = () => {
    this.setState({
      loading: false
    });
  };

  componentDidMount() {
    // "routeChangeStart",
    // "routeChangeComplete",
    // "routeChangeError",
    Router.events.on("routeChangeStart", this.startLoading);
    Router.events.on("routeChangeComplete", this.stopLoading);
    Router.events.on("routeChangeError", this.stopLoading);

  }
  componentWillUnmount() {
    Router.events.off("routeChangeStart", this.startLoading);
    Router.events.off("routeChangeComplete", this.stopLoading);
    Router.events.off("routeChangeError", this.stopLoading);
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props;
    return (
      <Provider store={reduxStore}>
        {this.state.loading ? <PageLoading /> : null}
        <Layout>
          <Head>
            <title>My Cool App</title>
          </Head>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    );
  }
}

export default WithReduxApp(MyApp);
