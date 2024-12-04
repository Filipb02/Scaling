import {useEffect, useState} from 'react';
import {
  NativeModules,
  Platform,
  Dimensions,
  PixelRatio,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import {getModel, getDeviceId} from 'react-native-device-info';

const getDiagonalLength = async () => {
  if (Platform.OS === 'android') {
    const {SizeHelper} = NativeModules;
    return Number(((await SizeHelper.getScreenSize()) || 0).toFixed(2));
  }
  return 0;
};

const calculateppmm = (width, height, length) => {
  return Math.sqrt(width ** 2 + height ** 2) / length;
};

export function TEST() {
  const width = Dimensions.get('screen').width;
  const height = Dimensions.get('screen').height;
  const pixelDensity = PixelRatio.get();

  const [deviceData, setDeviceData] = useState({
    model: '',
    deviceId: '',
    os: Platform.OS,
    dimensions: {
      width: width * pixelDensity,
      height: height * pixelDensity,
      diagonalLength: 0,
    },
    pixelfor1mm: 0,
    mmfor1Pixel: 0,
    deviceOffset: 0,
  });

  useEffect(() => {
    const fetchDiagonalLength = async () => {
      try {
        const length = await getDiagonalLength();
        const ppmm = calculateppmm(
          deviceData.dimensions.width,
          deviceData.dimensions.height,
          length,
        );
        const model = getModel();
        const deviceId = getDeviceId();
        const modData = {
          ...deviceData,
          model,
          deviceId,
          dimensions: {
            ...deviceData.dimensions,
            diagonalLength: length,
          },
          pixelfor1mm: ppmm,
          mmfor1Pixel: 1 / ppmm,
        };
        console.log(modData);
        setDeviceData(modData);
      } catch (err) {
        console.log('Error: ', err);
      }
    };

    fetchDiagonalLength();
  }, []);

  useEffect(() => {
    if (deviceData.pixelfor1mm && deviceData.dimensions.height) {
      const updatedDeviceOffset =
        (deviceData.mmfor1Pixel * deviceData.dimensions.height) / 2 - 62;
      setDeviceData(prevData => ({
        ...prevData,
        deviceOffset: updatedDeviceOffset,
      }));
    }
  }, [deviceData.pixelfor1mm, deviceData.dimensions.height]);

  const calculatePixelDistanceBetweenCircles = () => {
    const marginInPixels =
      ((62 * deviceData.pixelfor1mm) / PixelRatio.get()) + (deviceData.deviceOffset > 0 ? -deviceData.deviceOffset * deviceData.pixelfor1mm : deviceData.deviceOffset * deviceData.pixelfor1mm) / PixelRatio.get() - 50;
    return marginInPixels;
  };

  const pixelDistanceBetweenCircles = calculatePixelDistanceBetweenCircles();

  const styles = StyleSheet.create({
    circle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 2,
      borderRadius: 50,
      borderColor: 'black',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    innerCircle: {
      width: 10,
      height: 10,
      borderRadius: 15,
      backgroundColor: 'black',
    },
    circleContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
  });

  return (
    <View>
      <View style={styles.circleContainer}>
        <View style={[styles.circle, {marginRight: pixelDistanceBetweenCircles / 2}]}>
          <View style={styles.innerCircle}></View>
        </View>
        <View style={[styles.circle, {marginLeft: pixelDistanceBetweenCircles / 2}]}>
          <View style={styles.innerCircle}></View>
        </View>
      </View>
      <Text>{deviceData.os}</Text>
      <Text>{deviceData.model}</Text>
      <Text>{deviceData.deviceId}</Text>
      <Text>PPMM: {deviceData.pixelfor1mm}</Text>
      <Text>{deviceData.mmfor1Pixel}</Text>
      <Text>Devices Offset: {deviceData.deviceOffset}</Text>
      <Text>
        {deviceData.dimensions.height}x{deviceData.dimensions.width}
      </Text>
      <Text>{deviceData.dimensions.diagonalLength}mm</Text>
    </View>
  );
}
