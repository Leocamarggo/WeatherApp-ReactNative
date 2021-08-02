import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Button
} from "react-native";
import * as Location from 'expo-location';
import axios from 'axios';

export default function App() {
  const [ verifLocal, setVerifLocal ] = useState(false);
  const [ previsao, setPrevisao ] = useState(false);

  const getPrevisao = async (lat, long) => {
    const res = await axios.get("http://api.openweathermap.org/data/2.5/weather", {
      params: {
        lat: lat,
        lon: long,
        appid: 'a0e01d2025bc951eb6d345d84f67c178',
        lang: 'pt',
        units: 'metric'
      }
    });
    setPrevisao(res.data);
  }


  const buscarCoord = () => {
    Location.installWebGeolocationPolyfill()
    navigator.geolocation.getCurrentPosition(
      position => {
        getPrevisao(position.coords.latitude, position.coords.longitude);
        setVerifLocal(true);
      },
      error => Alert.alert(error.message)
    );
  }

  if (verifLocal === false) {
    return (
      <View style={styles.container}>
        <Button
          title="Utilizar localização atual"
          onPress={buscarCoord}
          color='#6200ee'
        />
      </View>
    )
  }else if(previsao === false){
    return(
      <View style={styles.container02}>
        <Text style={styles.welcome}>Carregando...</Text>
      </View>
    )
  }else {
    const tempAtual = Number(previsao['main']['temp']).toFixed(0);
    const tempMax = Number(previsao['main']['temp_max']).toFixed(0);
    const tempMin = Number(previsao['main']['temp_min']).toFixed(0);

    return(
      <View style={styles.container02}>
          <Text style={styles.welcome}>{previsao['name']}</Text>
          <Text>Clima: {previsao["weather"][0]['description']}</Text>
          <Text>Temp atual: {tempAtual}°</Text>
          <Text>Temp máxima: {tempMax}°</Text>
          <Text>Temp minima: {tempMin}°</Text>
          <Text>Pressão: {previsao['main']['pressure']} hpa</Text>
          <Text>Humidade: {previsao['main']['humidity']}%</Text>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    margin: 10
  },
  container02: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'center'
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
