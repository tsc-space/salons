import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './routes';
import NoMatch from './NoMatch';
import NavBar from './NavBar';

export default class App extends Component {
  render() {
    return (
      <div>
        <NavBar />

        <Switch>
          { // render(props) {} props中有staticContext属性
            routes.map(({ path, exact, component: Component, ...rest }) => (
              <Route key={path} path={path} exact={exact} render={(props) => (
                <Component {...props} {...rest} />
              )} />
            ))
          }
          <Route render={(props) => <NoMatch {...props} /> } />
        </Switch>
        
      </div>
    );
  }
}