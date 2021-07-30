import React, {Component} from 'react';
import {Button, Image, StyleSheet, View} from 'react-native';
import {captureScreen} from 'react-native-view-shot';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      imageURL:
        'https://raw.githubusercontent.com/retrogeek46/snipshare/master/app/Resources/icon.ico',
    };

    window.navigator.userAgent = 'react-native';
    const io = require('socket.io-client');
    this.socket = io('http://192.168.1.4:3456', {
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('connected!');
    });

    this.socket.on('snipShare', msg => {
      console.log('received message');
      this.setState({imageURL: msg});
    });
  }

  takeScreenShot = () => {
    captureScreen({
      format: 'png',
      quality: 0.7,
      result: 'data-uri',
    }).then(
      uri => {
        this.socket.emit('fromClient', uri);
      },
      error => console.error('Oops, snapshot failed', error),
    );
  };

  render() {
    return (
      <View>
        <View>
          <Image
            source={{
              uri: this.state.imageURL,
            }}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{width: 416, height: 833}}
          />
        </View>
        <View style={styles.floatingMenuButtonStyle}>
          <Button
            // style={styles.button}
            onPress={() => {
              // eslint-disable-next-line no-alert
              alert('You tapped the button!');
              this.takeScreenShot();
            }}
            title="Press Me"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  floatingMenuButtonStyle: {
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 0,
    // position: 'absolute',
    // bottom: 100,
    // left: 10,
  },
});
