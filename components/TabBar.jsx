import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { AntDesign, Feather } from '@expo/vector-icons';

const TabBar = ({ state, descriptors, navigation }) => {
  const primaryColor = '#386BF6';
  const whiteColor = '#ffffff';

  const icons = {
    index: (props) => <AntDesign name="home" size={26} {...props} />, 
    explore: (props) => <Feather name="compass" size={26} {...props} />, 
    create: (props) => <AntDesign name="pluscircleo" size={26} {...props} />, 
    Profile: (props) => <AntDesign name="user" size={26} {...props} />, 
    saved: (props) => <AntDesign name="heart" size={26} {...props} />, 
  };

  // List of allowed tabs
  const allowedTabs = ['index', 'explore', 'create', 'saved', 'Profile'];

  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        if (!allowedTabs.includes(route.name)) return null; // Only render allowed tabs

        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            style={styles.tabbarItem}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            {icons[route.name] &&
              icons[route.name]({
                color: isFocused ? primaryColor : whiteColor,
              })}

            <Text
              style={[
                styles.label,
                { color: 'white' },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    position: 'absolute',
    bottom: 0,
    height: 103,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingVertical: 12,
    elevation: 5, // Android shadow
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tabbarItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    color: 'white',
  },
});

export default TabBar;
