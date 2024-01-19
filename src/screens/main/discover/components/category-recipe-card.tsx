import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import {
  Text,
  Box,
  VStack,
  HStack,
  IconButton,
  Badge,
  Button,
  Spinner,
} from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { ROUTES } from "../../../../utils/common";
import { handleRecipeActions } from "../../../../utils/functions";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

function CategoryRecipeCard({ item, navigation, onSetLiked, isLikeLoading }) {
  const node = item?.node;

  const userId = useSelector(
    (state: RootState) => state.user.value?.customUserId
  );

  const { mainImage, name, likes, isRecipeLiked } = node;

  if (!node) return;

  const handleRecipeActionClick = async () => {
    if (userId) {
      const response = await handleRecipeActions(userId, node.id);
      onSetLiked(response);
    }
  };

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => {
        navigation.navigate(ROUTES.RECIPE, {
          node: node,
          path: ROUTES.DISCOVER,
        });
      }}
    >
      <Image
        source={{ uri: mainImage }}
        alt="Recipe Image"
        style={styles.backgroundImage}
        placeholder={require("../../../../../assets/backgrounds/fallback.jpeg")}
      />
      <LinearGradient
        colors={["rgba(0, 0, 0, 0.3)", "transparent"]}
        style={styles.fullCardGradient}
        start={{ x: 0.3, y: 0.5 }}
        end={{ x: 1, y: 0 }}
      />
      <VStack justifyContent="space-between" flex={1}>
        <HStack justifyContent="space-between">
          <Badge
            height={6}
            margin={2}
            backgroundColor="white"
            borderRadius={20}
            size="0.5"
          >
            <Text color="black" fontWeight="bold" fontSize="xs">
              50 min
            </Text>
          </Badge>
          <HStack space={3} paddingRight={3} paddingTop={2}>
            {!isLikeLoading ? (
              <Button
                marginTop={-2}
                padding={0}
                isLoading
                variant="ghost"
                spinner={<Spinner color="white" />}
              />
            ) : (
              <HStack alignContent="center" space={1}>
                <TouchableOpacity onPress={() => handleRecipeActionClick()}>
                  <FontAwesome
                    name="heart"
                    size={22}
                    color={isRecipeLiked ? "red" : "white"}
                  />
                </TouchableOpacity>
                <Text color="white" fontWeight="bold">
                  {likes > 0 ? likes : null}
                </Text>
              </HStack>
            )}
            <TouchableOpacity>
              <FontAwesome name="bookmark" size={22} color="white" />
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesome name="share-alt" size={22} color="white" />
            </TouchableOpacity>
          </HStack>
        </HStack>
        <HStack
          justifyContent="space-between"
          paddingTop={1}
          paddingLeft={2}
          paddingRight={2}
        >
          <Box justifyContent="flex-end" padding={1}>
            <Text
              color="white"
              fontWeight="bold"
              fontSize="lg"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {name}
            </Text>
          </Box>
        </HStack>
      </VStack>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 320,
    height: 180,
    marginTop: 5,
    marginLeft: 20,
    borderRadius: 20,
    overflow: "hidden",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  overlayContent: {
    justifyContent: "space-between",
    padding: 2,
    flex: 1,
  },
  fullCardGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 20,
  },
});

export default CategoryRecipeCard;
