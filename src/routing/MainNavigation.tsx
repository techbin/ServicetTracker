import React from 'react'
import { NavigationContainer } from '@react-navigation/native'

import { MainStack, MainRoutes } from './routes'

import Login from '../../Login'
import SettingsScreen from '../screens/SettingsScreen'
import ServicesScreen from '../screens/ServicesScreen'
import ServiceDetailsScreen from '../screens/ServiceDetailsScreen'
import LogoutScreen from '../screens/LogoutScreen'

const MainNavigation = (): React.ReactElement => {

    return (
        <NavigationContainer>
            <MainStack.Navigator headerMode="none">
                <MainStack.Screen name={MainRoutes.Login} component={Login} />
                <MainStack.Screen name={MainRoutes.SettingsScreen} component={SettingsScreen} />
                <MainStack.Screen name={MainRoutes.ServicesScreen} component={ServicesScreen} />
                <MainStack.Screen name={MainRoutes.ServiceDetailsScreen} component={ServiceDetailsScreen} />
                <MainStack.Screen name={MainRoutes.LogoutScreen} component={LogoutScreen} />
            </MainStack.Navigator>
        </NavigationContainer>
    )
}
export default MainNavigation