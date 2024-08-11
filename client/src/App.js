import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; // BrowserRouter aliasing
import Navbaar from './Components/header/Navbaar';
import Newnav from './Components/newnav/Newnav';
import Maincomp from './Components/home/Maincomp';
import Footer from './Components/footer/Footer';
import Signup from './Components/signup_signin/SignUp';
import Sign_in from './Components/signup_signin/Sign_in';
import Cart from './Components/cart/Cart';
import Buynow from './Components/buynow/Buynow';
import CircularProgress from '@mui/material/CircularProgress';
import './App.css';

function App() {
  const [data, setData] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setData(true);
    }, 2000);
  }, []);

  return (
    <>
      {
        data ? (
          <Router basename="/full-stack-e-com-client">
            <Navbaar />
            <Newnav />
            <Switch>
              <Route exact path="/" component={Maincomp} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/login" component={Sign_in} />
              <Route exact path="/getproductsone/:id" component={Cart} />
              <Route exact path="/buynow" component={Buynow} />
            </Switch>
            <Footer />
          </Router>
        ) : (
          <div className="circle">
            <CircularProgress />
            <h2>Loading....</h2>
          </div>
        )
      }
    </>
  );
}

export default App;
