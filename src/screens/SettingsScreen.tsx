import React from 'react'
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, Button, ViewStyle, TextStyle } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MainNavigationProp } from '../routing/types'
import { MainRoutes } from '../routing/routes'
import { AutoImage } from "../../components/auto-image/auto-image"
import { color, spacing } from "../../theme"
const globalstyle = require('../../assets/style');
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen'


type SettingsScreenProps = {
    navigation: MainNavigationProp<MainRoutes.SettingsScreen>
}

//const navigation = useNavigation();
const arrow = require("./icons/arrow-left.png")
const logout = require("./icons/logout.png")


const preset = {
    /**
     * No scrolling. Suitable for full-screen carousels and components
     * which have built-in scrolling like FlatList.
     */
    fixed: {
        outer: {
            backgroundColor: color.background,
            flex: 1,
            height: "100%",
        } as ViewStyle,
        inner: {
            justifyContent: "flex-start",
            alignItems: "stretch",
            height: "100%",
            width: "100%",
        } as ViewStyle,
    },

    /**
     * Scrolls. Suitable for forms or other things requiring a keyboard.
     *
     * Pick this one if you don't know which one you want yet.
     */
    scroll: {
        outer: {
            backgroundColor: color.transparent,
            flex: 1,
            height: "100%",
        } as ViewStyle,
        inner: { justifyContent: "flex-start", alignItems: "stretch" } as ViewStyle,
    },
}


const SettingsScreen = ({ navigation }: SettingsScreenProps): React.ReactElement => (

    <SafeAreaProvider style={globalstyle.CONTAINER}>
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={globalstyle.FULL}>

                <View style={[globalstyle.ROOT, styles.page]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <AutoImage source={arrow} />
                    </TouchableOpacity>
                    {/* <View style={LEFT} /> */}
                    <View style={globalstyle.TITLE_MIDDLE}>
                        <Text style={[globalstyle.TITLE]} >Dashboard</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate(MainRoutes.LogoutScreen)}>
                        <AutoImage source={logout} style={{ height: 50, resizeMode: "contain" }} />
                    </TouchableOpacity>
                    {/* <View style={RIGHT} /> */}
                </View>


                <View style={styles.page}>
                    <View style={globalstyle.CONTENT}>
                        <AutoImage source={require("./icons/avatar.png")} style={styles.profile} />
                    </View>
                </View>

                <View style={globalstyle.FIELD_BORDER}>
                    <View style={globalstyle.CONTENT}>
                        <Text style={globalstyle.BOLD}>
                            <Text>Hello! Welcome to Service Tracker.</Text>
                        </Text>
                        <Text style={globalstyle.TEXT}>
                            <Text>Click on services button to access the services assigned.</Text>
                        </Text>
                    </View>


                    <View style={globalstyle.FOOTER_CONTENT}>
                        <TouchableOpacity style={globalstyle.CONTINUE} onPress={() => navigation.navigate(MainRoutes.ServicesScreen)}>
                            <Text style={globalstyle.CONTINUE_TEXT}>SERVICES</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={globalstyle.FOOTER_CONTENT}>
                        <TouchableOpacity style={globalstyle.CONTINUE} onPress={() => navigation.navigate(MainRoutes.LogoutScreen)}>
                            <Text style={globalstyle.CONTINUE_TEXT}>LOGOUT</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <Button title="Service Details Screen" onPress={() => navigation.navigate(MainRoutes.ServiceDetailsScreen)} /> */}
                </View>


            </View>
        </ScrollView>
    </SafeAreaProvider >

)

const styles = StyleSheet.create({
    page: {
        // flex: 1,
        // backgroundColor: '#fff',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    profile: {
        width: wp('100%'), height: hp('43%'),
        backgroundColor: '#FF0000',
        borderWidth: 2,
        borderRadius: 0,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5
    }
})

export default SettingsScreen