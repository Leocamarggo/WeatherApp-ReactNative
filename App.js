import React, { useState, useEffect, } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Button,
  TouchableOpacity
} from "react-native";
import * as Location from 'expo-location';
import axios from 'axios';

export default function App() {
  const [ verifLocal, setVerifLocal ] = useState(false);
  const [ prevAtual, setPrevAtual ] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false)

  const getAtual = async (lat, long) => {
    const res = await axios.get("http://api.openweathermap.org/data/2.5/weather", {
      params: {
        lat: lat,
        lon: long,
        appid: 'a0e01d2025bc951eb6d345d84f67c178',
        lang: 'pt',
        units: 'metric'
      }
    });
    setPrevAtual(res.data);
    console.log(res.data)
  }


  const buscarCoord = () => {
    Location.installWebGeolocationPolyfill()
    navigator.geolocation.getCurrentPosition(
      position => {
        getAtual(position.coords.latitude, position.coords.longitude);
        setVerifLocal(true);
      },
      error => Alert.alert(error.message)
    );
  };

  useEffect(() => {
    buscarCoord();
  }, []);

  const styles = StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: "center",
      alignItems: 'center',
      backgroundColor: darkTheme ? '#232634'  :'#F2F2F2',
    },

    card: {
      borderRadius: 20,
      width: 350,
      height: 250,
      backgroundColor: darkTheme ? '#393e54'  :'#8F8F8F',
    },

    tempAtualView: {
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: 10,
    },
    tempAtualText: {
      fontSize: 70,
      color: darkTheme ? 'white'  : 'black',
    },

    containerEsquerdo:{
      alignItems: 'center',
      marginLeft: 15,
      marginTop: 15,
    },
    text14: {
      color: darkTheme ? 'white'  : 'black',
      fontSize: 14
    },
    text20: {
      color: darkTheme ? 'white'  : 'black',
      fontSize: 20
    },


    themeButton: {
      margin: 10,
      marginLeft: 300,
      alignItems: 'center',
      justifyContent: 'center',
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    themeButtonSquare: {
      backgroundColor: darkTheme ? '#F2F2F2'  :'#cfcfcf', 
      justifyContent: 'center',
      borderRadius: 20,
      marginRight: 20,
      width: 50,
      height: 25,
    },  
    themeButtonCircle:{
      alignSelf: darkTheme ? 'flex-end' : 'flex-start',
      margin: 5,
      width: 20,
      height: 20,
      borderRadius: 50,
      backgroundColor: darkTheme ? '#232634'  :'#F2F2F2', 
    },   
  });

  if(prevAtual === false){
    return(
      <View style={styles.root}>
        <Text>Carregando...</Text>
      </View>
    )
  }else {
    const tempAtual = Number(prevAtual['main']['temp']).toFixed(0);
    const tempMax = Number(prevAtual['main']['temp_max']).toFixed(0);
    const tempMin = Number(prevAtual['main']['temp_min']).toFixed(0);
    const cidade = prevAtual['name'];

    const data = new Date()
    const dia = data.getDate();
    const hora = data.getHours() < 10 ? "0" + data.getHours() : data.getHours();
    const min = data.getMinutes() < 10 ? "0" + data.getMinutes() : data.getMinutes();
    const mes = data.getMonth();
    const mesName = new Array ("janeiro", "fevereiro", "março", "abril", "maio", "junho", "agosto", "outubro", "novembro", "dezembro")
    const dataFormat = `${dia} de ${mesName[(mes-1)]}, ${hora}:${min}`;
    
    

    return(
      <View style={styles.root}>
        <View style={styles.card}>
          <View style={styles.containerEsquerdo}>
            <View style={{marginLeft: -5, alignItems: 'center'}}>
                <Text style={styles.text20}>
                  {cidade}
                </Text>
              
                <Text style={styles.text14}>
                  {dataFormat}
                </Text>
            </View>

            <View style={styles.tempAtualView}>
                <Text style={styles.tempAtualText}>
                  {tempAtual}
                  <Text style={styles.text14}>
                  °C
                  </Text>
                </Text>
                
                <Text style={styles.text14}>{`Max ${tempMax}°/  Min ${tempMin}°`}</Text>
            </View>
          </View>

          <View style={styles.themeButton}>
            <View style={styles.themeButtonSquare}>
              <TouchableOpacity style={styles.themeButtonCircle} onPress={() =>darkTheme ? setDarkTheme(false) : setDarkTheme(true)}></TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    )
  }

}


