import React, { Component } from 'react'
import authenticate from './Authenticate'
import { Redirect, Route } from 'react-router-dom'

const PrivateRoute = ({ component: Component, ...rest }) => {

    return (
        <Route
            {...rest}
            render={props =>
                authenticate() === true ? (
                    <Component {...props} />
                ) : (
                        <Redirect
                            to={{
                                pathname: '/',
                                state: { from: props.location }
                            }}
                        />
                    )
            }
        />

    )
}
export default PrivateRoute
