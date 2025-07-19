import PostComposer from '@/components/PostComposer'
import PostsList from '@/components/PostsList'
import SignOutButton from '@/components/SignOutButton'
import { usePosts } from '@/hooks/usePosts'
import { useUserSync } from '@/hooks/useUserSync'
import { useState } from 'react'
import { RefreshControl, ScrollView, View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import OfflineIndicator from '@/components/OfflineIndicator'


const HomeScreen = () => { 
	const [isRefetching, setIsRefetching] = useState(false);
	const { refetch: refetchPosts } = usePosts();

	const handlePullToRefresh = async () => {
		setIsRefetching(true);

		await refetchPosts();
		setIsRefetching(false);
	};
	
	
	useUserSync();
	
		return (
		 <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
			<OfflineIndicator />
			<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
				<Text style={{ fontSize: 20, fontWeight: '700' as const, color: '#111827' }}>
					Home
				</Text>
				<SignOutButton />
			</View>

			<ScrollView
				showsVerticalScrollIndicator={false}
				style={{ flex: 1 }}
				contentContainerStyle={{ paddingBottom: 80 }}
				refreshControl={
					<RefreshControl
						refreshing={isRefetching}
						onRefresh={handlePullToRefresh}
						tintColor="#3b82f6"
					/>
				}
			>
				<PostComposer />
				<PostsList />
			</ScrollView>
		 </SafeAreaView>
		)
	 }

export default HomeScreen