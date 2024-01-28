import React from "react";
import { Input, Icon, HStack } from "native-base";
import { StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

function SearchScreenHeader({
  hasFilter,
  onSearch,
  onSetQuery,
  onSetIsFilterOpen,
  onSetFilters,
}: {
  hasFilter: boolean;
  onSearch: (value: boolean) => void;
  onSetQuery: (value: string | null) => void;
  onSetIsFilterOpen: (callback: (value: boolean) => boolean) => void;
  onSetFilters: (value: object | null) => void;
}) {
  return (
    <HStack
      space={2}
      width="100%"
      alignSelf="center"
      justifyContent="center"
      alignItems="center"
      paddingBottom={2}
      paddingLeft={6}
      paddingRight={6}
      borderBottomWidth={1}
      borderBottomColor="#CACCCE"
    >
      <Input
        placeholder="Search recipes..."
        width={hasFilter ? "72%" : "83%"}
        height={9}
        variant="rounded"
        fontSize="14"
        onChangeText={(text) => {
          const searchQuery = text === "" ? null : text;
          onSetQuery(searchQuery);
        }}
      />
      <TouchableOpacity
        style={styles.touchableOpacity}
        onPress={() => onSearch(true)}
      >
        <Icon size="6" color="gray.500" as={<MaterialIcons name="search" />} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.touchableOpacity}
        onPress={() => {
          onSetIsFilterOpen((prevIsFilterOpen) => !prevIsFilterOpen);
        }}
      >
        <Icon size="6" color="gray.500" as={<MaterialIcons name="tune" />} />
      </TouchableOpacity>
      {hasFilter && (
        <TouchableOpacity
          style={styles.touchableOpacity}
          onPress={() => {
            onSetFilters(null);
          }}
        >
          <Icon size="6" color="gray.500" as={<MaterialIcons name="clear" />} />
        </TouchableOpacity>
      )}
    </HStack>
  );
}

const styles = StyleSheet.create({
  touchableOpacity: {
    padding: 4,
    borderColor: "#CACCCE",
    borderWidth: 1,
    borderRadius: 100,
  },
});

export default SearchScreenHeader;
