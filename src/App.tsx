import React, {useEffect, useContext, Fragment} from 'react';
import {UserContext, withUserContext, UserContextProps} from "./context/userContext";
import {Route, Redirect, BrowserRouter, Switch} from 'react-router-dom'
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import {API_URL, API_ROUTES} from "./constants";
import axios from 'axios'
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2"
import {ROUTES} from "./constants";
import withNavigation from "./components/withNavigation";

const App:React.FC = () => {

   let userContext:UserContextProps = useContext(UserContext)

    useEffect(()=>{

        let token = localStorage.getItem('token')

        console.log(token)

        if (!!token){
            let headers = {'Authorization':'Token '+token}
            axios.get(API_URL+API_ROUTES.CURRENT_USER, {headers:headers})
                .then(res=>{
                    console.log('user can be logged in!')
                    token && userContext.dispatch({type:'login', payload:{user:
                                {email:res.data.email,
                                 name:res.data.name,
                                },
                            token:token}})
                })
                .catch(error=>{
                    alert('An error occurred, please try again!')
                    userContext.dispatch({type:'loaded'})
                })
        } else{
            userContext.dispatch({type:'loaded'})
        }


    },[])


    return (
        userContext.state.loading ?
            <div>
                Loading....
            </div>

            :
        <BrowserRouter>
            <Switch>
                <LoginRoute path={ROUTES.LOGIN} component={Login} exact/>
                <Routes/>
            </Switch>
        </BrowserRouter>


  );
}

const Routes = withNavigation(() => {
    return (
        <Fragment>
            <AuthRoute path={ROUTES.LANDING} component={Dashboard} exact/>
            <AuthRoute path={ROUTES.ROUTE_1} component={Page1} exact/>
            <AuthRoute path={ROUTES.ROUTE_2} component={Page2} exact/>
        </Fragment>
    )
}
)

export default withUserContext(App);


const AuthRoute:React.FC<any> = ({component: ChildComponent, ...rest}) => {

  let userContext:UserContextProps = useContext(UserContext)

  return (
      <Route {...rest}>
        {(props:any) => {
          if (userContext.state.isAuthenticated) {
            return <ChildComponent {...props}/>
          } else  {
            return <Redirect to='/login' />
            //   return <ChildComponent {...props}/>
          }}}
      </Route>)
}



const LoginRoute:React.FC<any> = ({component: ChildComponent, ...rest}) => {

  let userContext:UserContextProps = useContext(UserContext)


  return(
      <Route {...rest}>
    {(props:any) => {
      if (!userContext.state.isAuthenticated) {
        return <ChildComponent {...props}/>
      } else  {
        return <Redirect to='/' />
      }}}
     </Route>)
}