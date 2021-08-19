import React, { useEffect, useState } from 'react'
import { ScrollView, SafeAreaView, TextInput, Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, Button, Image, FlatList, ViewStyle, TouchableWithoutFeedback, TextStyle } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from "@react-navigation/native"
import { MainNavigationProp } from '../routing/types'
import { MainRoutes } from '../routing/routes'
import { AutoImage } from "../../components/auto-image/auto-image"
import { color, spacing } from "../../theme"
import { load, loadString, save, saveString, clear, remove } from "../../utils/storage"

import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen'


const globalstyle = require('../../assets/style');
//const navigation = useNavigation();
const arrow = require("./icons/arrow-left.png")
const logout = require("./icons/logout.png")


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

    const route = useRoute();
    const routeItem = route.params;
    //console.log('ROUTE SD' + routeItem.item.id);

    const regex = /(<([^>]+)>)/ig;
    const description = routeItem.item.content.rendered.replace(regex, '');

    //routeItem.item.custom_fields.service_is_work_complete
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

            //console.log(user_token);
            let user_websiteurl = await loadString("user_websiteurl");
            //console.log(user_websiteurl);
            //"{siteurl}/wp-json/service/v2/update";
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user_token,
                },
                body: JSON.stringify({ post_id: post_id, status: status, notes: additionalNotes.value })
            };
            //user_websiteurl = 'https://staging.bucklit.com.au/service-tracking/wordpress/';
            return fetch(user_websiteurl + '/wp-json/service/v2/update', requestOptions)
                .then((response) => response.json())
                .then((responseJson) => {
                    setLoading(false);
                    //console.log(responseJson);
                    //show Model - with updated status
                    //showAlert();
                    navigation.navigate(MainRoutes.ServicesScreen)
                })
                .catch(error => {
                    setLoading(false);
                    //setErrorState({ errorMessage: error.toString() });
                    setErrortext(error.toString());
                    //console.error('There was an error!', error);
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
                            <Text style={[globalstyle.TITLE]} >Service Details</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate(MainRoutes.LogoutScreen)}>
                            <AutoImage source={logout} style={{ height: 50, resizeMode: "contain" }} />
                        </TouchableOpacity>
                        {/* <View style={RIGHT} /> */}
                    </View>

                    <View >



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
                                        height: hp('5%'),
                                        width: wp('100%'),
                                        backgroundColor: color.palette.lightGrey,
                                        borderWidth: 0,
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



                        <View style={globalstyle.FIELD_BORDER}>
                            <View style={{ flex: 1 }}>
                                <Text style={[{ flexWrap: 'wrap', lineHeight: 18, textAlign: 'left', color: '#000' }]}>
                                    {description}
                                </Text>
                            </View>
                        </View>

                        <View style={globalstyle.FIELD_BORDER}>

                            <View style={globalstyle.CONTENT}>
                                <View
                                    style={{
                                        height: hp('8%'),
                                        width: wp('100%'),
                                        backgroundColor: color.palette.lightGrey,
                                        borderWidth: 0,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 0,
                                        margin: 0
                                    }}>
                                    <Text style={{ fontSize: 14, color: '#FFFFFF' }}>
                                        <Image
                                            style={styles.userImage}
                                            source={require('./icons/customer.png')}
                                        />
                                        <Text style={globalstyle.TEXT}>
                                            CUSTOMER
                                        </Text>
                                    </Text>
                                </View>
                            </View>
                            <View style={globalstyle.CONTENT}>
                                <Text style={globalstyle.TEXT}>
                                    <Text style={styles.userCityText}>
                                        {routeItem.item.custom_fields.service_customer.display_name}
                                    </Text>
                                    <Text style={styles.userCityText}>
                                        - {routeItem.item.custom_fields.service_customer.first_name} {routeItem.item.custom_fields.service_customer.last_name}
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

                        </View>

                        <View style={globalstyle.FIELD_BORDER}>
                            <View style={globalstyle.CONTENT}>

                                <View
                                    style={{
                                        height: hp('8%'),
                                        width: wp('100%'),
                                        backgroundColor: color.palette.lightGrey,
                                        borderWidth: 0,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 0,
                                        margin: 0
                                    }}>
                                    <Text style={{ fontSize: 14, color: '#FFFFFF' }}>
                                        <Image
                                            style={styles.userImage}
                                            source={require('./icons/technician.png')}
                                        />
                                        <Text style={globalstyle.TEXT}>
                                            TECHNICIAN
                                        </Text>
                                    </Text>
                                </View>


                                <View style={globalstyle.CONTENT}>
                                    <Text style={globalstyle.TEXT}>
                                        <Text style={styles.userCityText}>
                                            {routeItem.item.custom_fields.service_technician.first_name} {routeItem.item.custom_fields.service_technician.last_name}
                                        </Text>
                                    </Text>
                                    <Text style={globalstyle.TEXT}>
                                        <Text style={styles.userCityText}>
                                            {routeItem.item.custom_fields.technician_service_phone}
                                        </Text>
                                    </Text>
                                </View>

                            </View>
                        </View>





                        <View style={globalstyle.CONTENT}>
                            <View style={{ flex: 1 }}>
                                {errortext != '' ? (
                                    <Text style={globalstyle.ERROR_TEXT}> {errortext} </Text>

                                ) : null}
                                <View style={globalstyle.LOADER}>
                                    <ActivityIndicator animating={loading} color={color.primaryDarker} />
                                </View>
                            </View>
                        </View>

                        <View style={globalstyle.CONTENT}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.userCityText}>
                                    CHANGE/UPDATE SERVICE STATUS
                                </Text>
                                <FlatList
                                    scrollEnabled={false}
                                    contentContainerStyle={globalstyle.STATUS_COLOR}
                                    data={[{ key: 'PENDING' }, { key: 'ASSIGNED' }, { key: 'INTRANSIT' }, { key: 'INCOMPLETE' }, { key: 'COMPLETE' }]}
                                    renderItem={({ item }) => (
                                        <TouchableWithoutFeedback>
                                            <View style={globalstyle.TEXT}>
                                                <Text
                                                    onPress={() => updateServiceStatus(routeItem.item.id, item.key)}
                                                    style={{ backgroundColor: selectDefaultItem(item.key), color: color.palette.white, padding: 3 }} >
                                                    {item.key}
                                                </Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    )}
                                />
                            </View>
                        </View>




                        <View style={globalstyle.FIELD_BORDER}>
                            <View style={globalstyle.CONTENT}>
                                <Text style={styles.userCityText}>
                                    UPDATE ADDITIONAL NOTES
                                </Text>
                                <TextInput
                                    placeholder='Additional Notes'
                                    placeholderTextColor={color.palette.black}
                                    underlineColorAndroid={color.transparent}

                                    style={{
                                        flexDirection: 'row',
                                        paddingTop: 4,
                                        borderWidth: 1,
                                        borderColor: '#000',
                                        color: '#000',
                                        height: 100,
                                        width: wp('70%'),
                                        backgroundColor: color.palette.offWhite,
                                        justifyContent: 'flex-start'
                                    }}
                                    returnKeyType="next"
                                    value={additionalNotes.value}
                                    onChangeText={text => setAdditionalNotes({ value: text, error: '' })}
                                    autoCapitalize="none"
                                />
                            </View>



                            <View style={globalstyle.CONTENT}>
                                <TouchableOpacity style={styles.updateStatus} onPress={() => updateStatus(routeItem.item.id, '')}>
                                    <Text style={globalstyle.CONTINUE_TEXT}>Update Notes</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaProvider >
    )
}

const styles = StyleSheet.create({
    page: {
    },
    updateStatus: {
        paddingVertical: spacing[4],
        paddingHorizontal: spacing[4],
        backgroundColor: color.palette.orangeDarker,
        width: wp('65%'),
        borderRadius: 61,
        marginLeft: 10,
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