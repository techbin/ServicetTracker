import React, {useEffect,useState} from 'react'
import { ScrollView, Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, Button, Image, FlatList, ViewStyle, TouchableWithoutFeedback, TextStyle } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from "@react-navigation/native"
import { MainNavigationProp } from '../routing/types'
import { MainRoutes } from '../routing/routes'
import { AutoImage } from "../../components/auto-image/auto-image"
import { color, spacing } from "../../theme"
import { load, loadString, save, saveString, clear, remove } from "../../utils/storage"


const { serviceImage } = require("./icons/service.png")
const { nextImage } = require("./icons/next.png")

type ServicesScreenProps = {
    navigation: MainNavigationProp<MainRoutes.ServicesScreen>
}

const globalstyle = require('../../assets/style');
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
const showDetails = (item: any) => {
    const navigation = useNavigation();
    navigation.navigate(MainRoutes.ServiceDetailsScreen, { item })
}

const ServicesScreen = ({ navigation }: ServicesScreenProps): React.ReactElement => {

    const [errortext, setErrortext] = useState('');
    const [userIdd, setUserIdd] = useState('');
    const [servicesRes, setServicesRes] = useState({});
    const [loading, setLoading] = useState(true);


    const loadUserData = async () => {

        setLoading(true);

        const user_websiteurl = await loadString("user_websiteurl");
        const userid = await loadString("loggedinid");
        const user_email = await loadString("user_email");
        const user_token = await loadString("user_token");
        const user_name = await loadString("user_name");//dsiplay name
        const username = await loadString("username");
        const isCustomerProfile = await loadString("isCustomerProfile");
        setErrortext('Loading user configuration...')
        setUserIdd(userid+'');
        
        console.log('user ' + userid + ',' + 'user1' + userIdd);
        if (userid != '') {
            fetchServices(user_websiteurl, user_token, user_email, userid, isCustomerProfile);
        }
        else {
            setErrortext('Invaid User Account. Try to login again.')
        }
    }

    function fetchServices(user_websiteurl, user_token, user_email, userid, isCustomerProfile) {
        setLoading(true);
        setErrortext('Fetching services');

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };

        const service_search_customer_or_technician = isCustomerProfile == 'customer' ? 'service_customer' : 'service_assigned_to';
        console.log('isCustomerProfileEnabled ' + service_search_customer_or_technician + ', userid ' + userid);
        const service_search_user_id = userid;
user_websiteurl = 'https://staging.bucklit.com.au/service-tracking/wordpress/';
        fetch(user_websiteurl + '/wp-json/wp/v2/services/?orderby=title&order=asc&search=&meta_key=' + service_search_customer_or_technician + '&meta_value=' + service_search_user_id, requestOptions)
            .then(async response => {
                setErrortext('Fetching services complete...listing');
                setLoading(true);
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();

                // check for error response
                if (!response.ok) {
                    setLoading(false);
                    // get error message from body or default to response status
                    let error = (data && data.message) || response.status;
                    const regex = /(<([^>]+)>)/ig;
                    error = error.replace(regex, '');
                    setErrortext(error);
                    return Promise.reject(error);
                }
                setErrortext('');
                setLoading(false);
                setServicesRes(data);
            })
            .catch((error) => {
                setLoading(false);
                setErrortext(error);
                console.error('There was an error!', error);
            });
        setErrortext('');
        setLoading(false);
    }

    useEffect(() => { 
        loadUserData();
        setInterval(async () => {
            loadUserData();
        }, 25000);

    }, []);

    return (
    <SafeAreaProvider style={globalstyle.CONTAINER}>

        <View style={globalstyle.FULL}>

            <View style={[globalstyle.ROOT, styles.header]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AutoImage source={arrow} />
                </TouchableOpacity>
                {/* <View style={LEFT} /> */}
                <View style={globalstyle.TITLE_MIDDLE}>
                    <Text style={[globalstyle.TITLE]} >Services List</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate(MainRoutes.LogoutScreen)}>
                    <AutoImage source={logout} style={{ height: 50, resizeMode: "contain" }} />
                </TouchableOpacity>
                {/* <View style={RIGHT} /> */}
            </View>
            <View style={globalstyle.LOADER}>
                <ActivityIndicator animating={loading} color={color.primaryDarker} />
            </View>

            <View style={globalstyle.CONTENT}>
                {errortext != '' ? (<Text style={globalstyle.ERROR_TEXT}> {errortext} </Text>) : null}
            </View>
            <FlatList
                contentContainerStyle={globalstyle.FLAT_LIST}
                data={servicesRes}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <TouchableWithoutFeedback onPress={() => navigation.navigate(MainRoutes.ServiceDetailsScreen, { item })}>

                        <View style={styles.mainCardView}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={styles.subCardView}>
                                    <Image
                                        source={serviceImage}
                                        resizeMode="contain"
                                        style={{
                                            borderRadius: 25,
                                            height: 50,
                                            width: 50,
                                        }}
                                    />
                                </View>
                                <View style={{ marginLeft: 12 }}>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            color: '#000000',
                                            fontWeight: 'bold',
                                            textTransform: 'capitalize',
                                        }}>
                                        {item.title.rendered}
                                    </Text>
                                    <View
                                        style={{
                                            marginTop: 4,
                                            borderWidth: 0,
                                            width: '100%',
                                        }}>
                                        <Text
                                            style={{
                                                color: '#000000',
                                                fontSize: 12,
                                            }}>
                                            Service Date and Time: {item.custom_fields.service_booked_on_datetime}
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            height: 25,
                                            backgroundColor: color.storybookDarkBg,
                                            borderWidth: 0,
                                            width: '65%',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 50,
                                            margin: 10
                                        }}>
                                        <Text style={{ fontSize: 10, color: '#FFFFFF' }}>
                                            {item.custom_fields.service_is_work_complete}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View
                                style={{
                                    height: 25,
                                    backgroundColor: '#FF0000',
                                    borderWidth: 0,
                                    width: 25,
                                    marginLeft: -26,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 50,
                                }}>

                                <Image
                                    source={nextImage}
                                    resizeMode="contain"
                                    style={{
                                        borderRadius: 25,
                                        height: 30,
                                        width: 30,
                                    }}
                                />

                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                )}
            />

        </View>

    </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    header: {

    },
    mainCardView : {
        height: 110,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        shadowColor: '#C6C6C6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 16,
        paddingRight: 14,
        marginTop: 6,
        marginBottom: 6,
        marginLeft: 16,
        marginRight: 16,
      },
      subCardView: {
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: color.primaryDarker,
        borderColor: '#eeeeee',
        borderWidth: 1,
        borderStyle: 'solid',
        alignItems: 'center',
        justifyContent: 'center',
      },
      ARROW:{
        alignSelf: "center",
        marginVertical: spacing[5],
        maxWidth: "100%",
        width: 30,
        height: 30,
      }
})

export default ServicesScreen