import { View, Text, ScrollView, FlatList, RefreshControl } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import useAppwrite from "../../lib/useAppwrite";
import { getUserLikedPosts } from "../../lib/appwrite";
import VideoCard from "../../components/VideoCard";
import InfoBox from "../../components/InfoBox";
import EmptyState from "../../components/EmptyState";
import { useGlobalContext } from "../../context/GlobalProvider";
import SearchInput from "../../components/SearchInput";

const Bookmark = () => {
  const { user, setUser, setLoggedIn } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(() => getUserLikedPosts(user?.$id));
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }
  return (
    <SafeAreaView className="bg-primary h-full">
        <FlatList
          data={posts}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => <VideoCard video={item} />}
          ListHeaderComponent={() => (
            <View className="my-6 px-4 space-y-6">
              <View className="justify-between items-start flex-row mb-6">
                <View>
                  <Text className="text-2xl font-psemibold text-white">Liked Videos</Text>
                </View>
              </View>
              <SearchInput />
            </View>
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title="No Liked Videos"
              subtitle="No videos liked by you"
            />
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
    </SafeAreaView>
  );
};

export default Bookmark;
