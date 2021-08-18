import React, { useEffect, useState } from 'react'
import { ScrollView, SafeAreaView, TextInput, Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, Button, Image, FlatList, ViewStyle, TouchableWithoutFeedback, TextStyle } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from "@react-navigation/native"
import { MainNavigationProp } from '../routing/types'
import { MainRoutes } from '../routing/routes'
import { AutoImage } from "../../components/auto-image/auto-image"
import { color, spacing } from "../../theme"
import { load, loadString, save, saveString, clear, remove } from "../../utils/storage"
const globalstyle = require('../../assets/style');
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

type ServiceDetailsProps = {
    navigation: MainNavigationProp<MainRoutes.ServiceDetailsScreen>
}

const ServiceDetailsScreen = ({ navigation }: ServiceDetailsProps): React.ReactElement => {
    const goBack = () => navigation.goBack()
    const [errortext, setErrortext] = useState('');
    const [servicesRes, setServicesRes] = useState({});
    const [additionalNotes, setAdditionalNotes] = useState({ value: '', error: '' });
    const [status, setStatus] = useState({ value: 'PENDING', error: '' });
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState('avatar.png');
    

    const description = '';

    useEffect(() => { 
//routeItem.item.custom_fields.service_is_work_complete
        const route = useRoute();
        const routeItem = route.params;
        console.log(routeItem.item.id);
    
    
        const regex = /(<([^>]+)>)/ig;
        const description = routeItem.item.content.rendered.replace(regex, '');
    


    }, []);
    /* 
     Description: API update status and notes
     
     @param post_id: Post ID to be updated
     @param status: New status of the service
     
    */
    const updateStatus = (post_id: any, status: any) => {
        setLoading(true);
        const getTokenAndUpdate = async (post_id: any, status: any) => {
            const user_token = await loadString("user_token");
            // const user_avatar = await loadString("user_avatar");
            // setAvatar(user_avatar);

            console.log(user_token);
            const user_websiteurl = await loadString("user_websiteurl");
            console.log(user_websiteurl);
            //"{siteurl}/wp-json/service/v2/update";
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user_token,
                },
                body: JSON.stringify({ post_id: post_id, status: status, notes: additionalNotes.value })
            };
            return fetch(user_websiteurl + '/wp-json/service/v2/update', requestOptions)
                .then((response) => response.json())
                .then((responseJson) => {
                    setLoading(false);
                    console.log(responseJson);
                    //show Model - with updated status
                    //showAlert();
                    navigation.navigate(MainRoutes.ServicesScreen)
                })
                .catch(error => {
                    setLoading(false);
                    //setErrorState({ errorMessage: error.toString() });
                    setErrortext(error.toString());
                    console.error('There was an error!', error);
                    return '';
                });
        }
        getTokenAndUpdate(post_id, status);
    };


    /* Update service status */
    const updateServiceStatus = (post_id: any, itemkey: any) => {
        setSelectedId(itemkey);//change status state
        updateStatus(post_id, itemkey);
    }

    /* Select clicked item - Change bg color */
    const selectDefaultItem = (itemkey: any) => {
        if (itemkey == selectedId)
            return 'orange';
        else
            return 'purple';
    }
    return (

        <SafeAreaProvider style={globalstyle.CONTAINER}>
            {/* <ScrollView
                style={[preset.scroll.outer]}
                contentContainerStyle={[preset.fixed.inner, globalstyle.style]}
                keyboardShouldPersistTaps={"handled"}
            > */}
                <View style={globalstyle.FULL}>

                    <View style={[globalstyle.ROOT, styles.page]}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <AutoImage source={arrow} />
                        </TouchableOpacity>
                        {/* <View style={LEFT} /> */}
                        <View style={globalstyle.TITLE_MIDDLE}>
                            <Text style={[globalstyle.TITLE]} >Service Details</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate(MainRoutes.LogoutScreen)}>
                            <AutoImage source={logout} style={{ height: 50, resizeMode: "contain" }} />
                        </TouchableOpacity>
                        {/* <View style={RIGHT} /> */}
                    </View>


                    {errortext != '' ? (
                        <Text style={globalstyle.ERROR_TEXT}> {errortext} </Text>

                    ) : null}
                    <View >
                        <View style={globalstyle.LOADER}>
                            <ActivityIndicator animating={loading} color={color.primaryDarker} />
                        </View>


                        <View style={globalstyle.CONTENT}>
                            <Text style={globalstyle.TEXT}>
                                <Text style={styles.userNameText}>{routeItem.item.title.rendered}</Text>
                            </Text>
                        </View>




                        <View style={globalstyle.CONTENT}>
                            <Text style={globalstyle.TEXT}>
                                <Text style={styles.userCityText} >
                                    <Image
                                        style={{ marginBottom: -20 }}
                                        source={require('./icons/calendar.png')}
                                    />    {routeItem.item.custom_fields.service_booked_on_datetime}
                                </Text>
                            </Text>
                        </View>




                        <View style={globalstyle.CONTENT}>
                            <Text style={globalstyle.TEXT}>
                                <View
                                    style={{
                                        height: 35,
                                        backgroundColor: color.palette.orangeDarker,
                                        borderWidth: 0,
                                        width: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 0,
                                        margin: 0
                                    }}>
                                    <Text style={{ fontSize: 14, color: '#FFFFFF' }}>
                                        {routeItem.item.custom_fields.service_is_work_complete}
                                    </Text>
                                </View>
                            </Text>
                        </View>




                        <View style={globalstyle.CONTENT}>
                            <View style={{ flex: 1 }}>
                                <Text style={[{ flexWrap: 'wrap', lineHeight: 18, textAlign: 'left', color: '#000' }]}>
                                    {description}
                                </Text>
                            </View>
                        </View>




                        <View style={globalstyle.CONTENT}>
                            <Text style={globalstyle.TEXT}>
                                <Image
                                    style={styles.userImage}
                                    source={require('./icons/customer.png')}
                                />
                                <Text style={styles.userCityText}>
                                    CUSTOMER
                                </Text>
                                <Text style={styles.userCityText}>
                                    {routeItem.item.custom_fields.service_customer.display_name}
                                </Text>
                                <Text style={styles.userCityText}>
                                    {routeItem.item.custom_fields.service_customer.first_name} {routeItem.item.custom_fields.service_customer.last_name}
                                </Text>
                            </Text>
                        </View>



                        <View style={globalstyle.CONTENT}>
                            <Text style={globalstyle.TEXT}>
                                <Text style={styles.userCityText}>
                                    {routeItem.item.custom_fields.customer_service_phone}
                                </Text>
                            </Text>
                        </View>



                        <View style={globalstyle.CONTENT}>
                            <Text style={globalstyle.TEXT}>
                                <Text style={styles.userCityText}>
                                    {routeItem.item.custom_fields.customer_service_address}
                                </Text>
                            </Text>
                        </View>



                        <View style={globalstyle.CONTENT}>
                            <Text style={globalstyle.TEXT}>
                                <View style={{ flex: 1 }}>
                                    <Image
                                        style={styles.userImage}
                                        source={require('./icons/technician.png')}
                                    />
                                    <Text style={styles.userCityText}>
                                        TECHNICIAN
                                    </Text>
                                    <Text style={styles.userCityText}>
                                        {routeItem.item.custom_fields.service_technician.first_name} {routeItem.item.custom_fields.service_technician.last_name}
                                    </Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.userCityText}>
                                        {routeItem.item.custom_fields.technician_service_phone}
                                    </Text>
                                </View>
                            </Text>
                        </View>







                        <View style={globalstyle.CONTENT}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.userCityText}>
                                    Update Service Status or Notes
                                </Text>
                                <FlatList
                                    contentContainerStyle={globalstyle.TEXTFIELD_COLOR}
                                    data={[{ key: 'PENDING' }, { key: 'ASSIGNED' }, { key: 'INTRANSIT' }, { key: 'INCOMPLETE' }, { key: 'COMPLETE' }]}
                                    renderItem={({ item }) => (
                                        <TouchableWithoutFeedback>
                                            <View style={globalstyle.TEXT}>
                                                <Text
                                                    onPress={() => updateServiceStatus(routeItem.item.id, item.key)}
                                                    style={{ backgroundColor: selectDefaultItem(item.key) }} >
                                                    {item.key}
                                                </Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    )}
                                />
                            </View>
                        </View>





                        <View style={globalstyle.CONTENT}>
                            <TextInput
                                placeholder='Additional Notes'
                                placeholderTextColor={color.palette.lighterGrey}
                                underlineColorAndroid={color.transparent}

                                style={{
                                    flexDirection: 'row',
                                    paddingTop: 20,
                                    borderWidth: 1,
                                    borderColor: '#000',
                                    color: '#000',
                                    height: 100,
                                    width: 400,
                                    backgroundColor: 'darkgrey',
                                    justifyContent: 'flex-end'
                                }}
                                returnKeyType="next"
                                value={additionalNotes.value}
                                onChangeText={text => setAdditionalNotes({ value: text, error: '' })}
                                autoCapitalize="none"
                            />
                        </View>



                        <View style={globalstyle.CONTENT}>
                            <TouchableOpacity onPress={() => updateStatus(routeItem.item.id, '')}>
                                <Text>Update Notes</Text>
                            </TouchableOpacity>
                        </View>

                    </View>


                </View>
            {/* </ScrollView> */}
        </SafeAreaProvider >
    )
}

