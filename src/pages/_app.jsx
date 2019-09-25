import '@babel/polyfill';
import React from 'react';
import Router from 'next/router';
import App, { Container } from 'next/app';

// Track client-side page views with Segment
Router.events.on('routeChangeComplete', url => {
  window.analytics.page(url)
});

export default class MyApp extends App {
  render () {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    )
  }
}