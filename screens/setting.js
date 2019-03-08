import React from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import ImagePicker from 'react-native-image-picker';

// This import loads the firebase namespace along with all its type information.
import { firebase } from '@firebase/app';

// These imports load individual services into the firebase namespace.
import 'firebase/auth';
import 'firebase/database';

export default class Profile extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      avatarSource: null
    }
    this.currentUser = firebase.auth().currentUser || {};
  }
  selectPhotoTapped = () => {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        console.log("uri: ", response.path);
        let source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source,
        });
      }
    });
  }
  componentDidMount(){

  }
  render(){
    return(
      <View style={styles.container}>
        <TouchableOpacity onPress = {this.selectPhotoTapped}>
          <View
            style={[
              styles.avatar,
              styles.avatarContainer,
              { marginBottom: 20 },
            ]}
          >
            {this.state.avatarSource === null ? (
              <Image style={styles.avatar} source={{uri: 'https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg'}} />
            ) : (
              <Image style={styles.avatar} source={this.state.avatarSource} />
            )}
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1,
    alignItems: 'center',
  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150,
  },
});
