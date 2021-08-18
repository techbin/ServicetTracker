// File: src/screens/SettingsScreen.tsx
import React, {useEffect} from 'react'
import { Text, View, StyleSheet, Button } from 'react-native'
import { MainNavigationProp } from '../routing/types'
import { MainRoutes } from '../routing/routes'
import { load, loadString, save, saveString, clear, remove } from "../../utils/storage"
type LogoutScreenProps = {
    navigation: MainNavigationProp<MainRoutes.LogoutScreen>
}


const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
})
const LogoutScreen = ({ navigation }: any): React.ReactElement => {
    useEffect(() => {
        setTimeout(() => {
            async () => {
                //await saveString("user_websiteurl");
                await remove("username");
                await remove("loggedinid");
                await remove("user_email");
                await remove("user_token");
                await remove("user_name");
                await remove("isCustomerProfile");
            }
            navigation.navigate(MainRoutes.Login)
        }, 1000)
    }, [navigation])

    return (
        <View style={styles.page}>
            <Text>logging out...</Text>
        </View>
    )
}
export default LogoutScreen