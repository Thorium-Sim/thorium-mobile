import React, { Component } from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";

class MyListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render() {
    const backgroundColor = this.props.selected
      ? "rgba(255,255,255,0.2)"
      : "transparent";
    const textColor = this.props.color;
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={{ width: "100%", backgroundColor }}>
          <Text style={{ color: textColor, fontSize: 24 }}>
            {this.props.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

class MultiSelectList extends React.PureComponent {
  state = { selectedSystem: null };

  _keyExtractor = (item, index) => item.id;

  _onPressItem = id => {
    // updater functions are preferred for transactional updates
    this.props.selectSystem(id);
  };

  _renderItem = ({ item }) => (
    <MyListItem
      {...item}
      onPressItem={item.destroyed ? () => {} : this._onPressItem}
    />
  );

  render() {
    const { systems, selectedSystem } = this.props;
    const filteredSystems = systems
      .filter(s => s.damage.damaged)
      .map(s => ({
        id: s.id,
        title: s.displayName || s.name,
        destroyed: s.damage.destroyed,
        color: s.damage.destroyed
          ? "#777"
          : s.damage.validate
          ? "lightseagreen"
          : s.damage.report
          ? "greenyellow"
          : s.damage.requested
          ? "lightsalmon"
          : "white",
        selected: s.id === selectedSystem
      }));
    return (
      <View
        style={{
          width: "100%",
          paddingTop: 30,
          paddingLeft: 10,
          paddingRight: 10,
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <View
          style={{
            width: "100%",
            borderBottomColor: "rgba(255,255,255,0.3)",
            borderBottomWidth: 1,
            marginBottom: 20
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 30
            }}
          >
            Damaged Systems
          </Text>
        </View>
        <FlatList
          style={{ width: "100%" }}
          data={filteredSystems}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
        />
      </View>
    );
  }
}

export default MultiSelectList;