const styles = StyleSheet.create({
    page: {
    },

    cardContainer: {
        backgroundColor: color.palette.offWhite,
        color: '#000',
        fontSize: 15,
        fontWeight: '600',
        borderWidth: 1,
        flex: 1,
        margin: 10,
        padding: 10,
    },

    replyCardContainer: {
        backgroundColor: color.palette.offWhite,
        color: '#000',
        fontSize: 15,
        fontWeight: '600',
        borderWidth: 1,
        flex: 1,
        margin: 10,
        padding: 10,
    },


    headerColumn: {
        backgroundColor: 'transparent',
    },

    placeIcon: {
        color: '#000',
        fontSize: 26,
    },

    userAddressRow: {
        flex: 1,
        paddingTop: 30,
    },
    userCityRow: {
        backgroundColor: 'transparent',
    },
    userCityText: {
        color: '#000',
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
        margin: 5
    },
    userImage: {
        borderColor: '#000',
        // borderRadius: 85,
        // borderWidth: 1,
        height: 32,
        marginBottom: 0,
        alignItems: 'center',
        width: 32,
    },

    userNameText: {
        color: '#000',
        fontSize: 22,
        fontWeight: 'bold',
        paddingBottom: 8,
        textAlign: 'center',
    }
})

export default ServiceDetailsScreen