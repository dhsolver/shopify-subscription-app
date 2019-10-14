import React from 'react';
import Router from 'next/router';
import ReactGA from 'react-ga';
import App, { Container } from 'next/app';

ReactGA.initialize('UA-132685226-1');

// Track client-side page views with Segment
Router.events.on('routeChangeComplete', url => {
  window.analytics.page(url)
});

export default class MyApp extends App {
  componentDidMount() {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  render () {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    )
  }
}