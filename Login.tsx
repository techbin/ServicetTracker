import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ScrollView, Button, TouchableOpacity, TextInput, View, Image, Text, ViewStyle, Switch, TextStyle, ActivityIndicator, ImageStyle, SafeAreaView } from "react-native"
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import { MainNavigationProp } from './src/routing/types'
import { MainRoutes } from './src/routing/routes'
import { palette } from "./theme/palette"
import { color, spacing, typography } from "./theme"
import { load, loadString, save, saveString, clear, remove } from "./utils/storage"
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
 } from 'react-native-responsive-screen'
 
const globalstyle = require('./assets/style');
const logo = require("./assets/images/stlogo.png")


export const emailValidator = (email: string) => {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) return 'Username cannot be empty.';
  //if (!re.test(email)) return 'Ooops! We need a valid email address.';

  return '';
};

export const passwordValidator = (password: string) => {
  if (!password || password.length <= 0) return 'Password cannot be empty.';

  return '';
};

export const nameValidator = (name: string) => {
  if (!name || name.length <= 0) return 'Website URL cannot be empty.';

  return '';
};


type LoginScreenProps = {
  navigation: MainNavigationProp<MainRoutes.Login>
}

const Login = ({ navigation }: LoginScreenProps): React.ReactElement => {
  //export default function Login() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();


  const [websiteurl, setWebsiteURL] = useState({ value: '', error: '' });
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [errortext, setErrortext] = useState('');
  const [loading, setLoading] = useState(false);

  const [isCustomerProfileEnabled, setIsCustomerProfileEnabled] = useState(true);
  const toggleSwitch = () => setIsCustomerProfileEnabled(previousState => !previousState);

  const nextScreen = () => {


    setLoading(true);

    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    const websiteURLError = nameValidator(websiteurl.value);


    if (websiteURLError) {
      setWebsiteURL({ ...websiteurl, error: websiteURLError });
      setErrortext(websiteURLError);
      return;
    }

    if (emailError) {
      setEmail({ ...email, error: emailError });
      setErrortext(emailError);
      return;
    }

    if (passwordError) {
      setPassword({ ...password, error: passwordError });
      setErrortext(passwordError);
      return;
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email.value, password: password.value })
    };

    fetch( websiteurl.value + '/wp-json/jwt-auth/v1/token', requestOptions)
      .then(async response => {

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
          return '';//Promise.reject(error);
        }

        /* response: http response, data: actual response */
        const storeUserData = async () => {
          console.log(data);
          await saveString("user_websiteurl", websiteurl.value);
          await saveString("username", email.value);
          await saveString("user_email", data.user_email);
          await saveString("user_token", data.token);
          await saveString("user_name", data.user_display_name);
          await saveString("loggedinid", data.user_id.toString());
          await saveString("user_avatar", data.avatar);
          //await saveString("user_role", data.user_role);
          await saveString("isCustomerProfile", isCustomerProfileEnabled ? 'customer' : 'technician');
        }
        storeUserData();
        setLoading(false);
        //console.log('userid ' + data.user_id);
        navigation.navigate(MainRoutes.SettingsScreen);
      })
      .catch(error => {
        setLoading(false);
        // this.setState({ errorMessage: error.toString() });
        setErrortext(error.toString());
        //console.error('There was an error!', error);
        return '';//Promise.reject(error.toString());
      });

  }

  return (
    <SafeAreaProvider style={globalstyle.CONTAINER}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={globalstyle.FULL}>
          {/* <View style={CONTENT}>
            <Text style={HEADER_TITLE}>Service Tracker</Text>
          </View> */}
          <View style={globalstyle.CONTENT}>

            <Image source={logo} style={globalstyle.BOWSER} />


          </View>
          <View style={globalstyle.CONTENT}>
            <View style={globalstyle.FIELD_TEXT}>
              <TextInput
                placeholder={'WEBSITE URL'}
                placeholderTextColor={color.palette.black}
                underlineColorAndroid={color.transparent}
                style={globalstyle.TEXTFIELD}
                value={websiteurl.value}
                onChangeText={text => setWebsiteURL({ value: text, error: '' })}
                autoCapitalize="none"
              />
            </View>
          </View>


          <View style={globalstyle.FIELD_BORDER}>
            <Text style={globalstyle.TEXT}>
              {'SELECT PROFILE'}
            </Text>
            <Text style={globalstyle.TEXT}>
              {'Customer or Technician/Service-Person'}
            </Text>
            <Switch
              style={{ marginTop: 10, height: 50 }}
              onValueChange={toggleSwitch}
              value={isCustomerProfileEnabled}
            />
            <Text style={globalstyle.TEXT}>
              {isCustomerProfileEnabled ? 'CUSTOMER PROFILE' : 'TECHNICIAN PROFILE'}
            </Text>
          </View>


          <View style={globalstyle.CONTENT}>
            <View style={globalstyle.FIELD_TEXT}>
              <TextInput
                placeholder={'USERNAME'}
                placeholderTextColor={color.palette.black}
                underlineColorAndroid={color.transparent}
                style={globalstyle.TEXTFIELD}
                value={email.value}
                onChangeText={text => setEmail({ value: text, error: '' })}
                autoCapitalize="none"
                autoCompleteType="email"
                textContentType="emailAddress"
                keyboardType="email-address"
              />
            </View>
          </View>



          <View style={globalstyle.CONTENT}>
            <View style={globalstyle.FIELD_TEXT}>
              <TextInput
                secureTextEntry={true}
                placeholder={'PASSWORD'}
                placeholderTextColor={color.palette.black}
                underlineColorAndroid={color.transparent}
                style={globalstyle.TEXTFIELD}
                value={password.value}
                onChangeText={text => setPassword({ value: text, error: '' })}
                autoCapitalize="none"
              />
            </View>
          </View>

        
            <View style={globalstyle.FOOTER_CONTENT}>
              <TouchableOpacity style={globalstyle.CONTINUE} onPress={nextScreen}>
                <Text style={globalstyle.CONTINUE_TEXT}>LOGIN</Text>
              </TouchableOpacity>
            </View>
    

          {errortext != '' ? (
            <Text style={globalstyle.ERROR_TEXT}> {errortext} </Text>
          ) : null}

          <View style={globalstyle.LOADER}>
            <ActivityIndicator animating={loading} color={color.primaryDarker} />
          </View>



          <StatusBar />
        </View>
      </ScrollView>
    </SafeAreaProvider >

  );
}

export default Login