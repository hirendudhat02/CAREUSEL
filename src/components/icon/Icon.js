import {TouchableOpacity} from 'react-native';
import React from 'react';
import {images} from '../../assets';
import Image from 'react-native-scalable-image';

const Icon = ({name, size, onPress, height, style, disabled, tintColor}) => {
  return (
    <TouchableOpacity
      style={style}
      onPress={onPress}
      activeOpacity={0.5}
      disabled={disabled}>
      {name ? (
        <Image
          source={images[name]}
          width={size}
          height={height}
          style={{tintColor: tintColor ? tintColor : null}}
        />
      ) : null}
    </TouchableOpacity>
  );
};

export default Icon;
