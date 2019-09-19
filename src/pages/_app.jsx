import React from 'react'
import App, { Container } from 'next/app'

// Track client-side page views with Segment
Router.events.on('routeChangeComplete', url => {
  window.analytics.page(url)
})

export default class MyApp extends App {
  componentDidMount() {

  }

  static async getInitialProps ({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps }
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