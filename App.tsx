import 'react-native-gesture-handler';
import * as React from 'react';
import { View, Text, Button } from 'react-native';
import MainNavigation from './src/routing/MainNavigation'

export default function App(): React.ReactElement {
    return (
            <MainNavigation />
    )
}