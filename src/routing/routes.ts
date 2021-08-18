import { createStackNavigator } from '@react-navigation/stack'

export enum MainRoutes {
    Splash = 'Splash',
    Login = 'Login',
    LogoutScreen = 'LogoutScreen',
    ServicesScreen = 'ServicesScreen',
    SettingsScreen = 'SettingsScreen',
    ServiceDetailsScreen = 'ServiceDetailsScreen',
}

export type MainStackParamList = {
    [MainRoutes.Splash]: undefined
    [MainRoutes.Login]: undefined
    [MainRoutes.LogoutScreen]: undefined
    [MainRoutes.SettingsScreen]: undefined
    [MainRoutes.ServicesScreen]: undefined
    [MainRoutes.ServiceDetailsScreen]: undefined
}

export const MainStack = createStackNavigator<MainStackParamList>()