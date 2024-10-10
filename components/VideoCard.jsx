import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { icons } from "../constants";
import { ResizeMode, Video } from "expo-av";
import { likedVideosByUser } from "../lib/appwrite";
import { useGlobalContext } from "../context/GlobalProvider";
import { router } from "expo-router";

const VideoCard = ({ video }) => {
  const { user, setUser, setLoggedIn } = useGlobalContext();
  const [play, setPlay] = useState(false);
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    const isLiked = video.likedBy.some((like) => like.$id === user.$id);
    setLiked(isLiked);
  }, [video.likedBy, user.$id]);
  const handleLikedVideos = async (video) => {
    try {
      if (liked) {
        await likedVideosByUser(video, "");
        Alert.alert("Success", "Like removed sucessfully");
        router.push("/bookmark");
      } else {
        await likedVideosByUser(video, user.$id);
        Alert.alert("Success", "Liked sucessfully");
        router.push("/bookmark");
      }
    } catch (error) {
      throw new Error(error);
    }
  };
  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: video.creator.avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {video.title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {video.creator.username}
            </Text>
          </View>
        </View>
        <View className="pt-2">
          <TouchableOpacity onPress={() => handleLikedVideos(video)}>
            <Image
              source={liked ? icons.heartFilled : icons.heartOutline}
              className="p-3 w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
      {play ? (
        <Video
          source={{ uri: video.video }}
          className="w-full h-60 rounded-xl"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
        >
          <Image
            source={{ uri: video.thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
