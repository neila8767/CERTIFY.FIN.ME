import '../styles/App.css';
import '../styles/Header.css';
import '../styles/globals.css';


import { AuthProvider } from './PageAcceuil/AuthContext';
import Head from 'next/head'; // 👉 Ajouté ici

function MyApp({ Component, pageProps }) {
  return (
    <>


      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}

// Si vous surchargez getInitialProps dans _app.js
MyApp.getInitialProps = async (appContext) => {
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }
  return { pageProps };
};

export default MyApp;
